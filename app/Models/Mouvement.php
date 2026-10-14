<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mouvement extends Model
{
    protected $primaryKey = 'id_mouvement';

    protected $fillable = [
        'type_mouvement', 'motif', 'ancienne_localisation', 'nouvelle_localisation',
        'date_mouvement', 'commentaire', 'id_equipement', 'id_utilisateur',
    ];

    protected function casts(): array
    {
        return ['date_mouvement' => 'date'];
    }

    public function equipement(): BelongsTo
    {
        return $this->belongsTo(Equipement::class, 'id_equipement');
    }

    public function ancienneLocalisation(): BelongsTo
    {
        return $this->belongsTo(Localisation::class, 'ancienne_localisation');
    }

    public function nouvelleLocalisation(): BelongsTo
    {
        return $this->belongsTo(Localisation::class, 'nouvelle_localisation');
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }

    public function historiques(): HasMany
    {
        return $this->hasMany(MouvementHistorique::class, 'id_mouvement');
    }
}
