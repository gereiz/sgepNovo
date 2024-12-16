<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CentroCusto extends Model
{
    use HasFactory;

    protected $table = 'centro_custo';

    protected $fillable = [
        'id_tipo',
        'centro_custo',
    ];


    protected $softDelete = true;
    public $timestamps = true;


}
