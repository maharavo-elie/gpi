<?php
$f = __DIR__.'/x/word/document.xml';
$s = file_get_contents($f);
$needle = 'TOC \\h \\z \\c "Tableau';
$i = strpos($s, $needle);
echo "position: $i\n";
if ($i !== false) {
    $start = max(0, $i - 600);
    $chunk = substr($s, $start, 1800);
    echo str_replace('><', ">\n<", $chunk), "\n";
}
