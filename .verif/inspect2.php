<?php
$s = file_get_contents(__DIR__.'/x/word/document.xml');
$i = strpos($s, 'TOC \\h \\z \\c "Tableau');
$end = strpos($s, '<w:fldChar w:fldCharType="end"/>', $i);
echo "field end at: $end\n";
echo str_replace('><', ">\n<", substr($s, $end - 200, 1200)), "\n";
