<?php

namespace App\Http\Controllers\Enderecos;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegiaoRequest; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use DB;
use App\Models\Enderecos\Regiao;
use App\Models\Enderecos\Cidade;

class RegiaoController extends Controller
{
    public function index() {
        
        $regioes = Regiao::with('cidade')->orderBy('nome')->get();
        $cidades = Cidade::orderBy('nome')->get();

        return Inertia::render('Enderecos/CadRegiao', compact('regioes', 'cidades'));
    }


    public function cadastraRegiao(RegiaoRequest $request) {
        
        Regiao::create($request->validated());

        return to_route('cad.regiao');

    }


    public function editaRegiao(Request $request) {

        $regiao = Regiao::find($request->id_regiao)->update(['nome' => $request->nome_edit]);
        // $regiao = Regiao::find($request->id_regiao)->update(['nome' => $request->nome_edit, 'cidade_id' => $request->id_cidade]);

        return to_route('cad.regiao');
    }


    public function deletaRegiao(Request $request) {
        
        $regiao = Regiao::find($request->id_regiao)->delete();

        return to_route('cad.regiao');
    }
}
