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
        $usuarios = $this->usuarioService->listaUsuarios();
        $funcoes = $this->financeiroService->listaFuncoes();

        return  Inertia::render('Config/Usuarios/ListaUsuarios', compact('usuarios', 'funcoes'));   
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
