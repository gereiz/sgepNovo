<?php

namespace App\Http\Controllers\Arquivos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use App\Models\PI\Pi;

class ArquivosController extends Controller
{

    public function index() {

        $ambiente = env('APP_ENV');
        $anos = Ano::all();
        $bisemanas = Bisemana::all();

        $pis = Pi::with(['cliente'])->get();

        return Inertia::render('Arquivos/PisGeradas', compact('ambiente', 'anos', 'bisemanas', 'pis'));
    }


    public function getPiBs(Request $request) {
        $pis = Pi::with(['cliente'])->where('id_bisemana', $request->idBs)
                ->get();

        return $pis;
    }

}
