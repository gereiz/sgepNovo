<div class="w-full">
    <table class="w-full mt-6 border-collapse">
        <thead class="w-full border-2">
            <tr class="text-center text-lg text-gray-800">
                <td class="w-10/12 italic">DESCRIÇÃO DOS SERVIÇOS</td>
            </tr>
        </thead>
        <tbody class="w-full">
             <tr class="w-full flex text-sm text-gray-800 ">
                <td class="w-[14%] ps-2 border-2 border-l-0 border-t-0 font-bold">Ident. do Serviço</td>
                <td class="w-[5%] border-2 border-l-0 border-t-0 font-bold">Quant.</td>
                <td class="w-[28%] ps-2 border-2 border-l-0 border-t-0 font-bold">Detalhes</td>
                <td class="w-[15%] ps-2 border-2 border-l-0 border-t-0 font-bold">Período</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-bold">Pagamento</td>
                <td class="w-[9%] ps-2 border-2 border-l-0 border-t-0 font-bold">Vlr Bruto</td>
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold">Vlr Desc.</td>
                <td class="w-[9%] ps-2 border-2 border-l-0 border-t-0 font-bold">Vlr Liquido</td>
            </tr>

            @foreach ($servicos as $serv)
                <tr class="w-full flex text-sm text-gray-800">
                    <td class="w-[14%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$serv['nome']}}</td>
                    <td class="w-[5%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$serv['quantidade']}}</td>
                    <td class="w-[28%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$serv['detalhes']}}</td>
                    <td class="w-[15%] ps-2 border-2 border-l-0 border-t-0 text-xs">{{$bs_formated}}</td>
                    <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-light">
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
                    <td class="w-[9%] ps-2 border-2 border-l-0 border-t-0 font-light">{{formataCash($serv['vlr_unit'] * $serv['quantidade'])}}</td>
                    <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-light">{{formataCash($serv['vlr_desc'] * $serv['quantidade'])}}</td>
                    <td class="w-[9%] ps-2 border-2 border-l-0 border-t-0 font-light">{{formataCash($serv['vlr_total'])}}</td>
                </tr>
            @endforeach
          
        </tbody>


    </table>
</div>