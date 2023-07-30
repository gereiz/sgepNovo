<?php

namespace App\Http\Controllers\Reserva;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Bisemanas\Bisemana;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\Regiao;
use App\Models\Paineis\Painel;
use Illuminate\Http\Request;
use App\Models\Reservas\Reserva;

use DB;


class ReservaController extends Controller
{
    
    public function index() {

        $paineis = Painel::with('bairro.regiao')->get();


        $reservados = Painel::with('bairro.regiao')
                           ->join('reservas AS res', 'res.outdoor_id', '=', 'out.id')
                           ->where('res.bisemana_id','=', 28)
                           ->groupBY('out.id')
                           ->distinct()
        ->get();


        $disponiveis = Painel::with('bairro.regiao')
                          ->join('reservas AS res', 'res.outdoor_id', '=', 'out.id')
                          ->whereNotIn('out.id', $reservados->pluck('outdoor_id'))
                          ->groupBY('out.id')
                          ->orderBy('out.identificacao')
        ->get();


        $reservas = DB::table('reservas AS res')
                        ->join('outdoors AS out', 'res.outdoor_id', '=', 'out.id')
        ->get();

        $bisemanas = Bisemana::all();

        $bairros = Bairro::orderBy('nome')->get();
        
        $regioes = Regiao::orderBy('nome')->get();

        $cidades = Cidade::orderBy('nome')->get();


        return Inertia::render('Paineis/ReservaPaineis', compact('reservas',
                                                                                            'paineis',
                                                                                            'disponiveis',
                                                                                            'reservados',
                                                                               'bisemanas',
                                                                               'bairros',
                                                                               'regioes',
                                                                            'cidades'));

    }


    public function getPaineis(Request $request) {
        
        $paineis = Painel::with('bairro.regiao')->get();

        $reservados = Painel::with('bairro.regiao')
                           ->join('reservas AS res', 'res.outdoor_id', '=', 'out.id')
                           ->where('res.bisemana_id','=', 28)
                           ->groupBY('out.id')
                           ->distinct()
        ->get();

        $disponiveis = Painel::with('bairro.regiao')
                          ->join('reservas AS res', 'res.outdoor_id', '=', 'out.id')
                          ->whereNotIn('out.id', $reservados->pluck('outdoor_id'))
                          ->groupBY('out.id')
                          ->orderBy('out.identificacao')
            ->get();
  
        if($request->status == 1) {
            
            $paineis = $disponiveis;

        } elseif($request->status == 2) {
           
            $paineis = $reservados;

        }
    
       
        

        return response()->json($paineis);
    }
}