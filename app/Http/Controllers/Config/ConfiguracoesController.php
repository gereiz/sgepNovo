<?php

namespace App\Http\Controllers\Config;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Config\Ano;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;


class ConfiguracoesController extends Controller
{
    public function index() {

        $anos = Ano::all();

        return Inertia::render('Config/Configuracoes', compact('anos'));
    }


    public function AddAno(Request $request) {

        
        DB::select("CALL InsereBisemanas($request->ano)");
       

        return 'Ano '. $request->ano.' Gravado.';
    }

    public function atualizarImagens(Request $request) {
        $code = Artisan::call('painel:refresh-compressed');
        $output = Artisan::output();
        return $output ?: 'Atualização concluída';
    }


}


