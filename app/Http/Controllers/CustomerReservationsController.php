<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CustomerReservationsController extends Controller
{
    public function getCustomerReservationsByBiweek($biweek)
    {
        $reservations = DB::table('reservas')
            ->join('clientes', 'reservas.cliente_id', '=', 'clientes.id')
            ->select(DB::raw('COALESCE(clientes.nome_fantasia, clientes.razao_social) as name'), DB::raw('COUNT(*) as value'))
            ->where('reservas.bisemana_id', $biweek)
            ->groupBy('clientes.id', 'clientes.nome_fantasia', 'clientes.razao_social')
            ->get();

        return response()->json([
            'biweek' => $biweek,
            'reservations' => $reservations
        ]);
}

}