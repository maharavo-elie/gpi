$ErrorActionPreference = "Stop"
$docx = "D:\gpi\rapports\Rapport_de_stage_GPI_DGSR.docx"
$pdf  = "D:\gpi\rapports\Rapport_de_stage_GPI_DGSR.pdf"

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

$doc = $word.Documents.Open($docx, $false, $false)

# Mise a jour des champs (numerotation des figures/tableaux, renvois)
foreach ($section in $doc.Sections) {
    foreach ($header in $section.Headers) { $header.Range.Fields.Update() | Out-Null }
    foreach ($footer in $section.Footers) { $footer.Range.Fields.Update() | Out-Null }
}
$doc.Fields.Update() | Out-Null
foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
$doc.Repaginate()

$pages = $doc.ComputeStatistics(2)
$words = $doc.ComputeStatistics(0)

$doc.Save()
$doc.ExportAsFixedFormat($pdf, 17)

Write-Output ("pages=" + $pages + " words=" + $words)

$doc.Close($false)
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
