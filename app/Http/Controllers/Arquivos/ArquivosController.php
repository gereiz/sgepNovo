<?php

namespace App\Http\Controllers\Arquivos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use App\Models\PI\Pi;
use App\Models\Vendas\Os;

class ArquivosController extends Controller
{

    public function index() {

        $ambiente = env('APP_ENV');
        $anos = Ano::all();
        $bisemanas = Bisemana::all();

        $pis = Pi::with(['cliente'])->get();

        return Inertia::render('Arquivos/PisGeradas', compact('ambiente', 'anos', 'bisemanas', 'pis'));
    }

    public function vendas() {
        $ambiente = env('APP_ENV');
        $anos = Ano::all();
        $bisemanas = Bisemana::all();
        $vendas = Os::with(['cliente'])->where('cancelada', 0)->get();

        return Inertia::render('Arquivos/VendasGeradas', compact('ambiente', 'anos', 'bisemanas', 'vendas'));
    }


    public function getPiBs(Request $request) {
        $pis = Pi::with(['cliente'])->where('id_bisemana', $request->idBs)
                ->get();

        return $pis;
    }

    public function getOsBs(Request $request) {
        $os = Os::with(['cliente'])->where('id_bisemana', $request->idBs)->where('cancelada', 0)->get();
        return $os;
    }

}
