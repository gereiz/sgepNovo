<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Config\Ano;


class ConfiguracoesController extends Controller
{
    public function index() {

        $anos = Ano::all();

        return Inertia::render('Config/Configuracoes', compact('anos'));
    }


    public function storeYear(Request $request) {


        Ano::create(['ano_bisemana' => $request->ano]);

        return 'Ano '. $request->ano.' Gravado.';
    }



}


