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
use App\Services\Pi\PiService;
use PDF;
use App\Models\Reservas\Reserva;
use App\Services\Financeiro\CaixaService;
use Illuminate\Support\Facades\DB;
use App\Models\Clientes\Cliente;
use App\Models\Financeiro\Comissao;
use App\Models\Financeiro\ComissaoVenda;
use App\Models\Textos\TextoPadrao;

class PiController extends Controller
{
    private $clienteService;
    private $usuarioService;
    private $piService;


    public function __construct(ClienteService $clienteService, UsuarioService $usuarioService, PiService $piService) {
        $this->clienteService = $clienteService;
        $this->usuarioService = $usuarioService;
        $this->piService = $piService;
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
        $idPaineis = session('dadosPi')['Two']['paineis'];
        $bsId = session('dadosPi')['Two']['bisemanaId'];

        // dd(session('dadosPi'));


        $cliente = $this->clienteService->getCliente(session('dadosPi')['One']['clienteId']);
        $data_pgto_formated = explode('-', session('dadosPi')['Four']['dtPgto']);
        $data_pgto_formated = $data_pgto_formated[2].'/'.$data_pgto_formated[1].'/'.$data_pgto_formated[0];
        $campanha = session('dadosPi')['Two']['campanha'];

        $agentes = [];

        foreach (session('dadosPi')['Two']['agentesId'] as $ag) {
            $agente = Cliente::where('agent', 1)->where('id', $ag)->first();

            array_push($agentes, $agente);
        }


        if(session('dadosPi')['Four']['servicos'] != []) {
            $detalhes = session('dadosPi')['Four']['servicos'][0]['detalhes'];
        }

        $bisemana = Bisemana::where('id', session('dadosPi')['Two']['bisemanaId'])->first();

        $bs_ini = explode('-', $bisemana->inicio);
        $bs_inicio = $bs_ini[2].'/'.$bs_ini[1].'/'.$bs_ini[0];
        $bs_ano = substr($bs_ini[0], 2, 2);
        $bs_fin = explode('-', $bisemana->fim);
        $bs_final = $bs_fin[2].'/'.$bs_fin[1].'/'.$bs_fin[0];
        $bs_formated = 'BS: '. $bisemana->num_bisemana.' - '.$bs_ini[2].'/'.$bs_ini[1]. ' a '.$bs_fin[2].'/'.$bs_fin[1].'/'.$bs_ano;


        $dt_atual = Carbon::today()->toDateString();
        $dt_atual = explode('-', $dt_atual);
        $dt_atual = $dt_atual[2].'/'.$dt_atual[1].'/'.$dt_atual[0];


        $bairro = Bairro::where('id', $cliente->bairro)->first();
        $cidade = Cidade::where('id', $cliente->cidade)->first();
        $uf = UF::where('id', $cliente->uf)->first();

        $servicos = session('dadosPi')['Four']['servicos'];

        $forma_pagamento = session('dadosPi')['Four']['formaPgto'];
        $pagamento = session('dadosPi')['Four']['pgto'];

        if(isset(session('dadosPi')['Three'])) {
            $faturamento = session('dadosPi')['Three'];
        }

        $vendedor = session('dadosPi')['Two']['vendedor'];


        // Grava as reservas
        foreach($idPaineis as $idPainel) {
            $painel = Painel::where('identificacao', $idPainel)->first();

            $grava_reservas = $this->piService->storeReservation($cliente->id, $painel->id, $bsId, $campanha);

        }



        $pi = Pi::where('id_cliente', session('dadosPi')['One']['clienteId'])
        ->where('id_bisemana', session('dadosPi')['Two']['bisemanaId'])
        ->orderByDesc('id')
        ->first();


        // soma os valores dos serviços
        $vl_total = 0;
        $vlr_unt = 0;
        $vlr_desc = 0;
        $vlr_custo = 0;
        foreach($servicos as $servico) {
            $vl_total += $servico['vlr_total'];
            $vlr_unt += $servico['vlr_unit'];
            $vlr_desc += $servico['vlr_desc'];
            $vlr_custo += $servico['vlr_custo'];
        }


        // Cria a PI se não existir
        try {
            if(!$pi) {
                DB::beginTransaction();

                $cliente_nome = $cliente->nome_fantasia ? $cliente->nome_fantasia : $cliente->razao_social;
                $dt_pi = Carbon::today()->toDateString();

                // Cria a PI
                // $grava_pi = $this->piService->storeOrUpdatePi(session('dadosPi'), $cliente_nome, $dt_pi, $vlr_unt, $vlr_desc, $vlr_custo, $vl_total, $data_pgto_formated);

                // dd($grava_pi);

                $pi = Pi::updateOrCreate([
                    'id_cliente' => session('dadosPi')['One']['clienteId'],
                    'id_paineis' => json_encode(session('dadosPi')['Two']['paineis']),
                    'arquivo' => $cliente_nome.'_'.$dt_pi.'.pdf',
                    'contato' => session('dadosPi')['One']['responsavel'],
                    'campanha' => session('dadosPi')['Two']['campanha'],
                    'id_bisemana' => session('dadosPi')['Two']['bisemanaId'],
                    'vl_unit' =>  $vlr_unt,
                    'vl_desc' => $vlr_desc,
                    'vl_custo' => $vlr_custo,
                    'vl_total' => $vl_total,
                    'pago' => session('dadosPi')['Four']['pgto'],
                    'dt_pgto' => session('dadosPi')['Four']['dtPgto'],
                    'forma_pagamento' => session('dadosPi')['Four']['formaPgto'],
                    'vendedor' => session('dadosPi')['Two']['vendedorId'],
                    'obs' => session('dadosPi')['Four']['servicos'][0]['detalhes']
                ]);

            }

            // dd($data_pgto_formated);

            //Recupera a reserva
            $reserva = Reserva::where('cliente_id', session('dadosPi')['One']['clienteId'])
            ->where('bisemana_id', session('dadosPi')['Two']['bisemanaId'])
            ->where('pi_ok', 1)->get();

            $valor_liq_comissoes = 0;

            // Calcula as comissões para salvar o valor liquido e o valor total
            $this->piService->calculateComission($servicos, $agentes, $pi, $valor_liq_comissoes);

            foreach($servicos as $servico) {
                $vlr_total = $servico['vlr_total'];
                $vlr_unit = $servico['vlr_unit'];
                $vlr_desc = $servico['vlr_desc'];
                $vlr_custo = $servico['vlr_custo'];

                $vlr_liquido = $vlr_total - $vlr_desc;
                $vlr_liquido_financeiro = $vlr_total - $vlr_desc - $vlr_custo;


                foreach($agentes as $agente) {
                    $comissao = Comissao::where('id_funcionario', $agente->id)
                                          ->where('id_servico', $servico['id'])->first();

                    $comissoes = Comissao::where('id_funcionario', $agente->id)->get()->toArray();


                    $comissao_venda = new ComissaoVenda();


                    if (optional($comissao)->exists()) {
                        if($comissao->tipo_comissao == 1) {
                            $comissao_venda->Create([
                                'pi_id' => $pi->id,
                                'comissao_id' => $comissao->id,
                                'agente_id' => $agente->id,
                                'valor_comissao' => $vlr_liquido * ($comissao->valor / 100),
                            ]);
                            $vlr_total -= $vlr_liquido * ($comissao->valor / 100);
                        } else {
                            $comissao_venda->Create([
                                'pi_id' => $pi->id,
                                'comissao_id' => $comissao->id,
                                'agente_id' => $agente->id,
                                'valor_comissao' => $vlr_liquido - $comissao->valor,
                            ]);
                            $vlr_total -= $vlr_liquido - $comissao->valor;
                        }
                    }
                }

                $valor_liq_comissoes += $vlr_total;
            }



            // grava o lançamento no banco de dados
            // $this->piService->storeFinancialRelease($vl_total, $cliente, $detalhes, $pi, $reserva);



            $caixaService = new CaixaService();


            // Cria o lançamento no caixa
            $qtdParcelas = session('dadosPi')['Four']['qtdParcelas'];
            $lista_lancamentos = [];

            // verifica se o lançamento já existe
            $lancamento_existe = $caixaService->getLancamentosReserva($pi->id);


            $parcelasDetalhe = session('dadosPi')['Four']['parcelasDetalhe'] ?? null;
            if (is_array($parcelasDetalhe) && count($parcelasDetalhe) > 0) {
                $i = 1;
                foreach ($parcelasDetalhe as $parc) {
                    $lancamento = [
                        'descricao' => 'PI nº ' . $pi->id . ' Cliente: ' . ($cliente->razao_social ? $cliente->razao_social : $cliente->nome_fantasia),
                        'valor' => $parc['valor'],
                        'parcelas' => $i . '/' . count($parcelasDetalhe),
                        'data_lancamento' => $parc['data'],
                        'centro_custo' => 1,
                        'tipo_lancamento' => 1,
                        'id_reserva' => $pi->id,
                        'observacoes' => $detalhes,
                    ];

                    $request_lancamento = new \Illuminate\Http\Request();
                    $request_lancamento->replace($lancamento);

                    if(!$lancamento_existe) {
                        $caixaService->createLancamento($request_lancamento);
                        array_push($lista_lancamentos, $lancamento);
                    } else {
                        $lancamento_existe->update($lancamento);
                        array_push($lista_lancamentos, $lancamento);
                    }
                    $i++;
                }
            } else {
                $vl_parcela = $vl_total / $qtdParcelas;
                for ($i = 0; $i < $qtdParcelas; $i++) {
                    $parcelaLabel = ($i + 1) . '/' . $qtdParcelas;
                    $dataLanc = date('Y-m-d', strtotime(session('dadosPi')['Four']['dtPgto'] . ' + ' . $i . ' month'));
                    $lancamento = [
                        'descricao' => 'PI nº ' . $pi->id . ' Cliente: ' . ($cliente->razao_social ? $cliente->razao_social : $cliente->nome_fantasia),
                        'valor' => $vl_parcela,
                        'parcelas' => $parcelaLabel,
                        'data_lancamento' => $dataLanc,
                        'centro_custo' => 1,
                        'tipo_lancamento' => 1,
                        'id_reserva' => $pi->id,
                        'observacoes' => $detalhes,
                    ];

                    $request_lancamento = new \Illuminate\Http\Request();
                    $request_lancamento->replace($lancamento);

                    if(!$lancamento_existe) {
                        $caixaService->createLancamento($request_lancamento);
                        array_push($lista_lancamentos, $lancamento);
                    } else {
                        $lancamento_existe->update($lancamento);
                        array_push($lista_lancamentos, $lancamento);
                    }
                }
            }

            // atualiza o campo pi_id e observação na reserva
            $observacao = session('dadosPi')['Five']['observacao'] ?? null;
            foreach($reserva as $res) {
                $update = ['pi_id' => $pi->id];
                if ($observacao !== null) { $update['observacao'] = $observacao; }
                $res->update($update);
            }

            DB::commit();


            if(isset(session('dadosPi')['Three'])) {

                //via do cliente
                $cliente_nome = $cliente->nome_fantasia ? $cliente->nome_fantasia : $cliente->razao_social;
                $dt_pi = Carbon::today()->toDateString();


                // Via do Financeiro
                $textoAtivo = TextoPadrao::where('active', 1)->first();
                $observacao = session('dadosPi')['Five']['observacao'] ?? null;
                $pi_fin =  PDF::loadview('relatorios.pi.pi_fin_nova', compact('pi', 'idPaineis',  'cliente', 'agentes', 'comissoes', 'bs_inicio', 'bs_final', 'bs_formated',  'pagamento', 'forma_pagamento',
                'dt_atual', 'bairro', 'cidade', 'uf','campanha', 'servicos', 'faturamento', 'vendedor', 'lista_lancamentos', 'valor_liq_comissoes', 'textoAtivo', 'observacao'));

                $pi_fin->setPaper('a4', 'landscape');

                $pi_fin->save(storage_path('app/public/pdf/pi/pi_fin_'.$cliente_nome.'_'.$dt_pi.'.pdf'));

                // Via do Cliente
                $pi_cli =  PDF::loadview('relatorios.pi.pi_nova', compact('pi', 'idPaineis', 'cliente', 'agentes', 'comissoes', 'bs_inicio', 'bs_final', 'bs_formated',  'pagamento', 'forma_pagamento',
                'dt_atual', 'bairro', 'cidade', 'uf','campanha', 'servicos', 'faturamento', 'vendedor', 'lista_lancamentos', 'valor_liq_comissoes', 'textoAtivo', 'observacao'));

                $pi_cli->setPaper('a4', 'landscape');

                $pi_cli->save(storage_path('app/public/pdf/pi/pi_cli_'.$cliente_nome.'_'.$dt_pi.'.pdf'));


                return $pi_cli->stream('paineis_bisemana.pdf');
            }


        } catch (\Exception $e) {
            return response()->json(['cod' => 0, 'msg' => $e->getMessage()]);
        }


        return response()->json(['cod' => 1, 'msg' => 'Paineis reservados!']);
    }

    public function previewPi() {
        $dados = session('dadosPi') ?? [];
        $two = $dados['Two'] ?? [];
        $one = $dados['One'] ?? [];
        $three = $dados['Three'] ?? [];
        $four = $dados['Four'] ?? [];

        $idPaineis = $two['paineis'] ?? [];
        $clienteId = $one['clienteId'] ?? null;
        $bisemanaId = $two['bisemanaId'] ?? null;
        $cliente = $clienteId ? $this->clienteService->getCliente($clienteId) : new \stdClass();
        $bisemana = $bisemanaId ? Bisemana::where('id', $bisemanaId)->first() : null;
        $bs_ini = explode('-', $bisemana->inicio);
        $bs_fin = explode('-', $bisemana->fim);
        $bs_inicio = $bs_ini[2].'/'.$bs_ini[1].'/'.$bs_ini[0];
        $bs_final = $bs_fin[2].'/'.$bs_fin[1].'/'.$bs_fin[0];
        $bs_ano = substr($bs_ini[0], 2, 2);
        $bs_formated = 'BS: '. $bisemana->num_bisemana.' - '.$bs_ini[2].'/'.$bs_ini[1]. ' a '.$bs_fin[2].'/'.$bs_fin[1].'/'.$bs_ano;
        $dt_atual = Carbon::today()->toDateString();
        $dt_atual = explode('-', $dt_atual);
        $dt_atual = $dt_atual[2].'/'.$dt_atual[1].'/'.$dt_atual[0];
        $bairro = isset($cliente->bairro) ? Bairro::where('id', $cliente->bairro)->first() : null;
        $cidade = isset($cliente->cidade) ? Cidade::where('id', $cliente->cidade)->first() : null;
        $uf = isset($cliente->uf) ? UF::where('id', $cliente->uf)->first() : null;
        $servicos = $four['servicos'] ?? [];
        $pagamento = $four['pgto'] ?? 0;
        $forma_pagamento = $four['formaPgto'] ?? 0;
        $campanha = $two['campanha'] ?? '';
        $faturamento = $three ?: null;
        $vendedor = $two['vendedor'] ?? null;
        $agentes = [];
        foreach (($two['agentesId'] ?? []) as $ag) {
            $agente = Cliente::where('agent', 1)->where('id', $ag)->first();
            array_push($agentes, $agente);
        }
        $textoAtivo = TextoPadrao::where('active', 1)->first();
        $observacao = $dados['Five']['observacao'] ?? null;

        $piPreview = new Pi();
        $piPreview->id = 0;

        // Monta lista de lançamentos para a prévia
        $lista_lancamentos = [];
        $parcelasDetalhe = $four['parcelasDetalhe'] ?? [];
        if (is_array($parcelasDetalhe) && count($parcelasDetalhe) > 0) {
            $i = 1;
            foreach ($parcelasDetalhe as $parc) {
                $lista_lancamentos[] = [
                    'valor' => (float)($parc['valor'] ?? 0),
                    'parcelas' => $i . '/' . count($parcelasDetalhe),
                    'data_lancamento' => $parc['data'] ?? ($four['dtPgto'] ?? date('Y-m-d')),
                ];
                $i++;
            }
        } else {
            $qtdParcelas = (int)($four['qtdParcelas'] ?? 0);
            $dtPgto = $four['dtPgto'] ?? date('Y-m-d');
            $vl_total = 0;
            foreach ($servicos as $s) { $vl_total += (float)($s['vlr_total'] ?? 0); }
            if ($qtdParcelas > 0 && $vl_total > 0) {
                $vl_parcela = $vl_total / $qtdParcelas;
                for ($i = 0; $i < $qtdParcelas; $i++) {
                    $lista_lancamentos[] = [
                        'valor' => $vl_parcela,
                        'parcelas' => ($i + 1) . '/' . $qtdParcelas,
                        'data_lancamento' => date('Y-m-d', strtotime($dtPgto . ' + ' . $i . ' month')),
                    ];
                }
            }
        }

        $pi = $piPreview;
        $pi_cli =  PDF::loadview('relatorios.pi.pi_nova', compact('pi', 'idPaineis', 'cliente', 'agentes', 'bs_inicio', 'bs_final', 'bs_formated',  'pagamento', 'forma_pagamento',
            'dt_atual', 'bairro', 'cidade', 'uf','campanha', 'servicos', 'faturamento', 'vendedor', 'textoAtivo', 'lista_lancamentos', 'observacao'));
        $pi_cli->setPaper('a4', 'landscape');
        return $pi_cli->stream('pi_preview.pdf');
    }


}


