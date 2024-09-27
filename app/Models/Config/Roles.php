<?php

namespace App\Models\Config;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    use HasFactory;

    protected $table = 'roles';
    protected $fillable = ['name', 'access_levels', 'is_active'];


    public function users() {
        return $this->hasMany('App\Models\User');
    }

}
