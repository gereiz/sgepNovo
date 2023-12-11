<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\UF;

use App\Services\DataService;

class DataController extends Controller
{

    public function __construct() {
        $this->middleware('auth');
    }


    public function getBs(Request $request) {

        $dataService = new DataService();

        return $dataService->getBisemana($request->anoId);

    }

    public function getBairros() {

        $bairros = Bairro::with('regiao')->orderBy('nome')->get();

        return $bairros;

    }


    public function getCidades()  {
        $cidades = Cidade::with('uf')->orderBy('nome')->get();

        return $cidades;
        
    }

    public function getUf()  {
        $uf = UF::orderBy('nome')->get();

        return $uf;
    }


}
