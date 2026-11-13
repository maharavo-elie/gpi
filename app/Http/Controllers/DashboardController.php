<?php

namespace App\Http\Controllers;

use App\Models\Affectation;
use App\Models\Equipement;
use App\Models\Inventaire;
use App\Models\Maintenance;
use App\Models\Mouvement;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $parStatut = Equipement::select('statut', DB::raw('count(*) as total'))
            ->groupBy('statut')
            ->pluck('total', 'statut');

        $parCategorie = Equipement::join('categories', 'categories.id_categorie', '=', 'equipements.id_categorie')
            ->select('categories.nom_categorie', DB::raw('count(*) as total'))
            ->groupBy('categories.nom_categorie')
            ->orderByDesc('total')
            ->get();

        $parDirection = Equipement::join('directions', 'directions.id_direction', '=', 'equipements.id_direction')
            ->select('directions.code_direction', DB::raw('count(*) as total'))
            ->groupBy('directions.code_direction')
            ->get();

        // Période glissante de 12 mois : une seule lecture par table, puis
        // regroupement en mémoire pour rester compatible MySQL et SQLite.
        $debutPeriode = now()->startOfMonth()->subMonths(11)->startOfDay();
        $finPeriode = now()->endOfMonth()->endOfDay();
        $bornes = [$debutPeriode->toDateString(), $finPeriode->toDateString()];

        $mouvements = Mouvement::whereBetween('date_mouvement', $bornes)
            ->get(['type_mouvement', 'date_mouvement'])
            ->groupBy(fn (Mouvement $mouvement) => $mouvement->date_mouvement->format('Y-m'));

        $tickets = Ticket::where(function ($query) use ($bornes) {
            $query->whereBetween('date_creation', $bornes)
                ->orWhereBetween('date_cloture', $bornes);
        })->get(['date_creation', 'date_cloture']);

        $creationsParMois = $tickets
            ->filter(fn (Ticket $ticket) => $ticket->date_creation !== null)
            ->groupBy(fn (Ticket $ticket) => $ticket->date_creation->format('Y-m'));

        $resolutionsParMois = $tickets
            ->filter(fn (Ticket $ticket) => $ticket->date_cloture !== null)
            ->groupBy(fn (Ticket $ticket) => $ticket->date_cloture->format('Y-m'));

        $moisPeriode = collect(range(0, 11))->map(
            fn (int $i) => now()->startOfMonth()->subMonths(11 - $i)
        );

        // Flux entrées / sorties des 12 derniers mois : base du graphique
        // d'évolution du tableau de bord.
        $fluxMensuels = $moisPeriode->map(function ($mois) use ($mouvements) {
            $duMois = $mouvements->get($mois->format('Y-m'), collect());

            return [
                'mois' => $mois->translatedFormat('M Y'),
                'entrees' => $duMois->whereIn('type_mouvement', ['stock', 'affectation'])->count(),
                'sorties' => $duMois->whereIn('type_mouvement', ['restitution', 'reforme', 'maintenance'])->count(),
            ];
        });

        // Courbe des tickets : créations et résolutions mois par mois.
        $ticketsMensuels = $moisPeriode->map(function ($mois) use ($creationsParMois, $resolutionsParMois) {
            $cle = $mois->format('Y-m');

            return [
                'mois' => $mois->translatedFormat('M Y'),
                'crees' => $creationsParMois->get($cle, collect())->count(),
                'resolus' => $resolutionsParMois->get($cle, collect())->count(),
            ];
        });

        return response()->json([
            'total_equipements' => Equipement::count(),
            'par_statut' => $parStatut,
            'par_categorie' => $parCategorie,
            'par_direction' => $parDirection,
            'tickets_par_statut' => Ticket::select('statut', DB::raw('count(*) as total'))->groupBy('statut')->pluck('total', 'statut'),
            'maintenances_par_statut' => Maintenance::select('statut', DB::raw('count(*) as total'))->groupBy('statut')->pluck('total', 'statut'),
            'tickets_par_priorite' => Ticket::select('priorite', DB::raw('count(*) as total'))->groupBy('priorite')->pluck('total', 'priorite'),
            'maintenances_par_mode' => Maintenance::select('mode_intervention', DB::raw('count(*) as total'))->groupBy('mode_intervention')->pluck('total', 'mode_intervention'),
            'flux_mensuels' => $fluxMensuels,
            'tickets_mensuels' => $ticketsMensuels,
            'tickets_ouverts' => Ticket::whereIn('statut', ['ouvert', 'en_cours'])->count(),
            'maintenances_cours' => Maintenance::where('statut', 'en_cours')->count(),
            'affectations_actives' => Affectation::whereNull('date_fin')->count(),
            'inventaires_cours' => Inventaire::where('statut', 'en_cours')->count(),
            'valeur_parc' => (float) Equipement::sum('prix_acquisition'),
            'garanties_expirantes' => Equipement::whereBetween('garantie_fin', [today(), today()->addDays(60)])->count(),
            'derniers_tickets' => Ticket::with('equipement', 'agent')->latest('id_ticket')->take(5)->get(),
            'derniers_mouvements' => \App\Models\Mouvement::with('equipement', 'utilisateur')->latest('id_mouvement')->take(5)->get(),
        ]);
    }
}
