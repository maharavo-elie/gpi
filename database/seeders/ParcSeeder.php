<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\DetailAchat;
use App\Models\Equipement;
use App\Models\EtatEquipement;
use App\Models\Localisation;
use App\Models\Marque;
use App\Models\Modele;
use App\Models\Direction;
use Illuminate\Database\Seeder;

class ParcSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['ORDI', 'Ordinateur', 'Ordinateurs de bureau et portables'],
            ['IMPR', 'Imprimante', 'Imprimantes et multifonctions'],
            ['RESE', 'Équipement réseau', 'Switchs, routeurs, points d\'accès'],
            ['SERV', 'Serveur', 'Serveurs physiques'],
            ['SCAN', 'Scanner', 'Scanners et périphériques d\'acquisition'],
            ['TEL', 'Téléphonie / Vidéosurveillance', 'Téléphonie IP, caméras'],
        ];

        $catsById = [];
        foreach ($categories as [$code, $nom, $desc]) {
            $catsById[$code] = Categorie::create([
                'code_categorie' => $code,
                'nom_categorie' => $nom,
                'description' => $desc,
                'statut' => 'actif',
            ]);
        }

        $marques = ['HP', 'Dell', 'Lenovo', 'Canon', 'Cisco', 'TP-Link', 'Epson', 'Hikvision'];
        $marquesById = [];
        foreach ($marques as $m) {
            $marquesById[$m] = Marque::create([
                'nom_marque' => $m,
                'description' => 'Constructeur ' . $m,
            ]);
        }

        /*
         * Spécifications réalistes par modèle. Les prix viennent des lots
         * d'achat (AchatSeeder) : le tableau ne porte plus que la fiche technique
         * et le préfixe de numéro de série au format constructeur.
         * format : [reference, nom, categorie, spec, prefixe SN]
         */
        $modeles = [
            ['HP-450G9', 'HP EliteBook 450 G9', 'ORDI', 'Intel Core i5-1235U, 16 Go DDR4, SSD 512 Go, Windows 11 Pro', '5CD'],
            ['HP-PROD4', 'HP ProDesk 400 G7', 'ORDI', 'Intel Core i5-10500, 8 Go DDR4, SSD 256 Go, Windows 11 Pro', '8CC'],
            ['DEL-LAT3520', 'Dell Latitude 3520', 'ORDI', 'Intel Core i5-1135G7, 8 Go DDR4, SSD 512 Go, Windows 11 Pro', 'J7VF'],
            ['DEL-OPT7010', 'Dell OptiPlex 7010', 'ORDI', 'Intel Core i5-13500, 16 Go DDR5, SSD 512 Go, Windows 11 Pro', 'F7YW'],
            ['LEN-THINKE14', 'Lenovo ThinkPad E14 Gen 4', 'ORDI', 'AMD Ryzen 5 5625U, 16 Go DDR4, SSD 512 Go, Windows 11 Pro', 'PF-3'],
            ['LEN-M720', 'Lenovo ThinkCentre M720q', 'ORDI', 'Intel Core i5-8400T, 8 Go DDR4, SSD 256 Go, Windows 10 Pro', 'PC1'],
            ['HP-LJPRO', 'HP LaserJet Pro M404dn', 'IMPR', 'Imprimante laser monochrome recto-verso, 38 ppm, réseau', 'VNC'],
            ['CAN-IR2625', 'Canon imageRUNNER 2625', 'IMPR', 'Multifonction A3 copie/impression/scan, 25 ppm', 'FTT'],
            ['EPS-WF3820', 'Epson WorkForce WF-3820', 'IMPR', 'Multifonction jet d\'encre A4 Wi-Fi recto-verso', 'X6J'],
            ['CISCO-2960', 'Cisco Catalyst 2960-X 24', 'RESE', 'Switch 24 ports Gigabit + 2 SFP, manageable', 'FOC'],
            ['TPL-EAP225', 'TP-Link EAP225', 'RESE', 'Point d\'accès Wi-Fi AC1350 plafonnier, PoE', '22C'],
            ['HP-PROL30', 'HP ProLiant DL380 Gen10', 'SERV', '2x Intel Xeon Gold 6230, 64 Go DDR4, 4x SSD 960 Go RAID10', 'CZJ'],
            ['CAN-DR2580', 'Canon DR-C2580U', 'SCAN', 'Scanner documentaire A4 recto-verso USB', 'DFG'],
            ['HIK-DS2CD', 'Hikvision DS-2CD2143G2', 'TEL', 'Caméra IP dôme 4 MP PoE IR 30 m', 'D44'],
        ];

        $modelesById = [];
        $marqueParModele = [
            'HP-450G9' => 'HP', 'HP-PROD4' => 'HP', 'HP-LJPRO' => 'HP', 'HP-PROL30' => 'HP',
            'DEL-LAT3520' => 'Dell', 'DEL-OPT7010' => 'Dell',
            'LEN-THINKE14' => 'Lenovo', 'LEN-M720' => 'Lenovo',
            'CAN-IR2625' => 'Canon', 'CAN-DR2580' => 'Canon',
            'CISCO-2960' => 'Cisco', 'TPL-EAP225' => 'TP-Link',
            'EPS-WF3820' => 'Epson', 'HIK-DS2CD' => 'Hikvision',
        ];
        foreach ($modeles as [$ref, $nom, $cat, $spec, $snPrefix]) {
            $modelesById[$ref] = Modele::create([
                'reference_modele' => $ref,
                'nom_modele' => $nom,
                'description' => $spec,
                'id_categorie' => $catsById[$cat]->id_categorie,
                'id_marque' => $marquesById[$marqueParModele[$ref]]->id_marque,
            ]);
        }

        $etats = [
            ['Neuf', 'Équipement neuf, jamais utilisé'],
            ['Bon état', 'Équipement en bon état de fonctionnement'],
            ['Passable', 'Équipement fonctionnel avec traces d\'usure'],
            ['Dégradé', 'Équipement nécessitant une intervention'],
            ['Hors service', 'Équipement inutilisable'],
        ];
        $etatsById = [];
        foreach ($etats as [$nom, $desc]) {
            $etatsById[$nom] = EtatEquipement::create(['nom_etat' => $nom, 'description' => $desc]);
        }

        $locs = Localisation::all();
        $directionsParLoc = $locs->mapWithKeys(fn ($l) => [$l->id_localisation => $l->batiment?->site?->id_direction ?? null]);

        /*
         * Statuts réalistes assignés dans l'ordre de création (~62 % en service,
         * 15 % en stock, minorité en maintenance / réserve / réformé / perdu).
         * L'achat 2026-002 étant encore "commandé", ses équipements sont créés
         * mais non réceptionnés : ils restent en stock sans mise en service.
         */
        $statutsCycle = [
            'en_service', 'en_service', 'en_service', 'en_service', 'en_service', 'en_service',
            'en_stock', 'en_service', 'en_service', 'en_maintenance', 'en_service', 'en_stock',
            'en_service', 'reserve', 'en_service', 'en_service', 'reforme', 'en_service',
            'en_service', 'en_stock', 'en_service', 'en_service', 'en_maintenance', 'en_service',
            'en_service', 'perdu', 'en_service', 'en_stock', 'en_service', 'reserve',
            'en_service', 'en_service', 'reforme', 'en_service', 'en_service', 'en_stock',
        ];

        $formatSerie = fn (string $prefixe) => $prefixe . str_pad((string) random_int(0, 9999999), 7, '0', STR_PAD_LEFT);

        // Consommation des lots d'achat (parc = somme des marchés livrés).
        $details = DetailAchat::with('achat.fournisseur')->orderBy('id_detail_achat')->get();
        $codeInventaire = 0;
        $statutIndex = 0;

        foreach ($details as $detail) {
            $achat = $detail->achat;
            $refModele = str_replace('Lot — ', '', (string) $detail->description);
            $refModele = explode(' × ', $refModele)[0];

            // Les achats de services (1 unité, pas de référence modèle) ne créent pas de matériel.
            if (! isset($modelesById[$refModele])) {
                continue;
            }

            $modele = $modelesById[$refModele];
            $spec = $modele->description;
            $prefixeSn = collect($modeles)->firstWhere('0', $refModele)[4] ?? 'SN';

            for ($k = 0; $k < $detail->quantite; $k++) {
                $codeInventaire++;
                $statut = $statutsCycle[$statutIndex % count($statutsCycle)];
                $statutIndex++;

                // Un marché non livré reste entièrement en stock, sans direction.
                $enStockDeFacto = $achat->statut === 'commande';
                $statut = $enStockDeFacto ? 'en_stock' : $statut;

                $loc = $locs[$codeInventaire % $locs->count()];
                $directionId = $statut === 'en_stock'
                    ? null
                    : ($directionsParLoc[$loc->id_localisation] ?? $loc->batiment?->site?->id_direction);

                $dateAcquisition = $detail->date_livraison
                    ? \Illuminate\Support\Carbon::parse($detail->date_livraison)
                    : \Illuminate\Support\Carbon::parse($achat->date_achat);
                $garantieDuree = random_int(12, 36);

                $equipement = Equipement::create([
                    'code_inventaire' => sprintf('GPI-%05d', $codeInventaire),
                    'numero_serie' => $formatSerie($prefixeSn),
                    'designation' => $modele->nom_modele,
                    'description' => $spec,
                    'date_acquisition' => $dateAcquisition,
                    'date_mise_service' => $statut === 'en_stock' ? null : $dateAcquisition->copy()->addDays(rand(5, 45)),
                    'prix_acquisition' => $detail->prix_unitaire, // prix exact du marché
                    'garantie_debut' => $dateAcquisition->copy(),
                    'garantie_fin' => $dateAcquisition->copy()->addMonths($garantieDuree),
                    'statut' => $statut,
                    'id_modele' => $modele->id_modele,
                    'id_categorie' => $modele->id_categorie,
                    'id_marque' => $modele->id_marque,
                    'id_direction' => $directionId,
                    'id_fournisseur' => $achat->id_fournisseur,
                    'id_detail_achat' => $detail->id_detail_achat, // traçabilité marché ↔ unité
                    'id_localisation' => $statut === 'en_stock' ? null : $loc->id_localisation,
                    'id_etat' => $etatsById[match (true) {
                        $statut === 'reforme' || $statut === 'perdu' => 'Hors service',
                        $statut === 'en_maintenance' => 'Dégradé',
                        $dateAcquisition->diffInMonths(now()) < 8 => 'Neuf',
                        $dateAcquisition->diffInMonths(now()) < 24 => 'Bon état',
                        default => 'Passable',
                    }]->id_etat,
                ]);

                // Lien inverse conservé (detail_achats.id_equipement) : il pointe sur la
                // dernière unité du lot pour la compatibilité avec l'existant.
            }
        }
    }
}
