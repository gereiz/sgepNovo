<?php

namespace App\Http\Controllers\Enderecos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\BairroRequest;
use Illuminate\Http\Request;
use DB;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Regiao;

class BairroController extends Controller
{
    public function index() {

        $bairros = Bairro::with('regiao')->orderBy('nome')->get();
        $regioes = Regiao::orderBy('nome')->get();

        return Inertia::render('Enderecos/CadBairro', compact('bairros', 'regioes'));
    }

    public function cadastraBairro(BairroRequest $request) {

        Bairro::create($request->validated());

        return to_route('cad.bairro');

    }


    public function editaBairro(Request $request) {

        $bairro = Bairro::find($request->id_bairro)->update(['nome' => $request->nome_edit]);

        return to_route('cad.bairro');
    }


    public function deletaBairro(Request $request) {


        $bairro = Bairro::find($request->id_bairro)->delete();

        return to_route('cad.bairro');

    }


} 