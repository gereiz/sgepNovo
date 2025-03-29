<?php

namespace App\Services\Texto;

use App\Models\Clientes\Cliente;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Models\Textos\TipoTexto;
use Illuminate\Support\Facades\DB;


class TextoService {

    public function getTipoTexto(Request $request) {
        // dd($request->all());
        $tipo_texto = TipoTexto::find($request->id);

        return $tipo_texto;
    }

    public function addOrEditTipoTexto(Request $request) {
        DB::beginTransaction();

        try {
           $tipo_texto = TipoTexto::updateOrCreate(
            ['id' => $request->id], 
            [
                'nome' => $request->nome,
                'descricao' => $request->descricao,
    
            ]);

            DB::commit();

            return $tipo_texto;
        } catch (\Throwable $e) {
            DB::rollBack();
            
            return $e;
        }
        
    }

    public function deleteTipoTexto(Request $request) {

        DB::beginTransaction();

        try {
            $tipo_texto = TipoTexto::find($request->id);
            $tipo_texto->delete();
            
            DB::commit();

            return $tipo_texto;
        } catch (\Throwable $e) {
            DB::rollBack();

            return $e;}
    }

}