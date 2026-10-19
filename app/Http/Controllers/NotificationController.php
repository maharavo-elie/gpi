<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Fil d'alertes de l'utilisateur courant + compteur de non-lues
     * (le badge de la cloche).
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::where('id_utilisateur', auth()->id())
            ->latest('id_notification')
            ->limit(30)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'non_lues' => Notification::where('id_utilisateur', auth()->id())->where('lu', false)->count(),
        ]);
    }

    /** Marque une notification de l'utilisateur connecté comme lue. */
    public function lire(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('id_utilisateur', auth()->id())->findOrFail($id);
        $notification->update(['lu' => true]);

        return response()->json($notification);
    }

    /** Tout marquer comme lu en un clic, uniquement ses propres notifications. */
    public function toutMarquerLire(Request $request): JsonResponse
    {
        Notification::where('id_utilisateur', auth()->id())
            ->where('lu', false)
            ->update(['lu' => true, 'updated_at' => now()]);

        return response()->json(['ok' => true]);
    }
}
