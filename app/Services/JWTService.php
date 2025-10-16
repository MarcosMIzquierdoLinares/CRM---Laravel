<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Carbon\Carbon;

class JWTService
{
    private string $secret;
    private int $expiration;

    public function __construct()
    {
        $this->secret = config('jwt.secret') ?? env('JWT_SECRET', 'your-secret-key');
        $this->expiration = config('jwt.expiration') ?? 3600; // 1 hora por defecto
    }

    /**
     * Generar token JWT para un usuario
     */
    public function generateToken($user): string
    {
        $payload = [
            'iss' => config('app.url'), // Issuer
            'aud' => config('app.url'), // Audience
            'iat' => Carbon::now()->timestamp, // Issued at
            'exp' => Carbon::now()->addSeconds($this->expiration)->timestamp, // Expiration
            'sub' => $user->id, // Subject (user ID)
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->toArray(),
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                'school_id' => $user->school_id,
            ]
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }

    /**
     * Validar token JWT
     */
    public function validateToken(string $token): ?object
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secret, 'HS256'));
            return $decoded;
        } catch (ExpiredException $e) {
            return null;
        } catch (SignatureInvalidException $e) {
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Refrescar token JWT
     */
    public function refreshToken(string $token): ?string
    {
        $decoded = $this->validateToken($token);
        
        if (!$decoded) {
            return null;
        }

        // Buscar el usuario por ID
        $user = \App\Models\User::find($decoded->sub);
        
        if (!$user) {
            return null;
        }

        return $this->generateToken($user);
    }

    /**
     * Extraer usuario del token
     */
    public function getUserFromToken(string $token): ?\App\Models\User
    {
        $decoded = $this->validateToken($token);
        
        if (!$decoded) {
            return null;
        }

        return \App\Models\User::find($decoded->sub);
    }

    /**
     * Verificar si el token ha expirado
     */
    public function isTokenExpired(string $token): bool
    {
        $decoded = $this->validateToken($token);
        return $decoded === null;
    }
}
