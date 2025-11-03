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
                        <th class="text-center font-italic py-0" colspan="6" style="border-bottom: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px;">VEÍCULO</th>
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
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CLIENTE:</td>
                        <td style="width: 88%; font-size: 11px; padding: 2px 4px;" colspan="3">{{$cliente->razao_social}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CNPJ:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{formatCpfCnpj($cliente->cpf_cnpj)}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">I.E.:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{$cliente->nro_insc}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">ENDEREÇO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$cliente->endereco}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">Nº:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{$cliente->num}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">BAIRRO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$bairro->nome}}</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px; font-weight: bold;">COMPLEMENTO:</td>
                        <td style="width: 20%; font-size: 11px; padding: 2px 4px;">{{$cliente->complemento ?? ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CIDADE:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$cidade->nome}} - {{$uf->sigla}}</td>
                        <td style="width: 5%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CEP:</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px;">{{formatCep($cliente->cep)}}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 0; border: 1px solid #cfcfcf;">
                <!-- Coluna do Veículo (Parceiros) -->
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CLIENTE:</td>
                        <td style="width: 88%; font-size: 11px; padding: 2px 4px;" colspan="3">{{$agentes[0]->razao_social}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CNPJ:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{strlen($agentes[0]->cpf_cnpj) == 14 ? formatCpfCnpj($agentes[0]->cpf_cnpj) : "***.***.***--"}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">I.E.:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{$agentes[0]->nro_insc}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">ENDEREÇO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{strlen($agentes[0]->cpf_cnpj) == 14 ? $agentes[0]->endereco : "*******************"}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">Nº:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{strlen($agentes[0]->cpf_cnpj) == 14 ? $agentes[0]->num : "*****"}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">BAIRRO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{strlen($agentes[0]->cpf_cnpj) == 14 ? $bairro->nome : "*******************"}}</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px; font-weight: bold;">COMPLEMENTO:</td>
                        <td style="width: 20%; font-size: 11px; padding: 2px 4px;">{{strlen($agentes[0]->cpf_cnpj) == 14 ? $agentes[0]->complemento ?? '' : "*****"}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CIDADE:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$cidade->nome}} - {{$uf->sigla}}</td>
                        <td style="width: 5%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CEP:</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px;">{{strlen($agentes[0]->cpf_cnpj) == 14 ? formatCep($agentes[0]->cep) : "**.***-***"}}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>
