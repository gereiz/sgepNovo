<?php

namespace App\Services\Financeiro;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Financeiro\CentroCusto;
use App\Models\Financeiro\TipoLancamento;
use App\Models\Financeiro\Lancamento;
use Illuminate\Support\Facades\DB;


class CaixaService
{

    // Centros de custo

    public function getCentrosCusto()
    {
        return CentroCusto::all();
    }

    public function getCentroCusto($id)
    {
        return CentroCusto::find($id);
    }

    public function createCentroCusto(Request $request)
    {
        $centro_custo = $request->nome;
        $validator = Validator::make($request->all(), [
            'nome' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        $centroCusto = new CentroCusto();
        $centroCusto->centro_custo = $centro_custo;

        $centroCusto->save();

        return response()->json($centroCusto, 201);
    }

    public function updateCentroCusto(Request $request)
    {
        $id = $request->id;
        $centro_custo = $request->centro_custo;


        $centroCusto = CentroCusto::find($id);
        $centroCusto->centro_custo = $centro_custo;

        $centroCusto->save();

        return response()->json($centroCusto, 200);
    }

    public function deleteCentroCusto(Request $request)
    {
        // verifica se o centro de custo está sendo utilizado em algum lançamento
        $id = $request['centroCusto']['id'];
        $lancamento = Lancamento::where('centro_custo', $id)->first();

        if ($lancamento) {
            return response()->json(['message' => 'Existem lançamentos utilizando este Centro de Custo.'], 400);
        }

        $centroCusto = CentroCusto::find($id);
        $centroCusto->delete();

        return response()->json(null, 204);
    }

    // Tipos de lançamentos
    public function getTiposLancamentos()
    {
        return TipoLancamento::all();
    }

    public function getTipoLancamento($id)
    {
        return TipoLancamento::find($id);
    }

    public function createTipoLancamento(Request $request)
    {
        $tipo_lancamento = $request->nome_tipo;
        $validator = Validator::make($request->all(), [
            'nome_tipo' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        $tipoLancamento = new TipoLancamento();
        $tipoLancamento->tipo = $tipo_lancamento;

        $tipoLancamento->save();

        return response()->json($tipoLancamento, 201);
    }

    public function updateTipoLancamento(Request $request)
    {
        $id = $request->id;
        $nome_tipo = $request->nome_tipo;


        $tipoLancamento = TipoLancamento::find($id);
        $tipoLancamento->tipo = $nome_tipo;

        $tipoLancamento->save();
    }

    public function deleteTipoLancamento(Request $request)
    {
        // verifica se o tipo de lançamento está sendo utilizado em algum lançamento
        $id = $request['tipoLancamento']['id'];
        $lancamento = Lancamento::where('tipo_lancamento', $id)->first();

        if ($lancamento) {
            return response()->json(['message' => 'Existem lançamentos utilizando este Tipo de Lançamento.'], 400);
        }


        $tipoLancamento = TipoLancamento::find($id);
        $tipoLancamento->delete();

        return response()->json(null, 204);
    }


    // Lançamentos
    public function getLancamentos()
    {
        return Lancamento::with('tipoLancamento', 'centroCusto')->get();
    }

    public function getLancamento($id)
    {
        return Lancamento::find($id);
    }

    public function getLancamentosReserva($id_reserva)
    {
        return Lancamento::where('id_reserva', $id_reserva)->first();
    }

    public function createLancamento(Request $request)
    {

        $lancamento = $request->all();
        $validator = Validator::make($request->all(), [
            'descricao' => 'required',
            'centro_custo' => 'required',
            'tipo_lancamento' => 'required',
            'valor' => 'required',
            'parcelas' => 'required',
            'data_lancamento' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        //Remove o R$, troca virgula por ponto e transforma o valor para float
        $lancamento['valor'] = str_replace('R$ ', '', $lancamento['valor']);
        $lancamento['valor'] = str_replace(',', '.', $lancamento['valor']);
        $lancamento['valor'] = floatval($lancamento['valor']);

        //Transforma a data para o formato do banco de dados
        $lancamento['data_lancamento'] = date('Y-m-d', strtotime($lancamento['data_lancamento']));

        if($lancamento['id_reserva'] == null) {
            $lancamento = Lancamento::updateOrCreate([
                'descricao' => $lancamento['descricao'],
                'valor' => $lancamento['valor'],
                'parcelas' => $lancamento['parcelas'],
                'dt_faturamento' => $lancamento['data_lancamento'],
                'centro_custo' => $lancamento['centro_custo'],
                'tipo_lancamento' => $lancamento['tipo_lancamento'],
                'id_reserva' => $lancamento['id_reserva'],
                'observacoes' => $lancamento['observacoes'],
            ]);
        }

        $lancamento = Lancamento::create([
            'descricao' => $lancamento['descricao'],
            'valor' => $lancamento['valor'],
            'parcelas' => $lancamento['parcelas'],
            'dt_faturamento' => $lancamento['data_lancamento'],
            'centro_custo' => $lancamento['centro_custo'],
            'tipo_lancamento' => $lancamento['tipo_lancamento'],
            'id_reserva' => $lancamento['id_reserva'],
            'observacoes' => $lancamento['observacoes'],
        ]);

        $lancamento = Lancamento::with('tipoLancamento', 'centroCusto')->find($lancamento->id);

        return response()->json($lancamento, 201);
    }

    public function updateLancamento(Request $request)
    {
        $id = $request->id;
        $dados_lancamento = $request['lancamento'];

        // dd($dados_lancamento);

        DB::transaction(function () use ($id, $dados_lancamento) {
            // Busca o lançamento
            $lancamento = Lancamento::find($id);

            //Remove o R$, troca virgula por ponto e transforma o valor para float
            $lancamento['valor'] = str_replace('R$ ', '', $lancamento['valor']);
            $lancamento['valor'] = str_replace(',', '.', $lancamento['valor']);
            $lancamento['valor'] = floatval($lancamento['valor']);

            //Transforma a data para o formato do banco de dados
            // $lancamento['data_lancamento'] = date('Y-m-d', strtotime($lancamento['data_lancamento']));

            // Verifica se o lançamento foi encontrado
            if (!$lancamento) {
                throw new \Exception('Lançamento não encontrado.');
            }

            // Atualiza os campos do lançamento
            $lancamento->descricao = $dados_lancamento['descricao'];
            $lancamento->valor = $dados_lancamento['valor'];
            $lancamento->parcelas = $dados_lancamento['parcelas'];
            $lancamento->dt_faturamento = $dados_lancamento['dt_faturamento'];
            $lancamento->centro_custo = $dados_lancamento['centro_custo']['id'];
            $lancamento->tipo_lancamento = $dados_lancamento['tipo_lancamento']['id'];
            $lancamento->id_reserva = $dados_lancamento['id_reserva'];
            $lancamento->observacoes = $dados_lancamento['observacoes'];

            // Salva as alterações
            $lancamento->save();
        });


    }

    public function deleteLancamento(Request $request)
    {
        $id = $request['lancamento']['id'];
        $lancamento = Lancamento::find($id);
        $lancamento->delete();

        return response()->json(null, 204);
    }


}
