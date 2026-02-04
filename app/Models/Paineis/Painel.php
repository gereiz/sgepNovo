<?php

namespace App\Models\Paineis;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Regiao;
use App\Models\Reservas\Reserva;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Painel extends Model
{
    use HasFactory;
    use SoftDeletes;


    protected $table = 'outdoors';

    protected $fillable = ['identificacao',
                            'ident_antiga',
                            'tipo',
                            'bairro_id',
                            'logradouro',
                            'numero',
                            'cadan',
                            'posicao',
                            'dimensao',
                            'dimensao_lona',
                            'ponto_referencia',
                            'latitude',
                            'longitude',
                            'image_url'
                        ];


    public function bairro()
    {
        return $this->HasOne(Bairro::class, 'id', 'bairro_id');
    }


    public function reservas()
    {
        return $this->hasMany(Reserva::class, 'outdoor_id', 'id');
    }

    public function getImageUrlAttribute($value)
    {
        $dir = 'outdoorImages/'.$this->identificacao;
        $files = Storage::disk('public')->files($dir);
        if (empty($files)) {
            return $value;
        }
        $files = array_filter($files, function ($f) {
            return basename($f) !== 'CompressedJpgImage.jpg';
        });
        usort($files, function ($a, $b) {
            return Storage::disk('public')->lastModified($b) <=> Storage::disk('public')->lastModified($a);
        });
        $keep = array_slice($files, 0, 2);
        $toDelete = array_slice($files, 2);
        if (!empty($toDelete)) {
            Storage::disk('public')->delete($toDelete);
        }
        return $keep[0] ?? $value;
    }

}
 
