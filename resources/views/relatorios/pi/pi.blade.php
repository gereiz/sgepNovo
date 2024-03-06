<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}">
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}">

<style>
    body {
        font-family: "Lucida Console", "Courier New", monospace;
    }
</style>

<div>
    <div class="text-center">
        <img class="text-center" src="assets/img/logo-white.png" style="width: 10%; margin-bottom: 2%;">
        <h6>Rua Olegário Maciel, 922, centro, Governador Valadares-MG, 35010-200</h5>
    </div>
    <hr class="bg-dark">

    <div>
        <table class="table table-sm" style="border: 1px solid #808080;">
            <thead class="thead-dark mb-4">
                <tr>
                  <th scope="col" colspan="1">DATA:</th>
                  <th scope="col" colspan="1">{{$dt_atual}}</th>
                  <th scope="col" colspan="8" class="text-center">PEDIDO DE INSERÇÃO</th>
                  <th scope="col" colspan="2">PI: 000{{$pi->id}}</th>
                </tr>
            </thead>
            <tbody>
              <tr style="border: 1px solid #808080;">
                <td colspan="2" class="font-weight-bold" style="border: 1px solid #808080;">Razão Social</td>
                <td colspan="4" style="border: 1px solid #808080;">{{$pi->cliente->razao_social}}</td>
                <td colspan="2" class="font-weight-bold" style="border: 1px solid #808080;">CPF / CNPJ</td>
                <td colspan="4" style="border: 1px solid #808080;">{{$pi->cliente->cpf_cnpj}}</td>
              </tr>

              <tr style="border: 1px solid #808080;">
                <td colspan="2" class="font-weight-bold" style="border: 1px solid #808080;">Endereço</td>
                <td colspan="4" style="border: 1px solid #808080;">{{$pi->cliente->endereco}} - {{$bairro->nome}}</td>
                <td colspan="2" class="font-weight-bold" style="border: 1px solid #808080;">Insc. Estadual</td>
                <td colspan="4" style="border: 1px solid #808080;">{{$pi->cliente->nro_insc}}</td>
              </tr>

              <tr style="border: 1px solid #808080;">
                <td colspan="2" class="font-weight-bold" style="border: 1px solid #808080;">Cidade</td>
                <td colspan="3" style="border: 1px solid #808080;">{{$cidade->nome}}</td>
                <td colspan="1" class="font-weight-bold" style="border: 1px solid #808080;">Estado</td>
                <td colspan="1" style="border: 1px solid #808080;">{{$uf->nome}}</td>
                <td colspan="1" class="font-weight-bold" style="border: 1px solid #808080;">CEP</td>
                <td colspan="4" style="border: 1px solid #808080;">{{$pi->cliente->cep}}5</td>
              </tr>

              <tr style="border: 1px solid #808080;">
                <td colspan="2" class="font-weight-bold" style="border: 1px solid #808080;">Telefone</td>
                <td colspan="1" style="border: 1px solid #808080;">{{$pi->cliente->celular}}</td>
                <td colspan="1" class="font-weight-bold" style="border: 1px solid #808080;">E-mail</td>
                <td colspan="3" style="border: 1px solid #808080;">{{$pi->cliente->email}}</td>
                <td colspan="4" class="font-weight-bold" style="border: 1px solid #808080;">Quantidade de Painéis</td>
                <td colspan="1" style="border: 1px solid #808080;">{{count(explode(',', str_replace(["[","]"], '', $pi->id_paineis)))}}</td>
              </tr>

              <tr style="border: 1px solid #808080;">
                <td colspan="2" class="font-weight-bold" style="border: 1px solid #808080;">Contato</td>
                <td colspan="1" style="border: 1px solid #808080;">{{$pi->cliente->responsavel}}</td>
                <td colspan="1" class="font-weight-bold" style="border: 1px solid #808080;">Pago</td>
                <td colspan="2" style="border: 1px solid #808080;">{{$pi->pago == 0 ? "Sim" : "Não"}}</td>
                <td colspan="2" class="font-weight-bold" style="border: 1px solid #808080;">Campanha</td>
                <td colspan="4" style="border: 1px solid #808080;">{{$pi->campanha}}</td>
              </tr>
            </tbody>
            <thead class="thead-dark mb-4">
                <tr>
                  <th scope="col" colspan="4" class="text-center">ÀREA DE VEICULAÇÃO</th>
                  <th scope="col" colspan="2" class="text-center">PERÍODO</th>
                  <th scope="col" colspan="2" class="text-center">VALOR UNITÁRIO</th>
                  <th scope="col" colspan="2" class="text-center">VALOR DESCONTO</th>
                  <th scope="col" colspan="2" class="text-center">VALOR TOTAL</th>
                </tr>
            </thead>
            <tbody>

                @php
                    $paineis  = explode(',', str_replace(["[","]"], '', $pi->id_paineis));
                @endphp

                {{-- @foreach ($paineis as $painel) --}}
                    <tr style="border: 1px solid #808080;">
                        <td colspan="4" class="font-weight-bold" style="border: 1px solid #808080;">Placas: {{str_replace(["[", "]", '"'], "", $pi->id_paineis)}}</td>
                        <td colspan="2" class="text-center" style="border: 1px solid #808080;">{{$bs_inicio}} à {{$bs_final}}</td>
                        <td colspan="2" style="border: 1px solid #808080;">R$ {{$pi->vl_unit}}</td>
                        <td colspan="2" style="border: 1px solid #808080;">R$ {{$pi->vl_desc}}</td>
                        <td colspan="2" style="border: 1px solid #808080;">R$ {{$pi->vl_total}}</td>
                    </tr>
                {{-- @endforeach --}}

                
                <tr style="border: 1px solid #808080;">
                    <td colspan="4" class="font-weight-bold" style="border: 1px solid #808080;">Pagamento: {{$data_pgto_formated}}</td>
                    <td colspan="2" style="border: 1px solid #808080;"></td>
                    <td colspan="4" class="font-weight-bold" style="border: 1px solid #808080;"></td>
                    <td colspan="2" style="border: 1px solid #808080;"></td>
                </tr>

                <tr style="border: 1px solid #808080;">
                    <td colspan="4" class="font-weight-bold" style="border: 1px solid #808080;">Dados: @if ($pi->forma_pagamento == 1)
                        À VISTA DINHEIRO
                    @elseif($pi->forma_pagamento == 2)
                        PIX
                    @elseif($pi->forma_pagamento == 3)
                        CARTÃO
                    @elseif($pi->forma_pagamento == 4)
                        BOLETO
                    @elseif($pi->forma_pagamento == 5)
                        DEPOSITO
                    @endif</td>
                    <td colspan="2" style="border: 1px solid #808080;"></td>
                    <td colspan="4" class="font-weight-bold" style="border: 1px solid #808080;"> </td>
                    <td colspan="2" style="border: 1px solid #808080;"></td>
                </tr>

                <tr style="border: 1px solid #808080;">
                    <td colspan="4" class="font-weight-bold" style="border: 1px solid #808080;">Banco: </td>
                    <td colspan="2" style="border: 1px solid #808080;"></td>
                    <td colspan="4" class="font-weight-bold" style="border: 1px solid #808080;"></td>
                    <td colspan="2" style="border: 1px solid #808080;"></td>
                </tr>
            </tbody>
        </table>
        <p class="font-weight-bold">Não é Documento Fiscal</p>
    </div>
    <table class="table table-sm">
        <thead class="mb-4">
            <tr>
              <th scope="col" colspan="1"></th>
              <th scope="col" colspan="4" style="border-bottom: 1px solid #808080;"></th>
              <th scope="col" colspan="3" style="color:#fff;">....</th>
              <th scope="col" colspan="2" style="border-bottom: 1px solid #808080;"></th>
              <th scope="col" colspan="1" style="color:#fff;">....</th>
            </tr>
            <tr>
                <th scope="col" colspan="1"></th>
                <th scope="col" colspan="4" class="text-center">Cliente</th>
                <th scope="col" colspan="3" style="color:#fff;">....</th>
                <th scope="col" colspan="2" class="text-center">Equipe Comunicação LTDA</th>
                <th scope="col" colspan="1" style="color:#fff;">....</th>
              </tr>
          </thead>
    </table>
</div>

<p class="text-right font-italic">1ª Via - Veículo</p>

<div class="d-inline pagebreak"> </div>



