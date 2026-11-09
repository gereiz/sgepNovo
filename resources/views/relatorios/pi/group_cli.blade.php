<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}">
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}">

@php
    function fpLabel($f) {
        return match((int)$f) {
            1 => 'DINHEIRO', 2 => 'PIX', 3 => 'CARTÃO', 4 => 'BOLETO', 5 => 'TRANSFERÊNCIA', default => '—'
        };
    }
@endphp

@foreach ($itens as $item)
    @php
        // Variáveis esperadas pelos componentes padrão
        $pi = $item['pi'];
        $cliente = $item['cliente'];
        $agentes = $item['agentes'];
        $bairro = $item['bairro'];
        $cidade = $item['cidade'];
        $uf = $item['uf'];
        $bs_inicio = $item['bs_inicio'];
        $bs_final = $item['bs_final'];
        $bs_formated = $item['bs_formated'];
        $pagamento = $item['pagamento'];
        $forma_pagamento = $item['forma_pagamento'];
        $dt_atual = $item['dt_atual'] ?? (isset($dt_atual) ? $dt_atual : date('d/m/Y'));
        $campanha = $item['campanha'];
        $servicos = $item['servicos'];
        $faturamento = $item['faturamento'];
        $vendedor = $item['vendedor'];
        $lista_lancamentos = $item['lista_lancamentos'];
        $observacao = $item['observacao'];
        $idPaineis = $item['painel_ids'] ?? [];

        $num = str_pad($pi->id, 4, '0', STR_PAD_LEFT);
    @endphp

    @include('relatorios.includes.rel_header', ['titulo' => 'PEDIDO DE INSERÇÃO', 'doc' => 'PI', 'num' => $num, 'via' => 'Cliente'])

    @include('relatorios.pi.components.autorizacao_servico')

    @include('relatorios.pi.components.descricao_servico')

    @include('relatorios.pi.components.totais')

    @include('relatorios.pi.components.assinaturas')

    <div style="page-break-after: always;"></div>
@endforeach

@include('relatorios.pi.components.informacoes_contratuais')
