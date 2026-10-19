<?php

namespace App\Http\Controllers;

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
        return ['equipement.modele', 'agent', 'commentaires.utilisateur'];
    }

    protected function rules(): array
    {
        return [
            'titre' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'priorite' => ['required', Rule::in(['basse', 'moyenne', 'haute', 'critique'])],
            'statut' => ['sometimes', Rule::in(['ouvert', 'en_cours', 'resolu', 'ferme'])],
            'id_equipement' => ['nullable', 'exists:equipements,id_equipement'],
            'id_agent' => ['nullable', 'exists:agents,id_agent'],
        ];
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules());
        $data['date_creation'] = today();

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
        $data = $request->validate($this->rules());

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
