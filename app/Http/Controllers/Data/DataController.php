<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\UF;
use Illuminate\Support\Facades\DB;

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

    public function getBairros(Request $request) {

        $bairros = DB::table('bairros as bai')
                    ->select('bai.id', 'bai.nome')
                    ->join('regioes as reg', 'bai.regiao_id', 'reg.id')
                    ->where('reg.cidade_id', $request->cidade)
                    ->orderBy('nome')
                    ->get();
        return $bairros;

    }

    public function getCidades(Request $request)  {
        $cidades = Cidade::with('uf')
        ->where('uf_id', $request->uf)
        ->orderBy('nome')
        ->get();

        return $cidades;
        
    }

    public function getUf()  {
        $uf = UF::orderBy('nome')->get();

        return $uf;
    }

    public function getUfCli(Request $request) {
        $uf = UF::where('id', $request->uf)->first();

        return $uf;
    }


}
