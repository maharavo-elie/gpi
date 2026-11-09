<?php

namespace App\Http\Controllers;

use App\Models\Equipement;
use App\Models\InventaireDetail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventaireController extends Controller
{
    public function details(): JsonResponse
    {
        return response()->json(
            InventaireDetail::with(['inventaire', 'equipement'])
                ->orderBy('id_inventaire')
                ->orderBy('id_detail')
                ->get()
        );
    }

    /**
     * GET /api/inventaire-parc?q&statut&id_categorie&id_marque&id_etat&id_direction
     *                       &id_service&id_site&date_acquisition_debut&date_acquisition_fin
     *                       &tri&desc
     *
     * Vue d'inventaire par matériel : pour chaque équipement, son rattachement
     * courant (agent / service / direction / centre), sa date d'acquisition,
     * son état, le nombre d'interventions et d'affectations — avec filtres,
     * tri, récapitulatif global et statistiques de la sélection.
     */
    public function parc(Request $request): JsonResponse
    {
        [$equipements, $actif] = $this->lignesParc($request);

        return response()->json([
            'rows' => $equipements->map($this->ligneJson())->values(),
            'stats' => $this->statsParc($equipements),
            'tris' => $this->trisDisponibles(),
            'tri_actif' => $actif['tri'],
            'sens_tri' => $actif['desc'] ? 'desc' : 'asc',
        ]);
    }

    /**
     * GET /api/inventaire-parc/pdf
     * Récapitulatif global imprimable de l'inventaire du parc, reprenant
     * tous les filtres actifs de la vue (en-tête DGSR).
     */
    public function parcPdf(Request $request)
    {
        [$equipements, $actif] = $this->lignesParc($request, 300);
        $user = auth()->user();
        $stats = $this->statsParc($equipements);

        $filtres = [];
        if ($request->filled('q')) {
            $filtres[] = 'Recherche : « '.$request->string('q').' »';
        }
        if ($request->filled('statut')) {
            $filtres[] = 'Statut : '.$this->libellesStatuts()[$request->input('statut')] ?? $request->input('statut');
        }
        if ($request->filled('date_acquisition_debut') || $request->filled('date_acquisition_fin')) {
            $filtres[] = 'Acquisition du '.($request->input('date_acquisition_debut') ?: '…')
                .' au '.($request->input('date_acquisition_fin') ?: '…');
        }
        foreach (['id_categorie' => 'catégorie', 'id_marque' => 'marque', 'id_etat' => 'état',
            'id_direction' => 'direction', 'id_service' => 'service', 'id_site' => 'centre'] as $cle => $nom) {
            if ($request->filled($cle)) {
                $filtres[] = ucfirst($nom).' : n°'.$request->input($cle);
            }
        }

        $pdf = Pdf::loadView('rapports.ressource', [
            'editeur' => $user?->nom_complet ?? $user?->username ?? 'Système',
            'fonction' => $user?->agent?->fonction ?? 'Administration du parc',
            'titreRegistre' => 'Inventaire récapitulatif du parc',
            'prefixeRef' => 'GPI/RPT/INVP/',
            'descriptionFiltres' => $filtres ? implode(' — ', $filtres) : 'Tout le parc — sans filtre',
            'colonnes' => [
                'Code', 'Matériel', 'Marque / modèle', 'État', 'Statut', 'Agent',
                'Service', 'Centre', 'Acquisition', 'Inter.', 'Affect.', 'Valeur',
            ],
            'largeurs' => [11, 17, 13, 7, 9, 11, 10, 8, 8, 4, 4, 9],
            'lignes' => $equipements->map(function (Equipement $e) {
                return [
                    $e->code_inventaire,
                    $e->designation,
                    $this->libelleModele($e) ?: '—',
                    $e->etat?->nom_etat ?? '—',
                    $this->libellesStatuts()[$e->statut] ?? $e->statut,
                    $e->affectationActive?->agent?->nom_complet ?? '—',
                    $e->affectationActive?->agent?->service?->nom_service ?? $e->service?->nom_service ?? '—',
                    $e->localisation?->batiment?->site?->nom_site ?? 'Stock central',
                    $e->date_acquisition?->format('d/m/Y') ?? '—',
                    $e->maintenances_count,
                    $e->affectations_count,
                    $e->prix_acquisition ? number_format((float) $e->prix_acquisition, 0, ',', ' ').' Ar' : '—',
                ];
            }),
        ])->setPaper('a4', 'landscape');

        $pdf->render();

        return Pdf::loadView('rapports.ressource', [
            'editeur' => $user?->nom_complet ?? $user?->username ?? 'Système',
            'fonction' => $user?->agent?->fonction ?? 'Administration du parc',
            'titreRegistre' => 'Inventaire récapitulatif du parc',
            'prefixeRef' => 'GPI/RPT/INVP/',
            'descriptionFiltres' => $filtres ? implode(' — ', $filtres) : 'Tout le parc — sans filtre',
            'colonnes' => [
                'Code', 'Matériel', 'Marque / modèle', 'État', 'Statut', 'Agent',
                'Service', 'Centre', 'Acquisition', 'Inter.', 'Affect.', 'Valeur',
            ],
            'largeurs' => [11, 17, 13, 7, 9, 11, 10, 8, 8, 4, 4, 9],
            'lignes' => $equipements->map(function (Equipement $e) {
                return [
                    $e->code_inventaire,
                    $e->designation,
                    $this->libelleModele($e) ?: '—',
                    $e->etat?->nom_etat ?? '—',
                    $this->libellesStatuts()[$e->statut] ?? $e->statut,
                    $e->affectationActive?->agent?->nom_complet ?? '—',
                    $e->affectationActive?->agent?->service?->nom_service ?? $e->service?->nom_service ?? '—',
                    $e->localisation?->batiment?->site?->nom_site ?? 'Stock central',
                    $e->date_acquisition?->format('d/m/Y') ?? '—',
                    $e->maintenances_count,
                    $e->affectations_count,
                    $e->prix_acquisition ? number_format((float) $e->prix_acquisition, 0, ',', ' ').' Ar' : '—',
                ];
            }),
            'totalPages' => $pdf->getCanvas()->get_page_count(),
        ])->setPaper('a4', 'landscape')
            ->download('inventaire_parc_'.now()->format('Y-m-d').'.pdf');
    }

    /* ============================================================
       Cœur de la vue parc : requête filtrée + triée, partagée entre
       l'API JSON et le rendu PDF.
       ============================================================ */

    /**
     * @return array{0: \Illuminate\Support\Collection<int, Equipement>, 1: array{tri: string, desc: bool}}
     */
    private function lignesParc(Request $request, ?int $limite = null): array
    {
        $query = $this->requeteParc($request);

        $colonnesTri = [
            'code' => ['code_inventaire', false],
            'designation' => ['designation', false],
            'date_acquisition' => ['date_acquisition', false],
            'statut' => ['statut', false],
            'interventions' => ['maintenances_count', true],
            'affectations' => ['affectations_count', true],
        ];
        $tri = $request->input('tri', 'code');
        $triRelationnels = ['service', 'direction', 'centre', 'etat'];
        if (! isset($colonnesTri[$tri]) && ! in_array($tri, $triRelationnels, true)) {
            $tri = 'code';
        }
        // Par défaut, les décomptes se lisent du plus grand au plus petit,
        // les autres champs du plus petit au plus grand.
        $desc = $request->filled('desc')
            ? $request->boolean('desc')
            : ($colonnesTri[$tri][1] ?? false);
        if (! $request->filled('tri')) {
            return [$query->orderBy('code_inventaire')->orderBy('id_equipement')->take($limite)->get(), ['tri' => 'code', 'desc' => false]];
        }

        // Service, direction, centre et état sont des libellés portés par des
        // relations : le tri se fait sur la collection filtrée (parc modéré).
        if (in_array($tri, $triRelationnels, true)) {
            $libelle = match ($tri) {
                'service' => fn (Equipement $e) => $e->affectationActive?->agent?->service?->nom_service
                    ?? $e->service?->nom_service ?? '',
                'direction' => fn (Equipement $e) => $e->affectationActive?->agent?->direction?->nom_direction
                    ?? $e->direction?->nom_direction ?? '',
                'centre' => fn (Equipement $e) => $e->localisation?->batiment?->site?->nom_site ?? 'Stock central',
                'etat' => fn (Equipement $e) => $e->etat?->nom_etat ?? '',
            };
            $lignes = $query->get();
            $lignes = $desc ? $lignes->sortByDesc($libelle) : $lignes->sortBy($libelle);
            if ($limite) {
                $lignes = $lignes->take($limite);
            }

            return [$lignes->values(), ['tri' => $tri, 'desc' => $desc]];
        }

        [$champ, $descDefaut] = $colonnesTri[$tri];
        if (! $request->filled('desc')) {
            $desc = $descDefaut;
        }

        $query = $query->orderBy($champ, $desc ? 'desc' : 'asc')->orderBy('code_inventaire');
        if ($limite) {
            $query->limit($limite);
        }

        return [$query->get(), ['tri' => $tri, 'desc' => $desc]];
    }

    /** Requête de base de la vue parc : relations, décomptes et filtres. */
    private function requeteParc(Request $request)
    {
        $query = Equipement::query()
            ->with([
                'categorie', 'marque', 'modele',
                'direction', 'service',
                'localisation.batiment.site', 'etat',
                'affectationActive.agent',
                'affectationActive.agent.direction',
                'affectationActive.agent.service',
            ])
            ->withCount(['maintenances', 'affectations']);

        if ($request->filled('q')) {
            $q = $request->string('q');
            $query->where(fn ($sub) => $sub
                ->where('code_inventaire', 'like', "%{$q}%")
                ->orWhere('numero_serie', 'like', "%{$q}%")
                ->orWhere('designation', 'like', "%{$q}%"));
        }
        foreach (['statut', 'id_categorie', 'id_marque', 'id_etat', 'id_direction', 'id_service'] as $filtre) {
            if ($request->filled($filtre)) {
                $query->where($filtre, $request->input($filtre));
            }
        }
        // Centre : site (localisation → bâtiment → site) où se trouve le matériel.
        if ($request->filled('id_site')) {
            $query->whereHas('localisation.batiment', fn ($b) => $b->where('id_site', $request->input('id_site')));
        }
        if ($request->filled('date_acquisition_debut')) {
            $query->whereDate('date_acquisition', '>=', $request->input('date_acquisition_debut'));
        }
        if ($request->filled('date_acquisition_fin')) {
            $query->whereDate('date_acquisition', '<=', $request->input('date_acquisition_fin'));
        }

        return $query;
    }

    /** Transformateur équipement → ligne JSON de la vue parc. */
    private function ligneJson(): \Closure
    {
        return function (Equipement $e) {
            $agent = $e->affectationActive?->agent;

            return [
                'id_equipement' => $e->id_equipement,
                'code_inventaire' => $e->code_inventaire,
                'designation' => $e->designation,
                'categorie' => $e->categorie?->nom_categorie,
                'libelle_modele' => $this->libelleModele($e) ?: null,
                'etat' => $e->etat?->nom_etat,
                'statut' => $e->statut,
                'date_acquisition' => $e->date_acquisition?->toDateString(),
                'prix_acquisition' => $e->prix_acquisition !== null ? (float) $e->prix_acquisition : null,
                // Rattachement réel = affectation active si elle existe, sinon
                // le rattachement de la fiche (rappel du parc).
                'direction' => $agent?->direction?->nom_direction ?? $e->direction?->nom_direction,
                'service' => $agent?->service?->nom_service ?? $e->service?->nom_service,
                'agent' => $agent ? trim(($agent->prenom ?? '').' '.($agent->nom_naiss ?? '')) ?: null : null,
                'centre' => $e->localisation?->batiment?->site?->nom_site,
                'localisation' => $e->localisation?->nom_localisation,
                'nb_interventions' => (int) $e->maintenances_count,
                'nb_affectations' => (int) $e->affectations_count,
            ];
        };
    }

    /** Libellés de tri proposés au front. */
    private function trisDisponibles(): array
    {
        return [
            'code' => 'Code inventaire',
            'designation' => 'Désignation',
            'date_acquisition' => "Date d'acquisition",
            'statut' => 'Statut',
            'interventions' => "Nombre d'interventions",
            'affectations' => "Nombre d'affectations",
            'service' => 'Service',
            'direction' => 'Direction',
            'centre' => 'Centre',
            'etat' => 'État',
        ];
    }

    /**
     * Récapitulatif global + statistiques de la sélection courante
     * (après application des filtres).
     */
    private function statsParc($equipements): array
    {
        return [
            'total_materiels' => $equipements->count(),
            'valeur_totale' => (float) $equipements->sum('prix_acquisition'),
            'en_service' => $equipements->where('statut', 'en_service')->count(),
            'en_stock' => $equipements->where('statut', 'en_stock')->count(),
            'en_maintenance' => $equipements->where('statut', 'en_maintenance')->count(),
            'hors_service' => $equipements->whereIn('statut', ['reforme', 'perdu'])->count(),
            'affectes_actifs' => $equipements->filter(fn (Equipement $e) => $e->affectationActive !== null)->count(),
            'interventions_total' => (int) $equipements->sum('maintenances_count'),
            'affectations_total' => (int) $equipements->sum('affectations_count'),
            'par_statut' => $equipements->groupBy('statut')->map->count(),
            'par_categorie' => $equipements->groupBy(fn (Equipement $e) => $e->categorie?->nom_categorie ?? 'Sans catégorie')->map->count()->sortDesc(),
            'par_centre' => $equipements->groupBy(fn (Equipement $e) => $e->localisation?->batiment?->site?->nom_site ?? 'Stock central')->map->count()->sortDesc(),
        ];
    }

    /** Marque + modèle, sans doublon quand le nom du modèle contient déjà la marque. */
    private function libelleModele(Equipement $e): string
    {
        $nom = $e->modele?->nom_modele ?? '';
        $marque = $e->marque?->nom_marque ?? '';

        return $marque && ! str_starts_with(mb_strtolower($nom), mb_strtolower($marque))
            ? trim($marque.' '.$nom)
            : $nom;
    }

    /** Libellés des statuts d'équipement (cohérents avec RapportController). */
    private function libellesStatuts(): array
    {
        return [
            'en_service' => 'En service',
            'en_stock' => 'En stock',
            'en_maintenance' => 'En maintenance',
            'reforme' => 'Réformé',
            'perdu' => 'Perdu',
            'reserve' => 'Réservé',
        ];
    }
}
