<table class="table" style="border-collapse: collapse; width: 100%;">
    <thead>
        <tr style="background: #e6e6e6;">
            <th class="text-center font-italic py-0" colspan="8" style="border: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px;">DESCRIÇÃO DOS SERVIÇOS</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="width: 15%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Ident. do Serviço</td>
            <td style="width: 5%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Quant.</td>
            <td style="width: 25%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Especificação (Painéis)</td>
            <td style="width: 15%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Período</td>
            <td style="width: 12%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Pagamento</td>
            <td style="width: 10%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Vlr Bruto</td>
            <td style="width: 9%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Vlr Desc.</td>
            <td style="width: 9%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Vlr Liq.</td>
        </tr>
        @foreach ($servicos as $serv)
        <tr>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{$serv['nome']}}</td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{$serv['quantidade']}}</td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{implode(", ", $idPaineis)}}</td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{$bs_formated}}</td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">
                @if($forma_pagamento == '1')
                    AV. Dinheiro
                @elseif($forma_pagamento == '2')
                    AV. PIX
                @elseif($forma_pagamento == '3')
                    Cartão
                @elseif($forma_pagamento == '4')
                    Boleto
                @elseif($forma_pagamento == '5')
                    Depósito
                @endif
            </td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{formataCash($serv['vlr_unit'] * $serv['quantidade'])}}</td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{formataCash($serv['vlr_desc'] * $serv['quantidade'])}}</td>
            <td style="border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{formataCash(($serv['vlr_unit'] - $serv['vlr_desc']) * $serv['quantidade'])}}</td>
        </tr>
        @endforeach
    </tbody>
</table>
