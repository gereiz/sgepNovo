<?php

namespace App\Http\Controllers\Financeiro;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Financeiro\CaixaService;
use Inertia\Inertia;

class CaixaController extends Controller
{
    protected $caixaService;

    public function __construct(CaixaService $caixaService)
    {
        $this->caixaService = $caixaService;
    }


    public function index()
    {
        $centros_custo = $this->caixaService->getCentrosCusto();

        return Inertia::render('Financeiro/ControleCaixa', compact('centros_custo'));
    }


    public function getCentrosCusto(Request $request)
    {
        return $this->caixaService->getCentrosCusto();
    }


    public function createCentroCusto(Request $request)
    {
        return $this->caixaService->createCentroCusto($request);
    }


    public function updateCentroCusto(Request $request)
    {
        return $this->caixaService->updateCentroCusto($request);
    }


    public function deleteCentroCusto(Request $request)
    {
        return $this->caixaService->deleteCentroCusto($request);
    }


}
