<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Config\Roles;
use App\Services\RolesService;
use App\Models\Financeiro\Funcao;
use Inertia\Inertia;

class RolesController extends Controller
{
    private $rolesService;

    public function __construct(RolesService $rolesService)
    {
        $this->rolesService = $rolesService;
    }

    public function index()
    {
        $funcoes = Funcao::all();

        return Inertia::render('Config/Gerais/AddPermissao', compact('funcoes'));
    }

    public function getRoles()
    {
        $roles = $this->rolesService->getRoles();

        return response()->json($roles);
    }


    public function getRole(Int $id)
    {
        $role = $this->rolesService->getRole($id);

        return response()->json($role);
    }


    public function createRole(Request $request)
    {
        $data = $request->all();

        $role = $this->rolesService->createRole($data);

        return response()->json($role);
    }


    public function updateRole(Request $request)
    {
        $data = $request->all();

        $role = $this->rolesService->updateRole($data);

        return response()->json($role);
    }

}
