<?php

namespace App\Models\Textos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TextoPadrao extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'texto_padrao';

    protected $fillable = [
        'title',
        'content',
        'type',
        'active',
    ];

    protected $softDelete = true;
    public $timestamps = true;
}
