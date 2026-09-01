<link rel="stylesheet" href="{{ public_path('assets/vendor/css/rtl/bootstrap.css') }}">
<link rel="stylesheet" href="{{ public_path('assets/css/relatorios.css') }}">

<style>
    .fin-table td,
    .fin-table th { font-size: 10px; padding: 3px 4px; }
    .badge-status { display: inline-block; padding: 1px 5px; border-radius: 4px; font-size: 9px; line-height: 1.4; color: #fff; font-weight: bold; }
    .badge-led { background: #2563eb; color: #fff; padding: 1px 5px; border-radius: 3px; font-size: 9px; font-weight: bold; }
</style>

@php
    function fmtDataLed($d) { return $d ? \Carbon\Carbon::parse($d)->format('d/m/Y') : '—'; }
    function fmtValorLed($v) { return 'R$ '.number_format((float)($v ?? 0), 2, ',', '.'); }
    function statusContratoCor($s) {
        $map = [
            'normal'    => ['bg' => '#22c55e', 'label' => 'Normal'],
            'proximo'   => ['bg' => '#f59e0b', 'label' => 'Próximo do Término'],
            'hoje'      => ['bg' => '#f59e0b', 'label' => 'Vencendo Hoje'],
            'encerrado' => ['bg' => '#ef4444', 'label' => 'Encerrado'],
        ];
        return $map[$s] ?? $map['normal'];
    }
@endphp

@include('relatorios.includes.rel_header', [
    'titulo' => $titulo ?? 'RELATÓRIO DE RESERVAS DE LEDs',
    'doc'    => 'LED',
    'num'    => '',
    'via'    => ''
])

<table class="table fin-table" style="border-collapse: collapse; width: 100%; margin-top: 6px; border: 1px solid #cfcfcf;">
    <thead>
        <tr style="background: #e6e6e6;">
            <th colspan="9" class="text-center font-italic" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                Emissão: {{ $dtEmissao ?? now()->format('d/m/Y H:i') }}
            </th>
        </tr>
        @if (!empty($filtroAplicado))
        <tr style="background: #f5f5f5;">
            <th colspan="9" style="border:1px solid #cfcfcf; font-size: 10px; padding: 2px 4px;">
                <strong>Filtros:</strong> {{ implode(' • ', $filtroAplicado) }}
            </th>
        </tr>
        @endif
        <tr style="background: #d9e2ec;">
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 6%;">LED</th>
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 18%;">Cliente</th>
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 14%;">Campanha</th>
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 7%;">Bi-semana</th>
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 14%;">Período</th>
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 7%;">PI</th>
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 10%; text-align: right;">Valor PI</th>
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 7%; text-align: center;">Pago</th>
            <th style="border:1px solid #cfcfcf; padding: 3px 4px; width: 17%;">Status Contrato</th>
        </tr>
    </thead>
    <tbody>
        @php
            $reservas = $result['reservas'] ?? [];
            $totalValor = 0;
        @endphp

        @if (empty($reservas))
            <tr>
                <td colspan="9" style="border:1px solid #cfcfcf; padding: 30px; text-align: center; color: #888;">
                    Nenhuma reserva de LED encontrada no período selecionado.
                </td>
            </tr>
        @else
            @foreach ($reservas as $r)
                @php
                    $st = $r['status_contrato'] ?? [];
                    $stInfo = statusContratoCor($st['status'] ?? 'normal');
                    $totalValor += (float)($r['vl_total_pi'] ?? 0);
                @endphp
                <tr>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px;">
                        <span class="badge-led">LED</span>
                        <strong style="margin-left: 4px;">{{ $r['painel_ident'] ?? '—' }}</strong>
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px;">
                        {{ $r['cliente_nome'] ?? '—' }}
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px;">
                        {{ $r['campanha'] ?? '—' }}
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px; text-align: center;">
                        <strong>BS {{ $r['num_bisemana'] ?? '—' }}</strong>
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px; font-size: 9px;">
                        <div>Início: {{ fmtDataLed($r['bisemana_ini'] ?? null) }}</div>
                        <div>Fim:    {{ fmtDataLed($r['bisemana_fim'] ?? null) }}</div>
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px; text-align: center;">
                        @if (!empty($r['pi_ok']) && !empty($r['pi_id']))
                            <span class="badge-status" style="background: #22c55e;">PI #{{ $r['pi_id'] }}</span>
                        @else
                            <span style="color: #888; font-size: 9px;">Sem PI</span>
                        @endif
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px; text-align: right;">
                        {{ fmtValorLed($r['vl_total_pi'] ?? 0) }}
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px; text-align: center;">
                        @if (!empty($r['pago']))
                            <span class="badge-status" style="background: #22c55e;">Sim</span>
                        @else
                            <span style="color: #888; font-size: 9px;">Não</span>
                        @endif
                    </td>
                    <td style="border:1px solid #cfcfcf; padding: 3px 4px;">
                        <span class="badge-status" style="background: {{ $stInfo['bg'] }};">
                            {{ $st['label'] ?? $stInfo['label'] }}
                        </span>
                        @if (!empty($st['dias_restantes']) && $st['status'] !== 'normal')
                            <div style="font-size: 9px; margin-top: 2px; color: #555;">
                                Data fim: {{ $st['data_fim'] ?? '' }}
                            </div>
                        @endif
                    </td>
                </tr>
            @endforeach
        @endif
    </tbody>
    <tfoot>
        <tr style="background: #d9e2ec; font-weight: bold;">
            <td colspan="6" style="border:1px solid #cfcfcf; padding: 3px 4px; text-align: right;">
                TOTAL GERAL:
            </td>
            <td style="border:1px solid #cfcfcf; padding: 3px 4px; text-align: right;">
                {{ fmtValorLed($result['valor_total'] ?? $totalValor) }}
            </td>
            <td style="border:1px solid #cfcfcf; padding: 3px 4px; text-align: center;" colspan="2">
                {{ count($reservas) }} reserva(s)
            </td>
        </tr>
    </tfoot>
</table>
