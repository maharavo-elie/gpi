<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>@yield('titre', 'Rapport') — GPI DGSR</title>
    <style>
        /* ---------- Base print A4 ---------- */
        @page { margin: 38px 30px 46px 30px; }
        * { box-sizing: border-box; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 9.5px;
            color: #1e293b;
        }
        h1 { font-size: 16px; margin: 0 0 2px 0; color: #0f172a; }
        h2 { font-size: 12px; margin: 14px 0 6px 0; color: #1d4ed8; border-bottom: 1.5px solid #1d4ed8; padding-bottom: 3px; }
        h3 { font-size: 10.5px; margin: 10px 0 4px 0; color: #334155; }
        p { margin: 3px 0; }
        table { width: 100%; border-collapse: collapse; margin: 6px 0; }
        th {
            background: #1e40af; color: #ffffff; font-size: 8.5px;
            text-transform: uppercase; letter-spacing: 0.4px;
            padding: 5px 6px; text-align: left;
        }
        td {
            border-bottom: 0.5px solid #cbd5e1;
            padding: 4px 6px; font-size: 9px; vertical-align: top;
        }
        tr:nth-child(even) td { background: #f1f5f9; }
        .text-droit { text-align: right; }
        .mono { font-family: DejaVu Sans Mono, monospace; font-size: 8.5px; }
        .muted { color: #64748b; }
        .badge {
            display: inline-block; padding: 1px 6px; border-radius: 8px;
            font-size: 8px; font-weight: bold; border: 0.5px solid;
        }
        .b-vert { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
        .b-bleu { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .b-orange { background: #fff7ed; color: #c2410c; border-color: #fed7aa; }
        .b-rouge { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
        .b-gris { background: #f8fafc; color: #475569; border-color: #e2e8f0; }

        /* ---------- En-tête officiel ---------- */
        .entete { border-bottom: 3px solid #1e40af; padding-bottom: 8px; margin-bottom: 12px; }
        .entete table { margin: 0; }
        .entete td { border: none; background: none !important; padding: 0; }
        .logo {
            width: 46px; height: 46px; background: #1e40af; color: #fff;
            text-align: center; vertical-align: middle; font-size: 11px; font-weight: bold;
            line-height: 46px;
        }
        .titre-org { font-size: 11px; font-weight: bold; color: #0f172a; }
        .sous-titre-org { font-size: 8.5px; color: #64748b; }
        .ref-doc { text-align: right; font-size: 8px; color: #64748b; line-height: 1.5; }

        /* ---------- Filigrane ---------- */
        .filigrane {
            position: fixed; top: 45%; left: 18%;
            font-size: 34px; font-weight: bold; color: rgba(30, 64, 175, 0.06);
            transform: rotate(-28deg); white-space: nowrap;
        }

        /* ---------- Bloc méta du rapport ---------- */
        .carte-meta {
            background: #eff6ff; border: 0.5px solid #bfdbfe; border-radius: 6px;
            padding: 8px 10px; margin-bottom: 12px;
        }
        .carte-meta td { border: none; background: none !important; padding: 1px 0; font-size: 9px; }

        /* ---------- KPI ---------- */
        .kpi-grille { width: 100%; border-collapse: separate; border-spacing: 5px 0; margin: 8px 0; }
        .kpi { background: #f8fafc; border: 0.5px solid #e2e8f0; border-radius: 5px; padding: 6px 8px; }
        .kpi .label { font-size: 7.5px; text-transform: uppercase; letter-spacing: 0.4px; color: #64748b; font-weight: bold; }
        .kpi .valeur { font-size: 15px; font-weight: bold; color: #0f172a; }
        .kpi .valeur.petite { font-size: 11px; }

        /* ---------- Barres de répartition ---------- */
        .barre-fond { background: #e2e8f0; height: 8px; width: 100%; }
        .barre-remplie { background: #1d4ed8; height: 8px; }

        /* ---------- Registre : table dense adaptée à l'A4 portrait ---------- */
        table.registre { font-size: 8px; }
        table.registre td { padding: 3px 4px; font-size: 8px; }
        table.registre th { font-size: 7.5px; padding: 4px 4px; }

        /* ---------- Pied de page (fixé par DomPDF) ---------- */
        /* IMPORTANT : pas de floats ici — combinés à une table dans l'en-tête,
           ils font boucler la pagination DomPDF (1 ligne = plusieurs pages). */
        .fixed-position {
            position: fixed; bottom: -32px; left: -30px; right: -30px;
            border-top: 0.5px solid #cbd5e1;
            padding: 4px 0 0 0; margin: 0;
        }
        .fixed-position table { width: 100%; margin: 0; border-collapse: collapse; }
        .fixed-position td { border: none; background: none !important; padding: 0; font-size: 7.5px; color: #94a3b8; }
        .fixed-position .droite { text-align: right; }
        .num-page { font-weight: bold; color: #475569; }
        .pied-space { height: 30px; }
    </style>
</head>
<body>
    <div class="filigrane">CONFIDENTIEL — USAGE INTERNE</div>

    <div class="entete">
        <table>
            <tr>
                <td class="logo">DGSR</td>
                <td style="padding-left: 10px;">
                    <div class="titre-org">REPOBLIKAN'I MADAGASIKARA</div>
                    <div class="sous-titre-org">Direction Générale de la Sécurité Routière — Direction du Système d'Information</div>
                </td>
                <td class="ref-doc mono">
                    Réf. : @yield('ref', 'GPI/RPT/2026')<br>
                    Édité le {{ now()->format('d/m/Y à H:i') }}<br>
                    Page mise en page : @yield('perimetre')
                </td>
            </tr>
        </table>
    </div>

    <h1>@yield('titre')</h1>

    @yield('contenu')

    <div class="pied-space"></div>
    <div class="fixed-position">
        <table>
            <tr>
                <td>GPI — Gestion du Parc Informatique · DGSR · Document généré automatiquement</td>
                <td class="droite"><script type="text/php">
if (isset($pdf)) {
    // Dessine la pagination sur la page courante ; le total est calculé par
    // un premier rendu dans le contrôleur (variable $totalPages).
    $font = $fontMetrics->getFont("DejaVu Sans", "bold");
    $pdf->text($pdf->get_width() - 60, 12, "Page " . $PAGE_NUM . " / {{ $totalPages ?? '?' }}", $font, 7.5, array(0.29, 0.33, 0.41));
}
</script></td>
            </tr>
        </table>
    </div>
</body>
</html>
