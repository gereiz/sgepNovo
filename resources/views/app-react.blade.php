<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="overflow-x-hidden max-w-[100vw] w-full">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', '') }} • React</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700,800&display=swap" rel="stylesheet" />

        <!-- Scripts (React Entrypoint) -->
        @routes
        @vite(['resources/css/app.css', 'resources/js/app-react.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-[#f3f4f5] text-[#191c1d] overflow-x-hidden max-w-[100vw] w-full">
        @inertia
    </body>
</html>
