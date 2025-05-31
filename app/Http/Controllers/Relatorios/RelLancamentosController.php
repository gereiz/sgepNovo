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
        $tipo_lancamento = $request->query('tipoLancamento'); // opcional

        // Debug para ver se os valores chegaram
        // dd($dt_inicial, $dt_final, $id_centro_custo, $tipo_lancamento);

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

        $lancamentos = $query->get();

        $pdf = PDF::loadView('relatorios.financeiro.rel_lancamentos', compact('dt_atual', 'lancamentos'));
        return $pdf->setPaper('a4', 'landscape')->stream('Rel-Lancamentos.pdf');
    }

}
