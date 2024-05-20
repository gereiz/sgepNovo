<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Financeiro\Servico;
use App\Models\Financeiro\Funcao;

class FinanceiroService
{
    // Serviços
    public function listaServicos() {
        
        $servicos = Servico::OrderBy('nome', 'asc')->get();

        return $servicos;
    }

    public function cadastraServico(Request $request)
    {   
        // Validação dos dados
        $request->validate([
            'nome_servico' => 'required',
            'valor_servico' => 'required',
            'desc_servico' => 'required',
        ], [
            'nome_servico.required' => 'O campo nome é obrigatório',
            'nome_servico.unique' => 'Já existe um serviço com esse nome',
            'valor_servico.required' => 'O campo valor é obrigatório',
            'desc_servico.required' => 'O campo descrição é obrigatório',
        ]); 

        $servico = Servico::updateOrCreate(
            ['id' => $request->id_servico],
            [
                'nome' => $request->nome_servico,
                'valor' => number_format(floatval($request->valor_servico = str_replace(',', '.', $request->valor_servico)), 2, '.', ''),
                'descricao' => $request->desc_servico,
                'id_user' => auth()->user()->id
            ]
        );


        return $servico;
    }

    public function deletaServico($id)
    {
        $servico = Servico::find($id);
        $servico->delete();

        return $servico;
    }


    // Funções
    public function listaFuncoes()
    {
        $funcoes = Funcao::OrderBy('cargo', 'asc')->get();

        return $funcoes;
    }

    public function cadastraFuncao(Request $request)
    {   
        // Validação dos dados
        $request->validate([
            'cargo_funcao' => 'required',
            'desc_funcao' => 'required',
        ], [
            'cargo_funcao.required' => 'O campo cargo é obrigatório',
            'desc_funcao.required' => 'O campo descrição é obrigatório',
        ]); 

        $funcao = Funcao::updateOrCreate(
            ['id' => $request->id_funcao],
            [
                'cargo' => $request->cargo_funcao,
                'descricao' => $request->desc_funcao,
                'id_user' => auth()->user()->id
            ]
        );
    }

    public function deletaFuncao($id)
    {
        if($id == 1) {
            return response()->json(['error' => 'Não é possível deletar essa função'], 400);
        } else {
            $funcao = Funcao::find($id);
            $funcao->delete();
        }
        

        return $funcao;
    }


}