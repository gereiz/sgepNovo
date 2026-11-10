<?php

namespace App\Http\Controllers\Paineis;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Paineis\Painel;
use App\Models\Enderecos\UF;
use Illuminate\Http\Request;
use App\Services\PainelService;


class PaineisController extends Controller
{

    public function index(Request $request) {

        // Versão React acessível via rota react.paineis.lista ou ?view=react
        if ($request->query('view') === 'react' || $request->routeIs('react.paineis.lista')) {
            $paineis = Painel::with(['bairro.regiao.cidade.uf'])
                ->join('bairros', 'outdoors.bairro_id', '=', 'bairros.id')
                ->join('regioes', 'bairros.regiao_id', '=', 'regioes.id')
                ->orderBy('regioes.nome')
                ->orderBy('bairros.nome')
                ->select('outdoors.*')
                ->get();

            $service = new PainelService();
            foreach ($paineis as $p) {
                $p->image_url = $service->latestImagePath($p);
            }

            $ufs = UF::orderBy('nome')->get(['id', 'nome', 'sigla']);

            return Inertia::render('React/Paineis/Lista/Index', [
                'paineis' => $paineis,
                'ufs' => $ufs,
            ])->rootView('app-react');
        }

        // Padrão: Versão clássica Vue
        $paineis = Painel::with('bairro.regiao')
            ->join('bairros', 'outdoors.bairro_id', '=', 'bairros.id')
            ->join('regioes', 'bairros.regiao_id', '=', 'regioes.id')
            ->orderBy('regioes.nome')
            ->orderBy('bairros.nome')
            ->select('outdoors.*')
        ->get();

        $service = new PainelService();
        foreach ($paineis as $p) {
            $p->image_url = $service->latestImagePath($p);
        }

        return Inertia::render('Paineis/ListaPaineis', compact('paineis'));

    }


    public function cadastraPainel(Request $request) {
        $painelService = new PainelService();
        $painel = $painelService->storeOrUpdatePainel($request);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Painel salvo com sucesso!',
                'painel' => $painel,
            ]);
        }

        return back()->with('success', 'Painel salvo com sucesso.');
    }

    public function editPainel(Request $request) {
        $id = $request->idPainel ?: $request->id;
        $painel = Painel::with(['bairro.regiao.cidade.uf'])->where('id', $id)->first();
        
        return $painel ? [$painel] : [];
    }

    public function deletePainel(Request $request) {
        $id = $request->idPainel ?: $request->id;
        Painel::where('id', $id)->delete();

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Painel excluído com sucesso!',
            ]);
        }

        return back()->with('success', 'Painel excluído com sucesso.');
    }

}
