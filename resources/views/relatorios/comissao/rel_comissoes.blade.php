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
        content: "página " counter(page);
    }

    .page-break {
        page-break-before: always;
    }
</style>



<div class="page-number"></div>

@php
    $statusLabel = ($status_sel ?? 'todos') === 'a_receber' ? 'A RECEBER' : (($status_sel ?? 'todos') === 'recebidos' ? 'RECEBIDOS' : 'TODOS');
    $showAgenteCol = !empty($show_agente_col);
    $colCount = $showAgenteCol ? 9 : 8;
    $agenteNome = trim((string)($agente_nome ?? ''));
    $periodo = trim((string)($periodo ?? ''));
@endphp

@if (empty($grupos) || count($grupos) === 0)
    @include('relatorios.includes.rel_header', ['titulo' => 'COMISSÕES '.$statusLabel.($agenteNome ? ' - '.$agenteNome : '').($periodo ? ' - '.$periodo : ''), 'doc' => 'REL', 'num' => ''])
    <div style="margin-top: 20px; text-align: center;">
        <h4>Nenhuma comissão encontrada para os filtros selecionados.</h4>
    </div>
@endif

@foreach(($grupos ?? []) as $percent => $linhas)
    @if(!$loop->first)
        <div class="page-break"></div>
    @endif

    @include('relatorios.includes.rel_header', ['titulo' => 'COMISSÕES '.$statusLabel.($agenteNome ? ' - '.$agenteNome : '').' - '.$percent.($periodo ? ' - '.$periodo : ''), 'doc' => 'REL', 'num' => ''])

    <div style="margin-top: -1.7%;">
        <table class="table table-striped table-bordered">
            <thead>
                @if(isset($totais) && $loop->first)
                    <tr>
                        <th colspan="{{ $showAgenteCol ? 5 : 4 }}" class="text-end small" style="font-weight: 800; font-size: 14px;">
                            Recebidos:
                        </th>
                        <th colspan="1" class="text-start small" style="font-weight: 800; font-size: 14px;">
                            {{ formataCash($totais['recebidos'] ?? 0) }}
                        </th>
                        <th colspan="{{ $showAgenteCol ? 2 : 2 }}" class="text-end small" style="font-weight: 800; font-size: 14px;">
                            A Receber:
                        </th>
                        <th colspan="1" class="text-start small" style="font-weight: 800; font-size: 14px;">
                            {{ formataCash($totais['a_receber'] ?? 0) }}
                        </th>
                    </tr>
                @endif
                <tr class="thead-dark">
                    <th class="text-center small">PI</th>
                    <th class="text-center small">Parcela</th>
                    <th class="text-center small">Cliente</th>
                    @if($showAgenteCol)
                        <th class="text-center small">Agente</th>
                    @endif
                    <th class="text-center small">Vencimento</th>
                    <th class="text-center small">Pagamento</th>
                    <th class="text-center small">Valor da Parcela</th>
                    <th class="text-center small">Valor da Comissão</th>
                    <th class="text-center small">Tipo (Serviço)</th>
                </tr>
            </thead>
            <tbody>
                @php $totalGrupo = 0; @endphp
                @foreach($linhas as $l)
                    @php $totalGrupo += (float)($l['valor_comissao'] ?? 0); @endphp
                    <tr>
                        <td class="text-center small">PI nº {{ $l['pi'] ?? '' }}</td>
                        <td class="text-center small">{{ $l['parcela'] ?? '' }}</td>
                        <td class="text-center small">{{ $l['cliente'] ?? '' }}</td>
                        @if($showAgenteCol)
                            <td class="text-center small">{{ $l['agente'] ?? '' }}</td>
                        @endif
                        <td class="text-center small">{{ !empty($l['vencimento']) ? formataDataCompleta($l['vencimento']) : (!empty($l['data_pagamento']) ? formataDataCompleta($l['data_pagamento']) : '—') }}</td>
                        <td class="text-center small">{{ !empty($l['data_pagamento_real']) ? formataDataCompleta($l['data_pagamento_real']) : ( (!empty($l['data_pagamento']) && (!empty($l['vencimento']))) ? formataDataCompleta($l['data_pagamento']) : '—') }}</td>
                        <td class="text-center small">{{ isset($l['valor_parcela']) ? formataCash($l['valor_parcela']) : '—' }}</td>
                        <td class="text-center small">{{ formataCash($l['valor_comissao'] ?? 0) }}</td>
                        <td class="text-center small">{{ $l['tipo'] ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="{{ $showAgenteCol ? 7 : 6 }}" class="small text-end" style="font-weight: 800; font-size: 14px">
                        Total Comissão ({{ $percent }}):
                    </td>
                    <td class="text-center small" style="font-weight: 800; font-size: 14px">
                        {{ formataCash($totalGrupo) }}
                    </td>
                    <td colspan="2"></td>
                </tr>
            </tfoot>
        </table>
    </div>
@endforeach
