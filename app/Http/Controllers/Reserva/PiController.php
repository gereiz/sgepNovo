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
use App\Models\Paineis\Painel;
use App\Services\ClienteService;
use App\Services\UsuarioService;
use Spatie\LaravelPdf\Facades\Pdf;
use \Spatie\LaravelPdf\Enums\Orientation;
use App\Models\Reservas\Reserva;

class PiController extends Controller
{
    private $clienteService;
    private $usuarioService;

    public function __construct(ClienteService $clienteService, UsuarioService $usuarioService) {
        $this->clienteService = $clienteService;
        $this->usuarioService = $usuarioService;
    }

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


        return session()->all();

    }



    public function storePi() {
        
        // dd(session('dadosPi'));
        // dd(session()->all());

        $idPaineis = session('dadosPi')['Two']['paineis'][0];
        $bsId = session('dadosPi')['Two']['bisemanaId'];

        $cliente = $this->clienteService->getCliente(session('dadosPi')['One']['clienteId']);
        $dt_pgto = explode('/', session('dadosPi')['Two']['dtPgto']);
        $data_pgto = $dt_pgto[2].'-'. $dt_pgto[1].'-'.$dt_pgto[0];
        $data_pgto_formated = session('dadosPi')['Two']['dtPgto'];
        $campanha = session('dadosPi')['Two']['campanha'];
        $observacoes = session('dadosPi')['Two']['observacoes'];
        
        if(session('dadosPi')['Two']['servicos'] != []) {
            $detalhes = session('dadosPi')['Two']['servicos'][0]['detalhes'];
        } 

        $bisemana = Bisemana::where('id', session('dadosPi')['Two']['bisemanaId'])->first();

        $bs_ini = explode('-', $bisemana->inicio);
        $bs_inicio = $bs_ini[2].'/'.$bs_ini[1].'/'.$bs_ini[0];
        $bs_ano = substr($bs_ini[0], 2, 2);
        $bs_fin = explode('-', $bisemana->fim);
        $bs_final = $bs_fin[2].'/'.$bs_fin[1].'/'.$bs_fin[0];
        $bs_formated = 'BS: '. $bisemana->num_bisemana.' - '.$bs_ini[2].'/'.$bs_ini[1]. ' à '.$bs_fin[2].'/'.$bs_fin[1].'/'.$bs_ano;


        $dt_atual = Carbon::today()->toDateString();
        $dt_atual = explode('-', $dt_atual);
        $dt_atual = $dt_atual[2].'/'.$dt_atual[1].'/'.$dt_atual[0];


        $bairro = Bairro::where('id', $cliente->bairro)->first();   
        $cidade = Cidade::where('id', $cliente->cidade)->first();
        $uf = UF::where('id', $cliente->uf)->first();

        $servicos = session('dadosPi')['Two']['servicos'];

        $forma_pagamento = session('dadosPi')['Two']['formaPgto'];
        $pagamento = session('dadosPi')['Two']['pgto'];

        if(isset(session('dadosPi')['Three'])) {
            $faturamento = session('dadosPi')['Three'];
        }



        $vendedor = session('dadosPi')['Two']['vendedor'];

        // Grava as reservas
        foreach($idPaineis as $idPainel) {
            $painel = Painel::where('identificacao', $idPainel)->first();
            // Verifica se o painel já foi reservado
            $reserva_atual = Reserva::where([['outdoor_id', $painel->id],['bisemana_id', $bsId]])->first();

            if($reserva_atual != []) {

                return response()->json(['cod' => 0, 'msg' => 'Painel reservado anteriormente.']);
            
            } else {
                
                Reserva::create([
                    'cliente_id' => $cliente->id,
                    'outdoor_id' => $painel->id,
                    'bisemana_id' => $bsId,
                    'dt_reserva' => Carbon::now()->toDateString(),
                    'campanha' => $campanha,
                    'observacao' => $observacoes,
                    'pi_ok' => 1, //$request->checkPi,
                    'user_id' => auth()->user()->id
                ]);
            }
    
            
        }


        $pi = Pi::where('id_cliente', session('dadosPi')['One']['clienteId'])
        ->where('id_bisemana', session('dadosPi')['Two']['bisemanaId'])
        ->orderByDesc('id')
        ->first();
                
        // soma os valores dos serviços
        $vl_total = 0;
        $vlr_unt = 0;
        $vlr_desc = 0;
        foreach($servicos as $servico) {
            $vl_total += $servico['vlr_total'];
            $vlr_unt += $servico['vlr_unit'];
            $vlr_desc += $servico['vlr_desc'];
        }

      
        

        // Cria o PI se não existir
        try {
            if(!$pi) {
                $pi = Pi::create([
                    'id_cliente' => session('dadosPi')['One']['clienteId'],
                    'id_paineis' => json_encode(session('dadosPi')['Two']['paineis'][0]),
                    'contato' => session('dadosPi')['One']['responsavel'],
                    'campanha' => session('dadosPi')['Two']['campanha'],
                    'id_bisemana' => session('dadosPi')['Two']['bisemanaId'],
                    'vl_unit' =>  $vlr_unt,
                    'vl_desc' => $vlr_desc,
                    'vl_total' => $vl_total,
                    'pago' => session('dadosPi')['Two']['pgto'],
                    'dt_pgto' => $data_pgto,
                    'forma_pagamento' => session('dadosPi')['Two']['formaPgto'],
                    'vendedor' => session('dadosPi')['Two']['vendedorId'],
                    'obs' => session('dadosPi')['Two']['servicos'][0]['detalhes']
                ]);
        
            }
        } catch(\Exception $e) {
            return response()->json(['cod' => 0, 'msg' => $e]);
        }
        
        
        // $pi = Pi::where('id_cliente', session('dadosPi')['One']['clienteId'])
        //         ->where('id_bisemana', session('dadosPi')['Two']['bisemanaId'])
        //     ->orderByDesc('id')
        // ->first();

       

        if(isset(session('dadosPi')['Three'])) {
            return Pdf::view('relatorios.pi.pi', compact('pi', 'cliente', 'bs_inicio', 'bs_final', 'bs_formated',  'pagamento', 'forma_pagamento',
            'dt_atual', 'bairro', 'cidade', 'uf','campanha', 'servicos', 'faturamento', 'vendedor'
            
            ))
            ->orientation(Orientation::Landscape);
        }


            return response()->json(['cod' => 1, 'msg' => 'Paineis reservados!']);
        }


}


