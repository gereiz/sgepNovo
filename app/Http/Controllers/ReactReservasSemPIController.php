<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Reservas\Reserva;
use App\Models\Clientes\Cliente;
use App\Models\Paineis\Painel;
use App\Models\Bisemanas\Bisemana;
use App\Models\Config\Ano;
use App\Models\User;
use App\Models\PI\Pi;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\UF;
use App\Models\Textos\TextoPadrao;
use App\Models\Financeiro\Comissao;
use App\Models\Financeiro\ComissaoVenda;
use App\Services\Financeiro\CaixaService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;
use PDF;

class ReactReservasSemPIController extends Controller
{
    public function index(Request $request)
    {
        $anoId = (int)($request->query('anoId') ?? 0);
        $bsId  = (int)($request->query('bsId') ?? 0);
        $search = trim((string)($request->query('q') ?? ''));
        $vendedorId = (int)($request->query('vendedorId') ?? 0);

        $anos = Ano::orderByDesc('ano_bisemana')->get(['id', 'ano_bisemana'])->map(function ($a) {
            return ['id' => (int)$a->id, 'ano' => (int)$a->ano_bisemana];
        })->values()->all();

        $anoCorrente = (int)date('Y');
        $anoDefault = null;
        foreach ($anos as $a) {
            if ((int)$a['ano'] === $anoCorrente) { $anoDefault = $a; break; }
        }
        if (!$anoDefault && count($anos) > 0) $anoDefault = $anos[0];
        $anoIdFinal = $anoId > 0 ? $anoId : ($anoDefault ? (int)$anoDefault['id'] : 0);

        $bisemanasTodas = Bisemana::when($anoIdFinal > 0, function ($q) use ($anoIdFinal) {
            return $q->where('ano_id', $anoIdFinal);
        })->orderBy('ano_id')->orderBy('num_bisemana')->get(['id', 'num_bisemana', 'inicio', 'fim', 'ano_id'])->map(function ($b) {
            $ano = $b->ano_id ? (Ano::find($b->ano_id)?->ano_bisemana ?? date('Y')) : date('Y');
            try { $dtIni = Carbon::parse((string)$b->inicio); } catch (\Throwable $e) { $dtIni = Carbon::today(); }
            try { $dtFim = Carbon::parse((string)$b->fim); } catch (\Throwable $e) { $dtFim = Carbon::today(); }
            $label = 'BS ' . ((int)($b->num_bisemana ?? 0)) . ': ' . $dtIni->format('d/m') . ' até ' . $dtFim->format('d/m') . '/' . substr((string)$ano, 0, 4);
            return [
                'id' => (int)$b->id,
                'num_bisemana' => (int)($b->num_bisemana ?? 0),
                'inicio' => $dtIni->format('Y-m-d'),
                'fim'   => $dtFim->format('Y-m-d'),
                'ano_id' => (int)$b->ano_id,
                'year' => (int)substr((string)$ano, 0, 4),
                'label' => $label,
            ];
        })->values()->all();

        $hoje = Carbon::today();
        $bsPadrao = null;
        foreach ($bisemanasTodas as $bs) {
            try {
                $ini = Carbon::parse($bs['inicio']);
                $fim = Carbon::parse($bs['fim']);
                if ($hoje->gte($ini) && $hoje->lte($fim)) { $bsPadrao = $bs; break; }
            } catch (\Throwable $e) {}
        }
        if (!$bsPadrao && count($bisemanasTodas) > 0) {
            foreach ($bisemanasTodas as $bs) {
                try {
                    $fim = Carbon::parse($bs['fim']);
                    if ($fim->gte($hoje)) { $bsPadrao = $bs; break; }
                } catch (\Throwable $e) {}
            }
        }
        if (!$bsPadrao && count($bisemanasTodas) > 0) $bsPadrao = $bisemanasTodas[0];
        $bsIdFinal = $bsId > 0 ? $bsId : ($bsPadrao ? (int)$bsPadrao['id'] : 0);

        $query = Reserva::query()
            ->select([
                'reservas.id as reserva_id',
                'reservas.cliente_id',
                'reservas.outdoor_id',
                'reservas.bisemana_id',
                'reservas.user_id',
                'reservas.campanha',
                'reservas.observacao',
                'reservas.pi_ok',
                'reservas.pi_id',
                'reservas.dt_reserva',
                'c.id as cid',
                'c.razao_social',
                'c.nome_fantasia',
                'c.cpf_cnpj',
                'c.cep',
                'c.endereco as cli_endereco',
                'c.num as cli_num',
                'c.bairro as cli_bairro_id',
                'c.cidade as cli_cidade_id',
                'c.uf as cli_uf_id',
                'c.celular as cli_celular',
                'c.telefone as cli_telefone',
                'c.tel_responsavel as cli_tel_responsavel',
                'c.email as cli_email',
                'c.email_responsavel as cli_email_responsavel',
                'c.nro_insc as cli_nro_insc',
                'c.responsavel as cli_responsavel',
                'bcl.nome as cli_bairro_nome',
                'cid.nome as cidade_nome',
                'uf.sigla as uf_sigla',
                DB::raw('COALESCE(NULLIF(c.celular, ""), NULLIF(c.telefone, ""), "") as fone1'),
                'u.name as user_name',
                'o.identificacao as painel_id',
                'o.logradouro as painel_logradouro',
                'o.numero as painel_num',
            ])
            ->join('clientes as c', 'c.id', '=', 'reservas.cliente_id')
            ->join('users as u', 'u.id', '=', 'reservas.user_id')
            ->join('outdoors as o', 'o.id', '=', 'reservas.outdoor_id')
            ->leftJoin('bairros as bcl', 'bcl.id', '=', 'c.bairro')
            ->leftJoin('cidades as cid', 'cid.id', '=', 'c.cidade')
            ->leftJoin('uf as uf', 'uf.id', '=', 'c.uf')
            ->where('reservas.pi_ok', '=', 0)
            ->where('reservas.bisemana_id', $bsIdFinal);

        if ($vendedorId > 0) $query->where('reservas.user_id', $vendedorId);
        if ($search !== '') {
            $s = '%'.$search.'%';
            $query->where(function (Builder $q2) use ($s) {
                $q2->where('c.razao_social', 'LIKE', $s)
                   ->orWhere('c.nome_fantasia', 'LIKE', $s)
                   ->orWhere('c.cpf_cnpj', 'LIKE', $s)
                   ->orWhere('reservas.campanha', 'LIKE', $s)
                   ->orWhere('o.identificacao', 'LIKE', $s);
            });
        }

        $linhas = $query->orderByDesc('reservas.dt_reserva')->orderBy('c.razao_social')->get();

        $grupos = [];
        foreach ($linhas as $l) {
            $chave = (int)$l->cliente_id . '|' . (int)$l->bisemana_id . '|' . md5((string)$l->campanha);
            $nomeCliente = trim((string)($l->nome_fantasia ?: $l->razao_social));
            if ($nomeCliente === '') $nomeCliente = (string)($l->razao_social ?? 'Cliente');
            $cpfCnpj = preg_replace('/[^0-9]/', '', (string)($l->cpf_cnpj ?? ''));
            if (strlen($cpfCnpj) === 14) {
                $cpfCnpj = substr($cpfCnpj,0,2).'.'.substr($cpfCnpj,2,3).'.'.substr($cpfCnpj,5,3).'/'.substr($cpfCnpj,8,4).'-'.substr($cpfCnpj,12,2);
            } elseif (strlen($cpfCnpj) === 11) {
                $cpfCnpj = substr($cpfCnpj,0,3).'.'.substr($cpfCnpj,3,3).'.'.substr($cpfCnpj,6,3).'-'.substr($cpfCnpj,9,2);
            } else {
                $cpfCnpj = (string)($l->cpf_cnpj ?: '—');
            }
            $fone = (string)($l->fone1 ?? '');
            $email = (string)($l->cli_email ?? '');
            $telResp = (string)($l->cli_tel_responsavel ?? '');
            $emailResp = (string)($l->cli_email_responsavel ?? '');
            $nroInsc = trim((string)($l->cli_nro_insc ?? ''));
            $ufId = (int)($l->cli_uf_id ?? 0);
            $cidadeId = (int)($l->cli_cidade_id ?? 0);
            $enderecoNum = trim(implode(' - ', array_filter([
                (string)($l->cli_endereco ?? ''),
                (string)($l->cli_num ?? ''),
            ])));
            $respNome = trim((string)($l->cli_responsavel ?? ''));
            if ($respNome === '') $respNome = $nomeCliente;
            $enderecoCompleto = trim(implode(', ', array_filter([
                (string)($l->cli_endereco ?? ''),
                (string)($l->cli_num ?? ''),
                (string)($l->cli_bairro_nome ?? ''),
                trim(((string)($l->cidade_nome ?? '')) . ' ' . ((string)($l->uf_sigla ?? ''))),
            ])));
            try { $dtRes = Carbon::parse((string)($l->dt_reserva ?: '')); } catch (\Throwable $e) { $dtRes = Carbon::today(); }

            if (!isset($grupos[$chave])) {
                $grupos[$chave] = [
                    'grupo_key' => $chave,
                    'cliente_id' => (int)$l->cliente_id,
                    'bisemana_id' => (int)$l->bisemana_id,
                    'user_id' => (int)$l->user_id,
                    'client_name' => $nomeCliente,
                    'corporate_reason' => (string)($l->razao_social ?? ''),
                    'cpf_cnpj' => $cpfCnpj,
                    'campaign_title' => trim((string)($l->campanha ?: 'Campanha Não Informada')),
                    'campaign_segment' => 'Publicidade OOH / Outdoor',
                    'date_pre_reserva' => $dtRes->format('d/m/Y'),
                    'date_pre_reserva_ymd' => $dtRes->format('Y-m-d'),
                    'seller_name' => (string)($l->user_name ?? '—'),
                    'seller_id' => (int)$l->user_id,
                    'panels_count' => 0,
                    'panel_ids_list' => '',
                    'panel_details' => [],
                    'cep' => (string)($l->cep ?? ''),
                    'address' => $enderecoCompleto,
                    'endereco_num' => $enderecoNum,
                    'city' => (string)($l->cidade_nome ?? ''),
                    'uf' => (string)($l->uf_sigla ?? ''),
                    'uf_id' => $ufId,
                    'cidade_id' => $cidadeId,
                    'phone' => $fone,
                    'celular' => (string)($l->cli_celular ?? ''),
                    'tel_responsavel' => $telResp,
                    'email' => $email,
                    'email_responsavel' => $emailResp,
                    'responsible_name' => $respNome,
                    'financial_email' => $emailResp,
                    'state_registration' => $nroInsc !== '' ? $nroInsc : 'ISENTA',
                    'unit_price' => 0,
                    'unit_discount' => 0,
                    'unit_cost' => 0,
                    'notes' => (string)($l->observacao ?? ''),
                    'reserva_ids' => [],
                ];
            }
            $grupos[$chave]['panels_count'] += 1;
            $ident = (string)($l->painel_id ?: 'ID '.$l->outdoor_id);
            $detalhe = trim($ident . ' - ' . implode(', ', array_filter([
                (string)($l->painel_logradouro ?? ''),
                (string)($l->painel_num ?? ''),
            ])));
            $grupos[$chave]['panel_details'][] = $detalhe;
            $grupos[$chave]['reserva_ids'][] = (int)$l->reserva_id;
        }

        foreach ($grupos as &$g) {
            $ids = [];
            foreach ($g['panel_details'] as $pd) {
                $partes = explode(' - ', $pd, 2);
                $ids[] = trim($partes[0] ?? '');
            }
            $g['panel_ids_list'] = implode(', ', array_slice($ids, 0, 8));
            if (count($ids) > 8) $g['panel_ids_list'] .= ' ...(+'.(count($ids)-8).')';
            $g['panel_ids'] = $ids;
            $g['panel_ids_full'] = $ids;
            $g['panel_details_full'] = $g['panel_details'];
            try {
                $dt = Carbon::parse($g['date_pre_reserva_ymd']);
                $prazoDias = $dt->diffInDays(Carbon::today(), false);
                if ($prazoDias > 2) $g['expiration_text'] = 'Pré-reserva há ' . $prazoDias . ' dias · Urgente';
                elseif ($prazoDias > 0) $g['expiration_text'] = 'Pré-reserva há ' . $prazoDias . ' dias';
                else $g['expiration_text'] = 'Criada Hoje';
            } catch (\Throwable $e) { $g['expiration_text'] = 'Pendente'; }
            if ($g['unit_price'] === 0) $g['unit_price'] = 850;
            if ($g['unit_cost'] === 0) $g['unit_cost'] = 210;
        }
        unset($g);

        $reservasSemPI = array_values($grupos);
        usort($reservasSemPI, function ($a, $b) {
            $pa = strpos($a['expiration_text'], 'Urgente') !== false ? 0 : 1;
            $pb = strpos($b['expiration_text'], 'Urgente') !== false ? 0 : 1;
            if ($pa !== $pb) return $pa - $pb;
            return $b['panels_count'] - $a['panels_count'];
        });

        $vendedores = User::orderBy('name')->where(function ($q) {
            $q->whereNull('active')->orWhere('active', '!=', 0);
        })->limit(100)->get(['id', 'name'])->map(function ($u) { return ['id'=>(int)$u->id, 'nome'=>(string)$u->name]; })->values()->all();

        $ufs = DB::table('uf')->orderBy('nome')->get(['id', 'nome', 'sigla'])->map(function ($u) { return ['id'=>(int)$u->id, 'nome'=>(string)$u->nome, 'sigla'=>(string)$u->sigla]; })->values()->all();

        $kpiSemPI = count($reservasSemPI);
        $kpiFaces = 0;
        foreach ($reservasSemPI as $g) $kpiFaces += (int)$g['panels_count'];

        $bsAtual = null;
        foreach ($bisemanasTodas as $b) {
            if ((int)$b['id'] === $bsIdFinal) { $bsAtual = $b; break; }
        }

        $props = [
            'ano_id' => $anoIdFinal,
            'bs_id' => $bsIdFinal,
            'search' => $search,
            'vendedor_id' => $vendedorId,
            'anos' => $anos,
            'bisemanas' => $bisemanasTodas,
            'bs_atual' => $bsAtual,
            'vendedores' => $vendedores,
            'ufs' => $ufs,
            'kpis' => [
                'total_sem_pi' => $kpiSemPI,
                'total_faces' => $kpiFaces,
            ],
            'pre_reservations' => $reservasSemPI,
        ];

        return Inertia::render('React/Reservas/SemPI/Index')->rootView('app-react')->with($props);
    }

    public function gerarPIPorReserva(Request $request)
    {
        $reservaIds = $request->input('reserva_ids', []);
        if (!is_array($reservaIds)) $reservaIds = [];
        $reservaIds = array_map('intval', $reservaIds);

        $formPi = $request->input('formPiLegado', null);
        $formOne = is_array($formPi) && isset($formPi['One']) && is_array($formPi['One']) ? $formPi['One'] : [];
        $formTwo = is_array($formPi) && isset($formPi['Two']) && is_array($formPi['Two']) ? $formPi['Two'] : [];
        $formThree = is_array($formPi) && isset($formPi['Three']) && is_array($formPi['Three']) ? $formPi['Three'] : [];
        $formFour = is_array($formPi) && isset($formPi['Four']) && is_array($formPi['Four']) ? $formPi['Four'] : [];
        $formFive = is_array($formPi) && isset($formPi['Five']) && is_array($formPi['Five']) ? $formPi['Five'] : [];

        $clienteId = (int)($formOne['clienteId'] ?? 0);
        if ($clienteId <= 0 && count($reservaIds) > 0) {
            $primReserva = Reserva::find((int)$reservaIds[0]);
            if ($primReserva) $clienteId = (int)$primReserva->cliente_id;
        }
        if ($clienteId <= 0) {
            return response()->json(['success' => false, 'message' => 'Cliente não identificado para emissão da PI.'], 422);
        }

        $clienteModel = Cliente::find($clienteId);
        if (!$clienteModel) {
            return response()->json(['success' => false, 'message' => 'Cliente não encontrado.'], 422);
        }

        $bsId = (int)($formTwo['bisemanaId'] ?? 0);
        if ($bsId <= 0 && count($reservaIds) > 0) {
            $primReserva = Reserva::find((int)$reservaIds[0]);
            if ($primReserva) $bsId = (int)$primReserva->bisemana_id;
        }
        if ($bsId <= 0) {
            return response()->json(['success' => false, 'message' => 'Bi-semana inválida.'], 422);
        }

        $idsPainelString = [];
        $twoPaineis = $formTwo['paineis'] ?? null;
        if (is_array($twoPaineis) && count($twoPaineis) > 0) {
            foreach ($twoPaineis as $p) {
                if (is_string($p) || is_numeric($p)) {
                    $part = explode(' - ', (string)$p, 2);
                    $idsPainelString[] = trim($part[0] ?? $p);
                }
            }
        }
        if (count($idsPainelString) === 0 && count($reservaIds) > 0) {
            $idsPainelString = Reserva::whereIn('id', $reservaIds)
                ->join('outdoors', 'outdoors.id', '=', 'reservas.outdoor_id')
                ->pluck('outdoors.identificacao')
                ->filter()
                ->values()
                ->all();
        }
        $idsPaineisJson = count($idsPainelString) > 0 ? json_encode($idsPainelString) : null;

        $temLed = false;
        if (count($idsPainelString) > 0) {
            try {
                $temLed = Painel::whereIn('identificacao', $idsPainelString)
                    ->where('is_led', 1)
                    ->exists();
            } catch (\Throwable $e) {
                $temLed = false;
            }
        }

        $servicos = $formFour['servicos'] ?? [];
        if (!is_array($servicos)) $servicos = [];
        $vlrTotal = (float)($formFour['vlr_total'] ?? 0);
        $vlrUnit = 0;
        $vlrDesc = 0;
        $vlrCusto = 0;
        if (count($servicos) > 0) {
            foreach ($servicos as $sp) {
                if (!is_array($sp)) continue;
                $vlrUnit += (float)($sp['vlr_unit'] ?? 0);
                $vlrDesc += (float)($sp['vlr_desc'] ?? 0);
                $vlrCusto += (float)($sp['vlr_custo'] ?? 0);
            }
        }
        if ($vlrTotal <= 0) {
            $vlrTotal = array_reduce($servicos, function ($s, $sp) {
                return $s + (float)(is_array($sp) ? ($sp['vlr_total'] ?? 0) : 0);
            }, 0);
        }

        $obsFinal = (string)($formFive['observacao'] ?? '');
        if ($temLed) {
            $prefixo = '[PAINÉIS LED INCLUÍDOS]';
            $obsFinal = $obsFinal !== '' ? ($prefixo . "\n" . $obsFinal) : $prefixo;
        }

        $pgto = (string)($formFour['pgto'] ?? '');
        $pago = $pgto === '1' ? 1 : 0;
        $dtPgto = null;
        if (!empty($formFour['dtPgto'])) {
            try {
                $dtPgto = Carbon::parse((string)$formFour['dtPgto'])->toDateString();
            } catch (\Throwable $e) {
                $dtPgto = null;
            }
        }
        if ($dtPgto === null) {
            $dtPgto = Carbon::today()->toDateString();
        }

        $formaPgtoMap = [
            1 => 'DINHEIRO',
            2 => 'PIX',
            3 => 'CARTÃO',
            4 => 'BOLETO',
            5 => 'TRANSFERÊNCIA',
        ];
        $fpId = (int)($formFour['formaPgto'] ?? 0);
        $formaPgtoStr = $formaPgtoMap[$fpId] ?? ($fpId > 0 ? 'Forma #'.$fpId : '');

        $vendedorId = (int)($formTwo['vendedorId'] ?? 0);
        if ($vendedorId <= 0 && count($reservaIds) > 0) {
            $primRes = Reserva::find((int)$reservaIds[0]);
            if ($primRes) $vendedorId = (int)$primRes->user_id;
        }

        $contato = trim((string)($formOne['responsavel'] ?? ''));
        if ($contato === '' && $clienteModel) {
            $contato = (string)($clienteModel->responsavel ?? '');
        }

        $nomeCliente = trim((string)(($clienteModel->nome_fantasia ?? '') ?: ($clienteModel->razao_social ?? ($formOne['clienteNome'] ?? 'Cliente'))));
        $dtPi = Carbon::today()->toDateString();
        $campanha = (string)($formTwo['campanha'] ?? '');

        DB::beginTransaction();
        try {
            $pi = Pi::create([
                'id_cliente' => $clienteId,
                'id_paineis' => $idsPaineisJson,
                'contato' => $contato,
                'campanha' => $campanha,
                'id_bisemana' => $bsId,
                'vl_unit' => $vlrUnit,
                'vl_desc' => $vlrDesc,
                'vl_custo' => $vlrCusto,
                'vl_total' => $vlrTotal,
                'pago' => $pago,
                'dt_pgto' => $dtPgto,
                'forma_pagamento' => $formaPgtoStr,
                'vendedor' => $vendedorId > 0 ? $vendedorId : null,
                'obs' => $obsFinal,
            ]);

            $nomeClienteSeguro = preg_replace('/[^A-Za-z0-9_-]+/', '_', (string)$nomeCliente);
            $anoPi = substr((string)$dtPi, 0, 4);
            $nomeArquivo = 'PI' . $pi->id . '_' . $anoPi . '_' . $nomeClienteSeguro . '_' . $dtPi . '.pdf';
            $pi->update(['arquivo' => $nomeArquivo]);

            if (count($reservaIds) > 0) {
                $updReserva = [
                    'pi_ok' => 1,
                    'pi_id' => $pi->id,
                ];
                if ($campanha !== '') {
                    $updReserva['campanha'] = $campanha;
                }
                DB::table('reservas')
                    ->whereIn('id', $reservaIds)
                    ->update($updReserva);
            } else {
                $dataReservaBase = [
                    'cliente_id' => $clienteId,
                    'bisemana_id' => $bsId,
                    'dt_reserva' => $dtPi,
                    'campanha' => $campanha,
                    'pi_ok' => 1,
                    'pi_id' => $pi->id,
                    'user_id' => $vendedorId > 0 ? $vendedorId : (auth()->id() ?: null),
                ];
                foreach ($idsPainelString as $identPainel) {
                    $painel = Painel::where('identificacao', $identPainel)->first();
                    if (!$painel) continue;
                    $reserva = DB::table('reservas')
                        ->where('cliente_id', $clienteId)
                        ->where('outdoor_id', $painel->id)
                        ->where('bisemana_id', $bsId)
                        ->first();
                    if ($reserva) {
                        DB::table('reservas')->where('id', $reserva->id)->update([
                            'dt_reserva' => $dtPi,
                            'campanha' => $campanha !== '' ? $campanha : $reserva->campanha,
                            'pi_ok' => 1,
                            'pi_id' => $pi->id,
                            'user_id' => $dataReservaBase['user_id'] ?? null,
                        ]);
                    } else {
                        DB::table('reservas')->insert(array_merge($dataReservaBase, [
                            'outdoor_id' => $painel->id,
                        ]));
                    }
                }
            }

            $bisemana = Bisemana::find($bsId);
            $bs_ini = $bisemana ? explode('-', (string)$bisemana->inicio) : ['', '', ''];
            $bs_fin = $bisemana ? explode('-', (string)$bisemana->fim) : ['', '', ''];
            $bs_inicio = count($bs_ini) === 3 ? ($bs_ini[2].'/'.$bs_ini[1].'/'.$bs_ini[0]) : '';
            $bs_final = count($bs_fin) === 3 ? ($bs_fin[2].'/'.$bs_fin[1].'/'.$bs_fin[0]) : '';
            $bs_ano = count($bs_ini) === 3 ? substr($bs_ini[0], 2, 2) : '';
            $bs_formated = $bisemana ? ('BS: '. ((int)($bisemana->num_bisemana ?? 0)).' - '.$bs_inicio. ' a '.$bs_final.'/'.$bs_ano) : '';

            $dt_atual_arr = explode('-', $dtPi);
            $dt_atual = count($dt_atual_arr) === 3 ? ($dt_atual_arr[2].'/'.$dt_atual_arr[1].'/'.$dt_atual_arr[0]) : '';

            $bairro = $clienteModel && !empty($clienteModel->bairro) ? Bairro::find($clienteModel->bairro) : null;
            $cidade = $clienteModel && !empty($clienteModel->cidade) ? Cidade::find($clienteModel->cidade) : null;
            $uf = $clienteModel && !empty($clienteModel->uf) ? UF::find($clienteModel->uf) : null;

            $twoAgentes = $formTwo['agentesId'] ?? [];
            if (!is_array($twoAgentes)) $twoAgentes = [];
            $agentes = [];
            foreach ($twoAgentes as $ag) {
                $agente = Cliente::where('agent', 1)->where('id', (int)$ag)->first();
                if ($agente) $agentes[] = $agente;
            }

            $faturamento = !empty($formThree) ? $formThree : null;
            $vendedorNome = $vendedorId > 0 ? (User::find($vendedorId)?->name ?? null) : null;
            $textoAtivo = TextoPadrao::where('active', 1)->first();

            $valor_liq_comissoes = 0;
            $vlrTotalComissoes = $vlrTotal;
            foreach ($servicos as $sp) {
                if (!is_array($sp)) continue;
                $svVlrTotal = (float)($sp['vlr_total'] ?? 0);
                $svVlrDesc = (float)($sp['vlr_desc'] ?? 0);
                $svVlrLiquido = $svVlrTotal - $svVlrDesc;
                $svId = (int)($sp['id'] ?? 0);
                foreach ($agentes as $agente) {
                    $comissao = Comissao::where('id_funcionario', $agente->id)
                        ->where('id_servico', $svId)->first();
                    if ($comissao) {
                        if ((int)($comissao->tipo_comissao ?? 0) === 1) {
                            $vlrCom = $svVlrLiquido * ((float)($comissao->valor ?? 0) / 100);
                            $vlrTotalComissoes -= $vlrCom;
                        } else {
                            $vlrCom = $svVlrLiquido - (float)($comissao->valor ?? 0);
                            $vlrTotalComissoes -= $vlrCom;
                        }
                    }
                }
            }
            $valor_liq_comissoes = $vlrTotalComissoes;

            $lista_lancamentos = [];
            $parcelasDetalhe = $formFour['parcelasDetalhe'] ?? null;
            if (is_array($parcelasDetalhe) && count($parcelasDetalhe) > 0) {
                $i = 1;
                foreach ($parcelasDetalhe as $parc) {
                    $lista_lancamentos[] = [
                        'descricao' => 'PI nº ' . $pi->id . ' Cliente: ' . $nomeCliente,
                        'valor' => (float)($parc['valor'] ?? 0),
                        'parcelas' => $i . '/' . count($parcelasDetalhe),
                        'data_lancamento' => $parc['data'] ?? $dtPgto,
                        'centro_custo' => 1,
                        'tipo_lancamento' => 1,
                        'id_reserva' => $pi->id,
                        'observacoes' => $obsFinal,
                    ];
                    $i++;
                }
            } else {
                $qtdParcelas = (int)($formFour['qtdParcelas'] ?? 1);
                if ($qtdParcelas <= 0) $qtdParcelas = 1;
                $vl_parcela = $vlrTotal / $qtdParcelas;
                for ($i = 0; $i < $qtdParcelas; $i++) {
                    $parcelaLabel = ($i + 1) . '/' . $qtdParcelas;
                    $dataLanc = date('Y-m-d', strtotime($dtPgto . ' + ' . $i . ' month'));
                    $lista_lancamentos[] = [
                        'descricao' => 'PI nº ' . $pi->id . ' Cliente: ' . $nomeCliente,
                        'valor' => $vl_parcela,
                        'parcelas' => $parcelaLabel,
                        'data_lancamento' => $dataLanc,
                        'centro_custo' => 1,
                        'tipo_lancamento' => 1,
                        'id_reserva' => $pi->id,
                        'observacoes' => $obsFinal,
                    ];
                }
            }

            if (count($agentes) === 0) {
                $agenteDummy = new \stdClass();
                $agenteDummy->razao_social = '—';
                $agenteDummy->nome_fantasia = '—';
                $agenteDummy->cpf_cnpj = '';
                $agenteDummy->nro_insc = '';
                $agenteDummy->endereco = '';
                $agenteDummy->num = '';
                $agenteDummy->complemento = '';
                $agenteDummy->cep = '';
                $agentes[] = $agenteDummy;
            }

            $faturamentoDefault = [
                'faturar_sobre' => '2',
                'faturar_contra' => '1',
                'enviar_faturamento' => '1',
            ];
            if ($faturamento === null) {
                $faturamento = $faturamentoDefault;
            } else {
                foreach ($faturamentoDefault as $k => $v) {
                    if (!isset($faturamento[$k]) || $faturamento[$k] === '' || $faturamento[$k] === null) {
                        $faturamento[$k] = $v;
                    }
                }
            }

            $pdfDir = storage_path('app/public/pdf/pi');
            if (!File::exists($pdfDir)) {
                File::makeDirectory($pdfDir, 0755, true);
            }

            $agenteIds = [];
            foreach ($agentes as $ag) {
                $agId = isset($ag->id) ? (int)$ag->id : 0;
                if ($agId > 0) $agenteIds[] = $agId;
            }
            $comissoes = [];
            if (count($agenteIds) > 0) {
                try {
                    $comissoes = Comissao::whereIn('id_funcionario', $agenteIds)->get()->toArray();
                } catch (\Throwable $e) {
                    $comissoes = [];
                }
            }

            $idPaineis = $idsPainelString;
            $cliente = $clienteModel;
            $pagamento = $pago;
            $forma_pagamento = $fpId;
            $servicos = $servicos;
            $vendedor = $vendedorNome ?? '';
            $observacao = $obsFinal;

            $nomeArquivoFin = 'pi_fin_PI' . $pi->id . '_' . $anoPi . '_' . $nomeClienteSeguro . '_' . $dtPi . '.pdf';
            try {
                $pi_fin = PDF::loadview('relatorios.pi.pi_fin_nova', compact(
                    'pi', 'idPaineis', 'cliente', 'agentes', 'comissoes', 'bs_inicio', 'bs_final', 'bs_formated',
                    'pagamento', 'forma_pagamento', 'dt_atual', 'bairro', 'cidade', 'uf',
                    'campanha', 'servicos', 'faturamento', 'vendedor', 'lista_lancamentos',
                    'valor_liq_comissoes', 'textoAtivo', 'observacao'
                ));
                $pi_fin->setPaper('a4', 'landscape');
                $pi_fin->save($pdfDir . '/' . $nomeArquivoFin);
            } catch (\Throwable $ePdfFin) {
                Log::warning('Erro ao gerar PDF Financeiro PI #' . $pi->id . ': ' . $ePdfFin->getMessage());
            }

            $nomeArquivoCli = 'pi_cli_PI' . $pi->id . '_' . $anoPi . '_' . $nomeClienteSeguro . '_' . $dtPi . '.pdf';
            try {
                $pi_cli = PDF::loadview('relatorios.pi.pi_nova', compact(
                    'pi', 'idPaineis', 'cliente', 'agentes', 'bs_inicio', 'bs_final', 'bs_formated',
                    'pagamento', 'forma_pagamento', 'dt_atual', 'bairro', 'cidade', 'uf',
                    'campanha', 'servicos', 'faturamento', 'vendedor', 'lista_lancamentos',
                    'valor_liq_comissoes', 'textoAtivo', 'observacao'
                ));
                $pi_cli->setPaper('a4', 'landscape');
                $pi_cli->save($pdfDir . '/' . $nomeArquivoCli);
            } catch (\Throwable $ePdfCli) {
                Log::warning('Erro ao gerar PDF Cliente PI #' . $pi->id . ': ' . $ePdfCli->getMessage());
                throw $ePdfCli;
            }

            try {
                $arquivoCopia = $pdfDir . '/' . $nomeArquivo;
                if (!File::exists($arquivoCopia) && File::exists($pdfDir . '/' . $nomeArquivoCli)) {
                    File::copy($pdfDir . '/' . $nomeArquivoCli, $arquivoCopia);
                }
            } catch (\Throwable $eCopia) {
                Log::warning('Erro ao copiar PDF para nome do campo arquivo PI #' . $pi->id . ': ' . $eCopia->getMessage());
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'PI emitida com sucesso.',
                'pi_id' => $pi->id,
                'arquivo' => $nomeArquivo,
                'total' => $vlrTotal,
                'pi_code' => 'PI #' . $pi->id,
            ], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Erro Gerar PI por Reserva: ' . $e->getMessage() . ' linha ' . $e->getLine());
            return response()->json([
                'success' => false,
                'message' => 'Erro interno ao emitir PI: ' . $e->getMessage(),
                'trace' => 'linha ' . $e->getLine(),
            ], 500);
        }
    }
}
