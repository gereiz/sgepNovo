<table class="table" style="border-collapse: collapse; width: 100%; margin-top: 10px; border: 1px solid #cfcfcf;">
    <tbody>
        <tr>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">TOTAL:</td>

            <td colspan="11" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                @php
                    $total = 0;
                @endphp
                @foreach ($servicos as $serv)
                    @php
                        $total += (($serv['vlr_unit'] - $serv['vlr_desc']) * $serv['quantidade']);
                    @endphp
                @endforeach
                <strong style="font-size: 12px;">{{formataCash($total)}}</strong>
            </td>

        </tr>
        <tr>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Corretor:</td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{$vendedor}}</td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Faturar sobre:</td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                @if($faturamento['faturar_sobre'] == '1')
                    Vlr Bruto
                @elseif($faturamento['faturar_sobre'] == '2')
                    Vlr Liquido
                @endif
            </td>
            <td colspan="2" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Faturar contra:</td>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                @if($faturamento['faturar_contra'] == '1')
                    Cliente
                @elseif($faturamento['faturar_contra'] == '2')
                    Agência
                @endif
            </td>
            <td colspan="2" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Enviar Faturamento:</td>
            <td colspan="3" style="border: 1px solid #cfcfcf !important; font-size: 11px; padding: 2px 4px;">
                @if($faturamento['enviar_faturamento'] == '1')
                    Cliente
                @elseif($faturamento['enviar_faturamento'] == '2')
                    Agência
                @endif
            </td>
        </tr>
        <tr>
            <td colspan="1" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">
                Outros Agentes:
            </td>
            <td colspan="11" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                @foreach(collect($agentes)->slice(1) as $agente)
                    {{ $agente->nome_fantasia ? $agente->nome_fantasia : $agente->razao_social }}
                    @if (!$loop->last) || @endif
                @endforeach
            </td>
        </tr>
    </tbody>
</table>

@if(isset($lista_lancamentos) && count($lista_lancamentos) > 0)
    <table class="table" style="border-collapse: collapse; width: 100%; margin-top: -10px; border: 1px solid #cfcfcf;">
        <tbody>
            <tr style="background: #e6e6e6;">
                <td colspan="12" class="text-center font-italic py-0" style="border: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px; font-weight: bold;">PARCELAS:</td>
            </tr>
            @php
                $totalParcelas = count($lista_lancamentos);
                $colunas = min(4, ceil($totalParcelas / 3));
                $parcelasPorColuna = min(3, ceil($totalParcelas / $colunas));
            @endphp

            @for ($i = 0; $i < $parcelasPorColuna; $i++)
                <tr>
                    @for ($j = 0; $j < $colunas; $j++)
                        @php
                            $index = $j * $parcelasPorColuna + $i;
                        @endphp
                        @if ($index < $totalParcelas)
                            <td colspan="3" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                                Parcela {{$lista_lancamentos[$index]['parcelas']}} => {{formataCash($lista_lancamentos[$index]['valor'])}} - Venc: {{formataData($lista_lancamentos[$index]['data_lancamento'])}}
                            </td>
                        @else
                            <td colspan="3" style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">&nbsp;</td>
                        @endif
                    @endfor
                </tr>
            @endfor
        </tbody>
    </table>
@endif
