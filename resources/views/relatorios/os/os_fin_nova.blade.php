<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}">
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}">

<style>
    @page { margin: 10px; }
    .page-number { position: fixed; bottom: 10px; right: 10px; font-size: 12px; }
    .page-number:after { content: "página " counter(page) " de 2"; }
    .page-break { page-break-before: always; }
</style>

@php
    $num = str_pad($os->id ?? 0, 4, '0', STR_PAD_LEFT);
@endphp

<div class="page-number"></div>

@include('relatorios.includes.rel_header', ['titulo' => 'ORDEM DE SERVIÇO', 'doc' => 'OS', 'num' => $num, 'via' => 'Financeiro'])

@include('relatorios.pi.components.autorizacao_servico')

@include('relatorios.pi.components.descricao_servico_fin')

@include('relatorios.pi.components.totais_fin')

@include('relatorios.pi.components.assinaturas')

<div style="page-break-after: always;"></div>

@include('relatorios.includes.rel_header', ['titulo' => 'ORDEM DE SERVIÇO', 'doc' => 'OS', 'num' => $num, 'via' => 'Financeiro'])

@include('relatorios.pi.components.informacoes_contratuais')
