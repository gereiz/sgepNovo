<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Config\Ano;
use App\Models\Financeiro\CentroCusto;
use App\Models\Financeiro\Lancamento;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Inertia\Inertia;
use PDF;

class RelLancamentosController extends Controller
{
    public function index() {
        $anos = Ano::all();
        $centros_custo = CentroCusto::all();

        return Inertia::render('Relatorios/Financeiro/RelLancamentos', compact('anos', 'centros_custo'));
    }


    public function getRelLancamentos(Request $request)
    {
        // Use query() para garantir leitura via GET
        $dt_inicial = $request->query('dtInicial');
        $dt_final = $request->query('dtFinal');
        $id_centro_custo = $request->query('centrosCustoId');
        $tipo_lancamento = $request->query('tipoLancamento'); // opcional: T,E,S
        $status = $request->query('status'); // opcional: todos, pendente, quitado
        $mes = $request->query('mes'); // opcional: 1..12
        $ano = $request->query('ano'); // opcional: YYYY

        // Se informado mês/ano, sobrepõe o range de datas
        if ($mes && $ano) {
            // $ano recebido é o ID da tabela anos; buscar o ano real
            $anoRow = Ano::find($ano);
            $year = $anoRow ? $anoRow->ano_bisemana : $ano;
            $month = str_pad((string)$mes, 2, '0', STR_PAD_LEFT);
            $dt_inicial = "$year-$month-01";
            $dt_final = date('Y-m-t', strtotime($dt_inicial));
        }

        if (empty($dt_inicial) || empty($dt_final) || empty($id_centro_custo)) {
            return response()->json(['error' => 'Parâmetros obrigatórios ausentes'], 400);
        }

        $dt_atual = Carbon::today()->format('d/m/Y');

        $query = Lancamento::with('centroCusto', 'tipoLancamento')
            ->whereDate('dt_faturamento', '>=', $dt_inicial)
            ->whereDate('dt_faturamento', '<=', $dt_final);
        
        if($id_centro_custo && $id_centro_custo != 999) {
            $query->where('centro_custo', $id_centro_custo);
        }

        if ($tipo_lancamento && $tipo_lancamento == 'E') {
            $query->where('tipo_lancamento', 1);
        }

        if ($tipo_lancamento && $tipo_lancamento == 'S') {
            $query->where('tipo_lancamento', 2);
        }

        if ($status && in_array(strtolower($status), ['pendente','quitado'])) {
            $query->where('status_pagamento', strtoupper($status));
        }

        $lancamentos = $query->get();

        $pdf = PDF::loadView('relatorios.financeiro.rel_lancamentos', compact('dt_atual', 'lancamentos'));
        return $pdf->setPaper('a4', 'landscape')->stream('Rel-Lancamentos.pdf');
    }

}
