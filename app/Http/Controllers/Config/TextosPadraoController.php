<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Models\Textos\TipoTexto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Texto\TextoService;

class TextosPadraoController extends Controller
{
    private $textoService;

    public function __construct(TextoService $textoService) {
       
        $this->textoService = $textoService;
    }

    public function index() {
        
        return Inertia::render('Config/Textos/TextosPadrao');
    }

    public function tipoTexto() {
        $tipo_texto = TipoTexto::all();

        return Inertia::render('Config/Textos/TipoTexto', compact('tipo_texto'));
    }

    public function getTipoTexto(Request $request) {
        $tipo_texto = $this->textoService->getTipoTexto($request);

        return $tipo_texto;
    }

    public function addOrEditTipoTexto(Request $request) {
     
        $tipo_texto = $this->textoService->addOrEditTipoTexto($request);

        return $tipo_texto;
        
    }

    public function deleteTipoTexto(Request $request) {
        $tipo_texto = $this->textoService->deleteTipoTexto($request);
        return $tipo_texto;
    }

}
