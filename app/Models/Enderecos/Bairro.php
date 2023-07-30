<?php

namespace App\Models\Enderecos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bairro extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'bairros';
    protected $fillable = ['nome', 'regiao_id'];


    public function regiao()
    {
        return $this->belongsTo(Regiao::class, 'regiao_id');
    }
    
}
