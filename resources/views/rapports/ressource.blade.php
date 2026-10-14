@extends('rapports.layout')

@section('ref', $prefixeRef . now()->format('Y'))
@section('titre', $titreRegistre)
@section('perimetre', $descriptionFiltres)

@section('contenu')
    <div class="carte-meta">
        <table>
            <tr>
                <td><strong>Périmètre :</strong> {{ $descriptionFiltres }}</td>
                <td class="text-droit"><strong>Édité par :</strong> {{ $editeur }}</td>
            </tr>
            <tr>
                <td><strong>Nombre d'éléments :</strong> {{ $lignes->count() }}{{ $lignes->count() >= 300 ? ' (limité à 300)' : '' }}</td>
                <td class="text-droit">{{ $fonction }}</td>
            </tr>
        </table>
    </div>

    <table class="registre">
        <thead>
            <tr>
                <th style="width: 22px;">N°</th>
                @foreach ($colonnes as $i => $colonne)
                    <th style="width: {{ $largeurs[$i] ?? '' }}%">{{ $colonne }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse ($lignes as $ligne)
                <tr>
                    <td class="mono muted">{{ $loop->iteration }}</td>
                    @foreach ($ligne as $i => $cellule)
                        <td @if($i === 0) class="mono" @endif>{{ $cellule === null || $cellule === '' ? '—' : $cellule }}</td>
                    @endforeach
                </tr>
            @empty
                <tr><td colspan="{{ count($colonnes) + 1 }}" class="muted" style="text-align:center; padding: 12px;">Aucun élément — ajustez les filtres.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div style="margin-top: 28px;">
        <table style="border-collapse: separate; border-spacing: 8px 0;">
            <tr>
                <td style="width: 33%; border: none; background: none !important; font-size: 8.5px; color: #475569;">
                    <strong>Établi par</strong><br><br><br>_____________________________<br>{{ $editeur }}
                </td>
                <td style="width: 33%; border: none; background: none !important; font-size: 8.5px; color: #475569;">
                    <strong>Vérifié par</strong><br><br><br>_____________________________<br>Responsable informatique
                </td>
                <td style="width: 34%; border: none; background: none !important; font-size: 8.5px; color: #475569;">
                    <strong>Approuvé par</strong><br><br><br>_____________________________<br>Direction
                </td>
            </tr>
        </table>
    </div>
@endsection
