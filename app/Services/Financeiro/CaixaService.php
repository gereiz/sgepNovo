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
        return Lancamento::with('tipoLancamento', 'centroCusto')
            ->orderByDesc('id')
            ->limit(20)
            ->get();
    }

    public function getLancamento($id)
    {
        return Lancamento::find($id);
    }

    public function getLancamentosReserva($id_reserva)
    {
        return Lancamento::where('id_reserva', $id_reserva)->first();
    }

    public function syncLancamentosPiOsFaltantes()
    {
        try {
            // 1. Sincronizar PIs que não possuem lançamentos registrados
            $pis = DB::table('pi')->where('id', '>=', 24)->orderBy('id')->get();
            foreach ($pis as $pi) {
                $existe = Lancamento::where('id_reserva', $pi->id)
                    ->where('descricao', 'LIKE', 'PI nº ' . $pi->id . '%')
                    ->exists();
                if (!$existe) {
                    $cliente = DB::table('clientes')->where('id', $pi->id_cliente)->first();
                    $nomeCliente = $cliente ? ($cliente->razao_social ?: ($cliente->nome_fantasia ?: 'Cliente #' . $pi->id_cliente)) : 'Cliente #' . $pi->id_cliente;
                    $dtFaturamento = !empty($pi->dt_pgto) && $pi->dt_pgto !== '0000-00-00'
                        ? date('Y-m-d', strtotime($pi->dt_pgto))
                        : (!empty($pi->created_at) ? date('Y-m-d', strtotime($pi->created_at)) : date('Y-m-d'));
                    $pago = (int)($pi->pago ?? 0);

                    Lancamento::create([
                        'descricao' => 'PI nº ' . $pi->id . ' Cliente: ' . $nomeCliente,
                        'valor' => (float)($pi->vl_total ?? 0),
                        'parcelas' => '1/1',
                        'dt_faturamento' => $dtFaturamento,
                        'centro_custo' => 1,
                        'tipo_lancamento' => 1,
                        'id_reserva' => (int)$pi->id,
                        'observacoes' => strip_tags((string)($pi->obs ?? '')),
                        'status_pagamento' => ($pago === 1 ? 'QUITADO' : 'PENDENTE'),
                        'dt_pagamento_real' => ($pago === 1 ? $dtFaturamento : null),
                    ]);
                }
            }

            // 2. Sincronizar OSs que não possuem lançamentos registrados
            $oss = DB::table('os')->where('id', '>=', 1)->orderBy('id')->get();
            foreach ($oss as $os) {
                $existe = Lancamento::where('id_reserva', $os->id)
                    ->where('descricao', 'LIKE', 'OS nº ' . $os->id . '%')
                    ->exists();
                if (!$existe) {
                    $cliente = DB::table('clientes')->where('id', $os->id_cliente)->first();
                    $nomeCliente = $cliente ? ($cliente->razao_social ?: ($cliente->nome_fantasia ?: 'Cliente #' . $os->id_cliente)) : 'Cliente #' . $os->id_cliente;
                    $dtFaturamento = !empty($os->dt_pgto) && $os->dt_pgto !== '0000-00-00'
                        ? date('Y-m-d', strtotime($os->dt_pgto))
                        : (!empty($os->created_at) ? date('Y-m-d', strtotime($os->created_at)) : date('Y-m-d'));
                    $pago = (int)($os->pago ?? 0);

                    Lancamento::create([
                        'descricao' => 'OS nº ' . $os->id . ' Cliente: ' . $nomeCliente,
                        'valor' => (float)($os->vl_total ?? 0),
                        'parcelas' => '1/1',
                        'dt_faturamento' => $dtFaturamento,
                        'centro_custo' => 1,
                        'tipo_lancamento' => 1,
                        'id_reserva' => (int)$os->id,
                        'observacoes' => strip_tags((string)($os->obs ?? '')),
                        'status_pagamento' => ($pago === 1 ? 'QUITADO' : 'PENDENTE'),
                        'dt_pagamento_real' => ($pago === 1 ? $dtFaturamento : null),
                    ]);
                }
            }
        } catch (\Throwable $e) {
            \Log::warning('Erro em syncLancamentosPiOsFaltantes: ' . $e->getMessage());
        }
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

        if (is_numeric($lancamento['valor'])) {
            $lancamento['valor'] = floatval($lancamento['valor']);
        } else {
            $valStr = str_replace(['R$', ' '], '', (string)$lancamento['valor']);
            if (strpos($valStr, ',') !== false) {
                $valStr = str_replace('.', '', $valStr);
                $valStr = str_replace(',', '.', $valStr);
            }
            $lancamento['valor'] = floatval($valStr);
        }
        if ($lancamento['valor'] <= 0) {
            return response()->json(['message' => ['valor' => ['Valor do lançamento inválido']]], 400);
        }

        // Transforma a data para o formato do banco de dados
        $dtLanc = !empty($lancamento['data_lancamento']) ? date('Y-m-d', strtotime($lancamento['data_lancamento'])) : date('Y-m-d');
        $statusPgto = !empty($lancamento['status_pagamento']) ? $lancamento['status_pagamento'] : 'PENDENTE';
        $dtPagamentoReal = ($statusPgto === 'QUITADO')
            ? (!empty($lancamento['dt_pagamento_real']) ? date('Y-m-d', strtotime($lancamento['dt_pagamento_real'])) : $dtLanc)
            : null;

        $created = Lancamento::create(
            [
            'descricao' => $lancamento['descricao'],
            'valor' => $lancamento['valor'],
            'parcelas' => (string)$lancamento['parcelas'],
            'dt_faturamento' => $dtLanc,
            'centro_custo' => $lancamento['centro_custo'],
            'tipo_lancamento' => $lancamento['tipo_lancamento'],
            'id_reserva' => $lancamento['id_reserva'] ?? null,
            'observacoes' => $lancamento['observacoes'] ?? null,
            'status_pagamento' => $statusPgto,
            'dt_pagamento_real' => $dtPagamentoReal,
        ]);

        $lancamento = Lancamento::with('tipoLancamento', 'centroCusto')->find($created->id);

        return response()->json($lancamento, 200);
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
            if (isset($dados_lancamento['status_pagamento'])) {
                $lancamento->status_pagamento = $dados_lancamento['status_pagamento'];
            }

            // Salva as alterações
            $lancamento->save();
        });


    }

    public function toggleLancamentoStatus(Request $request)
    {
        $id = $request->id;
        $l = Lancamento::find($id);
        if (!$l) {
            return response()->json(['msg' => 'Lançamento não encontrado'], 404);
        }

        $saindoDe = $l->status_pagamento ?? 'PENDENTE';
        $entrandoEm = ($saindoDe === 'QUITADO') ? 'PENDENTE' : 'QUITADO';

        if ($entrandoEm === 'QUITADO') {
            $dtReal = trim((string)($request->dt_pagamento_real ?? ''));
            if ($dtReal === '') {
                $dtReal = now()->toDateString();
            }
            $validator = Validator::make(['dt_pagamento_real' => $dtReal], [
                'dt_pagamento_real' => 'required|date',
            ]);
            if ($validator->fails()) {
                return response()->json(['msg' => 'Data Real de Pagamento inválida', 'errors' => $validator->errors()], 400);
            }
            try {
                $dtRealFormatted = date('Y-m-d', strtotime($dtReal));
            } catch (\Throwable $e) {
                return response()->json(['msg' => 'Data Real de Pagamento inválida'], 400);
            }
            $l->dt_pagamento_real = $dtRealFormatted;
        } else {
            $l->dt_pagamento_real = null;
        }

        $l->status_pagamento = $entrandoEm;
        $l->save();

        if ($l->id_reserva && $l->id_reserva > 0) {
            $desc = (string)($l->descricao ?? '');
            if (strpos($desc, 'PI nº') !== false) {
                $todosQuitados = Lancamento::where('id_reserva', $l->id_reserva)
                    ->where('descricao', 'LIKE', 'PI nº ' . $l->id_reserva . '%')
                    ->where('status_pagamento', '!=', 'QUITADO')
                    ->count() === 0;
                DB::table('pi')->where('id', $l->id_reserva)->update(['pago' => $todosQuitados ? 1 : 0]);
            } elseif (strpos($desc, 'OS nº') !== false) {
                $todosQuitados = Lancamento::where('id_reserva', $l->id_reserva)
                    ->where('descricao', 'LIKE', 'OS nº ' . $l->id_reserva . '%')
                    ->where('status_pagamento', '!=', 'QUITADO')
                    ->count() === 0;
                DB::table('os')->where('id', $l->id_reserva)->update(['pago' => $todosQuitados ? 1 : 0]);
            }
        }

        return response()->json(['ok' => true, 'status' => $l->status_pagamento, 'dt_pagamento_real' => $l->dt_pagamento_real]);
    }

    public function deleteLancamento(Request $request)
    {
        $id = $request['lancamento']['id'];
        $lancamento = Lancamento::find($id);
        if (!$lancamento) {
            return response()->json(['message' => 'Lançamento não encontrado.'], 404);
        }

        $desc = $lancamento->descricao ?? '';
        $isOs = (strpos($desc, 'OS nº') !== false);

        if ($isOs) {
            $osId = null;
            if ($lancamento->id_reserva && $lancamento->id_reserva > 0) {
                $osId = (int)$lancamento->id_reserva;
            } else {
                if (preg_match('/OS nº\s*(\d+)/', $desc, $m)) {
                    $osId = (int)$m[1];
                }
            }

            if ($osId) {
                Lancamento::where('id_reserva', $osId)
                    ->orWhere('descricao', 'LIKE', 'OS nº '.$osId.'%')
                    ->delete();
                return response()->json(['message' => 'Todos os lançamentos da OS nº '.$osId.' foram excluídos.'], 200);
            }
        }

        $lancamento->delete();
        return response()->json(['message' => 'Lançamento excluído com sucesso!'], 200);
    }


}
