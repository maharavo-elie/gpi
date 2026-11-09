<?php

namespace App\Http\Controllers;

use App\Models\Achat;
use App\Models\Affectation;
use App\Models\Equipement;
use App\Models\Inventaire;
use App\Models\Maintenance;
use App\Models\Notification;
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

        // Flux entrées / sorties des 12 derniers mois, sous-échantillonné au mois :
        // base du graphique d'évolution du tableau de bord.
        $fluxMensuels = collect(range(0, 11))->map(function ($i) {
            $m = now()->startOfMonth()->subMonths(11 - $i);

            return [
                'mois' => $m->translatedFormat('M Y'),
                'entrees' => Mouvement::whereIn('type_mouvement', ['stock', 'affectation'])
                    ->whereBetween('date_mouvement', [$m->copy()->startOfMonth()->toDateString(), $m->copy()->endOfMonth()->toDateString()])
                    ->count(),
                'sorties' => Mouvement::whereIn('type_mouvement', ['restitution', 'reforme', 'maintenance'])
                    ->whereBetween('date_mouvement', [$m->copy()->startOfMonth()->toDateString(), $m->copy()->endOfMonth()->toDateString()])
                    ->count(),
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
