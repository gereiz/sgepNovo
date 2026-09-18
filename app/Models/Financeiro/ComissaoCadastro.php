<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComissaoCadastro extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'comissoes';

    protected $fillable = [
        'nome',
        'descricao',
        'tipo_comissao',
        'valor',
        'aplicavel_a',
        'status',
        'id_user',
    ];

    protected $casts = [
        'tipo_comissao' => 'integer',
        'valor' => 'decimal:2',
        'status' => 'integer',
        'id_user' => 'integer',
    ];

    public function usuario()
    {
        return $this->belongsTo(\App\Models\User::class, 'id_user');
    }
}
