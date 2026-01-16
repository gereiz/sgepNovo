<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Paineis\Painel;

class PainelService
{

    public function storeOrUpdatePainel(Request $request) {

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

       ]);

       $path = 'outdoorImages/'.$painel->identificacao;
       $filname = $painel->identificacao.'.'.$request->dados['sTwo']['imagem']->extension();
       $request->dados['sTwo']['imagem']->storeAs('public/'.$path, $filname);

         $painel->image_url = $path.'/'.$filname;
        $painel->save();

       return back()->with('success', 'Painel Cadastrado com sucesso.');


    }

    public function latestImagePath(Painel $painel): string
    {
        $dir = 'outdoorImages/'.$painel->identificacao;
        $files = Storage::disk('public')->files($dir);
        if (empty($files)) {
            return $painel->image_url ?? '';
        }
        usort($files, function ($a, $b) {
            return Storage::disk('public')->lastModified($b) <=> Storage::disk('public')->lastModified($a);
        });
        $keep = array_slice($files, 0, 2);
        $toDelete = array_slice($files, 2);
        if (!empty($toDelete)) {
            Storage::disk('public')->delete($toDelete);
        }
        return $keep[0] ?? $painel->image_url ?? '';
    }


}
