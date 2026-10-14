<?php

namespace Database\Seeders;

use App\Models\Achat;
use App\Models\DetailAchat;
use App\Models\Fournisseur;
use Illuminate\Database\Seeder;

class AchatSeeder extends Seeder
{
    /**
     * Marchés d'acquisition = source de vérité du parc.
     *
     * Chaque achat détaille ses lignes (modèle × quantité × prix unitaire) et le
     * montant_total est la somme exacte des lignes. ParcSeeder consomme ensuite
     * ces lots pour créer les équipements : la valeur du parc se recoupe donc
     * avec la dépense d'investissement.
     *
     * format lot : [reference_modele, quantite, prix_unitaire]
     */
    public function run(): void
    {
        $fournisseurs = [
            ['ANTANANARIVO INFORMATIQUE SARL', 'M. Rakotobe', '+261 20 22 345 67', 'contact@antanainfo.mg', 'Lot II M 45, Ankorondrano, Antananarivo', '2014B01234'],
            ['TECHNOLOGIES PLUS', 'Mme Razanamalala', '+261 20 22 654 32', 'ventes@techplus.mg', 'Immeuble Sky, Ankorondrano, Antananarivo', '2018B04567'],
            ['MADATECH DISTRIBUTION', 'M. Rajaonarivelo', '+261 32 40 123 45', 'info@madatech.mg', 'Route des Hydrocarbures, Toamasina', '2016B07890'],
            ['GLOBAL PRINT MALAGASY', 'Mme Ranaivoson', '+261 20 22 987 65', 'contact@globalprint.mg', 'Analakely, Antananarivo', '2020B03211'],
        ];

        $fournisseursById = [];
        foreach ($fournisseurs as [$rs, $contact, $tel, $email, $adresse, $rcs]) {
            $fournisseursById[$rs] = Fournisseur::create([
                'raison_sociale' => $rs,
                'contact' => $contact,
                'telephone' => $tel,
                'email' => $email,
                'adresse' => $adresse,
                'rcs' => $rcs,
                'statut' => 'actif',
            ]);
        }

        // Marchés de matériel : chaque lot crée autant d'équipements que la quantité.
        $marches = [
            [
                'ref' => 'ACH-2023-001', 'date' => '2023-03-15', 'facture' => 'FAC-2023-0231', 'bc' => 'BC-2023-0045',
                'fournisseur' => 'ANTANANARIVO INFORMATIQUE SARL', 'statut' => 'livre',
                'description' => 'Équipement des bureaux du siège (postes de travail et impression)',
                'lots' => [
                    ['HP-PROD4', 12, 4200000],
                    ['HP-LJPRO', 2, 3450000],
                    ['EPS-WF3820', 2, 2150000],
                ],
            ],
            [
                'ref' => 'ACH-2024-001', 'date' => '2024-06-20', 'facture' => 'FAC-2024-0388', 'bc' => 'BC-2024-0102',
                'fournisseur' => 'TECHNOLOGIES PLUS', 'statut' => 'livre',
                'description' => 'Dotation CRT Antananarivo et Mahajanga (postes fixes et multifonction)',
                'lots' => [
                    ['DEL-OPT7010', 10, 3950000],
                    ['CAN-IR2625', 1, 14200000],
                    ['CAN-DR2580', 1, 4650000],
                ],
            ],
            [
                'ref' => 'ACH-2025-001', 'date' => '2025-02-14', 'facture' => 'FAC-2025-0142', 'bc' => 'BC-2025-0031',
                'fournisseur' => 'ANTANANARIVO INFORMATIQUE SARL', 'statut' => 'livre',
                'description' => 'Renouvellement des portables de l\u2019encadrement et réseau du siège',
                'lots' => [
                    ['HP-450G9', 8, 5750000],
                    ['DEL-LAT3520', 4, 5350000],
                    ['CISCO-2960', 2, 9600000],
                    ['TPL-EAP225', 6, 1100000],
                ],
            ],
            [
                'ref' => 'ACH-2025-002', 'date' => '2025-05-03', 'facture' => 'FAC-2025-0311', 'bc' => 'BC-2025-0074',
                'fournisseur' => 'MADATECH DISTRIBUTION', 'statut' => 'livre',
                'description' => 'Serveur de virtualisation de la salle serveurs (BA-2e étage)',
                'lots' => [
                    ['HP-PROL30', 1, 31500000],
                    ['HIK-DS2CD', 4, 1850000],
                ],
            ],
            [
                'ref' => 'ACH-2026-001', 'date' => '2026-01-20', 'facture' => 'FAC-2026-0102', 'bc' => 'BC-2026-0012',
                'fournisseur' => 'TECHNOLOGIES PLUS', 'statut' => 'livre',
                'description' => 'Postes Lenovo pour la DAF et ThinkCentre pour les guichets CENSERO',
                'lots' => [
                    ['LEN-THINKE14', 6, 5150000],
                    ['LEN-M720', 5, 3550000],
                ],
            ],
            [
                'ref' => 'ACH-2026-002', 'date' => '2026-08-11', 'facture' => 'FAC-2026-0488', 'bc' => 'BC-2026-0144',
                'fournisseur' => 'GLOBAL PRINT MALAGASY', 'statut' => 'livre',
                'description' => 'Imprimantes d\u2019appoint pour les services financiers (livrées début septembre)',
                'lots' => [
                    ['EPS-WF3820', 3, 2250000],
                ],
            ],
        ];

        foreach ($marches as $marche) {
            $montantTotal = 0;
            foreach ($marche['lots'] as [$refModele, $quantite, $prixUnitaire]) {
                $montantTotal += $quantite * $prixUnitaire;
            }

            $achat = Achat::create([
                'reference_achat' => $marche['ref'],
                'date_achat' => $marche['date'],
                'numero_facture' => $marche['facture'],
                'bon_commande' => $marche['bc'],
                'montant_total' => $montantTotal,
                'description' => $marche['description'],
                'statut' => $marche['statut'],
                'id_fournisseur' => $fournisseursById[$marche['fournisseur']]->id_fournisseur,
            ]);

            foreach ($marche['lots'] as [$refModele, $quantite, $prixUnitaire]) {
                DetailAchat::create([
                    'quantite' => $quantite,
                    'prix_unitaire' => $prixUnitaire,
                    'montant' => $quantite * $prixUnitaire,
                    // Livraison 3 à 5 semaines après la commande (marchés publics).
                    'date_livraison' => $marche['statut'] === 'livre'
                        ? date('Y-m-d', strtotime($marche['date'] . ' +' . rand(21, 35) . ' days'))
                        : $marche['date'],
                    'description' => 'Lot — ' . $refModele . ' × ' . $quantite,
                    'id_achat' => $achat->id_achat,
                ]);
            }
        }

        // Dépenses de services (sans lot matériel) : abonnements et contrats,
        // qui complètent la dépense informatique de l'exercice.
        $services = [
            ['ACH-2026-S01', '2026-01-10', 'FAC-2026-0009', 'BC-2026-0005', 'MADATECH DISTRIBUTION', 'livre', 3600000, 'Abonnement annuel Microsoft Office 365 — 50 licences'],
            ['ACH-2026-S02', '2026-01-15', 'FAC-2026-0011', 'BC-2026-0007', 'MADATECH DISTRIBUTION', 'livre', 2450000, 'Abonnement annuel ESET Endpoint Protection — 35 postes'],
            ['ACH-2025-S01', '2025-07-01', 'FAC-2025-0360', 'BC-2025-0090', 'ANTANANARIVO INFORMATIQUE SARL', 'livre', 4800000, 'Contrat annuel de maintenance et infogérance du parc'],
        ];

        foreach ($services as [$ref, $date, $facture, $bc, $fournisseur, $statut, $montant, $description]) {
            $achat = Achat::create([
                'reference_achat' => $ref,
                'date_achat' => $date,
                'numero_facture' => $facture,
                'bon_commande' => $bc,
                'montant_total' => $montant,
                'description' => $description,
                'statut' => $statut,
                'id_fournisseur' => $fournisseursById[$fournisseur]->id_fournisseur,
            ]);

            DetailAchat::create([
                'quantite' => 1,
                'prix_unitaire' => $montant,
                'montant' => $montant,
                'date_livraison' => $date,
                'description' => $description,
                'id_achat' => $achat->id_achat,
            ]);
        }
    }
}
