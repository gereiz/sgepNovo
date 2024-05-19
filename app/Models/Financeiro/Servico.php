<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servico extends Model
{
    use HasFactory;

    protected $table = 'servicos';
    protected $fillable = ['nome', 'descricao', 'valor', 'id_user'];
}
 