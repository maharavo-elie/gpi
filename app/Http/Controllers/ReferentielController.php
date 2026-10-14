<?php

namespace App\Http\Controllers;

use App\Models\Batiment;
use App\Models\Categorie;
use App\Models\Direction;
use App\Models\EtatEquipement;
use App\Models\Fournisseur;
use App\Models\Localisation;
use App\Models\Marque;
use App\Models\Modele;
use App\Models\Service;
use App\Models\Site;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Unique;

class ReferentielController extends Controller
{
    /**
     * Configuration des entités de référence modifiables depuis la page Paramètres.
     * type => [modèle, libellé, règles de validation, champs listés, relations, méta]
     * méta : clé primaire, colonnes de recherche « q », colonnes uniques à valider.
     */
    private function types(): array
    {
        return [
        'directions' => [
            Direction::class, 'direction',
            [
                'nom_direction' => ['required', 'string', 'max:150'],
                'code_direction' => ['nullable', 'string', 'max:20', Rule::unique('directions', 'code_direction')],
                'description' => ['nullable', 'string'],
                'telephone' => ['nullable', 'string', 'max:30'],
                'email' => ['nullable', 'email', 'max:150'],
                'statut' => ['nullable', Rule::in(['actif', 'inactif'])],
            ],
            ['id_direction', 'code_direction', 'nom_direction', 'email', 'telephone', 'statut'],
            [],
            ['key' => 'id_direction', 'search' => ['nom_direction', 'code_direction', 'email', 'telephone']],
        ],
        'services' => [
            Service::class, 'service',
            [
                'nom_service' => ['required', 'string', 'max:150'],
                'code_service' => ['nullable', 'string', 'max:20', Rule::unique('services', 'code_service')],
                'description' => ['nullable', 'string'],
                'statut' => ['nullable', Rule::in(['actif', 'inactif'])],
                'id_direction' => ['required', 'exists:directions,id_direction'],
            ],
            ['id_service', 'code_service', 'nom_service', 'statut', 'id_direction'],
            ['direction'],
            ['key' => 'id_service', 'search' => ['nom_service', 'code_service']],
        ],
        'categories' => [
            Categorie::class, 'catégorie',
            [
                'nom_categorie' => ['required', 'string', 'max:100'],
                'code_categorie' => ['nullable', 'string', 'max:20', Rule::unique('categories', 'code_categorie')],
                'description' => ['nullable', 'string'],
            ],
            ['id_categorie', 'code_categorie', 'nom_categorie', 'description'],
            [],
            ['key' => 'id_categorie', 'search' => ['nom_categorie', 'code_categorie', 'description']],
        ],
        'marques' => [
            Marque::class, 'marque',
            [
                'nom_marque' => ['required', 'string', 'max:100', Rule::unique('marques', 'nom_marque')],
                'description' => ['nullable', 'string'],
            ],
            ['id_marque', 'nom_marque', 'description'],
            [],
            ['key' => 'id_marque', 'search' => ['nom_marque', 'description']],
        ],
        'modeles' => [
            Modele::class, 'modèle',
            [
                'nom_modele' => ['required', 'string', 'max:150'],
                'reference_modele' => ['nullable', 'string', 'max:100', Rule::unique('modeles', 'reference_modele')],
                'description' => ['nullable', 'string'],
                'id_categorie' => ['nullable', 'exists:categories,id_categorie'],
                'id_marque' => ['nullable', 'exists:marques,id_marque'],
            ],
            ['id_modele', 'nom_modele', 'reference_modele', 'id_categorie', 'id_marque'],
            ['categorie', 'marque'],
            ['key' => 'id_modele', 'search' => ['nom_modele', 'reference_modele', 'description']],
        ],
        'sites' => [
            Site::class, 'site',
            [
                'nom_site' => ['required', 'string', 'max:150'],
                'ville' => ['nullable', 'string', 'max:100'],
                'code_site' => ['nullable', 'string', 'max:20', Rule::unique('sites', 'code_site')],
                'adresse' => ['nullable', 'string', 'max:255'],
                'telephone' => ['nullable', 'string', 'max:30'],
                'email' => ['nullable', 'email', 'max:150'],
                'statut' => ['nullable', Rule::in(['actif', 'inactif'])],
                'id_direction' => ['nullable', 'exists:directions,id_direction'],
            ],
            ['id_site', 'code_site', 'nom_site', 'adresse', 'telephone', 'email', 'statut'],
            [],
            ['key' => 'id_site', 'search' => ['nom_site', 'code_site', 'ville', 'adresse', 'email', 'telephone']],
        ],
        'batiments' => [
            Batiment::class, 'bâtiment',
            [
                'nom_batiment' => ['required', 'string', 'max:150'],
                'code_batiment' => ['nullable', 'string', 'max:20', Rule::unique('batiments', 'code_batiment')],
                'description' => ['nullable', 'string'],
                'statut' => ['nullable', Rule::in(['actif', 'inactif'])],
                'id_site' => ['required', 'exists:sites,id_site'],
            ],
            ['id_batiment', 'code_batiment', 'nom_batiment', 'statut', 'id_site'],
            ['site'],
            ['key' => 'id_batiment', 'search' => ['nom_batiment', 'code_batiment']],
        ],
        'localisations' => [
            Localisation::class, 'localisation',
            [
                'nom_localisation' => ['required', 'string', 'max:150'],
                'code_localisation' => ['nullable', 'string', 'max:30', Rule::unique('localisations', 'code_localisation')],
                'etage' => ['nullable', 'string', 'max:50'],
                'bureau' => ['nullable', 'string', 'max:50'],
                'description' => ['nullable', 'string'],
                'statut' => ['nullable', Rule::in(['actif', 'inactif'])],
                'id_batiment' => ['required', 'exists:batiments,id_batiment'],
                'id_direction' => ['nullable', 'exists:directions,id_direction'],
            ],
            ['id_localisation', 'code_localisation', 'nom_localisation', 'etage', 'bureau', 'statut', 'id_batiment'],
            ['batiment.site'],
            ['key' => 'id_localisation', 'search' => ['nom_localisation', 'code_localisation', 'etage', 'bureau']],
        ],
        'etats' => [
            EtatEquipement::class, 'état',
            [
                'nom_etat' => ['required', 'string', 'max:100', Rule::unique('etat_equipements', 'nom_etat')],
                'description' => ['nullable', 'string'],
            ],
            ['id_etat', 'nom_etat', 'description'],
            [],
            ['key' => 'id_etat', 'search' => ['nom_etat', 'description']],
        ],
        'fournisseurs' => [
            Fournisseur::class, 'fournisseur',
            [
                'raison_sociale' => ['required', 'string', 'max:200'],
                'contact' => ['nullable', 'string', 'max:100'],
                'telephone' => ['nullable', 'string', 'max:30'],
                'email' => ['nullable', 'email', 'max:150'],
                'adresse' => ['nullable', 'string', 'max:255'],
                'rcs' => ['nullable', 'string', 'max:50'],
            ],
            ['id_fournisseur', 'raison_sociale', 'contact', 'telephone', 'email', 'adresse', 'rcs'],
            [],
            ['key' => 'id_fournisseur', 'search' => ['raison_sociale', 'contact', 'email', 'rcs', 'telephone', 'adresse']],
        ],
        ];
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'directions' => Direction::orderBy('nom_direction')->get(),
            'services' => Service::with('direction')->orderBy('nom_service')->get(),
            'sites' => Site::with('batiments.localisations')->orderBy('nom_site')->get(),
            'batiments' => Batiment::with('site')->orderBy('nom_batiment')->get(),
            'localisations' => Localisation::with('batiment.site')->orderBy('nom_localisation')->get(),
            'categories' => Categorie::orderBy('nom_categorie')->get(),
            'marques' => Marque::orderBy('nom_marque')->get(),
            'modeles' => Modele::with('categorie', 'marque')->orderBy('nom_modele')->get(),
            'etats' => EtatEquipement::orderBy('nom_etat')->get(),
            'fournisseurs' => Fournisseur::orderBy('raison_sociale')->get(),
            'equipementsMini' => \App\Models\Equipement::orderBy('code_inventaire')->get(['id_equipement', 'code_inventaire', 'designation']),
            'typeMaintenances' => \App\Models\TypeMaintenance::orderBy('nom_type')->get(['id_type_maintenance', 'nom_type']),
        ]);
    }

    private function config(string $type): array
    {
        $types = $this->types();
        if (! isset($types[$type])) {
            abort(404, "Type de référentiel inconnu : {$type}");
        }

        return $types[$type];
    }

    /** Liste d'un référentiel (GET /referentiel/{type}). */
    public function liste(string $type): JsonResponse
    {
        [$model, , , , $with, $meta] = $this->config($type);

        $query = $model::query();

        if (! empty($with)) {
            $query->with($with);
        }

        if (request()->filled('q')) {
            $s = request()->string('q');
            $colonnes = $meta['search'] ?? [];
            if ($colonnes !== []) {
                $query->where(fn ($sub) => collect($colonnes)->each(
                    fn ($colonne) => $sub->orWhere($colonne, 'like', "%{$s}%")
                ));
            }
        }

        if (request()->filled('statut') && \Schema::hasColumn((new $model)->getTable(), 'statut')) {
            $query->where('statut', request()->input('statut'));
        }

        return response()->json($query->get());
    }

    /** Injecte l'ignore() sur les règles unique lors d'une mise à jour. */
    private function reglesPourEdition(array $rules, string $clePrimaire, int $id): array
    {
        return collect($rules)->map(fn ($contraintes) => array_map(
            fn ($r) => $r instanceof Unique ? $r->ignore($id, $clePrimaire) : $r,
            $contraintes
        ))->all();
    }

    public function store(Request $request, string $type): JsonResponse
    {
        [$model, $label, $rules, , $with] = $this->config($type);

        $data = $request->validate($rules);
        $item = $model::create($data);

        return response()->json($item->load($with), 201);
    }

    public function update(Request $request, string $type, int $id): JsonResponse
    {
        [$model, $label, $rules, , $with, $meta] = $this->config($type);

        $item = $model::findOrFail($id);
        $data = $request->validate($this->reglesPourEdition($rules, $meta['key'], $id));
        $item->update($data);

        return response()->json($item->load($with));
    }

    public function destroy(string $type, int $id): JsonResponse
    {
        [$model, $label] = $this->config($type);

        $item = $model::findOrFail($id);

        try {
            $item->delete();
        } catch (\Illuminate\Database\QueryException $e) {
            if ((int) $e->getCode() === 23000 || str_contains($e->getMessage(), 'Integrity constraint')) {
                return response()->json([
                    'message' => "Impossible de supprimer ce(tte) {$label} : des éléments y sont encore rattachés.",
                ], 409);
            }
            throw $e;
        }

        return response()->json(['message' => ucfirst($label).' supprimé(e)']);
    }
}
