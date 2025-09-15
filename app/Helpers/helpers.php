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
            return [$comissao['valor'] ?? null, $comissao['tipo_comissao'] ?? null];
        }
    }
    return null; // caso não encontre
}
