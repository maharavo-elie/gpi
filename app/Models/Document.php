<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    protected $primaryKey = 'id_document';

    protected $fillable = [
        'nom_document', 'type_document', 'chemin_fichier', 'taille_fichier',
        'mime_type', 'description', 'id_equipement', 'id_utilisateur',
    ];

    public function equipement(): BelongsTo
    {
        return $this->belongsTo(Equipement::class, 'id_equipement');
    }

    public function utilisateur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_utilisateur');
    }
}
