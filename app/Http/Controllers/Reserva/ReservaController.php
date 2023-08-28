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
use App\Models\Clientes\Cliente;
use Carbon\Carbon;
use DB;
use Illuminate\Contracts\Database\Eloquent\Builder;


class ReservaController extends Controller
{
    
    public function index() {

        $paineis = Painel::with('bairro.regiao.cidade')->get();

        $anos = Ano::all();

        $reservados = Painel::with('bairro.regiao.cidade')
                           ->join('reservas AS res', 'res.outdoor_id', '=', 'out.id')
                           ->where('res.bisemana_id','=', 28)
                           ->groupBY('out.id')
                           ->distinct()
        ->get();

        $disponiveis = Painel::with('bairro.regiao.cidade')
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

        $ambiente = env('APP_ENV');

        $clientes = Cliente::orderBy('razao_social')->get();


        return Inertia::render('Paineis/ReservaPaineis',
                        compact('reservas',
                                    'paineis',
                                    'clientes',
                                    'disponiveis',
                                    'reservados',
                                    'bisemanas',
                                    'bairros',
                                    'regioes',
                                    'cidades',
                                    'ambiente',
                                    'anos',
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


        $reservados = Painel::select('out.id',
                                     'out.identificacao',
                                     'out.bairro_id',
                                     'out.image_url',
                                     'bai.nome AS bnome',
                                     'reg.nome AS rnome',
                                     'cid.nome AS cnome')
                           ->join('reservas AS res', 'res.outdoor_id', '=', 'out.id')
                           ->join('bairros AS bai', 'bai.id', '=', 'out.bairro_id')
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
                                    $query->where('out.bairro_id', '=', $bairro);
                           })
                           
                           ->groupBY('out.id')
                           ->orderBy('out.identificacao')
                           ->distinct()
        ->get();


        $disponiveis = Painel::select('out.id',
                                      'out.identificacao',
                                      'out.bairro_id',
                                      'out.image_url',
                                      'bai.nome AS bnome',
                                      'reg.nome AS rnome',
                                      'cid.nome AS cnome')
                          ->join('reservas AS res', 'res.outdoor_id', '=', 'out.id')
                          ->join('bairros AS bai', 'bai.id', '=', 'out.bairro_id')
                          ->join('regioes AS reg', 'reg.id', '=', 'bai.regiao_id')
                          ->join('cidades AS cid', 'cid.id', '=', 'reg.cidade_id')
                          ->whereNotIn('out.id', $reservados->pluck('id'))
                          ->when($cidade, function (Builder $query, $cidade) {
                            $query->where('reg.cidade_id', '=', $cidade);
                          })
                          ->when($regiao, function (Builder $query, $regiao) {
                                    $query->where('bai.regiao_id', '=', $regiao);
                          })
                          ->when($bairro, function (Builder $query, $bairro) {
                                    $query->where('out.bairro_id', '=', $bairro);
                          })
                          
                          ->groupBY('out.id')
                          ->orderBy('out.identificacao')
        ->get();
  

        if($request->statusPainel == 1) {
            
            $paineis = $disponiveis;

        } elseif($request->statusPainel == 2) {
           
            $paineis = $reservados;

        }
    
        return response()->json($paineis);
    }


    public function reservaPainel(Request $request) {

        // dd($request->all());

        $reserva_atual = Reserva::where([['bisemana_id', $request->bsId],['outdoor_id', $request->outdoorId]])->first();

        if($reserva_atual != []) {

            return response()->json(['cod' => 0, 'msg' => 'Painel reservado anteriormente.']);
        
        } else {
           
            Reserva::create([
                'cliente_id' => $request->clienteId,
                'outdoor_id' => $request->outdoorId,
                'bisemana_id' => $request->bsId,
                'de_reserva' => Carbon::now()->toDateString(),
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

}
