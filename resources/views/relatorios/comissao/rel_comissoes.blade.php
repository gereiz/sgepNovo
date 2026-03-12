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

@include('relatorios.includes.rel_header', ['titulo' => 'RELATÓRIO COMISSÕES', 'doc' => 'REL', 'num' => ''])

<div style="margin-top: -1.7%;">
    <table class="table table-striped table-bordered">
    <thead>
        <tr class="text-center">
            <th colspan="12">
                {{-- <h5 class="text-center mt-5">Bi-semana: </h5> --}}
            </th>
        </tr>
        @if(isset($totais))
        <tr>
            <th colspan="6" class="text-end small" style="font-weight: 800; font-size: 14px;">
                Recebidos:
            </th>
            <th colspan="2" class="text-start small" style="font-weight: 800; font-size: 14px;">
                {{ formataCash($totais['recebidos'] ?? 0) }}
            </th>
            <th colspan="2" class="text-end small" style="font-weight: 800; font-size: 14px;">
                A Receber:
            </th>
            <th colspan="2" class="text-start small" style="font-weight: 800; font-size: 14px;">
                {{ formataCash($totais['a_receber'] ?? 0) }}
            </th>
        </tr>
        @endif
    </thead>

    <tbody>
        <tr class="thead-dark">
            <th colspan="4" class="text-center small">Agente</th>
            <th colspan="2" class="text-center small">Comissão</th>
            <th colspan="3" class="text-center small">PI</th>
            <th colspan="3" class="text-center small">Data Venda</th>
        </tr>

        @php
            $totalComissao = 0;
        @endphp

        @foreach ($comissoes as $comissao)
        <tr>
            @foreach ($agentes as $agente)
                @if($agente['id'] == $comissao['agente_id'])
                    <td colspan="4" class="text-center small">{{ $agente['nome_fantasia'] ?? $agente['razao_social'] ?? '' }}</td>
                @endif
            @endforeach

            @php
                $totalComissao += $comissao['valor_comissao'];
            @endphp
            <th colspan="2" class="text-center small">{{ formataCash($comissao['valor_comissao']) }}</th>

            @if(isset($agrupar) && $agrupar)
                <th colspan="3" class="text-center small">—</th>
            @else
                @foreach ($pis as $pi)
                    @if($pi['id'] == $comissao['pi_id'])
                        <th colspan="3" class="text-center small">PI nº {{ $pi['id'] }}</th>
                    @endif
                @endforeach
            @endif

            <th colspan="3" class="text-center small">{{ isset($agrupar) && $agrupar ? formataDataCompleta($comissao['created_at']) : formataDataCompleta($comissao['created_at']) }}</th>
        </tr>
        @endforeach
    </tbody>

    <tfoot>
        <tr>
            <td colspan="6" class="small text-end" style="font-weight: 800; font-size: 16px">
                Total Comissões do Período:
            </td>
            <td colspan="1"></td>
            <td colspan="2" class="text-center small" style="font-weight: 800; font-size: 16px">
                {{ formataCash($totalComissao) }}
            </td>
        </tr>
    </tfoot>
</table>

</div>
