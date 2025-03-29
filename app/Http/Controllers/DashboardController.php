<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Config\Ano;
use App\Models\Bisemanas\Bisemana;
use Inertia\Inertia;

class DashboardController extends Controller {
    public function index()
    {
        $anos = Ano::all();
        $bisemanas = Bisemana::all();
        
        return Inertia::render('Dashboard', [
            'anos' => $anos,
            'bisemanas' => $bisemanas
        ]);
    }

    public function getClienteReservas(Request $request)
    {
        $ano = $request->input('ano');
        $bisemana = $request->input('bisemana');

        $reservas = Reserva::select('clientes.nome as cliente', DB::raw('COUNT(*) as total'))
            ->join('clientes', 'reservas.cliente_id', '=', 'clientes.id')
            ->where('reservas.ano', $ano)
            ->where('reservas.bisemana', $bisemana)
            ->groupBy('clientes.nome')
            ->orderBy('total', 'desc')
            ->get();

        return response()->json($reservas);
    }
}