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

        $paineis = Painel::with('bairro.regiao')->get();
 
        return Inertia::render('Paineis/ListaPaineis', compact('paineis'));

    }


    public function cadastraPainel(Request $request) {
        
        $painelService = new PainelService();

        // dd($request->all());

        $painelService->storeOrUpdatePainel($request);
    

    }

    public function editPainel(Request $request) {

        return Painel::where('id', $request->idPainel)->orderBy('identificacao')->get();

    }

}
