<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    protected $primaryKey = 'id_ticket';

    protected $fillable = [
        'reference_ticket', 'titre', 'motif', 'description',
        'etat_probleme_avant', 'id_etat_appareil_avant',
        'priorite', 'date_creation', 'date_cloture', 'statut',
        'id_equipement', 'id_agent', 'id_direction', 'id_service', 'id_site',
    ];

    protected function casts(): array
    {
        return ['date_creation' => 'date', 'date_cloture' => 'date'];
    }

    public function equipement(): BelongsTo
    {
        return $this->belongsTo(Equipement::class, 'id_equipement');
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class, 'id_agent');
    }

    public function direction(): BelongsTo
    {
        return $this->belongsTo(Direction::class, 'id_direction');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'id_service');
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class, 'id_site');
    }

    public function etatAppareilAvant(): BelongsTo
    {
        return $this->belongsTo(EtatEquipement::class, 'id_etat_appareil_avant');
    }

    public function commentaires(): HasMany
    {
        return $this->hasMany(TicketCommentaire::class, 'id_ticket');
    }
}
