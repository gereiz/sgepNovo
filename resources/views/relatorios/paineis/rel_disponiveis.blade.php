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
    <h4 style="margin-top:-3%;">Painéis Disponíveis</h4>
    <h5>Bi-Semana: {{$numBisemana}} - {{$periodo}}</h5>
</div>

<div id="table-alerta">
    <h5><b><u>Esta disponibilidade está sujeita a alteração, sem aviso prévio.</b></u></h5>
</div>



<table style="page-break-after:always;">
    @php
        $panelIds = collect($paineis)->pluck('id')->unique()->toArray();

        // reservas por painel (só para saber quais bisemanas já estão ocupadas)
        $reservas = \App\Models\Reservas\Reserva::whereIn('outdoor_id', $panelIds)
            ->whereIn('bisemana_id', $bisemanas_ano)
            ->get()
            ->groupBy('outdoor_id');

        // pega todos os num_bisemana válidos do ano (ex: [1,2,3,...])
        $bisemanas_map = \App\Models\Bisemanas\Bisemana::whereIn('id', $bisemanas_ano)
            ->pluck('num_bisemana', 'id')
            ->toArray();
    @endphp

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
                        <h4 class="card-title">Identificação: {{$p->identificacao}}</h4>
                    </div>
                    <div class="card-body relatorio-body">
                        <div class="row d-flex">
                            <div class="col-md-12">

                               {{-- informações --}}
                                <div class="d-inline col-md-6">
                                    <div class="endereco-relatorio">
                                        <p><b>Localização:</b>  {{$p->logradouro}}, nº{{$p->numero}} - {{$p->bairro->nome}} / {{$p->bairro->regiao->cidade->nome}}</p>
                                        <p><b>Coordenadas:</b> <a href="https://maps.google.com/?q={{$p->latitude}},{{$p->longitude}}" target="_blank">Ver localização no mapa</a> </p>
                                        <p style="color: #B22222;"><i>@if ($p->tipo == 1)
                                            Painel Nobre (Reservas somente em combo)
                                            @else
                                            Painel Convencional
                                        @endif</i></p>

                                        @php
                                            // reservas deste painel
                                            $reservas_painel = $reservas[$p->id] ?? collect();

                                            // ids das bisemanas já reservadas neste painel
                                            $bisemanas_reservadas = $reservas_painel->pluck('bisemana_id')->unique()->toArray();

                                            // todas as bisemanas do ano
                                            $todas_bisemanas = collect($bisemanas_map);

                                            // remove as que já foram reservadas
                                            $num_bisemanas_disponiveis = $todas_bisemanas->except($bisemanas_reservadas)->values()->sort()->toArray();
                                        @endphp

                                        <p style="color: #B22222;">
                                            <i>
                                                Bi-semanas disponíveis:
                                                {{ empty($num_bisemanas_disponiveis) ? '—' : implode(', ', $num_bisemanas_disponiveis) }}
                                            </i>
                                        </p>
                                    </div>
                                </div>

                                {{-- Imagem --}}
                                <div class="d-inline col-md-6">
                                    <div style="margin-top: -18%;">
                                        <?php
                                        $filePath = 'storage/'.$p->image_url;
                                        $originalImage = public_path($filePath);
                                        $dir = public_path('storage/outdoorImages/'.$p->identificacao);
                                        $reportImage = $originalImage;
                                        if (is_dir($dir)) {
                                            $compressedCandidate = $dir.'/CompressedJpgImage.jpg';
                                            if (is_file($compressedCandidate)) {
                                                $reportImage = $compressedCandidate;
                                            } else {
                                                $files = array_values(array_diff(scandir($dir), ['.', '..']));
                                                $files = array_map(fn($f) => $dir.'/'.$f, $files);
                                                $files = array_filter($files, function ($f) {
                                                    return is_file($f);
                                                });
                                                usort($files, fn($a, $b) => filemtime($b) <=> filemtime($a));
                                                if (!empty($files)) {
                                                    $reportImage = $files[0];
                                                }
                                                try {
                                                    $info = @getimagesize($reportImage);
                                                    if ($info && isset($info['mime'])) {
                                                        $mime = strtolower($info['mime']);
                                                        $img = null;
                                                        if (in_array($mime, ['image/jpeg','image/jpg','image/pjpeg']) && function_exists('imagecreatefromjpeg')) {
                                                            $img = @imagecreatefromjpeg($reportImage);
                                                        } elseif ($mime === 'image/png' && function_exists('imagecreatefrompng')) {
                                                            $img = @imagecreatefrompng($reportImage);
                                                        } elseif ($mime === 'image/webp' && function_exists('imagecreatefromwebp')) {
                                                            $img = @imagecreatefromwebp($reportImage);
                                                        }
                                                        if ($img) {
                                                            $ow = imagesx($img);
                                                            $oh = imagesy($img);
                                                            $maxW = 800;
                                                            $scale = $ow > $maxW ? ($maxW / $ow) : 1;
                                                            $nw = max(1, (int)($ow * $scale));
                                                            $nh = max(1, (int)($oh * $scale));
                                                            $dstImg = imagecreatetruecolor($nw, $nh);
                                                            imagecopyresampled($dstImg, $img, 0, 0, 0, 0, $nw, $nh, $ow, $oh);
                                                            @imagejpeg($dstImg, $compressedCandidate, 65);
                                                            imagedestroy($dstImg);
                                                            imagedestroy($img);
                                                            $reportImage = $compressedCandidate;
                                                        }
                                                    }
                                                } catch (\Throwable $e) {
                                                }
                                            }
                                        }

                                        ?>
                                        <img class="img-relatorio" src="{{$reportImage}}" alt="imagem_painel">
                                    </div>
                                </div>


                            </div>

                        </div>

                        {{-- <div class="d-inline row">
                            <p class="d-inline card-text">{{$p->localizacao}}</p>
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





<div class="d-inline pagebreak"> </div>

<div class="d-inline col-md-12">
    <div>
        {{-- <p style="margin : 0; padding-top:0;"><b>Filtros Utilizados:</b></p> --}}
        {{-- <p style="margin : 0; padding-top:0;"><b>Bisemana: <i>{{$data}}</i></b></p> --}}
        <p style="margin : 0; padding-top:0;"><b>Status: <i>{{$status}}</i></b></p>
    </div>
</div>
