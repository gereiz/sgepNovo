<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Financeiro\Comissao;

class Servico extends Model
{
    use HasFactory;

    protected $table = 'servicos';
    protected $fillable = ['nome', 'descricao', 'valor', 'id_user', 'comissao', 'tipo_comissao'];


    public function comissoes()
    {
        return $this->hasMany(Comissao::class, 'id_servico', 'id');
    }
}
 