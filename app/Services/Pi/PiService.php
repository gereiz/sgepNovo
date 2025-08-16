<?php

namespace App\Services\Pi;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Models\PI\Pi;
use App\Models\Reservas\Reserva;
use App\Models\Financeiro\Comissao;
use App\Models\Financeiro\ComissaoVenda;
use App\Services\Financeiro\CaixaService;


class PiService
{
    /**
     * Cria ou atualiza uma reserva
     */
    public function storeReservation($cliente_id, $painel_id, $bsId, $campanha)
    {
        $reserva = Reserva::updateOrCreate(
            [
                'cliente_id'  => $cliente_id,
                'outdoor_id'  => $painel_id,
                'bisemana_id' => $bsId,
            ],
            [
                'dt_reserva' => Carbon::now()->toDateString(),
                'campanha'   => $campanha,
                'pi_ok'      => 1,
                'user_id'    => auth()->id(),
            ]
        );

        return $reserva;
    }

    /**
     * Cria ou atualiza PI
     */
    public function storeOrUpdatePi($dados, $nome_cliente, $data_pi, $vlr_unt, $vlr_desc, $vlr_custo, $vl_total, $data_pgto_formated)
    {
        $pi = Pi::updateOrCreate(
            [
                'id_cliente'  => $dados['One']['clienteId'],
                'id_paineis'  => json_encode($dados['Two']['paineis']),
                'id_bisemana' => $dados['Two']['bisemanaId'],
            ],
            [
                'arquivo'         => 'pi_'.$nome_cliente.'_'.$data_pi.'.pdf',
                'contato'         => $dados['One']['responsavel'] ?? null,
                'campanha'        => $dados['Two']['campanha'] ?? null,
                'vl_unit'         => $vlr_unt,
                'vl_desc'         => $vlr_desc,
                'vl_custo'        => $vlr_custo,
                'vl_total'        => $vl_total,
                'pago'            => $dados['Four']['pgto'] ?? 0,
                'dt_pgto'         => $data_pgto_formated ?? now()->toDateString(),
                'forma_pagamento' => $dados['Four']['formaPgto'] ?? null,
                'vendedor'        => $dados['Two']['vendedorId'] ?? null,
                'obs'             => $dados['Four']['servicos'][0]['detalhes'] ?? null,
            ]
        );

        return $pi;
    }

    /**
     * Calcula e registra comissões
     */
    public function calculateComission($servicos, $agentes, $pi, $valor_liq_comissoes)
    {
        foreach ($servicos as $servico) {
            $vlr_total  = $servico['vlr_total'];
            $vlr_unit   = $servico['vlr_unit'];
            $vlr_desc   = $servico['vlr_desc'];
            $vlr_custo  = $servico['vlr_custo'];
            $vlr_liquido = $vlr_total - $vlr_desc - $vlr_custo;

            foreach ($agentes as $agente) {
                $comissao = Comissao::where('id_funcionario', $agente->id)
                                    ->where('id_servico', $servico['id'])
                                    ->first();

                if ($comissao) {
                    if ($comissao->tipo_comissao == 1) {
                        ComissaoVenda::create([
                            'pi_id'          => $pi->id,
                            'comissao_id'    => $comissao->id,
                            'agente_id'      => $agente->id,
                            'valor_comissao' => $vlr_liquido * ($comissao->valor / 100),
                        ]);
                        $vlr_total -= $vlr_liquido * ($comissao->valor / 100);
                    } else {
                        ComissaoVenda::create([
                            'pi_id'          => $pi->id,
                            'comissao_id'    => $comissao->id,
                            'agente_id'      => $agente->id,
                            'valor_comissao' => $vlr_liquido - $comissao->valor,
                        ]);
                        $vlr_total -= $vlr_liquido - $comissao->valor;
                    }
                }
            }

            $valor_liq_comissoes += $vlr_total;
        }

        return $valor_liq_comissoes;
    }

    /**
     * Cria lançamentos financeiros relacionados ao PI
     */
    public function storeFinancialRelease($vl_total, $cliente, $detalhes, $pi, $reserva, $dados)
    {
        $caixaService = new CaixaService();

        $qtdParcelas = $dados['Four']['qtdParcelas'];
        $vl_parcela  = $vl_total / $qtdParcelas;
        $lista_lancamentos = [];

        $lancamento_existe = $caixaService->getLancamentosReserva($pi->id);

        for ($i = 1; $i <= $qtdParcelas; $i++) {
            $descricao = 'PI nº ' . $pi->id . ' Cliente: ' . ($cliente->razao_social ?? $cliente->nome_fantasia);

            $lancamento = [
                'descricao'       => $descricao,
                'valor'           => $vl_parcela,
                'parcelas'        => $i . '/' . $qtdParcelas,
                'data_lancamento' => date('Y-m-d', strtotime($dados['Four']['dtPgto'] . ' + ' . $i . ' month')),
                'centro_custo'    => 1,
                'tipo_lancamento' => 1,
                'id_reserva'      => $pi->id,
                'observacoes'     => $detalhes,
            ];

            $request_lancamento = new \Illuminate\Http\Request();
            $request_lancamento->replace($lancamento);

            if (!$lancamento_existe) {
                $caixaService->createLancamento($request_lancamento);
            } else {
                $lancamento_existe->update($lancamento);
            }

            $lista_lancamentos[] = $lancamento;
        }

        foreach ($reserva as $res) {
            $res->update(['pi_id' => $pi->id]);
        }

        return $lista_lancamentos;
    }
}
