<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}">
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}">

<style>

    @page {
        margin: 1cm;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    .table {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;
        background-color: transparent;
    }

    .table th,
    .table td {
        padding: 0.75rem;
        vertical-align: top;
        border-top: 1px solid #dee2e6;
    }

    .table thead th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
    }

    .table tbody + tbody {
        border-top: 2px solid #dee2e6;
    }

    .table-bordered {
        border: 1px solid #dee2e6;
    }

    .table-bordered th,
    .table-bordered td {
        border: 1px solid #dee2e6;
    }

    .table-striped tbody tr:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .pagebreak {
        page-break-before: always;
    }
</style>

<!-- <div>
    <hr class="bg-dark" style="margin-top: -3%;">
    <div class="text-center">
        <img class="text-center" src="assets/img/logo-white.png" style="width: 20%; margin-bottom: 2%;">
        <h5>Rua Olegário Maciel, 922, centro, Governador Valadares-MG, 35010-200</h5>
    </div>
    <hr class="bg-dark">
    <div>
        <h4 class="text-center">Relatório de Painéis reservados por Cliente</h4>
        {{-- <h5 class="text-center">Bi-semana: {{$bisemana->num_bisemana}} - {{date('d/m/Y', strtotime($bisemana->inicio))}} até {{date('d/m/Y', strtotime($bisemana->fim))}}</h5> --}}
        <hr class="bg-dark">
    </div>
</div> -->

@include('relatorios.includes.rel_header', ['titulo' => 'Painéis reservados por Cliente', 'doc' => 'PI', 'num' => ""])

<div style="margin-top: -1.7%;">  
    <table class="table table-striped table-bordered">
        <thead>
            <tr class="text-center">
                <th colspan="12">
                    <h5 class="text-center mt-5">Bi-semana: {{$bisemana->num_bisemana}} - {{date('d/m/Y', strtotime($bisemana->inicio))}} até {{date('d/m/Y', strtotime($bisemana->fim))}}</h5>
                </th>
            </tr>
        </thead>
    
        <tbody>
            

            <tr class="thead-dark">
                <th colspan="1"></th>
                <th colspan="9" class="text-center small">Cliente</th>
                <th colspan="1" class="text-center small">Campanha</th>
                <th colspan="1" class="text-center small">Qtd.</th>
            </tr>
 
            @php
                $count_total = 0;
            @endphp

            @foreach ($reservas as $res)
            {{$count_total++}}
            <tr> 
                <td colspan="1" class="small" style="font-weight: 800;">{{$loop->iteration}}</td>
                <td colspan="9" class="small" style="font-weight: 800;">{{$res->nome_fantasia}}</td>
                <td colspan="1" class="text-center small" style="font-weight: 800;">{{$res->campanha}}</td>
                <td colspan="1" class="text-center small" style="font-weight: 800;">{{$res->count_campanha}}</td>
            </tr>
            @endforeach
            <tr>
                <td colspan="1"></td>
                <td colspan="9" class="small" style="font-weight: 800; font-size: 16px" >Total</td>
                <td colspan="1"></td>
                <td colspan="1" class="text-center small" style="font-weight: 800; font-size: 16px">{{$count_res[0]->count_campanha}}</td>
            </tr>
        </tbody>
    </table>
</div>

<div class="d-inline pagebreak"> </div>
