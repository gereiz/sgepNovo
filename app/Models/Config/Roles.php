<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $fillable = ['name', 'code', 'guard_name'];


    public function users() {
        return $this->hasMany('App\Models\User');
    }


    public function permissions() {
        return $this->belongsToMany('App\Models\Config\Permissions', 'role_has_permissions', 'role_id', 'permission_id');
    }

}
