<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use App\Models\Equipement;
use App\Models\Mouvement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AffectationController extends CrudController
{
    protected function model(): string
    {
        return Affectation::class;
    }

    protected function label(): string
    {
        return 'affectation';
    }

    protected function withRelations(): array
    {
        return ['equipement.modele', 'agent.service'];
    }

    protected function rules(): array
    {
        return [
            'date_affectation' => ['required', 'date'],
            'date_fin' => ['nullable', 'date', 'after_or_equal:date_affectation'],
            'motif' => ['nullable', 'string'],
            'commentaire' => ['nullable', 'string'],
            'id_equipement' => ['required', 'exists:equipements,id_equipement'],
            'id_agent' => ['required', 'exists:agents,id_agent'],
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());

        $equipement = Equipement::findOrFail($data['id_equipement']);
        if (in_array($equipement->statut, ['reforme', 'perdu'])) {
            return response()->json([
                'message' => "Impossible d'affecter un matériel réformé ou perdu.",
            ], 422);
        }

        // Transaction + verrou : impossible d'avoir deux affectations actives
        // pour le même équipement, même en cas d'accès concurrent.
        $affectation = DB::transaction(function () use ($data, $equipement) {
            $active = Affectation::where('id_equipement', $data['id_equipement'])
                ->whereNull('date_fin')
                ->lockForUpdate()
                ->first();

            if ($active) {
                $active->update(['date_fin' => $data['date_affectation'], 'commentaire' => 'Réaffecté']);
            }

            $affectation = Affectation::create($data);

            $equipement->update(['statut' => 'en_service']);

            Mouvement::create([
                'type_mouvement' => 'affectation',
                'motif' => $data['motif'] ?? 'Affectation à un agent',
                'date_mouvement' => now(),
                'id_equipement' => $equipement->id_equipement,
                'id_utilisateur' => auth()->id(),
            ]);

            return $affectation;
        });

        $this->logAction('création', $affectation);

        return response()->json($affectation->load($this->withRelations()), 201);
    }

    public function restitution(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['commentaire' => ['nullable', 'string']]);

        $affectation = Affectation::findOrFail($id);

        if ($affectation->date_fin) {
            return response()->json([
                'message' => 'Cette affectation est déjà clôturée (restitution déjà enregistrée).',
            ], 409);
        }

        DB::transaction(function () use ($affectation, $data) {
            $affectation->update([
                'date_fin' => today(),
                'commentaire' => trim(($affectation->commentaire ? $affectation->commentaire.' — ' : '').($data['commentaire'] ?? 'Restitution')),
            ]);

            $equipement = Equipement::find($affectation->id_equipement);
            $equipement->update(['statut' => 'en_stock', 'id_localisation' => null]);

            Mouvement::create([
                'type_mouvement' => 'restitution',
                'motif' => 'Restitution au stock',
                'date_mouvement' => now(),
                'id_equipement' => $equipement->id_equipement,
                'id_utilisateur' => auth()->id(),
            ]);
        });

        $this->logAction('modification', $affectation);

        return response()->json($affectation->load($this->withRelations()));
    }
}
