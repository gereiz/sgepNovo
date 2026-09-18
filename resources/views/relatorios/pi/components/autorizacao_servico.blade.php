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
                        <th class="text-center font-italic py-0" colspan="6" style="border-bottom: 1px solid #cfcfcf; font-size: 12px; padding: 1px 4px;">AGÊNCIA / VEÍCULO</th>
                    </tr>
                </table>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="width: 50%; vertical-align: top; padding: 0; border: 1px solid #cfcfcf;">
                <!-- Coluna do Cliente -->
                @php
                    $_cliNome = '';
                    if (is_object($cliente)) {
                        $_cliNome = trim((string)($cliente->nome_fantasia ?? '')) !== ''
                            ? ($cliente->nome_fantasia ?? '')
                            : ($cliente->razao_social ?? '');
                    }
                    $_cliCpfCnpj = is_object($cliente) ? (string)($cliente->cpf_cnpj ?? '') : '';
                    $_cliCnpjOk = strlen($_cliCpfCnpj) === 14;
                @endphp
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CLIENTE:</td>
                        <td style="width: 88%; font-size: 11px; padding: 2px 4px;" colspan="3">{{$_cliNome}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CNPJ:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_cliCnpjOk ? formatCpfCnpj($_cliCpfCnpj) : "***.***.***--"}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">I.E.:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{is_object($cliente) ? ($cliente->nro_insc ?? '') : ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">ENDEREÇO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{is_object($cliente) ? ($cliente->endereco ?? '') : ''}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">Nº:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{is_object($cliente) ? ($cliente->num ?? '') : ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">BAIRRO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{isset($bairro->nome) ? $bairro->nome : ''}}</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px; font-weight: bold;">COMPLEMENTO:</td>
                        <td style="width: 20%; font-size: 11px; padding: 2px 4px;">{{is_object($cliente) ? ($cliente->complemento ?? '') : ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CIDADE:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{isset($cidade->nome) ? $cidade->nome : ''}} - {{isset($uf->sigla) ? $uf->sigla : ''}}</td>
                        <td style="width: 5%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CEP:</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px;">{{is_object($cliente) && trim((string)($cliente->cep ?? '')) !== '' ? formatCep($cliente->cep) : "**.***-***"}}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 0; border: 1px solid #cfcfcf;">
                <!-- Coluna do AGÊNCIA / VEÍCULO (Parceiros) -->
                @php
                    $_ag = isset($agentes[0]) && is_object($agentes[0]) ? $agentes[0] : null;
                    $_agCpfCnpj = (string)($_ag->cpf_cnpj ?? '');
                    $_agCnpjOk = strlen($_agCpfCnpj) === 14;
                @endphp
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CLIENTE:</td>
                        <td style="width: 88%; font-size: 11px; padding: 2px 4px;" colspan="3">{{$_ag ? (($_ag->nome_fantasia ?? '') !== '' ? $_ag->nome_fantasia : ($_ag->razao_social ?? '')) : ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CNPJ:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_agCnpjOk ? formatCpfCnpj($_agCpfCnpj) : "***.***.***--"}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">I.E.:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{$_ag->nro_insc ?? ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">ENDEREÇO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_agCnpjOk ? ($_ag->endereco ?? '') : "*******************"}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">Nº:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{$_agCnpjOk ? ($_ag->num ?? '') : "*****"}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">BAIRRO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_agCnpjOk ? (isset($bairro->nome) ? $bairro->nome : '') : "*******************"}}</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px; font-weight: bold;">COMPLEMENTO:</td>
                        <td style="width: 20%; font-size: 11px; padding: 2px 4px;">{{$_agCnpjOk ? ($_ag->complemento ?? '') : "*****"}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CIDADE:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{isset($cidade->nome) ? $cidade->nome : ''}} - {{isset($uf->sigla) ? $uf->sigla : ''}}</td>
                        <td style="width: 5%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CEP:</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px;">{{$_agCnpjOk ? formatCep($_agCpfCnpj ?? '') : "**.***-***"}}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>
