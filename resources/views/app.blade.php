<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <title>Mi proyecto React + Inertia</title>
    @viteReactRefresh
    @vite(['resources/css/app.css','resources/js/app.jsx'])
    @inertiaHead
</head>
<body>
    {{-- Aquí Inertia monta React --}}
    @inertia
</body>
</html>
