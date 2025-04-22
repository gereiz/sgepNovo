<?php

namespace App\Services\Texto;

use App\Models\Clientes\Cliente;
use App\Models\Textos\TextoPadrao;
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
            // Verificar se já existe um tipo de texto com o mesmo nome
            $tipo_texto_existente = TipoTexto::where('nome', $request->nome)
                ->when($request->id, function($query) use ($request) {
                    // Excluir o registro atual da verificação em caso de edição
                    return $query->where('id', '!=', $request->id);
                })
                ->first();
            
            if ($tipo_texto_existente) {
                // Se já existe um tipo com o mesmo nome, atualiza o registro existente
                $tipo_texto = TipoTexto::updateOrCreate(
                    ['id' => $tipo_texto_existente->id],
                    [
                        'nome' => $request->nome,
                        'descricao' => $request->descricao,
                    ]
                );
            } else {
                // Se não existe, cria ou atualiza normalmente
                $tipo_texto = TipoTexto::updateOrCreate(
                    ['id' => $request->id], 
                    [
                        'nome' => $request->nome,
                        'descricao' => $request->descricao,
                    ]
                );
            }

            DB::commit();

            return $tipo_texto;
        } catch (\Throwable $e) {
            DB::rollBack();
            
            return $e;
        }
        
    }

    public function deleteTipoTexto(Request $request) {
        // Verificar se existem textos padrão associados a este tipo de texto
        $textos_associados = TextoPadrao::where('tipo', $request->id)->count();
        
        if ($textos_associados > 0) {
            return response()->json([
                'error' => true,
                'message' => 'Não é possível excluir este tipo de texto pois existem textos padrão associados a ele.'
            ], 422);
        }

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

    public function addOrEditTextoPadrao(Request $request) {
        DB::beginTransaction(); 

        try {
            // Verificar se já existe um texto padrão com o mesmo título
            $texto_existente = TextoPadrao::where('id', $request->id)->first();
            
            if ($texto_existente) {
                // dd($request->all());
                // Se já existe um texto com o mesmo título, atualiza o registro existente
                $texto = TextoPadrao::updateOrCreate(
                    ['id' => $texto_existente->id],
                    [
                        'title' => $request->titulo,
                        'content' => $request->conteudo,
                        'type' => $request->tipo_texto_id,
                        'active' => $request->ativo,
                    ]
                );
            } else {
                // Se não existe, cria ou atualiza normalmente
                $texto = TextoPadrao::updateOrCreate(
                    ['id' => $request->id],
                    [
                        'title' => $request->titulo,
                        'content' => $request->conteudo,
                        'type' => $request->tipo_texto_id,
                        'active' => $request->ativo,
                        'active' => $request->ativo ? 1 : 0,
                    ]
                );
            }
            DB::commit();

            return $texto;
        } catch (\Throwable $e) {
            DB::rollBack();

            return $e; 
        }
    }

    public function getTextoPadrao(Request $request) {
        $texto = TextoPadrao::find($request->id);

        return $texto; 
    }

    public function deleteTextoPadrao(Request $request) {
        DB::beginTransaction();
        
        try {
            $texto = TextoPadrao::find($request->id);
            $texto->delete();

            DB::commit();

            return $texto;
        } catch (\Throwable $e) {
            DB::rollBack();

            return $e; 
        }
    }

}