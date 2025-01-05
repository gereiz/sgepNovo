<?php

namespace App\Http\Controllers\Clientes;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Clientes\Cliente;

use App\Services\ClienteService;

class ClienteController extends Controller
{
    public function index() {

        $clientes = Cliente::orderBy('nome_fantasia')
            ->where('ativo', 1)
        ->get();

        return Inertia::render('Clientes/ListaClientes', compact('clientes'));
    }


    public function cadastraCliente(Request $request) {

        $clienteService = new ClienteService();

        $clienteService->storeOrUpdateCliente($request);

    }


    public function editCliente(Request $request) {

        return Cliente::where('id', $request->idCliente)->orderBy('nome_fantasia')->get();
    }


    public function deleteCliente(Request $request) {
//        dd($request->all());
        $cliente = Cliente::find($request->idCliente);
        $cliente->ativo = 0;
        $cliente->save();

        return back()->with('success', 'Cliente deletado com sucesso!');
    }

}
