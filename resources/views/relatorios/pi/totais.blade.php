<table class="w-full mt-6 border-collapse">
    <thead class="w-full border-2">
        <tr class="w-full flex text-sm text-gray-800 border-2 border-t-0">
            <td class="w-[9%] font-semibold ps-1">TOTAIS:</td>
            @foreach ($servicos as $serv)
                <td class="w-[20%] -ms-6">{{$serv['nome']}} => {{formataCash($serv['vlr_total'])}}</td>
            @endforeach
            
            
            <td class="w-[9%] font-semibold">Corretor:</td>
            <td class="w-1/12 -ms-6">{{$vendedor}}</td>
            
            
        </tr>

        <tr class="w-full flex text-sm text-gray-800 border-2 border-y-0">
            <td class="w-[13%] font-semibold ps-1">Faturar sobre:</td>
            <td class="w-[15%] -ms-6">
                @if($faturamento['faturar_sobre'] == '1')
                    Vlr Bruto
                @elseif($faturamento['faturar_sobre'] == '2')
                    Vlr Liquido
                @endif
            </td>
            
            
            <td class="w-[13%] font-semibold">Faturar contra:</td>
            <td class="w-[15%] -ms-6">
                @if($faturamento['faturar_contra'] == '1')
                    Cliente
                @elseif($faturamento['faturar_contra'] == '2')
                    Agência
                @endif
            </td>
            
            <td class="w-[14%] font-semibold">Enviar Faturamento:</td>
            <td class="w-[15%] ">
                @if($faturamento['enviar_faturamento'] == '1')
                    Cliente
                @elseif($faturamento['faturar_contra'] == '2')
                    Agência
                @endif
            </td>
        </tr>
    </thead>

</table>

<div class="w-full mt-2 ms-1">
    <p>OBSERVAÇÕES</p>

    <hr class=" mt-8 border-b border-gray-300">
</div>