<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Affectation;
use App\Models\Equipement;
use App\Models\Inventaire;
use App\Models\InventaireDetail;
use App\Models\InstallationLogiciel;
use App\Models\JournalActivite;
use App\Models\Licence;
use App\Models\Localisation;
use App\Models\Logiciel;
use App\Models\Mouvement;
use App\Models\MouvementHistorique;
use App\Models\Utilisateur;
use Illuminate\Database\Seeder;

class OperationSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Utilisateur::whereHas('roles', fn ($q) => $q->where('nom_role', 'admin'))->first();
        $gestionnaire = Utilisateur::whereHas('roles', fn ($q) => $q->where('nom_role', 'gestionnaire_parc'))->first();
        $agents = Agent::all();
        $equipements = Equipement::all();
        $locs = Localisation::all();

        // Utilisateurs crédibles pour signer les opérations (référencés par les FK).
        $usersPool = collect([$admin, $gestionnaire])->filter();

        // Compteur documentaire "GPI-YYYY-####" par année, comme un vrai registre.
        $compteurs = [];
        $refMouvement = function (string $date) use (&$compteurs) {
            $annee = substr($date, 0, 4);
            $compteurs[$annee] = ($compteurs[$annee] ?? 0) + 1;

            return sprintf('GPI-%s-%04d', $annee, $compteurs[$annee]);
        };

        // Crée un mouvement + l'entrée d'historique champ par champ associée.
        $creerMouvement = function (array $attrs) use ($usersPool, $refMouvement) {
            $date = $attrs['date_mouvement'];
            $mouvement = Mouvement::create([
                'type_mouvement' => $attrs['type_mouvement'],
                'motif' => $attrs['motif'],
                'ancienne_localisation' => $attrs['ancienne_localisation'] ?? null,
                'nouvelle_localisation' => $attrs['nouvelle_localisation'] ?? null,
                'date_mouvement' => $date,
                'commentaire' => ($attrs['commentaire'] ?? null),
                'id_equipement' => $attrs['id_equipement'],
                'id_utilisateur' => $usersPool->isNotEmpty() ? $usersPool->random()->id_utilisateur : null,
            ]);

            if (! empty($attrs['ancienne_localisation']) || ! empty($attrs['nouvelle_localisation'])) {
                MouvementHistorique::create([
                    'table_concernee' => 'equipements',
                    'id_enregistrement' => $attrs['id_equipement'],
                    'champ' => 'id_localisation',
                    'ancienne_valeur' => ($attrs['ancienne_localisation'] ?? null)
                        ? Localisation::find($attrs['ancienne_localisation'])?->code_localisation
                        : null,
                    'nouvelle_valeur' => ($attrs['nouvelle_localisation'] ?? null)
                        ? Localisation::find($attrs['nouvelle_localisation'])?->code_localisation
                        : null,
                    'commentaire' => 'Suivi de localisation — ' . $attrs['type_mouvement'],
                    'id_mouvement' => $mouvement->id_mouvement,
                    'id_utilisateur' => $mouvement->id_utilisateur,
                ]);
            }

            return $mouvement;
        };

        // ------------------------------------------------------------------
        // Affectations actives : chaque équipement "en service" est rattaché à
        // un agent, avec un motif professionnel et un mouvement correspondant.
        // ------------------------------------------------------------------
        $motifs = [
            'Prise de poste — nouvel agent',
            'Dotation standard du service',
            'Remplacement d\u2019un poste défectueux',
            'Renforcement du centre CRT',
            'Besoin exprimé par le chef de service',
        ];

        $enService = $equipements->where('statut', 'en_service')->values();

        foreach ($enService as $i => $eq) {
            $dateAffect = now()->subDays(rand(20, 330))->toDateString();
            $motif = $motifs[$i % count($motifs)];

            Affectation::create([
                'date_affectation' => $dateAffect,
                'date_fin' => null,
                'motif' => $motif,
                'commentaire' => 'Affectation en cours',
                'id_equipement' => $eq->id_equipement,
                'id_agent' => $agents->isNotEmpty() ? $agents[$i % $agents->count()]->id_agent : null,
            ]);

            $creerMouvement([
                'type_mouvement' => 'affectation',
                'motif' => $motif,
                'nouvelle_localisation' => $eq->id_localisation,
                'date_mouvement' => $dateAffect,
                'commentaire' => 'Réf. ' . $refMouvement($dateAffect),
                'id_equipement' => $eq->id_equipement,
            ]);
        }

        // ------------------------------------------------------------------
        // Historique complet pour 8 équipements : affectation → restitution →
        // transfert → réaffectation, étalé sur les 12 derniers mois.
        // ------------------------------------------------------------------
        $avecHistorique = $equipements->where('statut', 'en_service')->skip(12)->take(8)->values();

        foreach ($avecHistorique as $i => $eq) {
            $agentPrecedent = $agents[($i + 5) % $agents->count()];
            $agentActuel = $agents[$i % $agents->count()];
            $locA = $locs[$i % $locs->count()];
            $locB = $locs[($i + 3) % $locs->count()];

            $debut = now()->subDays(rand(280, 360));
            $fin = $debut->copy()->addDays(rand(120, 240));
            if ($fin->gt(now()->subDays(10))) {
                $fin = now()->subDays(rand(10, 60));
            }

            // 1) Affectation initiale (aujourd'hui clôturée)
            Affectation::create([
                'date_affectation' => $debut->toDateString(),
                'date_fin' => $fin->toDateString(),
                'motif' => 'Dotation standard du service',
                'commentaire' => 'Clôturée lors de la restitution',
                'id_equipement' => $eq->id_equipement,
                'id_agent' => $agentPrecedent->id_agent,
            ]);
            $creerMouvement([
                'type_mouvement' => 'affectation',
                'motif' => 'Dotation standard du service',
                'nouvelle_localisation' => $locA->id_localisation,
                'date_mouvement' => $debut->toDateString(),
                'commentaire' => 'Réf. ' . $refMouvement($debut->toDateString()),
                'id_equipement' => $eq->id_equipement,
            ]);

            // 2) Restitution au stock SIT
            $creerMouvement([
                'type_mouvement' => 'restitution',
                'motif' => 'Mobilisation de l\u2019agent — restitution au SIT',
                'ancienne_localisation' => $locA->id_localisation,
                'date_mouvement' => $fin->toDateString(),
                'commentaire' => 'Retour atelier pour vérification avant réaffectation',
                'id_equipement' => $eq->id_equipement,
            ]);

            // 3) Transfert inter-bâtiments
            $deuxieme = $fin->copy()->addDays(rand(3, 15));
            $creerMouvement([
                'type_mouvement' => 'transfert',
                'motif' => 'Réorganisation des services',
                'ancienne_localisation' => $locA->id_localisation,
                'nouvelle_localisation' => $locB->id_localisation,
                'date_mouvement' => $deuxieme->toDateString(),
                'commentaire' => 'Transfert validé par la Direction Technique',
                'id_equipement' => $eq->id_equipement,
            ]);
            $eq->update(['id_localisation' => $locB->id_localisation]);

            // 4) Réaffectation à l'agent actuel (toujours active)
            $dateReaffect = $deuxieme->copy()->addDays(rand(1, 4))->toDateString();
            Affectation::create([
                'date_affectation' => $dateReaffect,
                'date_fin' => null,
                'motif' => 'Réaffectation après restitution',
                'commentaire' => 'Affectation en cours',
                'id_equipement' => $eq->id_equipement,
                'id_agent' => $agentActuel->id_agent,
            ]);
            $creerMouvement([
                'type_mouvement' => 'affectation',
                'motif' => 'Réaffectation après restitution',
                'nouvelle_localisation' => $locB->id_localisation,
                'date_mouvement' => $dateReaffect,
                'commentaire' => 'Réf. ' . $refMouvement($dateReaffect),
                'id_equipement' => $eq->id_equipement,
            ]);
        }

        // ------------------------------------------------------------------
        // Entrées en stock (réception après achat), réformes et envois en
        // maintenance : le cycle de vie complet est traçable.
        // ------------------------------------------------------------------
        foreach ($equipements->where('statut', 'en_stock')->values() as $eq) {
            // Le vrai marché d'origine via la ligne d'achat pointée par l'équipement.
            $refAchat = $eq->detailAchat?->achat?->reference_achat ?? 'achat non tracé';

            $creerMouvement([
                'type_mouvement' => 'stock',
                'motif' => 'Réception matériel — achat ' . $refAchat,
                'nouvelle_localisation' => null,
                'date_mouvement' => $eq->date_acquisition?->copy()->addDays(rand(1, 10))->toDateString() ?? now()->subDays(rand(20, 200))->toDateString(),
                'commentaire' => 'Entrée en stock central SIT',
                'id_equipement' => $eq->id_equipement,
            ]);
        }

        foreach ($equipements->where('statut', 'reforme')->values() as $i => $eq) {
            $creerMouvement([
                'type_mouvement' => 'reforme',
                'motif' => 'Matériel obsolète — coût de réparation non justifié',
                'ancienne_localisation' => $eq->id_localisation,
                'date_mouvement' => now()->subDays(rand(30, 200))->toDateString(),
                'commentaire' => 'PV de réforme visé par la DAF',
                'id_equipement' => $eq->id_equipement,
            ]);
        }

        foreach ($equipements->where('statut', 'en_maintenance')->values() as $i => $eq) {
            $pannes = ['alimentation', 'carte mère', 'stockage', 'surchauffe'];
            $creerMouvement([
                'type_mouvement' => 'maintenance',
                'motif' => 'Envoyé en atelier SIT — panne ' . $pannes[$i % count($pannes)],
                'ancienne_localisation' => $eq->id_localisation,
                'date_mouvement' => now()->subDays(rand(3, 30))->toDateString(),
                'commentaire' => 'Diagnostic en cours par le SIT',
                'id_equipement' => $eq->id_equipement,
            ]);
        }

        // ------------------------------------------------------------------
        // Journal d'activité : une entrée par mouvement + connexions récentes.
        // ------------------------------------------------------------------
        foreach (Mouvement::all() as $mouvement) {
            JournalActivite::create([
                'action' => 'création mouvement',
                'table_concernee' => 'mouvements',
                'id_element' => $mouvement->id_mouvement,
                'nouvelles_valeurs' => json_encode($mouvement->only(['type_mouvement', 'motif', 'date_mouvement'])),
                'adresse_ip' => '10.14.' . rand(0, 3) . '.' . rand(2, 250),
                'id_utilisateur' => $mouvement->id_utilisateur,
            ]);
        }

        foreach ($usersPool as $u) {
            for ($j = 0; $j < 4; $j++) {
                $quand = now()->subDays(rand(0, 20))->subMinutes(rand(0, 600));
                JournalActivite::create([
                    'action' => 'connexion',
                    'table_concernee' => 'utilisateurs',
                    'id_element' => $u->id_utilisateur,
                    'nouvelles_valeurs' => null,
                    'adresse_ip' => '10.14.0.' . rand(2, 250),
                    'id_utilisateur' => $u->id_utilisateur,
                    'created_at' => $quand,
                    'updated_at' => $quand,
                ]);
            }
        }

        // ------------------------------------------------------------------
        // Inventaire annuel en cours, avec quelques écarts réalistes.
        // ------------------------------------------------------------------
        $inventaire = Inventaire::create([
            'reference' => 'INV-2026-ANNUEL',
            'date_debut' => now()->subDays(15),
            'date_fin' => null,
            'description' => 'Inventaire annuel du parc informatique',
            'statut' => 'en_cours',
            'id_utilisateur' => $admin?->id_utilisateur,
        ]);

        foreach ($enService->take(18) as $i => $eq) {
            $ecart = in_array($i, [4, 9], true); // 2 écarts sur 18, comme en vrai
            InventaireDetail::create([
                'presence' => ! $ecart,
                'date_constat' => now()->subDays(rand(1, 10)),
                'observation' => $ecart
                    ? 'Poste introuvable au bureau déclaré — recherche en cours'
                    : 'Équipement présent et fonctionnel',
                'date_verification' => now()->subDays(rand(0, 5)),
                'statut' => $ecart ? 'ecart' : 'verifie',
                'id_inventaire' => $inventaire->id_inventaire,
                'id_equipement' => $eq->id_equipement,
            ]);
        }

        // ------------------------------------------------------------------
        // Logiciels du socle DGSR + licences + installations.
        // ------------------------------------------------------------------
        $logiciels = [
            ['Windows 11 Pro', '23H2', 'Microsoft'],
            ['Microsoft Office 365', 'LTSC', 'Microsoft'],
            ['Antivirus ESET Endpoint', 'v12', 'ESET'],
            ['Adobe Acrobat Reader', '2024', 'Adobe'],
            ['Outil Immatriculation DGSR', 'v3.2', 'SIT DGSR'],
        ];

        $logicielsIds = [];
        foreach ($logiciels as [$nom, $version, $editeur]) {
            $logicielsIds[$nom] = Logiciel::create([
                'nom' => $nom,
                'version' => $version,
                'editeur' => $editeur,
                'description' => 'Logiciel standard du socle DGSR',
            ])->id_logiciel;
        }

        $licences = [
            ['LIC-W11-001', 'OEM', 20, 'Windows 11 Pro'],
            ['LIC-O365-001', 'Abonnement annuel', 50, 'Microsoft Office 365'],
            ['LIC-ESET-001', 'Abonnement annuel', 35, 'Antivirus ESET Endpoint'],
        ];
        foreach ($licences as [$ref, $type, $nb, $logicielNom]) {
            Licence::create([
                'reference_licence' => $ref,
                'type_licence' => $type,
                'nb_licences' => $nb,
                'date_acquisition' => now()->subMonths(rand(3, 18)),
                'date_expiration' => now()->addMonths(rand(1, 12)),
                'numero_serie' => 'XXXX-' . strtoupper(str()->random(4)) . '-' . strtoupper(str()->random(4)),
                'statut' => 'active',
                'id_logiciel' => $logicielsIds[$logicielNom],
            ]);
        }

        foreach ($enService->take(10) as $i => $eq) {
            InstallationLogiciel::create([
                'date_installation' => now()->subDays(rand(10, 200)),
                'version_installee' => $logiciels[$i % count($logiciels)][1],
                'licence' => 'LIC-W11-001',
                'statut' => 'installe',
                'id_logiciel' => $logicielsIds[$logiciels[$i % count($logiciels)][0]],
                'id_equipement' => $eq->id_equipement,
            ]);
        }
    }
}
