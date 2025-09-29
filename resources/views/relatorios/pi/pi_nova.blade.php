<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}">
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}">

<style>
    @page {
        margin: 10px;
    }

    .page-number {
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 12px;
    }

    .page-number:after {
        content: "página " counter(page) " de 4";
    }

    .page-break {
        page-break-before: always;
    }
</style>


    {{-- Completa os 5 digitos do id da PI com zeros a esquerda --}}
    @php
        $num = str_pad($pi->id, 4, '0', STR_PAD_LEFT);
    @endphp

<div class="page-number"></div>

@include('relatorios.includes.rel_header', ['titulo' => 'PEDIDO DE INSERÇÃO', 'doc' => 'PI', 'num' => $num, 'via' => 'Cliente'])

@include('relatorios.pi.components.autorizacao_servico')

@include('relatorios.pi.components.descricao_servico')

@include('relatorios.pi.components.totais')

@include('relatorios.pi.components.assinaturas')

<!-- Quebra de página para a segunda página -->
<div style="page-break-after: always;"></div>

<!-- Cabeçalho da segunda página -->
@include('relatorios.includes.rel_header', ['titulo' => 'PEDIDO DE INSERÇÃO', 'doc' => 'PI', 'num' => $num, 'via' => 'Cliente'])

<!-- Conteúdo da segunda página -->
@include('relatorios.pi.components.informacoes_contratuais')




<!-- Quebra de página para a terceira página -->
<div style="page-break-after: always;"></div>

@include('relatorios.includes.rel_header', ['titulo' => 'PEDIDO DE INSERÇÃO', 'doc' => 'PI', 'num' => $num, 'via' => 'Financeiro'])

@include('relatorios.pi.components.autorizacao_servico')

@include('relatorios.pi.components.descricao_servico_fin')

@include('relatorios.pi.components.totais_fin')

@include('relatorios.pi.components.assinaturas')

<!-- Quebra de página para a quarta página -->
<div style="page-break-after: always;"></div>

<!-- Cabeçalho da segunda página -->
@include('relatorios.includes.rel_header', ['titulo' => 'PEDIDO DE INSERÇÃO', 'doc' => 'PI', 'num' => $num, 'via' => 'Financeiro'])

<!-- Conteúdo da segunda página -->
@include('relatorios.pi.components.informacoes_contratuais')
