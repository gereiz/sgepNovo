<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use App\Models\Enderecos\Bairro;
use App\Models\Bisemanas\Bisemana;
use App\Models\Enderecos\Cidade;
use Illuminate\Http\Request;
use App\Models\User;
use PDF;
use DB;
use App\Models\Clientes\Cliente;
use App\Models\Config\Ano;
use App\Models\Enderecos\Regiao;
use App\Models\Reservas\Reserva;
use Inertia\Inertia;

class RelColagemController extends Controller
{
    
    public function __construct() {
        $this->middleware('auth');
    }
    
    public function relColagem () {
        $anos = Ano::all();
        $user = auth()->user()->name;
        $usuarios = User::all();
        $clientes = Cliente::all();
        $bisemanas = Bisemana::all();
        $cidades = Cidade::OrderBy('nome')->get();
        $regioes = Regiao::where('cidade_id', session('cidade_id'));
        $bairros = Bairro::OrderBy('nome')->get();

        return Inertia::render('Relatorios/RelColagem', compact('anos', 'bisemanas', 'cidades', 'regioes', 'bairros'));
    }


    public function setRelColagem(Request $request) {
        $anoBs = $request->anoBs;
        $bisemanas = Bisemana::where('ano_id', $anoBs)->get();


        if(isset($request->numBs)) {
            session(['num_bs' => $request->numBs]);
            session(['cliente' => $request->cliente]);
            session(['orientacao' => $request->orient]);
        }
        

        return session('num_bs');

        return response()->json(compact('regioes', 'bairros'));
    }


    public function setRegioes(Request $request) {
        
        $regioes = Regiao::where('cidade_id', $request->cidId)->get();

        return $regioes;
        
        
    }


    public function setBairros(Request $request) {

        $bairros = Bairro::where('regiao_id', $request->regId)->get();

        return $bairros;

    }


    public function getRelColagem(Request $request) {

        $reservas = Reserva::all();
        $user = auth()->user()->name;
        $usuarios = User::all();
        $bisemana_id = session('num_bs');
        $bisemana = Bisemana::where('id', $bisemana_id)->first();
        
        $rel_bs_ant = Reserva::where('bisemana_id', '<', $bisemana_id)
                               ->OrderBy('bisemana_id', 'DESC')
        ->get();


        $cidade = $request->cidade;
        $regiao = $request->regiao;
        $bairro = $request->bairro;
        $cliente = $request->cliente;

        $cidades = Cidade::all();
        $regioes = Regiao::all();
        $bairros = Bairro::all();

        $orientacao = ($request->orient == 0) ? '' : 'landscape';


        $rel_bisemana = DB::table('reservas as res')
                                 ->select('res.campanha', 'b.nome as bairro' , 'res.cliente_id',  'out.identificacao as ident', 'out.posicao as posicao', 'out.logradouro as logradouro',
                                 'out.numero as numero', 'res.outdoor_id as outdoor_id', 'c.id as cidade_id',  'r.id as regiao_id', 'c.nome as cidade', 'r.nome as regiao')
                                 ->join('outdoors as out', 'out.id', '=', 'res.outdoor_id')
                                 ->join('bairros as b', 'b.id', '=', 'out.bairro_id')
                                 ->join('regioes as r', 'r.id', '=', 'b.regiao_id')
                                 ->join('cidades as c', 'c.id', '=', 'r.cidade_id')
                                 ->where([['bisemana_id', $bisemana_id]])
                                 ->OrderBy('r.nome')
                                 ->OrderBy('b.nome')
                                 ->OrderBy('c.nome')
        ->get();


        if($rel_bisemana->isEmpty() ) {
            return back()->with('error', 'Não existem reservas no período selecionado.');
        
        } else {
            $pdf = PDF::loadView('relatorios.paineis.rel_colagem_bs', compact('usuarios', 'rel_bisemana', 'bisemana',
            'cidades', 'bairros', 'regioes','rel_bs_ant'));
        
            return $pdf->setPaper('a4', $orientacao)->stream('Rel-Colagem.pdf');

        }

    
         
        
    }
}
