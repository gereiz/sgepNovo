<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use App\Models\Bisemanas\Bisemana;
use App\Models\Clientes\Cliente;
use App\Models\Paineis\Painel;
use App\Services\Reserva\LedService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PDF;

class RelLedController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function mapaOcupacao(Request $request)
    {
        $anos = \App\Models\Config\Ano::orderBy('ano_bisemana', 'desc')->get();
        $primeiroAno = $anos->first();

        $bisemanas = collect([]);
        if ($primeiroAno) {
            $bisemanas = Bisemana::where('ano_id', $primeiroAno->id)
                ->orderBy('id')
                ->get();
        }

        $clientes = Cliente::orderBy('razao_social')
            ->where('ativo', 1)
            ->select('id', 'razao_social', 'nome_fantasia')
            ->get();

        $leds = Painel::where('is_led', 1)
            ->orderByRaw('CAST(identificacao AS UNSIGNED) ASC')
            ->get(['id', 'identificacao', 'bairro_id', 'tipo']);

        $dadosIniciais = null;
        try {
            $ledService = new LedService();
            $filtros = [
                'bisemana_inicial' => $bisemanas->first()->id ?? null,
                'bisemana_final'   => $bisemanas->last()->id  ?? null,
            ];
            $dadosIniciais = $ledService->getMapaOcupacao($filtros);
        } catch (\Throwable $e) {
            $dadosIniciais = ['leds' => [], 'range_bs' => [], 'total_leds' => 0];
        }

        $diasAlerta = LedService::DIAS_ALERTA_TERMINO;

        return Inertia::render('Relatorios/Led/MapaOcupacaoLed', compact(
            'anos',
            'bisemanas',
            'clientes',
            'leds',
            'dadosIniciais',
            'diasAlerta'
        ));
    }

    public function relReservas(Request $request)
    {
        $anos = \App\Models\Config\Ano::orderBy('ano_bisemana', 'desc')->get();
        $primeiroAno = $anos->first();

        $bisemanas = collect([]);
        if ($primeiroAno) {
            $bisemanas = Bisemana::where('ano_id', $primeiroAno->id)
                ->orderBy('id')
                ->get();
        }

        $clientes = Cliente::orderBy('razao_social')
            ->where('ativo', 1)
            ->select('id', 'razao_social', 'nome_fantasia')
            ->get();

        $leds = Painel::where('is_led', 1)
            ->orderByRaw('CAST(identificacao AS UNSIGNED) ASC')
            ->get(['id', 'identificacao']);

        $ledService = new LedService();
        $filtros = [
            'bisemana_inicial' => $bisemanas->first()->id ?? null,
            'bisemana_final'   => $bisemanas->last()->id  ?? null,
        ];
        $dadosIniciais = $ledService->getReservasLed($filtros);

        return Inertia::render('Relatorios/Led/RelReservasLed', compact(
            'anos',
            'bisemanas',
            'clientes',
            'leds',
            'dadosIniciais'
        ));
    }

    public function relReservasPdf(Request $request)
    {
        $ledService = new LedService();
        $filtros = $request->all();
        $result = $ledService->getReservasLed($filtros);

        $titulo = 'Relatório de Reservas de LEDs';
        $dtEmissao = Carbon::now()->format('d/m/Y H:i');

        $filtroAplicado = [];
        if (!empty($filtros['bisemana_inicial']) && !empty($filtros['bisemana_final'])) {
            $bsI = Bisemana::find($filtros['bisemana_inicial']);
            $bsF = Bisemana::find($filtros['bisemana_final']);
            if ($bsI && $bsF) {
                $filtroAplicado[] = 'Bi-semana: BS ' . ($bsI->num_bisemana ?? '?') . ' até BS ' . ($bsF->num_bisemana ?? '?');
            }
        }
        if (!empty($filtros['cliente_id'])) {
            $cli = Cliente::find($filtros['cliente_id']);
            if ($cli) $filtroAplicado[] = 'Cliente: ' . ($cli->razao_social ?? $cli->nome_fantasia);
        }
        if (!empty($filtros['outdoor_id'])) {
            $p = Painel::find($filtros['outdoor_id']);
            if ($p) $filtroAplicado[] = 'LED: ' . $p->identificacao;
        }

        $pdf = PDF::loadView('relatorios.led.rel_reservas_led', compact(
            'titulo',
            'dtEmissao',
            'filtroAplicado',
            'result'
        ))->setPaper('A4', 'landscape');

        return $pdf->stream('reservas_leds_' . Carbon::now()->format('Ymd_His') . '.pdf');
    }
}
