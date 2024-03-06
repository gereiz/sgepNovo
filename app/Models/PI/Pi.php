<?php

namespace App\Models\PI;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Clientes\Cliente;
use App\Models\Paineis\Painel;
use App\Models\Bisemanas\Bisemana;

class Pi extends Model
{
    use HasFactory;

    protected $table="pi";

    protected $fillable = ['id_cliente',
                            'id_paineis',
                            'contato',
                            'campanha',
                            'id_bisemana',
                            'vl_unit',
                            'vl_desc',
                            'vl_total',
                            'pago',
                            'dt_pgto',
                            'forma_pagamento',
                            'vendedor',
                            'obs'
    ];


    public function cliente()
    {
        return $this->HasOne(Cliente::class, 'id', 'id_cliente');
    }


    public function painel()
    {
        return $this->hasMany(Painel::class, 'id', 'id_paineis');
    }

    public function bisemana()
    {
        return $this->hasOne(Bisemana::class, 'id', 'id_bisemana');
    }

}
