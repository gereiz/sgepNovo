<?php

namespace App\Services;

use App\Models\Config\Roles;

class RolesService
{

    public function getRoles() {

        return  Roles::all();

    }

    public function getRole(Int $id) {

        return Roles::find($id);

    }


    public function createRole(Array $data) {

        return Roles::create([
            'name' => $data['name'],
        ]);

    }


    public function updateRole(Array $data) {

        $acess_levels = [];

        $role = Roles::find($data['permissao']['id_permissao']);

        if (json_decode($role->access_levels) != null) {
            $acess_levels = json_decode($role->access_levels);
        }


        // se o o id_funcao já existir no array, remove
        if (in_array($data['funcao']['id_funcao'], $acess_levels)) {

            $acess_levels = array_diff($acess_levels, [$data['funcao']['id_funcao']]);

        } else {

            array_push($acess_levels, $data['funcao']['id_funcao']);

        }

        $role->access_levels = json_encode($acess_levels);

        $role->save();


        return $role;

    }

}
