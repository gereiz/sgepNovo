<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Config\Ano;
use App\Models\Clientes\Cliente;
use App\Models\Financeiro\CentroCusto;
use App\Models\Financeiro\Lancamento;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Inertia\Inertia;
use PDF;
use Illuminate\Support\Facades\DB;

class RelLancamentosController extends Controller
{
    private function resolveDateRange(Request $request): array
    {
        $dt_inicial = $request->query('dtInicial');
        $dt_final = $request->query('dtFinal');
        $mes = $request->query('mes');
        $ano = $request->query('ano');

        if ($mes && $ano) {
            $anoRow = Ano::find($ano);
            $year = $anoRow ? $anoRow->ano_bisemana : $ano;
            $month = str_pad((string)$mes, 2, '0', STR_PAD_LEFT);
            $dt_inicial = "$year-$month-01";
            $dt_final = date('Y-m-t', strtotime($dt_inicial));
        }

        return [$dt_inicial, $dt_final];
    }

    private function isModoPiReceber(Request $request): bool
    {
        return (int)$request->query('piReceber', 0) === 1;
    }

    private function applyCommonFilters($query, Request $request, bool $modoPi = false)
    {
        [$dt_inicial, $dt_final] = $this->resolveDateRange($request);
        $id_centro_custo = $request->query('centrosCustoId');
        $tipo_lancamento = $request->query('tipoLancamento');
        $status = $request->query('status');
        $origem = $request->query('origem');
        $search = trim((string)$request->query('search', ''));
        $pfx = $modoPi ? 'l.' : '';

        if (empty($dt_inicial) || empty($dt_final)) {
            return [null, null];
        }

        $query->whereDate($pfx.'dt_faturamento', '>=', $dt_inicial)
            ->whereDate($pfx.'dt_faturamento', '<=', $dt_final);

        if ($id_centro_custo && $id_centro_custo != 999) {
            $query->where($pfx.'centro_custo', $id_centro_custo);
        }

        if ($tipo_lancamento && $tipo_lancamento == 'E') {
            $query->where($pfx.'tipo_lancamento', 1);
        }

        if ($tipo_lancamento && $tipo_lancamento == 'S') {
            $query->where($pfx.'tipo_lancamento', 2);
        }

        if ($status && in_array(strtolower($status), ['pendente', 'quitado'])) {
            $query->where($pfx.'status_pagamento', strtoupper($status));
        }

        if ($origem) {
            $o = strtoupper((string)$origem);
            if ($o === 'PI') {
                $query->where($pfx.'descricao', 'LIKE', 'PI nº %');
            } elseif ($o === 'OS') {
                $query->where($pfx.'descricao', 'LIKE', 'OS nº %');
            } elseif ($o === 'MANUAL') {
                $query->where($pfx.'descricao', 'NOT LIKE', 'PI nº %')
                    ->where($pfx.'descricao', 'NOT LIKE', 'OS nº %');
            }
        }

        if ($search !== '') {
            if ($modoPi) {
                $query->where(function ($q) use ($search) {
                    $q->where('l.descricao', 'LIKE', '%'.$search.'%')
                        ->orWhere('l.observacoes', 'LIKE', '%'.$search.'%')
                        ->orWhere('c.nome_fantasia', 'LIKE', '%'.$search.'%')
                        ->orWhere('c.razao_social', 'LIKE', '%'.$search.'%')
                        ->orWhere('ag.nome_fantasia', 'LIKE', '%'.$search.'%')
                        ->orWhere('ag.razao_social', 'LIKE', '%'.$search.'%')
                        ->orWhere('p.id', (int)$search);
                });
            } else {
                $query->where(function ($q) use ($search) {
                    $q->where('descricao', 'LIKE', '%'.$search.'%')
                        ->orWhere('observacoes', 'LIKE', '%'.$search.'%');
                });
            }
        }

        return [$dt_inicial, $dt_final];
    }

    public function index() {
        $anos = Ano::all();
        $centros_custo = CentroCusto::all();
        $agentes = Cliente::where('ativo', 1)
            ->where('agent', 1)
            ->orderBy('nome_fantasia')
            ->get();

        return Inertia::render('Relatorios/Financeiro/RelLancamentos', compact('anos', 'centros_custo', 'agentes'));
    }

    public function getRelLancamentosData(Request $request)
    {
        $modoPi = $this->isModoPiReceber($request);
        $agenteId = (int)$request->query('agenteId', 0);

        if ($modoPi) {
            $query = DB::table('lancamentos as l')
                ->join('pi as p', 'p.id', '=', 'l.id_reserva')
                ->join('clientes as c', 'c.id', '=', 'p.id_cliente')
                ->leftJoin('comissao_venda as cv', 'cv.pi_id', '=', 'p.id')
                ->leftJoin('clientes as ag', 'ag.id', '=', 'cv.agente_id')
                ->select([
                    'l.id',
                    'p.id as pi_id',
                    'l.parcelas',
                    'p.created_at as emissao',
                    DB::raw("COALESCE(NULLIF(c.nome_fantasia,''), c.razao_social) as cliente"),
                    DB::raw("GROUP_CONCAT(DISTINCT COALESCE(NULLIF(ag.nome_fantasia,''), ag.razao_social) SEPARATOR ', ') as agente"),
                    'l.valor',
                    'l.dt_faturamento as vencimento',
                ]);

            [$dt_inicial, $dt_final] = $this->applyCommonFilters($query, $request, true);
            if (!$dt_inicial || !$dt_final) {
                return response()->json(['error' => 'Parâmetros obrigatórios ausentes'], 400);
            }
            $query->where('l.descricao', 'LIKE', 'PI nº %')
                ->where('l.tipo_lancamento', 1)
                ->where('l.status_pagamento', 'PENDENTE');
            if ($agenteId > 0) {
                $query->where('cv.agente_id', $agenteId);
            }

            $query->groupBy(
                'l.id',
                'p.id',
                'l.parcelas',
                'p.created_at',
                'c.nome_fantasia',
                'c.razao_social',
                'l.valor',
                'l.dt_faturamento'
            );

            $query->orderBy('l.dt_faturamento')
                ->orderBy('p.id')
                ->orderByRaw("CAST(SUBSTRING_INDEX(l.parcelas,'/',1) AS UNSIGNED)");

            return response()->json($query->paginate(25));
        }

        $query = Lancamento::with('centroCusto', 'tipoLancamento');
        [$dt_inicial, $dt_final] = $this->applyCommonFilters($query, $request, false);
        if (!$dt_inicial || !$dt_final) {
            return response()->json(['error' => 'Parâmetros obrigatórios ausentes'], 400);
        }
        $query->orderBy('dt_faturamento')->orderBy('id');
        return response()->json($query->paginate(25));
    }


    public function getRelLancamentos(Request $request)
    {
        $modoPi = $this->isModoPiReceber($request);
        $agenteId = (int)$request->query('agenteId', 0);
        $dt_atual = Carbon::today()->format('d/m/Y');

        if ($modoPi) {
            $query = DB::table('lancamentos as l')
                ->join('pi as p', 'p.id', '=', 'l.id_reserva')
                ->join('clientes as c', 'c.id', '=', 'p.id_cliente')
                ->leftJoin('comissao_venda as cv', 'cv.pi_id', '=', 'p.id')
                ->leftJoin('clientes as ag', 'ag.id', '=', 'cv.agente_id')
                ->select([
                    'l.id',
                    'p.id as pi_id',
                    'l.parcelas',
                    'p.created_at as emissao',
                    DB::raw("COALESCE(NULLIF(c.nome_fantasia,''), c.razao_social) as cliente"),
                    DB::raw("GROUP_CONCAT(DISTINCT COALESCE(NULLIF(ag.nome_fantasia,''), ag.razao_social) SEPARATOR ', ') as agente"),
                    'l.valor',
                    'l.dt_faturamento as vencimento',
                ]);
            [$dt_inicial, $dt_final] = $this->applyCommonFilters($query, $request, true);
            if (!$dt_inicial || !$dt_final) {
                return response('Parâmetros obrigatórios ausentes', 400);
            }
            $query->where('l.descricao', 'LIKE', 'PI nº %')
                ->where('l.tipo_lancamento', 1)
                ->where('l.status_pagamento', 'PENDENTE');
            if ($agenteId > 0) {
                $query->where('cv.agente_id', $agenteId);
            }
            $query->groupBy(
                'l.id',
                'p.id',
                'l.parcelas',
                'p.created_at',
                'c.nome_fantasia',
                'c.razao_social',
                'l.valor',
                'l.dt_faturamento'
            );
            $lancamentos = $query->orderBy('l.dt_faturamento')
                ->orderBy('p.id')
                ->orderByRaw("CAST(SUBSTRING_INDEX(l.parcelas,'/',1) AS UNSIGNED)")
                ->get();
        } else {
            $query = Lancamento::with('centroCusto', 'tipoLancamento');
            [$dt_inicial, $dt_final] = $this->applyCommonFilters($query, $request, false);
            if (!$dt_inicial || !$dt_final) {
                return response('Parâmetros obrigatórios ausentes', 400);
            }
            $lancamentos = $query->orderBy('dt_faturamento')->orderBy('id')->get();
        }

        $pdf = PDF::loadView('relatorios.financeiro.rel_lancamentos', [
            'dt_atual' => $dt_atual,
            'lancamentos' => $lancamentos,
            'modo_pi' => $modoPi,
            'titulo' => $modoPi ? "PI's a Receber" : 'RELATÓRIO DE LANÇAMENTOS',
        ]);
        return $pdf->setPaper('a4', 'landscape')->stream('Rel-Lancamentos.pdf');
    }

}
