<?php

namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Financeiro\Servico;

class Comissao extends Model
{
    use HasFactory;

    protected $table = 'comissao';

    protected $fillable = [
        'id_funcionario',
        'id_servico',
        'valor',
        'tipo_comissao',
        'created_at',
        'updated_at',
        'id_user',
    ];


    public function servico()
    {
        return $this->hasOne(Servico::class, 'id', 'id_servico');
    }

}
