<?php

namespace App\Models\Bisemanas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Reservas\Reserva;
use App\Models\Pi\Pi;

class Bisemana extends Model
{
    use HasFactory;


    protected $table = 'bisemanas';

    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'bisemana_id', 'id');
    }

    public function pi()
    {
        return $this->hasMany(Pi::class, 'bisemana_id', 'id');
    }
}
