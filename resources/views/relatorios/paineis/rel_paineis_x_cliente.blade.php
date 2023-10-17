<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}">
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}">

<style>

    .relatorio {
        margin-left: -30px;
        margin-bottom: 10px!important;
        width: 735px;
        height: 250px;
    }

    .no-space{
            margin-top: 0px;
            margin-bottom:0px;
            padding-top:0px;
            padding-bottom:0px;
    }

    #tabletitulo {
        text-align: center;
        max-width: 750px!important;
        margin-bottom: 2%;
        margin-top: -3%;
        height: 130px;
        background-color: #e4e4e4;
        border: 1px solid;
        padding-top: -7%;
    }
 
    .relatorio-body {
        display: flex;
    }

    .img-relatorio {
        position: relative;
        top: -105px;
        left: 63%;
        width:250px;
        height:180px;3
        border: 1px solid!important;
    }

    .endereco-relatorio{
    max-width: 390px;

    }

    .login_logo {
        width: 150px;
        position: relative;
        left: -35%;
        top: 30%;
    }

    #table-alerta h5 {
        color: #B22222;
        text-align: center;
    }

</style>
 
<div id="tabletitulo">
    <img class="login_logo" src="{{public_path('storage/img/logo.png')}}" alt="Logo">
    <h4 style="margin-top:-5%;">Painéis Reservados</h4>
    <h5>{{$cliente->nome_fantasia ? $cliente->nome_fantasia : $cliente->razao_social}}</h5>
    <h5>Bi-Semana: {{$numBisemana}} - {{$periodo}}</h5>
</div>

<div id="table-alerta">
    <h5><b><u>Esta disponibilidade está sujeita a alteração, sem aviso prévio.</b></u></h5>
</div>


<table style="page-break-after:always;">

    <?php
    $i = 1;
    foreach ($paineis as $p) {
    ?>
    {{-- <?php if ($i % 2 != 0) { ?>
        <tr>
        <?php } ?> --}}
    <tr>
        <td >
            <div class="col-md-12">
                <div class="card relatorio">
                    <div class="text-center" style="background-color:#E0E0E0;">
                        <h4 class="card-title">Identificação: {{$p->painel->identificacao}}</h4>
                    </div>
                    <div class="card-body relatorio-body">
                        <div class="row d-flex">
                            <div class="col-md-12">
                               
                               {{-- informações --}}
                                <div class="d-inline col-md-6">
                                    <div class="endereco-relatorio">
                                        <p><b>Localização:</b>  {{$p->painel->logradouro}}, nº{{$p->painel->numero}} - {{$p->painel->bairro->nome}} / {{$p->painel->bairro->regiao->cidade->nome}}</p>
                                        <p><b>Coordenadas:</b> <a href="https://maps.google.com/?q={{$p->painel->latitude}},{{$p->painel->longitude}}" target="_blank">Ver localização no mapa</a> </p>
                                    </div>
                                </div>

                                {{-- Imagem --}}
                                <div class="d-inline col-md-6">
                                    <div style="margin-top: -7%;">
                                        <?php
                                        $filePath = 'storage/'.$p->painel->image_url;
                                        $originalImage = public_path($filePath);
                                        //if(pathinfo('storage/'.$p->painel->image_url, PATHINFO_EXTENSION) != "png" || mime_content_type($filePath) != "image/png"){
                                        if(filesize($filePath) > 50000){
                                            $info = getimagesize($filePath);
                            
                                            if ($info['mime'] == 'image/jpeg') 
                                                $image = @imagecreatefromjpeg($filePath);
                                        
                                            elseif ($info['mime'] == 'image/gif') 
                                                $image = @imagecreatefromgif($filePath);
                                        
                                            elseif ($info['mime'] == 'image/png') 
                                                $image = @imagecreatefrompng($filePath);
                                        
                                            imagejpeg($image, 'storage/outdoorImages/'.$p->painel->id."/CompressedJpgImage.jpg", 5);
                                            $reportImage = public_path('storage/outdoorImages/'.$p->painel->id."/CompressedJpgImage.jpg");
                                        }
                                    
                                        ?>
                                        <img class="img-relatorio" src="{{$reportImage}}" alt="imagem_painel">
                                    </div>
                                </div> 


                            </div>
                            
                        </div>
                        
                        {{-- <div class="d-inline row">
                            <p class="d-inline card-text">{{$p->painel->localizacao}}</p>
                        </div> --}}
                    </div>
                </div>
            </div>
        </td>
    </tr>
    {{-- <?php if ($i % 2 == 0) { ?>
    </tr>
    <?php } ?> --}}

    <?php if ($i == 6) { ?>
        <div class="d-inline pagebreak"> </div>
    <?php } ?>
    <?php $i++;
    } ?>

</table>





{{-- <div class="d-inline pagebreak"> </div>

<div class="d-inline col-md-12">
    <div>
        <p style="margin : 0; padding-top:0;"><b>Filtros Utilizados:</b></p>
        <p style="margin : 0; padding-top:0;"><b>Bisemana: <i>{{$data}}</i></b></p>
        <p style="margin : 0; padding-top:0;"><b>Status: <i>{{$status}}</i></b></p>
    </div>
</div> --}}

