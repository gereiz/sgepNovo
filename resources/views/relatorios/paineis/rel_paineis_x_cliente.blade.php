<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}">
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}">

<style>
    @page {
        margin: 1cm;
    }
    
    .pagebreak {
        page-break-before: always;
    }
    
    .img-relatorio {
        width: 400px;
        height: 220px;
        object-fit: cover;
    }
    
    #table-alerta h5 {
        color: #B22222;
    }
</style>
 
@include('relatorios.includes.rel_header', ['titulo' => 'RESERVAS POR CLIENTE', 'doc' => 'REL', 'num' => ""])

<div id="table-alerta" class="mb-4">
    <h5 class="text-center"><b><u>Esta disponibilidade está sujeita a alteração, sem aviso prévio.</b></u></h5>
</div>


<table class="w-100" style="page-break-after:always;">

    <?php
    $i = 1;
    foreach ($paineis as $p) {
    ?>
    <tr>
        <td>
            <div class="col-md-12">
                <div class="card mb-4" style="width: 100%; height: 290px; page-break-inside: avoid; margin-top: 20px; margin-left: -15px; border: 1px solid #666666; border-radius: 10px;">
                    <div class="text-center bg-secondary text-white py-2" style="border-top-left-radius: 10px; border-top-right-radius: 10px;">
                        <h4 class="card-title">Identificação: {{$p->painel->identificacao}}</h4>
                    </div>
                    <div class="card-body p-3">
                        <div class="row">
                            <div class="col-md-12">
                               
                               {{-- informações --}}
                                <div class="col-md-6 d-inline-block">
                                    <div class="mt-2" style="max-width: 390px;">
                                        <p><b>Localização:</b>  {{$p->painel->logradouro}}, nº
                                                                {{$p->painel->numero}} - 
                                                                {{$p->painel->bairro->nome}} / 
                                                                {{$p->painel->bairro->regiao->cidade->nome}}
                                        </p>
                                        <p><b>Coordenadas:</b> <a href="https://maps.google.com/?q={{$p->painel->latitude}},{{$p->painel->longitude}}" target="_blank">Ver localização no mapa</a> </p>
                                    </div>
                                </div>

                                {{-- Imagem --}}
                                <div class="col-md-6 d-inline-block">
                                    <div class="position-relative" style="width: 400px; height: 220px; margin-top: -3%; left: 55%; top: -85px;">
                                        <?php
                                        $filePath = 'storage/'.$p->painel->image_url;
                                        $originalImage = public_path($filePath);
                                        $reportImage = $originalImage;
                                        if(file_exists($originalImage) && filesize($originalImage) > 50000){
                                            $info = getimagesize($originalImage);
                                            if ($info['mime'] == 'image/jpeg') 
                                                $image = @imagecreatefromjpeg($originalImage);
                                            elseif ($info['mime'] == 'image/gif') 
                                                $image = @imagecreatefromgif($originalImage);
                                            elseif ($info['mime'] == 'image/png') 
                                                $image = @imagecreatefrompng($originalImage);
                                            $dir = public_path('storage/outdoorImages/'.$p->painel->identificacao);
                                            if(!is_dir($dir)) { @mkdir($dir, 0755, true); }
                                            $compressed = $dir."/CompressedJpgImage.jpg";
                                            imagejpeg($image, $compressed, 5);
                                            $reportImage = $compressed;
                                            $files = is_dir($dir) ? array_values(array_diff(scandir($dir), ['.', '..'])) : [];
                                            $files = array_map(fn($f) => $dir.'/'.$f, $files);
                                            $files = array_filter($files, 'is_file');
                                            usort($files, fn($a,$b) => filemtime($b) <=> filemtime($a));
                                            $toDelete = array_slice($files, 2);
                                            foreach($toDelete as $f){ @unlink($f); }
                                        }
                                    
                                        ?>
                                        <img class="img-relatorio border" src="{{$reportImage}}" alt="imagem_painel" style="border: 0.2px solid #666666; border-radius: 10px;">
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </td>
    </tr>

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
