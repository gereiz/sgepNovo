<?php

namespace App\Http\Controllers\Financeiro;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Clientes\Cliente;
use App\Models\Financeiro\ComissaoVenda;
use App\Services\FinanceiroService;
use App\Services\UsuarioService;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use App\Models\PI\Pi;


class ComissoesController extends Controller
{
    protected $financeiroService;
    protected $usuarioService;

    public function __construct(FinanceiroService $financeiroService, UsuarioService $usuarioService)
    {
        $this->financeiroService = $financeiroService;
    }

    public function index()
    {
        $servicos = $this->financeiroService->listaServicos();
        $usuarios = Cliente::where('ativo', 1)->where('agent', 1)->get(); // TODO: trocar por service
        $funcoes = $this->financeiroService->listaFuncoes();
        $comissoes = $this->financeiroService->listaComissoes();

        return Inertia::render('Financeiro/ListaComissoes', compact('servicos', 'usuarios', 'funcoes', 'comissoes'));
    }

    public function gravaComissaoservico(Request $request): void
    {
        $grava_comissao = $this->financeiroService->gravaComissaoservico($request);

    }

    public function delComissaoServico(Request $request): void
    {
        $del_comissao = $this->financeiroService->delComissaoServico($request->id_servico);
    }

    public function cadastraComissaoUsuario(Request $request): void
    {
        $cadastra_comissao = $this->financeiroService->cadastraComissaoUsuario($request);
    }

    public function deletaComissaoUsuario(Request $request): void
    {
        $deleta_comissao = $this->financeiroService->deletaComissaoUsuario($request->id_comissao);
    }

    public function listaComissoesPagas(Request $request) {

        $anos = Ano::all();
        $bisemanas = Bisemana::all();

        $anoId = (int)($request->input('anoId') ?? $request->query('anoId') ?? 0);
        $bisemanaId = (int)($request->input('bisemanaId') ?? $request->query('bisemanaId') ?? 0);

        if ($anoId === 0 && $bisemanaId === 0) {
            $anoAtual = (int)date('Y');
            $anoRow = Ano::where('ano_bisemana', $anoAtual)->first();
            if (!$anoRow) {
                $anoRow = Ano::orderBy('ano_bisemana', 'desc')->first();
            }
            if ($anoRow) {
                $anoId = (int)$anoRow->id;
            }
        }

        $pisQ = Pi::query();
        if ($bisemanaId > 0) {
            $pisQ->where('id_bisemana', $bisemanaId);
        } elseif ($anoId > 0) {
            $bsDoAno = Bisemana::where('ano_id', $anoId)->pluck('id')->values()->all();
            if (!empty($bsDoAno)) {
                $pisQ->whereIn('id_bisemana', $bsDoAno);
            } else {
                $pisQ->whereRaw('0 = 1');
            }
        }
        $pis = $pisQ->get();

        $piIds = $pis->pluck('id')->values()->all();
        $comissoes = empty($piIds) ? collect() : ComissaoVenda::whereIn('pi_id', $piIds)->get();
        $clientes = Cliente::all();
        $comissoes_defs = $this->financeiroService->listaComissoes();
        $lancamentos = empty($piIds) ? collect() : \App\Models\Financeiro\Lancamento::whereIn('id_reserva', $piIds)->get();

        return Inertia::render('Financeiro/ComissoesPagas/ComissoesPagas', compact('anos', 'bisemanas', 'comissoes', 'pis', 'clientes', 'comissoes_defs', 'lancamentos'));
    }

}
