<?php

namespace App\Models\Reservas;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enderecos\Bisemana;
use App\Models\Enderecos\Cliente;
use App\Models\Paineis\Painel;

class Reserva extends Model
{
    use HasFactory;


    public $timestamps = false;
    protected $table = 'reservas';
    protected $fillable = ['cliente_id',
                            'outdoor_id',
                            'bisemana_id',
                            'dt_reserva',
                            'campanha',
                            'observacao',
                            'pi_ok',
                            'user_id'
                        ];
 
    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id', 'id');
    }
    

    public function bairro()
    {
        return $this->hasOne(Bairro::class, 'bairro_id', 'id');
    }

 
    public function painel()
    {
        return $this->belongsTo(Painel::class, 'outdoor_id', 'id');
    }


    public function bisemana()
    {
        return $this->belongsTo(Bisemana::class, 'bisemana_id', 'id');
    }


    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
