<?php

namespace App\Http\Controllers\Data;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\UF;
use Illuminate\Support\Facades\DB;

use App\Services\DataService;
use App\Models\Financeiro\ComissaoCadastro;
use App\Models\User;
use App\Models\Clientes\Cliente;

class DataController extends Controller
{
    private $dataService;

    public function __construct(DataService $dataService) {
        $this->middleware('auth');
        $dataService = new DataService();
        $this->dataService = $dataService;
    }

    public function getBisemanas(Request $request) {
        
        return $this->dataService->getBisemanas($request->anoId);
    }

    public function getBisemana(Request $request) {


        return $this->dataService->getBisemana($request->idBs);

    }

    public function getBairros(Request $request) {

        $bairros = DB::table('bairros as bai')
                    ->select('bai.id', 'bai.nome')
                    ->join('regioes as reg', 'bai.regiao_id', 'reg.id')
                    ->where('reg.cidade_id', $request->cidade)
                    ->orderBy('nome')
                    ->get();
        return $bairros;

    }

    public function getCidade(Request $request)  {
        $cidade = Cidade::find($request->cidade_id)->first();

        return $cidade;
        
    }

    public function getCidades(Request $request)  {
        $cidades = Cidade::with('uf')
        ->where('uf_id', $request->uf)
        ->orderBy('nome')
        ->get();

        return $cidades;
        
    }

    public function getUf(Request $request)  {
        $uf = UF::where('id', $request->uf_id)->first();

        return $uf;
    }

    public function getUfs()  {
        $uf = UF::orderBy('nome')->get();

        return $uf;
    }

    public function getUfCli(Request $request) {
        $uf = UF::where('id', $request->uf)->first();

        return $uf;
    }

    public function listarComissoesAtivas()
    {
        $comissoes = ComissaoCadastro::where('status', 1)
            ->whereNull('deleted_at')
            ->orderBy('nome')
            ->get();

        $result = $comissoes->map(function ($c) {
            $valorNumerico = (float) $c->valor;
            if ((int) $c->tipo_comissao === 1) {
                $valorApresentavel = '% ' . number_format($valorNumerico, 2, ',', '.');
            } else {
                $valorApresentavel = 'R$ ' . number_format($valorNumerico, 2, ',', '.');
            }
            return [
                'id' => (int) $c->id,
                'nome' => $c->nome,
                'tipo_comissao' => (int) $c->tipo_comissao,
                'valor_numerico' => $valorNumerico,
                'valor_apresentavel' => $valorApresentavel,
                'aplicavel_a' => $c->aplicavel_a,
                'descricao' => $c->descricao,
            ];
        });

        return response()->json($result);
    }

    public function listarParticipantesComissao()
    {
        $users = User::where('active', 1)
            ->select('id as pessoa_id', 'name as nome')
            ->orderBy('name')
            ->get()
            ->map(function ($u) {
                return [
                    'pessoa_tipo' => 'user',
                    'pessoa_id' => (int) $u->pessoa_id,
                    'nome' => $u->nome,
                    'badge_label' => 'Vendedor',
                ];
            });

        $clientes = Cliente::where('agent', 1)
            ->selectRaw("id as pessoa_id, COALESCE(NULLIF(nome_fantasia,''), NULLIF(razao_social,'')) as nome")
            ->orderByRaw("COALESCE(NULLIF(nome_fantasia,''), NULLIF(razao_social,''))")
            ->get()
            ->map(function ($c) {
                return [
                    'pessoa_tipo' => 'cliente',
                    'pessoa_id' => (int) $c->pessoa_id,
                    'nome' => is_string($c->nome) && trim($c->nome) !== '' ? $c->nome : ('Agente #' . $c->pessoa_id),
                    'badge_label' => 'Agente',
                ];
            });

        $merged = array_merge($users->toArray(), $clientes->toArray());
        usort($merged, function ($a, $b) {
            return strcasecmp($a['nome'], $b['nome']);
        });

        return response()->json($merged);
    }

}
