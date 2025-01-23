<div class="w-full">
    <div class="w-full flex items-end justify-end mt-2">
        <p class="me-2 text-sm">{{$dt_atual}}</p>
    </div>
    <table class="w-full mt-2 border-collapse">
        <thead class="w-full border-2">
            <tr class="text-center text-md text-gray-800">
                <td class="w-10/12 italic font-medium">AUTORIZAÇÃO DE SERVIÇO</td>
            </tr>
        </thead>
        <tbody class="w-full">
             <tr class="w-full flex text-sm text-gray-800 ">
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Razão Social</td>
                <td class="w-[30%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$cliente->razao_social}}</td>
                <td class="w-[11%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Nome Fantasia</td>
                <td class="w-[30%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$cliente->nome_fantasia}}</td>
                <td class="w-[5%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">CNPJ</td>
                <td class="w-[14%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{formatCpfCnpj($cliente->cpf_cnpj)}}</td>
            </tr>

            <tr class="w-full flex text-sm text-gray-800">
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Endereço</td>
                <td class="w-[48%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$cliente->endereco ." nº ". $cliente->num. " Bairro: ". $bairro->nome}}</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Insc. Estadual</td>
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$cliente->nro_insc}}</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Insc. Municipal</td>
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">---</td>
            </tr>

            <tr class="w-full flex text-sm text-gray-800">
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Cidade</td>
                <td class="w-[59%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$cidade->nome}}</td>
                <td class="w-[7%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">UF</td>
                <td class="w-[7%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$uf->sigla}}</td>
                <td class="w-[7%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">CEP</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{formatCep($cliente->cep)}}</td>
            </tr>

            <tr class="w-full flex text-sm text-gray-800">
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Telefone</td>
                <td class="w-[13%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{formatPhone($cliente->telefone)}}</td>
                <td class="w-[6%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Email</td>
                <td class="w-[30%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$cliente->email}}</td>
                <td class="w-[13%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Título Campanha</td>
                <td class="w-[30%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$campanha}}</td>
            </tr>

            <tr class="w-full flex text-sm text-gray-800">
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Contato</td>
                <td class="w-[18%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{$cliente->responsavel}}</td>
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Filiação</td>
                <td class="w-[19%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">-----</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Data de Nasc.</td>
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">-----</td>
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-bold text-xs">Tel. Contato</td>
                <td class="w-[15%] ps-2 border-2 border-l-0 border-t-0 font-light text-xs">{{formatPhone($cliente->tel_responsavel)}}</td>
            </tr>
        </tbody>


    </table>
</div>
