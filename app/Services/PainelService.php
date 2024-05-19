<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Paineis\Painel;

class PainelService
{

    public function storeOrUpdatePainel(Request $request) {
        
        $filname = $request->dados['sTwo']['ident'].'.'.$request->dados['sTwo']['imagem']->extension();
        $path = 'outdoorImages/'.$request->dados['sTwo']['ident'];
        
        $request->dados['sTwo']['imagem']->storeAs('public/'.$path, $filname);


        if(!$request->dados['sTwo']['idPainel']) { 
            $messages = [
                'dados.sTwo.identificacao.unique' => 'Já existe um painel com essa Identificação!',
            ];
    
    
            $validator = Validator::make($request->all(), [ 
                'dados.sTwo.ident' => ['unique:outdoors,identificacao']
            ]);
    
            if ($validator->fails()) {
                return back()->with('error', $messages);
            }
        }


        
       $painel = Painel::updateorCreate(['identificacao' => $request->dados['sTwo']['ident']],
       [
            'identificacao' => $request->dados['sTwo']['ident'],
            'ident_antiga' => $request->dados['sTwo']['ident_ant'],
            'tipo' => $request->dados['sTwo']['tipo'],
            'bairro_id' => $request->dados['sOne']['bairro'],
            'logradouro' => $request->dados['sOne']['ender'],
            'numero' => $request->dados['sOne']['numero'],
            'cadan' => $request->dados['sTwo']['cadan'],
            'posicao' => $request->dados['sTwo']['posicao'],
            'dimensao' => $request->dados['sTwo']['dim'],
            'dimensao_lona' => $request->dados['sTwo']['dimLona'],
            'ponto_referencia' => $request->dados['sOne']['referencia'],
            'latitude' => $request->dados['sOne']['latitude'],
            'longitude' => $request->dados['sOne']['longitude'],
            'image_url' => $path.'/'.$filname

       ]);

       return back()->with('success', 'Painel Cadastrado com sucesso.');


    }

    
}
