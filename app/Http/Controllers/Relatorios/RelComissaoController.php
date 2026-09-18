<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use PDF;
use App\Models\Clientes\Cliente;
use App\Models\Financeiro\Comissao;
use App\Models\Financeiro\ComissaoCadastro;
use App\Models\Financeiro\ComissaoVenda;
use App\Models\Financeiro\Lancamento;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use App\Models\PI\Pi;
use App\Models\User;

class RelComissaoController extends Controller
{
    public function index() {

        return Inertia::render('Relatorios/Comissao/RelComissao');
    }


    public function setRelComissoes(Request $request) {

        session(['ano_sel' => $request->anoId]);
        session(['mes_sel' => $request->mes]);
        session(['agente_sel' => $request->agenteSel]);
        session(['status_sel' => $request->statusSel ?? 'todos']);
        session(['agrupar_sel' => $request->agruparSel ? true : false]);
        


        return response()->json(['success' => true]);
    }

    public function getRelComissoes(Request $request) {

        $dt_atual = Carbon::today()->format('d/m/Y');
        $anoSel = (int)($request->query('anoId') ?? session('ano_sel') ?? 0);
        $mesSel = (int)($request->query('mes') ?? session('mes_sel') ?? 0);
        $agente_sel = $request->query('agenteSel') ?? session('agente_sel');
        $status_sel = $request->query('statusSel') ?? (session('status_sel') ?? 'todos');
        $agrupar = (int)($request->query('agruparSel') ?? (session('agrupar_sel') ? 1 : 0)) === 1;

        if ($anoSel === 0) {
            $anoRowDefault = Ano::where('ano_bisemana', (int)Carbon::today()->format('Y'))->first();
            if (!$anoRowDefault) {
                $anoRowDefault = Ano::orderBy('ano_bisemana', 'desc')->first();
            }
            if ($anoRowDefault) {
                $anoSel = (int)$anoRowDefault->id;
            }
        }
        if ($mesSel === 0) {
            $mesSel = (int)Carbon::today()->format('n');
        }

        $agenteSelId = (int)($agente_sel ?? 0);

        $anoRow = $anoSel ? Ano::find($anoSel) : null;
        $year = $anoRow ? (int)$anoRow->ano_bisemana : 0;
        $mesMap = [
            1 => 'JAN', 2 => 'FEV', 3 => 'MAR', 4 => 'ABR', 5 => 'MAI', 6 => 'JUN',
            7 => 'JUL', 8 => 'AGO', 9 => 'SET', 10 => 'OUT', 11 => 'NOV', 12 => 'DEZ',
        ];
        $periodo = ($mesSel && $year) ? (($mesMap[$mesSel] ?? str_pad((string)$mesSel, 2, '0', STR_PAD_LEFT)).'/'.$year) : '';

        $lansMesQuitados = collect();
        $piIds = [];
        if ($year > 0 && $mesSel > 0) {
            $start = Carbon::create($year, $mesSel, 1, 0, 0, 0)->startOfMonth();
            $end = (clone $start)->endOfMonth();
            $lansMesQuitados = Lancamento::where('status_pagamento', 'QUITADO')
                ->whereNotNull('dt_pagamento_real')
                ->whereBetween('dt_pagamento_real', [$start->format('Y-m-d 00:00:00'), $end->format('Y-m-d 23:59:59')])
                ->get();
            $piIdsQuitados = $lansMesQuitados->pluck('id_reserva')->filter()->unique()->values()->all();

            $bsIdsMes = collect();
            if ($anoRow) {
                $bsDoAno = Bisemana::where('ano_id', (int)$anoRow->id)->get();
                $bsIdsMes = $bsDoAno->filter(function ($bs) use ($mesSel, $year, $start, $end) {
                    $inicio = Carbon::parse($bs->inicio ?? null);
                    $fim = Carbon::parse($bs->fim ?? null);
                    if (!$inicio || !$fim) return false;
                    $bsStart = (clone $inicio)->startOfDay();
                    $bsEnd = (clone $fim)->endOfDay();
                    return $bsStart->lte($end) && $bsEnd->gte($start);
                })->pluck('id')->values()->all();
            }
            $piIdsPorBs = empty($bsIdsMes) ? [] : Pi::whereIn('id_bisemana', $bsIdsMes)->pluck('id')->filter()->unique()->values()->all();

            $piIds = array_values(array_unique(array_merge($piIdsQuitados, $piIdsPorBs)));
        }

        if (empty($piIds)) {
            $pis = [];
        } else {
            $pis = Pi::whereIn('id', $piIds)->get()->toArray();
        }

        $allLansPi = Lancamento::whereIn('id_reserva', $piIds)->get()->groupBy('id_reserva');
        $isRecebida = function($piId) use ($allLansPi) {
            $ls = $allLansPi->get($piId, collect());
            if ($ls->isEmpty()) return false;
            return $ls->every(fn($l) => ($l->status_pagamento ?? 'PENDENTE') === 'QUITADO');
        };

        $comissoesQ = empty($piIds) ? ComissaoVenda::whereRaw('0 = 1') : ComissaoVenda::whereIn('pi_id', $piIds);
        if ($agenteSelId !== 0) {
            $comissoesQ->where(function ($q) use ($agenteSelId) {
                $q->where(function ($q2) use ($agenteSelId) {
                    $q2->whereNotNull('pessoa_tipo')
                       ->whereRaw("( (pessoa_tipo = 'cliente' AND pessoa_id = {$agenteSelId}) OR (pessoa_tipo = 'user' AND pessoa_id = {$agenteSelId}) )");
                })
                ->orWhere('agente_id', $agenteSelId);
            });
        }
        $comissoesRaw = $comissoesQ->get();

        $usuariosMap = User::where('active', 1)->get()->keyBy('id')->map(fn($u) => trim((string)$u->name));
        $clientesMapAll = Cliente::all()->keyBy('id')->map(fn($c) => trim((string)($c->nome_fantasia ?: $c->razao_social)));
        $comissoesNovaMap = ComissaoCadastro::whereNull('deleted_at')->get()->keyBy('id');
        $comissoesLegadaMap = Comissao::with('servico')->get()->keyBy('id');

        $comissoes = hidratarComissoesLegadoNovo($comissoesRaw, [
            'usuariosMap'        => $usuariosMap,
            'clientesMap'        => $clientesMapAll,
            'comissoesNovaMap'   => $comissoesNovaMap,
            'comissoesLegadaMap' => $comissoesLegadaMap,
        ]);

        if ($status_sel !== 'todos') {
            $comissoes = collect($comissoes)->filter(function($c) use ($status_sel, $isRecebida) {
                return $status_sel === 'recebidos' ? $isRecebida($c['pi_id']) : !$isRecebida($c['pi_id']);
            })->values()->all();
        }

        $chavesVistas = [];
        $comissoesDedup = [];
        foreach ($comissoes as $c) {
            $chaveBenef = $c['beneficiario_chave_logica'] ?? ((int)($c['agente_id'] ?? 0));
            $chaveDef   = $c['comissao_definicao_id']   ?? ((int)($c['comissao_id'] ?? 0));
            $ch = (string)$chaveBenef.'|'.(int)$chaveDef.'|'.(int)($c['pi_id'] ?? 0);
            if (isset($chavesVistas[$ch])) {
                continue;
            }
            $chavesVistas[$ch] = true;
            $comissoesDedup[] = $c;
        }
        $comissoes = $comissoesDedup;

        $totais = collect($comissoes)->reduce(function($acc, $c) use ($isRecebida) {
            if (!empty($c['pi_id']) && $isRecebida($c['pi_id'])) {
                $acc['recebidos'] += (float)$c['valor_comissao'];
            } else {
                $acc['a_receber'] += (float)$c['valor_comissao'];
            }
            return $acc;
        }, ['recebidos' => 0.0, 'a_receber' => 0.0]);

        $pisMap = collect($pis)->keyBy('id');

        $parcelasPorPi = [];
        $parcelasUnicasPorPi = [];
        foreach ($allLansPi as $piId => $lans) {
            $piIdInt = (int)$piId;
            $soma = 0.0;
            $unicas = [];
            foreach ($lans as $l) {
                $lId = (int)($l->id ?? 0);
                $vl = (float)($l->valor ?? 0);
                $soma += $vl;
                $unicas[$lId] = [
                    'valor' => $vl,
                    'parcelas' => $l->parcelas ?? null,
                    'dt_faturamento' => $l->dt_faturamento ?? null,
                    'dt_pagamento_real' => $l->dt_pagamento_real ?? null,
                    'status_pagamento' => $l->status_pagamento ?? 'PENDENTE',
                ];
            }
            $parcelasPorPi[$piIdInt] = $soma;
            $parcelasUnicasPorPi[$piIdInt] = $unicas;
        }

        $clientesMap = Cliente::whereIn('id', $pisMap->pluck('id_cliente')->filter()->unique()->values()->all())
            ->get()
            ->keyBy('id');

        $agenteIdsLegado = collect($comissoes)->pluck('agente_id')->filter()->unique()->values()->all();
        $beneficiarioIds = collect($comissoes)->pluck('beneficiario_id_real')->filter()->unique()->values()->all();
        $agenteIds = array_values(array_unique(array_merge($agenteIdsLegado, $beneficiarioIds)));
        if ($agenteSelId) {
            $agenteIds[] = $agenteSelId;
            $agenteIds = array_values(array_unique($agenteIds));
        }
        $agentesDb = Cliente::whereIn('id', $agenteIds)->get()->keyBy('id');

        $comissaoIdsLegado = collect($comissoes)->pluck('comissao_id')->filter()->unique()->values()->all();
        $comissaoIdsDef = collect($comissoes)->pluck('comissao_definicao_id')->filter()->unique()->values()->all();
        $comissaoIds = array_values(array_unique(array_merge($comissaoIdsLegado, $comissaoIdsDef)));
        $defs = Comissao::with('servico')->whereIn('id', $comissaoIds)->get()->keyBy('id');

        $agentesMap = $agentesDb->mapWithKeys(function ($a) {
            $nome = trim((string)($a->nome_fantasia ?: $a->razao_social));
            return [(int)$a->id => $nome];
        });
        foreach ($usuariosMap as $uid => $uname) {
            $agentesMap->put((int)$uid, trim((string)$uname));
        }
        $agenteSelNome = $agenteSelId ? ($agentesMap->get($agenteSelId) ?: '') : '';
        $showAgenteCol = $agenteSelId === 0;

        $linhas = [];
        foreach ($comissoes as $c) {
            $piId = (int)($c['pi_id'] ?? 0);
            if (!$piId) {
                continue;
            }
            $pi = $pisMap->get($piId);
            if (!$pi) {
                continue;
            }
            $cli = $clientesMap->get($pi['id_cliente'] ?? null);
            $clienteNome = '';
            if ($cli) {
                $clienteNome = trim((string)($cli->nome_fantasia ?: $cli->razao_social));
            } else {
                $clienteNome = trim((string)($pi['cliente'] ?? ''));
            }

            $benefNome = trim((string)($c['beneficiario_nome'] ?? ''));
            if ($benefNome === '' || $benefNome === '—') {
                $benefNome = (string)($agentesMap->get((int)($c['agente_id'] ?? 0)) ?: '');
            }

            $tipoServico = trim((string)($c['comissao_nome'] ?? ''));
            if ($tipoServico === '') {
                $def = $defs->get((int)($c['comissao_id'] ?? 0));
                $tipoServico = $def && $def->servico ? ($def->servico->nome ?? '') : '';
            }

            $percentLabel = trim((string)($c['comissao_percent_label'] ?? ''));
            if ($percentLabel === '' || $percentLabel === '—') {
                $def = $defs->get((int)($c['comissao_id'] ?? 0));
                $percentLabel = '—';
                if ($def) {
                    if ((int)$def->tipo_comissao === 1) {
                        $percentLabel = rtrim(rtrim(number_format((float)$def->valor, 2, ',', '.'), '0'), ',').'%';
                    } else {
                        $percentLabel = 'Fixo';
                    }
                }
            }

            $listaLanc = $allLansPi->get($piId, collect())->sortBy(function ($l) {
                $p = (string)($l->parcelas ?? '');
                if (strpos($p, '/') !== false) {
                    $i = (int)explode('/', $p)[0];
                    return $i;
                }
                return 0;
            })->values();

            $valorComissaoTotal = (float)($c['valor_comissao'] ?? 0);
            if ($listaLanc->isEmpty()) {
                $linhas[] = [
                    'percent' => $percentLabel,
                    'pi' => $piId,
                    'parcela' => $c['parcelas'] ?? '—',
                    'cliente' => $clienteNome,
                    'agente' => $benefNome,
                    'data_pagamento' => null,
                    'valor_parcela' => null,
                    'valor_comissao' => $valorComissaoTotal,
                    'tipo' => $tipoServico,
                ];
                continue;
            }

            $incluirSomenteQuitados = ($status_sel === 'recebidos');
            $totalPi = (float)$listaLanc->sum(function ($l) { return (float)($l->valor ?? 0); });
            $incluiuAlguma = false;
            foreach ($listaLanc as $l) {
                $vp = (float)($l->valor ?? 0);
                $ratio = $totalPi > 0 ? ($vp / $totalPi) : (1 / max(1, $listaLanc->count()));
                $dataVencimento = $l->dt_faturamento ?? null;
                $dataRealPagto = $l->dt_pagamento_real ?? null;
                $statusLan = (string)($l->status_pagamento ?? 'PENDENTE');
                $ehQuitado = $statusLan === 'QUITADO';
                if ($incluirSomenteQuitados && !$ehQuitado) {
                    continue;
                }
                $incluiuAlguma = true;
                $linhas[] = [
                    'percent' => $percentLabel,
                    'pi' => $piId,
                    'parcela' => $l->parcelas ?? '',
                    'cliente' => $clienteNome,
                    'agente' => $benefNome,
                    'vencimento' => $dataVencimento,
                    'data_pagamento' => $ehQuitado ? ($dataRealPagto ?? $dataVencimento) : null,
                    'data_pagamento_real' => $dataRealPagto,
                    'valor_parcela' => $vp,
                    'valor_comissao' => $valorComissaoTotal * $ratio,
                    'tipo' => $tipoServico,
                ];
            }
            if (!$incluiuAlguma && !$incluirSomenteQuitados) {
                $linhas[] = [
                    'percent' => $percentLabel,
                    'pi' => $piId,
                    'parcela' => $c['parcelas'] ?? '—',
                    'cliente' => $clienteNome,
                    'agente' => $benefNome,
                    'data_pagamento' => null,
                    'valor_parcela' => null,
                    'valor_comissao' => $valorComissaoTotal,
                    'tipo' => $tipoServico,
                ];
            }
        }

        if ($agrupar) {
            $linhas = collect($linhas)
                ->groupBy(function ($l) use ($showAgenteCol) {
                    $k = ($l['percent'] ?? '—').'|'.($l['pi'] ?? 0);
                    if ($showAgenteCol) {
                        $k .= '|'.($l['agente'] ?? '');
                    }
                    return $k;
                })
                ->map(function ($items) use ($parcelasPorPi, $parcelasUnicasPorPi) {
                    $first = $items->first();
                    $piId = (int)($first['pi'] ?? 0);
                    $minVenc = $items->pluck('vencimento')->filter()->min();
                    $minPagtoReal = $items->pluck('data_pagamento_real')->filter()->min();
                    if (!$minPagtoReal) {
                        $minPagtoReal = $items->pluck('data_pagamento')->filter()->min();
                    }
                    $unicasLan = $parcelasUnicasPorPi[$piId] ?? [];
                    $quitadosIds = [];
                    foreach ($unicasLan as $lid => $ldata) {
                        $st = (string)($ldata['status_pagamento'] ?? 'PENDENTE');
                        if ($st === 'QUITADO') $quitadosIds[$lid] = true;
                    }
                    if (count($quitadosIds) > 0) {
                        $sumParcela = 0.0;
                        foreach ($unicasLan as $lid => $ldata) {
                            if (isset($quitadosIds[$lid])) {
                                $sumParcela += (float)($ldata['valor'] ?? 0);
                            }
                        }
                    } else {
                        $sumParcela = (float)($parcelasPorPi[$piId] ?? 0);
                    }
                    $sumCom = (float)$items->sum(function ($i) { return (float)($i['valor_comissao'] ?? 0); });
                    $parcelasArr = [];
                    if (count($quitadosIds) > 0) {
                        foreach ($unicasLan as $lid => $ldata) {
                            if (isset($quitadosIds[$lid])) {
                                $p = trim((string)($ldata['parcelas'] ?? ''));
                                if ($p !== '' && $p !== '—') $parcelasArr[] = $p;
                            }
                        }
                    }
                    if (count($parcelasArr) === 0) {
                        $parcelasArr = $items->pluck('parcela')
                            ->filter(function ($p) {
                                $p = trim((string)$p);
                                return $p !== '' && $p !== '—';
                            })
                            ->unique()
                            ->values()
                            ->all();
                    } else {
                        $parcelasArr = array_values(array_unique($parcelasArr));
                    }
                    usort($parcelasArr, function ($a, $b) {
                        $a = trim((string)$a);
                        $b = trim((string)$b);
                        $pa = strpos($a, '/') !== false ? array_map('intval', explode('/', $a, 2)) : [PHP_INT_MAX, PHP_INT_MAX];
                        $pb = strpos($b, '/') !== false ? array_map('intval', explode('/', $b, 2)) : [PHP_INT_MAX, PHP_INT_MAX];
                        if ($pa[1] === $pb[1]) {
                            return $pa[0] <=> $pb[0];
                        }
                        return $pa[1] <=> $pb[1];
                    });
                    $parcelaLabel = empty($parcelasArr) ? '—' : implode(', ', $parcelasArr);
                    $agente = trim((string)($first['agente'] ?? ''));
                    if ($agente === '') {
                        $agentes = $items->pluck('agente')->filter()->unique()->values();
                        if ($agentes->count() > 1) $agente = 'Vários';
                        elseif ($agentes->count() === 1) $agente = (string)$agentes->first();
                    }
                    $tipos = $items->pluck('tipo')->filter(function ($t) {
                        return trim((string)$t) !== '';
                    })->map(function ($t) {
                        return trim((string)$t);
                    })->unique()->values();
                    $tipoLabel = '—';
                    if ($tipos->count() > 1) {
                        $tipoLabel = 'Vários';
                    } elseif ($tipos->count() === 1) {
                        $tipoLabel = (string)$tipos->first();
                    }
                    return [
                        'percent' => $first['percent'] ?? '—',
                        'pi' => $piId,
                        'parcela' => $parcelaLabel,
                        'cliente' => $first['cliente'] ?? '',
                        'agente' => $agente,
                        'vencimento' => $minVenc,
                        'data_pagamento' => $minPagtoReal,
                        'data_pagamento_real' => $minPagtoReal,
                        'valor_parcela' => $sumParcela > 0 ? $sumParcela : null,
                        'valor_comissao' => $sumCom,
                        'tipo' => $tipoLabel,
                    ];
                })
                ->values()
                ->all();
        }

        $grupos = collect($linhas)
            ->sortBy(function ($l) {
                $p = (string)($l['percent'] ?? '—');
                if (str_ends_with($p, '%')) {
                    return (float)str_replace(['.','%'], ['', ''], str_replace(',', '.', $p));
                }
                return 9999;
            })
            ->groupBy('percent')
            ->all();


        $pdf = PDF::loadView('relatorios.comissao.rel_comissoes', [
            'dt_atual' => $dt_atual,
            'totais' => $totais,
            'agrupar' => $agrupar,
            'status_sel' => $status_sel,
            'agente_nome' => $agenteSelNome,
            'show_agente_col' => $showAgenteCol,
            'periodo' => $periodo,
            'grupos' => $grupos,
        ]);
        return $pdf->setPaper('a4', 'landscape')->stream('Rel-Comissoes.pdf');
    }
}
