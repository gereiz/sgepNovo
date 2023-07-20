<?php

namespace App\Http\Controllers\Paineis;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Paineis\Painel;
use Illuminate\Http\Request;


class PaineisController extends Controller
{
    
    public function index() {

        $paineis = Painel::all();

        return Inertia::render('Paineis/ListaPaineis', compact('paineis'));

    }
}
