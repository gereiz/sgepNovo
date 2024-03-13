<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Config\Ano;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\Regiao;
use App\Models\Enderecos\Bairro;
use App\Models\Bisemanas\Bisemana;
use Inertia\Inertia;
use PDF;
use DB;


class RelPainXCliController extends Controller
{

    public function __construct() {
        $this->middleware('auth');
    }


    public function index() {

        $anos = Ano::all();

        return Inertia::render('Relatorios/PaineisXClientes/RelPainXCli', compact('anos'));
    }

    public function setRelPainXCli(Request $request) :void {

        session(['bisemana_id' => $request->bsId]);
        session(['orientacao' => $request->orient]);
 
    }


    public function getRelPainXCli(Request $request) {


        $cidades = Cidade::all();
        $regioes = Regiao::all();
        $bairros = Bairro::all(); 
        $bisemana_id = session('bisemana_id');
        $bisemana = Bisemana::where('id', $bisemana_id)->first();


        $reservas = DB::table('reservas as res')
                    ->select('res.campanha', 'cli.nome_fantasia', 'res.bisemana_id', 'res.cliente_id', 'us.name', DB::raw('COUNT(*) as count_campanha'))
                    ->where('res.bisemana_id', $bisemana_id)
                    ->join('clientes as cli', 'res.cliente_id', 'cli.id')
                    ->join('users as us', 'res.user_id', 'us.id')
                    ->orderBy('res.cliente_id')
                    ->groupBy('res.cliente_id', 'res.campanha', 'cli.nome_fantasia', 'res.bisemana_id')
                    ->get();


        $count_res = DB::table('reservas as res')->select(DB::raw('COUNT(*) as count_campanha'))
                    ->where('res.bisemana_id', $bisemana_id)
                    ->get();

        // dd($reservas);


        $orientacao = (session('orientacao') == 'P') ? 'portrait' : 'landscape';

        $pdf = PDF::loadView('relatorios.paineisXclientes.rel_pain_x_cli', compact('reservas','count_res', 'bisemana'));
        
            return $pdf->setPaper('a4', $orientacao)->stream('Paineis_X_Cliente.pdf');
    }


}
