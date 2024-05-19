<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Funcao extends Model
{
    use HasFactory;

    protected $table = 'funcoes';
    protected $fillable = ['cargo', 'descricao', 'id_user'];


    public function user()
    {
        return $this->belongsTo(User::class, 'function', 'id');
    }
}
