<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Financeiro\ComissaoCadastro;
use Illuminate\Support\Facades\Validator;

class ReactComissoesController extends Controller
{
    public function index(Request $request)
    {
        $search = trim((string)($request->query('search') ?? ''));
        $tipo = (string)($request->query('tipo') ?? 'todos');
        $status = (string)($request->query('status') ?? 'todos');
        $page = max(1, (int)($request->query('page') ?? 1));
        $perPage = max(1, min(500, (int)($request->query('perPage') ?? 50)));

        $q = ComissaoCadastro::query();

        if ($search !== '') {
            $s = '%' . $search . '%';
            $q->where(function ($q2) use ($s) {
                $q2->where('nome', 'LIKE', $s)
                   ->orWhere('descricao', 'LIKE', $s)
                   ->orWhere('aplicavel_a', 'LIKE', $s);
            });
        }

        if ($tipo === 'percentual') {
            $q->where('tipo_comissao', 1);
        } elseif ($tipo === 'fixo') {
            $q->where('tipo_comissao', 2);
        }

        if ($status === 'ativos') {
            $q->where('status', 1);
        } elseif ($status === 'inativos') {
            $q->where('status', 0);
        }

        $totalItens = (int)(clone $q)->count();
        $ultimaPagina = max(1, (int)ceil($totalItens / $perPage));
        if ($page > $ultimaPagina) $page = $ultimaPagina;

        $comissoes = $q->orderBy('id', 'DESC')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get()
            ->map(function ($c) {
                return [
                    'id'              => (int)$c->id,
                    'nome'            => $c->nome,
                    'descricao'       => (string)($c->descricao ?? ''),
                    'tipo_comissao'   => (int)$c->tipo_comissao,
                    'calculationType' => (int)$c->tipo_comissao === 1 ? 'percentage' : 'fixed',
                    'valor'           => (float)$c->valor,
                    'aplicavel_a'     => (string)($c->aplicavel_a ?? ''),
                    'status_num'      => (int)$c->status,
                    'status'          => (int)$c->status === 1 ? 'Ativo' : 'Inativo',
                    'updatedAt'       => optional($c->updated_at)->format('d/m/Y') ?? '',
                    'createdAt'       => optional($c->created_at)->format('d/m/Y') ?? '',
                ];
            })
            ->values()
            ->toArray();

        $agregados = [
            'totalCadastros' => $totalItens,
            'totalAtivos'    => (int)ComissaoCadastro::where('status', 1)->count(),
            'totalInativos'  => (int)ComissaoCadastro::where('status', 0)->count(),
            'totalPercentuais' => (int)ComissaoCadastro::where('tipo_comissao', 1)->count(),
            'totalFixos'       => (int)ComissaoCadastro::where('tipo_comissao', 2)->count(),
        ];

        return Inertia::render('React/Financeiro/Comissoes/Index')
            ->rootView('app-react')
            ->with([
                'comissoes'       => $comissoes,
                'pagination'      => [
                    'page'           => $page,
                    'perPage'        => $perPage,
                    'totalItens'     => $totalItens,
                    'ultimaPagina'   => $ultimaPagina,
                    'de'             => $totalItens > 0 ? (($page - 1) * $perPage) + 1 : 0,
                    'ate'            => min($page * $perPage, $totalItens),
                ],
                'filters'         => [
                    'search' => $search,
                    'tipo'   => $tipo,
                    'status' => $status,
                ],
                'agregados'       => $agregados,
                'flash'           => [
                    'success' => session('success'),
                    'error'   => session('error'),
                ],
            ]);
    }

    public function store(Request $request)
    {
        $data = $this->validarPayload($request, false);

        $comissao = ComissaoCadastro::create([
            'nome'          => $data['nome'],
            'descricao'     => $data['descricao'],
            'tipo_comissao' => $data['tipo_comissao'],
            'valor'         => $data['valor'],
            'aplicavel_a'   => $data['aplicavel_a'],
            'status'        => $data['status'],
            'id_user'       => $request->user()?->id,
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Comissão cadastrada com sucesso!',
            'comissao' => $this->formatar($comissao),
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $comissao = ComissaoCadastro::find($id);
        if (!$comissao) {
            return response()->json(['success' => false, 'message' => 'Comissão não encontrada.'], 404);
        }

        $data = $this->validarPayload($request, true);

        $comissao->update([
            'nome'          => $data['nome'],
            'descricao'     => $data['descricao'],
            'tipo_comissao' => $data['tipo_comissao'],
            'valor'         => $data['valor'],
            'aplicavel_a'   => $data['aplicavel_a'],
            'status'        => $data['status'],
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Comissão atualizada com sucesso!',
            'comissao' => $this->formatar($comissao),
        ]);
    }

    public function destroy(int $id)
    {
        $comissao = ComissaoCadastro::find($id);
        if (!$comissao) {
            return response()->json(['success' => false, 'message' => 'Comissão não encontrada.'], 404);
        }

        $comissao->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comissão removida com sucesso!',
        ]);
    }

    public function toggleStatus(int $id)
    {
        $comissao = ComissaoCadastro::find($id);
        if (!$comissao) {
            return response()->json(['success' => false, 'message' => 'Comissão não encontrada.'], 404);
        }

        $novoStatus = (int)$comissao->status === 1 ? 0 : 1;
        $comissao->update(['status' => $novoStatus]);

        return response()->json([
            'success'     => true,
            'message'     => $novoStatus === 1 ? 'Comissão ativada!' : 'Comissão inativada!',
            'status_num'  => $novoStatus,
            'status'      => $novoStatus === 1 ? 'Ativo' : 'Inativo',
        ]);
    }

    protected function validarPayload(Request $request, bool $isUpdate): array
    {
        $tipoRaw = $request->input('tipo_comissao') ?? $request->input('calculationType');
        $tipoComissao = $this->parseTipoComissao($tipoRaw);

        $valorBruto = $request->input('valor');
        if (is_string($valorBruto)) {
            $valorNormalizado = str_replace([',', '.'], ['', ''], $valorBruto);
            $valorBruto = preg_replace('/[^0-9,.-]/', '', $valorBruto);
            $temVirgula = str_contains($valorBruto, ',');
            if ($temVirgula) {
                $valorBruto = str_replace(',', '.', str_replace('.', '', $valorBruto));
            }
        }
        $valorNumerico = (float)$valorBruto;

        $status = $request->input('status');
        if ($status === null || $status === '') {
            $statusInt = 1;
        } elseif (is_bool($status)) {
            $statusInt = $status ? 1 : 0;
        } else {
            $statusStr = (string)$status;
            if (in_array(strtolower($statusStr), ['ativo', '1', 'true', 'on'], true)) {
                $statusInt = 1;
            } elseif (in_array(strtolower($statusStr), ['inativo', '0', 'false', 'off'], true)) {
                $statusInt = 0;
            } else {
                $statusInt = (int)$status > 0 ? 1 : 0;
            }
        }

        $validator = Validator::make(
            [
                'nome'          => trim((string)$request->input('nome')),
                'tipo_comissao' => $tipoComissao,
                'valor'         => $valorNumerico,
                'aplicavel_a'   => trim((string)($request->input('aplicavel_a') ?? '')),
            ],
            [
                'nome'          => ['required', 'string', 'min:2', 'max:255'],
                'tipo_comissao' => ['required', 'integer', 'in:1,2'],
                'valor'         => ['required', 'numeric', 'min:0'],
                'aplicavel_a'   => ['nullable', 'string', 'max:255'],
            ],
            [
                'nome.required'        => 'O campo Nome / Regra da Comissão é obrigatório.',
                'nome.min'             => 'O nome deve ter pelo menos 2 caracteres.',
                'tipo_comissao.in'     => 'Tipo de cálculo inválido (1=% ou 2=R$).',
                'valor.required'       => 'Informe um valor válido para a comissão.',
                'valor.min'            => 'O valor da comissão não pode ser negativo.',
            ]
        );

        if ($validator->fails()) {
            $msgs = $validator->errors()->all();
            $msg = !empty($msgs) ? $msgs[0] : 'Dados inválidos para cadastrar a comissão.';
            abort(response()->json(['success' => false, 'message' => $msg, 'errors' => $validator->errors()], 422));
        }

        if ($valorNumerico <= 0) {
            abort(response()->json([
                'success' => false,
                'message' => 'Informe um valor de comissão maior que zero.',
            ], 422));
        }

        return [
            'nome'          => trim((string)$request->input('nome')),
            'descricao'     => trim((string)($request->input('descricao') ?? '')),
            'tipo_comissao' => $tipoComissao,
            'valor'         => $valorNumerico,
            'aplicavel_a'   => trim((string)($request->input('aplicavel_a') ?? '')) ?: 'Vendas Gerais (Todos os Painéis)',
            'status'        => $statusInt,
        ];
    }

    protected function parseTipoComissao($raw): int
    {
        if (is_int($raw) || is_numeric($raw)) {
            $n = (int)$raw;
            return $n === 2 ? 2 : 1;
        }
        $s = strtolower(trim((string)$raw));
        if ($s === 'fixed' || $s === 'fixo' || $s === '2') return 2;
        return 1;
    }

    protected function formatar(ComissaoCadastro $c): array
    {
        return [
            'id'              => (int)$c->id,
            'nome'            => $c->nome,
            'descricao'       => (string)($c->descricao ?? ''),
            'tipo_comissao'   => (int)$c->tipo_comissao,
            'calculationType' => (int)$c->tipo_comissao === 1 ? 'percentage' : 'fixed',
            'valor'           => (float)$c->valor,
            'aplicavel_a'     => (string)($c->aplicavel_a ?? ''),
            'status_num'      => (int)$c->status,
            'status'          => (int)$c->status === 1 ? 'Ativo' : 'Inativo',
            'updatedAt'       => optional($c->updated_at)->format('d/m/Y') ?? '',
            'createdAt'       => optional($c->created_at)->format('d/m/Y') ?? '',
        ];
    }
}
