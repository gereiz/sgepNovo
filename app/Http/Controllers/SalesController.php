<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    public function getSalesBySeller($month, $year)
    {
        return Reserva::select(
            'users.name as seller_name',
            'users.id as seller_id',
            DB::raw('SUM(reservas.valor_total) as total_sales')
        )
        ->join('users', 'users.id', '=', 'reservas.user_id')
        ->whereMonth('reservas.created_at', $month)
        ->whereYear('reservas.created_at', $year)
        ->groupBy('users.id', 'users.name')
        ->get();
    }
public function getSalesByBiweek($biweek)
{
    return Reserva::select(
        'users.name as seller_name',
        'users.id as seller_id',
        DB::raw('COUNT(reservas.id) as total_reservations')
    )
    ->join('users', 'users.id', '=', 'reservas.user_id')
    ->where('reservas.bisemana_id', $biweek)
    ->groupBy('users.id', 'users.name')
    ->get();
}

}