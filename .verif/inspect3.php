<?php
$s = file_get_contents(__DIR__.'/x/word/document.xml');
$i = strpos($s, 'LISTE DES ABRÉVIATIONS');
$chunk = substr($s, max(0, $i - 1500), 1500);
echo str_replace('><', ">\n<", $chunk), "\n";
