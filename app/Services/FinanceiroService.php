<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Financeiro\Servico;
use App\Models\Financeiro\Funcao;
use App\Models\Financeiro\Comissao;
use App\Models\User;


class FinanceiroService
{
    protected $servico;
    protected $funcao;


    // Serviços
    public function listaServicos() {
        
        $servicos = Servico::with('comissoes')->OrderBy('nome', 'asc')->get();

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

        // Deleta todas as comissões relacionadas ao serviço
        $comissoes = Comissao::where('id_servico', $id)->delete();  

        return $servico;
    }

    public function getServico($id)
    {
        $servico = Servico::find($id);

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

        // Altera a função de todos os usuários relacionados para 'Sem função'
        $usuarios = User::where('function', $id)->update(['function' => 1]);
        

        return $funcao;
    }

    // Comissões
    public function listaComissoes()
    {
        $comissoes = Comissao::with('servico')->OrderBy('id_funcionario', 'asc')->get();

        return $comissoes;
    }

    // Comissões por serviço
    public function gravaComissaoservico(Request $request)
    {
        $comissao = Servico::updateOrCreate(
            ['id' => $request['id_servico']],
            [
                'comissao' => number_format(floatval($request->valor_comissao = str_replace(',', '.', $request->valor_comissao)), 2, '.', ''),
                'tipo_comissao' => $request->tipo_comissao,
                'id_user' => auth()->user()->id
            ]
        );

        return $comissao;
    }

    public function delComissaoServico($id)
    {
        $comissao = Servico::updateOrCreate(
            ['id' => $id],
            [
                'comissao' => 0.00,
                'tipo_comissao' => 0,
                'id_user' => auth()->user()->id
            ]
        );

        return $comissao;
    }


    // Comissões por usuário
    public function cadastraComissaoUsuario(Request $request)
    {
        $comissao = Comissao::updateOrCreate(
            ['id_servico' => $request->id_servico, 'id_funcionario' => $request->id_funcionario],
            [
                'id_funcionario' => $request->id_funcionario,
                'id_servico' => $request->id_servico,   
                'valor' => number_format(floatval($request->valor_comissao = str_replace(',', '.', $request->valor_comissao)), 2, '.', ''),
                'tipo_comissao' => $request->tipo_comissao,
                'id_user' => auth()->user()->id
            ]
        );

        return $comissao;
    }   

    public function deletaComissaoUsuario($id)
    {
        $comissao = Comissao::find($id);
        $comissao->delete();

        return $comissao;
    }

}