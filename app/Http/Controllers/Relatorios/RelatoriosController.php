<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bisemanas\Bisemana;
use App\Models\Clientes\Cliente;
use App\Models\Config\Ano;
use App\Models\Enderecos\Bairro;
use App\Models\Paineis\Painel;
use App\Models\Reservas\Reserva;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Inertia\Inertia;
use PDF;



class RelatoriosController extends Controller
{


    public function setData(Request $request) {

        if(isset($request->numBs)) {
            session(['num_bs' => $request->numBs]);
            session(['paineis' => Painel::whereIn('id', $request->idPaineis)->get()]);
        }

        
    }


    public function relDisponiveis(Request $request) {
        $tZone = new \DateTimeZone('America/Sao_paulo');
        $user = auth()->user()->name;
        $paineis = session('paineis');
        $status = 'Disponíveis';
        $bisemana = Bisemana::where('id', session('num_bs'))->first();
        $numBisemana = $bisemana->num_bisemana;
        $periodo = date('d/m/Y',  strtotime($bisemana->inicio)).' a '.date('d/m/Y',  strtotime($bisemana->fim));
        $envio = $request->tpEnvio;
        $time = Carbon::now($tZone)->toTimeString();
        $fileName = 'Paineis_Disponiveis_Bi-semana_'.$numBisemana.'_'.$time.'.pdf';


        $pdf = PDF::loadView('relatorios.paineis.rel_disponiveis', compact('numBisemana',
                                                                            'periodo',
                                                                            'paineis',
                                                                            'status',
                                                                            'user'
                                                                        ));
       


        if($envio === 'wpp') {
            Storage::put(('public/pdf/'.$fileName), $pdf->output());
            return env('APP_URL').Storage::url('pdf/'.$fileName);

        }

        return $pdf->download('Paineis_disponiveis_'.$periodo.'_'.$time.'.pdf');

    }


    public function RelReservaCliente() {

        $clientes = Cliente::orderBy('nome_fantasia')->get();
        $anos = Ano::all();


        return Inertia::render('Relatorios/RelReservaCliente', compact('clientes', 'anos'));
    }



    public function setRelReservaCliente(Request $request) {

        $anoBs = $request->anoBs;
        $bisemanas = Bisemana::where('ano_id', $anoBs)->get();


        if(isset($request->numBs)) {
            session(['num_bs' => $request->numBs]);
            session(['cliente' => $request->cliente]);
            session(['orientacao' => $request->orient]);
        }

        return $bisemanas;

    }


    public function getRelReservaCliente(Request $request) {

        $tZone = new \DateTimeZone('America/Sao_paulo');
        $user = auth()->user()->name;
        $bisemana = Bisemana::where('id', session('num_bs'))->first();
        $numBisemana = $bisemana->num_bisemana;
        $periodo = date('d/m/Y',  strtotime($bisemana->inicio)).' a '.date('d/m/Y',  strtotime($bisemana->fim));
        $cliente = Cliente::where('id', session('cliente'))->first();
        $clienteNome = $cliente->nome_fantasia ? $cliente->nome_fantasia: $cliente->razao_social; 
        $time = Carbon::now($tZone)->toTimeString();

        $paineis = Reserva::with('painel.bairro.regiao.cidade')->where([['bisemana_id', session('num_bs')], ['cliente_id', session('cliente')]])->get();
 


        $pdf = PDF::loadView('relatorios.paineis.rel_paineis_x_cliente', compact('numBisemana',
                                                                            'periodo',
                                                                            'paineis',
                                                                            'cliente',
                                                                            'user'
                ));
       
                // $orientacao = (session('orientacao') === 'R') ? '' : 'landscape';


        return $pdf->setPaper('a4')->stream('Painéis_'.$clienteNome.'_BS-'.$numBisemana.'_'.$time.'.pdf');

    }



}
