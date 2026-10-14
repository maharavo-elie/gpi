<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Bloque une route si l'utilisateur authentifié ne possède aucun des rôles requis.
 * Usage : ->middleware('role:admin,gestionnaire_parc')
 * Renvoie toujours du JSON (403) car l'application est une SPA consommant /api.
 */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        $autorise = $user !== null && $user->roles->contains(
            fn ($role) => in_array($role->nom_role, $roles, true)
        );

        if (! $autorise) {
            return response()->json([
                'message' => 'Action non autorisée pour votre rôle.',
            ], 403);
        }

        return $next($request);
    }
}
