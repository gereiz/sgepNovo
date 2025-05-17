<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}">
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}">

<style>
    body {
        font-family: "Lucida Console", "Courier New", monospace;
    } 
</style>

<div>
    <hr class="bg-dark" style="margin-top: -3%;">
    <div class="text-center">
        <img class="text-center" src="assets/img/logo-white.png" style="width: 20%; margin-bottom: 2%;">
        <h5>Rua Olegário Maciel, 922, centro, Governador Valadares-MG, 35010-200</h5>
    </div>
    <hr class="bg-dark">
    <div>
        <h4 class="text-center">Relatório de Painéis reservados por Bi-semana</h4>
        {{-- <h5 class="text-center">Bi-semana: {{$bisemana->num_bisemana}} - {{date('d/m/Y', strtotime($bisemana->inicio))}} até {{date('d/m/Y', strtotime($bisemana->fim))}}</h5> --}}
        <hr class="bg-dark">
    </div>
</div>

<div style="margin-top: -1.7%;">  
    @php
        $arrayOut = [];
    @endphp
    <table class="table table-striped table-bordered">
        <tbody>
            @foreach ($reservas_out as $res)
                @if (in_array($res->painel->identificacao, $arrayOut) )
                    @continue
                @else
                    {{array_push($arrayOut, $res->painel->identificacao)}}
                @endif
                
            
                <tr class="text-center">
                    <th colspan="12">
                        
                        Painel: {{$res->painel->identificacao}} ({{$res->painel->logradouro." - ".$res->painel->numero }})
                    </th>
                </tr>
               
                <tr class="thead-dark">
                    {{-- <th colspan="1"></th> --}}
                    <th colspan="8" class="text-center small">Bi-semana</th>
                    <th colspan="2" class="text-center small">Cliente</th>
                    <th colspan="2" class="text-center small">Campanha</th>
                </tr>
                    
                
                @foreach ($reservas_out as $res)
                    @if(in_array($res->painel->identificacao, $arrayOut) && $res->bisemana->inicio > (date("Y").'-01-01'))
                        <tr> 
                            {{-- <td colspan="1" class="small" style="font-weight: 800;">{{$loop->iteration}}</td> --}}
                            <td colspan="8" class="text-center" style="font-weight: 800;">Bi-semana:{{$res->bisemana->num_bisemana}} - {{date('d/m/Y', strtotime($res->bisemana->inicio))}} à {{date('d/m/Y', strtotime($res->bisemana->fim))}}</td>
                            <td colspan="2" class="text-center small" style="font-weight: 800;">{{$res->cliente->nome_fantasia}}</td>
                            <td colspan="2" class="text-center small" style="font-weight: 800;">{{$res->campanha}}</td>
                        </tr> 
                    @endif       
                    
                    @php
                        
                        // unset($arrayOut[0]);
                    @endphp
                @endforeach
                         
                <tr style="margin-bot: 20px;">
                    <td></td>
                </tr> 
            @endforeach
        </tbody>
    </table>
</div>

<div class="d-inline pagebreak"> </div>