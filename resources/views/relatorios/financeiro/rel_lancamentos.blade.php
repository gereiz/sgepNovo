<link rel="stylesheet" href="{{ public_path('assets/vendor/css/rtl/bootstrap.css') }}">
<link rel="stylesheet" href="{{ public_path('assets/css/relatorios.css') }}">

<style>
    .fin-table td,
    .fin-table th { font-size: 10px; padding: 2px 3px; }
    .badge-status { display: inline-block; padding: 1px 4px; border-radius: 4px; font-size: 9px; line-height: 1; }
</style>

@php
    function fmtData($d) { return $d ? \Carbon\Carbon::parse($d)->format('d/m/Y') : ''; }
    function fmtValor($v) { return 'R$ '.number_format((float)$v, 2, ',', '.'); }
@endphp

@include('relatorios.includes.rel_header', ['titulo' => $titulo ?? 'RELATÓRIO DE LANÇAMENTOS', 'doc' => 'LAN', 'num' => '', 'via' => ''])

<table class="table fin-table" style="border-collapse: collapse; width: 100%; margin-top: 6px; border: 1px solid #cfcfcf;">
    <thead>
        <tr style="background: #e6e6e6;">
            <th colspan="{{ !empty($modo_pi) ? 8 : 9 }}" class="text-center font-italic py-0" style="border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">
                Data do Relatório: {{ $dt_atual }}
            </th>
        </tr>
        @if (!empty($modo_pi))
            <tr>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">PI</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Parcela</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Emissão</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Cliente</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Agente</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Valor</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Vencimento</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Status</th>
            </tr>
        @else
            <tr>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Data</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Valor</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Parcela</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Tipo</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Status</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Centro de Custo</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px; width: 8%;">Origem</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px;">Descrição</th>
                <th style="border:1px solid #cfcfcf; padding: 2px 3px; width: 20%;">OBS</th>
            </tr>
        @endif
    </thead>
    <tbody>
        @if (!empty($modo_pi))
            @foreach ($lancamentos as $l)
                <tr>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->pi_id ?? '' }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->parcelas ?? '' }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ fmtData($l->emissao ?? null) }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->cliente ?? '' }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->agente ?? '—' }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ fmtValor($l->valor ?? 0) }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ fmtData($l->vencimento ?? null) }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">
                        <span class="badge-status" style="background: #f59e0b; color: #fff;">
                            A RECEBER
                        </span>
                    </td>
                </tr>
            @endforeach
        @else
            @foreach ($lancamentos as $l)
                @php
                    $desc = $l->descricao ?? '';
                    $origem = (strpos($desc, 'PI nº ') === 0) ? 'PI' : ((strpos($desc, 'OS nº ') === 0) ? 'OS' : 'Manual');
                    $status = $l->status_pagamento ?? 'PENDENTE';
                    $statusColor = $status === 'QUITADO' ? '#22c55e' : '#f59e0b';
                @endphp
                <tr>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ fmtData($l->dt_faturamento) }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ fmtValor($l->valor) }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->parcelas }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->tipoLancamento->tipo ?? '' }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">
                        <span class="badge-status" style="background: {{ $statusColor }}; color: #fff;">
                            {{ $status }}
                        </span>
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->centroCusto->centro_custo ?? '' }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $origem }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->descricao }}</td>
                    <td style="border:1px solid #cfcfcf; padding: 2px 3px;">{{ $l->observacoes }}</td>
                </tr>
            @endforeach
        @endif
    </tbody>
</table>
