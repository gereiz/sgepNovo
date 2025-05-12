<link rel="stylesheet" href="{{public_path('assets/vendor/css/rtl/bootstrap.css')}}"> 
<link rel="stylesheet" href="{{public_path('assets/css/relatorios.css')}}"> 

<style>

    @page {
        margin: 2cm;
    }

    .relatorio {
        margin-left: -30px;
        margin-bottom: 20px!important;
        width: 735px;
        height: 280px;
        page-break-inside: avoid;
    }

    .no-space{
        margin-top: 0px;
        margin-bottom: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
    }

    #tabletitulo {
        text-align: center;
        max-width: 750px!important;
        margin-bottom: 30px;
        margin-top: 0;
        height: 130px;
        background-color: #e4e4e4;
        border: 1px solid;
        padding: 15px;
    }
 
    .relatorio-body {
        display: flex;
        padding: 15px;
    }

    .img-relatorio {
        position: relative;
        top: -85px;
        left: 63%;
        width: 250px;
        height: 180px;
        border: 1px solid!important;
        object-fit: cover;
    }

    .endereco-relatorio{
        max-width: 390px;
        margin-top: 10px;
    }

    .login_logo {
        width: 150px;
        position: relative;
        left: -35%;
        top: 20%;
    }

    #table-alerta {
        margin-bottom: 20px;
    }

    #table-alerta h5 {
        color: #B22222;
        text-align: center;
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

<!-- <style>
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
        content: "página " counter(page) " de 2";
    }

    .page-break {
        page-break-before: always;
    }
</style> -->
 
@include('relatorios.includes.rel_header', ['titulo' => 'PAINÉIS POR BI-SEMANA', 'doc' => 'REL', 'num' => 0])

<div id="table-alerta">
    <h5><b><u>Esta disponibilidade está sujeita a alteração, sem aviso prévio.</b></u></h5>
</div>
    <div>

    
    </div>
    @foreach($paineisPorCidade as $cidade => $regioes)
        <div class="card-title">{{ $cidade }}</div>
            @foreach($regioes as $regiao => $bairros)
                <div class="regiao">{{ $regiao }}</div>
                @foreach($bairros as $bairro => $paineis)
                    <div class="bairro">{{ $bairro }}</div>
                    <div class="painel">
                        <table>
                            <thead>
                                <tr>
                                    <th>identificação</th>
                                    <th>Logradouro</th>
                                    <th>Ponto de Referência</th>
                                    <th>Cliente</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($paineis as $painel)
                                    <tr>
                                        <td>{{ $painel->identificacao }}</td>
                                        <td>{{ $painel->logradouro }}</td>
                                        <td>{{ $painel->ponto_referencia }}</td>
                                        <td>{{ $painel->cliente }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endforeach
            @endforeach
    @endforeach
</body>
</html>