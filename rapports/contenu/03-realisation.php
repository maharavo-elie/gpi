<?php

/**
 * PARTIE III — RÉALISATION (chapitres 6 et 7).
 */
return function (WordDoc $d): void {
    $d->part('PARTIE III. RÉALISATION');
    $d->p('Cette troisième partie présente la mise en œuvre concrète du projet : installation et configuration des outils, architecture de l’application, création de la base de données, développement des modules, présentation des interfaces, tests et perspectives d’évolution.', 'Corps');

    /* ================================================================ */
    /* CHAPITRE 6 — ENVIRONNEMENT                                        */
    /* ================================================================ */

    $d->h1('Chapitre 6. Mise en place de l’environnement de développement');

    $d->p('Le choix et la configuration des outils conditionnent la qualité du développement, la reproductibilité de l’installation et la facilité de maintenance. Ce chapitre décrit l’environnement mis en place sur le poste de développement, puis l’architecture générale de l’application.');

    $d->h2('6.1. Installation et configuration des outils');

    $d->h3('a) Visual Studio Code');
    $d->p('Visual Studio Code est un éditeur de code gratuit et open source développé par Microsoft. Il prend en charge de nombreux langages et dispose d’un terminal intégré, ce qui évite de multiplier les fenêtres pendant le développement. L’installation se fait à partir du site officiel, puis les extensions complémentaires ont été ajoutées :');
    $d->bullets([
        '**PHP Intelephense** : complétion, navigation et détection d’erreurs en PHP ;',
        '**Laravel Blade Snippets** et **Laravel Extra Intellisense** : assistance sur les vues et les routes ;',
        '**ESLint** et **Prettier** : qualité et formatage du code JavaScript et JSX ;',
        '**Tailwind CSS IntelliSense** : complétion des classes utilitaires ;',
        '**GitLens** : historique et annotations Git directement dans l’éditeur.',
    ]);
    $d->p('La vérification de l’installation se fait depuis un terminal :');
    $d->code('code -v
1.107.0');

    $d->h3('b) WampServer, Apache et PHP');
    $d->p('WampServer regroupe Apache, PHP et MySQL sur le poste de développement. Il reproduit fidèlement l’environnement du serveur de l’établissement et permet de tester l’application en mode intranet. La version installée est WampServer 3.4, avec PHP 8.4.15 et MySQL 8.4.7.');
    $d->p('Les extensions PHP nécessaires à Laravel et à la génération des PDF ont été activées dans le fichier php.ini :');
    $d->bullets([
        '**pdo_mysql** : accès à MySQL par PDO ;',
        '**mbstring** et **iconv** : gestion des chaînes de caractères accentuées ;',
        '**openssl** : chiffrement et génération des jetons ;',
        '**fileinfo** et **gd** : traitement des fichiers et des images, notamment pour les QR codes ;',
        '**zip** : gestion des archives et de l’installation des dépendances.',
    ]);
    $d->code('php -v
PHP 8.4.15 (cli) (built: Nov 18 2025 18:38:40) (ZTS Visual C++ 2022 x64)');

    $d->h3('c) Composer et Laravel');
    $d->p('Composer est le gestionnaire de dépendances de PHP. Il permet d’installer Laravel et ses bibliothèques, puis de régénérer l’autoloader. La version utilisée est Composer 2.10.3.');
    $d->code('composer -V
Composer version 2.10.3 2026-08-27 13:34:23

composer create-project laravel/laravel gpi
cd gpi
composer install');
    $d->p('Après la création du projet, le fichier d’environnement est initialisé et la clé d’application générée. Cette clé sert au chiffrement des sessions et des jetons.');
    $d->code('copy .env.example .env
php artisan key:generate

php artisan serve
INFO  Server running on [http://127.0.0.1:8000].');

    $d->h3('d) Node.js, npm, Vite et Tailwind CSS');
    $d->p('Node.js fournit l’environnement d’exécution JavaScript nécessaire à la compilation des assets. npm installe React, Vite, Tailwind CSS et les autres dépendances front-end. Node.js 26.12.0 et npm 11.20.0 ont été utilisés.');
    $d->code('node -v
v26.12.0
npm -v
11.20.0

npm install
npm run dev      # serveur de développement Vite (HMR)
npm run build    # compilation pour la production');
    $d->p('En développement, Vite sert les fichiers JavaScript et CSS avec rechargement à chaud. En production, la commande npm run build génère les fichiers compilés dans public/build, avec une empreinte dans le nom des fichiers pour éviter les problèmes de cache.');

    $d->h3('e) MySQL et phpMyAdmin');
    $d->p('MySQL assure le stockage des données. La base a été créée avec l’interclassement utf8mb4_unicode_ci, afin de gérer correctement les caractères accentués et les emojis. phpMyAdmin 5.2.3 a servi à administrer la base, à importer le script gpi.sql et à vérifier les contraintes.');
    $d->code('CREATE DATABASE gpi
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;');
    $d->p('La connexion est configurée dans le fichier .env, qui n’est jamais versionné :');
    $d->code('DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gpi
DB_USERNAME=root
DB_PASSWORD=');
    $d->p('Les tables sont créées par le mécanisme de migrations de Laravel, puis peuplées par les seeders pour disposer d’un jeu de données de démonstration.');
    $d->code('php artisan migrate --seed
INFO  Running migrations... DONE
INFO  Seeding database... DONE');

    $d->h3('f) Git');
    $d->p('Git a été utilisé pour suivre les modifications du code et conserver un historique des évolutions. Après l’installation, l’identité de l’auteur est configurée, puis le dépôt est initialisé.');
    $d->code('git --version
git version 2.56.0.windows.2

git config --global user.name "etudiant"
git config --global user.email "etudiant@eni.mg"
git init');
    $d->p('Les commandes utilisées durant le développement sont :');
    $d->code('git status
git add .
git commit -m "Ajout du module des affectations"
git log --oneline');

    $d->h2('6.2. Architecture de l’application');
    $d->p('L’application repose sur une architecture trois tiers, qui sépare clairement la présentation, la logique métier et le stockage des données. Cette séparation facilite la maintenance, l’évolution et la sécurisation de l’ensemble.');
    $d->figure('rapports/figures/00-architecture.png', 'Architecture trois tiers de l’application GPI', 16.0);

    $d->h3('6.2.1. Couche présentation');
    $d->p('La couche présentation est une application mono-page (SPA) développée avec React 19. Elle est servie par Laravel à travers une vue unique et charge les données depuis l’API. Le routage côté client est assuré par React Router : les adresses /equipements, /tickets, /rapports, etc. affichent les pages correspondantes sans rechargement complet. Axios centralise les appels HTTP et ajoute automatiquement le jeton d’authentification à chaque requête.');
    $d->p('L’interface est découpée en composants réutilisables : barre latérale de navigation, en-tête, tableaux, formulaires, fenêtres de confirmation, notifications et composants de tableau de bord. Tailwind CSS fournit les classes de mise en forme, tandis que Lucide React fournit les icônes.');

    $d->h3('6.2.2. Couche métier');
    $d->p('La couche métier est assurée par Laravel 13. Elle expose une API REST sous le préfixe /api, authentifiée par Laravel Sanctum. Les contrôleurs valident les données, appliquent les règles de gestion, écrivent dans la base via l’ORM Eloquent et renvoient des réponses JSON. Un middleware de rôles protège les routes d’écriture.');
    $d->p('Les principaux modules sont :');
    $d->bullets([
        '**Organisation** : directions, services, agents, utilisateurs et rôles ;',
        '**Localisation** : sites, bâtiments et localisations précises ;',
        '**Parc** : catégories, marques, modèles, états et équipements ;',
        '**Gestion** : fournisseurs, achats et affectations ;',
        '**Maintenance** : types d’intervention, maintenances, tickets et commentaires ;',
        '**Inventaire** : campagnes d’inventaire et lignes de constat ;',
        '**Logiciels** : catalogue, licences et installations ;',
        '**Traçabilité** : mouvements, historique, documents, QR codes, notifications et journal d’activité ;',
        '**Rapports** : synthèses, exports CSV et PDF officiels.',
    ]);

    $d->h3('6.2.3. Couche données');
    $d->p('La couche données repose sur MySQL 8.4. La base comporte trente-trois tables métier, liées par des clés étrangères et protégées par des contraintes d’unicité et d’intégrité. Les index portent sur les colonnes les plus sollicitées : statut des équipements, dates d’affectation, références de tickets et clés étrangères. Les sauvegardes sont réalisées par export SQL et par la fonctionnalité de sauvegarde du serveur.');

    $d->h3('6.2.4. Communication entre les couches');
    $d->p('Le client et le serveur échangent en JSON par HTTP. Les requêtes d’écriture sont protégées par le jeton Sanctum et par la vérification du rôle. Les réponses d’erreur respectent les codes HTTP usuels : 200 pour un succès, 201 pour une création, 401 pour une absence d’authentification, 403 pour un accès refusé, 404 pour une ressource introuvable et 422 pour une erreur de validation. Ce fonctionnement permet à l’interface d’afficher des messages précis sans interpréter des chaînes de caractères.');

    $d->h2('6.3. Structure du projet');
    $d->p('Le projet suit la structure standard de Laravel, complétée par une organisation claire des pages React. La structure simplifiée est :');
    $d->code('gpi/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # 16 contrôleurs métier
│   │   └── Middleware/       # EnsureUserHasRole
│   ├── Models/               # 33 modèles Eloquent
│   └── Support/              # notifications métier
├── database/
│   ├── migrations/           # 17 migrations
│   └── seeders/              # jeu de données de démonstration
├── docs/merise/              # MCD, MLD, MCT, MOT
├── public/                   # point d’entrée et assets compilés
├── resources/
│   ├── css/app.css
│   ├── js/
│   │   ├── app.jsx           # routes et layout
│   │   ├── api.js            # client Axios
│   │   ├── auth.jsx          # contexte d’authentification
│   │   ├── components/       # composants réutilisables
│   │   └── pages/            # pages métier
│   └── views/app.blade.php
├── routes/
│   ├── api.php               # API REST
│   └── web.php               # SPA (toutes les routes non-API)
├── storage/                  # logs, cache, fichiers générés
├── .env
├── composer.json
└── package.json');

    $d->h2('6.4. Déploiement en mode intranet');
    $d->p('L’application est destinée à être utilisée sur le réseau local de la DGSR. Le serveur de l’établissement héberge Apache, PHP et MySQL ; les postes clients n’ont besoin que d’un navigateur. Le déploiement suit plusieurs étapes :');
    $d->bullets([
        'récupération du code et installation des dépendances avec Composer ;',
        'configuration du fichier .env avec les paramètres du serveur (base, URL, environnement de production) ;',
        'génération de la clé d’application, exécution des migrations et des seeders ;',
        'compilation des assets avec npm run build ;',
        'configuration du virtual host Apache sur le dossier public, afin que les fichiers sensibles ne soient pas accessibles ;',
        'mise en place des droits d’écriture sur storage et bootstrap/cache ;',
        'sauvegarde de la base et mise en place d’une procédure de restauration.',
    ]);
    $d->code('<VirtualHost *:80>
    ServerName gpi.dgsr.local
    DocumentRoot "C:/wamp64/www/gpi/public"

    <Directory "C:/wamp64/www/gpi/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>');
    $d->p('Une fois déployée, l’application est accessible depuis les postes du réseau à l’adresse http://gpi.dgsr.local ou, à défaut, à l’adresse IP du serveur. Aucune installation n’est requise sur les postes clients.');

    /* ================================================================ */
    /* CHAPITRE 7 — DÉVELOPPEMENT                                        */
    /* ================================================================ */

    $d->h1('Chapitre 7. Développement de l’application');

    $d->h2('7.1. Création de la base de données');
    $d->p('La création de la base de données constitue une étape essentielle : elle permet de stocker et d’organiser de manière structurée l’ensemble des informations du parc. Le modèle relationnel issu du MLD a été traduit en tables MySQL, puis enrichi de contraintes et d’index.');
    $d->p('**Choix du SGBD.** MySQL a été retenu pour sa simplicité d’administration, sa compatibilité native avec PHP, ses performances sur les applications web de taille moyenne et sa présence dans l’infrastructure existante. Il respecte les contraintes d’intégrité, gère les transactions et s’intègre parfaitement à l’ORM Eloquent.');
    $d->p('**Mise en place.** Les tables sont créées par les migrations de Laravel, ce qui garantit la reproductibilité de l’installation et le suivi des évolutions du schéma. Le script gpi.sql permet également de restaurer la base complète, données de démonstration comprises.');
    $d->p('Les principales tables métier sont décrites dans le tableau intitulé « Principales tables de la base GPI ».');
    $d->table(
        ['Table', 'Rôle'],
        [
            ['directions / services', 'Structure organisationnelle de l’établissement.'],
            ['agents / utilisateurs / roles / role_utilisateur', 'Personnel, comptes d’accès et gestion des rôles.'],
            ['sites / batiments / localisations', 'Hiérarchie géographique du parc.'],
            ['categories / marques / modeles / etat_equipements', 'Référentiels de classification et d’état.'],
            ['equipements', 'Inventaire central : code, série, prix, garantie, statut, rattachements.'],
            ['fournisseurs / achats / detail_achats', 'Achats, marchés et lignes de livraison.'],
            ['affectations', 'Historique des remises et restitutions de matériel.'],
            ['type_maintenances / maintenances', 'Interventions préventives et curatives.'],
            ['tickets / ticket_commentaires', 'Demandes d’assistance et échanges associés.'],
            ['inventaires / inventaire_details', 'Campagnes de vérification physique du parc.'],
            ['logiciels / licences / installation_logiciels', 'Catalogue logiciel, licences et installations.'],
            ['mouvements / mouvement_historiques', 'Traçabilité des entrées, sorties, transferts et réformes.'],
            ['documents / qr_codes', 'Pièces jointes et étiquetage des équipements.'],
            ['notifications / journal_activites', 'Alertes utilisateurs et journal des opérations.'],
        ],
        [6.0, 10.0],
        'Principales tables de la base GPI'
    );
    $d->p('**Respect des règles d’intégrité.** Plusieurs contraintes ont été mises en place : unicité du code d’inventaire, du numéro de série, du matricule et de la référence de ticket ; clés étrangères avec restrictions ou mises à zéro selon le cas ; suppression logique des équipements et des agents pour préserver l’historique ; contrôle applicatif des doublons d’affectation. Ces règles garantissent la cohérence et la fiabilité du système.');

    $d->h2('7.2. Codage de l’application');
    $d->p('Le codage transforme les modèles conceptuels en une application fonctionnelle. Le développement a été réalisé avec Laravel pour le back-end et React pour l’interface, selon une organisation par module et en appliquant les bonnes pratiques du framework.');

    $d->h3('7.2.1. Les modèles Eloquent');
    $d->p('Chaque table possède un modèle Eloquent qui décrit ses champs, ses conversions de types et ses relations. Les clés primaires personnalisées sont déclarées explicitement, car Laravel utilise par défaut la colonne id. Les dates sont converties automatiquement en objets Carbon, ce qui simplifie les calculs et le formatage.');
    $d->code('class Equipement extends Model
{
    use SoftDeletes;

    protected $primaryKey = "id_equipement";

    protected $fillable = [
        "code_inventaire", "numero_serie", "designation",
        "date_acquisition", "prix_acquisition", "garantie_fin",
        "statut", "id_modele", "id_categorie", "id_localisation",
    ];

    protected function casts(): array
    {
        return [
            "date_acquisition" => "date",
            "prix_acquisition" => "decimal:2",
        ];
    }

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class, "id_categorie");
    }
}');
    $d->p('Les relations sont définies dans les deux sens lorsque c’est utile : un équipement appartient à une catégorie, une marque, un modèle et une localisation ; il possède plusieurs affectations, maintenances, tickets, installations et mouvements. Ces relations permettent d’éviter les requêtes manuelles et de charger les données liées en une seule opération.');

    $d->h3('7.2.2. Les contrôleurs et l’API REST');
    $d->p('Les contrôleurs exposent les opérations CRUD et appliquent la validation. Une classe de base, CrudController, mutualise la logique commune (liste, création, mise à jour, suppression, journalisation) ; les contrôleurs métier héritent de cette classe et redéfinissent les règles et les relations à charger. Ce choix réduit la duplication et homogénéise les réponses de l’API.');
    $d->p('Les routes sont regroupées par domaine et protégées par le middleware de rôles. Le tableau intitulé « Principaux points d’accès de l’API » présente les principaux points d’accès.');
    $d->table(
        ['Méthode', 'Point d’accès', 'Description', 'Rôle requis'],
        [
            ['POST', '/api/login', 'Authentification et génération du jeton', 'Public'],
            ['GET', '/api/me', 'Profil de l’utilisateur connecté', 'Authentifié'],
            ['GET', '/api/dashboard', 'Indicateurs du tableau de bord', 'Authentifié'],
            ['GET', '/api/equipements', 'Liste filtrée et paginée des équipements', 'Authentifié'],
            ['POST', '/api/equipements', 'Création d’un équipement', 'Admin, gestionnaire'],
            ['GET', '/api/equipements/{id}', 'Fiche détaillée d’un équipement', 'Authentifié'],
            ['PUT', '/api/equipements/{id}', 'Modification d’un équipement', 'Admin, gestionnaire'],
            ['DELETE', '/api/equipements/{id}', 'Mise à la corbeille', 'Admin, gestionnaire'],
            ['GET', '/api/agents', 'Répertoire des agents', 'Authentifié'],
            ['POST', '/api/affectations', 'Affectation d’un matériel', 'Admin, gestionnaire'],
            ['POST', '/api/affectations/{id}/restitution', 'Restitution d’un matériel', 'Admin, gestionnaire'],
            ['GET', '/api/tickets', 'Liste des tickets', 'Authentifié'],
            ['POST', '/api/tickets', 'Déclaration d’un ticket', 'Authentifié'],
            ['POST', '/api/tickets/{id}/commentaires', 'Ajout d’un commentaire', 'Authentifié'],
            ['GET', '/api/maintenances', 'Suivi des interventions', 'Authentifié'],
            ['GET', '/api/inventaires', 'Campagnes d’inventaire', 'Authentifié'],
            ['GET', '/api/rapports/synthese', 'Synthèse du parc', 'Authentifié'],
            ['GET', '/api/rapports/pdf/synthese', 'Export PDF de synthèse', 'Authentifié'],
            ['GET', '/api/corbeille', 'Éléments supprimés', 'Authentifié'],
            ['PUT', '/api/corbeille/{section}/{id}/restaurer', 'Restauration d’un élément', 'Admin, gestionnaire'],
        ],
        [1.8, 6.6, 5.4, 2.2],
        'Principaux points d’accès de l’API'
    );

    $d->h3('7.2.3. Authentification, rôles et sécurité');
    $d->p('L’authentification repose sur Laravel Sanctum. À la connexion, le serveur vérifie l’identifiant et le mot de passe, puis génère un jeton personnel stocké côté client. Ce jeton est transmis dans l’en-tête Authorization de chaque requête. La route de connexion est limitée à six tentatives par minute pour freiner les attaques par force brute.');
    $d->p('Quatre rôles ont été définis, avec des permissions croissantes :');
    $d->table(
        ['Rôle', 'Permissions principales'],
        [
            ['admin', 'Accès complet : comptes, rôles, référentiels, parc, rapports, corbeille, journal d’activité.'],
            ['gestionnaire_parc', 'Écriture sur le parc, les agents, les affectations, les achats, les fournisseurs et les référentiels.'],
            ['technicien', 'Tickets, maintenances, installations et désinstallations de logiciels ; lecture du parc.'],
            ['utilisateur', 'Lecture du parc et des fiches, déclaration de tickets, consultation de son profil.'],
        ],
        [4.0, 12.0],
        'Rôles et permissions de l’application'
    );
    $d->p('Le contrôle d’accès est assuré par le middleware EnsureUserHasRole, qui vérifie que l’utilisateur possède au moins un des rôles exigés par la route. En cas de refus, une réponse JSON 403 explicite est renvoyée, ce qui permet à l’interface d’afficher un message compréhensible.');
    $d->code('class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        $autorise = $user !== null && $user->roles->contains(
            fn ($role) => in_array($role->nom_role, $roles, true)
        );

        if (! $autorise) {
            return response()->json([
                "message" => "Action non autorisée pour votre rôle.",
            ], 403);
        }

        return $next($request);
    }
}');
    $d->p('D’autres mesures renforcent la sécurité : validation systématique des entrées, échappement des sorties par React, requêtes paramétrées par Eloquent, protection CSRF pour les formulaires web, mots de passe hachés avec bcrypt, jetons révocables et journalisation des actions sensibles.');

    $d->h3('7.2.4. Application des règles de gestion');
    $d->p('Les règles définies lors de la conception sont intégrées directement dans le code. La génération de la référence d’un ticket illustre cette approche : plutôt qu’un comptage susceptible de produire des doublons en cas de créations simultanées, la référence est dérivée de l’identifiant auto-incrémenté, à l’intérieur d’une transaction.');
    $d->code('$ticket = DB::transaction(function () use ($data) {
    $data["reference_ticket"] = "TCK-".date("Y")."-TMP-".uniqid();
    $ticket = Ticket::create($data);

    $ticket->update([
        "reference_ticket" => "TCK-".date("Y")."-"
            .str_pad((string) $ticket->id_ticket, 3, "0", STR_PAD_LEFT),
    ]);

    return $ticket;
});');
    $d->p('D’autres contrôles sont appliqués : un équipement déjà affecté ne peut pas être affecté une seconde fois ; un ticket résolu ou fermé renseigne automatiquement sa date de clôture ; un équipement en maintenance ne peut pas être remis à un agent ; une licence expirée ne peut plus être associée à une nouvelle installation. Les messages d’erreur sont renvoyés au format JSON avec le détail des champs concernés.');

    $d->h3('7.2.5. Exports PDF et documents officiels');
    $d->p('Les rapports peuvent être consultés à l’écran, exportés en CSV ou générés en PDF. La bibliothèque Dompdf produit des documents comportant l’en-tête officiel de l’établissement, la date d’édition, la pagination et un emplacement réservé au visa. Quatre types d’exports sont disponibles : la synthèse du parc, l’historique des mouvements, le journal d’activité et la fiche détaillée d’un équipement. La mise en page est définie dans des vues Blade dédiées, ce qui permet de faire évoluer le modèle de document sans modifier la logique métier.');

    $d->h3('7.2.6. L’interface React');
    $d->p('L’interface est organisée en pages métier et en composants partagés. Le fichier app.jsx déclare les routes protégées : un utilisateur non authentifié est redirigé vers /connexion, tandis qu’un utilisateur connecté accède au tableau de bord et aux modules. Le contexte d’authentification conserve le profil et les rôles, ce qui permet de masquer les actions non autorisées.');
    $d->p('Les principales pages sont : tableau de bord, équipements, fiche équipement, affectations, tickets, maintenances, inventaires, achats, fournisseurs, logiciels, agents, directions, services, sites, bâtiments, localisations, catégories, marques, modèles, rapports, corbeille et paramètres. Les tableaux intègrent la recherche, les filtres, la pagination et les actions contextuelles. Les formulaires affichent les erreurs de validation renvoyées par l’API, champ par champ.');
    $d->p('L’application propose également un mode clair et un mode sombre, ainsi qu’un basculement français/anglais pour les libellés de l’interface. Ces fonctionnalités améliorent le confort d’utilisation sans alourdir le code métier.');

    $d->h3('7.2.7. Tests et validation');
    $d->p('Des tests manuels ont été effectués à chaque étape du développement, complétés par des vérifications automatisées sur les points critiques. Ils ont porté sur le bon fonctionnement des fonctionnalités, le respect des règles de gestion et la cohérence entre la base de données, l’API et l’interface. Le tableau intitulé « Cas de tests et résultats » présente les principaux cas testés.');
    $d->table(
        ['Cas de test', 'Scénario', 'Résultat attendu', 'État'],
        [
            ['Authentification valide', 'Connexion avec admin@dgsr.mg et le mot de passe correct', 'Jeton généré, redirection vers le tableau de bord', 'Conforme'],
            ['Authentification invalide', 'Mot de passe erroné répété', 'Message d’erreur, limitation après six tentatives', 'Conforme'],
            ['Accès non autorisé', 'Technicien tentant de supprimer un équipement', 'Réponse 403 et message explicite', 'Conforme'],
            ['Création d’équipement', 'Saisie complète avec code unique', 'Équipement créé, visible dans la liste', 'Conforme'],
            ['Doublon de code', 'Création avec un code d’inventaire existant', 'Erreur 422, aucun doublon en base', 'Conforme'],
            ['Affectation', 'Attribution d’un matériel disponible à un agent', 'Affectation enregistrée, statut mis à jour', 'Conforme'],
            ['Double affectation', 'Nouvelle affectation d’un matériel déjà affecté', 'Refus et message d’erreur', 'Conforme'],
            ['Restitution', 'Retour d’un matériel affecté', 'Date de fin renseignée, matériel disponible', 'Conforme'],
            ['Ticket', 'Déclaration puis changement de statut', 'Référence TCK générée, date de clôture renseignée', 'Conforme'],
            ['Export PDF', 'Génération de la synthèse du parc', 'PDF téléchargé avec en-tête et pagination', 'Conforme'],
            ['Corbeille', 'Suppression puis restauration d’un agent', 'Élément masqué puis restauré avec ses liens', 'Conforme'],
            ['Inventaire', 'Constat de présence et écart', 'Ligne enregistrée, statut de la campagne mis à jour', 'Conforme'],
        ],
        [3.2, 5.3, 5.3, 2.2],
        'Cas de tests et résultats'
    );

    $d->h3('7.2.8. Difficultés rencontrées et solutions');
    $d->p('Le développement n’a pas été linéaire. Plusieurs difficultés ont dû être résolues, parfois au prix d’une refonte partielle de certaines parties du code.');
    $d->table(
        ['Difficulté', 'Cause', 'Solution apportée'],
        [
            ['Conflit de routage entre l’API et la SPA', 'Toutes les URL non-API renvoyaient la page unique, y compris les appels API mal formés.', 'Route attrape-tout limitée par une expression régulière excluant le préfixe api.'],
            ['Sessions et jetons en développement', 'Le front et le back n’utilisaient pas le même domaine.', 'Configuration CORS et utilisation de jetons Sanctum plutôt que des cookies de session.'],
            ['Accents dans les PDF', 'Polices par défaut de Dompdf incomplètes.', 'Choix d’une police prenant en charge l’UTF-8 et déclaration explicite dans la vue PDF.'],
            ['Suppression et historique', 'La suppression physique cassait les liens avec les affectations et les mouvements.', 'Suppression logique (SoftDeletes) et corbeille avec restauration.'],
            ['Performances des listes', 'Chargement des relations une par une (problème N+1).', 'Utilisation de with() pour charger les relations en une requête et pagination des résultats.'],
            ['Doublons de référence de ticket', 'Comptage des tickets existants en cas de créations simultanées.', 'Référence dérivée de l’identifiant, générée dans une transaction.'],
        ],
        [4.6, 5.4, 6.0],
        'Difficultés rencontrées et solutions'
    );

    $d->h2('7.3. Présentation de l’application');
    $d->p('Ce chapitre présente l’application à travers ses interfaces et ses fonctionnalités. Il met en évidence le fonctionnement global du système, depuis l’authentification jusqu’à la gestion du parc, des affectations, des maintenances et des rapports.');

    $d->h3('7.3.1. Page d’authentification');
    $d->p('La première interaction de l’utilisateur avec l’application se fait à travers la page d’authentification. Cette interface permet de se connecter de manière sécurisée avec un identifiant et un mot de passe. Elle rappelle le cadre institutionnel, la devise de l’établissement et le caractère réservé de l’accès.');
    $d->figure('rapports/figures/01-connexion.png', 'Page d’authentification de l’application GPI', 15.5);
    $d->p('Une fois les informations vérifiées, le serveur renvoie un jeton et le profil de l’utilisateur avec ses rôles. L’interface adapte alors les menus et les actions disponibles : un agent ne voit pas les boutons de suppression ou de création réservés au gestionnaire.');

    $d->h3('7.3.2. Tableau de bord');
    $d->p('Après une connexion réussie, l’utilisateur est redirigé vers le tableau de bord. Celui-ci présente une vue d’ensemble du parc : nombre de matériels répertoriés, tickets ouverts, maintenances en cours et affectations actives. Des graphiques complètent cette synthèse : répartition par statut, par catégorie et par direction, valeur totale du parc et garanties proches de l’échéance.');
    $d->figure('rapports/figures/02-tableau-de-bord.png', 'Tableau de bord : indicateurs et répartition du parc', 15.5);
    $d->p('Les indicateurs sont calculés côté serveur à partir des données réelles : au moment de la rédaction, le parc compte trente-quatre équipements, seize en service, huit en stock, quatre en maintenance, trois réformés et trois réservés, pour une valeur totale de 80 504 000 ariary. Onze affectations sont en cours et cinq tickets restent ouverts.');

    $d->h3('7.3.3. Gestion des équipements');
    $d->p('La page des équipements affiche la liste complète du parc avec le code d’inventaire, la désignation, la catégorie, la localisation et le statut. La recherche porte sur le code, le numéro de série ou la désignation ; des filtres permettent de restreindre la liste par statut et par catégorie. Chaque ligne propose les actions de consultation, de modification et de suppression.');
    $d->figure('rapports/figures/03-equipements.png', 'Liste des équipements avec recherche et filtres', 15.5);

    $d->h3('7.3.4. Fiche détaillée d’un équipement');
    $d->p('La fiche d’un équipement regroupe l’ensemble de son cycle de vie : caractéristiques, direction et service, fournisseur, localisation, date d’acquisition, prix, garantie, affectations, maintenances et tickets liés, logiciels installés, mouvements et documents. Cette vue unique évite de naviguer entre plusieurs modules pour reconstituer l’histoire d’un matériel.');
    $d->figure('rapports/figures/04-fiche-equipement.png', 'Fiche détaillée d’un équipement et historique', 15.5);

    $d->h3('7.3.5. Affectations et restitutions');
    $d->p('La page des affectations distingue les affectations en cours et les affectations terminées. Elle indique l’agent, la fonction, le code d’inventaire, la désignation et la date de remise. Le bouton « Restituer » clôt l’affectation en renseignant la date de fin et en rendant le matériel disponible.');
    $d->figure('rapports/figures/07-affectations.png', 'Gestion des affectations en cours', 15.5);

    $d->h3('7.3.6. Maintenance et assistance');
    $d->p('Le module de maintenance assure le suivi des interventions préventives et curatives. Chaque intervention est rattachée à un équipement, à un type de maintenance et, si nécessaire, à un agent demandeur. Les statuts permettent de suivre le cycle : demandée, planifiée, en cours, terminée ou annulée. Les tickets d’assistance complètent ce dispositif : ils sont déclarés par les agents, qualifiés par priorité, puis traités par les techniciens avec un historique de commentaires.');
    $d->figure('rapports/figures/06-maintenances.png', 'Suivi des interventions de maintenance', 15.5);

    $d->h3('7.3.7. Inventaires');
    $d->p('Les campagnes d’inventaire permettent de vérifier la présence physique des équipements et de détecter les écarts. Une campagne possède une référence, une date de début, une date de fin prévisionnelle et un statut. Chaque ligne de constat indique si le matériel est présent, la date de vérification et une observation en cas d’écart.');
    $d->figure('rapports/figures/08-inventaires.png', 'Campagnes d’inventaire du parc', 15.5);

    $d->h3('7.3.8. Achats et fournisseurs');
    $d->p('Le module des achats conserve la traçabilité des acquisitions : référence, date, numéro de facture, bon de commande, montant et fournisseur. Les lignes de détail précisent la quantité, le prix unitaire et la date de livraison, et peuvent être rattachées à un équipement. Le répertoire des fournisseurs centralise les coordonnées et les références commerciales.');
    $d->figure('rapports/figures/09-achats.png', 'Gestion des achats et des fournisseurs', 15.5);

    $d->h3('7.3.9. Logiciels et licences');
    $d->p('Le catalogue logiciel recense les applications utilisées, leur version et leur éditeur. Les licences permettent de suivre les dates d’acquisition et d’expiration, le nombre de postes autorisés et les références. Les installations relient un logiciel à un équipement, avec la date, la version installée et le statut. Une alerte est émise lorsqu’une licence approche de son échéance.');
    $d->figure('rapports/figures/10-logiciels.png', 'Catalogue logiciel et suivi des licences', 15.5);

    $d->h3('7.3.10. Répertoire des agents');
    $d->p('La page des agents présente les fiches du personnel sous forme de cartes : nom, fonction, matricule, service, direction, téléphone et statut. La recherche s’effectue par matricule, nom ou fonction. Les agents peuvent être rattachés à un service et à une direction, ce qui permet ensuite de filtrer le parc par entité.');
    $d->figure('rapports/figures/11-agents.png', 'Répertoire des agents de l’établissement', 15.5);

    $d->h3('7.3.11. Rapports et historiques');
    $d->p('La page des rapports propose trois vues : la synthèse du parc, les mouvements de matériel et le journal d’activité. Elle permet de choisir une période (année en cours, douze derniers mois, quatre-vingt-dix jours ou trente jours) et d’exporter le résultat en PDF. Les graphiques présentent les flux d’entrées et de sorties, les transactions par type et la répartition du parc par direction et par catégorie.');
    $d->figure('rapports/figures/12-rapports.png', 'Rapports et historiques du parc', 15.5);
    $d->p('La synthèse met en évidence les indicateurs clés : matériels répertoriés, valeur du parc, mouvements sur la période, achats, équipements en service, en stock, en maintenance, tickets ouverts et affectations actives. Les exports PDF reprennent ces éléments dans un document officiel, prêt à être transmis à la hiérarchie.');

    $d->h2('7.4. Perspectives d’évolution');
    $d->p('L’application couvre aujourd’hui l’essentiel des besoins du Service Informatique. Plusieurs évolutions sont envisagées pour les prochaines versions :');
    $d->bullets([
        '**Étiquetage par QR code** : générer et imprimer des étiquettes, puis scanner un équipement depuis un téléphone pour ouvrir sa fiche.',
        '**Application mobile** : proposer une version adaptée aux agents en déplacement et aux interventions sur site.',
        '**Notifications par courriel** : alerter automatiquement les responsables lors d’une affectation, d’une panne critique ou d’une licence arrivant à échéance.',
        '**Tableau de bord décisionnel** : ajouter des indicateurs de coût de maintenance, de taux de disponibilité et de durée moyenne de résolution.',
        '**Annuaire LDAP / Active Directory** : synchroniser les comptes avec l’annuaire de l’établissement pour simplifier la gestion des accès.',
        '**Signature électronique** : intégrer un visa numérique sur les bons d’affectation et les fiches de restitution.',
        '**Sauvegarde automatisée** : planifier des sauvegardes quotidiennes de la base et des documents, avec test de restauration.',
        '**Journalisation avancée** : conserver l’historique détaillé des consultations et des exports, dans une logique d’audit.',
    ]);
};
