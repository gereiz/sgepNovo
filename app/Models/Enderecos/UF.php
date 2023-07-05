<?php

namespace App\Models\Enderecos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UF extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'uf';
}
