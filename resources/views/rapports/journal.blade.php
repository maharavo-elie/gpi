@extends('rapports.layout')

@section('ref', 'GPI/RPT/JAL/' . now()->format('Y'))
@section('titre', 'Journal d\u2019activité — traçabilité des opérations')
@section('perimetre', $descriptionFiltres)

@section('contenu')
    <div class="carte-meta">
        <table>
            <tr>
                <td><strong>Périmètre :</strong> {{ $descriptionFiltres }}</td>
                <td class="text-droit"><strong>Édité par :</strong> {{ $editeur }}</td>
            </tr>
            <tr>
                <td class="muted">{{ $logs->count() }} opération(s) tracée(s) — triées de la plus récente à la plus ancienne.</td>
                <td class="text-droit muted">Fonction : {{ $fonction }}</td>
            </tr>
        </table>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width:16px;">#</th>
                <th style="width:80px;">Horodatage</th>
                <th style="width:90px;">Action</th>
                <th style="width:80px;">Table</th>
                <th style="width:30px;">Élém.</th>
                <th>Utilisateur</th>
                <th style="width:78px;">Adresse IP</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($logs as $log)
                @php
                    $badge = match (true) {
                        str_starts_with($log->action ?? '', 'création') => 'b-vert',
                        str_starts_with($log->action ?? '', 'suppression') => 'b-rouge',
                        str_starts_with($log->action ?? '', 'modification') => 'b-orange',
                        default => 'b-bleu',
                    };
                @endphp
                <tr>
                    <td class="muted">{{ $loop->iteration }}</td>
                    <td class="mono">{{ $log->date_action?->format('d/m/y H:i') ?? \Illuminate\Support\Carbon::parse($log->created_at)->format('d/m/y H:i') }}</td>
                    <td><span class="badge {{ $badge }}">{{ $log->action }}</span></td>
                    <td class="mono muted">{{ $log->table_concernee ?? '—' }}</td>
                    <td class="mono">{{ $log->id_element ?? '—' }}</td>
                    <td>{{ $log->utilisateur?->nom_complet ?? $log->utilisateur?->username ?? 'Système' }}</td>
                    <td class="mono muted">{{ $log->adresse_ip ?? '—' }}</td>
                </tr>
            @empty
                <tr><td colspan="7" class="muted">Aucune activité pour ces critères.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="carte-meta" style="margin-top: 12px;">
        <table>
            <tr>
                <td class="muted">
                    <strong>Visa du responsable SIT :</strong> ______________________ &nbsp;&nbsp;
                    <strong>Visa de la DSI :</strong> ______________________
                </td>
            </tr>
        </table>
    </div>
@endsection
