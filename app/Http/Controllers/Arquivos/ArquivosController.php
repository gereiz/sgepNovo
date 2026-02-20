<?php

namespace App\Http\Controllers\Arquivos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use App\Models\PI\Pi;
use App\Models\Vendas\Os;

class ArquivosController extends Controller
{

    public function index() {

        $ambiente = env('APP_ENV');
        $anos = Ano::all();
        $bisemanas = Bisemana::all();

        $pis = Pi::with(['cliente'])->get();

        return Inertia::render('Arquivos/PisGeradas', compact('ambiente', 'anos', 'bisemanas', 'pis'));
    }

    public function vendas() {
        $ambiente = env('APP_ENV');
        $anos = Ano::all();
        $bisemanas = Bisemana::all();
        $vendas = Os::with(['cliente'])->where('cancelada', 0)->get();

        return Inertia::render('Arquivos/VendasGeradas', compact('ambiente', 'anos', 'bisemanas', 'vendas'));
    }


    public function getPiBs(Request $request) {
        $pis = Pi::with(['cliente'])->where('id_bisemana', $request->idBs)
                ->get();

        return $pis;
    }

    public function getOsBs(Request $request) {
        $os = Os::with(['cliente'])->where('id_bisemana', $request->idBs)->where('cancelada', 0)->get();
        return $os;
    }

    public function groupPiPdf(Request $request) {
        $clienteId = (int)$request->input('clienteId');
        $bsIni = (int)$request->input('bsIni');
        $bsFim = (int)$request->input('bsFim');
        if (!$clienteId || !$bsIni || !$bsFim || $bsFim <= $bsIni) {
            return response()->json(['msg'=>'Parâmetros inválidos'], 422);
        }
        $ini = Bisemana::find($bsIni);
        $fim = Bisemana::find($bsFim);
        if (!$ini || !$fim || $ini->ano_id !== $fim->ano_id) {
            return response()->json(['msg'=>'Bi-semanas devem ser do mesmo ano e válidas'], 422);
        }
        $pis = Pi::with('cliente')
            ->where('id_cliente', $clienteId)
            ->whereBetween('id_bisemana', [$bsIni, $bsFim])
            ->orderBy('id_bisemana')
            ->get();
        if ($pis->isEmpty()) {
            return response()->json(['msg'=>'Nenhuma PI encontrada no intervalo'], 404);
        }
        // Monta itens completos para reutilizar os mesmos componentes do layout padrão
        $itens = [];
        $dt_atual = now()->format('d/m/Y');
        $textoAtivo = \App\Models\Textos\TextoPadrao::where('active', 1)->first();
        foreach ($pis as $pi) {
            $cliente = $pi->cliente;
            $bs = Bisemana::find($pi->id_bisemana);
            if (!$bs) { continue; }
            $bs_ini = explode('-', $bs->inicio);
            $bs_fin = explode('-', $bs->fim);
            $bs_inicio = $bs_ini[2].'/'.$bs_ini[1].'/'.$bs_ini[0];
            $bs_final = $bs_fin[2].'/'.$bs_fin[1].'/'.$bs_fin[0];
            $bs_ano = substr($bs_ini[0], 2, 2);
            $bs_formated = 'BS: '. $bs->num_bisemana.' - '.$bs_ini[2].'/'.$bs_ini[1]. ' a '.$bs_fin[2].'/'.$bs_fin[1].'/'.$bs_ano;
            $painel_ids = json_decode($pi->id_paineis, true) ?? [];
            $qtd = max(1, is_array($painel_ids) ? count($painel_ids) : 1);
            // Serviço sintético proporcional à quantidade de painéis para manter totais
            $vl_unit_total = ($pi->vl_total ?? 0) + ($pi->vl_desc ?? 0);
            $servicos = [[
                'nome' => 'Veiculação',
                'quantidade' => $qtd,
                'bonificado' => 0,
                'vlr_unit' => $qtd > 0 ? ($vl_unit_total / $qtd) : $vl_unit_total,
                'vlr_desc' => $qtd > 0 ? (($pi->vl_desc ?? 0) / $qtd) : ($pi->vl_desc ?? 0),
                'vlr_custo' => $qtd > 0 ? (($pi->vl_custo ?? 0) / $qtd) : ($pi->vl_custo ?? 0),
                'vlr_total' => ($pi->vl_total ?? 0),
                'detalhes' => $pi->obs ?? '',
            ]];
            // Parcelas
            $lista_lancamentos = \App\Models\Financeiro\Lancamento::where('id_reserva', $pi->id)
                ->orderBy('dt_faturamento')
                ->get()
                ->map(function($l){
                    return [
                        'descricao' => $l->descricao,
                        'valor' => $l->valor,
                        'parcelas' => $l->parcelas,
                        'data_lancamento' => $l->dt_faturamento,
                    ];
                })->toArray();
            // Endereços
            $bairro = isset($cliente->bairro) ? \App\Models\Enderecos\Bairro::find($cliente->bairro) : null;
            $cidade = isset($cliente->cidade) ? \App\Models\Enderecos\Cidade::find($cliente->cidade) : null;
            $uf = isset($cliente->uf) ? \App\Models\Enderecos\UF::find($cliente->uf) : null;
            // Agentes (stub p/ layout)
            $stub = new \stdClass();
            $stub->razao_social = $cliente->razao_social ?? ($cliente->nome_fantasia ?? '');
            $stub->cpf_cnpj = $cliente->cpf_cnpj ?? '';
            $stub->nro_insc = $cliente->nro_insc ?? '';
            $stub->endereco = $cliente->endereco ?? '';
            $stub->num = $cliente->num ?? '';
            $stub->complemento = $cliente->complemento ?? '';
            $stub->cep = $cliente->cep ?? '';
            $agentes = [$stub];
            $itens[] = [
                'pi' => $pi,
                'cliente' => $cliente,
                'agentes' => $agentes,
                'bairro' => $bairro ?: (object)['nome' => ''],
                'cidade' => $cidade ?: (object)['nome' => ''],
                'uf' => $uf ?: (object)['sigla' => ''],
                'bs_inicio' => $bs_inicio,
                'bs_final' => $bs_final,
                'bs_formated' => $bs_formated,
                'pagamento' => $pi->pago ?? 0,
                'forma_pagamento' => $pi->forma_pagamento ?? 0,
                'dt_atual' => $dt_atual,
                'campanha' => $pi->campanha ?? '',
                'servicos' => $servicos,
                'faturamento' => [
                    'faturar_sobre' => '1',
                    'faturar_contra' => '1',
                    'enviar_faturamento' => '1',
                ],
                'vendedor' => $pi->vendedor ?? null,
                'lista_lancamentos' => $lista_lancamentos,
                'observacao' => $pi->obs ?? '',
                'painel_ids' => $painel_ids,
                'bs' => $bs,
            ];
        }
        $pdf = \PDF::loadView('relatorios.pi.group_cli', compact('itens', 'dt_atual', 'textoAtivo'));
        $pdf->setPaper('a4', 'landscape');
        return $pdf->stream('PIs_Agrupadas.pdf');
    }

}
