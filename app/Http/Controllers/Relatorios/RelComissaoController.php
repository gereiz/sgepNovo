<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use PDF;
use App\Models\Clientes\Cliente;
use App\Models\Financeiro\Comissao;
use App\Models\Financeiro\ComissaoVenda;
use App\Models\Financeiro\Lancamento;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use App\Models\PI\Pi;

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
        $anoSel = (int)($request->query('anoId') ?? session('ano_sel'));
        $mesSel = (int)($request->query('mes') ?? session('mes_sel'));
        $agente_sel = $request->query('agenteSel') ?? session('agente_sel');
        $status_sel = $request->query('statusSel') ?? (session('status_sel') ?? 'todos');
        $agrupar = (int)($request->query('agruparSel') ?? (session('agrupar_sel') ? 1 : 0)) === 1;

        $agenteSelId = (int)($agente_sel ?? 0);

        $anoRow = $anoSel ? Ano::find($anoSel) : null;
        $year = $anoRow ? (int)$anoRow->ano_bisemana : 0;
        $mesMap = [
            1 => 'JAN', 2 => 'FEV', 3 => 'MAR', 4 => 'ABR', 5 => 'MAI', 6 => 'JUN',
            7 => 'JUL', 8 => 'AGO', 9 => 'SET', 10 => 'OUT', 11 => 'NOV', 12 => 'DEZ',
        ];
        $periodo = ($mesSel && $year) ? (($mesMap[$mesSel] ?? str_pad((string)$mesSel, 2, '0', STR_PAD_LEFT)).'/'.$year) : '';

        $bisemanaIds = [];
        if ($anoSel && $mesSel) {
            $bisemanaIds = Bisemana::where('ano_id', $anoSel)
                ->get()
                ->filter(function ($bs) use ($mesSel) {
                    try {
                        $mIni = (int)Carbon::parse($bs->inicio)->format('n');
                        $mFim = (int)Carbon::parse($bs->fim)->format('n');
                        return $mIni === (int)$mesSel || $mFim === (int)$mesSel;
                    } catch (\Throwable $e) {
                        return false;
                    }
                })
                ->pluck('id')
                ->values()
                ->toArray();
        }
        if (empty($bisemanaIds) && $year && $mesSel) {
            $bisemanaIds = Bisemana::query()
                ->get()
                ->filter(function ($bs) use ($mesSel, $year) {
                    try {
                        $ini = Carbon::parse($bs->inicio);
                        $fim = Carbon::parse($bs->fim);
                        $matchIni = ((int)$ini->format('Y') === (int)$year) && ((int)$ini->format('n') === (int)$mesSel);
                        $matchFim = ((int)$fim->format('Y') === (int)$year) && ((int)$fim->format('n') === (int)$mesSel);
                        return $matchIni || $matchFim;
                    } catch (\Throwable $e) {
                        return false;
                    }
                })
                ->pluck('id')
                ->values()
                ->toArray();
        }

        $pis = [];
        if (!empty($bisemanaIds)) {
            $pis = Pi::whereIn('id_bisemana', $bisemanaIds)->get()->toArray();
        }

        $piIds = collect($pis)->pluck('id')->filter()->unique()->values()->all();
        $lans = Lancamento::whereIn('id_reserva', $piIds)->get()->groupBy('id_reserva');
        $isRecebida = function($piId) use ($lans) {
            $ls = $lans->get($piId, collect());
            if ($ls->isEmpty()) return false;
            return $ls->every(fn($l) => ($l->status_pagamento ?? 'PENDENTE') === 'QUITADO');
        };

        $comissoesQ = ComissaoVenda::whereIn('pi_id', $piIds);
        if ($agenteSelId !== 0) {
            $comissoesQ->where('agente_id', $agenteSelId);
        }
        $comissoes = $comissoesQ->get()->toArray();

        // Filtra por status de recebimento, se necessário
        if ($status_sel !== 'todos') {
            $comissoes = collect($comissoes)->filter(function($c) use ($status_sel, $isRecebida) {
                return $status_sel === 'recebidos' ? $isRecebida($c['pi_id']) : !$isRecebida($c['pi_id']);
            })->values()->all();
        }

        // Deduplica combinações iguais (agente, comissao, pi, valor)
        $comissoes = collect($comissoes)->unique(function ($c) {
            $valor = number_format((float)($c['valor_comissao'] ?? 0), 2, '.', '');
            return ($c['agente_id'] ?? '0').'|'.($c['comissao_id'] ?? '0').'|'.($c['pi_id'] ?? '0').'|'.$valor;
        })->values()->all();

        // Totalizadores Recebidos x A Receber (valores de comissão)
        $totais = collect($comissoes)->reduce(function($acc, $c) use ($isRecebida) {
            if (!empty($c['pi_id']) && $isRecebida($c['pi_id'])) {
                $acc['recebidos'] += (float)$c['valor_comissao'];
            } else {
                $acc['a_receber'] += (float)$c['valor_comissao'];
            }
            return $acc;
        }, ['recebidos' => 0.0, 'a_receber' => 0.0]);

        $pisMap = collect($pis)->keyBy('id');
        $clientesMap = Cliente::whereIn('id', $pisMap->pluck('id_cliente')->filter()->unique()->values()->all())
            ->get()
            ->keyBy('id');

        $agenteIds = collect($comissoes)->pluck('agente_id')->filter()->unique()->values()->all();
        if ($agenteSelId) {
            $agenteIds[] = $agenteSelId;
        }
        $agentesDb = Cliente::whereIn('id', array_values(array_unique($agenteIds)))->get()->keyBy('id');

        $comissaoIds = collect($comissoes)->pluck('comissao_id')->filter()->unique()->values()->all();
        $defs = Comissao::with('servico')->whereIn('id', $comissaoIds)->get()->keyBy('id');

        $agentesMap = $agentesDb->mapWithKeys(function ($a) {
            $nome = trim((string)($a->nome_fantasia ?: $a->razao_social));
            return [(int)$a->id => $nome];
        });
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

            $def = $defs->get((int)($c['comissao_id'] ?? 0));
            $tipoServico = $def && $def->servico ? ($def->servico->nome ?? '') : '';
            $percentLabel = '—';
            if ($def) {
                if ((int)$def->tipo_comissao === 1) {
                    $percentLabel = rtrim(rtrim(number_format((float)$def->valor, 2, ',', '.'), '0'), ',').'%';
                } else {
                    $percentLabel = 'Fixo';
                }
            }

            $listaLanc = $lans->get($piId, collect())->sortBy(function ($l) {
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
                    'agente' => $agentesMap->get((int)($c['agente_id'] ?? 0)) ?: '',
                    'data_pagamento' => null,
                    'valor_parcela' => null,
                    'valor_comissao' => $valorComissaoTotal,
                    'tipo' => $tipoServico,
                ];
                continue;
            }

            $totalPi = (float)$listaLanc->sum(function ($l) { return (float)($l->valor ?? 0); });
            foreach ($listaLanc as $l) {
                $vp = (float)($l->valor ?? 0);
                $ratio = $totalPi > 0 ? ($vp / $totalPi) : (1 / max(1, $listaLanc->count()));
                $dataVencimento = $l->dt_faturamento ?? null;
                $dataRealPagto = $l->dt_pagamento_real ?? null;
                $linhas[] = [
                    'percent' => $percentLabel,
                    'pi' => $piId,
                    'parcela' => $l->parcelas ?? '',
                    'cliente' => $clienteNome,
                    'agente' => $agentesMap->get((int)($c['agente_id'] ?? 0)) ?: '',
                    'vencimento' => $dataVencimento,
                    'data_pagamento' => $dataRealPagto ?? $dataVencimento,
                    'data_pagamento_real' => $dataRealPagto,
                    'valor_parcela' => $vp,
                    'valor_comissao' => $valorComissaoTotal * $ratio,
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
                ->map(function ($items) {
                    $first = $items->first();
                    $minVenc = $items->pluck('vencimento')->filter()->min();
                    $minPagtoReal = $items->pluck('data_pagamento_real')->filter()->min();
                    if (!$minPagtoReal) {
                        $minPagtoReal = $items->pluck('data_pagamento')->filter()->min();
                    }
                    $sumParcela = (float)$items->sum(function ($i) { return (float)($i['valor_parcela'] ?? 0); });
                    $sumCom = (float)$items->sum(function ($i) { return (float)($i['valor_comissao'] ?? 0); });
                    $parcelasArr = $items->pluck('parcela')
                        ->filter(function ($p) {
                            $p = trim((string)$p);
                            return $p !== '' && $p !== '—';
                        })
                        ->unique()
                        ->values()
                        ->all();
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
                        'pi' => $first['pi'] ?? 0,
                        'parcela' => $parcelaLabel,
                        'cliente' => $first['cliente'] ?? '',
                        'agente' => $agente,
                        'vencimento' => $minVenc,
                        'data_pagamento' => $minPagtoReal,
                        'data_pagamento_real' => $minPagtoReal,
                        'valor_parcela' => $sumParcela ?: null,
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
