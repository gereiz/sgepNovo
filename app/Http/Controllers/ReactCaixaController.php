<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Financeiro\Lancamento;
use App\Models\Financeiro\CentroCusto;
use App\Models\Financeiro\TipoLancamento;
use App\Models\Financeiro\ComissaoVenda;
use Carbon\Carbon;

class ReactCaixaController extends Controller
{
    protected function tirarAcentos($str) {
        $str = (string)$str;
        if ($str === '') return '';
        $replaces = [
            'á'=>'a','à'=>'a','ã'=>'a','â'=>'a','ä'=>'a',
            'é'=>'e','è'=>'e','ê'=>'e','ë'=>'e',
            'í'=>'i','ì'=>'i','î'=>'i','ï'=>'i',
            'ó'=>'o','ò'=>'o','õ'=>'o','ô'=>'o','ö'=>'o',
            'ú'=>'u','ù'=>'u','û'=>'u','ü'=>'u',
            'ç'=>'c','ñ'=>'n',
        ];
        foreach ($replaces as $a=>$b) {
            $str = str_replace([$a, strtoupper($a), mb_strtoupper($a)], [$b,$b,$b], $str);
        }
        return $str;
    }

    protected function contemAlguma($haystack, array $needles) {
        $h = (string)$haystack;
        if ($h === '') return false;
        foreach ($needles as $n) {
            $n = (string)$n;
            if ($n === '') continue;
            if (strpos($h, $n) !== false) return true;
        }
        return false;
    }

    public function index(Request $request)
    {
        $search = trim((string)($request->query('search') ?? ''));
        $status = (string)($request->query('status') ?? 'todos');
        $centroCustoId = (int)($request->query('cc') ?? 0);
        $tipoLancId = (int)($request->query('tl') ?? 0);
        $page = max(1, (int)($request->query('page') ?? 1));
        $perPage = (int)($request->query('perPage') ?? 50);

        $q = Lancamento::with(['tipoLancamento', 'centroCusto']);

        if ($search !== '') {
            $s = '%'.$search.'%';
            $q->where(function ($q2) use ($s) {
                $q2->where('descricao', 'LIKE', $s)
                   ->orWhere('observacoes', 'LIKE', $s)
                   ->orWhere('parcelas', 'LIKE', $s)
                   ->orWhere('id_reserva', 'LIKE', $s);
            });
        }
        if ($status === 'quitado') {
            $q->where('status_pagamento', 'QUITADO');
        } elseif ($status === 'pendente') {
            $q->where(function ($q2) {
                $q2->whereNull('status_pagamento')->orWhere('status_pagamento', '!=', 'QUITADO');
            });
        }
        if ($centroCustoId > 0) {
            $q->where('centro_custo', $centroCustoId);
        }
        if ($tipoLancId > 0) {
            $q->where('tipo_lancamento', $tipoLancId);
        }

        $totalQuery = (clone $q);
        $totalItens = (int)$totalQuery->count();
        $totalValor = (float)$totalQuery->sum('valor');
        $totalQuitado = (float)(clone $q)->where('status_pagamento', 'QUITADO')->sum('valor');
        $totalPendente = $totalValor - $totalQuitado;

        $lancamentos = $q
            ->orderByDesc('id')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $reservaIds = [];
        foreach ($lancamentos as $l) {
            if ($l->id_reserva && (int)$l->id_reserva > 0) {
                $reservaIds[] = (int)$l->id_reserva;
            }
        }
        $reservaIds = array_values(array_unique($reservaIds));
        $comissoesPorReserva = [];
        if (count($reservaIds) > 0) {
            try {
                $rows = ComissaoVenda::whereIn('pi_id', $reservaIds)
                    ->selectRaw('pi_id, COALESCE(SUM(valor_comissao),0) as total_comissao')
                    ->groupBy('pi_id')
                    ->get();
                foreach ($rows as $row) {
                    $comissoesPorReserva[(int)$row->pi_id] = (float)$row->total_comissao;
                }
            } catch (\Throwable $e) {
                $comissoesPorReserva = [];
            }
        }

        $lancamentosArr = $lancamentos->map(function ($l) use ($comissoesPorReserva) {
            $tipoNome = $l->tipoLancamento ? (string)($l->tipoLancamento->tipo ?? '') : '';
            $tipoNormalizado = mb_strtolower($this->tirarAcentos($tipoNome));
            $ehEntrada = false;
            if ($tipoNome !== '') {
                $palavrasEntrada = ['entrada', 'receita', 'recebiment', 'venda', 'faturamento', 'reserva', 'vendas', 'pi ', 'os ', 'ordem servico', 'cliente', 'retorno', 'reembolso', 'comissao receb'];
                $palavrasSaida   = ['saida', 'despesa', 'custo', 'pagamento', 'desconto', 'imposto', 'salario', 'salários', 'fornecedor', 'comissao paga', 'comissao pag', 'transporte', 'aluguel', 'material', 'serviço prest', 'servico prest', 'taxa', 'multa'];
                $ehEntrada = $this->contemAlguma($tipoNormalizado, $palavrasEntrada) && !$this->contemAlguma($tipoNormalizado, $palavrasSaida);
                if (!$ehEntrada && !$this->contemAlguma($tipoNormalizado, $palavrasSaida)) {
                    $ehEntrada = null;
                }
            }
            $valorBruto = (float)($l->valor ?? 0);
            $comissaoRestar = 0.0;
            if ($l->id_reserva && (int)$l->id_reserva > 0) {
                $comissaoRestar = (float)($comissoesPorReserva[(int)$l->id_reserva] ?? 0);
            }
            $valorLiquido = max(0.0, $valorBruto - $comissaoRestar);
            return [
                'id' => (int)$l->id,
                'descricao' => (string)($l->descricao ?? ''),
                'valor' => $valorBruto,
                'valor_liquido' => $valorLiquido,
                'parcelas' => (string)($l->parcelas ?? ''),
                'dt_faturamento' => $l->dt_faturamento ? Carbon::parse($l->dt_faturamento)->format('Y-m-d') : null,
                'dt_pagamento_real' => $l->dt_pagamento_real ? Carbon::parse($l->dt_pagamento_real)->format('Y-m-d') : null,
                'centro_custo_id' => (int)($l->centro_custo ?? 0),
                'centro_custo_nome' => $l->centroCusto ? (string)($l->centroCusto->centro_custo ?? '') : '',
                'tipo_lancamento_id' => (int)($l->tipo_lancamento ?? 0),
                'tipo_lancamento_nome' => $tipoNome,
                'tipo_lancamento_eh_entrada' => $ehEntrada,
                'id_reserva' => $l->id_reserva ? (int)$l->id_reserva : null,
                'status_pagamento' => (string)($l->status_pagamento ?? 'PENDENTE'),
                'observacoes' => (string)($l->observacoes ?? ''),
            ];
        })->values()->all();

        $centrosCusto = CentroCusto::orderBy('centro_custo')->get(['id', 'centro_custo'])->map(function ($c) {
            return ['id' => (int)$c->id, 'nome' => (string)$c->centro_custo];
        })->values()->all();

        $tiposLancamento = TipoLancamento::orderBy('tipo')->get(['id', 'tipo'])->map(function ($t) {
            $tipoNome = (string)($t->tipo ?? '');
            $tipoNormalizado = mb_strtolower($this->tirarAcentos($tipoNome));
            $palavrasEntrada = ['entrada', 'receita', 'recebiment', 'venda', 'faturamento', 'reserva', 'vendas', 'pi ', 'os ', 'ordem servico', 'cliente', 'retorno', 'reembolso', 'comissao receb'];
            $palavrasSaida   = ['saida', 'despesa', 'custo', 'pagamento', 'desconto', 'imposto', 'salario', 'salários', 'fornecedor', 'comissao paga', 'comissao pag', 'transporte', 'aluguel', 'material', 'serviço prest', 'servico prest', 'taxa', 'multa'];
            $ehEntrada = $this->contemAlguma($tipoNormalizado, $palavrasEntrada) && !$this->contemAlguma($tipoNormalizado, $palavrasSaida);
            if (!$ehEntrada && !$this->contemAlguma($tipoNormalizado, $palavrasSaida)) {
                $ehEntrada = null;
            }
            return [
                'id' => (int)$t->id,
                'nome' => $tipoNome,
                'tipo' => $ehEntrada === true ? 'entrada' : ($ehEntrada === false ? 'saida' : 'indefinido'),
            ];
        })->values()->all();

        $paginas = $perPage > 0 ? (int)ceil($totalItens / $perPage) : 1;
        $paginas = max(1, $paginas);

        $props = [
            'search' => $search,
            'status' => $status,
            'centroCustoId' => $centroCustoId,
            'tipoLancId' => $tipoLancId,
            'page' => $page,
            'perPage' => $perPage,
            'totalItens' => $totalItens,
            'paginas' => $paginas,
            'kpis' => [
                'total_faturado' => $totalValor,
                'recebido' => $totalQuitado,
                'a_receber' => $totalPendente,
            ],
            'centros_custo' => $centrosCusto,
            'tipos_lancamento' => $tiposLancamento,
            'lancamentos' => $lancamentosArr,
        ];

        return Inertia::render('React/Financeiro/Caixa/Index')->rootView('app-react')->with($props);
    }
}
