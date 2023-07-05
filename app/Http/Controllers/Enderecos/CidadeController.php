<?php

namespace App\Http\Controllers\Enderecos;

use App\Http\Controllers\Controller;
use App\Http\Requests\CidadeRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use DB;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\UF;

class CidadeController extends Controller
{
    public function index() {

        $cidades = Cidade::with('uf')->orderBy('nome')->get();
        $uf = UF::orderBy('nome')->get();

        return Inertia::render('Enderecos/CadCidade', compact('cidades', 'uf'));
    }

    public function cadastraCidade(CidadeRequest $request) {

        Cidade::create($request->validated());

        return to_route('cad.cidade');

    }


    public function editaCidade(Request $request) {

        $cidade = Cidade::find($request->id_cidade)->update(['nome' => $request->nome_edit]);
        

        return to_route('cad.cidade');
    }


    public function deletaCidade(Request $request) {
        
        $cidade = Cidade::find($request->id_cidade)->delete();

        return to_route('cad.cidade');
    }



}
