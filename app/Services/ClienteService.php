<?php

namespace App\Services;

use App\Models\Clientes\Cliente;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;


class ClienteService
{
    
    public function storeOrUpdateCliente(Request $request) {
        if(count($request->form['sThree']) <= 3) {
            $validator = Validator::make($request->form['sOne'], [
                'cpf_cnpj' => 'unique:clientes,cpf_cnpj',
            ]);

            $messages = [
                'form.sOne.cpf_cnpj.unique' => 'o CPF / CNPJ já foi cadastrado anteriormente',
            ];
    
    
            if ($validator->fails()) {
                return back()->with('error', $messages);
            }
        }

        $tel_responsavel = str_replace(['(', ')', ' ', '-'], '', $request->form['sThree']['tel_resp']);


        $cliente = Cliente::updateOrCreate(['cpf_cnpj' => $request->form['sOne']['cpf_cnpj']],
        [
            'razao_social' => $request->form['sOne']['r_social'],
            'nome_fantasia' => $request->form['sOne']['n_fantasia'],
            'cpf_cnpj' => $request->form['sOne']['cpf_cnpj'],
            'nro_insc' => $request->form['sOne']['insc_est'],

            'endereco' => $request->form['sTwo']['ender'],
            'num' => $request->form['sTwo']['numero'],
            'bairro' => $request->form['sTwo']['bairro'],
            'cidade' => $request->form['sTwo']['cidade'],
            'uf' => $request->form['sTwo']['uf'],
            'cep' => $request->form['sTwo']['cep'],

            'responsavel' => $request->form['sThree']['responsavel'],
            'tel_responsavel' => $tel_responsavel,
            'email_responsavel' => $request->form['sThree']['email_resp'],
            'email' => $request->form['sThree']['email_resp'],
            'telefone' => $tel_responsavel,
            'celular' => $tel_responsavel,
            'tipo' => 1,
            'ativo' => 1 // isset($request->form['sOne']ativo)? 1 : 0;
        ]);


        return back()->with('success', 'Cliente cadastrado com sucesso!');

    }


}