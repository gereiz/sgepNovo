<?php

namespace App\Models\Enderecos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\Bairro;

class Regiao extends Model
{

    use HasFactory;

    public $timestamps = false;
    protected $table = 'regioes';
    protected $fillable = ['nome', 'cidade_id'];

    public function cidade()
    {
        return $this->belongsTo(Cidade::class, 'cidade_id');
    }
 
    public function bairro()
    {
        return $this->hasMany(Bairro::class, 'regiao_id', 'id');
    }
}
