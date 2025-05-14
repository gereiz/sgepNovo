<?php

namespace App\Http\Controllers\Relatorios;

use App\Http\Controllers\Controller;
use App\Models\Painel;
use App\Models\Reserva;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PDF;
use Carbon\Carbon;

class RelPainelBisemanaController extends Controller
{

    public function index() {

        $anos = Ano::orderBy('ano_bisemana', 'desc')->get();
        
        return Inertia::render('Relatorios/PaineisXBisemana/RelPainelBisemana', [
            'anos' => $anos
        ]);
    }
    
    public function setRelPainelBisemana(Request $request) {
        // dd($request->all());

        $anoId = $request->anoId;
        $bsId = $request->bsId;
        $orient = $request->orient;

        
        // Store in session
        session(['anoId' => $anoId]);
        session(['bsId' => $bsId]);
        session(['orient' => $orient]);
        
        return response()->json(['success' => true]);
    }
    
    public function getRelPainelBisemana()
    {
        $anoId = session('anoId');
        $bsId = session('bsId');
        $orient = session('orient');

        $dt_atual = Carbon::today()->toDateString();
        $dt_atual = explode('-', $dt_atual);
        $dt_atual = $dt_atual[2].'/'.$dt_atual[1].'/'.$dt_atual[0];
        
        // Get bisemana details
        $bisemana = Bisemana::find($bsId);
        
        // Get all panels with reservations for this bisemana
        $paineis = DB::table('outdoors')
            ->join('reservas', 'outdoors.id', '=', 'reservas.outdoor_id')
            ->join('clientes', 'reservas.cliente_id', '=', 'clientes.id')
            ->join('bairros', 'outdoors.bairro_id', '=', 'bairros.id')
            ->join('regioes', 'bairros.regiao_id', '=', 'regioes.id')
            ->join('cidades', 'regioes.cidade_id', '=', 'cidades.id')
            ->where('reservas.bisemana_id', $bsId)
            ->select(
                'outdoors.id',
                'outdoors.identificacao',
                'outdoors.logradouro',
                'outdoors.ponto_referencia',
                'bairros.nome as bairro',
                'regioes.nome as regiao',
                'cidades.nome as cidade',
                DB::raw('COALESCE(clientes.nome_fantasia, clientes.razao_social) as cliente')
            )
            ->orderBy('cidades.nome')
            ->orderBy('regioes.nome')
            ->orderBy('bairros.nome')
            ->orderBy('outdoors.identificacao')
            ->get();
        
        // Group panels by city, region, and neighborhood
        $paineisPorCidade = [];
        foreach ($paineis as $painel) {
            if (!isset($paineisPorCidade[$painel->cidade])) {
                $paineisPorCidade[$painel->cidade] = [];
            }
            
            if (!isset($paineisPorCidade[$painel->cidade][$painel->regiao])) {
                $paineisPorCidade[$painel->cidade][$painel->regiao] = [];
            }
            
            if (!isset($paineisPorCidade[$painel->cidade][$painel->regiao][$painel->bairro])) {
                $paineisPorCidade[$painel->cidade][$painel->regiao][$painel->bairro] = [];
            }
            
            $paineisPorCidade[$painel->cidade][$painel->regiao][$painel->bairro][] = $painel;
        }

        // Generate PDF
        $pdf = PDF::loadView('relatorios.paineisXbisemanas.rel_pain_x_bisemana', compact('paineisPorCidade', 'paineis', 'bisemana', 'dt_atual'));
        
        if ($orient == 'L') {
            $pdf->setPaper('a4', 'landscape');
        } else {
            $pdf->setPaper('a4', 'portrait');
        }
        
        return $pdf->stream('paineis_bisemana.pdf');
    }
}