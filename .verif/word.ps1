$ErrorActionPreference = "Stop"
$docx = "D:\gpi\rapports\Rapport_de_stage_GPI_DGSR.docx"
$pdf  = "D:\gpi\rapports\Rapport_de_stage_GPI_DGSR.pdf"

# Word est mono-instance : le script se rattache a la session ouverte de
# l'utilisateur. Il ne la masque pas et ne la ferme jamais ; seul le document
# du rapport est ouvert puis referme.
$word = [Runtime.InteropServices.Marshal]::GetActiveObject("Word.Application")
$word.DisplayAlerts = 0

$doc = $word.Documents.Open($docx, $false, $false)

$doc.Fields.Update() | Out-Null
foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
$doc.Repaginate()

$pages = $doc.ComputeStatistics(2)
$words = $doc.ComputeStatistics(0)

$doc.Save()
$doc.ExportAsFixedFormat($pdf, 17)

Write-Output ("pages=" + $pages + " words=" + $words)

$doc.Close($false)
