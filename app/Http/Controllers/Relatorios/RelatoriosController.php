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
        $bisemanas_ano = Bisemana::where('ano_id', $bisemana->ano_id)->pluck('id')->toArray();

        // dd($bisemanas_ano);



        $pdf = PDF::loadView('relatorios.paineis.rel_disponiveis', compact('numBisemana',
                                                                            'periodo',
                                                                            'paineis',
                                                                            'status',
                                                                            'user',
                                                                            'bisemanas_ano'
                                                                        ));



        if($envio === 'wpp') {
            Storage::put(('public/pdf/disp'.$fileName), $pdf->output());
            return env('APP_URL').Storage::url('pdf/disp'.$fileName);

        }

        return $pdf->download('Paineis_disponiveis_'.$periodo.'_'.$time.'.pdf');

    }


    public function relPaineis(Request $request) {
        $tZone = new \DateTimeZone('America/Sao_paulo');
        $user = auth()->user()->name;
        $paineis = Painel::orderByRaw("CAST(identificacao AS UNSIGNED) ASC")->get();
        $status = 'Disponíveis';
        $bisemana = Bisemana::where('id', session('num_bs'))->first();
        $numBisemana = $bisemana->num_bisemana;
        $periodo = date('d/m/Y',  strtotime($bisemana->inicio)).' a '.date('d/m/Y',  strtotime($bisemana->fim));
        $envio = $request->tpEnvio;
        $time = Carbon::now($tZone)->toTimeString();
        $fileName = 'Paineis_Disponiveis_Bi-semana_'.$numBisemana.'_'.$time.'.pdf';


        $pdf = PDF::loadView('relatorios.paineis.rel_paineis', compact('numBisemana',
                                                                            'periodo',
                                                                            'paineis',
                                                                            'status',
                                                                            'user'
                                                                        ));



        if($envio === 'wpp') {
            Storage::put(('public/pdf/disp'.$fileName), $pdf->output());
            return env('APP_URL').Storage::url('pdf/disp'.$fileName);

        }

        return $pdf->download('Paineis_disponiveis_'.$periodo.'_'.$time.'.pdf');

    }

    public function RelReservaCliente() {

        $clientes = Cliente::orderBy('nome_fantasia')->get();
        $anos = Ano::all();


        return Inertia::render('Relatorios/Reservas/RelReservaCliente', compact('clientes', 'anos'));
    }

    public function setCLiente(Request $request) {
        $rawCliente = $request->input('cliente');
        $clienteId = is_array($rawCliente)
            ? ($rawCliente['id'] ?? null)
            : (is_object($rawCliente) ? ($rawCliente->id ?? null) : $rawCliente);

        session(['cliente' => $clienteId]);

        return session('cliente');
    }

    public function setBsCliente(Request $request) {

        session(['num_bs' => $request->numBs]);

        return session('num_bs');
    }

    public function setRelReservaCliente(Request $request) {

        $anoBs = $request->anoBs;
        $bisemanas = Bisemana::where('ano_id', $anoBs)->get();


        if(isset($request->numBs)) {
            session(['orientacao' => $request->orient]);
        }

        return $bisemanas;

    }

    public function getRelReservaCliente(Request $request) {
        $tZone = new \DateTimeZone('America/Sao_paulo');
        $user = auth()->user()?->name ?? 'Sistema';

        if ($request->filled('cliente')) {
            $rawReqCliente = $request->input('cliente');
            $reqClienteId = is_array($rawReqCliente)
                ? ($rawReqCliente['id'] ?? null)
                : (is_object($rawReqCliente) ? ($rawReqCliente->id ?? null) : $rawReqCliente);
            if ($reqClienteId) {
                session(['cliente' => $reqClienteId]);
            }
        }

        if ($request->filled('bisemana') || $request->filled('numBs')) {
            $reqBsId = $request->input('bisemana') ?? $request->input('numBs');
            if ($reqBsId) {
                session(['num_bs' => $reqBsId]);
            }
        }

        if ($request->filled('orient')) {
            session(['orientacao' => $request->input('orient')]);
        }

        $rawCliente = session('cliente');
        $clienteId = is_array($rawCliente)
            ? ($rawCliente['id'] ?? null)
            : (is_object($rawCliente) ? ($rawCliente->id ?? null) : $rawCliente);

        $rawBs = session('num_bs');
        $bsId = is_array($rawBs)
            ? ($rawBs['id'] ?? null)
            : (is_object($rawBs) ? ($rawBs->id ?? null) : $rawBs);

        $bisemana = $bsId ? Bisemana::find($bsId) : null;
        $numBisemana = $bisemana?->num_bisemana ?? '';
        $periodo = $bisemana
            ? date('d/m/Y', strtotime($bisemana->inicio)).' a '.date('d/m/Y', strtotime($bisemana->fim))
            : '';

        $cliente = $clienteId ? Cliente::find($clienteId) : null;
        $clienteNome = $cliente
            ? ($cliente->nome_fantasia ?: ($cliente->razao_social ?: 'Cliente'))
            : 'Cliente';

        $time = Carbon::now($tZone)->toTimeString();

        $paineis = ($bsId && $clienteId)
            ? Reserva::with('painel.bairro.regiao.cidade')
                ->where([['bisemana_id', $bsId], ['cliente_id', $clienteId]])
                ->get()
            : collect();

        $dt_atual = Carbon::today()->format('d/m/Y');

        $pdf = PDF::loadView('relatorios.paineis.rel_paineis_x_cliente', compact(
            'numBisemana',
            'periodo',
            'paineis',
            'cliente',
            'user',
            'dt_atual'
        ));

        $orient = $request->input('orient') ?? session('orientacao', 'L');
        $orientation = $orient === 'P' ? 'portrait' : 'landscape';

        return $pdf->setPaper('a4', $orientation)->stream('Painéis_'.$clienteNome.'_BS-'.$numBisemana.'_'.$time.'.pdf');
    }



}
