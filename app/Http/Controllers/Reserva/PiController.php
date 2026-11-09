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
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

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

        $participantesComissoes = session('dadosPi')['Two']['participantesComissoes'] ?? null;
        $isNovoFluxoComissao = is_array($participantesComissoes) && count($participantesComissoes) > 0;

        $agentes = [];
        $ordenados = [];
        if ($isNovoFluxoComissao) {
            $ordenados = collect($participantesComissoes)->sortBy(function($p) {
                return ($p['pessoa_tipo'] ?? '') === 'cliente' ? 0 : 1;
            })->values()->all();

            foreach ($ordenados as $pc) {
                $tipo = $pc['pessoa_tipo'] ?? 'user';
                $pid  = (int)($pc['pessoa_id'] ?? 0);
                $idSintetico = $tipo === 'user' ? 1000000 + $pid : 2000000 + $pid;
                $nomeExibir = trim((string)($pc['nome'] ?? ''));

                $agObj = new \stdClass();
                $agObj->id_sintetico = $idSintetico;
                $agObj->id = $idSintetico;
                $agObj->pessoa_tipo_real = $tipo;
                $agObj->pessoa_id_real = $pid;
                $agObj->nome_fantasia = $nomeExibir;
                $agObj->razao_social = $nomeExibir;
                $agObj->nome = $nomeExibir;
                $agObj->cpf_cnpj = '';
                $agObj->nro_insc = '';
                $agObj->endereco = '';
                $agObj->num = '';
                $agObj->bairro = '';
                $agObj->cidade = '';
                $agObj->uf = '';
                $agObj->complemento = '';
                $agObj->cep = '';

                if ($tipo === 'cliente' && $pid > 0) {
                    $cliAg = Cliente::find($pid);
                    if ($cliAg) {
                        $agObj->cpf_cnpj = $cliAg->cpf_cnpj ?? '';
                        $agObj->nro_insc = $cliAg->nro_insc ?? '';
                        $agObj->endereco = $cliAg->endereco ?? '';
                        $agObj->num = $cliAg->num ?? '';
                        $agObj->bairro = $cliAg->bairro ?? '';
                        $agObj->cidade = $cliAg->cidade ?? '';
                        $agObj->uf = $cliAg->uf ?? '';
                        $agObj->complemento = $cliAg->complemento ?? '';
                        $agObj->cep = $cliAg->cep ?? '';
                        if (!empty($cliAg->nome_fantasia)) {
                            $agObj->nome_fantasia = $cliAg->nome_fantasia;
                        }
                        if (!empty($cliAg->razao_social)) {
                            $agObj->razao_social = $cliAg->razao_social;
                        }
                    }
                }
                $agentes[] = $agObj;
            }
        } else {
            $agentesIds = array_unique(session('dadosPi')['Two']['agentesId'] ?? []);
            foreach ($agentesIds as $ag) {
                $agente = Cliente::where('agent', 1)->where('id', $ag)->first();
                if ($agente) {
                    array_push($agentes, $agente);
                }
            }
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

        $vendedor = session('dadosPi')['Two']['vendedor'] ?? '';
        $vendedorId = (int)(session('dadosPi')['Two']['vendedorId'] ?? 0);
        if (empty($vendedor) && $vendedorId > 0) {
            $vendedor = User::find($vendedorId)?->name ?? '';
        }


        // Grava as reservas e detecta painéis LED
        $temPaineisLed = false;
        foreach($idPaineis as $idPainel) {
            $painel = Painel::where('identificacao', $idPainel)->first();
            if ($painel && !empty($painel->is_led)) {
                $temPaineisLed = true;
            }

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

                // Observação: prefixa tag LED se houver painéis LED no PI
                $obsOriginal = session('dadosPi')['Four']['servicos'][0]['detalhes'] ?? '';
                $prefixoLed = $temPaineisLed ? "[PAINÉIS LED INCLUÍDOS]\n" : '';
                $obsFinal = trim($prefixoLed . $obsOriginal);

                $pi = Pi::updateOrCreate([
                    'id_cliente' => session('dadosPi')['One']['clienteId'],
                    'id_paineis' => json_encode(session('dadosPi')['Two']['paineis']),
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
                    'obs' => $obsFinal
                ]);

                $nomeClienteSeguroPi = preg_replace('/[^A-Za-z0-9_-]+/', '_', (string)$cliente_nome);
                $anoPi = substr((string)$dt_pi, 0, 4);
                $nomeArquivoPi = 'PI' . $pi->id . '_' . $anoPi . '_' . $nomeClienteSeguroPi . '_' . $dt_pi . '.pdf';
                $pi->update(['arquivo' => $nomeArquivoPi]);

            }

            // dd($data_pgto_formated);

            //Recupera a reserva
            $reserva = Reserva::where('cliente_id', session('dadosPi')['One']['clienteId'])
            ->where('bisemana_id', session('dadosPi')['Two']['bisemanaId'])
            ->where('pi_ok', 1)->get();

            $valor_liq_comissoes = 0;
            $comissoes = [];

            if ($isNovoFluxoComissao) {
                $comissoesHelperData = [];
                $vlrTotalComissoes = $vl_total;
                $totaisParticipantes = [];

                foreach ($servicos as $sp) {
                    if (!is_array($sp)) continue;
                    $svVlrUnit = (float)($sp['vlr_unit'] ?? 0);
                    $svDescUnit = (float)($sp['vlr_desc'] ?? 0);
                    $svCustUnit = (float)($sp['vlr_custo'] ?? 0);
                    $svQtdCob = (int)($sp['qtd_cobrada'] ?? ((int)($sp['quantidade'] ?? 0) - (int)($sp['bonificado'] ?? 0)));
                    $svBaseUnit = max(0, $svVlrUnit - $svDescUnit - $svCustUnit);
                    $svBase = max(0, $svQtdCob * $svBaseUnit);
                    $svId = (int)($sp['id'] ?? 0);

                    foreach ($ordenados as $pc) {
                        $tipo = $pc['pessoa_tipo'] ?? 'user';
                        $pid  = (int)($pc['pessoa_id'] ?? 0);
                        $chave = $tipo . ':' . $pid;
                        $idSintetico = $tipo === 'user' ? 1000000 + $pid : 2000000 + $pid;

                        $regraIdRaw = (int)($pc['comissao_id'] ?? 0);
                        $regraZerada = $regraIdRaw === -1;

                        if ($regraZerada) {
                            $vlrCom = 0.0;
                            $regraIdCadastro = null;
                            $regraTipoFinal = 0;
                        } else {
                            $regraTipo = (int)($pc['comissao_tipo'] ?? 1);
                            $regraVal  = (float)($pc['comissao_valor_numerico'] ?? 0);
                            $regraVal  = max(0, $regraVal);
                            if ($regraTipo === 1) {
                                $vlrCom = $svBase * $regraVal / 100;
                            } else {
                                $vlrCom = $regraVal;
                            }
                            $regraIdCadastro = $regraIdRaw > 0 ? $regraIdRaw : null;
                            $regraTipoFinal = $regraTipo;
                        }

                        $vlrCom = (float)number_format($vlrCom, 2, '.', '');
                        $vlrTotalComissoes -= $vlrCom;

                        $comissoesHelperData[] = [
                            'id_servico'     => $svId,
                            'id_funcionario' => $idSintetico,
                            'valor'          => ($regraTipoFinal === 1 ? $regraVal : $vlrCom),
                            'tipo_comissao'  => $regraTipoFinal,
                            'comissao_cadastro_id' => $regraIdCadastro,
                            'vlr_comissao_calculado' => $vlrCom,
                        ];

                        if (!isset($totaisParticipantes[$chave])) {
                            $totaisParticipantes[$chave] = [
                                'pessoa_tipo' => $tipo,
                                'pessoa_id' => $pid,
                                'comissao_cadastro_id' => $regraIdCadastro,
                                'valor_comissao' => 0.0,
                            ];
                        }
                        $totaisParticipantes[$chave]['valor_comissao'] += $vlrCom;
                    }
                }

                foreach ($totaisParticipantes as $tot) {
                    try {
                        $jaExisteQ = ComissaoVenda::where('pi_id', $pi->id)
                            ->where('pessoa_tipo', $tot['pessoa_tipo'])
                            ->where('pessoa_id', $tot['pessoa_id']);
                        if ($tot['comissao_cadastro_id'] === null) {
                            $jaExisteQ->whereNull('comissao_cadastro_id');
                        } else {
                            $jaExisteQ->where('comissao_cadastro_id', $tot['comissao_cadastro_id']);
                        }
                        $jaExiste = $jaExisteQ->first();
                        if (!$jaExiste) {
                            ComissaoVenda::create([
                                'pi_id' => $pi->id,
                                'comissao_cadastro_id' => $tot['comissao_cadastro_id'],
                                'pessoa_tipo' => $tot['pessoa_tipo'],
                                'pessoa_id' => $tot['pessoa_id'],
                                'valor_comissao' => $tot['valor_comissao'],
                                'comissao_id' => null,
                                'agente_id' => null,
                            ]);
                        } else {
                            $jaExiste->update(['valor_comissao' => $tot['valor_comissao']]);
                        }
                    } catch (\Throwable $eCV) {
                        Log::warning('Erro salvar ComissaoVenda PI #' . $pi->id . ': ' . $eCV->getMessage());
                    }
                }

                $valor_liq_comissoes = max(0, $vlrTotalComissoes);
                $comissoes = $comissoesHelperData;
            } else {
                if (count($agentes) > 0) {
                    try {
                        $agenteIds = [];
                        foreach ($agentes as $ag) {
                            if (!empty($ag->id)) $agenteIds[] = (int)$ag->id;
                        }
                        if (count($agenteIds) > 0) {
                            $comissoes = Comissao::whereIn('id_funcionario', $agenteIds)->get()->toArray();
                        }
                    } catch (\Throwable $e) {
                        $comissoes = [];
                    }
                }

                $valor_liq_comissoes = $this->piService->calculateComission($servicos, $agentes, $pi, $valor_liq_comissoes);
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
                $pdfDir = storage_path('app/public/pdf/pi');
                if (!File::exists($pdfDir)) {
                    File::makeDirectory($pdfDir, 0755, true);
                }

                $textoAtivo = TextoPadrao::where('active', 1)->first();
                $observacao = session('dadosPi')['Five']['observacao'] ?? null;
                $pi_fin =  PDF::loadview('relatorios.pi.pi_fin_nova', compact('pi', 'idPaineis',  'cliente', 'agentes', 'comissoes', 'bs_inicio', 'bs_final', 'bs_formated',  'pagamento', 'forma_pagamento',
                'dt_atual', 'bairro', 'cidade', 'uf','campanha', 'servicos', 'faturamento', 'vendedor', 'lista_lancamentos', 'valor_liq_comissoes', 'textoAtivo', 'observacao'));

                $pi_fin->setPaper('a4', 'landscape');

                $nomeClienteSeguroFin = preg_replace('/[^A-Za-z0-9_-]+/', '_', (string)$cliente_nome);
                $anoFin = substr((string)$dt_pi, 0, 4);
                $nomeArquivoFin = 'pi_fin_PI' . $pi->id . '_' . $anoFin . '_' . $nomeClienteSeguroFin . '_' . $dt_pi . '.pdf';
                $pi_fin->save($pdfDir . '/' . $nomeArquivoFin);

                // Via do Cliente
                $pi_cli =  PDF::loadview('relatorios.pi.pi_nova', compact('pi', 'idPaineis', 'cliente', 'agentes', 'comissoes', 'bs_inicio', 'bs_final', 'bs_formated',  'pagamento', 'forma_pagamento',
                'dt_atual', 'bairro', 'cidade', 'uf','campanha', 'servicos', 'faturamento', 'vendedor', 'lista_lancamentos', 'valor_liq_comissoes', 'textoAtivo', 'observacao'));

                $pi_cli->setPaper('a4', 'landscape');

                $nomeArquivoCli = 'pi_cli_PI' . $pi->id . '_' . $anoFin . '_' . $nomeClienteSeguroFin . '_' . $dt_pi . '.pdf';
                $pi_cli->save($pdfDir . '/' . $nomeArquivoCli);


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
        $vendedorId = (int)($two['vendedorId'] ?? 0);
        if (empty($vendedor) && $vendedorId > 0) {
            $vendedor = User::find($vendedorId)?->name ?? null;
        }

        $participantesComissoes = $two['participantesComissoes'] ?? null;
        $isNovoFluxoComissao = is_array($participantesComissoes) && count($participantesComissoes) > 0;

        $agentes = [];
        $comissoes = [];
        $valor_liq_comissoes = 0;

        $vl_total = 0;
        foreach ($servicos as $s) {
            $vl_total += (float)($s['vlr_total'] ?? 0);
        }

        if ($isNovoFluxoComissao) {
            $ordenados = collect($participantesComissoes)->sortBy(function($p) {
                return ($p['pessoa_tipo'] ?? '') === 'cliente' ? 0 : 1;
            })->values()->all();

            foreach ($ordenados as $pc) {
                $tipo = $pc['pessoa_tipo'] ?? 'user';
                $pid  = (int)($pc['pessoa_id'] ?? 0);
                $idSintetico = $tipo === 'user' ? 1000000 + $pid : 2000000 + $pid;
                $nomeExibir = trim((string)($pc['nome'] ?? ''));

                $agObj = new \stdClass();
                $agObj->id_sintetico = $idSintetico;
                $agObj->id = $idSintetico;
                $agObj->pessoa_tipo_real = $tipo;
                $agObj->pessoa_id_real = $pid;
                $agObj->nome_fantasia = $nomeExibir;
                $agObj->razao_social = $nomeExibir;
                $agObj->nome = $nomeExibir;
                $agObj->cpf_cnpj = '';
                $agObj->nro_insc = '';
                $agObj->endereco = '';
                $agObj->num = '';
                $agObj->bairro = '';
                $agObj->cidade = '';
                $agObj->uf = '';
                $agObj->complemento = '';
                $agObj->cep = '';

                if ($tipo === 'cliente' && $pid > 0) {
                    $cliAg = Cliente::find($pid);
                    if ($cliAg) {
                        $agObj->cpf_cnpj = $cliAg->cpf_cnpj ?? '';
                        $agObj->nro_insc = $cliAg->nro_insc ?? '';
                        $agObj->endereco = $cliAg->endereco ?? '';
                        $agObj->num = $cliAg->num ?? '';
                        $agObj->bairro = $cliAg->bairro ?? '';
                        $agObj->cidade = $cliAg->cidade ?? '';
                        $agObj->uf = $cliAg->uf ?? '';
                        $agObj->complemento = $cliAg->complemento ?? '';
                        $agObj->cep = $cliAg->cep ?? '';
                        if (!empty($cliAg->nome_fantasia)) {
                            $agObj->nome_fantasia = $cliAg->nome_fantasia;
                        }
                        if (!empty($cliAg->razao_social)) {
                            $agObj->razao_social = $cliAg->razao_social;
                        }
                    }
                }
                $agentes[] = $agObj;
            }

            $comissoesHelperData = [];
            $vlrTotalComissoes = $vl_total;

            foreach ($servicos as $sp) {
                if (!is_array($sp)) continue;
                $svVlrUnit = (float)($sp['vlr_unit'] ?? 0);
                $svDescUnit = (float)($sp['vlr_desc'] ?? 0);
                $svCustUnit = (float)($sp['vlr_custo'] ?? 0);
                $svQtdCob = (int)($sp['qtd_cobrada'] ?? ((int)($sp['quantidade'] ?? 0) - (int)($sp['bonificado'] ?? 0)));
                $svBaseUnit = max(0, $svVlrUnit - $svDescUnit - $svCustUnit);
                $svBase = max(0, $svQtdCob * $svBaseUnit);
                $svId = (int)($sp['id'] ?? 0);

                foreach ($ordenados as $pc) {
                    $tipo = $pc['pessoa_tipo'] ?? 'user';
                    $pid  = (int)($pc['pessoa_id'] ?? 0);
                    $idSintetico = $tipo === 'user' ? 1000000 + $pid : 2000000 + $pid;

                    $regraIdRaw = (int)($pc['comissao_id'] ?? 0);
                    $regraZerada = $regraIdRaw === -1;

                    if ($regraZerada) {
                        $vlrCom = 0.0;
                        $regraIdCadastro = null;
                        $regraTipoFinal = 0;
                    } else {
                        $regraTipo = (int)($pc['comissao_tipo'] ?? 1);
                        $regraVal  = (float)($pc['comissao_valor_numerico'] ?? 0);
                        $regraVal  = max(0, $regraVal);
                        if ($regraTipo === 1) {
                            $vlrCom = $svBase * $regraVal / 100;
                        } else {
                            $vlrCom = $regraVal;
                        }
                        $regraIdCadastro = $regraIdRaw > 0 ? $regraIdRaw : null;
                        $regraTipoFinal = $regraTipo;
                    }

                    $vlrCom = (float)number_format($vlrCom, 2, '.', '');
                    $vlrTotalComissoes -= $vlrCom;

                    $comissoesHelperData[] = [
                        'id_servico'     => $svId,
                        'id_funcionario' => $idSintetico,
                        'valor'          => ($regraTipoFinal === 1 ? $regraVal : $vlrCom),
                        'tipo_comissao'  => $regraTipoFinal,
                        'comissao_cadastro_id' => $regraIdCadastro,
                        'vlr_comissao_calculado' => $vlrCom,
                    ];
                }
            }
            $valor_liq_comissoes = max(0, $vlrTotalComissoes);
            $comissoes = $comissoesHelperData;
        } else {
            foreach (($two['agentesId'] ?? []) as $ag) {
                if ((int)$ag <= 0) continue;
                $agente = Cliente::where('agent', 1)->where('id', (int)$ag)->first();
                if ($agente) array_push($agentes, $agente);
            }
            if (count($agentes) === 0) {
                $agDummy = new \stdClass();
                $agDummy->id = 0;
                $agDummy->razao_social = '— Não há agências/parceiros vinculados a esta PI —';
                $agDummy->nome_fantasia = '';
                $agDummy->cpf_cnpj = '';
                $agDummy->nro_insc = '';
                $agDummy->endereco = '';
                $agDummy->num = '';
                $agDummy->complemento = '';
                $agDummy->bairro = 0;
                $agDummy->cidade = $cliente->cidade ?? 0;
                $agDummy->uf = $cliente->uf ?? 0;
                $agDummy->cep = '';
                $agDummy->agent = 1;
                $agentes[] = $agDummy;
            }
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
        $pi_cli =  PDF::loadview('relatorios.pi.pi_nova', compact('pi', 'idPaineis', 'cliente', 'agentes', 'comissoes', 'bs_inicio', 'bs_final', 'bs_formated',  'pagamento', 'forma_pagamento',
            'dt_atual', 'bairro', 'cidade', 'uf','campanha', 'servicos', 'faturamento', 'vendedor', 'textoAtivo', 'lista_lancamentos', 'valor_liq_comissoes', 'observacao'));
        $pi_cli->setPaper('a4', 'landscape');
        return $pi_cli->stream('pi_preview.pdf');
    }


}


