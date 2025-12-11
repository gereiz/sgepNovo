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

@include('relatorios.includes.rel_header', ['titulo' => 'RELATÓRIO DE OCUPAÇÃO', 'doc' => 'REL', 'num' => ''])


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
                <th colspan="2" class="text-center small">Identificação</th>
                <th colspan="2" class="text-center small">Ultima BS</th>
                <th colspan="2" class="text-center small">Qtd. BS</th>
                <th colspan="2" class="text-center small">Qtd. Ocupações</th>
                <th colspan="2" class="text-center small">Ocupações %</th>
                <th colspan="2" class="text-center small">Classificação</th>
            </tr>
            @foreach($paineis as $painel)
                @php
                    $encontrou_qtd = false;
                @endphp
                <tr>
                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{$painel->identificacao}}</td>
                    <td colspan="2" class="text-center small" style="font-weight: 800;">BS - {{$ultima_bs->num_bisemana}}: {{date('d/m/Y', strtotime($ultima_bs->inicio))}} até {{date('d/m/Y', strtotime($ultima_bs->fim))}}</td>
                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{$qtd_bs}}</td>

                    @foreach($qtds_bs_res as $qtd)
                        @if($qtd->outdoor_id == $painel->id)
                            @php
                                $encontrou_qtd = true;
                                if($qtd->total_reservas == 0){
                                    session(['qtd' => 1]);
                                } else {
                                    session(['qtd' => $qtd->total_reservas]);
                                }
                            @endphp
                            <td colspan="2" class="text-center small" style="font-weight: 800;">
                                {{ $qtd->total_reservas }}
                            </td>
                        @endif
                    @endforeach

                    @if(!$encontrou_qtd)
                        @php
                            session(['qtd' => 0]);
                        @endphp
                        <td colspan="2" class="text-center small" style="font-weight: 800;">
                            0
                        </td>
                    @endif

                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{round(session('qtd') / $qtd_bs * 100)}} %</td>
                    @if(round(session('qtd') / $qtd_bs * 100 < 20))
                        <td colspan="2" class="text-center small" style="font-weight: 800;">
                            Péssimo
                        </td>
                    @elseif(round(session('qtd') / $qtd_bs * 100 < 40))
                        <td colspan="2" class="text-center small" style="font-weight: 800;">
                            Ruim
                        </td>
                    @elseif(round(session('qtd') / $qtd_bs * 100 < 60))
                        <td colspan="2" class="text-center small" style="font-weight: 800;">
                            Regular
                        </td>
                    @elseif(round(session('qtd') / $qtd_bs * 100 < 80))
                        <td colspan="2" class="text-center small" style="font-weight: 800;">
                            Bom
                        </td>
                    @elseif(round(session('qtd') / $qtd_bs * 100 >= 80))
                        <td colspan="2" class="text-center small" style="font-weight: 800;">
                            Ótimo
                        </td>
                    @endif
                </tr>
            @endforeach
            <tr>
                <td colspan="10" class="small" style="font-weight: 800; font-size: 16px" >Total de painéis selecionados</td>
                <td colspan="1"></td>
                <td colspan="1" class="text-center small" style="font-weight: 800; font-size: 16px">{{count($paineis)}}</td>
                <td colspan="1"></td>
            </tr>
            </tr>
        </tbody>
    </table>
</div>
