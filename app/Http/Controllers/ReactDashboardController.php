<?php

namespace App\Http\Controllers;

use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use App\Models\Paineis\Painel;
use App\Models\Clientes\Cliente;
use App\Models\Reservas\Reserva;
use App\Models\PI\Pi;
use App\Models\Financeiro\ComissaoVenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReactDashboardController extends Controller
{
    public function index(Request $request)
    {
        // === Carregamento básico (igual ao Dashboard Vue legado) ===
        $anos = Ano::orderByDesc('ano_bisemana')->get();
        $bisemanas = Bisemana::orderBy('ano_id')->orderBy('num_bisemana')->get();

        // ====== FILTROS DINÂMICOS (via query string / router.get do Inertia React) ======
        $anoIdSelecionado = $request->input('ano_id');
        $bisemanaIdSelecionado = $request->input('bisemana_id');
        $hoje = now()->toDateString();

        // (A) Bi-semana: prioriza bisemana_id que veio do REACT (select do usuário), senão a BS do dia, senão fallback última cadastrada.
        $bisemanaAtual = null;
        if ($bisemanaIdSelecionado) {
            $bisemanaAtual = Bisemana::find($bisemanaIdSelecionado);
        }
        if (!$bisemanaAtual) {
            $bisemanaAtual = Bisemana::whereDate('inicio', '<=', $hoje)
                ->whereDate('fim', '>=', $hoje)
                ->first();
        }
        if (!$bisemanaAtual) {
            $bisemanaAtual = Bisemana::orderByDesc('ano_id')->orderByDesc('num_bisemana')->first();
        }

        // (B) Ano: prioriza ano_id do React select, senão ano da bi-semana atual (se houver), senão primeiro ano.
        if ($anoIdSelecionado) {
            $anoAtual = $anoIdSelecionado;
        } else {
            $anoAtual = $bisemanaAtual?->ano_id ?? $anos->first()?->id;
        }

        // ============ CONSTRUÇÃO DOS ESCOPOS ============
        // $periodoReservasQuery = todas as queries de reservas/painéis que precisam respeitar ANO+BS selecionados
        // - Se bisemana selecionada: filtra por bisemana_id (1 BI-específica = exato)
        // - Senão, se ano selecionado: filtra por bisemanas.ano_id (Todo o ano)
        // - Fallback (nenhum): usa o ano atual default (mesmo do Vue legado)
        $bisemanaIdsDoAnoSelecionado = $anoAtual
            ? Bisemana::where('ano_id', $anoAtual)->pluck('id')->toArray()
            : [];

        // ================= KPIs do Dashboard =================
        $totalPaineis = Painel::count();
        $totalPaineisLed = (int) Painel::where('is_led', 1)->count();
        $totalPaineisConvencional = $totalPaineis - $totalPaineisLed;

        // Clientes "ativos no período" = clientes que TEM pelo menos 1 reserva no período selecionado (Ano+BS)
        $queryClientesAtivos = DB::table('clientes')
            ->join('reservas', 'reservas.cliente_id', '=', 'clientes.id');
        if ($bisemanaAtual) {
            $queryClientesAtivos->where('reservas.bisemana_id', '=', $bisemanaAtual->id);
        } elseif (!empty($bisemanaIdsDoAnoSelecionado)) {
            $queryClientesAtivos->whereIn('reservas.bisemana_id', $bisemanaIdsDoAnoSelecionado);
        } else {
            $queryClientesAtivos->whereYear('reservas.created_at', '=', now()->year);
        }
        $totalClientes = (int) $queryClientesAtivos->distinct('clientes.id')->count('clientes.id');
        $totalClientesNovosMes = (int) Cliente::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // Reservas da bi-semana ATUAL (SELECIONADA = sempre usa $bisemanaAtual)
        $totalReservasBsAtual = $bisemanaAtual
            ? Reserva::where('bisemana_id', $bisemanaAtual->id)->count()
            : 0;

        // Total PIs: se bi-semana selecionada usa ela; senão ano selecionado; senão fallback ano corrente created_at
        $queryPisPeriodo = DB::table('pi');
        $temFiltroPeriodo = false;
        if ($bisemanaAtual) {
            $queryPisPeriodo->where('pi.id_bisemana', '=', $bisemanaAtual->id);
            $temFiltroPeriodo = true;
        } elseif (!empty($bisemanaIdsDoAnoSelecionado)) {
            $queryPisPeriodo->whereIn('pi.id_bisemana', $bisemanaIdsDoAnoSelecionado);
            $temFiltroPeriodo = true;
        }
        if (!$temFiltroPeriodo) {
            $queryPisPeriodo->whereYear('pi.created_at', now()->year);
        }
        $totalVlPis = (float) $queryPisPeriodo->sum('vl_total');
        $totalPisEmitidos = (int) (clone $queryPisPeriodo)->count('pi.id');

        // Comissões: escopo dos PIs do período
        $piIdsPeriodo = (clone $queryPisPeriodo)->pluck('pi.id')->filter()->values()->toArray();
        $piIdsQuitados = DB::table('lancamentos')
            ->select('lancamentos.id_reserva')
            ->whereNotNull('lancamentos.id_reserva')
            ->groupBy('lancamentos.id_reserva')
            ->havingRaw("MIN(CASE WHEN UPPER(COALESCE(lancamentos.status_pagamento, 'PENDENTE')) = 'QUITADO' THEN 1 ELSE 0 END) = 1")
            ->pluck('id_reserva')
            ->filter()
            ->values()
            ->all();

        $queryComissoesPeriodo = DB::table('comissao_venda');
        if (!empty($piIdsPeriodo)) {
            $queryComissoesPeriodo->whereIn('comissao_venda.pi_id', $piIdsPeriodo);
        }
        $totalComissoes = (float) $queryComissoesPeriodo->sum('valor_comissao');
        $piIdsQuitadosInts = array_map('intval', $piIdsQuitados);
        $totalComissoesPagas = (float) (clone $queryComissoesPeriodo)
            ->whereIn('comissao_venda.pi_id', $piIdsQuitadosInts)
            ->sum('valor_comissao');

        // Totais de LED do PERÍODO SELECIONADO (não global!)
        $queryReservasLedPeriodo = DB::table('reservas')
            ->join('outdoors', 'reservas.outdoor_id', '=', 'outdoors.id')
            ->where('outdoors.is_led', 1);
        if ($bisemanaAtual) {
            $queryReservasLedPeriodo->where('reservas.bisemana_id', '=', $bisemanaAtual->id);
        } elseif (!empty($bisemanaIdsDoAnoSelecionado)) {
            $queryReservasLedPeriodo->whereIn('reservas.bisemana_id', $bisemanaIdsDoAnoSelecionado);
        }
        $totalReservasLed = (int) (clone $queryReservasLedPeriodo)->count();

        // Contratos de LED próximos do término (5 dias de alerta, como no LedService)
        $diasAlerta = 5;
        $dataCorteAlerta = now()->addDays($diasAlerta)->toDateString();
        $hojeStr = now()->toDateString();
        $contratosProximosTermino = (int) (clone $queryReservasLedPeriodo)
            ->join('bisemanas', 'reservas.bisemana_id', '=', 'bisemanas.id')
            ->whereDate('bisemanas.fim', '>=', $hojeStr)
            ->whereDate('bisemanas.fim', '<=', $dataCorteAlerta)
            ->count();

        $stats = [
            'total_paineis' => $totalPaineis,
            'total_paineis_led' => $totalPaineisLed,
            'total_paineis_convencionais' => $totalPaineisConvencional,
            'total_clientes' => $totalClientes,
            'total_clientes_novos_mes' => $totalClientesNovosMes,
            'total_reservas_bs_atual' => $totalReservasBsAtual,
            'total_vl_pi' => $totalVlPis,
            'total_pis_emitidos' => $totalPisEmitidos,
            'total_comissoes' => $totalComissoes,
            'total_comissoes_pagas' => $totalComissoesPagas,
            'total_reservas_led' => $totalReservasLed,
            'contratos_proximos_termino' => $contratosProximosTermino,
            'ano_atual_id' => $anoAtual,
            'bisemana_atual_id' => $bisemanaAtual?->id,
        ];

        // ================= Últimas 10 reservas =================
        // Obs: Reserva::$timestamps = false (não tem created_at). Ordena por id decrescente (mais novas).
        $ultimasReservas = DB::table('reservas')
            ->select([
                'reservas.id',
                'outdoors.identificacao as painel_ident',
                'outdoors.is_led',
                'clientes.razao_social as cliente_nome',
                'reservas.campanha',
                'bisemanas.num_bisemana',
                'bisemanas.inicio as bisemana_inicio',
                'reservas.pi_ok',
                'reservas.pi_id',
                'pi.vl_total as vl_pi',
            ])
            ->join('outdoors', 'reservas.outdoor_id', '=', 'outdoors.id')
            ->leftJoin('clientes', 'reservas.cliente_id', '=', 'clientes.id')
            ->leftJoin('bisemanas', 'reservas.bisemana_id', '=', 'bisemanas.id')
            ->leftJoin('pi', 'reservas.pi_id', '=', 'pi.id')
            ->orderByDesc('reservas.id')
            ->limit(10)
            ->get();

        // ================= Próximos 10 PIs =================
        // Observação: Pi model tem fillable 'pago' (coluna existente na tabela pi). Status de pagamento
        // pode vir de 2 fontes: pi.pago (campo direto) OU lancamentos.status_pagamento (atualização do caixa).
        $proximosPis = DB::table('pi')
            ->select([
                'pi.id',
                'clientes.razao_social as cliente_nome',
                'pi.campanha',
                'bisemanas.num_bisemana',
                'pi.vl_total',
                'pi.pago',
            ])
            ->leftJoin('clientes', 'pi.id_cliente', '=', 'clientes.id')
            ->leftJoin('bisemanas', 'pi.id_bisemana', '=', 'bisemanas.id')
            ->orderByDesc('pi.id')
            ->limit(10)
            ->get();

        // Combina ambas as fontes: se pi.pago OU se todos os lancamentos do PI estão QUITADOS -> QUITADO
        $piIdsQuitadosInts = array_map('intval', $piIdsQuitados);
        $proximosPis = $proximosPis->map(function ($pi) use ($piIdsQuitadosInts) {
            $arr = (array)$pi;
            $quitado = !empty($pi->pago) || in_array((int)$pi->id, $piIdsQuitadosInts, true);
            $arr['status_pagamento'] = $quitado ? 'QUITADO' : 'PENDENTE';
            return (object)$arr;
        });

        // ================= DADOS DOS GRÁFICOS DONUTS (Dashboard Vue 1:1) =================
        //
        //  (A) Vendas por Vendedor = contagem de reservas (painéis) atribuídas a cada user_id
        //      Aparência: Top 3 vendedores + "Demais" agrupados.
        //
        //  (B) Reservas por Cliente = contagem de reservas por cliente_id
        //      Aparência: Top 4 clientes + "Demais" agrupados.
        //
        //  (C) Barra de status da BS atual: status (ativa/fechada), ocupacao %, faturamento bruto.

        // --- (C) Barra de status da Bi-semana ---
        $bsInfo = [
            'id'            => $bisemanaAtual?->id,
            'num_bisemana'  => $bisemanaAtual?->num_bisemana,
            'inicio'        => $bisemanaAtual?->inicio,
            'fim'           => $bisemanaAtual?->fim,
            'status'        => (function() use ($bisemanaAtual, $hoje) {
                if (!$bisemanaAtual) return 'Indisponível';
                $ini = data_get($bisemanaAtual, 'inicio');
                $fim = data_get($bisemanaAtual, 'fim');
                if ($hoje >= $ini && $hoje <= $fim) return 'Veiculação Ativa';
                if ($hoje < $ini) return 'Aguardando início';
                return 'Finalizada';
            })(),
            // --- Taxa de ocupação da BS atual: (paineis reservados / totais) ---
            //     Na tela Vue: 57/60 Faces = 95.0%.    Aqui calculamos com dados reais.
            'total_faces'       => (int) ($totalPaineis > 0 ? $totalPaineis : 60),
            'faces_reservadas'  => (int) ($bisemanaAtual
                ? DB::table('reservas')
                    ->where('bisemana_id', $bisemanaAtual->id)
                    ->distinct()
                    ->count('outdoor_id')
                : 0),
            'taxa_ocupacao_pct' => 0,
            // --- Faturamento bruto da BS atual (soma valor_total das reservas / ou vl_total dos PIs) ---
            'faturamento_bruto_bs' => (float) ($bisemanaAtual
                ? DB::table('pi')->where('id_bisemana', $bisemanaAtual->id)->sum('vl_total')
                : 0),
        ];
        if ($bsInfo['total_faces'] > 0) {
            $bsInfo['taxa_ocupacao_pct'] = round(($bsInfo['faces_reservadas'] / $bsInfo['total_faces']) * 100, 1);
        }

        // --- (A) Vendas por Vendedor (top 3 + demais) ---
        $vendasPorVendedorRaw = DB::table('reservas')
            ->select([
                'users.id as user_id',
                'users.name as vendedor_nome',
                DB::raw('COUNT(reservas.id) as total_paineis'),
            ])
            ->join('users', 'users.id', '=', 'reservas.user_id')
            ->when($bisemanaAtual, function ($q) use ($bisemanaAtual) {
                return $q->where('reservas.bisemana_id', '=', $bisemanaAtual->id);
            })
            ->groupBy('users.id', 'users.name')
            ->orderByDesc('total_paineis')
            ->orderBy('users.name')
            ->get();

        $totalReservasVendedor = (int) $vendasPorVendedorRaw->sum('total_paineis');
        $vendasPorVendedorTop3 = $vendasPorVendedorRaw->take(3)->values()->all();
        $demaisVendedores = $vendasPorVendedorRaw->slice(3);
        $totalDemaisVendedores = (int) $demaisVendedores->sum('total_paineis');
        if ($totalDemaisVendedores > 0) {
            $vendasPorVendedorTop3[] = (object)[
                'user_id'        => -1,
                'vendedor_nome'  => 'Demais',
                'total_paineis'  => $totalDemaisVendedores,
            ];
        }

        // --- (B) Reservas por Cliente (top 4 + demais) ---
        $reservasPorClienteRaw = DB::table('reservas')
            ->select([
                'clientes.id as cliente_id',
                'clientes.razao_social as cliente_nome',
                DB::raw('COUNT(reservas.id) as qtd'),
            ])
            ->join('clientes', 'clientes.id', '=', 'reservas.cliente_id')
            ->when($bisemanaAtual, function ($q) use ($bisemanaAtual) {
                return $q->where('reservas.bisemana_id', '=', $bisemanaAtual->id);
            })
            ->groupBy('clientes.id', 'clientes.razao_social')
            ->orderByDesc('qtd')
            ->orderBy('clientes.razao_social')
            ->get();

        $totalClientesDistintos = (int) $reservasPorClienteRaw->count();
        $reservasPorClienteTop4 = $reservasPorClienteRaw->take(4)->values()->all();
        $demaisClientes = $reservasPorClienteRaw->slice(4);
        $totalDemaisClientes = (int) $demaisClientes->sum('qtd');
        $totalReservasPorCliente = (int) $reservasPorClienteRaw->sum('qtd');
        if ($totalDemaisClientes > 0) {
            $reservasPorClienteTop4[] = (object)[
                'cliente_id'   => -1,
                'cliente_nome' => 'Demais',
                'qtd'          => $totalDemaisClientes,
            ];
        }

        $graficos = [
            'bs_info'                 => $bsInfo,
            'total_reservas_ativas'   => $totalReservasVendedor ?: $totalReservasPorCliente,
            'total_clientes_distintos' => $totalClientesDistintos,
            'vendas_por_vendedor'     => $vendasPorVendedorTop3,
            'reservas_por_cliente'    => $reservasPorClienteTop4,
        ];

        // Renderiza a página React com ROOT VIEW SEPARADA (não usa o app.blade.php do Vue)
        return Inertia::render('React/Dashboard/Index', [
            'anos' => $anos,
            'bisemanas' => $bisemanas,
            'stats' => $stats,
            'graficos' => $graficos,
            'ultimasReservas' => $ultimasReservas,
            'proximosPis' => $proximosPis,
        ])->rootView('app-react');
    }
}
