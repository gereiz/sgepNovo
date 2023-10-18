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
use App\Models\Config\Ano;
use App\Models\Config\Whatsapp;
use App\Models\Clientes\Cliente;
use Carbon\Carbon;
use DB;
use Illuminate\Contracts\Database\Eloquent\Builder;


class ReservaController extends Controller
{
    
    public function index() {

        session(['dados' => '12345']);

        $paineis = Painel::with('bairro.regiao.cidade')->get();

        $anos = Ano::all();

        $reservas = DB::table('reservas AS res')
                        ->join('outdoors AS out', 'res.outdoor_id', '=', 'out.id')
        ->get();

        $bisemanas = Bisemana::all();

        $bairros = Bairro::orderBy('nome')->get();
        
        $regioes = Regiao::orderBy('nome')->get();

        $cidades = Cidade::orderBy('nome')->get();

        $ambiente = env('APP_ENV');

        $clientes = Cliente::orderBy('razao_social')->get();

        $whatsapp = Whatsapp::all();


        return Inertia::render('Paineis/ReservaPaineis',
                        compact('reservas',
                                    'paineis',
                                    'clientes',
                                    'bisemanas',
                                    'bairros',
                                    'regioes',
                                    'cidades',
                                    'ambiente',
                                    'anos',
                                    'whatsapp'
                                    )
        );

    }

    public function getBisemanas(Request $request) {


        return Bisemana::where('ano_id', $request->bisemana)->get();

    }


    public function getRegioes(Request $request) {


        return Regiao::where('cidade_id', $request->idCid)->get();

    }


    public function getBairros(Request $request) {


        return Bairro::where('regiao_id', $request->idReg)->get();

    }

    public function getPaineis(Request $request) {

        $bairro = $request->bairro;
        $regiao = $request->regiao;
        $cidade = $request->cidade;
        
        $paineis = Painel::with('bairro.regiao.cidade')->get();


        $reservados = Painel::select('outdoors.id',
                                     'outdoors.identificacao',
                                     'outdoors.bairro_id',
                                     'outdoors.logradouro',
                                     'outdoors.numero',
                                     'outdoors.latitude',
                                     'outdoors.longitude',
                                     'outdoors.image_url',
                                     'bai.nome AS bnome',
                                     'reg.nome AS rnome',
                                     'cid.nome AS cnome')
                           ->join('reservas AS res', 'res.outdoor_id', '=', 'outdoors.id')
                           ->join('bairros AS bai', 'bai.id', '=', 'outdoors.bairro_id')
                           ->join('regioes AS reg', 'reg.id', '=', 'bai.regiao_id')
                           ->join('cidades AS cid', 'cid.id', '=', 'reg.cidade_id')
                           ->where('res.bisemana_id','=', $request->bisemana)
                           ->when($cidade, function (Builder $query, $cidade) {
                                    $query->where('reg.cidade_id', '=', $cidade);
                           })
                           ->when($regiao, function (Builder $query, $regiao) {
                                    $query->where('bai.regiao_id', '=', $regiao);
                           })
                           ->when($bairro, function (Builder $query, $bairro) {
                                    $query->where('outdoors.bairro_id', '=', $bairro);
                           })
                           
                           ->groupBY('outdoors.id')
                           ->orderBy('outdoors.identificacao')
                           ->distinct()
        ->get();


        $disponiveis = Painel::select('outdoors.id',
                                      'outdoors.identificacao',
                                      'outdoors.bairro_id',
                                      'outdoors.logradouro',
                                      'outdoors.numero',
                                      'outdoors.latitude',
                                      'outdoors.longitude',
                                      'outdoors.image_url',
                                      'bai.nome AS bnome',
                                      'reg.nome AS rnome',
                                      'cid.nome AS cnome')
                          ->join('reservas AS res', 'res.outdoor_id', '=', 'outdoors.id')
                          ->join('bairros AS bai', 'bai.id', '=', 'outdoors.bairro_id')
                          ->join('regioes AS reg', 'reg.id', '=', 'bai.regiao_id')
                          ->join('cidades AS cid', 'cid.id', '=', 'reg.cidade_id')
                          ->whereNotIn('outdoors.id', $reservados->pluck('id'))
                          ->when($cidade, function (Builder $query, $cidade) {
                            $query->where('reg.cidade_id', '=', $cidade);
                          })
                          ->when($regiao, function (Builder $query, $regiao) {
                                    $query->where('bai.regiao_id', '=', $regiao);
                          })
                          ->when($bairro, function (Builder $query, $bairro) {
                                    $query->where('outdoors.bairro_id', '=', $bairro);
                          })
                          
                          ->groupBY('outdoors.id')
                          ->orderBy('outdoors.identificacao')
        ->get();
  

        if($request->statusPainel == 1) {
            
            $paineis = $disponiveis;

        } elseif($request->statusPainel == 2) {
           
            $paineis = $reservados;

        }
    
        return response()->json($paineis);
    }


    public function reservaPainel(Request $request) {

        $reserva_atual = Reserva::where([['bisemana_id', $request->bsId],['outdoor_id', $request->outdoorId]])->first();

        if($reserva_atual != []) {

            return response()->json(['cod' => 0, 'msg' => 'Painel reservado anteriormente.']);
        
        } else {
           
            Reserva::create([
                'cliente_id' => $request->clienteId,
                'outdoor_id' => $request->outdoorId,
                'bisemana_id' => $request->bsId,
                'dt_reserva' => Carbon::now()->toDateString(),
                'campanha' => $request->campanha,
                'observacao' => $request->obs,
                'pi_ok' => $request->checkPi,
                'user_id' => auth()->user()->id
            ]);
    
            return response()->json(['cod' => 1, 'msg' => 'Painel reservado!']);

        }


    }


    public function cancelaReserva(Request $request) {

        $reserva = Reserva::where([['outdoor_id', $request->painelReserva['id']],
                                    ['bisemana_id', $request->bs]])->first();

        if($reserva) {
           
            $reserva->delete();

            return response()->json(['cod' => 1, 'msg' => 'Reserva cancelada!']);

        } else {
            return response()->json(['cod' => 0, 'msg' => 'Reserva não localizada!']);
        }

    }


    public function reservaPainelIndex() {
        
        $clientes = Cliente::orderBy('razao_social')->get();

        $anos = Ano::all();

        $bisemanas = Bisemana::all();

        $reservas = Reserva::where('bisemana_id', 34)->get();

        $ambiente = env('APP_ENV');
        
        return Inertia::render('Paineis/ReservaPaineisCli', compact('clientes',
                                                                    'anos',
                                                                    'bisemanas',
                                                                    'reservas',
                                                                    'ambiente',
                                                                     ));
    }
    

    public function getPaineisCliente(Request $request) { 

        $bisemana = $request->bsId;
        $cliente = $request->cliente;

        $reservas = Painel::select('outdoors.id',
                                'outdoors.identificacao',
                                'outdoors.bairro_id',
                                'outdoors.image_url',
                                'res.campanha AS campanha',
                                'res.observacao AS obs',
                                'cli.razao_social AS razao_social',
                                'cli.nome_fantasia AS nome_fantasia')
            ->join('reservas AS res', 'res.outdoor_id', '=', 'outdoors.id')
            ->join('clientes AS cli', 'cli.id', '=', 'res.cliente_id')
            ->where('res.bisemana_id','=', $bisemana)
            ->when($cliente, function(Builder $query, $cliente) {
                $query->where('res.cliente_id', $cliente);
            })
        
            ->groupBY('outdoors.id')
            ->orderBy('outdoors.identificacao')
            ->distinct()
        ->get();


        $paineis = Painel::select('outdoors.id',
                                'outdoors.identificacao',
                                'outdoors.bairro_id',
                                'outdoors.image_url',
                                'outdoors.logradouro',
                                'outdoors.numero',
                                'outdoors.ponto_referencia',
                                'res.campanha AS campanha',
                                'res.observacao AS obs',
                                'cli.razao_social AS razao_social',
                                'cli.nome_fantasia AS nome_fantasia')
            ->join('reservas AS res', 'res.outdoor_id', '=', 'outdoors.id')
            ->join('clientes AS cli', 'cli.id', '=', 'res.cliente_id')
            ->whereNotIn('outdoors.id', $reservas->pluck('id'))
            ->when($cliente, function(Builder $query, $cliente) {
            $query->where('res.cliente_id', $cliente);
            })

            ->groupBY('outdoors.id')
            ->orderBy('outdoors.identificacao')
            ->distinct()
        ->get();




        return response()->json(['reservas' => $reservas, 'paineis' => $paineis]);

    }
    
    
    public function reservaPaineisCliente(Request $request) {

        $paineis = $request->outdoorId;
        $idPaineis = [];


        foreach($paineis as $painel) {

            array_push($idPaineis, intval(substr($painel, -3)));

        }

        foreach($idPaineis as $idPainel) {
            
            Reserva::create([
                'cliente_id' => $request->clienteId,
                'outdoor_id' => $idPainel,
                'bisemana_id' => $request->bsId,
                'dt_reserva' => Carbon::now()->toDateString(),
                'campanha' => $request->campanha,
                'observacao' => $request->obs,
                'pi_ok' => $request->checkPi,
                'user_id' => auth()->user()->id
            ]);
    
            
        }

        return response()->json(['cod' => 1, 'msg' => 'Painel reservado!']);


    }


    public function getCliente(Request $request) {

        return Cliente::find($request->cliente)->last();
    }


    public function delResCliente(Request $request) {

        $paineisId = $request->paineisId;
        $bs = $request->bs;

        foreach ($paineisId as $pId) {
           $reserva = Reserva::where([['outdoor_id', $pId], ['bisemana_id', $bs]])->delete();
        }

        return response()->json(['cod' => 1, 'msg' => 'Painéis Excluidos!']);
    }
    


}
