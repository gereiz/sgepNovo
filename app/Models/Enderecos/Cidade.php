<?php

namespace App\Models\Enderecos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cidade extends Model
{
    public $timestamps = false;
    protected $table = 'cidades';
    protected $fillable = ['nome', 'uf_id'];

    use HasFactory;

    public function uf()
    {
        return $this->belongsTo(UF::class, 'uf_id');
    }

    public function regiao() 
    {
        return $this->hasMany(Regiao::class, 'cidade_id', 'id');
    }

    
}
