<?php

namespace App\Services;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesService
{

    public function getRoles() {

        return  Role::with('permissions')->get();

    }


    public function getRole(Int $id) {

        return Role::find($id);

    }


    public function createRole(Array $data) {

        return Role::create([
            'name' => $data['name'],
            'guard_name' => 'web',
        ]);

    }


    public function updateRole(Array $data) {

        $acess_levels = [];

        $role = Role::find($data['permissao']['id_permissao']);

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


    public function getPermissions()
    {
        return Permission::all();
    }


    public function setPermissions(Array $data)
    {
        $role = Role::find($data['role']['id']);

        // dd($role);

        $permissions = [];

        foreach ($data['permissions'] as $permission) {
            array_push($permissions, $permission['name']);
        }

        // percorre cada permissão adicioando a regra caso não exista
        foreach ($permissions as $permission) {
            // dd($permission);
            if (!$role->hasPermissionTo($permission)) {
                $role->givePermissionTo($permission);
            }
            else {
                $role->revokePermissionTo($permission);
            }
        }


        // dd($data['permissions']['name']);



        // $role->permissions()->sync($data['permissions']->name);

        return $role;
    }

    public function setUserRole(Array $data)
    {
        $user = User::find($data['user']['id']);

        $role = Role::find($data['role']['id']);

        $user->assignRole($role);

        return $user;
    }


}
