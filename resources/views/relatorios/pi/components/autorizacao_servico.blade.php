<table class="table" style="border-collapse: collapse; width: 100%;">
    <thead> 
        <tr>
            <th style="width: 50%; border: 1px solid #cfcfcf; padding: 0;">
                <table style="border-collapse: collapse; width: 100%;">
                    <tr style="background: #e6e6e6;">
                        <th class="text-center font-italic py-0" colspan="6" style="border-bottom: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px;">CLIENTE</th>
                    </tr>
                </table>
            </th>
            <th style="width: 50%; border: 1px solid #cfcfcf; padding: 0;">
                <table style="border-collapse: collapse; width: 100%;">
                    <tr style="background: #e6e6e6;">
                        <th class="text-center font-italic py-0" colspan="6" style="border-bottom: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px;">AGÊNCIA</th>
                    </tr>
                </table>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="width: 50%; vertical-align: top; padding: 0; border: 1px solid #cfcfcf;">
                <!-- Coluna do Cliente -->
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 100%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">CLIENTE: </span>{{$cliente->razao_social}}</td>
                    </tr>
                    <tr>
                        <td style="width: 60%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">CNPJ: </span> {{formatCpfCnpj($cliente->cpf_cnpj)}}</td>
                        <td style="width: 40%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">I.E.: </span> {{$cliente->nro_insc}}</td>
                    </tr>
                    <tr>
                        <td style="width: 70%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">ENDEREÇO: </span>{{$cliente->endereco}}</td>
                        <td style="width: 30%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">Nº: </span>{{$cliente->num}}</td>
                    </tr>
                    <tr>
                        <td style="width: 60%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">BAIRRO: </span>{{$bairro->nome}}</td>
                        <td style="width: 40%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">COMPLEMTENTO: </span>{{$cliente->complemento ?? ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 50%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">CIDADE: </span>{{$cidade->nome}}</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">UF: </span>{{$uf->sigla}}</td>
                        <td style="width: 40%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">CEP: </span>{{formatCep($cliente->cep)}}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 0; border: 1px solid #cfcfcf;">
                <!-- Coluna do Veículo (Parceiros) -->
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 100%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">CLIENTE: </span>{{$cliente->razao_social}}</td>
                    </tr>
                    <tr>
                        <td style="width: 60%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">CNPJ: </span> {{formatCpfCnpj($cliente->cpf_cnpj)}}</td>
                        <td style="width: 40%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">I.E.: </span> {{$cliente->nro_insc}}</td>
                    </tr>
                    <tr>
                        <td style="width: 70%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">ENDEREÇO: </span>{{$cliente->endereco}}</td>
                        <td style="width: 30%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">Nº: </span>{{$cliente->num}}</td>
                    </tr>
                    <tr>
                        <td style="width: 60%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">BAIRRO: </span>{{$bairro->nome}}</td>
                        <td style="width: 40%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">COMPLEMTENTO: </span>{{$cliente->complemento ?? ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 50%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">CIDADE: </span>{{$cidade->nome}}</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">UF: </span>{{$uf->sigla}}</td>
                        <td style="width: 40%; font-size: 11px; padding: 2px 4px;"><span style="font-weight: bold;">CEP: </span>{{formatCep($cliente->cep)}}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>
