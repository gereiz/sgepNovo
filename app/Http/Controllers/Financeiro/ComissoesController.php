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
        $comissoes = ComissaoVenda::all();
        $pis = Pi::all();
        $clientes = Cliente::all();

        return Inertia::render('Financeiro/ComissoesPagas/ComissoesPagas', compact('anos', 'bisemanas', 'comissoes', 'pis', 'clientes'));
    }

}
