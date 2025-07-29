<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use PDF;

class RelComissaoController extends Controller
{
    public function index() {

        return Inertia::render('Relatorios/Comissao/RelComissao');
    }


    public function setRelComissoes(Request $request) {

        session(['agentes' => $request->agentes]);
        session(['bisemanas' => $request->bisemanas]);
        session(['pis' => $request->pis]);
        session(['comissoes' => $request->comissoes]);
        


        return response()->json(['success' => true]);
    }

    public function getRelComissoes() {

        $dt_atual = Carbon::today()->format('d/m/Y');
        $agentes = session('agentes');
        $bisemanas = session('bisemanas');
        $pis = session('pis');
        $comissoes = session('comissoes');



        // dd($agentes, $bisemanas, $pis);

        $pdf = PDF::loadView('relatorios.comissao.rel_comissoes', compact('dt_atual', 'agentes', 'bisemanas', 'pis', 'comissoes'));
        return $pdf->setPaper('a4', 'landscape')->stream('Rel-Comissoes.pdf');
    }


}
