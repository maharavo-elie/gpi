<?php

namespace App\Http\Controllers;

use App\Models\Equipement;
use App\Models\Localisation;
use App\Models\Mouvement;
use App\Models\MouvementHistorique;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EquipementController extends CrudController
{
    protected function model(): string
    {
        return Equipement::class;
    }

    protected function label(): string
    {
        return 'équipement';
    }

    protected function withRelations(): array
    {
        return ['modele.categorie', 'modele.marque', 'categorie', 'marque', 'direction', 'service', 'fournisseur', 'localisation.batiment.site', 'etat'];
    }

    protected function rules(): array
    {
        return [
            'code_inventaire' => ['required', 'string', 'max:50', Rule::unique('equipements', 'code_inventaire')->ignore($this->routeId(), 'id_equipement')],
            'numero_serie' => ['nullable', 'string', 'max:100', Rule::unique('equipements', 'numero_serie')->ignore($this->routeId(), 'id_equipement')],
            'designation' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'date_acquisition' => ['nullable', 'date'],
            'date_mise_service' => ['nullable', 'date'],
            'prix_acquisition' => ['nullable', 'numeric', 'min:0'],
            'garantie_debut' => ['nullable', 'date'],
            'garantie_fin' => ['nullable', 'date', 'after_or_equal:garantie_debut'],
            'statut' => ['required', Rule::in(['en_service', 'en_stock', 'en_maintenance', 'reforme', 'perdu', 'reserve'])],
            'id_modele' => ['nullable', 'exists:modeles,id_modele'],
            'id_categorie' => ['nullable', 'exists:categories,id_categorie'],
            'id_marque' => ['nullable', 'exists:marques,id_marque'],
            'id_direction' => ['nullable', 'exists:directions,id_direction'],
            'id_service' => ['nullable', 'exists:services,id_service'],
            'id_fournisseur' => ['nullable', 'exists:fournisseurs,id_fournisseur'],
            'id_localisation' => ['nullable', 'exists:localisations,id_localisation'],
            'id_etat' => ['nullable', 'exists:etat_equipements,id_etat'],
        ];
    }

    private function routeId(): ?int
    {
        return request()->route('equipement');
    }

    public function index(Request $request): JsonResponse
    {
        $query = Equipement::query()->with($this->withRelations());

        if ($request->filled('q')) {
            $q = $request->string('q');
            $query->where(fn ($sub) => $sub
                ->where('code_inventaire', 'like', "%{$q}%")
                ->orWhere('numero_serie', 'like', "%{$q}%")
                ->orWhere('designation', 'like', "%{$q}%"));
        }

        foreach (['statut', 'id_categorie', 'id_marque', 'id_direction', 'id_service', 'id_localisation'] as $filter) {
            if ($request->filled($filter)) {
                $query->where($filter, $request->input($filter));
            }
        }

        $perPage = min((int) $request->input('per_page', 15), 100);

        return response()->json($query->orderBy('code_inventaire')->paginate($perPage));
    }

    public function show(int $id): JsonResponse
    {
        $equipement = Equipement::with(array_merge($this->withRelations(), [
            'affectations.agent.direction',
            'affectations.agent.service',
            'maintenances.type',
            'tickets',
            'mouvements.utilisateur',
            'documents',
            'installations.logiciel',
        ]))->findOrFail($id);

        return response()->json($equipement);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());
        $equipement = Equipement::create($data);

        Mouvement::create([
            'type_mouvement' => 'stock',
            'motif' => 'Création de la fiche équipement',
            'date_mouvement' => now(),
            'id_equipement' => $equipement->id_equipement,
            'id_utilisateur' => auth()->id(),
        ]);

        $this->logAction('création', $equipement);

        return response()->json($equipement->load($this->withRelations()), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $equipement = Equipement::findOrFail($id);
        $data = $request->validate($this->rules());

        if (! empty($data['id_localisation']) && $data['id_localisation'] != $equipement->id_localisation) {
            $mouvement = Mouvement::create([
                'type_mouvement' => 'transfert',
                'motif' => 'Changement de localisation',
                'ancienne_localisation' => $equipement->id_localisation,
                'nouvelle_localisation' => $data['id_localisation'],
                'date_mouvement' => now(),
                'id_equipement' => $equipement->id_equipement,
                'id_utilisateur' => auth()->id(),
            ]);

            MouvementHistorique::create([
                'table_concernee' => 'equipements',
                'id_enregistrement' => $equipement->id_equipement,
                'champ' => 'id_localisation',
                'ancienne_valeur' => $equipement->localisation?->code_localisation,
                'nouvelle_valeur' => Localisation::find($data['id_localisation'])?->code_localisation,
                'id_mouvement' => $mouvement->id_mouvement,
                'id_utilisateur' => auth()->id(),
            ]);
        }

        $equipement->update($data);
        $this->logAction('modification', $equipement);

        return response()->json($equipement->load($this->withRelations()));
    }
}
