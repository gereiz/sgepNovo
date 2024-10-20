<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class UsuarioService
{

    public function listaUsuarios() {

        $usuarios = User::with('funcao')->where('active', 1)->OrderBy('name', 'asc')->get();

        return $usuarios;
    }


    public function cadastraUsuario(Request $request)
    {
        // Validação dos dados
        $request->validate([
            'nome_usuario' => 'required',
            'email_usuario' => 'required',
            'funcao_usuario' => 'required',
        ], [
            'nome_usuario.required' => 'O campo nome é obrigatório',
            'email_usuario.required' => 'O campo email é obrigatório',
            'funcao_usuario.required' => 'O campo função é obrigatório',
        ]);

        if($request->id_usuario != '') {
            $usuario = User::find($request->id_usuario);

            $usuario->name = $request->nome_usuario;
            $usuario->email = $request->email_usuario;
            $usuario->function = $request->funcao_usuario;

            $role = Role::find($request->funcao_usuario);


            $usuario->syncRoles($role->name);


            if(isset($request->senha_usuario)) {
                $usuario->password = bcrypt($request->senha_usuario);
            }

            $usuario->save();
        } else {
            $usuario = new User();

            $usuario->name = $request->nome_usuario;
            $usuario->email = $request->email_usuario;
            $usuario->function = $request->funcao_usuario;
            $usuario->password = bcrypt($request->senha_usuario);
            $usuario->active = 1;
            $usuario->save();
        }




    }

    public function deletaUsuario($id)
    {
        $usuario = User::find($id);

        $usuario->active = 0;
        $usuario->save();
    }

}
