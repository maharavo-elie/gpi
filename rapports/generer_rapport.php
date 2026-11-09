<?php

/**
 * Génère le rapport de stage GPI au format Word (.docx).
 *
 * Utilisation : php rapports/generer_rapport.php
 */
require __DIR__.'/outils/WordDoc.php';

$build = __DIR__.'/.build';

/** Supprime récursivement un dossier. */
$rmrf = function (string $dir) use (&$rmrf): void {
    if (! is_dir($dir)) {
        return;
    }
    foreach (scandir($dir) as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }
        $path = $dir.'/'.$item;
        is_dir($path) ? $rmrf($path) : unlink($path);
    }
    rmdir($dir);
};

$rmrf($build);
mkdir($build.'/media', 0777, true);

$doc = new WordDoc($build.'/media');

foreach (['00-front', '01-presentations', '02-analyse', '03-realisation', '04-fin'] as $part) {
    $renderer = require __DIR__.'/contenu/'.$part.'.php';
    $renderer($doc);
}

$output = __DIR__.'/Rapport_de_stage_GPI_DGSR.docx';
$doc->save(
    $output,
    'Conception et développement d’une application de gestion du parc informatique (GPI)',
    'Rapport de stage — Direction Générale de la Sécurité Routière',
    'RAKOTOMAMINIRIANA Fanomezaniavo Fenohery Sarobidy'
);

$rmrf($build);

printf("Document généré : %s (%.1f Ko)\n", $output, filesize($output) / 1024);
