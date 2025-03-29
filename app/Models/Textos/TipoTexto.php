<?php

namespace App\Models\Textos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TipoTexto extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'tipo_texto';

    protected $fillable = [
        'nome',
        'descricao'
    ];

    protected $softDelete = true;
    public $timestamps = true;
}
