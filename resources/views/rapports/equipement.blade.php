@extends('rapports.layout')

@section('ref', 'GPI/RPT/FIC/' . now()->format('Y'))
@section('titre', 'Fiche de vie — ' . $equipement->code_inventaire)
@section('perimetre', $equipement->designation)

@section('contenu')
    <div class="carte-meta">
        <table>
            <tr>
                <td>
                    <strong>{{ $equipement->designation }}</strong>
                    — <span class="mono">{{ $equipement->code_inventaire }}</span>
                    <span class="badge {{ $equipement->statut === 'en_service' ? 'b-vert' : ($equipement->statut === 'en_stock' ? 'b-bleu' : ($equipement->statut === 'reforme' ? 'b-gris' : 'b-orange')) }}">
                        {{ str_replace('_', ' ', $equipement->statut) }}
                    </span>
                </td>
                <td class="text-droit"><strong>Édité par :</strong> {{ $editeur }}</td>
            </tr>
            <tr>
                <td class="muted">Document retraçant le cycle de vie complet du matériel, de son acquisition à son état actuel.</td>
                <td class="text-droit muted">N° série : {{ $equipement->numero_serie ?? '—' }}</td>
            </tr>
        </table>
    </div>

    <h2>1. Identification</h2>
    <table>
        <tbody>
            <tr><td style="width:160px;" class="muted">Catégorie / Marque</td><td>{{ $equipement->categorie?->nom_categorie ?? '—' }} / {{ $equipement->marque?->nom_marque ?? '—' }}</td></tr>
            <tr><td class="muted">Modèle</td><td>{{ $equipement->modele?->nom_modele ?? '—' }}</td></tr>
            <tr><td class="muted">Configuration</td><td>{{ $equipement->description ?? '—' }}</td></tr>
            <tr><td class="muted">Prix d'acquisition</td><td>{{ $equipement->prix_acquisition ? number_format($equipement->prix_acquisition, 0, ',', ' ') . ' Ar' : '—' }}</td></tr>
            <tr><td class="muted">Acquisition / Mise en service</td><td>
                {{ $equipement->date_acquisition?->format('d/m/Y') ?? '—' }} / {{ $equipement->date_mise_service?->format('d/m/Y') ?? '—' }}
            </td></tr>
            <tr><td class="muted">Garantie</td><td>
                @if ($equipement->garantie_fin)
                    jusqu'au {{ $equipement->garantie_fin->format('d/m/Y') }}
                    ({{ $equipement->garantie_fin->isFuture() ? 'active' : 'expirée' }})
                @else
                    —
                @endif
            </td></tr>
            <tr><td class="muted">Fournisseur</td><td>{{ $equipement->fournisseur?->raison_sociale ?? '—' }}</td></tr>
            <tr><td class="muted">Marché d'acquisition</td><td>
                @if ($equipement->detailAchat?->achat)
                    <span class="mono">{{ $equipement->detailAchat->achat->reference_achat }}</span>
                    du {{ \Illuminate\Support\Carbon::parse($equipement->detailAchat->achat->date_achat)->format('d/m/Y') }}
                    — {{ $equipement->detailAchat->achat->fournisseur?->raison_sociale ?? '—' }}
                    @if ($equipement->detailAchat->prix_unitaire)
                        (prix unitaire : {{ number_format($equipement->detailAchat->prix_unitaire, 0, ',', ' ') }} Ar)
                    @endif
                @else
                    —
                @endif
            </td></tr>
            <tr><td class="muted">Direction / Service</td><td>
                {{ $equipement->direction?->code_direction ?? '—' }} {{ $equipement->direction?->nom_direction ?? '' }}
                @if ($equipement->service) — {{ $equipement->service->nom_service }} @endif
            </td></tr>
            <tr><td class="muted">Localisation actuelle</td><td>
                @if ($equipement->localisation)
                    {{ $equipement->localisation->nom_localisation }}
                    ({{ $equipement->localisation->batiment?->nom_batiment ?? '—' }}, {{ $equipement->localisation->batiment?->site?->nom_site ?? '—' }})
                @else
                    Stock central SIT
                @endif
            </td></tr>
            <tr><td class="muted">État</td><td>{{ $equipement->etat?->nom_etat ?? '—' }}</td></tr>
        </tbody>
    </table>

    <h2>2. Historique des mouvements</h2>
    <table>
        <thead>
            <tr><th style="width:58px;">Date</th><th style="width:80px;">Type</th><th>Motif</th><th style="width:95px;">Effectué par</th></tr>
        </thead>
        <tbody>
            @forelse ($equipement->mouvements as $m)
                <tr>
                    <td class="mono">{{ \Illuminate\Support\Carbon::parse($m->date_mouvement)->format('d/m/y') }}</td>
                    <td><span class="badge {{ $m->type_mouvement === 'affectation' ? 'b-vert' : ($m->type_mouvement === 'reforme' ? 'b-gris' : ($m->type_mouvement === 'stock' ? 'b-bleu' : 'b-orange')) }}">{{ $m->type_mouvement }}</span></td>
                    <td>{{ Str::limit($m->motif, 100) }}</td>
                    <td>{{ $m->utilisateur?->nom_complet ?? 'Système' }}</td>
                </tr>
            @empty
                <tr><td colspan="4" class="muted">Aucun mouvement enregistré.</td></tr>
            @endforelse
        </tbody>
    </table>

    <h2>3. Affectations successives</h2>
    <table>
        <thead>
            <tr><th style="width:70px;">Du</th><th style="width:70px;">Au</th><th>Agent</th><th>Motif</th></tr>
        </thead>
        <tbody>
            @forelse ($equipement->affectations as $a)
                <tr>
                    <td class="mono">{{ \Illuminate\Support\Carbon::parse($a->date_affectation)->format('d/m/y') }}</td>
                    <td class="mono">{{ $a->date_fin ? \Illuminate\Support\Carbon::parse($a->date_fin)->format('d/m/y') : '—' }}</td>
                    <td>{{ $a->agent ? ($a->agent->prenom . ' ' . $a->agent->nom_naiss) : '—' }}
                        @if (! $a->date_fin) <span class="badge b-vert">en cours</span> @endif
                    </td>
                    <td class="muted">{{ Str::limit($a->motif, 80) }}</td>
                </tr>
            @empty
                <tr><td colspan="4" class="muted">Jamais affecté.</td></tr>
            @endforelse
        </tbody>
    </table>

    <h2>4. Maintenances et tickets</h2>
    <table>
        <thead>
            <tr><th style="width:70px;">Date</th><th style="width:80px;">Type</th><th>Objet</th><th style="width:70px;">Statut</th></tr>
        </thead>
        <tbody>
            @forelse ($equipement->maintenances as $m)
                <tr>
                    <td class="mono">{{ $m->date_demande?->format('d/m/y') ?? '—' }}</td>
                    <td>Maintenance — {{ $m->type?->nom_type ?? '—' }}</td>
                    <td>{{ Str::limit($m->description_probleme, 90) }}</td>
                    <td><span class="badge {{ $m->statut === 'terminee' ? 'b-vert' : ($m->statut === 'annulee' ? 'b-rouge' : 'b-orange') }}">{{ str_replace('_', ' ', $m->statut) }}</span></td>
                </tr>
            @empty
            @endforelse
            @forelse ($equipement->tickets as $t)
                <tr>
                    <td class="mono">{{ $t->date_creation?->format('d/m/y') ?? '—' }}</td>
                    <td>Ticket — <span class="mono">{{ $t->reference_ticket }}</span></td>
                    <td>{{ $t->titre }}</td>
                    <td><span class="badge {{ $t->statut === 'resolu' || $t->statut === 'ferme' ? 'b-gris' : 'b-rouge' }}">{{ str_replace('_', ' ', $t->statut) }}</span></td>
                </tr>
            @empty
                @if ($equipement->maintenances->isEmpty())
                    <tr><td colspan="4" class="muted">Aucune intervention enregistrée.</td></tr>
                @endif
            @endforelse
        </tbody>
    </table>

    @if ($equipement->installations->isNotEmpty())
        <h2>5. Installations logicielles</h2>
        <table>
            <thead>
                <tr><th>Logiciel</th><th style="width:80px;">Version</th><th style="width:110px;">Licence</th><th style="width:70px;">Installé le</th></tr>
            </thead>
            <tbody>
                @foreach ($equipement->installations as $inst)
                    <tr>
                        <td>{{ $inst->logiciel?->nom ?? '—' }}</td>
                        <td class="mono">{{ $inst->version_installee ?? '—' }}</td>
                        <td class="mono muted">{{ $inst->licence ?? '—' }}</td>
                        <td class="mono">{{ $inst->date_installation?->format('d/m/y') ?? '—' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
@endsection
