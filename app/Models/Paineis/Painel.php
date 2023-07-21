<?php

namespace App\Models\Paineis;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enderecos\Bairro;

class Painel extends Model
{
    use HasFactory;


    protected $table = 'outdoors';


    public function bairro()
    {
        return $this->belongsTo(Bairro::class, 'bairro_id');
    }

    public function reserva()
    {
        return $this->hasMany(Reserva::class, 'id', 'outdoor_id');
    }
}
