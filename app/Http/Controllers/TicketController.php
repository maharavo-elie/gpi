<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Equipement;
use App\Models\Site;
use App\Models\Ticket;
use App\Models\TicketCommentaire;
use App\Support\NotificationsMetier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TicketController extends CrudController
{
    protected function model(): string
    {
        return Ticket::class;
    }

    protected function label(): string
    {
        return 'ticket';
    }

    protected function withRelations(): array
    {
        return [
            'equipement.modele', 'equipement.localisation.batiment.site',
            'agent.service', 'agent.direction',
            'direction', 'service', 'site', 'etatAppareilAvant',
            'commentaires.utilisateur',
        ];
    }

    protected function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:200'],
            'motif' => ['nullable', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'etat_probleme_avant' => ['nullable', 'string'],
            'id_etat_appareil_avant' => ['nullable', 'exists:etat_equipements,id_etat'],
            'priorite' => ['required', Rule::in(['basse', 'moyenne', 'haute', 'critique'])],
            'statut' => ['sometimes', Rule::in(['ouvert', 'en_cours', 'resolu', 'ferme'])],
            'id_equipement' => ['nullable', 'exists:equipements,id_equipement'],
            'id_agent' => ['nullable', 'exists:agents,id_agent'],
            'id_direction' => ['nullable', 'exists:directions,id_direction'],
            'id_service' => ['nullable', 'exists:services,id_service'],
            'id_site' => ['nullable', 'exists:sites,id_site'],
        ];
    }

    /**
     * Complète le périmètre du ticket à partir du matériel concerné : service
     * et direction réellement affectés, centre (site) et état avant panne.
     */
    private function completerRattachement(array $data, ?Ticket $ticket = null): array
    {
        $idEquipement = $data['id_equipement'] ?? $ticket?->id_equipement;
        $equipement = $idEquipement
            ? Equipement::with(['localisation.batiment', 'affectationActive.agent'])->find($idEquipement)
            : null;

        $agentEquipement = $equipement?->affectationActive?->agent;
        $demandeur = $agentEquipement;
        if (! $demandeur && ($idAgent = $data['id_agent'] ?? $ticket?->id_agent)) {
            $demandeur = Agent::find($idAgent);
        }

        // Le matériel prime : service effectif de son affectation, sinon service
        // porté par sa fiche. Pour un matériel en stock, on retombe sur le demandeur.
        $direction = $agentEquipement?->id_direction
            ?? $equipement?->id_direction
            ?? $demandeur?->id_direction;
        $service = $agentEquipement?->id_service
            ?? $equipement?->id_service
            ?? $demandeur?->id_service;

        $site = $equipement?->localisation?->batiment?->id_site;
        if (! $site && $direction) {
            $site = Site::where('id_direction', $direction)->orderBy('id_site')->value('id_site');
        }
        // Dernier repli : le siège, pour qu'un ticket ait toujours un centre.
        $site = $site ?: Site::orderBy('id_site')->value('id_site');

        $defauts = [
            'id_direction' => $direction,
            'id_service' => $service,
            'id_site' => $site,
            'id_etat_appareil_avant' => $equipement?->id_etat,
        ];

        foreach ($defauts as $champ => $valeur) {
            if (empty($data[$champ]) && $valeur) {
                $data[$champ] = $valeur;
            }
        }

        return $data;
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->completerRattachement($request->validate($this->rules()));
        $data['date_creation'] = today();

        // Le déclarant est celui qui dépose le ticket : s'il n'est pas
        // explicitement désigné, l'agent rattaché au compte connecté le devient.
        if (empty($data['id_agent']) && ($agentConnecte = auth()->user()->agent)) {
            $data['id_agent'] = $agentConnecte->id_agent;
        }

        // Référence dérivée de l'id auto-increment (unique par construction) :
        // insensible aux créations concurrentes et aux suppressions, contrairement
        // à un comptage count()+1. La colonne étant NOT NULL, une référence
        // temporaire unique est posée à l'insert puis remplacée par la définitive.
        $ticket = DB::transaction(function () use ($data) {
            $data['reference_ticket'] = 'TCK-'.date('Y').'-TMP-'.uniqid();
            $ticket = Ticket::create($data);
            $ticket->update([
                'reference_ticket' => 'TCK-'.date('Y').'-'.str_pad((string) $ticket->id_ticket, 3, '0', STR_PAD_LEFT),
            ]);

            return $ticket;
        });

        $ticket->load('equipement');
        $this->logAction('création', $ticket);

        // Alerte aux intervenants : les tickets ouverts ne doivent pas
        // attendre qu'on remarque la page /tickets par hasard.
        NotificationsMetier::notifier(
            NotificationsMetier::idsParRoles(['admin', 'gestionnaire_parc', 'technicien']),
            'Nouveau ticket '.$ticket->reference_ticket,
            ($ticket->equipement?->code_inventaire ? $ticket->equipement->code_inventaire.' — ' : '')
                .$ticket->titre.' (priorité '.$ticket->priorite.')',
            $ticket->priorite === 'critique' || $ticket->priorite === 'haute' ? 'alerte' : 'info'
        );

        return response()->json($ticket->load($this->withRelations()), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);

        // Le changement rapide de statut (page des tickets) n'envoie qu'un objet
        // { statut } : à la mise à jour, les champs obligatoires de la création
        // (titre, priorite) deviennent donc facultatifs s'ils ne sont pas envoyés.
        $reglesMaj = array_map(
            static fn (array $contraintes): array => array_map(
                static fn ($contrainte) => $contrainte === 'required' ? 'sometimes' : $contrainte,
                $contraintes
            ),
            $this->rules()
        );
        $data = $this->completerRattachement($request->validate($reglesMaj), $ticket);

        if (($data['statut'] ?? null) && in_array($data['statut'], ['resolu', 'ferme']) && ! $ticket->date_cloture) {
            $data['date_cloture'] = today();
        }

        $statutAvant = $ticket->statut;
        $ticket->update($data);
        $this->logAction('modification', $ticket);

        if ($statutAvant !== $ticket->statut) {
            // Le déclarant a le droit de savoir que sa demande avance (ou est résolue).
            $idDeclarant = NotificationsMetier::idUtilisateurDeAgent($ticket->id_agent);
            $estSolde = in_array($ticket->statut, ['resolu', 'ferme']);
            NotificationsMetier::notifier(
                [$idDeclarant],
                'Ticket '.$ticket->reference_ticket.' '.($estSolde ? 'traité' : 'en traitement'),
                'Statut : '.$statutAvant.' → '.$ticket->statut,
                $estSolde ? 'succes' : 'info'
            );
        }

        return response()->json($ticket->load($this->withRelations()));
    }

    /**
     * Liste avec filtres applicables : recherche plein texte (titre, motif,
     * référence), statut, priorité, équipement et périmètre concerné.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ticket::with($this->withRelations());

        if ($request->filled('q')) {
            $q = $request->string('q');
            $query->where(fn ($sub) => $sub
                ->where('titre', 'like', "%{$q}%")
                ->orWhere('motif', 'like', "%{$q}%")
                ->orWhere('reference_ticket', 'like', "%{$q}%"));
        }
        foreach (['statut', 'priorite', 'id_equipement', 'id_direction', 'id_service', 'id_site'] as $filtre) {
            if ($request->filled($filtre)) {
                $query->where($filtre, $request->input($filtre));
            }
        }

        return response()->json($query->orderByDesc('id_ticket')->get());
    }

    public function comment(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['contenu' => ['required', 'string', 'max:2000']]);

        Ticket::findOrFail($id);

        $commentaire = TicketCommentaire::create([
            'contenu' => $data['contenu'],
            'date_commentaire' => now(),
            'id_ticket' => $id,
            'id_utilisateur' => auth()->id(),
        ]);

        return response()->json($commentaire->load('utilisateur'), 201);
    }
}
