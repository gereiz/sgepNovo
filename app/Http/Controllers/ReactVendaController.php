<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Vendas\Os;
use App\Models\Clientes\Cliente;
use App\Models\Bisemanas\Bisemana;
use App\Models\Config\Ano;
use App\Models\User;
use App\Models\Financeiro\Servico;
use App\Models\Financeiro\Lancamento;
use App\Models\Financeiro\Comissao;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\UF;
use App\Models\Textos\TextoPadrao;
use App\Services\Financeiro\CaixaService;
use App\Services\ClienteService;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use PDF;

class ReactVendaController extends Controller
{
    private $clienteService;

    public function __construct(ClienteService $clienteService)
    {
        $this->clienteService = $clienteService;
    }

    public function index(Request $request)
    {
        $anoId = (int)($request->query('anoId') ?? 0);
        $bsId  = (int)($request->query('bsId') ?? 0);
        $search = trim((string)($request->query('q') ?? ''));
        $vendedorId = (int)($request->query('vendedorId') ?? 0);

        // 1. Anos
        $anos = Ano::orderByDesc('ano_bisemana')->get(['id', 'ano_bisemana'])->map(function ($a) {
            return ['id' => (int)$a->id, 'ano' => (int)$a->ano_bisemana];
        })->values()->all();

        $anoCorrente = (int)date('Y');
        $anoDefault = null;
        foreach ($anos as $a) {
            if ((int)$a['ano'] === $anoCorrente) { $anoDefault = $a; break; }
        }
        if (!$anoDefault && count($anos) > 0) $anoDefault = $anos[0];
        $anoIdFinal = $anoId > 0 ? $anoId : ($anoDefault ? (int)$anoDefault['id'] : 0);

        // 2. Bi-semanas
        $bisemanasTodas = Bisemana::when($anoIdFinal > 0, function ($q) use ($anoIdFinal) {
            return $q->where('ano_id', $anoIdFinal);
        })->orderBy('ano_id')->orderBy('num_bisemana')->get(['id', 'num_bisemana', 'inicio', 'fim', 'ano_id'])->map(function ($b) {
            $ano = $b->ano_id ? (Ano::find($b->ano_id)?->ano_bisemana ?? date('Y')) : date('Y');
            try { $dtIni = Carbon::parse((string)$b->inicio); } catch (\Throwable $e) { $dtIni = Carbon::today(); }
            try { $dtFim = Carbon::parse((string)$b->fim); } catch (\Throwable $e) { $dtFim = Carbon::today(); }
            $label = 'BS ' . ((int)($b->num_bisemana ?? 0)) . ': ' . $dtIni->format('d/m') . ' até ' . $dtFim->format('d/m') . '/' . substr((string)$ano, 0, 4);
            return [
                'id' => (int)$b->id,
                'num_bisemana' => (int)($b->num_bisemana ?? 0),
                'inicio' => $dtIni->format('Y-m-d'),
                'fim'   => $dtFim->format('Y-m-d'),
                'ano_id' => (int)$b->ano_id,
                'year' => (int)substr((string)$ano, 0, 4),
                'label' => $label,
            ];
        })->values()->all();

        $hoje = Carbon::today();
        $bsPadrao = null;
        foreach ($bisemanasTodas as $bs) {
            try {
                $ini = Carbon::parse($bs['inicio']);
                $fim = Carbon::parse($bs['fim']);
                if ($hoje->gte($ini) && $hoje->lte($fim)) { $bsPadrao = $bs; break; }
            } catch (\Throwable $e) {}
        }
        if (!$bsPadrao && count($bisemanasTodas) > 0) {
            foreach ($bisemanasTodas as $bs) {
                try {
                    $fim = Carbon::parse($bs['fim']);
                    if ($fim->gte($hoje)) { $bsPadrao = $bs; break; }
                } catch (\Throwable $e) {}
            }
        }
        if (!$bsPadrao && count($bisemanasTodas) > 0) $bsPadrao = $bisemanasTodas[0];
        $bsIdFinal = $bsId > 0 ? $bsId : ($bsPadrao ? (int)$bsPadrao['id'] : 0);

        // 3. Clientes
        $clientes = Cliente::orderBy('nome_fantasia')
            ->get([
                'id', 'razao_social', 'nome_fantasia', 'cpf_cnpj', 'nro_insc',
                'responsavel', 'tel_responsavel', 'email_responsavel',
                'endereco', 'num', 'bairro', 'cidade', 'uf', 'cep',
                'telefone', 'celular', 'email', 'agent'
            ])
            ->map(function ($c) {
                return [
                    'id' => (int)$c->id,
                    'nome_fantasia' => (string)($c->nome_fantasia ?: $c->razao_social),
                    'razao_social' => (string)($c->razao_social ?: $c->nome_fantasia),
                    'cpf_cnpj' => (string)$c->cpf_cnpj,
                    'nro_insc' => (string)$c->nro_insc,
                    'responsavel' => (string)$c->responsavel,
                    'tel_responsavel' => (string)$c->tel_responsavel,
                    'email_responsavel' => (string)$c->email_responsavel,
                    'endereco' => (string)$c->endereco,
                    'num' => (string)$c->num,
                    'bairro' => $c->bairro,
                    'cidade' => $c->cidade,
                    'uf' => $c->uf,
                    'cep' => (string)$c->cep,
                    'telefone' => (string)$c->telefone,
                    'celular' => (string)$c->celular,
                    'email' => (string)$c->email,
                    'agent' => (int)$c->agent,
                ];
            })
            ->values()->all();

        // 4. Vendedores
        $vendedores = User::orderBy('name')
            ->where(function ($q) {
                $q->whereNull('active')->orWhere('active', '!=', 0);
            })
            ->get(['id', 'name', 'email'])
            ->map(function ($u) {
                return [
                    'id' => (int)$u->id,
                    'nome' => (string)$u->name,
                    'email' => (string)$u->email,
                ];
            })
            ->values()->all();

        // 5. Agentes de comissão
        $agentes = Cliente::where('agent', 1)
            ->orderBy('nome_fantasia')
            ->get(['id', 'nome_fantasia', 'razao_social', 'cpf_cnpj'])
            ->map(function ($a) {
                return [
                    'id' => (int)$a->id,
                    'nome' => (string)($a->nome_fantasia ?: $a->razao_social),
                    'cpf_cnpj' => (string)$a->cpf_cnpj,
                ];
            })
            ->values()->all();

        // 6. Serviços cadastrados
        $servicos = Servico::orderBy('nome')->get()->map(function ($s) {
            return [
                'id' => (int)$s->id,
                'nome' => (string)$s->nome,
                'descricao' => (string)($s->descricao ?? ''),
                'valor' => (float)($s->valor ?? 0),
                'comissao' => (float)($s->comissao ?? 0),
                'tipo_comissao' => (int)($s->tipo_comissao ?? 0),
            ];
        })->values()->all();

        // 7. UFs
        $ufs = DB::table('uf')->orderBy('nome')->get(['id', 'nome', 'sigla'])->map(function ($u) {
            return ['id' => (int)$u->id, 'nome' => (string)$u->nome, 'sigla' => (string)$u->sigla];
        })->values()->all();

        // 8. Consulta de Vendas (OS)
        $vendasQuery = Os::with(['cliente', 'bisemana'])
            ->when($anoIdFinal > 0, function ($q) use ($anoIdFinal) {
                $q->whereHas('bisemana', function ($b) use ($anoIdFinal) {
                    $b->where('ano_id', $anoIdFinal);
                });
            })
            ->when($bsIdFinal > 0, function ($q) use ($bsIdFinal) {
                $q->where('id_bisemana', $bsIdFinal);
            })
            ->when($vendedorId > 0, function ($q) use ($vendedorId) {
                $q->where('vendedor', $vendedorId);
            })
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('campanha', 'like', "%{$search}%")
                        ->orWhere('id', 'like', "%{$search}%")
                        ->orWhereHas('cliente', function ($c) use ($search) {
                            $c->where('nome_fantasia', 'like', "%{$search}%")
                              ->orWhere('razao_social', 'like', "%{$search}%")
                              ->orWhere('cpf_cnpj', 'like', "%{$search}%");
                        });
                });
            })
            ->orderByDesc('id');

        $formasPgtoLabels = [
            1 => 'Dinheiro',
            2 => 'Pix',
            3 => 'Cartão',
            4 => 'Boleto',
            5 => 'Transferência',
        ];

        $vendedoresMap = [];
        foreach ($vendedores as $v) { $vendedoresMap[$v['id']] = $v['nome']; }

        $vendasTodas = $vendasQuery->get();

        $kpiTotalVendas = 0;
        $kpiFaturamentoTotal = 0.0;
        $kpiCanceladas = 0;

        $vendasList = $vendasTodas->map(function ($os) use ($formasPgtoLabels, $vendedoresMap, &$kpiTotalVendas, &$kpiFaturamentoTotal, &$kpiCanceladas) {
            $cli = $os->cliente;
            $cliNome = $cli ? ($cli->nome_fantasia ?: $cli->razao_social) : 'Cliente não informado';
            $bs = $os->bisemana;
            $bsLabel = '—';
            if ($bs) {
                try {
                    $ini = Carbon::parse($bs->inicio)->format('d/m');
                    $fim = Carbon::parse($bs->fim)->format('d/m/Y');
                    $bsLabel = "BS {$bs->num_bisemana}: {$ini} a {$fim}";
                } catch (\Throwable $e) {}
            }

            $formaLabel = $formasPgtoLabels[(int)$os->forma_pagamento] ?? 'Não definida';
            $vendedorNome = $vendedoresMap[(int)$os->vendedor] ?? '—';

            $arquivoCli = $os->arquivo ? asset('storage/pdf/os/' . $os->arquivo) : null;
            $arquivoFin = $os->arquivo ? asset('storage/pdf/os/' . str_replace('os_cli_', 'os_fin_', $os->arquivo)) : null;

            $vlTotal = (float)($os->vl_total ?? 0);
            $isCancelada = (int)($os->cancelada ?? 0) === 1;

            if ($isCancelada) {
                $kpiCanceladas++;
            } else {
                $kpiTotalVendas++;
                $kpiFaturamentoTotal += $vlTotal;
            }

            return [
                'id' => (int)$os->id,
                'cliente_id' => (int)($os->id_cliente ?? 0),
                'cliente_nome' => $cliNome,
                'razao_social' => (string)($cli?->razao_social ?? ''),
                'nome_fantasia' => (string)($cli?->nome_fantasia ?? ''),
                'cpf_cnpj' => (string)($cli?->cpf_cnpj ?? ''),
                'contato' => (string)($os->contato ?? ''),
                'campanha' => (string)($os->campanha ?? ''),
                'bisemana_id' => (int)($os->id_bisemana ?? 0),
                'num_bisemana' => (int)($bs?->num_bisemana ?? 0),
                'bisemana_label' => $bsLabel,
                'vendedor_id' => (int)($os->vendedor ?? 0),
                'vendedor_nome' => $vendedorNome,
                'vl_unit' => (float)($os->vl_unit ?? 0),
                'vl_desc' => (float)($os->vl_desc ?? 0),
                'vl_custo' => (float)($os->vl_custo ?? 0),
                'vl_total' => $vlTotal,
                'pago' => (int)($os->pago ?? 0),
                'dt_pgto' => (string)($os->dt_pgto ?? ''),
                'forma_pagamento' => (int)($os->forma_pagamento ?? 0),
                'forma_pagamento_label' => $formaLabel,
                'obs' => (string)($os->obs ?? ''),
                'cancelada' => $isCancelada ? 1 : 0,
                'arquivo' => (string)($os->arquivo ?? ''),
                'arquivo_url' => $arquivoCli,
                'arquivo_fin_url' => $arquivoFin,
                'created_at' => $os->created_at ? Carbon::parse($os->created_at)->format('d/m/Y H:i') : '—',
                'dt_criacao' => $os->created_at ? Carbon::parse($os->created_at)->format('Y-m-d') : date('Y-m-d'),
            ];
        })->values()->all();

        $ticketMedio = $kpiTotalVendas > 0 ? ($kpiFaturamentoTotal / $kpiTotalVendas) : 0.0;

        $bsAtual = null;
        foreach ($bisemanasTodas as $b) {
            if ((int)$b['id'] === $bsIdFinal) { $bsAtual = $b; break; }
        }

        $props = [
            'ano_id' => $anoIdFinal,
            'bs_id' => $bsIdFinal,
            'search' => $search,
            'vendedor_id' => $vendedorId,
            'anos' => $anos,
            'bisemanas' => $bisemanasTodas,
            'bs_atual' => $bsAtual,
            'clientes' => $clientes,
            'vendedores' => $vendedores,
            'agentes' => $agentes,
            'servicos' => $servicos,
            'ufs' => $ufs,
            'vendas' => $vendasList,
            'kpis' => [
                'total_vendas' => $kpiTotalVendas,
                'faturamento_total' => $kpiFaturamentoTotal,
                'ticket_medio' => $ticketMedio,
                'total_canceladas' => $kpiCanceladas,
            ],
        ];

        return Inertia::render('React/Vendas/Lancar/Index')->rootView('app-react')->with($props);
    }

    public function sessionData(Request $request)
    {
        if ($request->formVenda) {
            session(['dadosVenda' => $request->formVenda]);
        }
        return response()->json(session()->all());
    }

    public function store(Request $request)
    {
        $dados = $request->formVenda ?? session('dadosVenda') ?? [];
        if (empty($dados) && $request->has('One')) {
            $dados = $request->all();
        }

        $one = $dados['One'] ?? [];
        $two = $dados['Two'] ?? [];
        $four = $dados['Four'] ?? [];
        $five = $dados['Five'] ?? [];

        $servicos = $four['servicos'] ?? [];
        $clienteId = $one['clienteId']
            ?? ($one['clienteObj']['id'] ?? null)
            ?? ($one['clienteObj'] ?? null);
        $cliNomeSess = trim($one['clienteNome'] ?? '');

        if (!$clienteId) {
            return response()->json(['cod' => 0, 'msg' => 'Cliente não selecionado'], 422);
        }

        $cliente = $this->clienteService->getCliente($clienteId);
        if (!$cliente) {
            $cliente = new \stdClass();
            $cliente->id = $clienteId;
            $cliente->razao_social = $cliNomeSess ?: '';
            $cliente->nome_fantasia = $cliNomeSess ?: '';
            $cliente->cpf_cnpj = $one['cpf_cnpj'] ?? '';
            $cliente->nro_insc = '';
            $cliente->endereco = $one['endereco'] ?? '';
            $cliente->num = $one['num'] ?? '';
            $cliente->bairro = null;
            $cliente->cidade = null;
            $cliente->uf = null;
            $cliente->complemento = '';
            $cliente->cep = '';
        }

        $cliNome = $cliente ? ($cliente->nome_fantasia ?: $cliente->razao_social) : $cliNomeSess;
        $caixaService = new CaixaService();

        // Cálculos
        $vl_total = 0; $vlr_unt = 0; $vlr_desc = 0; $vlr_custo = 0;
        foreach ($servicos as $s) {
            $vl_total += (float)($s['vlr_total'] ?? 0);
            $vlr_unt += (float)($s['vlr_unit'] ?? 0);
            $vlr_desc += (float)($s['vlr_desc'] ?? 0);
            $vlr_custo += (float)($s['vlr_custo'] ?? 0);
        }

        $dtFile = date('Y-m-d');
        $cliNomeFile = $cliente ? ($cliente->nome_fantasia ?: $cliente->razao_social) : ($cliNomeSess ?: 'cliente');
        $cliNomeFile = preg_replace('/[^A-Za-z0-9_-]+/', '_', $cliNomeFile);

        $os = Os::create([
            'id_cliente' => $clienteId ?? 0,
            'id_paineis' => json_encode($two['paineis'] ?? ['VENDA']),
            'contato' => $one['responsavel'] ?? '',
            'campanha' => $two['campanha'] ?? '',
            'id_bisemana' => $two['bisemanaId'] ?? null,
            'vl_unit' => $vlr_unt,
            'vl_desc' => $vlr_desc,
            'vl_custo' => $vlr_custo,
            'vl_total' => $vl_total,
            'pago' => $four['pgto'] ?? 0,
            'dt_pgto' => $four['dtPgto'] ?? null,
            'forma_pagamento' => $four['formaPgto'] ?? null,
            'vendedor' => $two['vendedorId'] ?? null,
            'obs' => strip_tags($five['observacao'] ?? ($servicos[0]['detalhes'] ?? '')),
            'cancelada' => 0,
        ]);

        $anoOs = substr((string)$dtFile, 0, 4);
        $nomeArquivoOsBanco = 'os_cli_OS' . $os->id . '_' . $anoOs . '_' . $cliNomeFile . '_' . $dtFile . '.pdf';
        $os->update(['arquivo' => $nomeArquivoOsBanco]);

        $descricaoBase = 'OS nº ' . ($os->id ?? 0) . ' Cliente: ' . ($cliNome ?? '');

        // Lançamentos no Caixa
        $lista = [];
        $parcelasDetalhe = $four['parcelasDetalhe'] ?? [];
        if (is_array($parcelasDetalhe) && count($parcelasDetalhe) > 0) {
            $i = 1;
            foreach ($parcelasDetalhe as $parc) {
                $lanc = [
                    'descricao' => $descricaoBase,
                    'valor' => (float)($parc['valor'] ?? 0),
                    'parcelas' => $i . '/' . count($parcelasDetalhe),
                    'data_lancamento' => $parc['data'] ?? ($four['dtPgto'] ?? date('Y-m-d')),
                    'centro_custo' => 1,
                    'tipo_lancamento' => 1,
                    'id_reserva' => $os->id ?? 0,
                    'observacoes' => strip_tags($five['observacao'] ?? ''),
                ];
                try {
                    $req = new Request();
                    $req->replace($lanc);
                    $caixaService->createLancamento($req);
                } catch (\Throwable $eCaixa) {
                    Log::warning('Erro criar lancamento caixa OS #' . $os->id . ': ' . $eCaixa->getMessage());
                }
                $lista[] = $lanc;
                $i++;
            }
        } else {
            $qtd = (int)($four['qtdParcelas'] ?? 1);
            if ($qtd <= 0) $qtd = 1;
            $dtPgto = $four['dtPgto'] ?? date('Y-m-d');
            if ($vl_total > 0) {
                $vl_parc = $vl_total / $qtd;
                for ($i = 0; $i < $qtd; $i++) {
                    $lanc = [
                        'descricao' => $descricaoBase,
                        'valor' => $vl_parc,
                        'parcelas' => ($i + 1) . '/' . $qtd,
                        'data_lancamento' => date('Y-m-d', strtotime($dtPgto . ' + ' . $i . ' month')),
                        'centro_custo' => 1,
                        'tipo_lancamento' => 1,
                        'id_reserva' => $os->id ?? 0,
                        'observacoes' => strip_tags($five['observacao'] ?? ''),
                    ];
                    try {
                        $req = new Request();
                        $req->replace($lanc);
                        $caixaService->createLancamento($req);
                    } catch (\Throwable $eCaixa) {
                        Log::warning('Erro criar lancamento caixa OS #' . $os->id . ': ' . $eCaixa->getMessage());
                    }
                    $lista[] = $lanc;
                }
            }
        }

        // Gerar PDFs
        $dt_atual = date('d/m/Y');
        $bisemanaId = $two['bisemanaId'] ?? null;
        $bisemana = $bisemanaId ? Bisemana::where('id', $bisemanaId)->first() : null;
        $bs_ini = $bisemana ? explode('-', $bisemana->inicio) : [date('Y'), date('m'), date('d')];
        $bs_fin = $bisemana ? explode('-', $bisemana->fim) : [date('Y'), date('m'), date('d')];
        $bs_inicio = $bs_ini[2].'/'.$bs_ini[1].'/'.$bs_ini[0];
        $bs_final = $bs_fin[2].'/'.$bs_fin[1].'/'.$bs_fin[0];
        $bs_ano = substr($bs_ini[0], 2, 2);
        $bs_formated = 'BS: '. ($bisemana->num_bisemana ?? '') .' - '.$bs_ini[2].'/'.$bs_ini[1]. ' a '.$bs_fin[2].'/'.$bs_fin[1].'/'.$bs_ano;

        $bairro = isset($cliente->bairro) ? Bairro::where('id', $cliente->bairro)->first() : null;
        $cidade = isset($cliente->cidade) ? Cidade::where('id', $cliente->cidade)->first() : null;
        $uf = isset($cliente->uf) ? UF::where('id', $cliente->uf)->first() : null;
        if (!$bairro) { $b = new \stdClass(); $b->nome = ''; $bairro = $b; }
        if (!$cidade) { $c = new \stdClass(); $c->nome = ''; $cidade = $c; }
        if (!$uf) { $u = new \stdClass(); $u->sigla = ''; $uf = $u; }

        $pagamento = $four['pgto'] ?? 0;
        $forma_pagamento = $four['formaPgto'] ?? 0;
        $campanha = $two['campanha'] ?? '';
        $faturamento = [ 'faturar_sobre' => '1', 'faturar_contra' => '1', 'enviar_faturamento' => '1' ];
        $vendedor = $two['vendedor'] ?? '';
        $textoAtivo = TextoPadrao::where('active', 1)->first();
        $idPaineis = $two['paineis'] ?? ['VENDA'];

        $agentes = [];
        foreach (($two['agentesId'] ?? []) as $ag) {
            $agId = is_array($ag) ? ($ag['id'] ?? 0) : $ag;
            $agente = Cliente::where('agent', 1)->where('id', $agId)->first();
            if ($agente) { $agentes[] = $agente; }
        }

        $dir = storage_path('app/public/pdf/os');
        if (!is_dir($dir)) { @mkdir($dir, 0777, true); }

        $fileName = 'os_cli_OS' . $os->id . '_' . $anoOs . '_' . $cliNomeFile . '_' . $dtFile . '.pdf';
        $finName = 'os_fin_OS' . $os->id . '_' . $anoOs . '_' . $cliNomeFile . '_' . $dtFile . '.pdf';

        try {
            $osPdf = PDF::loadview('relatorios.os.os_nova', [
                'os' => $os,
                'cliente' => $cliente,
                'servicos' => $servicos,
                'lista_lancamentos' => $lista,
                'dt_atual' => $dt_atual,
                'observacao' => $five['observacao'] ?? null,
                'idPaineis' => $idPaineis,
                'bs_inicio' => $bs_inicio,
                'bs_final' => $bs_final,
                'bs_formated' => $bs_formated,
                'pagamento' => $pagamento,
                'forma_pagamento' => $forma_pagamento,
                'bairro' => $bairro,
                'cidade' => $cidade,
                'uf' => $uf,
                'campanha' => $campanha,
                'faturamento' => $faturamento,
                'vendedor' => $vendedor,
                'textoAtivo' => $textoAtivo,
                'agentes' => $agentes,
            ]);
            $osPdf->setPaper('a4', 'landscape');
            $osPdf->save($dir . '/' . $fileName);
            $os->update(['arquivo' => $fileName]);
        } catch (\Throwable $ePdfCli) {
            Log::error('Erro ao gerar PDF da OS #' . $os->id . ': ' . $ePdfCli->getMessage());
        }

        try {
            $osFin = PDF::loadview('relatorios.os.os_fin_nova', [
                'os' => $os,
                'cliente' => $cliente,
                'servicos' => $servicos,
                'lista_lancamentos' => $lista,
                'dt_atual' => $dt_atual,
                'observacao' => $five['observacao'] ?? null,
                'idPaineis' => $idPaineis,
                'bs_inicio' => $bs_inicio,
                'bs_final' => $bs_final,
                'bs_formated' => $bs_formated,
                'pagamento' => $pagamento,
                'forma_pagamento' => $forma_pagamento,
                'bairro' => $bairro,
                'cidade' => $cidade,
                'uf' => $uf,
                'campanha' => $campanha,
                'faturamento' => $faturamento,
                'vendedor' => $vendedor,
                'textoAtivo' => $textoAtivo,
                'agentes' => $agentes,
            ]);
            $osFin->setPaper('a4', 'landscape');
            $osFin->save($dir . '/' . $finName);
        } catch (\Throwable $ePdfFin) {
            Log::warning('Erro ao gerar PDF financeiro da OS #' . $os->id . ': ' . $ePdfFin->getMessage());
        }

        $fileUrl = asset('storage/pdf/os/' . $fileName);
        $finUrl = asset('storage/pdf/os/' . $finName);

        return response()->json([
            'cod' => 1,
            'msg' => 'Venda lançada e OS gerada com sucesso!',
            'os_id' => $os->id,
            'file_url' => $fileUrl,
            'fin_url' => $finUrl,
            'file_name' => $fileName,
        ]);
    }

    public function preview(Request $request)
    {
        $dados = $request->formVenda ?? session('dadosVenda') ?? [];
        if (empty($dados) && $request->has('One')) {
            $dados = $request->all();
        }

        $one = $dados['One'] ?? [];
        $two = $dados['Two'] ?? [];
        $four = $dados['Four'] ?? [];
        $five = $dados['Five'] ?? [];

        $servicos = $four['servicos'] ?? [];
        $clienteId = $one['clienteId']
            ?? ($one['clienteObj']['id'] ?? null)
            ?? ($one['clienteObj'] ?? null);
        $cliNomeSessPrev = trim($one['clienteNome'] ?? '');

        $cliente = $clienteId ? $this->clienteService->getCliente($clienteId) : null;
        if (!$cliente) {
            $cliente = new \stdClass();
            $cliente->id = 0;
            $cliente->razao_social = $cliNomeSessPrev ?: 'CLIENTE EXEMPLO';
            $cliente->nome_fantasia = $cliNomeSessPrev ?: 'CLIENTE EXEMPLO';
            $cliente->cpf_cnpj = $one['cpf_cnpj'] ?? '';
            $cliente->nro_insc = '';
            $cliente->endereco = $one['endereco'] ?? '';
            $cliente->num = $one['num'] ?? '';
            $cliente->bairro = null;
            $cliente->cidade = null;
            $cliente->uf = null;
            $cliente->complemento = '';
            $cliente->cep = '';
        }

        $lista = [];
        $parcelasDetalhe = $four['parcelasDetalhe'] ?? [];
        if (is_array($parcelasDetalhe) && count($parcelasDetalhe) > 0) {
            $i = 1;
            foreach ($parcelasDetalhe as $parc) {
                $lista[] = [
                    'valor' => (float)($parc['valor'] ?? 0),
                    'parcelas' => $i . '/' . count($parcelasDetalhe),
                    'data_lancamento' => $parc['data'] ?? ($four['dtPgto'] ?? date('Y-m-d')),
                ];
                $i++;
            }
        } else {
            $qtd = (int)($four['qtdParcelas'] ?? 1);
            if ($qtd <= 0) $qtd = 1;
            $dtPgto = $four['dtPgto'] ?? date('Y-m-d');
            $vl_total = 0;
            foreach ($servicos as $s) { $vl_total += (float)($s['vlr_total'] ?? 0); }
            if ($vl_total > 0) {
                $vl_parc = $vl_total / $qtd;
                for ($i = 0; $i < $qtd; $i++) {
                    $lista[] = [
                        'valor' => $vl_parc,
                        'parcelas' => ($i + 1) . '/' . $qtd,
                        'data_lancamento' => date('Y-m-d', strtotime($dtPgto . ' + ' . $i . ' month')),
                    ];
                }
            }
        }

        $dt_atual = date('d/m/Y');
        $bisemanaId = $two['bisemanaId'] ?? null;
        $bisemana = $bisemanaId ? Bisemana::where('id', $bisemanaId)->first() : null;
        $bs_ini = $bisemana ? explode('-', $bisemana->inicio) : [date('Y'), date('m'), date('d')];
        $bs_fin = $bisemana ? explode('-', $bisemana->fim) : [date('Y'), date('m'), date('d')];
        $bs_inicio = $bs_ini[2].'/'.$bs_ini[1].'/'.$bs_ini[0];
        $bs_final = $bs_fin[2].'/'.$bs_fin[1].'/'.$bs_fin[0];
        $bs_ano = substr($bs_ini[0], 2, 2);
        $bs_formated = 'BS: '. ($bisemana->num_bisemana ?? '') .' - '.$bs_ini[2].'/'.$bs_ini[1]. ' a '.$bs_fin[2].'/'.$bs_fin[1].'/'.$bs_ano;

        $bairro = isset($cliente->bairro) ? Bairro::where('id', $cliente->bairro)->first() : null;
        $cidade = isset($cliente->cidade) ? Cidade::where('id', $cliente->cidade)->first() : null;
        $uf = isset($cliente->uf) ? UF::where('id', $cliente->uf)->first() : null;
        if (!$bairro) { $b = new \stdClass(); $b->nome = ''; $bairro = $b; }
        if (!$cidade) { $c = new \stdClass(); $c->nome = ''; $cidade = $c; }
        if (!$uf) { $u = new \stdClass(); $u->sigla = ''; $uf = $u; }

        $pagamento = $four['pgto'] ?? 0;
        $forma_pagamento = $four['formaPgto'] ?? 0;
        $campanha = $two['campanha'] ?? '';
        $faturamento = [ 'faturar_sobre' => '1', 'faturar_contra' => '1', 'enviar_faturamento' => '1' ];
        $vendedor = $two['vendedor'] ?? '';
        $textoAtivo = TextoPadrao::where('active', 1)->first();
        $idPaineis = $two['paineis'] ?? ['VENDA'];

        $agentes = [];
        foreach (($two['agentesId'] ?? []) as $ag) {
            $agId = is_array($ag) ? ($ag['id'] ?? 0) : $ag;
            $agente = Cliente::where('agent', 1)->where('id', $agId)->first();
            if ($agente) { $agentes[] = $agente; }
        }

        $osPreview = new Os();
        $osPreview->id = 0;

        $osPdf = PDF::loadview('relatorios.os.os_nova', [
            'os' => $osPreview,
            'cliente' => $cliente,
            'servicos' => $servicos,
            'lista_lancamentos' => $lista,
            'dt_atual' => $dt_atual,
            'observacao' => $five['observacao'] ?? null,
            'idPaineis' => $idPaineis,
            'bs_inicio' => $bs_inicio,
            'bs_final' => $bs_final,
            'bs_formated' => $bs_formated,
            'pagamento' => $pagamento,
            'forma_pagamento' => $forma_pagamento,
            'bairro' => $bairro,
            'cidade' => $cidade,
            'uf' => $uf,
            'campanha' => $campanha,
            'faturamento' => $faturamento,
            'vendedor' => $vendedor,
            'textoAtivo' => $textoAtivo,
            'agentes' => $agentes,
        ]);
        $osPdf->setPaper('a4', 'landscape');

        return $osPdf->stream('os_preview.pdf');
    }

    public function cancel(Request $request)
    {
        $id = (int)($request->id ?? 0);
        if (!$id) {
            return response()->json(['cod' => 0, 'msg' => 'ID inválido'], 400);
        }
        $os = Os::find($id);
        if (!$os) {
            return response()->json(['cod' => 0, 'msg' => 'OS não encontrada'], 404);
        }

        Lancamento::where('id_reserva', $os->id)->delete();
        $os->cancelada = 1;
        $os->save();

        return response()->json(['cod' => 1, 'msg' => 'Venda cancelada com sucesso! Lançamentos no Caixa removidos.']);
    }
}
