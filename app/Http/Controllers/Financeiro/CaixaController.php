<?php

namespace App\Http\Controllers\Financeiro;

use App\Http\Controllers\Controller;
use App\Models\Financeiro\Comissao;
use App\Models\Financeiro\ComissaoVenda;
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
        $tipos_lancamento = $this->caixaService->getTiposLancamentos();
        $lancamentos = $this->caixaService->getLancamentos();

        $reservaIds = $lancamentos->pluck('id_reserva')->filter()->unique()->values()->all();
        $comissoes_por_reserva = [];
        if (!empty($reservaIds)) {
            $cvRows = ComissaoVenda::whereIn('pi_id', $reservaIds)->orderBy('id', 'desc')->get();
            $seenChaves = [];
            foreach ($cvRows as $cvr) {
                $piIdInt = (int)$cvr->pi_id;
                $benefKey = $cvr->pessoa_tipo && $cvr->pessoa_id
                    ? $cvr->pessoa_tipo . ':' . $cvr->pessoa_id
                    : 'agente:' . ($cvr->agente_id ?? 0);
                $defKey = $cvr->comissao_cadastro_id
                    ? 'cad:' . $cvr->comissao_cadastro_id
                    : 'com:' . ($cvr->comissao_id ?? 0);
                $chave = $piIdInt . '|' . $benefKey . '|' . $defKey;
                if (isset($seenChaves[$chave])) {
                    continue;
                }
                $seenChaves[$chave] = true;
                if (!isset($comissoes_por_reserva[$piIdInt])) {
                    $comissoes_por_reserva[$piIdInt] = 0.0;
                }
                $comissoes_por_reserva[$piIdInt] += (float)($cvr->valor_comissao ?? 0);
            }
        }

        // dd($comissoes_por_reserva);
        return Inertia::render('Financeiro/ControleCaixa', compact('centros_custo', 'tipos_lancamento', 'lancamentos', 'comissoes_por_reserva'));


    }

    public function lancamentos()
    {
        $centros_custo = $this->caixaService->getCentrosCusto();
        $tipos_lancamento = $this->caixaService->getTiposLancamentos();
        $lancamentos = $this->caixaService->getLancamentos();


        return Inertia::render('Financeiro/Lancamentos', compact('centros_custo', 'tipos_lancamento', 'lancamentos'));
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


    // Tipos de Lançamentos
    public function getTiposLancamentos()
    {
        return $this->caixaService->getTiposLancamentos();
    }

    public function getTipoLancamento(Request $request)
    {
        return $this->caixaService->getTipoLancamento($request);
    }

    public function createTipoLancamento(Request $request)
    {
        return $this->caixaService->createTipoLancamento($request);
    }

    public function updateTipoLancamento(Request $request)
    {
        return $this->caixaService->updateTipoLancamento($request);
    }

    public function deleteTipoLancamento(Request $request)
    {
        return $this->caixaService->deleteTipoLancamento($request);
    }


    // Lançamentos
    public function getLancamentos()
    {
        return $this->caixaService->getLancamentos();
    }

    public function getLancamento(Request $request)
    {
        return $this->caixaService->getLancamento($request);
    }

    public function createLancamento(Request $request)
    {
        return $this->caixaService->createLancamento($request);
    }

    public function updateLancamento(Request $request)
    {
        return $this->caixaService->updateLancamento($request);
    }

    public function deleteLancamento(Request $request)
    {
        return $this->caixaService->deleteLancamento($request);
    }

    public function toggleLancamentoStatus(Request $request)
    {
        return $this->caixaService->toggleLancamentoStatus($request);
    }


}

