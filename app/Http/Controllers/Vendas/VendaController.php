<?php

namespace App\Http\Controllers\Vendas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Clientes\Cliente;
use App\Models\Config\Ano;
use App\Services\Financeiro\CaixaService;
use App\Models\Financeiro\Lancamento;
use App\Models\Vendas\Os;
use App\Models\Enderecos\Bairro;
use App\Models\Enderecos\Cidade;
use App\Models\Enderecos\UF;
use App\Models\Bisemanas\Bisemana;
use App\Models\Textos\TextoPadrao;
use PDF;
use App\Services\ClienteService;

class VendaController extends Controller
{
    private $clienteService;

    public function __construct(ClienteService $clienteService)
    {
        $this->clienteService = $clienteService;
    }
    public function index()
    {
        $clientes = Cliente::orderBy('nome_fantasia')->get();
        $anos = Ano::orderBy('ano_bisemana','desc')->get();
        return Inertia::render('Vendas/LancarVenda', [
            'clientes' => $clientes,
            'anos' => $anos,
        ]);
    }

    public function sessionData(Request $request)
    {
        if ($request->formVenda) {
            session(['dadosVenda' => $request->formVenda]);
        }
        return session()->all();
    }

    public function store(Request $request)
    {
        $dados = session('dadosVenda') ?? [];
        $two = $dados['Two'] ?? [];
        $four = $dados['Four'] ?? [];
        $five = $dados['Five'] ?? [];

        $servicos = $four['servicos'] ?? [];
        $clienteId = $dados['One']['clienteId']
            ?? ($dados['One']['clienteObj']['id'] ?? null)
            ?? ($dados['One']['clienteObj'] ?? null);
        $cliNomeSess = trim($dados['One']['clienteNome'] ?? '');
        if (!$clienteId) {
            return response()->json(['cod'=>0,'msg'=>'Cliente não selecionado']);
        }
        $cliente = $this->clienteService->getCliente($clienteId);
        if (!$cliente) {
            $cliente = new \stdClass();
            $cliente->razao_social = $cliNomeSess ?: '';
            $cliente->nome_fantasia = $cliNomeSess ?: '';
            $cliente->cpf_cnpj = '';
            $cliente->nro_insc = '';
            $cliente->endereco = '';
            $cliente->num = '';
            $cliente->bairro = null;
            $cliente->cidade = null;
            $cliente->uf = null;
            $cliente->complemento = '';
            $cliente->cep = '';
        }
        $cliNome = $cliente ? ($cliente->razao_social ?: $cliente->nome_fantasia) : $cliNomeSess;
        $caixaService = new CaixaService();

        // Cria registro da OS para ter numeração dedicada
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
            'arquivo' => 'os_cli_'.$cliNomeFile.'_'.$dtFile.'.pdf',
            'id_paineis' => json_encode($two['paineis'] ?? ['VENDA']),
            'contato' => $dados['One']['responsavel'] ?? '',
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
        ]);
        $descricaoBase = 'OS nº ' . ($os->id ?? 0) . ' Cliente: ' . ($cliNome ?? '');

        // Monta lista de lançamentos
        $lista = [];
        $parcelasDetalhe = $four['parcelasDetalhe'] ?? [];
        if (is_array($parcelasDetalhe) && count($parcelasDetalhe) > 0) {
            $i = 1;
            foreach ($parcelasDetalhe as $parc) {
                $lanc = [
                    'descricao' => $descricaoBase,
                    'valor' => $parc['valor'],
                    'parcelas' => $i . '/' . count($parcelasDetalhe),
                    'data_lancamento' => $parc['data'],
                    'centro_custo' => 2,
                    'tipo_lancamento' => 1,
                    'id_reserva' => $os->id ?? 0,
                    'observacoes' => strip_tags($five['observacao'] ?? ''),
                ];
                $req = new \Illuminate\Http\Request();
                $req->replace($lanc);
                $caixaService->createLancamento($req);
                $lista[] = $lanc;
                $i++;
            }
        } else {
            $qtd = (int)($four['qtdParcelas'] ?? 0);
            $dtPgto = $four['dtPgto'] ?? date('Y-m-d');
            $vl_total = 0; foreach ($servicos as $s) { $vl_total += (float)($s['vlr_total'] ?? 0); }
            if ($qtd > 0 && $vl_total > 0) {
                $vl_parc = $vl_total / $qtd;
                for ($i=0; $i<$qtd; $i++) {
                    $lanc = [
                        'descricao' => $descricaoBase,
                        'valor' => $vl_parc,
                        'parcelas' => ($i+1) . '/' . $qtd,
                        'data_lancamento' => date('Y-m-d', strtotime($dtPgto . ' + ' . $i . ' month')),
                        'centro_custo' => 2,
                        'tipo_lancamento' => 1,
                        'id_reserva' => $os->id ?? 0,
                        'observacoes' => strip_tags($five['observacao'] ?? ''),
                    ];
                    $req = new \Illuminate\Http\Request();
                    $req->replace($lanc);
                    $caixaService->createLancamento($req);
                    $lista[] = $lanc;
                }
            }
        }

        // Gerar OS
        $dt_atual = date('d/m/Y');
        // Dados para replicar layout da PI
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
            $agente = Cliente::where('agent', 1)->where('id', $ag)->first();
            if ($agente) { $agentes[] = $agente; }
        }

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
        $osPdf->setPaper('a4','landscape');
        $cliNome = $cliente ? ($cliente->nome_fantasia ?: $cliente->razao_social) : ($cliNomeSess ?: 'cliente');
        $dtFile = date('Y-m-d');
        $dir = storage_path('app/public/pdf/os');
        if (!is_dir($dir)) { @mkdir($dir, 0777, true); }
        $cliNome = preg_replace('/[^A-Za-z0-9_-]+/', '_', $cliNome);
        $fileName = 'os_cli_'.$cliNome.'_'.$dtFile.'.pdf';
        $osPdf->save($dir.'/'.$fileName);
        $os->update(['arquivo' => $fileName]);

        return response()->json(['cod'=>1,'msg'=>'Venda lançada com sucesso']);
    }

    public function preview(Request $request)
    {
        $dados = session('dadosVenda') ?? [];
        $four = $dados['Four'] ?? [];
        $servicos = $four['servicos'] ?? [];
        $clienteId = $dados['One']['clienteId']
            ?? ($dados['One']['clienteObj']['id'] ?? null)
            ?? ($dados['One']['clienteObj'] ?? null);
        $cliNomeSessPrev = trim($dados['One']['clienteNome'] ?? '');
        $cliente = $clienteId ? $this->clienteService->getCliente($clienteId) : null;
        if (!$cliente) {
            $cliente = new \stdClass();
            $cliente->razao_social = $cliNomeSessPrev ?: '';
            $cliente->nome_fantasia = $cliNomeSessPrev ?: '';
            $cliente->cpf_cnpj = '';
            $cliente->nro_insc = '';
            $cliente->endereco = '';
            $cliente->num = '';
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
            $qtd = (int)($four['qtdParcelas'] ?? 0);
            $dtPgto = $four['dtPgto'] ?? date('Y-m-d');
            $vl_total = 0; foreach ($servicos as $s) { $vl_total += (float)($s['vlr_total'] ?? 0); }
            if ($qtd > 0 && $vl_total > 0) {
                $vl_parc = $vl_total / $qtd;
                for ($i=0; $i<$qtd; $i++) {
                    $lista[] = [
                        'valor' => $vl_parc,
                        'parcelas' => ($i+1) . '/' . $qtd,
                        'data_lancamento' => date('Y-m-d', strtotime($dtPgto . ' + ' . $i . ' month')),
                    ];
                }
            }
        }

        $dt_atual = date('d/m/Y');
        $two = $dados['Two'] ?? [];
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
            $agente = Cliente::where('agent', 1)->where('id', $ag)->first();
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
            'observacao' => $dados['Five']['observacao'] ?? null,
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
        $osPdf->setPaper('a4','landscape');
        return $osPdf->stream('os_preview.pdf');
    }
}
