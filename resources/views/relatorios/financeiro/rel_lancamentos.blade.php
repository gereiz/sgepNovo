<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}"> 
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}"> 

<style>
    @page {
        margin: 10px;
    }
    
    .page-number {
        position: fixed;
        bottom: 10px;
        right: 10px;
        font-size: 12px;
    }
    
    .page-number:after {
        content: "página " counter(page);
    }

    .page-break {
        page-break-before: always;
    }
</style>
    


<div class="page-number"></div>

@include('relatorios.includes.rel_header', ['titulo' => 'RELATÓRIO LANÇAMENTOS', 'doc' => 'REL', 'num' => ''])

<div style="margin-top: -1.7%;">  
    <table class="table table-striped table-bordered">
        <thead>
            <tr class="text-center">
                <th colspan="12">
                    <!-- <h5 class="text-center mt-5">Bi-semana: </h5> -->
                </th>
            </tr>
        </thead>
    
        <tbody>
            

            <tr class="thead-dark">
                <th colspan="1" class="text-center small">ID.</th>
                <th colspan="3" class="text-center small">Descrição</th>
                <th colspan="2" class="text-center small">Valor Total</th>
                <th colspan="2" class="text-center small">Valor Liquido</th>
                <th colspan="2" class="text-center small">Data</th>
                <th colspan="1" class="text-center small">Tipo</th>
                <th colspan="2" class="text-center small">C. Custo</th>
                <!-- <th colspan="2" class="text-center small">OBS.:</th> -->
            </tr>

            @foreach($lancamentos as $lancamento)
                <tr> 
                    <td colspan="1" class="text-center small" style="font-weight: 800;">{{$lancamento->id}}</td>
                    <td colspan="3" class="small" style="font-weight: 800;">{{$lancamento->descricao}}</td>
                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{$lancamento->valor}}</td>
                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{$lancamento->valor_liquido}}</td>
                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{formataData($lancamento->dt_faturamento)}}</td>
                    <td colspan="1" class="text-center small" style="font-weight: 800;">{{$lancamento->tipoLancamento->tipo}}</td>
                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{$lancamento->centroCusto->centro_custo}}</td>
                    <!-- <td colspan="3" class="text-center small" style="font-weight: 800;">{{$lancamento->observacoes}}</td> -->
                   
                </tr>
            @endforeach
        </tbody>

        <tfoot>
            <tr>
                <td colspan="10" class="small" style="font-weight: 800; font-size: 16px" >Total de lançamentos selecionados</td>
                <td colspan="1"></td>
                <td colspan="1" class="text-center small" style="font-weight: 800; font-size: 16px">{{count($lancamentos)}}</td>
                <td colspan="1"></td>   
            </tr>
        </tfoot>
    </table>
</div>