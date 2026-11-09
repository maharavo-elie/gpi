<?php
$pdf = __DIR__.'/../rapports/Rapport_de_stage_GPI_DGSR.pdf';
$txt = shell_exec('pdftotext -layout '.escapeshellarg($pdf).' -');
$pages = explode("\f", $txt);
$n = count($pages);
echo "pages detectees: $n\n";
foreach ($pages as $i => $p) {
    $clean = preg_replace('/Page\s*[ivxlcdm0-9]+/iu', '', $p);
    $clean = preg_replace('/\s+/u', '', $clean);
    if (mb_strlen($clean) < 40) {
        echo 'page '.($i + 1).' : '.mb_strlen($clean)." caracteres -> ".mb_substr(trim($p), 0, 60)."\n";
    }
}
