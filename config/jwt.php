<?php

return [
    /*
    |--------------------------------------------------------------------------
    | JWT Secret Key
    |--------------------------------------------------------------------------
    |
    | Esta es la clave secreta utilizada para firmar los tokens JWT.
    | Debe ser una cadena segura y única.
    |
    */

    'secret' => env('JWT_SECRET', 'your-secret-key-change-this-in-production'),

    /*
    |--------------------------------------------------------------------------
    | JWT Expiration Time
    |--------------------------------------------------------------------------
    |
    | Tiempo de expiración del token en segundos.
    | Por defecto 3600 segundos (1 hora).
    |
    */

    'expiration' => env('JWT_EXPIRATION', 3600),

    /*
    |--------------------------------------------------------------------------
    | JWT Refresh Token Expiration
    |--------------------------------------------------------------------------
    |
    | Tiempo de expiración del refresh token en segundos.
    | Por defecto 604800 segundos (7 días).
    |
    */

    'refresh_expiration' => env('JWT_REFRESH_EXPIRATION', 604800),

    /*
    |--------------------------------------------------------------------------
    | JWT Algorithm
    |--------------------------------------------------------------------------
    |
    | Algoritmo utilizado para firmar los tokens JWT.
    | Por defecto HS256.
    |
    */

    'algorithm' => env('JWT_ALGORITHM', 'HS256'),
];
