<?php

namespace App\Http\Controllers\Financeiro;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComissoesController extends Controller
{
    public function index()
    {
        return Inertia::render('Financeiro/ListaComissoes');
    }
}
