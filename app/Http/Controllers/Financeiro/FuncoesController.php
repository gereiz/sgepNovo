<?php

namespace App\Http\Controllers\Financeiro;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Financeiro\Funcao;
use App\Services\FinanceiroService;

class FuncoesController extends Controller
{

    public function __construct(FinanceiroService $financeiroService)
    {
        $this->financeiroService = $financeiroService;
    }

    public function index()
    {   
        $funcoes = $this->financeiroService->listaFuncoes();

        return Inertia::render('Financeiro/ListaFuncoes', compact('funcoes'));
    }

    public function cadastraFuncao(Request $request)
    {
      
        $funcao = $this->financeiroService->cadastraFuncao($request);

    }

    public function deletaFuncao(Request $request)
    {
        $funcao = $this->financeiroService->deletaFuncao($request->id_funcao);

    }


}
