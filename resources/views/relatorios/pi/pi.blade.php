<html lang="en">
<head>
    <title>Invoice</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
</head>
<body class="font-['Inter']">

    {{-- Completa os 5 digitos do id da PI com zeros a esquerda --}}
    @php
        $num = str_pad($pi->id, 4, '0', STR_PAD_LEFT);
    @endphp

    @include('relatorios.includes.header', ['titulo' => 'PEDIDO DE INSERÇÃO', 'doc' => 'PI', 'num' => $num])

    @include('relatorios.pi.autorizacao_servico')

    @include('relatorios.pi.descricao_servico')

    @include('relatorios.pi.totais')

    @include('relatorios.pi.assinaturas')

</body>
</html>