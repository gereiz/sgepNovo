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
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Database\Eloquent\Builder;
use App\Models\Financeiro\Lancamento;
use App\Models\PI\Pi;
use App\Services\Financeiro\CaixaService;


class ReservaController extends Controller
{
    private $caixaService;

    public function __construct(CaixaService $caixaService) {
        $this->caixaService = $caixaService;
    }

    public function index() {

        $paineis = Painel::with('bairro.regiao.cidade')
            ->orderByRaw("CAST(identificacao AS UNSIGNED) ASC")
            ->get();

        $anos = Ano::all();

        $reservas = DB::table('reservas AS res')
                        ->join('outdoors AS out', 'res.outdoor_id', '=', 'out.id')
        ->get();

        $bisemanas = Bisemana::all();

        $bairros = Bairro::orderBy('nome')->get();

        $regioes = Regiao::orderBy('nome')->get();

        $cidades = Cidade::orderBy('nome')->get();

        $ambiente = env('APP_ENV');

        $clientes = Cliente::orderBy('razao_social')
        ->where('ativo', 1)
        ->get();

        $whatsapp = Whatsapp::all();


        return Inertia::render('Paineis/DispPaineis',
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

    public function getBisemanass(Request $request) {


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
        $tipo_painel = $request->input('tipo_painel', 'T');

        $paineis = Painel::with('bairro.regiao.cidade')->get();


        $reservados = Painel::select('outdoors.id',
                                     'outdoors.identificacao',
                                     'outdoors.bairro_id',
                                     'outdoors.logradouro',
                                     'outdoors.numero',
                                     'outdoors.latitude',
                                     'outdoors.longitude',
                                     'outdoors.tipo',
                                     'outdoors.is_led',
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
                           ->when($tipo_painel === 'L', function (Builder $query) {
                                    $query->where('outdoors.is_led', 1);
                           })
                           ->when($tipo_painel === 'C', function (Builder $query) {
                                    $query->where('outdoors.is_led', 0);
                           })

                           ->groupBY('outdoors.id')
                           ->orderByRaw("CAST(outdoors.identificacao AS UNSIGNED) ASC")
                           ->distinct()
        ->get();


        $disponiveis = Painel::select('outdoors.id',
                                      'outdoors.identificacao',
                                      'outdoors.bairro_id',
                                      'outdoors.logradouro',
                                      'outdoors.numero',
                                      'outdoors.latitude',
                                      'outdoors.longitude',
                                      'outdoors.tipo',
                                      'outdoors.is_led',
                                      'outdoors.image_url',
                                      'bai.nome AS bnome',
                                      'reg.nome AS rnome',
                                      'cid.nome AS cnome')
                        //   ->join('reservas AS res', 'res.outdoor_id', '=', 'outdoors.id')
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
                          ->when($tipo_painel === 'L', function (Builder $query) {
                                    $query->where('outdoors.is_led', 1);
                          })
                          ->when($tipo_painel === 'C', function (Builder $query) {
                                    $query->where('outdoors.is_led', 0);
                          })

                          ->groupBY('outdoors.id')
                          ->orderByRaw("CAST(outdoors.identificacao AS UNSIGNED) ASC")
        ->get();


        if($request->statusPainel == 'D') {

            $paineis = $disponiveis;

        } elseif($request->statusPainel == 'R') {

            $paineis = $reservados;

        }

        $service = new \App\Services\PainelService();
        foreach ($paineis as $p) {
            $tmp = new \App\Models\Paineis\Painel();
            $tmp->identificacao = $p->identificacao;
            $tmp->image_url = $p->image_url;
            $p->image_url = $service->latestImagePath($tmp);
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

        $clientes = Cliente::orderBy('razao_social')
            ->where('ativo', 1)
            ->get();

        $anos = Ano::all();

        $bisemanas = Bisemana::all();

        $reservas = Reserva::where('bisemana_id', 34)->get();

        $ambiente = env('APP_ENV');

        return Inertia::render('Reservas/ReservaPaineisCli', compact('clientes',
                                                                    'anos',
                                                                    'bisemanas',
                                                                    'reservas',
                                                                    'ambiente',
                                                                     ));
    }


    public function reservaSemPi() {

        $clientes = Cliente::orderBy('razao_social')
            ->where('ativo', 1)
            ->get();

        $agentes = Cliente::where('ativo', 1)
            ->where('agent', 1)
            ->get();

        $anos = Ano::all();

        $bisemanas = Bisemana::all();

        $reservas = Reserva::where('pi_ok', 1)->get();

        $ambiente = env('APP_ENV');

        return Inertia::render('Reservas/ReservaSemPi', compact('clientes',
                                                                    'anos',
                                                                    'bisemanas',
                                                                    'reservas',
                                                                    'ambiente',
                                                                    'agentes'
                                                                ));
    }

    public function getReservaSemPI(Request $request) {

        $bisemana = $request->bsId;
        $cliente = $request->cliente;

        $reservas = Painel::select('outdoors.id',
                                'outdoors.identificacao',
                                'outdoors.bairro_id',
                                'outdoors.image_url',
                                'res.campanha AS campanha',
                                'res.observacao AS obs',
                                'res.pi_ok AS pi_ok',
                                'res.dt_reserva AS dt_reserva',
                                'res.user_id AS user_id',
                                'user.name AS user_name',
                                'cli.id AS cliente_id',
                                'cli.razao_social AS razao_social',
                                'cli.nome_fantasia AS nome_fantasia')
            ->join('reservas AS res', 'res.outdoor_id', '=', 'outdoors.id')
            ->join('clientes AS cli', 'cli.id', '=', 'res.cliente_id')
            ->join('users AS user', 'user.id', '=', 'res.user_id')
            ->where('res.bisemana_id','=', $bisemana)
            ->where('res.pi_ok', 0)
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
                                'res.pi_ok AS pi_ok',
                                'res.dt_reserva AS dt_reserva',
                                'cli.id AS cliente_id',
                                'cli.razao_social AS razao_social',
                                'cli.nome_fantasia AS nome_fantasia')
            ->join('reservas AS res', 'res.outdoor_id', '=', 'outdoors.id')
            ->join('clientes AS cli', 'cli.id', '=', 'res.cliente_id')
            ->whereNotIn('outdoors.id', $reservas->pluck('id'))
            ->where('res.pi_ok', 0)
            ->when($cliente, function(Builder $query, $cliente) {
            $query->where('res.cliente_id', $cliente);
            })


            ->groupBY('outdoors.id')
            ->orderBy('outdoors.identificacao')
            ->distinct()
        ->get();


        $service = new \App\Services\PainelService();
        foreach ($reservas as $p) {
            $tmp = new \App\Models\Paineis\Painel();
            $tmp->identificacao = $p->identificacao;
            $tmp->image_url = $p->image_url;
            $p->image_url = $service->latestImagePath($tmp);
        }
        foreach ($paineis as $p) {
            $tmp = new \App\Models\Paineis\Painel();
            $tmp->identificacao = $p->identificacao;
            $tmp->image_url = $p->image_url;
            $p->image_url = $service->latestImagePath($tmp);
        }
        return response()->json(['reservas' => $reservas, 'paineis' => $paineis]);

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
                                'res.pi_ok AS pi_ok',
                                'res.dt_reserva AS dt_reserva',
                                'res.user_id AS user_id',
                                'user.name AS user_name',
                                'cli.razao_social AS razao_social',
                                'cli.nome_fantasia AS nome_fantasia')
            ->join('reservas AS res', 'res.outdoor_id', '=', 'outdoors.id')
            ->join('clientes AS cli', 'cli.id', '=', 'res.cliente_id')
            ->join('users AS user', 'user.id', '=', 'res.user_id')
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
                                'res.pi_ok AS pi_ok',
                                'res.dt_reserva AS dt_reserva',
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


        $service = new \App\Services\PainelService();
        foreach ($reservas as $p) {
            $tmp = new \App\Models\Paineis\Painel();
            $tmp->identificacao = $p->identificacao;
            $tmp->image_url = $p->image_url;
            $p->image_url = $service->latestImagePath($tmp);
        }
        foreach ($paineis as $p) {
            $tmp = new \App\Models\Paineis\Painel();
            $tmp->identificacao = $p->identificacao;
            $tmp->image_url = $p->image_url;
            $p->image_url = $service->latestImagePath($tmp);
        }
        return response()->json(['reservas' => $reservas, 'paineis' => $paineis]);

    }


    public function reservaPaineisCliente(Request $request) {

        $extensiva = (int)($request->input('extensiva', 0));
        $bsIdInicial = (int)$request->bsId;
        $bsIdFinal = (int)($request->input('bsFinal') ?? 0);

        $paineisInput = is_array($request->idPaineis ?? null) ? \Illuminate\Support\Arr::flatten($request->idPaineis) : [];
        $idPaineis = [];
        foreach ($paineisInput as $painel) {
            $idPaineis[] = (int)$painel;
        }

        // Calcula intervalo de bisemanas
        $intervaloBs = [$bsIdInicial];
        if ($extensiva && $bsIdFinal && $bsIdFinal > $bsIdInicial) {
            $bsIni = Bisemana::find($bsIdInicial);
            $bsFim = Bisemana::find($bsIdFinal);
            if (!$bsIni || !$bsFim || $bsIni->ano_id !== $bsFim->ano_id) {
                return response()->json(['cod' => 0, 'msg' => 'Intervalo de bi-semanas inválido'], 422);
            }
            $intervaloBs = Bisemana::where('ano_id', $bsIni->ano_id)
                ->whereBetween('id', [$bsIdInicial, $bsIdFinal])
                ->orderBy('id')
                ->pluck('id')
                ->toArray();
        }

        $criados = [];
        $pulados = [];
        \DB::beginTransaction();
        try {
            foreach ($intervaloBs as $bsId) {
                foreach ($idPaineis as $idPainel) {
                    $existe = Reserva::where([
                        ['outdoor_id', $idPainel],
                        ['bisemana_id', $bsId],
                    ])->first();
                    if ($existe) {
                        $pulados[] = $idPainel;
                        continue;
                    }
                    $res = Reserva::create([
                        'cliente_id' => $request->clienteId,
                        'outdoor_id' => $idPainel,
                        'bisemana_id' => $bsId,
                        'dt_reserva' => Carbon::now()->toDateString(),
                        'campanha' => $request->campanha,
                        'observacao' => $request->obs,
                        'pi_ok' => 0,
                        'user_id' => auth()->user()->id
                    ]);
                    $criados[] = $res->id;
                }
            }
            \DB::commit();
        } catch (\Throwable $e) {
            \DB::rollBack();
            return response()->json(['cod' => 0, 'msg' => 'Falha ao criar reservas: '.$e->getMessage()], 500);
        }

        return response()->json([
            'cod' => 1,
            'message' => 'Reservas criadas com sucesso',
            'qtd' => count($criados),
            'ids' => $criados,
            'skipped' => array_values(array_unique($pulados))
        ]);

    }
    public function getCliente(Request $request)
    {
        if (!isset($request->cliente) || !isset($request->cliente['id'])) {
            return response()->json(['error' => 'Cliente inválido ou não informado.'], 400);
        }
        

        $id_cliente = intval($request->cliente['id']);
        $cliente = Cliente::find($id_cliente);

        return $cliente ?? response()->json(['error' => 'Cliente não encontrado.'], 404);
    }



    public function delResCliente(Request $request) {
        $paineisId = $request->paineisId;
        $bs = $request->bs;


        foreach ($paineisId as $pId) {
            $reserva = Reserva::where([['outdoor_id', $pId], ['bisemana_id', $bs], ['user_id', auth()->user()->id]])->first();
            $painel = Painel::find($pId);

            if($reserva) {
                // exclui a reserva
                $reserva->delete();

                // exclui a PI
                $pi = Pi::where('id_cliente', $reserva->cliente_id)
                        ->where('id_bisemana', $reserva->bisemana_id)
                        ->orderByDesc('id')
                        ->first();

                if($pi) {
                    $pi->delete();
                }

                // exclui os lançamentos referentes aos painéis
                $lancamento = Lancamento::where('id_reserva', $reserva->pi_id)->first();

                //cria uma request para deletar o lançamento
                $request_lancamento = new Request();
                $request_lancamento->replace(['lancamento' => $lancamento]);

                if($lancamento) {
                    $this->caixaService->deleteLancamento($request_lancamento);
                }



            } else {
                return response()->json(['cod' => 0, 'msg' => 'A reserva do painel  '.$painel->identificacao.' só pode ser cancelada pelo usuário que o reservou!']);
            }

        }

        return response()->json(['cod' => 1, 'msg' => 'Painéis Excluidos!']);

    }

    // ============ MÓDULO LED ============

    public function getMapaOcupacaoLed(Request $request)
    {
        $ledService = new \App\Services\Reserva\LedService();
        $filtros = $request->all();
        $dados = $ledService->getMapaOcupacao($filtros);
        return response()->json($dados);
    }

    public function getReservasLed(Request $request)
    {
        $ledService = new \App\Services\Reserva\LedService();
        $filtros = $request->all();
        $dados = $ledService->getReservasLed($filtros);
        return response()->json($dados);
    }

    public function getContratosProximosTerminoLed(Request $request)
    {
        $ledService = new \App\Services\Reserva\LedService();
        $dias = $request->input('dias');
        $dados = $ledService->getContratosProximosTermino($dias ? (int)$dias : null);
        return response()->json($dados);
    }

    public function extenderReservaLed(Request $request)
    {
        $request->validate([
            'reserva_id'          => 'required|integer',
            'nova_bisemana_fim_id' => 'required|integer',
        ]);

        $ledService = new \App\Services\Reserva\LedService();
        $result = $ledService->extenderReservaLed(
            (int)$request->reserva_id,
            (int)$request->nova_bisemana_fim_id,
            auth()->id() ?? 1
        );

        $status = $result['cod'] === 1 ? 200 : 422;
        return response()->json($result, $status);
    }

    public function getStatusContratoLed(Request $request)
    {
        $request->validate([
            'reserva_id' => 'required|integer',
        ]);

        $ledService = new \App\Services\Reserva\LedService();
        $reserva = Reserva::findOrFail((int)$request->reserva_id);
        return response()->json($ledService->getStatusContrato($reserva));
    }

    public function verificaConflitoLed(Request $request)
    {
        $request->validate([
            'painel_id'   => 'required|integer',
            'bisemana_id' => 'required|integer',
            'reserva_id'  => 'nullable|integer',
        ]);

        $ledService = new \App\Services\Reserva\LedService();
        $result = $ledService->verificaConflitoReserva(
            (int)$request->painel_id,
            (int)$request->bisemana_id,
            $request->reserva_id ? (int)$request->reserva_id : null
        );
        return response()->json($result);
    }

}
