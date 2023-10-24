<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}"> <!-- class="theme-settings-bootstrap-css" --> 
<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/appwork.css')}}"> <!-- class="theme-settings-appwork-css" -->

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
        <h4 class="text-center">Mapa de Colagem - Outdoors</h4>
        <h5 class="text-center">Bi-semana: {{$bisemana->num_bisemana}} - {{date('d/m/Y', strtotime($bisemana->inicio))}} até {{date('d/m/Y', strtotime($bisemana->fim))}}</h5>
        <hr class="bg-dark">
    </div>
</div>

<div class="w-full" style="margin-top: -1.7%;">  
    <table class="table table-striped table-bordered">
        @php
            $array_cid = [];
            $array_reg = [];
            $array_outreg = [];
            $array_out = [];
            $i = 0;
        @endphp

        @foreach ($cidades as $cidade)
            {{-- Cria os arrays para comparação e seta as como serão preenchidos --}}
            @php
                foreach ($rel_bisemana as $rel_bs) {
                    if($cidade->nome == $rel_bs->cidade) {
                        array_push($array_cid, $cidade->nome);
                    }

                    foreach ($regioes as $regiao) {
                        if($regiao->nome == $rel_bs->regiao) {
                            array_push($array_reg, $regiao->nome);
                        }   
                    }


                }

                $array_cid = array_unique($array_cid);
                $array_reg = array_unique($array_reg);
            @endphp

            {{-- @dd($rel_bs_ant[0]->campanha) --}}
    
            @if (in_array($cidade->nome, $array_cid))
                @foreach ($rel_bisemana as $rel_bs)
                    @continue(in_array($rel_bs->regiao, $array_outreg))
                    <tbody>
                        
                        @if($rel_bs->cidade_id == $cidade->id && in_array($rel_bs->regiao, $array_reg))
                            {{-- Imprime a cidade --}}

                            <tr class="text-center">
                                <th colspan="12">
                                    <h5>
                                        {{$cidade->nome}}
                                    </h5>
                                </th>
                            </tr>

                            <tr class="thead-dark">
                                <th colspan="1" class="text-center small">Identif.</th>
                                <th colspan="4" class="text-center small">Endereço</th>
                                <th colspan="1" class="text-center small">Bairro</th>
                                <th colspan="2" class="text-center small">Pos.</th>
                                <th colspan="2" class="text-center small">Atual</th>
                                <th colspan="2" class="text-center small">A Colocar</th>
                            </tr>
    

                            {{-- Imprime a Região --}}

                            <tr class="text-center"> 
                                <th colspan="12">{{$rel_bs->regiao}}</th>
                            </tr>
                            {{array_push($array_outreg, $rel_bs->regiao)}}
                        @endif

                        {{--Imprime as Reservas  --}}
                        @foreach ($rel_bisemana as $rel_bs)
                        @continue(in_array($rel_bs, $array_out))
                            @if($rel_bs->cidade_id == $cidade->id &&  in_array($rel_bs->regiao, $array_outreg)) 
                                <tr>
                                    <td colspan="1" class="text-center small" style="font-weight: 800;">{{$rel_bs->ident}}</td>
                                    <td colspan="4" class="text-center small" style="font-weight: 800;">{{$rel_bs->logradouro. ' - '.$rel_bs->numero}}</td>
                                    <td colspan="1" class="text-center small" style="font-weight: 800;">{{$rel_bs->bairro}}</td>
                                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{$rel_bs->posicao}}</td>
                                  
                                    @foreach ($rel_bs_ant as $rel_ant) 
                                        @if (($rel_ant->outdoor_id == $rel_bs->outdoor_id))
                                            <td colspan="2" class="text-center small" style="font-weight: 800;">{{strtoupper($rel_ant->campanha)}}</td>
                                            @break
                                        @endif   
                                    @endforeach

                                    <td colspan="2" class="text-center small" style="font-weight: 800;">{{strtoupper($rel_bs->campanha)}}</td>
                                    
                                </tr>
                                {{array_push($array_out, $rel_bs);}}
                            @endif    
                        @endforeach
                    </tbody>
                    <br><br>
                    
                @endforeach
                                            
                
            @endif
        @endforeach

        {{$i++;}}
    
        <br><br>
    </table> 
</div>
<div class="d-inline pagebreak"> </div>
