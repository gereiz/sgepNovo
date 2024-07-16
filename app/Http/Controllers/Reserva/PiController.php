<?php

namespace App\Http\Controllers\Reserva;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PI\Pi;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\UF;
use Carbon\Carbon;
use App\Models\Bisemanas\Bisemana;
use PDF;


class PiController extends Controller
{

    public function sessionData(Request $request) {

 
        if($request->cliente) {
            session(['cliente' => $request->cliente]);
        }

        if($request->dtPgto) {
            session(['dt_pgto' => $request->dtPgto]);
        }

        if($request->formPi) {
            session(['dadosPi' => $request->formPi]);
        }

        PiController::storePi();

        return session()->all();

    }



    public function storePi() {
        // dd(session('dadosPi'));
        $dt_pgto = explode('/', session('dadosPi')['Two']['dtPgto']);
        $data_pgto = $dt_pgto[2].'-'. $dt_pgto[1].'-'.$dt_pgto[0];
        $data_pgto_formated = session('dadosPi')['Two']['dtPgto'];

        $pi = Pi::where('id_cliente', session('dadosPi')['One']['clienteId'])
        ->where('id_bisemana', session('dadosPi')['Two']['bisemanaId'])
        ->orderByDesc('id')
        ->first();
                

        if(!$pi) {
            $pi = Pi::create([
                'id_cliente' => session('dadosPi')['One']['clienteId'],
                'id_paineis' => json_encode(session('dadosPi')['Two']['paineis'][0]),
                'contato' => session('dadosPi')['One']['responsavel'],
                'campanha' => session('dadosPi')['Two']['campanha'],
                'id_bisemana' => session('dadosPi')['Two']['bisemanaId'],
                'vl_unit' => session('dadosPi')['Two']['vlr_unit'],
                'vl_desc' => session('dadosPi')['Two']['vlr_desc'],
                'vl_total' => session('dadosPi')['Two']['vlr_total'],
                'pago' => session('dadosPi')['Two']['pgto'],
                'dt_pgto' => $data_pgto,
                'forma_pagamento' => session('dadosPi')['Two']['formaPgto'],
                'vendedor' => session('dadosPi')['Two']['userId'],
                'obs'
            ]);
    
        }
        
        
        // $pi = Pi::where('id_cliente', session('dadosPi')['One']['clienteId'])
        //         ->where('id_bisemana', session('dadosPi')['Two']['bisemanaId'])
        //     ->orderByDesc('id')
        // ->first();

        $bisemana = Bisemana::where('id', session('dadosPi')['Two']['bisemanaId'])->first();



        $bs_ini = explode('-', $bisemana->inicio);
        $bs_inicio = $bs_ini[2].'/'.$bs_ini[1].'/'.$bs_ini[0];

        $bs_fin = explode('-', $bisemana->fim);
        $bs_final = $bs_fin[2].'/'.$bs_fin[1].'/'.$bs_fin[0];

        $dt_atual = Carbon::today()->toDateString();
        $dt_atual = explode('-', $dt_atual);
        $dt_atual = $dt_atual[2].'/'.$dt_atual[1].'/'.$dt_atual[0];


        $bairro = Bairro::where('id', session('cliente')['bairro'])->first();
        $cidade = Cidade::where('id', session('cliente')['cidade'])->first();
        $uf = UF::where('id', session('cliente')['uf'])->first();

        // dd(session('cliente')['bairro']);

        $pdf = PDF::loadView('relatorios.pi.pi', compact('pi', 'data_pgto_formated', 'bs_inicio', 'bs_final', 'bairro', 'cidade', 'uf', 'dt_atual'));

        return $pdf->setPaper('a4','landscape')->stream('PI_teste');


    }




}
