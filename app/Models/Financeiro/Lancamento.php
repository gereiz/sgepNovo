<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lancamento extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'lancamentos';

    protected $fillable = [
        'descricao',
        'valor',
        'valor_liquido',
        'parcelas',
        'dt_faturamento',
        'centro_custo',
        'tipo_lancamento',
        'id_reserva',
        'observacoes',
        'status_pagamento',
    ];

    protected $softDelete = true;
    public $timestamps = true;


    public function centroCusto()
    {
        return $this->belongsTo(CentroCusto::class, 'centro_custo');
    }

    public function tipoLancamento()
    {
        return $this->belongsTo(TipoLancamento::class, 'tipo_lancamento');
    }
}
