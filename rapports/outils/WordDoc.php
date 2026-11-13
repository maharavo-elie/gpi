<?php

/**
 * Générateur DOCX minimaliste (OOXML) pour le rapport de stage GPI.
 * Gère les styles, en-tête/pied, champs TOC, tableaux, images,
 * ainsi que la numérotation automatique des figures et des tableaux.
 */
final class WordDoc
{
    /** Largeur utile du texte (cm) pour une page A4 portrait. */
    public const TEXT_WIDTH_CM = 16.0;

    private array $body = [];
    private array $rels = [];
    private array $media = [];
    private int $relSeq = 10;
    private int $drawSeq = 1000;
    private int $mediaSeq = 0;
    private int $figureSeq = 0;
    private int $tableSeq = 0;

    public function __construct(private string $mediaDir)
    {
        if (! is_dir($this->mediaDir)) {
            mkdir($this->mediaDir, 0777, true);
        }
    }

    /* ------------------------------------------------------------------ */
    /* Utilitaires                                                         */
    /* ------------------------------------------------------------------ */

    public static function e(string $text): string
    {
        return htmlspecialchars($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }

    /** Lettres accentuées ramenées à leur équivalent simple pour le tri. */
    private const ACCENTS = [
        'à' => 'a', 'â' => 'a', 'ä' => 'a', 'á' => 'a',
        'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
        'î' => 'i', 'ï' => 'i', 'í' => 'i',
        'ô' => 'o', 'ö' => 'o', 'ó' => 'o',
        'ù' => 'u', 'û' => 'u', 'ü' => 'u', 'ú' => 'u',
        'ç' => 'c', 'ñ' => 'n', 'œ' => 'oe', 'æ' => 'ae',
    ];

    /** Clé de comparaison insensible à la casse et aux accents. */
    private static function sortKey(string $value): string
    {
        return strtr(mb_strtolower($value), self::ACCENTS);
    }

    /** Trie un tableau associatif par clé, dans l'ordre alphabétique. */
    public static function alphaSort(array $items): array
    {
        uksort($items, static fn ($a, $b): int => strcmp(self::sortKey((string) $a), self::sortKey((string) $b)));

        return $items;
    }

    private function rel(string $target): string
    {
        $existing = array_search($target, $this->rels, true);
        if ($existing !== false) {
            return $existing;
        }

        $id = 'rId'.(++$this->relSeq);
        $this->rels[$id] = $target;

        return $id;
    }

    /** Transforme un texte avec **gras** et *italique* en runs Word. */
    private function runs(string $text, array $rPr = []): string
    {
        $extra = '';
        foreach ($rPr as $tag => $val) {
            $extra .= $val === true ? "<w:$tag/>" : "<w:$tag w:val=\"$val\"/>";
        }

        $parts = preg_split('/(\*\*[^*]+\*\*|\*[^*]+\*)/u', $text, -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY);
        $xml = '';
        foreach ($parts as $part) {
            $bold = false;
            $italic = false;
            if (str_starts_with($part, '**') && str_ends_with($part, '**') && strlen($part) > 4) {
                $part = substr($part, 2, -2);
                $bold = true;
            } elseif (str_starts_with($part, '*') && str_ends_with($part, '*') && strlen($part) > 2) {
                $part = substr($part, 1, -1);
                $italic = true;
            }
            $rPrXml = $extra;
            if ($bold) {
                $rPrXml .= '<w:b/>';
            }
            if ($italic) {
                $rPrXml .= '<w:i/>';
            }
            $open = $rPrXml !== '' ? "<w:rPr>$rPrXml</w:rPr>" : '';
            $xml .= '<w:r>'.$open.'<w:t xml:space="preserve">'.self::e($part).'</w:t></w:r>';
        }

        return $xml;
    }

    /* ------------------------------------------------------------------ */
    /* Blocs de texte                                                      */
    /* ------------------------------------------------------------------ */

    public function raw(string $xml): void
    {
        $this->body[] = $xml;
    }

    public function p(string $text = '', string $style = 'Corps', array $opts = []): void
    {
        $pPr = "<w:pStyle w:val=\"$style\"/>";
        if (! empty($opts['align'])) {
            $pPr .= '<w:jc w:val="'.$opts['align'].'"/>';
        }
        if (isset($opts['indent'])) {
            $pPr .= '<w:ind w:firstLine="'.$opts['indent'].'"/>';
        }
        if (isset($opts['spacing'])) {
            $pPr .= '<w:spacing w:before="'.$opts['spacing'].'" w:after="'.$opts['spacing'].'"/>';
        }
        if (! empty($opts['keepNext'])) {
            $pPr .= '<w:keepNext/>';
        }
        if (! empty($opts['pageBreakBefore'])) {
            $pPr .= '<w:pageBreakBefore/>';
        }
        if (! empty($opts['borderBottom'])) {
            $pPr .= '<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="1F3864"/></w:pBdr>';
        }

        $this->body[] = "<w:p><w:pPr>$pPr</w:pPr>".$this->runs($text).'</w:p>';
    }

    public function pageBreak(): void
    {
        $this->body[] = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    }

    public function part(string $text): void
    {
        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="Heading1"/><w:pageBreakBefore/></w:pPr>'
            .$this->runs($text).'</w:p>';
        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="TraitPartie"/></w:pPr></w:p>';
    }

    public function h1(string $text): void
    {
        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="Heading2"/><w:pageBreakBefore/></w:pPr>'
            .$this->runs($text).'</w:p>';
    }

    public function h2(string $text): void
    {
        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="Heading3"/><w:keepNext/></w:pPr>'
            .$this->runs($text).'</w:p>';
    }

    public function h3(string $text): void
    {
        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="Heading4"/><w:keepNext/></w:pPr>'
            .$this->runs($text).'</w:p>';
    }

    /** @param string[] $items */
    public function bullets(array $items, bool $ordered = false, array $opts = []): void
    {
        $numId = $ordered ? 2 : 1;
        $spacing = isset($opts['after'])
            ? '<w:spacing w:after="'.$opts['after'].'" w:line="360" w:lineRule="auto"/>'
            : '';
        $align = ! empty($opts['align']) ? '<w:jc w:val="'.$opts['align'].'"/>' : '';
        foreach ($items as $item) {
            $this->body[] = '<w:p><w:pPr><w:pStyle w:val="Liste"/>'.$spacing.$align.'<w:numPr><w:ilvl w:val="0"/><w:numId w:val="'
                .$numId.'"/></w:numPr></w:pPr>'.$this->runs($item).'</w:p>';
        }
    }

    public function code(string $code): void
    {
        $lines = explode("\n", trim($code));
        $last = count($lines) - 1;
        foreach ($lines as $i => $line) {
            // keepNext sur toutes les lignes sauf la dernière : le bloc de code
            // reste d’un seul tenant et n’est pas coupé par un saut de page.
            $keep = $i < $last ? '<w:keepNext/>' : '';
            $this->body[] = '<w:p><w:pPr><w:pStyle w:val="Code"/>'.$keep.'</w:pPr>'
                .'<w:r><w:t xml:space="preserve">'.self::e($line === '' ? ' ' : $line).'</w:t></w:r></w:p>';
        }
        $this->p('', 'Corps', ['spacing' => 0]);
    }

    /** Paragraphe encadré (citation, remarque). */
    public function note(string $text): void
    {
        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="Note"/></w:pPr>'.$this->runs($text).'</w:p>';
    }

    /* ------------------------------------------------------------------ */
    /* Tableaux                                                            */
    /* ------------------------------------------------------------------ */

    /**
     * @param string[]             $headers
     * @param array<int, string[]> $rows
     * @param float[]|null         $widths largeurs relatives (cm)
     */
    public function table(array $headers, array $rows, ?array $widths = null, ?string $caption = null, string $fontSize = '9.5', bool $sortRows = false): void
    {
        if ($sortRows) {
            usort($rows, static fn (array $a, array $b): int => strcmp(
                self::sortKey((string) ($a[0] ?? '')),
                self::sortKey((string) ($b[0] ?? ''))
            ));
        }

        $count = count($headers);
        if ($widths === null) {
            $widths = array_fill(0, $count, self::TEXT_WIDTH_CM / $count);
        }

        if ($caption !== null) {
            $this->tableSeq++;
            $this->body[] = '<w:p><w:pPr><w:pStyle w:val="LegendeTableau"/><w:keepNext/></w:pPr>'
                .'<w:r><w:t xml:space="preserve">Tableau </w:t></w:r>'
                .$this->seqField('Tableau', $this->tableSeq)
                .$this->runs('. '.$caption).'</w:p>';
        }

        $twips = array_map(fn ($cm) => (int) round($cm * 567), $widths);
        $grid = '';
        foreach ($twips as $t) {
            $grid .= '<w:gridCol w:w="'.$t.'"/>';
        }

        $borders = '<w:tblBorders>'
            .'<w:top w:val="single" w:sz="6" w:space="0" w:color="8EA9C1"/>'
            .'<w:left w:val="single" w:sz="6" w:space="0" w:color="8EA9C1"/>'
            .'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="8EA9C1"/>'
            .'<w:right w:val="single" w:sz="6" w:space="0" w:color="8EA9C1"/>'
            .'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="B4C6E7"/>'
            .'<w:insideV w:val="single" w:sz="4" w:space="0" w:color="B4C6E7"/>'
            .'</w:tblBorders>';

        $tblPr = '<w:tblPr><w:tblStyle w:val="TableauGPI"/><w:tblW w:type="dxa" w:w="'.$this->cm(16).'"/>'
            .'<w:jc w:val="center"/>'.$borders
            .'<w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="90" w:type="dxa"/>'
            .'<w:bottom w:w="60" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar>'
            .'<w:tblLayout w:type="fixed"/></w:tblPr>';

        $xml = '<w:tbl>'.$tblPr.'<w:tblGrid>'.$grid.'</w:tblGrid>';

        // Ligne d'en-tête
        $xml .= '<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>';
        foreach ($headers as $i => $h) {
            $xml .= '<w:tc><w:tcPr><w:tcW w:w="'.$twips[$i].'" w:type="dxa"/>'
                .'<w:shd w:val="clear" w:color="auto" w:fill="D9E2F3"/>'
                .'<w:vAlign w:val="center"/></w:tcPr>'
                .'<w:p><w:pPr><w:pStyle w:val="CelluleEntete"/></w:pPr>'
                .'<w:r><w:rPr><w:b/><w:sz w:val="'.(int) ($fontSize * 2).'"/></w:rPr>'
                .'<w:t xml:space="preserve">'.self::e($h).'</w:t></w:r></w:p></w:tc>';
        }
        $xml .= '</w:tr>';

        foreach ($rows as $r => $row) {
            $shade = $r % 2 === 1 ? '<w:shd w:val="clear" w:color="auto" w:fill="F2F5FA"/>' : '';
            $xml .= '<w:tr><w:trPr><w:cantSplit/></w:trPr>';
            foreach ($headers as $i => $_) {
                $value = $row[$i] ?? '';
                $xml .= '<w:tc><w:tcPr><w:tcW w:w="'.$twips[$i].'" w:type="dxa"/>'.$shade.'</w:tcPr>'
                    .'<w:p><w:pPr><w:pStyle w:val="Cellule"/></w:pPr>'
                    .$this->runs($value, ['sz' => (string) ((int) ($fontSize * 2))])
                    .'</w:p></w:tc>';
            }
            $xml .= '</w:tr>';
        }

        $xml .= '</w:tbl>';
        $this->body[] = $xml;

        // petit espace après le tableau
        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="EspaceTableau"/></w:pPr></w:p>';
    }

    private function cm(float $cm): int
    {
        return (int) round($cm * 567);
    }

    /* ------------------------------------------------------------------ */
    /* Images                                                              */
    /* ------------------------------------------------------------------ */

    public function figure(string $path, string $caption, float $widthCm = 15.5): void
    {
        if (! is_file($path)) {
            throw new RuntimeException("Image introuvable : $path");
        }
        [$w, $h] = getimagesize($path);
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $ext = $ext === 'jpg' ? 'jpeg' : $ext;

        $this->mediaSeq++;
        $fileName = 'image'.$this->mediaSeq.'.'.$ext;
        copy($path, $this->mediaDir.'/'.$fileName);
        $rid = $this->rel('media/'.$fileName);

        $cx = (int) round($widthCm * 360000);
        $cy = (int) round($cx * $h / $w);
        $id = ++$this->drawSeq;

        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="Image"/><w:keepNext/></w:pPr>'
            .'<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">'
            .'<wp:extent cx="'.$cx.'" cy="'.$cy.'"/>'
            .'<wp:effectExtent l="0" t="0" r="0" b="0"/>'
            .'<wp:docPr id="'.$id.'" name="Figure '.$this->mediaSeq.'"/>'
            .'<wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr>'
            .'<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
            .'<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
            .'<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
            .'<pic:nvPicPr><pic:cNvPr id="'.$id.'" name="'.$fileName.'"/><pic:cNvPicPr/></pic:nvPicPr>'
            .'<pic:blipFill><a:blip r:embed="'.$rid.'"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
            .'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="'.$cx.'" cy="'.$cy.'"/></a:xfrm>'
            .'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
            .'</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>';

        $this->figureSeq++;
        $this->body[] = '<w:p><w:pPr><w:pStyle w:val="LegendeFigure"/></w:pPr>'
            .'<w:r><w:t xml:space="preserve">Figure </w:t></w:r>'
            .$this->seqField('Figure', $this->figureSeq)
            .$this->runs('. '.$caption).'</w:p>';
    }

    /* ------------------------------------------------------------------ */
    /* Champs (SEQ, TOC) et sections                                       */
    /* ------------------------------------------------------------------ */

    private function seqField(string $label, int $value): string
    {
        return '<w:r><w:fldChar w:fldCharType="begin"/></w:r>'
            .'<w:r><w:instrText xml:space="preserve"> SEQ '.$label.' \\* ARABIC </w:instrText></w:r>'
            .'<w:r><w:fldChar w:fldCharType="separate"/></w:r>'
            .'<w:r><w:t>'.$value.'</w:t></w:r>'
            .'<w:r><w:fldChar w:fldCharType="end"/></w:r>';
    }

    public function toc(string $instruction, string $placeholder = 'Mettre à jour les champs (Ctrl+A puis F9).'): void
    {
        // Le paragraphe conteneur ne porte que le champ : il ne doit pas hériter
        // du style TOC1 (graisse, espacement), sinon son marqueur de fin crée
        // une page blanche lorsque la liste remplit la page.
        $this->body[] = '<w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="20" w:lineRule="exact"/></w:pPr>'
            .'<w:r><w:fldChar w:fldCharType="begin"/></w:r>'
            .'<w:r><w:instrText xml:space="preserve"> '.$instruction.' </w:instrText></w:r>'
            .'<w:r><w:fldChar w:fldCharType="separate"/></w:r>'
            .'<w:r><w:rPr><w:i/><w:color w:val="808080"/></w:rPr><w:t>'.self::e($placeholder).'</w:t></w:r>'
            .'<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>';
    }

    /**
     * Fin de section. $opts : footer (bool), start (int), landscape (bool).
     */
    public function sectionBreak(array $opts = []): void
    {
        $this->body[] = '<w:p><w:pPr>'.$this->sectPr($opts).'</w:pPr></w:p>';
    }

    private function sectPr(array $opts): string
    {
        $landscape = $opts['landscape'] ?? false;
        [$w, $h] = $landscape ? [16838, 11906] : [11906, 16838];
        $margins = $landscape
            ? '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/>'
            : '<w:pgMar w:top="1418" w:right="1418" w:bottom="1418" w:left="1418" w:header="709" w:footer="709" w:gutter="0"/>';

        $refs = '';
        if (! empty($opts['header'])) {
            $refs .= '<w:headerReference w:type="default" r:id="'.$this->rel('header1.xml').'"/>';
        }
        $foot = $opts['footer'] ?? false;
        if ($foot) {
            $footName = is_string($foot) ? $foot : 'footer1.xml';
            $refs .= '<w:footerReference w:type="default" r:id="'.$this->rel($footName).'"/>';
        }

        $num = '';
        if (isset($opts['start']) || isset($opts['numFmt'])) {
            $num = '<w:pgNumType'
                .(isset($opts['numFmt']) ? ' w:fmt="'.$opts['numFmt'].'"' : '')
                .(isset($opts['start']) ? ' w:start="'.$opts['start'].'"' : '')
                .'/>';
        }

        $titlePg = ! empty($opts['titlePg']) ? '<w:titlePg/>' : '';

        return '<w:sectPr>'.$refs.$titlePg
            .'<w:pgSz w:w="'.$w.'" w:h="'.$h.'"'.($landscape ? ' w:orient="landscape"' : '').'/>'
            .$margins.$num
            .'<w:cols w:space="708"/><w:docGrid w:linePitch="360"/></w:sectPr>';
    }

    /* ------------------------------------------------------------------ */
    /* Assemblage                                                          */
    /* ------------------------------------------------------------------ */

    public function save(string $path, string $title, string $subject, string $author): void
    {
        $document = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'
            .' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
            .' xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"'
            .' xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"'
            .' xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"'
            .' xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"'
            .' xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"'
            .' xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="wp14">'
            .'<w:body>'.implode('', $this->body).$this->sectPr(['footer' => true, 'header' => true, 'start' => 1]).'</w:body></w:document>';

        $rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';

        // relations de base
        $baseRels = [
            'styles.xml' => 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles',
            'settings.xml' => 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings',
            'numbering.xml' => 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering',
            'header1.xml' => 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/header',
            'footer1.xml' => 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer',
            'footer2.xml' => 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer',
        ];
        // éviter les doublons d'id entre les sections et les relations de base
        $used = [];
        foreach ($this->rels as $id => $target) {
            $used[$target] = $id;
        }
        $extraBody = '';
        foreach ($baseRels as $target => $type) {
            if (isset($used[$target])) {
                $id = $used[$target];
            } else {
                $id = 'rIdBase'.(count($used) + 1);
                $used[$target] = $id;
            }
            $rels .= '<Relationship Id="'.$id.'" Type="'.$type.'" Target="'.$target.'"/>';
        }
        foreach ($this->rels as $id => $target) {
            if (isset($baseRels[$target])) {
                continue;
            }
            $rels .= '<Relationship Id="'.$id.'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="'.$target.'"/>';
        }
        $rels .= '</Relationships>';

        $zip = new ZipArchive();
        if ($zip->open($path, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new RuntimeException("Impossible de créer $path");
        }

        $zip->addFromString('[Content_Types].xml', $this->contentTypes());
        $zip->addFromString('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
            .'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
            .'<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
            .'</Relationships>');
        $zip->addFromString('word/document.xml', $document);
        $zip->addFromString('word/_rels/document.xml.rels', $rels);
        $zip->addFromString('word/styles.xml', $this->styles());
        $zip->addFromString('word/settings.xml', $this->settings());
        $zip->addFromString('word/numbering.xml', $this->numbering());
        $zip->addFromString('word/header1.xml', $this->header());
        $zip->addFromString('word/footer1.xml', $this->footer());
        $zip->addFromString('word/footer2.xml', $this->footer());
        $zip->addFromString('docProps/core.xml', $this->core($title, $subject, $author));
        $zip->addFromString('docProps/app.xml', $this->app());

        foreach (glob($this->mediaDir.'/*') as $file) {
            $zip->addFile($file, 'word/media/'.basename($file));
        }

        $zip->close();
    }

    private function contentTypes(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            .'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            .'<Default Extension="xml" ContentType="application/xml"/>'
            .'<Default Extension="png" ContentType="image/png"/>'
            .'<Default Extension="jpeg" ContentType="image/jpeg"/>'
            .'<Default Extension="jpg" ContentType="image/jpeg"/>'
            .'<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
            .'<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
            .'<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>'
            .'<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>'
            .'<Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>'
            .'<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>'
            .'<Override PartName="/word/footer2.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>'
            .'<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
            .'<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
            .'</Types>';
    }

    private function header(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<w:hdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            .'<w:p><w:pPr><w:pStyle w:val="EnTete"/><w:tabs><w:tab w:val="right" w:pos="9070"/></w:tabs>'
            .'<w:pBdr><w:bottom w:val="single" w:sz="4" w:space="2" w:color="8EA9C1"/></w:pBdr></w:pPr>'
            .'<w:r><w:t>Rapport de stage — Licence Professionnelle Informatique</w:t></w:r>'
            .'<w:r><w:tab/></w:r><w:r><w:t>GPI — DGSR</w:t></w:r></w:p></w:hdr>';
    }

    private function footer(): string
    {
        $field = '<w:r><w:fldChar w:fldCharType="begin"/></w:r>'
            .'<w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>'
            .'<w:r><w:fldChar w:fldCharType="separate"/></w:r>'
            .'<w:r><w:t>1</w:t></w:r>'
            .'<w:r><w:fldChar w:fldCharType="end"/></w:r>';

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            .'<w:p><w:pPr><w:pStyle w:val="PiedPage"/></w:pPr>'
            .'<w:r><w:t xml:space="preserve">Page </w:t></w:r>'.$field.'</w:p></w:ftr>';
    }

    private function settings(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            .'<w:zoom w:percent="100"/>'
            .'<w:defaultTabStop w:val="708"/>'
            .'<w:updateFields w:val="true"/>'
            .'<w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat>'
            .'<w:themeFontLang w:val="fr-FR"/>'
            .'</w:settings>';
    }

    private function numbering(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            .'<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/>'
            .'<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/>'
            .'<w:lvlJc w:val="left"/><w:pPr><w:ind w:left="567" w:hanging="283"/></w:pPr>'
            .'<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:lvl></w:abstractNum>'
            .'<w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="singleLevel"/>'
            .'<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/>'
            .'<w:lvlJc w:val="left"/><w:pPr><w:ind w:left="567" w:hanging="340"/></w:pPr></w:lvl></w:abstractNum>'
            .'<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>'
            .'<w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>'
            .'</w:numbering>';
    }

    private function core(string $title, string $subject, string $author): string
    {
        $date = gmdate('Y-m-d\TH:i:s\Z');

        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"'
            .' xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/"'
            .' xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
            .'<dc:title>'.self::e($title).'</dc:title>'
            .'<dc:subject>'.self::e($subject).'</dc:subject>'
            .'<dc:creator>'.self::e($author).'</dc:creator>'
            .'<cp:lastModifiedBy>'.self::e($author).'</cp:lastModifiedBy>'
            .'<dcterms:created xsi:type="dcterms:W3CDTF">'.$date.'</dcterms:created>'
            .'<dcterms:modified xsi:type="dcterms:W3CDTF">'.$date.'</dcterms:modified>'
            .'</cp:coreProperties>';
    }

    private function app(): string
    {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"'
            .' xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
            .'<Application>Microsoft Office Word</Application><Company>ENI — DGSR</Company>'
            .'</Properties>';
    }

    /* ------------------------------------------------------------------ */
    /* Styles                                                              */
    /* ------------------------------------------------------------------ */

    private function styles(): string
    {
        $s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            .'<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
            .'<w:docDefaults><w:rPrDefault><w:rPr>'
            .'<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>'
            .'<w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="fr-FR"/>'
            .'</w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="360" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>';

        $s .= '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/>'
            .'<w:pPr><w:spacing w:after="120" w:line="360" w:lineRule="auto"/></w:pPr></w:style>';

        // Corps : justifié, alinéa 1,25 cm
        $s .= '<w:style w:type="paragraph" w:styleId="Corps"><w:name w:val="Corps de texte"/><w:basedOn w:val="Normal"/><w:qFormat/>'
            .'<w:pPr><w:jc w:val="both"/><w:ind w:firstLine="709"/><w:spacing w:after="160" w:line="360" w:lineRule="auto"/></w:pPr></w:style>';

        // Hiérarchie du plan : la partie est le niveau 1, le chapitre le niveau 2,
        // les titres x.y le niveau 3 et les titres x.y.z le niveau 4. Les styles
        // portent les identifiants des titres Word afin que les champs de table
        // des matières puissent s’arrêter au niveau demandé.
        $s .= $this->stylePara('Heading1', 'Titre 1', 36, true, '1F3864', 'center', 240, 240, false, 0)
            .$this->stylePara('TraitPartie', 'Trait de partie', 12, false, '8EA9C1', 'center', 0, 240, true)
            .$this->stylePara('Heading2', 'Titre 2', 32, true, '1F3864', 'left', 0, 240, false, 1)
            .$this->stylePara('Heading3', 'Titre 3', 28, true, '2E5395', 'left', 240, 120, false, 2)
            .$this->stylePara('Heading4', 'Titre 4', 24, true, '2E5395', 'left', 200, 100, false, 3, true)
            // Titre des pages liminaires : même présentation que le niveau 1, mais
            // sans niveau hiérarchique afin de ne pas figurer dans le sommaire.
            .$this->stylePara('TitreLiminaire', 'Titre liminaire', 32, true, '1F3864', 'left', 0, 240, false, null);

        // Légendes
        $s .= '<w:style w:type="paragraph" w:styleId="LegendeFigure"><w:name w:val="Légende figure"/><w:basedOn w:val="Normal"/><w:qFormat/>'
            .'<w:pPr><w:jc w:val="center"/><w:spacing w:before="80" w:after="240" w:line="240" w:lineRule="auto"/></w:pPr>'
            .'<w:rPr><w:i/><w:sz w:val="20"/><w:szCs w:val="20"/><w:color w:val="404040"/></w:rPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="LegendeTableau"><w:name w:val="Légende tableau"/><w:basedOn w:val="Normal"/><w:qFormat/>'
            .'<w:pPr><w:jc w:val="center"/><w:spacing w:before="160" w:after="80" w:line="240" w:lineRule="auto"/></w:pPr>'
            .'<w:rPr><w:i/><w:sz w:val="20"/><w:szCs w:val="20"/><w:color w:val="404040"/></w:rPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="Image"><w:name w:val="Image"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:jc w:val="center"/><w:spacing w:before="120" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="EspaceTableau"><w:name w:val="Espace tableau"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:spacing w:after="60" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:sz w:val="12"/></w:rPr></w:style>';

        // Listes
        $s .= '<w:style w:type="paragraph" w:styleId="Liste"><w:name w:val="Liste"/><w:basedOn w:val="Normal"/><w:qFormat/>'
            .'<w:pPr><w:jc w:val="both"/><w:spacing w:after="80" w:line="360" w:lineRule="auto"/></w:pPr></w:style>';

        // Code
        $s .= '<w:style w:type="paragraph" w:styleId="Code"><w:name w:val="Code"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:ind w:left="283"/><w:shd w:val="clear" w:color="auto" w:fill="F2F2F2"/>'
            .'<w:pBdr><w:left w:val="single" w:sz="12" w:space="4" w:color="8EA9C1"/></w:pBdr></w:pPr>'
            .'<w:rPr><w:rFonts w:ascii="Consolas" w:hAnsi="Consolas"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style>';

        // Note encadrée
        $s .= '<w:style w:type="paragraph" w:styleId="Note"><w:name w:val="Note"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:jc w:val="both"/><w:spacing w:before="120" w:after="160"/><w:ind w:left="283" w:right="283"/>'
            .'<w:shd w:val="clear" w:color="auto" w:fill="EAF1FB"/><w:pBdr><w:left w:val="single" w:sz="18" w:space="6" w:color="2E5395"/></w:pBdr></w:pPr>'
            .'<w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr></w:style>';

        // Cellules
        $s .= '<w:style w:type="paragraph" w:styleId="Cellule"><w:name w:val="Cellule"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/></w:pPr>'
            .'<w:rPr><w:sz w:val="19"/><w:szCs w:val="19"/></w:rPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="CelluleEntete"><w:name w:val="Cellule en-tête"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="left"/></w:pPr>'
            .'<w:rPr><w:b/><w:sz w:val="19"/><w:szCs w:val="19"/><w:color w:val="1F3864"/></w:rPr></w:style>';

        // En-tête / pied
        $s .= '<w:style w:type="paragraph" w:styleId="EnTete"><w:name w:val="En-tête"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>'
            .'<w:rPr><w:sz w:val="18"/><w:color w:val="595959"/></w:rPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="PiedPage"><w:name w:val="Pied de page"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:jc w:val="center"/><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>'
            .'<w:rPr><w:sz w:val="18"/><w:color w:val="595959"/></w:rPr></w:style>';

        // Styles de table des matières
        $s .= '<w:style w:type="paragraph" w:styleId="TOC1"><w:name w:val="toc 1"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9070"/></w:tabs>'
            .'<w:spacing w:before="120" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>'
            .'<w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="1F3864"/></w:rPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="TOC2"><w:name w:val="toc 2"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9070"/></w:tabs>'
            .'<w:spacing w:after="20" w:line="240" w:lineRule="auto"/><w:ind w:left="283"/></w:pPr>'
            .'<w:rPr><w:sz w:val="21"/></w:rPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="TOC3"><w:name w:val="toc 3"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9070"/></w:tabs>'
            .'<w:spacing w:after="20" w:line="240" w:lineRule="auto"/><w:ind w:left="567"/></w:pPr>'
            .'<w:rPr><w:sz w:val="20"/></w:rPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="TOC4"><w:name w:val="toc 4"/><w:basedOn w:val="Normal"/>'
            .'<w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9070"/></w:tabs>'
            .'<w:spacing w:after="10" w:line="240" w:lineRule="auto"/><w:ind w:left="850"/></w:pPr>'
            .'<w:rPr><w:sz w:val="20"/></w:rPr></w:style>';

        // Remerciements : chaque personne est citée après un tiret.
        $s .= '<w:style w:type="paragraph" w:styleId="Remerciement"><w:name w:val="Remerciement"/><w:basedOn w:val="Normal"/><w:qFormat/>'
            .'<w:pPr><w:jc w:val="both"/><w:ind w:left="340" w:hanging="340"/>'
            .'<w:spacing w:after="100" w:line="360" w:lineRule="auto"/></w:pPr></w:style>';

        // Sommaire (liste simplifiée, sans numéros de page)
        $s .= '<w:style w:type="paragraph" w:styleId="Sommaire"><w:name w:val="Sommaire"/><w:basedOn w:val="Normal"/><w:qFormat/>'
            .'<w:pPr><w:spacing w:before="120" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>'
            .'<w:rPr><w:b/><w:color w:val="1F3864"/><w:sz w:val="22"/></w:rPr></w:style>';

        $s .= '<w:style w:type="paragraph" w:styleId="Sommaire2"><w:name w:val="Sommaire niveau 2"/><w:basedOn w:val="Normal"/><w:qFormat/>'
            .'<w:pPr><w:spacing w:after="20" w:line="240" w:lineRule="auto"/><w:ind w:left="340"/></w:pPr>'
            .'<w:rPr><w:sz w:val="21"/></w:rPr></w:style>';

        // Couverture
        $s .= $this->stylePara('CouvertureInstitution', 'Couverture institution', 26, true, '1F3864', 'center', 0, 40)
            .$this->stylePara('CouvertureTitre', 'Couverture titre', 44, true, '1F3864', 'center', 240, 120, false, null, false, 320)
            .$this->stylePara('CouvertureSousTitre', 'Couverture sous-titre', 26, false, '2E5395', 'center', 0, 160, true)
            .$this->stylePara('CouvertureTexte', 'Couverture texte', 24, false, '000000', 'center', 0, 60)
            .$this->stylePara('CouvertureNom', 'Couverture nom', 26, true, '000000', 'center', 0, 60);

        $s .= '<w:style w:type="table" w:default="1" w:styleId="TableauGPI"><w:name w:val="Tableau GPI"/>'
            .'<w:tblPr><w:jc w:val="center"/></w:tblPr></w:style>';

        $s .= '</w:styles>';

        return $s;
    }

    private function stylePara(
        string $id,
        string $name,
        int $size,
        bool $bold,
        string $color,
        string $align,
        int $before = 0,
        int $after = 120,
        bool $border = false,
        ?int $outline = null,
        bool $italic = false,
        int $line = 240
    ): string {
        $pPr = '<w:keepNext/><w:spacing w:before="'.$before.'" w:after="'.$after.'" w:line="'.$line.'" w:lineRule="auto"/>'
            .'<w:jc w:val="'.$align.'"/>';
        if ($border) {
            $pPr .= '<w:pBdr><w:bottom w:val="single" w:sz="12" w:space="6" w:color="8EA9C1"/></w:pBdr>';
        }
        if ($outline !== null) {
            $pPr .= '<w:outlineLvl w:val="'.$outline.'"/>';
        }

        return '<w:style w:type="paragraph" w:styleId="'.$id.'"><w:name w:val="'.$name.'"/><w:basedOn w:val="Normal"/><w:qFormat/>'
            .'<w:pPr>'.$pPr.'</w:pPr><w:rPr>'.($bold ? '<w:b/>' : '').($italic ? '<w:i/>' : '')
            .'<w:color w:val="'.$color.'"/><w:sz w:val="'.$size.'"/><w:szCs w:val="'.$size.'"/></w:rPr></w:style>';
    }
}
