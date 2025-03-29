<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $table = 'reservas';
    
    protected $fillable = [
        'user_id',
        'valor_total',
        // Add other fields as needed
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}