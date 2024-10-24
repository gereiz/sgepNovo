<?php

namespace App\Http\Controllers\Financeiro;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Financeiro\Servico;
use App\Services\FinanceiroService;

class ServicosController extends Controller
{
    protected $financeiroService;

    public function __construct(FinanceiroService $financeiroService)
    {
        $this->financeiroService = $financeiroService;
    }

    public function index()
    {
        $servicos = $this->financeiroService->listaServicos();
        
        return Inertia::render('Financeiro/ListaServicos', compact('servicos'));
    }

    public function cadastraServico(Request $request)
    {   
        $servico = $this->financeiroService->cadastraServico($request);

    }

    public function deletaServico(Request $request)
    {
        $servico = $this->financeiroService->deletaServico($request->id_servico);
    }

    public function getServico(Request $request)
    {
        $servico = $this->financeiroService->getServico($request->id_servico);
        return response()->json($servico);
    }

    public function listaServicos()
    {
        $servicos = $this->financeiroService->listaServicos();
        return response()->json($servicos);
    }
}
