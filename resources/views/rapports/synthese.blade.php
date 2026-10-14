@extends('rapports.layout')

@section('ref', 'GPI/RPT/SYN/' . now()->format('Y'))
@section('titre', 'Rapport de synthèse du parc informatique')
@section('perimetre', 'Toutes directions — période du ' . \Illuminate\Support\Carbon::parse($periode['debut'])->format('d/m/Y') . ' au ' . \Illuminate\Support\Carbon::parse($periode['fin'])->format('d/m/Y'))

@section('contenu')
    <div class="carte-meta">
        <table>
            <tr>
                <td><strong>Période analysée :</strong> du {{ \Illuminate\Support\Carbon::parse($periode['debut'])->format('d/m/Y') }} au {{ \Illuminate\Support\Carbon::parse($periode['fin'])->format('d/m/Y') }}</td>
                <td class="text-droit"><strong>Édité par :</strong> {{ $editeur }}</td>
            </tr>
            <tr>
                <td class="muted">Document de reporting interne — chiffres arrêtés à la date d'édition.</td>
                <td class="text-droit muted">Fonction : {{ $fonction }}</td>
            </tr>
        </table>
    </div>

    {{-- KPI principaux --}}
    <h2>1. Indicateurs clés du parc</h2>
    <table class="kpi-grille">
        <tr>
            <td class="kpi"><div class="label">Matériels répertoriés</div><div class="valeur">{{ $kpi['total_equipements'] }}</div></td>
            <td class="kpi"><div class="label">Valeur du parc</div><div class="valeur petite">{{ number_format($kpi['valeur_parc'], 0, ',', ' ') }} Ar</div></td>
            <td class="kpi"><div class="label">Mouvements (période)</div><div class="valeur">{{ $kpi['mouvements_periode'] }}</div></td>
            <td class="kpi"><div class="label">Dépenses achats (période)</div><div class="valeur petite">{{ number_format($kpi['depenses_periode'], 0, ',', ' ') }} Ar</div></td>
        </tr>
    </table>
    <table class="kpi-grille">
        <tr>
            <td class="kpi"><div class="label">En service</div><div class="valeur">{{ $kpi['en_service'] }}</div></td>
            <td class="kpi"><div class="label">En stock</div><div class="valeur">{{ $kpi['en_stock'] }}</div></td>
            <td class="kpi"><div class="label">En maintenance</div><div class="valeur">{{ $kpi['en_maintenance'] }}</div></td>
            <td class="kpi"><div class="label">Réformés</div><div class="valeur">{{ $kpi['reforme'] }}</div></td>
            <td class="kpi"><div class="label">Tickets ouverts</div><div class="valeur">{{ $kpi['tickets_ouverts'] }}</div></td>
            <td class="kpi"><div class="label">Affectations actives</div><div class="valeur">{{ $kpi['affectations_actives'] }}</div></td>
        </tr>
    </table>

    {{-- Flux mensuels --}}
    <h2>2. Flux de matériel — 12 derniers mois</h2>
    <table>
        <thead>
            <tr><th>Mois</th><th class="text-droit">Entrées (stock + affectations)</th><th class="text-droit">Sorties (restitutions + réformes)</th><th class="text-droit">Solde</th></tr>
        </thead>
        <tbody>
            @foreach ($flux_mensuels as $flux)
                <tr>
                    <td>{{ $flux['mois'] }}</td>
                    <td class="text-droit">{{ $flux['entrees'] }}</td>
                    <td class="text-droit">{{ $flux['sorties'] }}</td>
                    <td class="text-droit"><strong>{{ $flux['entrees'] - $flux['sorties'] }}</strong></td>
            @endforeach
        </tbody>
    </table>

    {{-- Transactions par type --}}
    <h2>3. Transactions par type sur la période</h2>
    @php $maxType = max(1, $mouvements_par_type->max()); @endphp
    <table>
        <thead>
            <tr><th>Type de transaction</th><th class="text-droit" style="width:90px;">Nombre</th><th>Répartition</th></tr>
        </thead>
        <tbody>
            @foreach ($typesMeta as $type => $meta)
                @php $total = $mouvements_par_type[$type] ?? 0; @endphp
                <tr>
                    <td>{{ is_array($meta) ? $meta['label'] : $meta }}</td>
                    <td class="text-droit"><strong>{{ $total }}</strong></td>
                    <td>
                        <div class="barre-fond"><div class="barre-remplie" style="width: {{ min(100, round($total / $maxType * 100)) }}%;"></div></div>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Par direction --}}
    <h2>4. Répartition du parc par direction</h2>
    @php $maxDir = max(1, $par_direction->max('total')); @endphp
    <table>
        <thead>
            <tr><th>Direction</th><th class="text-droit" style="width:70px;">Matériels</th><th>Répartition</th></tr>
        </thead>
        <tbody>
            @forelse ($par_direction as $d)
                <tr>
                    <td>{{ $d->code_direction }} — {{ $d->nom_direction }}</td>
                    <td class="text-droit"><strong>{{ $d->total }}</strong></td>
                    <td><div class="barre-fond"><div class="barre-remplie" style="width: {{ round($d->total / $maxDir * 100) }}%;"></div></div></td>
                </tr>
            @empty
                <tr><td colspan="3" class="muted">Aucune direction rattachée au parc.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{-- Par catégorie --}}
    <h2>5. Répartition du parc par catégorie</h2>
    @php $maxCat = max(1, $par_categorie->max('total')); @endphp
    <table>
        <thead>
            <tr><th>Catégorie</th><th class="text-droit" style="width:70px;">Matériels</th><th>Répartition</th></tr>
        </thead>
        <tbody>
            @forelse ($par_categorie as $c)
                <tr>
                    <td>{{ $c->nom_categorie }}</td>
                    <td class="text-droit"><strong>{{ $c->total }}</strong></td>
                    <td><div class="barre-fond"><div class="barre-remplie" style="width: {{ round($c->total / $maxCat * 100) }}%;"></div></div></td>
                </tr>
            @empty
                <tr><td colspan="3" class="muted">Aucune catégorie.</td></tr>
            @endforelse
        </tbody>
    </table>

    {{-- Top mobiles --}}
    <h2>6. Matériel le plus mobile de la période</h2>
    <table>
        <thead>
            <tr><th style="width:110px;">Code inventaire</th><th>Désignation</th><th>Modèle</th><th class="text-droit" style="width:90px;">Affectations</th></tr>
        </thead>
        <tbody>
            @forelse ($top_mobiles as $e)
                <tr>
                    <td class="mono"><strong>{{ $e['code_inventaire'] }}</strong></td>
                    <td>{{ $e['designation'] }}</td>
                    <td class="muted">{{ $e['libelle'] ?: '—' }}</td>
                    <td class="text-droit"><strong>{{ $e['total'] }}</strong></td>
                </tr>
            @empty
                <tr><td colspan="4" class="muted">Aucune affectation enregistrée sur la période.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="carte-meta" style="margin-top: 16px;">
        <table>
            <tr>
                <td class="muted">
                    <strong>Validation :</strong> rapport établi par le Service Informatique — à viser par le Directeur du Système d'Information.
                </td>
            </tr>
        </table>
    </div>
@endsection
