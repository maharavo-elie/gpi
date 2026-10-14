<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Equipement;
use App\Models\JournalActivite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Corbeille des ressources supprimées (soft-delete).
 *
 * Sections disponibles : équipements, agents (la liste s'étend via $sections).
 * L'écriture (restaurer / supprimer définitivement) reste réservée à
 * admin et gestionnaire_parc comme le reste du parc.
 */
class CorbeilleController extends Controller
{
    /** Sections de la corbeille : [clé => [modèle, relations, colonnes de libellé]]. */
    protected const SECTIONS = [
        'equipements' => [
            'model' => Equipement::class,
            'table' => null,              // table_concernee vomie depuis le modèle
            'relations' => ['modele.marque', 'categorie', 'localisation'],
            'libelle' => null,            // closure calculée via complement()
        ],
        'agents' => [
            'model' => Agent::class,
            'relations' => ['direction', 'service'],
            'libelle' => 'nom_complet',
        ],
    ];

    /** Liste tout le contenu de la corbeille, groupé par section. */
    public function index(): JsonResponse
    {
        $data = [];

        foreach (array_keys(self::SECTIONS) as $section) {
            $data[$section] = $this->query($section)
                ->orderBy('deleted_at', 'desc')
                ->get()
                ->map(fn ($item) => $this->formatter($section, $item));
        }

        return response()->json($data);
    }

    /** Restaure un élément corbeillé (il redevient visible normalement). */
    public function restaurer(string $section, int $id): JsonResponse
    {
        if (! $modelClass = $this->modelDe($section)) {
            return $this->sectionInconnue($section);
        }

        $item = $modelClass::onlyTrashed()->findOrFail($id);
        $item->deleted_by = null;
        $item->save();

        $item->restore();

        $this->journaliser($section, $item, 'restauration');

        return response()->json([
            'message' => 'Élément restauré avec succès.',
            'item' => $this->formatter($section, $item->fresh()),
        ]);
    }

    /** Suppression définitive (hard-delete) — irréversible. */
    public function supprimerDefinitivement(string $section, int $id): JsonResponse
    {
        if (! $modelClass = $this->modelDe($section)) {
            return $this->sectionInconnue($section);
        }

        $item = $modelClass::onlyTrashed()->findOrFail($id);

        // On garde une trace avant effacement définitif.
        $this->journaliser($section, $item, 'suppression définitive');

        $item->forceDelete();

        return response()->json(['message' => 'Élément supprimé définitivement.']);
    }

    /** Vide une section entière de la corbeille (suppression définitive). */
    public function viderSection(string $section): JsonResponse
    {
        if (! $modelClass = $this->modelDe($section)) {
            return $this->sectionInconnue($section);
        }

        $compte = $modelClass::onlyTrashed()->count();

        $modelClass::onlyTrashed()->get()->each(function ($item) use ($section) {
            $this->journaliser($section, $item, 'suppression définitive');
            $item->forceDelete();
        });

        return response()->json(['message' => "Section « {$section} » vidée : {$compte} élément(s) supprimé(s)."]);
    }

    // ================================================================= //
    // Helpers

    private function query(string $section)
    {
        return $this->modelDe($section)::onlyTrashed()->with(self::SECTIONS[$section]['relations']);
    }

    private function modelDe(string $section): ?string
    {
        return self::SECTIONS[$section]['model'] ?? null;
    }

    private function sectionInconnue(string $section): JsonResponse
    {
        return response()->json(['message' => "Section de corbeille inconnue : {$section}"], 404);
    }

    private function formatter(string $section, $item): array
    {
        $base = [
            'id' => $item->getKey(),
            'deleted_at' => $item->deleted_at,
            'deleted_by' => $item->deleted_by,
        ];

        if ($section === 'equipements') {
            return $base + [
                'code_inventaire' => $item->code_inventaire,
                'designation' => $item->designation,
                'marque' => $item->modele?->marque?->nom_marque ?? $item->marque?->nom_marque,
                'categorie' => $item->categorie?->nom_categorie,
                'localisation' => $item->localisation?->nom_localisation,
                'statut' => 'trashed',
            ];
        }

        // agents
        return $base + [
            'matricule' => $item->matricule,
            'nom_complet' => $item->nom_complet,
            'fonction' => $item->fonction,
            'direction' => $item->direction?->nom_direction,
            'service' => $item->service?->nom_service,
            'statut' => 'trashed',
        ];
    }

    /** Trace l'action dans journal_activites, même avant effacement définitif. */
    private function journaliser(string $section, $item, string $action): void
    {
        $table = $item->getTable();
        $user = auth()->user();

        JournalActivite::create([
            'action' => $action.' corbeille '.str($section)->replace('_', ' '),
            'table_concernee' => $table,
            'id_element' => $item->getKey(),
            'nouvelles_valeurs' => json_encode($item->getAttributes()),
            'adresse_ip' => request()->ip(),
            'id_utilisateur' => $user?->id_utilisateur,
        ]);
    }
}
