<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use App\Models\Bisemanas\Bisemana;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Config\Ano;
use App\Models\Paineis\Painel;
use App\Models\Reservas\Reserva;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use PDF;


class RelOcupacaoController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    public function relOcupacao() {

        $anos = Ano::all();
        $paineis = Painel::orderByRaw("CAST(identificacao AS UNSIGNED) ASC")->get();

        return Inertia::render('Relatorios/Ocupacao/RelOcupacao', compact('anos', 'paineis'));

    }

    public function setRelOcupacao(Request $request) {

        $ano_id = $request->anoId;
        $paineis_id = $request->idPaineis;
        $bs_id = $request->bsId;
        $todos_paineis = $request->todosPaineis;

        
        // Store in session
        session(['ano_id' => $ano_id]);
        session(['paineis_id' => $paineis_id]);
        session(['bs_id' => $bs_id]);
        session(['todos_paineis' => $todos_paineis]);
        
        return response()->json(['success' => true]);
    }
    
    public function getRelOcupacao()
    {
        $dt_atual = Carbon::today()->toDateString();
        $dt_atual = explode('-', $dt_atual);
        $dt_atual = $dt_atual[2].'/'.$dt_atual[1].'/'.$dt_atual[0];

        if(session('todos_paineis') == 'true') {
            $paineis = Painel::orderByRaw("CAST(identificacao AS UNSIGNED) ASC")->get();
        } else {
            $paineis = Painel::find(session('paineis_id'));
        }

        $ano = Ano::find(session('ano_id'));

        $min_bisemana_id = Bisemana::where('ano_id', session('ano_id'))->min('id');

        $qtd_bs = Bisemana::where('ano_id', session('ano_id'))
                    ->where('id', '<=', session('bs_id'))
                    ->count();
        
        $qtds_bs_res = Reserva::select('outdoor_id', DB::raw('COUNT(*) as total_reservas'))
                    ->whereBetween('bisemana_id', [$min_bisemana_id, session('bs_id')])
                    ->whereIn('outdoor_id', session('paineis_id'))
                    ->groupBy('outdoor_id')
                    ->get();
              

        // dd($qtd_bs_res);


        $ultima_bs = Bisemana::where('ano_id', session('ano_id'))
                  ->where('id', session('bs_id'))
                  ->first();


        $pdf = PDF::loadView('relatorios.ocupacao.rel_ocupacao', compact('dt_atual', 'ano', 'paineis', 'qtd_bs', 'ultima_bs', 'qtds_bs_res'));
                return $pdf->setPaper('a4', 'landscape')->stream('Rel-Ocupacao.pdf');


    
    }
    
}
