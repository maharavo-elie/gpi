<?php

namespace App\Http\Controllers;

use App\Services\AssistantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class AssistantController extends Controller
{
    public function ask(Request $request, AssistantService $assistant): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1200'],
            'historique' => ['sometimes', 'array', 'max:10'],
            'historique.*.role' => ['required', 'in:user,assistant'],
            'historique.*.content' => ['required', 'string', 'max:2500'],
            'page' => ['nullable', 'string', 'max:120'],
        ], [
            'message.required' => 'Posez une question.',
            'message.max' => 'La question est trop longue (1200 caractères maximum).',
        ]);

        $roles = $request->user()
            ?->roles()
            ->pluck('nom_role')
            ->all() ?? [];

        if (! $assistant->estConfigure()) {
            return response()->json([
                'reponse' => $assistant->repondreLocalement($data['message'], $data['page'] ?? null, $roles),
                'mode' => 'local',
            ]);
        }

        try {
            $reponse = $assistant->repondre(
                $data['message'],
                $data['historique'] ?? [],
                $data['page'] ?? null,
                $roles,
            );

            return response()->json([
                'reponse' => $reponse,
                'mode' => 'ia',
            ]);
        } catch (Throwable $e) {
            // Aucun contenu de conversation n'est journalisé.
            Log::error('Assistant GPI indisponible', [
                'exception' => get_class($e),
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'reponse' => $assistant->repondreLocalement($data['message'], $data['page'] ?? null, $roles),
                'mode' => 'local',
                'degraded' => true,
            ]);
        }
    }
}
