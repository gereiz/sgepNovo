<div class="w-full">
    <table class="w-full mt-6 border-collapse">
        <thead class="w-full border-2">
            <tr class="text-center text-md text-gray-800">
                <td class="w-10/12 italic font-medium">DESCRIÇÃO DOS SERVIÇOS</td>
            </tr>
        </thead>
        <tbody class="w-full">
             <tr class="w-full flex text-sm text-gray-800 ">
                <td class="w-[14%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Ident. do Serviço</td>
                <td class="w-[5%] border-2 border-l-0 border-t-0 font-bold text-xs">Quant.</td>
                <td class="w-[28%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Detalhes</td>
                <td class="w-[15%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Período</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Pagamento</td>
                <td class="w-[9%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Vlr Bruto</td>
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Vlr Desc.</td>
                <td class="w-[9%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Vlr Liquido</td>
            </tr>

            @foreach ($servicos as $serv)
                <tr class="w-full flex text-sm text-gray-800">
                    <td class="w-[14%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$serv['nome']}}</td>
                    <td class="w-[5%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$serv['quantidade']}}</td>
                    <td class="w-[28%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$serv['detalhes']}}</td>
                    <td class="w-[15%] ps-2 border-2 border-l-0 border-t-0 text-xs">{{$bs_formated}}</td>
                    <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">
                        @if($forma_pagamento == '1')
                            AV. Dinheiro
                        @elseif($forma_pagamento == '2')
                            AV. PIX
                        @elseif($forma_pagamento == '3')
                            Cartão
                        @elseif($forma_pagamento == '4')
                            Boleto
                        @elseif($forma_pagamento == '5')
                            Depoósito
                        @endif
                    </td>
                    <td class="w-[9%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{formataCash($serv['vlr_unit'] * $serv['quantidade'])}}</td>
                    <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{formataCash($serv['vlr_desc'] * $serv['quantidade'])}}</td>
                    <td class="w-[9%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{formataCash($serv['vlr_total'])}}</td>
                </tr>
            @endforeach

        </tbody>


    </table>
</div>
