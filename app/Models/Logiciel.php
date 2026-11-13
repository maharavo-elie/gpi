<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Logiciel extends Model
{
    protected $table = 'logiciels';

    protected $primaryKey = 'id_logiciel';

    protected $fillable = [
        'nom', 'version', 'editeur', 'nb_utilisateurs_max',
        'date_acquisition', 'date_acquisition_licence',
        'id_fournisseur', 'description', 'cgu', 'cgv',
    ];

    /** Nombre de postes où le logiciel est actuellement installé. */
    protected $appends = ['utilisateurs_actuels'];

    protected function casts(): array
    {
        return [
            'date_acquisition' => 'date',
            'date_acquisition_licence' => 'date',
            'nb_utilisateurs_max' => 'integer',
        ];
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class, 'id_fournisseur');
    }

    public function getUtilisateursActuelsAttribute(): int
    {
        return $this->installations
            ->where('statut', 'installe')
            ->count();
    }

    public function licences(): HasMany
    {
        return $this->hasMany(Licence::class, 'id_logiciel');
    }

    public function installations(): HasMany
    {
        return $this->hasMany(InstallationLogiciel::class, 'id_logiciel');
    }
}
