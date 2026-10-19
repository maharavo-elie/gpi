<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\Equipement;
use App\Models\Mouvement;
use App\Support\NotificationsMetier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MaintenanceController extends CrudController
{
    protected function model(): string
    {
        return Maintenance::class;
    }

    protected function label(): string
    {
        return 'maintenance';
    }

    protected function withRelations(): array
    {
        return ['equipement.modele', 'equipement.modele.marque', 'type', 'agent'];
    }

    protected function rules(): array
    {
        return [
            'date_demande' => ['nullable', 'date'],
            'date_debut' => ['nullable', 'date'],
            'date_fin' => ['nullable', 'date', 'after_or_equal:date_debut'],
            'description_probleme' => ['nullable', 'string'],
            'diagnostic' => ['nullable', 'string'],
            'technicien' => ['nullable', 'string', 'max:150'],
            'statut' => ['required', Rule::in(['demandee', 'planifiee', 'en_cours', 'terminee', 'annulee'])],
            'id_equipement' => ['required', 'exists:equipements,id_equipement'],
            'id_type_maintenance' => ['required', 'exists:type_maintenances,id_type_maintenance'],
            'id_agent' => ['nullable', 'exists:agents,id_agent'],
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $query = Maintenance::with($this->withRelations());

        if ($request->filled('statut')) {
            $query->where('statut', $request->input('statut'));
        }
        if ($request->filled('id_equipement')) {
            $query->where('id_equipement', $request->input('id_equipement'));
        }

        return response()->json($query->orderByDesc('id_maintenance')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());
        $data['date_demande'] ??= today();

        $maintenance = DB::transaction(function () use ($data) {
            $maintenance = Maintenance::create($data);

            if ($maintenance->statut === 'en_cours') {
                $this->passerEnMaintenance($maintenance);
            }

            return $maintenance;
        });

        $this->logAction('création', $maintenance);

        return response()->json($maintenance->load($this->withRelations()), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $maintenance = Maintenance::findOrFail($id);
        $data = $request->validate($this->rules());

        $ancienStatut = $maintenance->statut;
        $nouveauStatut = $data['statut'] ?? $ancienStatut;

        DB::transaction(function () use ($maintenance, $data, $ancienStatut, $nouveauStatut) {
            $maintenance->update($data);

            if ($nouveauStatut === 'en_cours' && $ancienStatut !== 'en_cours') {
                $this->passerEnMaintenance($maintenance);
            } elseif (in_array($nouveauStatut, ['terminee', 'annulee']) && $ancienStatut === 'en_cours') {
                // Fin d'intervention : le matériel redevient disponible au stock.
                $equipement = Equipement::find($maintenance->id_equipement);
                if ($equipement && $equipement->statut === 'en_maintenance') {
                    $equipement->update(['statut' => 'en_stock']);
                    Mouvement::create([
                        'type_mouvement' => 'stock',
                        'motif' => $nouveauStatut === 'annulee'
                            ? 'Maintenance annulée — matériel de nouveau disponible'
                            : 'Fin de maintenance — matériel de nouveau disponible',
                        'date_mouvement' => now(),
                        'id_equipement' => $equipement->id_equipement,
                        'id_utilisateur' => auth()->id(),
                    ]);
                }
            }
        });

        // Alerter dès que l'intervention démarre ou se termine : le retour
        // du matériel au stock est le moment où gestionnaires et admins
        // peuvent replanifier une affectation.
        if ($ancienStatut !== $nouveauStatut) {
            $equipement = Equipement::find($maintenance->id_equipement);
            $code = $equipement?->code_inventaire ?? 'matériel #'.$maintenance->id_equipement;

            if ($nouveauStatut === 'en_cours') {
                NotificationsMetier::notifier(
                    NotificationsMetier::idsParRoles(['admin', 'gestionnaire_parc']),
                    'Intervention démarrée — '.$code,
                    'La maintenance #'.$maintenance->id_maintenance.' est passée à « en cours ».',
                    'info'
                );
            }
            if (in_array($nouveauStatut, ['terminee', 'annulee'])) {
                $verbe = $nouveauStatut === 'terminee' ? 'terminée' : 'annulée';
                NotificationsMetier::notifier(
                    NotificationsMetier::idsParRoles(['admin', 'gestionnaire_parc']),
                    'Matériel de nouveau disponible — '.$code,
                    'Intervention '.$verbe.' : l\'équipement redevient disponible au stock.',
                    $nouveauStatut === 'terminee' ? 'succes' : 'warning'
                );
            }
        }

        $this->logAction('modification', $maintenance);

        return response()->json($maintenance->load($this->withRelations()));
    }

    /** Passe l'équipement en maintenance et trace le mouvement correspondant. */
    private function passerEnMaintenance(Maintenance $maintenance): void
    {
        $equipement = Equipement::find($maintenance->id_equipement);
        if (! $equipement || $equipement->statut === 'en_maintenance') {
            return;
        }

        $equipement->update(['statut' => 'en_maintenance']);
        Mouvement::create([
            'type_mouvement' => 'maintenance',
            'motif' => 'Entrée en maintenance'.($maintenance->description_probleme ? ' — '.\Illuminate\Support\Str::limit($maintenance->description_probleme, 80) : ''),
            'date_mouvement' => now(),
            'id_equipement' => $equipement->id_equipement,
            'id_utilisateur' => auth()->id(),
        ]);
    }
}
