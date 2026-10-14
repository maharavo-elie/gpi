<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Achat;
use App\Models\Affectation;
use App\Models\Equipement;
use App\Models\Inventaire;
use App\Models\JournalActivite;
use App\Models\Logiciel;
use App\Models\Maintenance;
use App\Models\Mouvement;
use App\Models\MouvementHistorique;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RapportController extends Controller
{
    /**
     * GET /api/rapports/synthese?date_debut&date_fin
     * Vue consolidée : compteurs KPI, flux mensuels, top équipements, ventilations.
     */
    public function synthese(Request $request): JsonResponse
    {
        return response()->json($this->syntheseData($request));
    }

    /** Données de synthèse partagées entre l'API JSON et le rendu PDF. */
    public function syntheseData(Request $request): array
    {
        $debut = $request->date('date_debut') ?? now()->startOfYear();
        $fin = $request->date('date_fin') ?? now();

        $mouvementsPeriode = Mouvement::whereBetween('date_mouvement', [$debut->toDateString(), $fin->toDateString()]);

        $parType = (clone $mouvementsPeriode)
            ->select('type_mouvement', DB::raw('count(*) as total'))
            ->groupBy('type_mouvement')
            ->pluck('total', 'type_mouvement');

        // Flux mensuels (12 mois glissants) pour le graphique du rapport.
        // startOfMonth() AVANT subMonths() : sinon le 30/31 du mois provoque un
        // débordement (ex. 30 sept - 7 mois → 30 févr → 2 mars) et un doublon.
        $fluxMensuels = collect(range(0, 11))->map(function ($i) {
            $m = now()->startOfMonth()->subMonths(11 - $i)->startOfMonth();

            return [
                'mois' => $m->translatedFormat('M Y'),
                'entrees' => Mouvement::whereIn('type_mouvement', ['stock', 'affectation'])
                    ->whereBetween('date_mouvement', [$m->copy()->startOfMonth()->toDateString(), $m->copy()->endOfMonth()->toDateString()])
                    ->count(),
                'sorties' => Mouvement::whereIn('type_mouvement', ['restitution', 'reforme'])
                    ->whereBetween('date_mouvement', [$m->copy()->startOfMonth()->toDateString(), $m->copy()->endOfMonth()->toDateString()])
                    ->count(),
            ];
        });

        $parDirection = Equipement::join('directions', 'directions.id_direction', '=', 'equipements.id_direction')
            ->select('directions.code_direction', 'directions.nom_direction', DB::raw('count(*) as total'))
            ->groupBy('directions.code_direction', 'directions.nom_direction')
            ->orderByDesc('total')
            ->limit(8)
            ->get();

        $parCategorie = Equipement::join('categories', 'categories.id_categorie', '=', 'equipements.id_categorie')
            ->select('categories.nom_categorie', DB::raw('count(*) as total'))
            ->groupBy('categories.nom_categorie')
            ->orderByDesc('total')
            ->get();

        // Top 10 : matériel le plus mobile de la période (affectations cumulées).
        $topMobiles = Equipement::query()
            ->with('modele.marque')
            ->withCount(['affectations' => fn ($q) => $q->whereBetween('date_affectation', [$debut->toDateString(), $fin->toDateString()])])
            ->having('affectations_count', '>', 0)
            ->orderByDesc('affectations_count')
            ->limit(10)
            ->get()
            ->map(fn ($e) => [
                'id_equipement' => $e->id_equipement,
                'code_inventaire' => $e->code_inventaire,
                'designation' => $e->designation,
                'libelle' => trim(($e->modele?->marque?->nom_marque ?? '').' '.($e->modele?->nom_modele ?? '')),
                'total' => $e->affectations_count,
            ])->values();

        return [
            'periode' => ['debut' => $debut->toDateString(), 'fin' => $fin->toDateString()],
            'kpi' => [
                'total_equipements' => Equipement::count(),
                'valeur_parc' => (float) Equipement::sum('prix_acquisition'),
                'en_service' => Equipement::where('statut', 'en_service')->count(),
                'en_stock' => Equipement::where('statut', 'en_stock')->count(),
                'en_maintenance' => Equipement::where('statut', 'en_maintenance')->count(),
                'reforme' => Equipement::where('statut', 'reforme')->count(),
                'perdu' => Equipement::where('statut', 'perdu')->count(),
                'reserve' => Equipement::where('statut', 'reserve')->count(),
                'affectations_actives' => Affectation::whereNull('date_fin')->count(),
                'tickets_ouverts' => Ticket::whereIn('statut', ['ouvert', 'en_cours'])->count(),
                'maintenances_cours' => Maintenance::where('statut', 'en_cours')->count(),
                'inventaires_cours' => Inventaire::where('statut', 'en_cours')->count(),
                'mouvements_periode' => (clone $mouvementsPeriode)->count(),
                'achats_periode' => Achat::whereBetween('date_achat', [$debut->toDateString(), $fin->toDateString()])->count(),
                'depenses_periode' => (float) Achat::whereBetween('date_achat', [$debut->toDateString(), $fin->toDateString()])->sum('montant_total'),
                'logiciels' => Logiciel::count(),
            ],
            'mouvements_par_type' => $parType,
            'flux_mensuels' => $fluxMensuels,
            'par_direction' => $parDirection,
            'par_categorie' => $parCategorie,
            'top_mobiles' => $topMobiles,
        ];
    }

    /**
     * GET /api/rapports/mouvements?type&date_debut&date_fin&id_equipement&q&per_page
     * Journal complet des transactions de matériel : affectations, restitutions,
     * transferts, passages en maintenance, réformes et entrées en stock.
     */
    public function mouvements(Request $request): JsonResponse
    {
        $query = Mouvement::with([
            'equipement.categorie',
            'equipement.modele.marque',
            'ancienneLocalisation.batiment.site',
            'nouvelleLocalisation.batiment.site',
            'utilisateur.agent',
        ]);

        if ($request->filled('type')) {
            $query->where('type_mouvement', $request->input('type'));
        }
        if ($request->filled('id_equipement')) {
            $query->where('id_equipement', $request->input('id_equipement'));
        }
        if ($request->filled('date_debut')) {
            $query->whereDate('date_mouvement', '>=', $request->date('date_debut'));
        }
        if ($request->filled('date_fin')) {
            $query->whereDate('date_mouvement', '<=', $request->date('date_fin'));
        }
        if ($request->filled('q')) {
            $q = $request->string('q');
            $query->where(fn ($sub) => $sub
                ->where('motif', 'like', "%{$q}%")
                ->orWhere('commentaire', 'like', "%{$q}%")
                ->orWhereHas('equipement', fn ($e) => $e
                    ->where('code_inventaire', 'like', "%{$q}%")
                    ->orWhere('numero_serie', 'like', "%{$q}%")
                    ->orWhere('designation', 'like', "%{$q}%"))
                ->orWhereHas('utilisateur.agent', fn ($u) => $u
                    ->where('prenom', 'like', "%{$q}%")
                    ->orWhere('nom_naiss', 'like', "%{$q}%")));
        }

        $perPage = min((int) $request->input('per_page', 20), 100);

        return response()->json($query->orderByDesc('id_mouvement')->paginate($perPage));
    }

    /**
     * GET /api/rapports/journal?q&id_utilisateur&table&date_debut&date_fin&per_page
     * Journal d'activité applicatif : qui a fait quoi, quand, depuis quelle IP.
     */
    public function journal(Request $request): JsonResponse
    {
        $query = JournalActivite::with('utilisateur.agent');

        if ($request->filled('q')) {
            $q = $request->string('q');
            $query->where(fn ($sub) => $sub
                ->where('action', 'like', "%{$q}%")
                ->orWhere('table_concernee', 'like', "%{$q}%")
                ->orWhere('adresse_ip', 'like', "%{$q}%")
                ->orWhereHas('utilisateur', fn ($u) => $u->where('username', 'like', "%{$q}%")));
        }
        if ($request->filled('id_utilisateur')) {
            $query->where('id_utilisateur', $request->input('id_utilisateur'));
        }
        if ($request->filled('table')) {
            $query->where('table_concernee', $request->input('table'));
        }
        if ($request->filled('date_debut')) {
            $query->whereDate('date_action', '>=', $request->date('date_debut'));
        }
        if ($request->filled('date_fin')) {
            $query->whereDate('date_action', '<=', $request->date('date_fin'));
        }

        $perPage = min((int) $request->input('per_page', 30), 100);

        return response()->json($query->orderByDesc('id_log')->paginate($perPage));
    }

    /**
     * DELETE /api/rapports/mouvements/{mouvement}
     * Supprime une entrée de l'historique des mouvements (avec ses traces de
     * changement de champs) et journalise l'opération.
     */
    public function supprimerMouvement(Mouvement $mouvement): JsonResponse
    {
        return DB::transaction(function () use ($mouvement) {
            $mouvement->historiques()->delete();
            $mouvement->delete();

            $this->journaliserPurge('suppression', 'mouvements', $mouvement->id_mouvement);

            return response()->json(['message' => 'Mouvement supprimé de l\'historique.']);
        });
    }

    /**
     * DELETE /api/rapports/mouvements
     * Vide entièrement l'historique des mouvements de matériel.
     */
    public function purgerMouvements(): JsonResponse
    {
        return DB::transaction(function () {
            $total = Mouvement::count();

            MouvementHistorique::query()->delete();
            Mouvement::query()->delete();

            $this->journaliserPurge('suppression', 'mouvements', null, $total);

            return response()->json(['message' => "Historique des mouvements vidé ({$total} entrée(s) supprimée(s)).", 'total' => $total]);
        });
    }

    /**
     * DELETE /api/rapports/journal/{log}
     * Supprime une entrée du journal d'activité (à l'exception de la trace
     * de la suppression elle-même, écrite après).
     */
    public function supprimerJournal(JournalActivite $journal): JsonResponse
    {
        $journal->delete();

        $this->journaliserPurge('suppression', 'journal_activites', $journal->id_log);

        return response()->json(['message' => 'Entrée du journal supprimée.']);
    }

    /**
     * DELETE /api/rapports/journal
     * Vide entièrement le journal d'activité.
     */
    public function purgerJournal(): JsonResponse
    {
        return DB::transaction(function () {
            $total = JournalActivite::count();

            JournalActivite::query()->delete();

            $this->journaliserPurge('suppression', 'journal_activites', null, $total);

            return response()->json(['message' => "Journal d'activité vidé ({$total} entrée(s) supprimée(s)).", 'total' => $total]);
        });
    }

    /** Trace de purge dans le journal (recréé si besoin lors d'un vidage complet). */
    private function journaliserPurge(string $action, string $table, ?int $idElement, ?int $total = null): void
    {
        $user = auth()->user();

        JournalActivite::create([
            'action' => $total !== null ? "suppression totale de {$total} entrée(s) de {$table}" : "suppression de {$table}",
            'table_concernee' => $table,
            'id_element' => $idElement,
            'adresse_ip' => request()->ip(),
            'id_utilisateur' => $user?->id_utilisateur,
        ]);
    }

    /**
     * GET /api/rapports/equipement/{equipement}
     * Fiche de vie complète d'un matériel : identité, mouvements, affectations,
     * maintenances, tickets, installations logicielles.
     */
    public function equipement(Equipement $equipement): JsonResponse
    {
        $equipement->load([
            'categorie', 'marque', 'modele.marque', 'direction', 'service',
            'fournisseur', 'localisation.batiment.site', 'etat',
            'affectations.agent.direction',
            'affectations.agent.service',
            'maintenances.type',
            'tickets',
            'mouvements.utilisateur.agent',
            'installations.logiciel',
        ]);

        return response()->json($equipement);
    }

    /* ==================================================================
     |  Exports PDF — documents officiels (en-tête DGSR, pagination, visa)
     |  ================================================================== */

    /** Contexte commun à tous les documents : éditeur + fonction issues de la session. */
    private function contexteEdition(): array
    {
        $user = auth()->user();

        return [
            'editeur' => $user?->nom_complet ?? $user?->username ?? 'Système',
            'fonction' => $user?->agent?->fonction ?? 'Administration du parc',
        ];
    }

    /** Libellé lisible des filtres actifs, imprimé dans l'en-tête du PDF. */
    private function descriptionFiltres(Request $request, ?string $type = null): string
    {
        $parts = [];

        if ($type) {
            $parts[] = 'Type : ' . ($this->libellesMouvements()[$type] ?? $type);
        }
        if ($request->filled('date_debut') && $request->filled('date_fin')) {
            $parts[] = 'du ' . $request->date('date_debut')->format('d/m/Y')
                . ' au ' . $request->date('date_fin')->format('d/m/Y');
        } elseif ($request->filled('date_debut')) {
            $parts[] = 'à partir du ' . $request->date('date_debut')->format('d/m/Y');
        } elseif ($request->filled('date_fin')) {
            $parts[] = "jusqu'au " . $request->date('date_fin')->format('d/m/Y');
        }
        if ($request->filled('q')) {
            $parts[] = 'recherche : « ' . $request->string('q') . ' »';
        }

        return $parts ? implode(' — ', $parts) : 'Toutes transactions — sans filtre';
    }

    private function libellesMouvements(): array
    {
        return [
            'stock' => 'Entrée en stock',
            'affectation' => 'Affectation',
            'restitution' => 'Restitution',
            'transfert' => 'Transfert',
            'maintenance' => 'Maintenance',
            'reforme' => 'Réforme',
        ];
    }

    /**
     * GET /api/rapports/pdf/synthese?date_debut&date_fin
     * Rapport de synthèse officiel : KPI, flux, répartitions, top mobiles.
     */
    public function pdfSynthese(Request $request)
    {
        $data = $this->syntheseData($request);
        $contexte = $this->contexteEdition();

        return $this->rendrePdf('rapports.synthese', array_merge($data, $contexte, [
            'typesMeta' => $this->libellesMouvements(),
        ]), "rapport_synthese_" . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * GET /api/rapports/pdf/mouvements?type&date_debut&date_fin&q
     * Document officiel listant les transactions de matériel (max 200 lignes).
     */
    public function pdfMouvements(Request $request)
    {
        $query = Mouvement::with([
            'equipement', 'ancienneLocalisation', 'nouvelleLocalisation', 'utilisateur.agent',
        ]);

        if ($request->filled('type')) {
            $query->where('type_mouvement', $request->input('type'));
        }
        if ($request->filled('date_debut')) {
            $query->whereDate('date_mouvement', '>=', $request->date('date_debut'));
        }
        if ($request->filled('date_fin')) {
            $query->whereDate('date_mouvement', '<=', $request->date('date_fin'));
        }
        if ($request->filled('q')) {
            $q = $request->string('q');
            $query->where(fn ($sub) => $sub
                ->where('motif', 'like', "%{$q}%")
                ->orWhere('commentaire', 'like', "%{$q}%")
                ->orWhereHas('equipement', fn ($e) => $e
                    ->where('code_inventaire', 'like', "%{$q}%")
                    ->orWhere('designation', 'like', "%{$q}%")));
        }

        $mouvements = $query->orderByDesc('id_mouvement')->limit(200)->get();
        $contexte = $this->contexteEdition();

        return $this->rendrePdf('rapports.mouvements', array_merge($contexte, [
            'mouvements' => $mouvements,
            'typesMeta' => $this->libellesMouvements(),
            'descriptionFiltres' => $this->descriptionFiltres($request, $request->input('type')),
        ]), "rapport_mouvements_" . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * GET /api/rapports/pdf/journal?date_debut&date_fin&q
     * Document officiel du journal d'activité (max 300 lignes).
     */
    public function pdfJournal(Request $request)
    {
        $query = JournalActivite::with('utilisateur.agent');

        if ($request->filled('q')) {
            $q = $request->string('q');
            $query->where(fn ($sub) => $sub
                ->where('action', 'like', "%{$q}%")
                ->orWhere('table_concernee', 'like', "%{$q}%"));
        }
        if ($request->filled('date_debut')) {
            $query->whereDate('date_action', '>=', $request->date('date_debut'));
        }
        if ($request->filled('date_fin')) {
            $query->whereDate('date_action', '<=', $request->date('date_fin'));
        }

        $logs = $query->orderByDesc('id_log')->limit(300)->get();
        $contexte = $this->contexteEdition();

        return $this->rendrePdf('rapports.journal', array_merge($contexte, [
            'logs' => $logs,
            'descriptionFiltres' => $this->descriptionFiltres($request),
        ]), "rapport_journal_" . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * GET /api/rapports/pdf/equipement/{equipement}
     * Fiche de vie imprimable d'un matériel — à joindre au dossier physique.
     */
    public function pdfEquipement(Request $request, Equipement $equipement)
    {
        $equipement->load([
            'categorie', 'marque', 'modele.marque', 'direction', 'service',
            'fournisseur', 'localisation.batiment.site', 'etat',
            'detailAchat.achat.fournisseur',
            'affectations.agent',
            'maintenances.type',
            'tickets',
            'mouvements.utilisateur.agent',
            'installations.logiciel',
        ]);

        $contexte = $this->contexteEdition();

        return $this->rendrePdf('rapports.equipement', array_merge($contexte, [
            'equipement' => $equipement,
        ]), "fiche_" . $equipement->code_inventaire . '_' . now()->format('Y-m-d') . '.pdf');
    }

    /* ==================================================================
     |  Export PDF générique — registre imprimable de n'importe quelle section
     |  ================================================================== */

    /**
     * GET /api/rapports/pdf/ressource/{nom}?q&statut
     * Génère un « registre » PDF pour une section applicative : equipements,
     * agents, affectations, tickets, maintenances, achats, logiciels,
     * directions, services, sites, batiments, localisations, categories,
     * marques, modeles, fournisseurs, etats, inventaires.
     */
    public function pdfRessource(Request $request, string $nom)
    {
        $registres = [
            'equipements' => [Equipement::class, 'Inventaire du parc informatique', 'GPI/RPT/PARC/',
                fn ($q) => $q->with('categorie', 'marque', 'modele.marque', 'direction', 'service', 'localisation.batiment.site', 'etat')
                    ->orderBy('code_inventaire'),
                fn ($e) => [$e->code_inventaire, $e->designation, $e->categorie?->nom_categorie,
                    trim(($e->marque?->nom_marque ?? '').' '.($e->modele?->nom_modele ?? '')),
                    $e->numero_serie ?? '—',
                    $e->localisation
                        ? trim(($e->localisation->batiment?->site?->nom_site ?? '').' — '.$e->localisation->nom_localisation, ' —')
                        : 'Stock central',
                    $e->etat?->nom_etat ?? '—',
                    $this->libellesStatuts()[$e->statut] ?? $e->statut,
                    $e->prix_acquisition ? number_format((float) $e->prix_acquisition, 0, ',', ' ').' Ar' : '—']],
            'agents' => [\App\Models\Agent::class, 'Registre du personnel — agents', 'GPI/RPT/PERS/',
                fn ($q) => $q->with('direction', 'service'),
                fn ($a) => [$a->matricule, $a->nom_complet, $a->fonction, $a->direction?->code_direction,
                    $a->service?->nom_service, $a->telephone, $a->email, $a->statut]],
            'affectations' => [Affectation::class, 'Registre des affectations de matériel', 'GPI/RPT/AFF/',
                fn ($q) => $q->with('equipement', 'agent.service', 'agent.direction'),
                fn ($a) => [$a->equipement?->code_inventaire, $a->equipement?->designation,
                    $a->agent?->nom_complet, $a->agent?->fonction,
                    $a->agent?->service?->nom_service,
                    $a->date_affectation?->format('d/m/Y'), $a->date_fin?->format('d/m/Y') ?? 'en cours', $a->motif]],
            'tickets' => [Ticket::class, 'Registre des tickets d\'assistance', 'GPI/RPT/TIK/',
                fn ($q) => $q->with('equipement', 'agent'),
                fn ($t) => [$t->reference_ticket, $t->titre, $t->priorite, $t->statut,
                    $t->equipement?->code_inventaire, $t->agent?->nom_complet,
                    $t->date_creation?->format('d/m/Y'), $t->date_cloture?->format('d/m/Y')]],
            'maintenances' => [Maintenance::class, 'Registre des maintenances', 'GPI/RPT/MNT/',
                fn ($q) => $q->with('equipement', 'type', 'agent'),
                fn ($m) => [$m->equipement?->code_inventaire, $m->type?->nom_type, $m->technicien,
                    $m->statut, $m->date_demande?->format('d/m/Y'), $m->date_debut?->format('d/m/Y'),
                    $m->date_fin?->format('d/m/Y'), $m->description_probleme]],
            'achats' => [Achat::class, 'Registre des achats et marchés', 'GPI/RPT/ACH/',
                fn ($q) => $q->with('fournisseur', 'details'),
                fn ($a) => [$a->reference_achat, $a->date_achat?->format('d/m/Y'), $a->fournisseur?->raison_sociale,
                    number_format((float) $a->montant_total, 0, ',', ' ').' Ar', $a->statut,
                    $a->numero_facture, $a->bon_commande]],
            'logiciels' => [Logiciel::class, 'Catalogue des logiciels', 'GPI/RPT/LOG/',
                fn ($q) => $q,
                fn ($l) => [$l->nom, $l->version, $l->editeur, $l->description]],
            'directions' => [\App\Models\Direction::class, 'Référentiel des directions', 'GPI/RPT/REF/',
                fn ($q) => $q,
                fn ($d) => [$d->code_direction, $d->nom_direction, $d->email, $d->telephone, $d->statut]],
            'services' => [\App\Models\Service::class, 'Référentiel des services', 'GPI/RPT/REF/',
                fn ($q) => $q->with('direction'),
                fn ($s) => [$s->code_service, $s->nom_service, $s->direction?->nom_direction, $s->statut]],
            'sites' => [\App\Models\Site::class, 'Référentiel des sites', 'GPI/RPT/REF/',
                fn ($q) => $q,
                fn ($s) => [$s->code_site, $s->nom_site, $s->adresse, $s->telephone, $s->statut]],
            'batiments' => [\App\Models\Batiment::class, 'Référentiel des bâtiments', 'GPI/RPT/REF/',
                fn ($q) => $q->with('site'),
                fn ($b) => [$b->code_batiment, $b->nom_batiment, $b->site?->nom_site, $b->statut]],
            'localisations' => [\App\Models\Localisation::class, 'Référentiel des localisations', 'GPI/RPT/REF/',
                fn ($q) => $q->with('batiment.site'),
                fn ($l) => [$l->code_localisation, $l->nom_localisation, $l->etage, $l->bureau,
                    $l->batiment?->site?->nom_site, $l->statut]],
            'categories' => [\App\Models\Categorie::class, 'Référentiel des catégories', 'GPI/RPT/REF/',
                fn ($q) => $q,
                fn ($c) => [$c->code_categorie, $c->nom_categorie, $c->description]],
            'marques' => [\App\Models\Marque::class, 'Référentiel des marques', 'GPI/RPT/REF/',
                fn ($q) => $q,
                fn ($m) => [$m->nom_marque, $m->description]],
            'modeles' => [\App\Models\Modele::class, 'Référentiel des modèles', 'GPI/RPT/REF/',
                fn ($q) => $q->with('categorie', 'marque'),
                fn ($m) => [$m->nom_modele, $m->reference_modele, $m->marque?->nom_marque, $m->categorie?->nom_categorie]],
            'fournisseurs' => [\App\Models\Fournisseur::class, 'Référentiel des fournisseurs', 'GPI/RPT/REF/',
                fn ($q) => $q,
                fn ($f) => [$f->raison_sociale, $f->contact, $f->telephone, $f->email, $f->rcs]],
            'etats' => [\App\Models\EtatEquipement::class, 'Référentiel des états matériel', 'GPI/RPT/REF/',
                fn ($q) => $q,
                fn ($e) => [$e->nom_etat, $e->description]],
            'inventaires' => [\App\Models\InventaireDetail::class, "Procès-verbal d'inventaire du parc", 'GPI/RPT/INV/',
                fn ($q) => $q->with('equipement', 'inventaire'),
                fn ($d) => [$d->inventaire?->reference, $d->equipement?->code_inventaire,
                    $d->equipement?->designation, $d->statut, $d->observation]],
        ];

        if (! isset($registres[$nom])) {
            abort(404, "Registre PDF inconnu : {$nom}");
        }

        [$model, $titre, $prefixeRef, $with, $ligne] = $registres[$nom];

        $query = $model::query();
        $query = $with($query);

        if ($request->filled('q')) {
            $q = $request->string('q');
            $table = (new $model)->getTable();
            $query->where(function ($sub) use ($q, $table) {
                foreach (['code_inventaire', 'numero_serie', 'designation', 'matricule', 'nom_naiss', 'prenom',
                    'fonction', 'motif', 'titre', 'reference_ticket', 'reference_achat', 'nom', 'editeur',
                    'nom_direction', 'nom_service', 'nom_site', 'nom_batiment', 'nom_localisation',
                    'nom_categorie', 'nom_marque', 'nom_modele', 'nom_etat', 'raison_sociale'] as $col) {
                    if (\Schema::hasColumn($table, $col)) {
                        $sub->orWhere($col, 'like', "%{$q}%");
                    }
                }
            });
        }
        if ($request->filled('statut') && \Schema::hasColumn((new $model)->getTable(), 'statut')) {
            $query->where('statut', $request->input('statut'));
        }
        // Filtre catégorie envoyé par la page Équipements
        if ($nom === 'equipements' && $request->filled('id_categorie')) {
            $query->where('id_categorie', $request->integer('id_categorie'));
        }

        $items = $query->limit(300)->get();
        $colonnes = $this->colonnesRegistre($nom);
        $largeurs = $this->largeursRegistre($nom);

        $contexte = $this->contexteEdition();

        $donnees = array_merge($contexte, [
            'titreRegistre' => $titre,
            'prefixeRef' => $prefixeRef,
            'colonnes' => $colonnes,
            'largeurs' => $largeurs,
            'lignes' => $items->map($ligne),
            'descriptionFiltres' => $this->descriptionFiltres($request),
        ]);

        return $this->rendrePdf('rapports.ressource', $donnees, "registre_{$nom}_" . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Rendu PDF commun : double passe pour une pagination « Page X / Y » juste.
     * Passe 1 = comptage des pages ; passe 2 = rendu final avec $totalPages
     * injecté dans le script inline du pied de page (layout.blade.php).
     */
    private function rendrePdf(string $vue, array $donnees, string $nomFichier)
    {
        $pdf = Pdf::loadView($vue, $donnees)->setPaper('a4', 'portrait');
        $pdf->render();
        $totalPages = $pdf->getCanvas()->get_page_count();

        return Pdf::loadView($vue, array_merge($donnees, ['totalPages' => $totalPages]))
            ->setPaper('a4', 'portrait')
            ->download($nomFichier);
    }

    /** Libellés français des statuts d'équipement. */
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

    /**
     * Largeurs de colonnes en pourcentage par registre (doit totaliser ~100).
     * DomPDF ne sait pas répartir automatiquement les colonnes d'une table
     * large : sans largeurs explicites, les dernières colonnes débordent.
     */
    private function largeursRegistre(string $nom): array
    {
        return match ($nom) {
            'equipements' => [10, 14, 9, 12, 11, 17, 7, 8, 12],
            'agents' => [10, 18, 12, 7, 15, 12, 18, 8],
            'affectations' => [10, 16, 14, 12, 14, 10, 10, 14],
            'tickets' => [12, 20, 9, 11, 12, 15, 11, 10],
            'maintenances' => [10, 12, 12, 10, 10, 10, 10, 26],
            'achats' => [13, 10, 20, 14, 11, 14, 18],
            'logiciels' => [20, 12, 18, 50],
            'directions' => [12, 34, 26, 16, 12],
            'services' => [12, 32, 44, 12],
            'sites' => [12, 26, 30, 18, 14],
            'batiments' => [14, 36, 38, 12],
            'localisations' => [14, 22, 10, 14, 28, 12],
            'categories' => [14, 26, 60],
            'marques' => [25, 75],
            'modeles' => [28, 22, 25, 25],
            'fournisseurs' => [24, 16, 14, 22, 24],
            'etats' => [20, 80],
            'inventaires' => [14, 12, 22, 12, 40],
            default => [],
        };
    }

    /** En-têtes de colonnes par registre. */
    private function colonnesRegistre(string $nom): array
    {
        return match ($nom) {
            'equipements' => ['Code', 'Désignation', 'Catégorie', 'Modèle', 'N° série', 'Localisation', 'État', 'Statut', 'Prix'],
            'agents' => ['Matricule', 'Nom complet', 'Fonction', 'Dir.', 'Service', 'Téléphone', 'Email', 'Statut'],
            'affectations' => ['Code inv.', 'Matériel', 'Agent', 'Fonction', 'Service', 'Depuis', 'Fin', 'Motif'],
            'tickets' => ['Référence', 'Titre', 'Priorité', 'Statut', 'Équipement', 'Déclarant', 'Créé le', 'Clôturé le'],
            'maintenances' => ['Équipement', 'Type', 'Technicien', 'Statut', 'Demandée', 'Début', 'Fin', 'Problème'],
            'achats' => ['Référence', 'Date', 'Fournisseur', 'Montant', 'Statut', 'Facture', 'Bon cmd'],
            'logiciels' => ['Nom', 'Version', 'Éditeur', 'Description'],
            'directions' => ['Code', 'Nom', 'Email', 'Téléphone', 'Statut'],
            'services' => ['Code', 'Nom', 'Direction de rattachement', 'Statut'],
            'sites' => ['Code', 'Nom', 'Adresse', 'Téléphone', 'Statut'],
            'batiments' => ['Code', 'Nom', 'Site', 'Statut'],
            'localisations' => ['Code', 'Nom', 'Étage', 'Bureau', 'Site', 'Statut'],
            'categories' => ['Code', 'Nom', 'Description'],
            'marques' => ['Nom', 'Description'],
            'modeles' => ['Nom', 'Référence', 'Marque', 'Catégorie'],
            'fournisseurs' => ['Raison sociale', 'Contact', 'Téléphone', 'Email', 'RCS'],
            'etats' => ['État', 'Description'],
            'inventaires' => ['Campagne', 'Code inv.', 'Matériel', 'Statut', 'Observation'],
            default => ['Données'],
        };
    }

    /**
     * GET /api/rapports/export?type=mouvements|journal|inventaire
     * Export CSV en streaming (aucune écriture disque, compatible gros volumes).
     */
    public function export(Request $request): StreamedResponse
    {
        $type = $request->input('type', 'mouvements');
        $debut = $request->date('date_debut');
        $fin = $request->date('date_fin');

        return response()->streamDownload(function () use ($type, $debut, $fin) {
            $out = fopen('php://output', 'w');
            // BOM UTF-8 pour que Excel affiche correctement les accents.
            fwrite($out, "\xEF\xBB\xBF");
            $sep = ';';

            if ($type === 'journal') {
                fputcsv($out, ['ID', 'Date', 'Action', 'Table', 'ID élément', 'Utilisateur', 'Adresse IP'], $sep);
                JournalActivite::with('utilisateur.agent')
                    ->when($debut, fn ($q) => $q->whereDate('date_action', '>=', $debut))
                    ->when($fin, fn ($q) => $q->whereDate('date_action', '<=', $fin))
                    ->orderBy('id_log')
                    ->chunk(500, function ($logs) use ($out, $sep) {
                        foreach ($logs as $log) {
                            fputcsv($out, [
                                $log->id_log,
                                $log->date_action?->format('d/m/Y H:i'),
                                $log->action,
                                $log->table_concernee,
                                $log->id_element,
                                $log->utilisateur?->nom_complet ?? $log->utilisateur?->username,
                                $log->adresse_ip,
                            ], $sep);
                        }
                    });
            } elseif ($type === 'inventaire') {
                fputcsv($out, ['Code inventaire', 'N° série', 'Désignation', 'Catégorie', 'Marque', 'Modèle', 'Statut', 'Direction', 'Service', 'Localisation', 'Prix acquisition', 'Date acquisition'], $sep);
                Equipement::with('categorie', 'marque', 'modele', 'direction', 'service', 'localisation')
                    ->orderBy('code_inventaire')
                    ->chunk(500, function ($equipements) use ($out, $sep) {
                        foreach ($equipements as $e) {
                            fputcsv($out, [
                                $e->code_inventaire,
                                $e->numero_serie,
                                $e->designation,
                                $e->categorie?->nom_categorie,
                                $e->marque?->nom_marque,
                                $e->modele?->nom_modele,
                                $e->statut,
                                $e->direction?->nom_direction,
                                $e->service?->nom_service,
                                $e->localisation?->nom_localisation,
                                $e->prix_acquisition,
                                $e->date_acquisition?->format('d/m/Y'),
                            ], $sep);
                        }
                    });
            } else {
                fputcsv($out, ['ID', 'Date', 'Type', 'Équipement', 'Code inventaire', 'Motif', 'Ancienne localisation', 'Nouvelle localisation', 'Utilisateur', 'Commentaire'], $sep);
                Mouvement::with('equipement', 'ancienneLocalisation', 'nouvelleLocalisation', 'utilisateur.agent')
                    ->when($debut, fn ($q) => $q->whereDate('date_mouvement', '>=', $debut))
                    ->when($fin, fn ($q) => $q->whereDate('date_mouvement', '<=', $fin))
                    ->orderBy('id_mouvement')
                    ->chunk(500, function ($mouvs) use ($out, $sep) {
                        foreach ($mouvs as $m) {
                            fputcsv($out, [
                                $m->id_mouvement,
                                $m->date_mouvement?->format('d/m/Y'),
                                $m->type_mouvement,
                                $m->equipement?->designation,
                                $m->equipement?->code_inventaire,
                                $m->motif,
                                $m->ancienneLocalisation?->nom_localisation,
                                $m->nouvelleLocalisation?->nom_localisation,
                                $m->utilisateur?->nom_complet ?? $m->utilisateur?->username,
                                $m->commentaire,
                            ], $sep);
                        }
                    });
            }

            fclose($out);
        }, "rapport_{$type}_".now()->format('Y-m-d').'.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
