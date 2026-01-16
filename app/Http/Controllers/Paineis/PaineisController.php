<?php

namespace App\Http\Controllers\Paineis;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Paineis\Painel;
use Illuminate\Http\Request;
use App\Services\PainelService;


class PaineisController extends Controller
{

    public function index() {

        // $paineis = Painel::with('bairro.regiao')->get();

        $paineis = Painel::with('bairro.regiao')
            ->join('bairros', 'outdoors.bairro_id', '=', 'bairros.id')
            ->join('regioes', 'bairros.regiao_id', '=', 'regioes.id')
            ->orderBy('regioes.nome')
            ->orderBy('bairros.nome')
            ->select('outdoors.*')
        ->get();

        $service = new PainelService();
        foreach ($paineis as $p) {
            $p->image_url = $service->latestImagePath($p);
        }

        return Inertia::render('Paineis/ListaPaineis', compact('paineis'));

    }


    public function cadastraPainel(Request $request) {
        $painelService = new PainelService();


        $painelService->storeOrUpdatePainel($request);


    }

    public function editPainel(Request $request) {

        return Painel::where('id', $request->idPainel)->orderBy('identificacao')->get();

    }

    public function deletePainel(Request $request) {

        Painel::where('id', $request->idPainel)->delete();

    }

}
