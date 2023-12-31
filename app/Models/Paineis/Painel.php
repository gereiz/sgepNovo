<?php

namespace App\Models\Paineis;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Regiao;
use App\Models\Reservas\Reserva;

class Painel extends Model
{
    use HasFactory;


    protected $table = 'outdoors';

    protected $fillable = ['identificacao',
                            'ident_antiga',
                            'tipo',
                            'bairro_id',
                            'logradouro',
                            'numero',
                            'cadan',
                            'posicao',
                            'dimensao',
                            'dimensao_lona',
                            'ponto_referencia',
                            'latitude',
                            'longitude',
                            'image_url'
                        ];


    public function bairro()
    {
        return $this->HasOne(Bairro::class, 'id', 'bairro_id');
    }


    public function reserva()
    {
        return $this->hasMany(Reserva::class, 'id', 'outdoor_id');
    }
}
 