<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Services\UsuarioService;
use App\Services\RolesService;


class UsuarioController extends Controller
{
    private $usuarioService;
    private $rolesService;

    public function __construct(UsuarioService $usuarioService, RolesService $rolesService)
    {
        $this->usuarioService = $usuarioService;
        $this->rolesService = $rolesService;
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
        $funcoes = $this->rolesService->getRoles();


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
