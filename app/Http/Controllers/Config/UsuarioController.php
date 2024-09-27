<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Services\UsuarioService;
use App\Services\FinanceiroService;


class UsuarioController extends Controller
{
    private $usuarioService;
    private $financeiroService;

    public function __construct(UsuarioService $usuarioService, FinanceiroService $financeiroService)
    {
        $this->usuarioService = $usuarioService;
        $this->financeiroService = $financeiroService;
    }

    public function getUsuarios()
    {
        $usuarios = $this->usuarioService->listaUsuarios();
        return response()->json($usuarios);
    }

    public function index()
    {
        // $this->authorize('create', User::class);

        $usuarios = $this->usuarioService->listaUsuarios();
        $funcoes = $this->financeiroService->listaFuncoes();

        $can = [
            'create' => auth()->user()->can('create', User::class),
            'delete' => auth()->user()->can('delete', User::class),
            'edit' => auth()->user()->can('edit', User::class),
        ];

        return  Inertia::render('Config/Usuarios/ListaUsuarios', compact('usuarios', 'funcoes', 'can'));
    }

    public function cadastraUsuario(Request $request)
    {
        // dd($request->all());
        $usuario = $this->usuarioService->cadastraUsuario($request);

    }

    public function deletaUsuario(Request $request)
    {

        $usuario = $this->usuarioService->deletaUsuario($request->id_usuario);
    }




}
