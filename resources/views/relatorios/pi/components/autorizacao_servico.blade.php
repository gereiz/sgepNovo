<table class="table" style="border-collapse: collapse; width: 100%;">
    <thead> 
        <tr style="background: #e6e6e6;">
            <th class="text-center font-italic py-0" colspan="6" style="border: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px;">AUTORIZAÇÃO DE SERVIÇO</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="width: 12%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Razão Social</td>
            <td style="width: 28%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{$cliente->razao_social}}</td>
            <td style="width: 12%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">Nome Fantasia</td>
            <td style="width: 18%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{$cliente->nome_fantasia}}</td>
            <td style="width: 8%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px; font-weight: bold;">CNPJ</td>
            <td style="width: 12%; border: 1px solid #cfcfcf; font-size: 11px; padding: 2px 4px;">{{formatCpfCnpj($cliente->cpf_cnpj)}}</td>
        </tr>
        <tr>
            <td style="width: 8%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">Endereço</td>
            <td style="width: 70%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;" colspan="3">{{$cliente->endereco}} nº {{$cliente->num}} Bairro: {{$bairro->nome}}</td>
            <td style="width: 10%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">Insc. Estadual</td>
            <td style="width: 12%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{$cliente->nro_insc}}</td>
        </tr>
        <tr>
            <td style="width: 8%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">Cidade</td>
            <td style="width: 32%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{$cidade->nome}}</td>
            <td style="width: 5%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">UF</td>
            <td style="width: 30%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{$uf->sigla}}</td>
            <td style="width: 10%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">CEP</td>
            <td style="width: 15%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{formatCep($cliente->cep)}}</td>
        </tr>
        <tr>
            <td style="width: 8%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">Telefone</td>
            <td style="width: 32%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{formatPhone($cliente->telefone)}}</td>
            <td style="width: 5%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">Email</td>
            <td style="width: 35%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{$cliente->email}}</td>
            <td style="width: 5%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">Campanha</td>
            <td style="width: 15%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{$campanha}}</td>
        </tr>
        <tr>
            <td style="width: 8%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">Contato</td>
            <td style="width: 32%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{$cliente->responsavel}}</td>
            <td style="width: 5%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">Tel. Contato</td>
            <td style="width: 35%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">{{formatPhone($cliente->tel_responsavel)}}</td>
            <td style="width: 5%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px; font-weight: bold;">-----</td>
            <td style="width: 15%; border: 1px solid #cfcfcf; font-size: 12px; padding: 2px 4px;">-----</td>
        </tr>

    </tbody>
</table>
