<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bisemanas\Bisemana;
use App\Models\Paineis\Painel;
use Illuminate\Support\Facades\Storage;
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

        $user = auth()->user()->name;
        $paineis = session('paineis');
        $status = 'Disponíveis';
        $bisemana = Bisemana::where('id', session('num_bs'))->first();
        $numBisemana = $bisemana->num_bisemana;
        $periodo = date('d/m/Y',  strtotime($bisemana->inicio)).' a '.date('d/m/Y',  strtotime($bisemana->fim));
        $envio = $request->tpEnvio;

        $fileName = 'Paineis_Disponiveis_Bi-semana_'.$numBisemana.'.pdf';


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

        return $pdf->download('Paineis_disponiveis_'.$periodo.'.pdf');

    }
}
