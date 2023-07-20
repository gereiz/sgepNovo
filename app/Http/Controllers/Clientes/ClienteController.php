<?php

namespace App\Http\Controllers\Clientes; 

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Clientes\Cliente;


class ClienteController extends Controller
{
    public function index() {

        $clientes = Cliente::orderBy('nome_fantasia')->get();

        return Inertia::render('Clientes/ListaClientes', compact('clientes'));
    }
}
