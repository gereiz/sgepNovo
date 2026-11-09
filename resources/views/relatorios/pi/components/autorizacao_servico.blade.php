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

                    $_cliBairroNome = isset($bairro->nome) ? $bairro->nome : '';
                    if (empty($_cliBairroNome) && is_object($cliente) && !empty($cliente->bairro)) {
                        if (is_numeric($cliente->bairro)) {
                            $b = \App\Models\Enderecos\Bairro::find((int)$cliente->bairro);
                            $_cliBairroNome = $b ? $b->nome : '';
                        } else {
                            $_cliBairroNome = (string)$cliente->bairro;
                        }
                    }

                    $_cliCidadeNome = isset($cidade->nome) ? $cidade->nome : '';
                    if (empty($_cliCidadeNome) && is_object($cliente) && !empty($cliente->cidade)) {
                        if (is_numeric($cliente->cidade)) {
                            $c = \App\Models\Enderecos\Cidade::find((int)$cliente->cidade);
                            $_cliCidadeNome = $c ? $c->nome : '';
                        } else {
                            $_cliCidadeNome = (string)$cliente->cidade;
                        }
                    }

                    $_cliUfSigla = isset($uf->sigla) ? $uf->sigla : '';
                    if (empty($_cliUfSigla) && is_object($cliente) && !empty($cliente->uf)) {
                        if (is_numeric($cliente->uf)) {
                            $u = \App\Models\Enderecos\UF::find((int)$cliente->uf);
                            $_cliUfSigla = $u ? $u->sigla : '';
                        } else {
                            $_cliUfSigla = (string)$cliente->uf;
                        }
                    }
                    $_cliCidadeUf = trim($_cliCidadeNome . ($_cliUfSigla ? ' - ' . $_cliUfSigla : ''));
                @endphp
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CLIENTE:</td>
                        <td style="width: 88%; font-size: 11px; padding: 2px 4px;" colspan="3">{{$_cliNome}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CNPJ:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{is_object($cliente) && !empty($cliente->cpf_cnpj) ? formatCpfCnpj($cliente->cpf_cnpj) : ''}}</td>
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
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_cliBairroNome}}</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px; font-weight: bold;">COMPLEMENTO:</td>
                        <td style="width: 20%; font-size: 11px; padding: 2px 4px;">{{is_object($cliente) ? ($cliente->complemento ?? '') : ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CIDADE:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_cliCidadeUf}}</td>
                        <td style="width: 5%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CEP:</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px;">{{is_object($cliente) && trim((string)($cliente->cep ?? '')) !== '' ? formatCep($cliente->cep) : "**.***-***"}}</td>
                    </tr>
                </table>
            </td>
            <td style="width: 50%; vertical-align: top; padding: 0; border: 1px solid #cfcfcf;">
                <!-- Coluna do AGÊNCIA / VEÍCULO (Parceiros) -->
                @php
                    $_ag = null;
                    if (!empty($agentes) && is_array($agentes)) {
                        foreach ($agentes as $a) {
                            if (!is_object($a)) continue;
                            if (isset($a->pessoa_tipo_real) && $a->pessoa_tipo_real === 'cliente') {
                                $_ag = $a;
                                break;
                            }
                            if ($a instanceof \App\Models\Clientes\Cliente || (isset($a->agent) && (int)$a->agent === 1)) {
                                $_ag = $a;
                                break;
                            }
                        }
                        if (!$_ag && isset($agentes[0]) && is_object($agentes[0])) {
                            $_ag = $agentes[0];
                        }
                    }

                    if ($_ag) {
                        $agClienteId = null;
                        if (!empty($_ag->pessoa_id_real) && ($_ag->pessoa_tipo_real ?? '') === 'cliente') {
                            $agClienteId = (int)$_ag->pessoa_id_real;
                        } elseif (!empty($_ag->id) && (int)$_ag->id < 1000000) {
                            $agClienteId = (int)$_ag->id;
                        }
                        if ($agClienteId) {
                            $realAgCli = \App\Models\Clientes\Cliente::find($agClienteId);
                            if ($realAgCli) {
                                foreach (['cpf_cnpj', 'nro_insc', 'endereco', 'num', 'bairro', 'cidade', 'uf', 'complemento', 'cep', 'nome_fantasia', 'razao_social'] as $fld) {
                                    if ((empty($_ag->$fld) || (string)$_ag->$fld === '') && !empty($realAgCli->$fld)) {
                                        $_ag->$fld = $realAgCli->$fld;
                                    }
                                }
                            }
                        }
                    }

                    $_agNome = '';
                    if ($_ag) {
                        $_agNome = trim((string)($_ag->nome_fantasia ?? '')) !== ''
                            ? $_ag->nome_fantasia
                            : ($_ag->razao_social ?? ($_ag->nome ?? ''));
                    }

                    $_agCpfCnpj = (string)($_ag->cpf_cnpj ?? '');
                    $_agCpfCnpjDigits = preg_replace('/\D/', '', $_agCpfCnpj);
                    $_agHasDados = $_ag && (strlen($_agCpfCnpjDigits) === 14 || strlen($_agCpfCnpjDigits) === 11 || !empty($_ag->endereco) || !empty($_ag->bairro) || !empty($_ag->cidade));

                    // Resolve bairro da agência
                    $_agBairroNome = '';
                    if ($_ag && !empty($_ag->bairro)) {
                        if (is_numeric($_ag->bairro)) {
                            $bObj = \App\Models\Enderecos\Bairro::find((int)$_ag->bairro);
                            $_agBairroNome = $bObj ? $bObj->nome : '';
                        } else {
                            $_agBairroNome = (string)$_ag->bairro;
                        }
                    }

                    // Resolve cidade da agência
                    $_agCidadeNome = '';
                    if ($_ag && !empty($_ag->cidade)) {
                        if (is_numeric($_ag->cidade)) {
                            $cObj = \App\Models\Enderecos\Cidade::find((int)$_ag->cidade);
                            $_agCidadeNome = $cObj ? $cObj->nome : '';
                        } else {
                            $_agCidadeNome = (string)$_ag->cidade;
                        }
                    }

                    // Resolve UF da agência
                    $_agUfSigla = '';
                    if ($_ag && !empty($_ag->uf)) {
                        if (is_numeric($_ag->uf)) {
                            $uObj = \App\Models\Enderecos\UF::find((int)$_ag->uf);
                            $_agUfSigla = $uObj ? $uObj->sigla : '';
                        } else {
                            $_agUfSigla = (string)$_ag->uf;
                        }
                    }
                    $_agCidadeUf = trim($_agCidadeNome . ($_agUfSigla ? ' - ' . $_agUfSigla : ''));
                @endphp
                <table style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CLIENTE:</td>
                        <td style="width: 88%; font-size: 11px; padding: 2px 4px;" colspan="3">{{$_agNome}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CNPJ:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_ag && $_agCpfCnpj !== '' ? formatCpfCnpj($_agCpfCnpj) : "***.***.***--"}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">I.E.:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{$_ag->nro_insc ?? ''}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">ENDEREÇO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_agHasDados ? ($_ag->endereco ?? '') : "*******************"}}</td>
                        <td style="width: 8%; font-size: 11px; padding: 2px 4px; font-weight: bold;">Nº:</td>
                        <td style="width: 22%; font-size: 11px; padding: 2px 4px;">{{$_agHasDados ? ($_ag->num ?? '') : "*****"}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">BAIRRO:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_agHasDados ? $_agBairroNome : "*******************"}}</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px; font-weight: bold;">COMPLEMENTO:</td>
                        <td style="width: 20%; font-size: 11px; padding: 2px 4px;">{{$_agHasDados ? ($_ag->complemento ?? '') : "*****"}}</td>
                    </tr>
                    <tr>
                        <td style="width: 12%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CIDADE:</td>
                        <td style="width: 58%; font-size: 11px; padding: 2px 4px;">{{$_agHasDados ? $_agCidadeUf : "*******************"}}</td>
                        <td style="width: 5%; font-size: 11px; padding: 2px 4px; font-weight: bold;">CEP:</td>
                        <td style="width: 10%; font-size: 11px; padding: 2px 4px;">{{$_agHasDados && trim((string)($_ag->cep ?? '')) !== '' ? formatCep($_ag->cep) : "**.***-***"}}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>
