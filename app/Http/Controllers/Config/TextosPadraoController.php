<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use App\Models\Textos\TipoTexto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Texto\TextoService;
use App\Models\Textos\TextoPadrao;



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

    public function textoPadrao() {
        $tipo_texto = TipoTexto::all();
        $texto_padrao = TextoPadrao::all();

        return Inertia::render('Config/Textos/AddTextoPadrao', compact('tipo_texto', 'texto_padrao'));
    }

    public function addOrEditTextoPadrao(Request $request) {
        
        $texto = $this->textoService->addOrEditTextoPadrao($request);
        
        return $texto;

    }

    public function getTextoPadrao(Request $request) {
        $texto = $this->textoService->getTextoPadrao($request);
        return $texto;
    }

    public function deleteTextoPadrao(Request $request) {
        $texto = $this->textoService->deleteTextoPadrao($request);
        return $texto;
    }

}
