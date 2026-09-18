<?php

//remove o 55 caso haja e formata o telefone no formato (xx) xxxx-xxxx caso tenha 8 digitos ou (xx) xxxxx-xxxx caso tenha 9 digitos
function formatPhone($phone) {
    $phone = str_replace('55', '', $phone);
    $phone = str_replace(['(', ')', ' ', '-'], '', $phone);

    if(strlen($phone) == 8) {
        $phone = '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 4) . '-' . substr($phone, 6, 4);
    } else {
        $phone = '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 5) . '-' . substr($phone, 7, 4);
    }

    return $phone;
}

// formata o CPF no formato xxx.xxx.xxx-xx ou o CNPJ no formato xx.xxx.xxx/xxxx-xx
function formatCpfCnpj($cpfCnpj) {
    if(strlen($cpfCnpj) == 11) {
        $cpfCnpj = substr($cpfCnpj, 0, 3) . '.' . substr($cpfCnpj, 3, 3) . '.' . substr($cpfCnpj, 6, 3) . '-' . substr($cpfCnpj, 9, 2);
    } else {
        $cpfCnpj = substr($cpfCnpj, 0, 2) . '.' . substr($cpfCnpj, 2, 3) . '.' . substr($cpfCnpj, 5, 3) . '/' . substr($cpfCnpj, 8, 4) . '-' . substr($cpfCnpj, 12, 2);
    }

    return $cpfCnpj;
}

// formata o cep no formato xxxxx-xxx
function formatCep($cep) {
    $cep = str_replace('-', '', $cep);
    $cep = substr($cep, 0, 5) . '-' . substr($cep, 5, 3);

    return $cep;
}

// formata o valor no formato R$ 1.000,00
function formataCash($value) {
    return 'R$ ' . number_format($value, 2, ',', '.');
}

// formata para data no formato dd/mm/yyyy
function formataData($data) {
    $data = explode('-', $data);
    return $data[2].'/'.$data[1].'/'.$data[0];
}

function formataDataCompleta($dataHora) {
    if (!$dataHora) return null;

    try {
        $data = new DateTime($dataHora);
        return $data->format('d/m/Y');
    } catch (Exception $e) {
        return null; // ou lance uma exceção, dependendo da sua lógica
    }
}


function buscarComissao(array $comissoes, int $idServico, int $idFuncionario): ?array {
    foreach ($comissoes as $comissao) {
        if (
            isset($comissao['id_servico'], $comissao['id_funcionario']) &&
            $comissao['id_servico'] == $idServico &&
            $comissao['id_funcionario'] == $idFuncionario
        ) {
            return [$comissao['valor'] ?? [0, 0], $comissao['tipo_comissao'] ?? [0, 0]];
        }
    }
    return [0, 0]; // caso não encontre
}

function hidratarComissoesLegadoNovo(iterable $rowsComissaoVenda, array $opcoes = []): array {
    $usuariosMap        = $opcoes['usuariosMap']        ?? [];
    $clientesMap        = $opcoes['clientesMap']        ?? [];
    $comissoesNovaMap   = $opcoes['comissoesNovaMap']   ?? [];
    $comissoesLegadaMap = $opcoes['comissoesLegadaMap'] ?? [];

    $arr = [];
    foreach ($rowsComissaoVenda as $rowRaw) {
        $row = (array)$rowRaw;
        if (is_object($rowRaw) && method_exists($rowRaw, 'toArray')) {
            $row = $rowRaw->toArray();
        }

        $agenteId   = isset($row['agente_id'])            ? (int)$row['agente_id']            : 0;
        $comissaoId = isset($row['comissao_id'])          ? (int)$row['comissao_id']          : 0;
        $pessoaTipo = isset($row['pessoa_tipo'])          ? (string)$row['pessoa_tipo']       : '';
        $pessoaId   = isset($row['pessoa_id'])            ? (int)$row['pessoa_id']            : 0;
        $comCadId   = isset($row['comissao_cadastro_id']) ? (int)$row['comissao_cadastro_id'] : 0;
        $valorCom   = isset($row['valor_comissao'])       ? (float)$row['valor_comissao']     : 0.0;

        $temNovoBenef   = !empty($pessoaTipo) && $pessoaId > 0;
        $temLegadoBenef = $agenteId > 0;

        if ($temNovoBenef) {
            $beneficiario_tipo         = $pessoaTipo;
            $beneficiario_id_real      = $pessoaId;
            $beneficiario_chave_logica = $pessoaTipo.':'.$pessoaId;
            $origem_comissao           = 'NOVO_FLUXO_STEP2';
        } elseif ($temLegadoBenef) {
            $beneficiario_tipo         = 'cliente';
            $beneficiario_id_real      = $agenteId;
            $beneficiario_chave_logica = 'cliente:'.$agenteId;
            $origem_comissao           = 'LEGADO_FK';
        } else {
            $beneficiario_tipo         = 'desconhecido';
            $beneficiario_id_real      = 0;
            $beneficiario_chave_logica = 'user:999999';
            $origem_comissao           = 'SEM_DADOS';
        }

        $beneficiario_nome = '';
        if ($beneficiario_tipo === 'user') {
            $nome = null;
            if (is_array($usuariosMap) && isset($usuariosMap[$beneficiario_id_real])) {
                $nome = $usuariosMap[$beneficiario_id_real];
            } elseif ($usuariosMap instanceof \Illuminate\Support\Collection) {
                $nome = $usuariosMap->get($beneficiario_id_real);
            }
            $beneficiario_nome = $nome ? trim((string)$nome) : 'Usuário #'.$beneficiario_id_real;
        } elseif ($beneficiario_tipo === 'cliente') {
            $nome = null;
            if (is_array($clientesMap) && isset($clientesMap[$beneficiario_id_real])) {
                $nome = $clientesMap[$beneficiario_id_real];
            } elseif ($clientesMap instanceof \Illuminate\Support\Collection) {
                $nome = $clientesMap->get($beneficiario_id_real);
            }
            $beneficiario_nome = $nome ? trim((string)$nome) : 'Agente #'.$beneficiario_id_real;
        } else {
            $beneficiario_nome = '—';
        }

        $temNovaDef   = $comCadId > 0;
        $temLegadaDef = $comissaoId > 0;

        if ($temNovaDef) {
            $comissao_definicao_id     = $comCadId;
            $comissao_definicao_tabela = 'nova_plural';
        } elseif ($temLegadaDef) {
            $comissao_definicao_id     = $comissaoId;
            $comissao_definicao_tabela = 'legado_singular';
        } else {
            $comissao_definicao_id     = 0;
            $comissao_definicao_tabela = 'nenhuma';
        }

        $comissao_nome        = '';
        $comissao_tipo_regra  = 0;
        $comissao_valor_regra = 0.0;

        if ($comissao_definicao_tabela === 'nova_plural') {
            $def = null;
            if (is_array($comissoesNovaMap) && isset($comissoesNovaMap[$comissao_definicao_id])) {
                $def = $comissoesNovaMap[$comissao_definicao_id];
            } elseif ($comissoesNovaMap instanceof \Illuminate\Support\Collection) {
                $def = $comissoesNovaMap->get($comissao_definicao_id);
            }
            if ($def) {
                if (is_array($def)) {
                    $comissao_nome        = trim((string)($def['nome'] ?? ''));
                    $comissao_tipo_regra  = (int)($def['tipo_comissao'] ?? 0);
                    $comissao_valor_regra = (float)($def['valor'] ?? 0);
                } elseif (is_object($def)) {
                    $comissao_nome        = trim((string)($def->nome ?? ''));
                    $comissao_tipo_regra  = (int)($def->tipo_comissao ?? 0);
                    $comissao_valor_regra = (float)($def->valor ?? 0);
                }
            }
        } elseif ($comissao_definicao_tabela === 'legado_singular') {
            $def = null;
            if (is_array($comissoesLegadaMap) && isset($comissoesLegadaMap[$comissao_definicao_id])) {
                $def = $comissoesLegadaMap[$comissao_definicao_id];
            } elseif ($comissoesLegadaMap instanceof \Illuminate\Support\Collection) {
                $def = $comissoesLegadaMap->get($comissao_definicao_id);
            }
            if ($def) {
                if (is_array($def)) {
                    $servicoNome        = $def['servico']['nome'] ?? ($def['servico_nome'] ?? '');
                    $comissao_nome      = trim((string)$servicoNome);
                    $comissao_tipo_regra  = (int)($def['tipo_comissao'] ?? 0);
                    $comissao_valor_regra = (float)($def['valor'] ?? 0);
                } elseif (is_object($def)) {
                    $servico = $def->servico ?? null;
                    if (is_object($servico)) {
                        $comissao_nome = trim((string)($servico->nome ?? ''));
                    } elseif (isset($def->servico_nome)) {
                        $comissao_nome = trim((string)($def->servico_nome));
                    }
                    $comissao_tipo_regra  = (int)($def->tipo_comissao ?? 0);
                    $comissao_valor_regra = (float)($def->valor ?? 0);
                }
            }
        }

        $comissao_percent_label = '—';
        if ($comissao_tipo_regra === 1) {
            $v = rtrim(rtrim(number_format($comissao_valor_regra, 2, ',', '.'), '0'), ',');
            $comissao_percent_label = (($v === '' || $v === '0') ? '0' : $v).'%';
        } elseif ($comissao_tipo_regra === 2) {
            $comissao_percent_label = function_exists('formataCash')
                ? formataCash($comissao_valor_regra)
                : ('R$ '.number_format($comissao_valor_regra, 2, ',', '.'));
        }

        $resultRow = $row;
        $resultRow['beneficiario_chave_logica'] = $beneficiario_chave_logica;
        $resultRow['beneficiario_tipo']         = $beneficiario_tipo;
        $resultRow['beneficiario_id_real']      = $beneficiario_id_real;
        $resultRow['beneficiario_nome']         = $beneficiario_nome;
        $resultRow['comissao_definicao_id']     = $comissao_definicao_id;
        $resultRow['comissao_definicao_tabela'] = $comissao_definicao_tabela;
        $resultRow['comissao_nome']             = $comissao_nome;
        $resultRow['comissao_tipo_regra']       = $comissao_tipo_regra;
        $resultRow['comissao_valor_regra']      = $comissao_valor_regra;
        $resultRow['comissao_percent_label']    = $comissao_percent_label;
        $resultRow['origem_comissao']           = $origem_comissao;

        $arr[] = $resultRow;
    }
    return $arr;
}
