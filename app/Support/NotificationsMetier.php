<?php

namespace App\Support;

use App\Models\Agent;
use App\Models\Notification;
use App\Models\Role;
use App\Models\Utilisateur;

/**
 * Canal applicatif de notifications : à la différence du journal d'activités
 * (trace exhaustive de qui-a-fait-quoi), une notification vise un destinataire
 * précis et doit inciter à agir (nouveaux tickets, fin d'intervention…).
 */
class NotificationsMetier
{
    /**
     * Crée une notification pour chaque utilisateur listé (l'auteur exclu).
     *
     * @param  array<int, int|null>  $idsUtilisateurs
     */
    public static function notifier(array $idsUtilisateurs, string $titre, string $message, string $type = 'info'): void
    {
        $ids = array_filter(array_unique($idsUtilisateurs), fn ($id) => $id !== null && $id !== (int) auth()->id());

        if ($ids === []) {
            return;
        }

        Notification::insert(array_map(function (int $id) use ($titre, $message, $type) {
            return [
                'titre' => $titre,
                'message' => $message,
                'type' => $type,
                'lu' => false,
                'date_creation' => now(),
                'id_utilisateur' => $id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }, $ids));
    }

    /** Tous les utilisateurs porteurs des rôles cités (ex. ['admin', 'gestionnaire_parc']). */
    public static function idsParRoles(array $nomsRoles): array
    {
        return Utilisateur::whereHas('roles', fn ($q) => $q->whereIn('nom_role', $nomsRoles))
            ->pluck('id_utilisateur')
            ->all();
    }

    /** L'utilisateur du parc rattaché à un agent métier (le « déclarant » d'un ticket), s'il existe. */
    public static function idUtilisateurDeAgent(?int $idAgent): ?int
    {
        if ($idAgent === null) {
            return null;
        }

        return Utilisateur::where('id_agent', $idAgent)->value('id_utilisateur');
    }
}
