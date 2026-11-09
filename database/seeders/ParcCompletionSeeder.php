<?php

namespace Database\Seeders;

use App\Models\Achat;
use App\Models\Affectation;
use App\Models\Agent;
use App\Models\DetailAchat;
use App\Models\Equipement;
use App\Models\InstallationLogiciel;
use App\Models\Logiciel;
use App\Models\Modele;
use App\Models\Service;
use App\Models\Site;
use App\Models\Ticket;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Complète le parc existant avec des fiches matériel réalistes :
 * caractéristiques techniques, prix et garanties par modèle, fournisseur et
 * ligne d'achat d'origine, service/direction d'attachement cohérents avec la
 * localisation, et logiciels installés sur les postes.
 *
 * Idempotent : relancer le seeder reconstruit les lignes d'achat et réapplique
 * les mêmes valeurs sans dupliquer de matériel.
 */
class ParcCompletionSeeder extends Seeder
{
    /** Fiche technique, prix catalogue (Ar) et garantie (mois) par référence modèle. */
    private const MODELES = [
        'HP-450G9' => [
            'spec' => 'Intel Core i5-1235U, 16 Go DDR4, SSD 512 Go, Windows 11 Pro',
            'processeur' => 'Intel Core i5-1235U (10 cœurs, 3,3 GHz Turbo)',
            'ram' => '16 Go DDR4 3200 MHz',
            'disque' => 'SSD NVMe 512 Go',
            'prix' => 4850000,
            'garantie' => 36,
        ],
        'HP-PROD4' => [
            'spec' => 'Intel Core i5-10500, 8 Go DDR4, SSD 256 Go, Windows 11 Pro',
            'processeur' => 'Intel Core i5-10500 (6 cœurs, 3,1 GHz)',
            'ram' => '8 Go DDR4 2666 MHz',
            'disque' => 'SSD SATA 256 Go',
            'prix' => 3150000,
            'garantie' => 24,
        ],
        'DEL-LAT3520' => [
            'spec' => 'Intel Core i5-1135G7, 8 Go DDR4, SSD 512 Go, Windows 11 Pro',
            'processeur' => 'Intel Core i5-1135G7 (4 cœurs, 4,2 GHz Turbo)',
            'ram' => '8 Go DDR4 3200 MHz',
            'disque' => 'SSD NVMe 512 Go',
            'prix' => 3950000,
            'garantie' => 24,
        ],
        'DEL-OPT7010' => [
            'spec' => 'Intel Core i5-13500, 16 Go DDR5, SSD 512 Go, Windows 11 Pro',
            'processeur' => 'Intel Core i5-13500 (14 cœurs, 4,8 GHz Turbo)',
            'ram' => '16 Go DDR5 4800 MHz',
            'disque' => 'SSD NVMe 512 Go',
            'prix' => 3600000,
            'garantie' => 24,
        ],
        'LEN-THINKE14' => [
            'spec' => 'AMD Ryzen 5 5625U, 16 Go DDR4, SSD 512 Go, Windows 11 Pro',
            'processeur' => 'AMD Ryzen 5 5625U (6 cœurs, 4,3 GHz Turbo)',
            'ram' => '16 Go DDR4 3200 MHz',
            'disque' => 'SSD NVMe 512 Go',
            'prix' => 4200000,
            'garantie' => 24,
        ],
        'LEN-M720' => [
            'spec' => 'Intel Core i5-8400T, 8 Go DDR4, SSD 256 Go, Windows 10 Pro',
            'processeur' => 'Intel Core i5-8400T (6 cœurs, 3,3 GHz Turbo)',
            'ram' => '8 Go DDR4 2666 MHz',
            'disque' => 'SSD SATA 256 Go',
            'prix' => 2450000,
            'garantie' => 12,
        ],
        'HP-LJPRO' => [
            'spec' => 'Imprimante laser monochrome recto-verso, 38 ppm, réseau Ethernet',
            'processeur' => 'Processeur 800 MHz',
            'ram' => '256 Mo',
            'disque' => 'Mémoire interne 256 Mo',
            'prix' => 1850000,
            'garantie' => 12,
        ],
        'CAN-IR2625' => [
            'spec' => 'Multifonction A3 copie/impression/scan, 25 ppm, recto-verso',
            'processeur' => 'Processeur dual-core 1,6 GHz',
            'ram' => '2 Go',
            'disque' => 'Disque dur 320 Go',
            'prix' => 6900000,
            'garantie' => 12,
        ],
        'EPS-WF3820' => [
            'spec' => "Multifonction jet d'encre A4 Wi-Fi recto-verso",
            'processeur' => 'Processeur 1,4 GHz',
            'ram' => '512 Mo',
            'disque' => 'Mémoire interne 128 Mo',
            'prix' => 1250000,
            'garantie' => 12,
        ],
        'CISCO-2960' => [
            'spec' => 'Switch 24 ports Gigabit + 2 SFP, manageable, IOS LAN Base',
            'processeur' => 'Processeur ARM 800 MHz',
            'ram' => '256 Mo DRAM',
            'disque' => 'Mémoire flash 128 Mo',
            'prix' => 2800000,
            'garantie' => 24,
        ],
        'TPL-EAP225' => [
            'spec' => "Point d'accès Wi-Fi AC1350 plafonnier, PoE",
            'processeur' => 'Processeur Qualcomm 750 MHz',
            'ram' => '128 Mo',
            'disque' => 'Mémoire flash 16 Mo',
            'prix' => 480000,
            'garantie' => 24,
        ],
        'HP-PROL30' => [
            'spec' => '2x Intel Xeon Gold 6230, 64 Go DDR4 ECC, 4x SSD 960 Go RAID10',
            'processeur' => '2x Intel Xeon Gold 6230 (20 cœurs, 2,1 GHz)',
            'ram' => '64 Go DDR4 ECC 2933 MHz',
            'disque' => '4x SSD SAS 960 Go (RAID 10)',
            'prix' => 18500000,
            'garantie' => 36,
        ],
        'CAN-DR2580' => [
            'spec' => 'Scanner documentaire A4 recto-verso USB 3.0, 80 ppm',
            'processeur' => 'Processeur image 600 MHz',
            'ram' => '512 Mo',
            'disque' => 'Mémoire flash 128 Mo',
            'prix' => 1650000,
            'garantie' => 12,
        ],
        'HIK-DS2CD' => [
            'spec' => 'Caméra IP dôme 4 MP PoE, IR 30 m, IP67',
            'processeur' => 'Processeur Hi3516 1 GHz',
            'ram' => '512 Mo',
            'disque' => 'Mémoire flash 128 Mo',
            'prix' => 620000,
            'garantie' => 24,
        ],
    ];

    /** Date de livraison de chaque marché (id_achat 1 à 4). */
    private const LIVRAISONS = [
        1 => '2025-03-07',
        2 => '2025-05-24',
        3 => '2026-02-10',
        4 => '2026-09-19',
    ];

    /**
     * Affectation explicite de certains matériels à un marché : les unités déjà
     * affectées ou entretenues avant la livraison d'un lot ne peuvent pas en
     * provenir. Les autres suivent un roulement 1-2-3.
     */
    private const LOT_FORCE = [
        2 => 1, 29 => 2, 33 => 3, 32 => 2, 20 => 1, 7 => 2, 10 => 2,
        3 => 4, 9 => 4, 13 => 4, 19 => 4, 23 => 4,
    ];

    /** Localisation physique => service occupant les lieux. */
    private const SERVICE_PAR_LOCALISATION = [
        1 => 2, 2 => 1, 3 => 8, 4 => 9, 5 => 1, 6 => 4,
        7 => 5, 8 => 5, 9 => 5, 10 => 7,
    ];

    public function run(): void
    {
        DB::transaction(function () {
            $this->completerModeles();
            $this->reconstruireLignesAchat();
            $this->completerEquipements();
            $this->completerLogiciels();
            $this->completerTickets();
            $this->reparerAffectationsOrphelines();
        });
    }

    private function completerModeles(): void
    {
        foreach (self::MODELES as $reference => $fiche) {
            Modele::where('reference_modele', $reference)->update(['description' => $fiche['spec']]);
        }
    }

    /** Les anciennes lignes génériques ne référençaient aucun matériel : on repart proprement. */
    private function reconstruireLignesAchat(): void
    {
        Equipement::query()->update(['id_detail_achat' => null]);
        DetailAchat::query()->update(['id_equipement' => null]);
        DetailAchat::query()->delete();
    }

    private function completerEquipements(): void
    {
        $achats = Achat::orderBy('id_achat')->get()->values();
        $directionsParService = Service::pluck('id_direction', 'id_service');
        $lignes = [];

        foreach (Equipement::with('modele')->orderBy('code_inventaire')->get() as $equipement) {
            $modele = $equipement->modele;
            $reference = $modele?->reference_modele;
            $fiche = self::MODELES[$reference] ?? null;
            $numero = (int) substr($equipement->code_inventaire, -5);
            $lot = self::LOT_FORCE[$numero] ?? (($numero % 3) + 1);
            $achat = $achats[$lot - 1];
            $acquisition = Carbon::parse(self::LIVRAISONS[$lot]);
            $enStock = $equipement->statut === 'en_stock';
            $service = $equipement->id_localisation
                ? (self::SERVICE_PAR_LOCALISATION[$equipement->id_localisation] ?? null)
                : null;

            $equipement->update([
                'description' => $modele
                    ? $modele->nom_modele.($fiche ? ' — '.$fiche['spec'] : '')
                    : $equipement->description,
                'processeur' => $fiche['processeur'] ?? null,
                'ram' => $fiche['ram'] ?? null,
                'disque' => $fiche['disque'] ?? null,
                'date_acquisition' => $acquisition->toDateString(),
                'date_mise_service' => $enStock ? null : $acquisition->copy()->addDays(7)->toDateString(),
                'prix_acquisition' => $fiche['prix'] ?? $equipement->prix_acquisition,
                'garantie_debut' => $acquisition->toDateString(),
                'garantie_fin' => $acquisition->copy()->addMonths($fiche['garantie'] ?? 12)->toDateString(),
                'id_categorie' => $modele?->id_categorie,
                'id_marque' => $modele?->id_marque,
                'id_direction' => $service ? ($directionsParService[$service] ?? null) : null,
                'id_service' => $service,
                'id_fournisseur' => $achat->id_fournisseur,
                'id_etat' => $this->etatPour($equipement->statut, $acquisition),
            ]);

            // La fiche ne peut pas avoir été créée après son acquisition ni après
            // les affectations dont elle est l'objet.
            DB::table('equipements')
                ->where('id_equipement', $equipement->id_equipement)
                ->update(['created_at' => $acquisition->copy()->setTime(8, 0)->toDateTimeString()]);

            $cle = $lot.'|'.($reference ?? $equipement->id_equipement);
            if (! isset($lignes[$cle])) {
                $lignes[$cle] = DetailAchat::create([
                    'id_achat' => $achat->id_achat,
                    'quantite' => 0,
                    'prix_unitaire' => $fiche['prix'] ?? $equipement->prix_acquisition,
                    'montant' => 0,
                    'date_livraison' => $acquisition->toDateString(),
                    'description' => $modele?->nom_modele ?? 'Équipement',
                ]);
            }

            $ligne = $lignes[$cle];
            $ligne->quantite = (int) $ligne->quantite + 1;
            $ligne->montant = (float) $ligne->quantite * (float) $ligne->prix_unitaire;
            $ligne->save();

            $equipement->update(['id_detail_achat' => $ligne->id_detail_achat]);
        }

        foreach (Achat::with('details')->get() as $achat) {
            $achat->update(['montant_total' => $achat->details->sum('montant')]);
        }
    }

    private function etatPour(string $statut, Carbon $acquisition): int
    {
        if (in_array($statut, ['reforme', 'perdu'], true)) {
            return 5;
        }
        if ($statut === 'en_maintenance') {
            return 4;
        }

        $mois = (int) $acquisition->diffInMonths(now());

        return $mois < 8 ? 1 : ($mois < 24 ? 2 : 3);
    }

    /** Socle logiciel des postes de travail, adapté au service utilisateur. */
    private function completerLogiciels(): void
    {
        $logiciels = Logiciel::whereIn('nom', [
            'Windows 11 Pro', 'Microsoft Office 365', 'Antivirus ESET', 'Outil Immatriculation DGSR',
        ])->get()->keyBy('nom');

        $postes = Equipement::where('id_categorie', 1)
            ->where('statut', '!=', 'en_stock')
            ->get();

        foreach ($postes as $poste) {
            $noms = ['Windows 11 Pro', 'Microsoft Office 365', 'Antivirus ESET'];
            if (in_array($poste->id_service, [5, 7], true)) {
                $noms[] = 'Outil Immatriculation DGSR';
            }

            foreach ($noms as $index => $nom) {
                $logiciel = $logiciels[$nom] ?? null;
                if (! $logiciel) {
                    continue;
                }

                $installation = InstallationLogiciel::firstOrNew([
                    'id_equipement' => $poste->id_equipement,
                    'id_logiciel' => $logiciel->id_logiciel,
                ]);

                if (! $installation->exists) {
                    $date = $poste->date_acquisition->copy()->addDays(10 + $index * 5);
                    $installation->date_installation = $date->isFuture() ? now()->toDateString() : $date->toDateString();
                }

                $installation->version_installee = $logiciel->version;
                $installation->statut = 'installe';
                $installation->save();
            }
        }
    }

    /** Complète les tickets existants avec le périmètre et l'état avant intervention. */
    private function completerTickets(): void
    {
        $problemes = [
            'Ordinateur ne démarre plus' => 'Aucun voyant, aucun affichage au démarrage ; alimentation testée sans effet.',
            'Imprimante en panne de papier' => 'Bourrage papier récurrent, voyant d’erreur allumé, impression interrompue.',
            'Connexion réseau instable au CRT' => 'Déconnexions répétées et perte d’accès au réseau pendant les opérations.',
            'Mot de passe oublié session Windows' => 'Session Windows verrouillée, identifiants oubliés par l’agent.',
            "Demande d'installation logiciel" => 'Poste opérationnel ; logiciel métier absent de la configuration.',
        ];

        Ticket::with(['equipement.localisation.batiment', 'equipement.affectationActive.agent', 'agent'])->get()
            ->each(function (Ticket $ticket) use ($problemes) {
                $equipement = $ticket->equipement;
                $agentEquipement = $equipement?->affectationActive?->agent;
                $service = $agentEquipement?->id_service ?? $equipement?->id_service ?? $ticket->agent?->id_service;
                $direction = $agentEquipement?->id_direction ?? $equipement?->id_direction ?? $ticket->agent?->id_direction;

                $site = $equipement?->localisation?->batiment?->id_site
                    ?: ($direction
                        ? Site::where('id_direction', $direction)->orderBy('id_site')->value('id_site')
                        : null);
                $site = $site ?: Site::orderBy('id_site')->value('id_site');

                // Un ticket doit toujours avoir un demandeur identifiable.
                $idAgent = $ticket->id_agent
                    ?: $agentEquipement?->id_agent
                    ?: Agent::where('id_service', $service)->orderBy('id_agent')->value('id_agent');

                $ticket->update([
                    'motif' => $ticket->motif ?: $ticket->titre,
                    'id_agent' => $idAgent,
                    'id_direction' => $ticket->id_direction ?: $direction,
                    'id_service' => $ticket->id_service ?: $service,
                    'id_site' => $ticket->id_site ?: $site,
                    'id_etat_appareil_avant' => $ticket->id_etat_appareil_avant ?: $equipement?->id_etat,
                    'etat_probleme_avant' => $ticket->etat_probleme_avant
                        ?: ($problemes[$ticket->titre] ?? 'Problème constaté avant l’intervention du technicien.'),
                ]);
            });
    }

    /**
     * Une affectation vers un agent supprimé n'a plus de sens : une affectation
     * encore active est réattribuée à un agent du même service ; une affectation
     * déjà clôturée, devenue anonyme, est retirée de l'historique.
     */
    private function reparerAffectationsOrphelines(): void
    {
        $orphelines = Affectation::whereDoesntHave('agent')
            ->with('equipement')
            ->get();

        foreach ($orphelines as $affectation) {
            $service = $affectation->equipement?->id_service;
            $remplacant = $affectation->date_fin === null && $service
                ? Agent::where('id_service', $service)
                    ->where('id_agent', '!=', $affectation->id_agent)
                    ->orderBy('id_agent')
                    ->first()
                : null;

            if ($remplacant) {
                $affectation->update([
                    'id_agent' => $remplacant->id_agent,
                    'motif' => 'Réaffectation (agent sorti)',
                ]);
            } else {
                $affectation->delete();
            }
        }
    }
}
