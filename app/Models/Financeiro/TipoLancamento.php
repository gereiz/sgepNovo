<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class TipoLancamento extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tipo_lancamento';

    protected $fillable = [
        'tipo',

    ];

    protected $softDelete = true;
    public $timestamps = true;

}
