<?php

namespace App\Models\Clientes;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';

    protected $fillable = ['razao_social',
                            'nome_fantasia',
                            'cpf_cnpj',
                            'nro_insc',
                            'endereco',
                            'num',
                            'bairro',
                            'cidade',
                            'uf',
                            'cep',
                            'responsavel',
                            'tel_responsavel',
                            'email_responsavel',
                            'email',
                            'telefone',
                            'celular',
                            'tipo',
                            'ativo',
                        ];




}
