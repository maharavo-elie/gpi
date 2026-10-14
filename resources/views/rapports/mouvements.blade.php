@extends('rapports.layout')

@section('ref', 'GPI/RPT/MVT/' . now()->format('Y'))
@section('titre', 'Historique des mouvements de matériel')
@section('perimetre', $descriptionFiltres)

@section('contenu')
    <div class="carte-meta">
        <table>
            <tr>
                <td><strong>Périmètre :</strong> {{ $descriptionFiltres }}</td>
                <td class="text-droit"><strong>Édité par :</strong> {{ $editeur }}</td>
            </tr>
            <tr>
                <td class="muted">{{ $mouvements->count() }} transaction(s) de matériel enregistrée(s) — triées de la plus récente à la plus ancienne.</td>
                <td class="text-droit muted">Fonction : {{ $fonction }}</td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:16px;">#</th>
                <th style="width:58px;">Date</th>
                <th style="width:70px;">Type</th>
                <th style="width:82px;">Code inv.</th>
                <th>Désignation / Motif</th>
                <th style="width:110px;">Localisation</th>
                <th style="width:95px;">Effectué par</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($mouvements as $m)
                @php
                    $badge = match ($m->type_mouvement) {
                        'affectation' => 'b-vert',
                        'stock' => 'b-bleu',
                        'restitution' => 'b-orange',
                        'transfert' => 'b-orange',
                        'maintenance' => 'b-rouge',
                        'reforme' => 'b-gris',
                        default => 'b-gris',
                    };
                @endphp
                <tr>
                    <td class="muted">{{ $loop->iteration }}</td>
                    <td class="mono">{{ \Illuminate\Support\Carbon::parse($m->date_mouvement)->format('d/m/y') }}</td>
                    <td><span class="badge {{ $badge }}">{{ $typesMeta[$m->type_mouvement]['label'] ?? $m->type_mouvement }}</span></td>
                    <td class="mono"><strong>{{ $m->equipement?->code_inventaire ?? '—' }}</strong></td>
                    <td>
                        <div>{{ $m->equipement?->designation ?? '—' }}</div>
                        <div class="muted" style="font-size: 8px;">{{ Str::limit($m->motif, 90) }}</div>
                    </td>
                    <td class="muted" style="font-size: 8px;">
                        {{ collect([$m->ancienneLocalisation?->nom_localisation, $m->nouvelleLocalisation?->nom_localisation])->filter()->implode(' → ') ?: '—' }}
                    </td>
                    <td>{{ $m->utilisateur?->nom_complet ?? $m->utilisateur?->username ?? 'Système' }}</td>
                </tr>
            @empty
                <tr><td colspan="7" class="muted">Aucun mouvement pour ces critères.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="carte-meta" style="margin-top: 12px;">
        <table>
            <tr>
                <td class="muted">
                    <strong>Visa du gestionnaire de parc :</strong> ______________________ &nbsp;&nbsp;
                    <strong>Visa du responsable SIT :</strong> ______________________
                </td>
            </tr>
        </table>
    </div>
@endsection
