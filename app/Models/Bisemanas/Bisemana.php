<?php

namespace App\Models\Bisemanas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Reserva;

class Bisemana extends Model
{
    use HasFactory;


    protected $table = 'bisemanas';

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'bisemana_id', 'id');
    }
}
