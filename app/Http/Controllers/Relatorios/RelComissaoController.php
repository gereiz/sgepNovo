<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;
use PDF;
use App\Models\Clientes\Cliente;

class RelComissaoController extends Controller
{
    public function index() {

        return Inertia::render('Relatorios/Comissao/RelComissao');
    }


    public function setRelComissoes(Request $request) {

        session(['agentes' => $request->agentes]);
        session(['bisemanas' => $request->bisemanas]);
        session(['pis' => $request->pis]);
        session(['comissoes' => $request->comissoes]);
        session(['agente_sel' => $request->agenteSel]);
        session(['status_sel' => $request->statusSel ?? 'todos']);
        session(['agrupar_sel' => $request->agruparSel ? true : false]);
        


        return response()->json(['success' => true]);
    }

    public function getRelComissoes() {

        $dt_atual = Carbon::today()->format('d/m/Y');
        $agentes = session('agentes');
        $bisemanas = session('bisemanas');
        $pis = session('pis');
        $comissoes = session('comissoes');
        $agente_sel = session('agente_sel');
        $status_sel = session('status_sel') ?? 'todos';
        $agrupar = session('agrupar_sel') ?? false;

        // Mapa de status por PI
        $piIds = collect($pis)->pluck('id')->toArray();
        $lans = \App\Models\Financeiro\Lancamento::whereIn('id_reserva', $piIds)->get()->groupBy('id_reserva');
        $isRecebida = function($piId) use ($lans) {
            $ls = $lans->get($piId, collect());
            if ($ls->isEmpty()) return false;
            return $ls->every(fn($l) => ($l->status_pagamento ?? 'PENDENTE') === 'QUITADO');
        };

        // Filtra por agente selecionado (quando enviado do front)
        if ($agente_sel && intval($agente_sel) !== 0) {
            $comissoes = collect($comissoes)->where('agente_id', intval($agente_sel))->values()->all();
            $agentes = collect($agentes)->filter(function ($a) use ($agente_sel) {
                return ($a['id'] ?? 0) == intval($agente_sel);
            })->values()->all();
        }

        // Filtra por status de recebimento, se necessário
        if ($status_sel !== 'todos') {
            $comissoes = collect($comissoes)->filter(function($c) use ($status_sel, $isRecebida) {
                return $status_sel === 'recebidos' ? $isRecebida($c['pi_id']) : !$isRecebida($c['pi_id']);
            })->values()->all();
        }

        // Deduplica combinações iguais (agente, comissao, pi, valor)
        $comissoes = collect($comissoes)->unique(function ($c) {
            $valor = number_format((float)($c['valor_comissao'] ?? 0), 2, '.', '');
            return ($c['agente_id'] ?? '0').'|'.($c['comissao_id'] ?? '0').'|'.($c['pi_id'] ?? '0').'|'.$valor;
        })->values()->all();

        // Agrupamento por agente (linha única por agente)
        if ($agrupar) {
            $comissoes = collect($comissoes)
                ->groupBy('agente_id')
                ->map(function ($items, $agId) {
                    $soma = $items->sum(function($i){ return (float)$i['valor_comissao']; });
                    $ultimaData = $items->max('created_at');
                    return [
                        'agente_id' => (int)$agId,
                        'valor_comissao' => $soma,
                        'pi_id' => null,
                        'created_at' => $ultimaData,
                    ];
                })
                ->values()
                ->all();
        }
        // Totalizadores Recebidos x A Receber (valores de comissão)
        $totais = collect($comissoes)->reduce(function($acc, $c) use ($isRecebida) {
            if ($isRecebida($c['pi_id'])) {
                $acc['recebidos'] += (float)$c['valor_comissao'];
            } else {
                $acc['a_receber'] += (float)$c['valor_comissao'];
            }
            return $acc;
        }, ['recebidos' => 0.0, 'a_receber' => 0.0]);



        $pdf = PDF::loadView('relatorios.comissao.rel_comissoes', compact('dt_atual', 'agentes', 'bisemanas', 'pis', 'comissoes', 'totais', 'agrupar'));
        return $pdf->setPaper('a4', 'landscape')->stream('Rel-Comissoes.pdf');
    }
}
