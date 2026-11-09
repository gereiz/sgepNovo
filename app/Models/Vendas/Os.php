<?php

namespace App\Models\Vendas;

use App\Models\Bisemanas\Bisemana;
use App\Models\Clientes\Cliente;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Os extends Model
{
    use HasFactory;

    protected $table = 'os';

    protected $fillable = [
        'id_cliente',
        'arquivo',
        'id_paineis',
        'contato',
        'campanha',
        'id_bisemana',
        'vl_unit',
        'vl_desc',
        'vl_custo',
        'vl_total',
        'pago',
        'dt_pgto',
        'forma_pagamento',
        'vendedor',
        'obs',
        'cancelada',
    ];

    public $timestamps = true;

    public function cliente()
    {
        return $this->hasOne(Cliente::class, 'id', 'id_cliente');
    }

    public function bisemana()
    {
        return $this->hasOne(Bisemana::class, 'id', 'id_bisemana');
    }
}
