<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\JWTService;
use Symfony\Component\HttpFoundation\Response;

class JWTAuth
{
    private JWTService $jwtService;

    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token de acceso requerido'
            ], 401);
        }

        $decoded = $this->jwtService->validateToken($token);

        if (!$decoded) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido o expirado'
            ], 401);
        }

        // Buscar el usuario y añadirlo al request
        $user = \App\Models\User::find($decoded->sub);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 401);
        }

        // Añadir el usuario al request para que esté disponible en los controllers
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        // Añadir datos del token al request
        $request->merge([
            'jwt_data' => $decoded
        ]);

        return $next($request);
    }
}
