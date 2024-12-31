<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CentroCusto extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'centro_custo';

    protected $fillable = [
        'id_tipo',
        'centro_custo',
    ];


    protected $softDelete = true;
    public $timestamps = true;


}
