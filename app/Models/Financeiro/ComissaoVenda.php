<?php 
namespace App\Models\Financeiro;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComissaoVenda extends Model
{
    use HasFactory;

    protected $table = 'comissao_venda';


    protected $fillable = [
        'pi_id',
        'comissao_id',
        'agente_id',
        'valor_comissao',
    ];

    // protected $softDelete = true;
    public $timestamps = true;

}
