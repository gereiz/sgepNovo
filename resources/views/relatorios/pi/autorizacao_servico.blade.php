<div class="w-full">
    <div class="w-full flex items-end justify-end mt-2">
        <p class="me-2 text-sm">01/01/2024</p>
    </div>
    <table class="w-full mt-2 border-collapse">
        <thead class="w-full border-2">
            <tr class="text-center text-lg text-gray-800">
                <td class="w-10/12 italic">AUTORIZAÇÃO DE SERVIÇO</td>
            </tr>
        </thead>
        <tbody class="w-full">
             <tr class="w-full flex text-sm text-gray-800 ">
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-bold">Razão Social</td>
                <td class="w-[30%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$cliente->razao_social}}</td>
                <td class="w-[11%] ps-2 border-2 border-l-0 border-t-0 font-bold">Nome Fantasia</td>
                <td class="w-[30%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$cliente->nome_fantasia}}</td>
                <td class="w-[5%] ps-2 border-2 border-l-0 border-t-0 font-bold">CNPJ</td>
                <td class="w-[14%] ps-2 border-2 border-l-0 border-t-0 font-light">{{formatCpfCnpj($cliente->cpf_cnpj)}}</td>
            </tr>

            <tr class="w-full flex text-sm text-gray-800">
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold">Endereço</td>
                <td class="w-[48%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$cliente->endereco ." nº ". $cliente->num. " Bairro: ". $bairro->nome}}</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-bold">Insc. Estadual</td>
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$cliente->nro_insc}}</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-bold">Insc. Municipal</td>
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-light">---</td>
            </tr>

            <tr class="w-full flex text-sm text-gray-800">
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold">Cidade</td>
                <td class="w-[59%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$cidade->nome}}</td>
                <td class="w-[7%] ps-2 border-2 border-l-0 border-t-0 font-bold">UF</td>
                <td class="w-[7%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$uf->sigla}}</td>
                <td class="w-[7%] ps-2 border-2 border-l-0 border-t-0 font-bold">CEP</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-light">{{formatCep($cliente->cep)}}</td>
            </tr>

            <tr class="w-full flex text-sm text-gray-800">
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold">Telefone</td>
                <td class="w-[13%] ps-2 border-2 border-l-0 border-t-0 font-light">{{formatPhone($cliente->telefone)}}</td>
                <td class="w-[6%] ps-2 border-2 border-l-0 border-t-0 font-bold">Email</td>
                <td class="w-[20%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$cliente->email}}</td>
                <td class="w-[15%] ps-2 border-2 border-l-0 border-t-0 font-bold">Título Campanha</td>
                <td class="w-[38%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$campanha}}</td>
            </tr>

            <tr class="w-full flex text-sm text-gray-800">
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold">Contato</td>
                <td class="w-[18%] ps-2 border-2 border-l-0 border-t-0 font-light">{{$cliente->responsavel}}</td>
                <td class="w-[8%] ps-2 border-2 border-l-0 border-t-0 font-bold">Filiação</td>
                <td class="w-[19%] ps-2 border-2 border-l-0 border-t-0 font-light">-----</td>
                <td class="w-[12%] ps-2 border-2 border-l-0 border-t-0 font-bold">Data de Nasc.</td>
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-light">-----</td>
                <td class="w-[10%] ps-2 border-2 border-l-0 border-t-0 font-bold">Tel. Contato</td>
                <td class="w-[15%] ps-2 border-2 border-l-0 border-t-0 font-light">{{formatPhone($cliente->tel_responsavel)}}</td>
            </tr>
        </tbody>


    </table>
</div>