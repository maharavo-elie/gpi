<?php

/**
 * PARTIE II — ANALYSE ET CONCEPTION (chapitres 4 et 5).
 */
return function (WordDoc $d): void {
    $d->part('PARTIE II. ANALYSE ET CONCEPTION');
    $d->p('Cette deuxième partie constitue le socle méthodologique du projet. Elle commence par un diagnostic de l’existant, puis présente les solutions envisagées et les choix technologiques retenus. Elle se poursuit par la modélisation du système d’information à l’aide de la méthode MERISE, depuis le dictionnaire des données jusqu’aux modèles conceptuel, logique, conceptuel des traitements et organisationnel des traitements.', 'Corps');

    /* ================================================================ */
    /* CHAPITRE 4 — ANALYSE PRÉALABLE                                    */
    /* ================================================================ */

    $d->h1('Chapitre 4. Analyse préalable');

    $d->p('Cette phase a pour objectif d’établir un diagnostic complet du système actuel et de son environnement, afin de définir précisément les besoins et les contraintes du nouveau système.');

    $d->h2('4.1. Analyse de l’existant');

    $d->h3('4.1.1. Organisation actuelle');
    $d->p('Le Service Informatique de la DGSR assure aujourd’hui le suivi du parc à l’aide de plusieurs fichiers Excel, complétés par des registres papier et par des échanges de courriels. Chaque direction ou structure tient parfois son propre tableau, ce qui conduit à des informations différentes pour un même équipement.');
    $d->bullets([
        '**Fonctionnalité principale** : saisie manuelle des équipements (désignation, numéro de série, prix, date d’achat), suivi sommaire des affectations et des pannes, calculs de base sur les montants.',
        '**Utilisateurs** : le Service Informatique et la Direction Administrative et Financière pour le suivi ; les agents n’ont pas d’interface directe pour consulter le matériel qui leur est confié.',
        '**Support** : fichiers partagés sur le réseau local, imprimés archivés dans des classeurs, appels téléphoniques pour les demandes d’intervention.',
    ]);
    $d->p('Ce mode de fonctionnement présente une limite structurelle : l’information n’est pas centralisée, elle n’est pas horodatée de manière fiable et elle ne permet pas de reconstituer l’historique des mouvements d’un matériel.');

    $d->h3('4.1.2. Inventaire des moyens matériels et logiciels');
    $d->p('L’infrastructure existante constitue une base solide pour le déploiement de la nouvelle solution.');
    $d->p('**Matériel :**');
    $d->bullets([
        'Postes utilisateurs : chaque agent du service administratif et technique dispose d’un ordinateur de bureau ou portable connecté au réseau local.',
        'Serveur local : l’établissement dispose d’un serveur pouvant héberger l’application et sa base de données.',
        'Réseau : un réseau local filaire et Wi-Fi couvre les bâtiments administratifs ; il est administré par le Service Informatique.',
        'Périphériques : imprimantes partagées, scanners, équipements réseau (commutateurs, bornes Wi-Fi), onduleurs.',
    ]);
    $d->p('**Logiciel :**');
    $d->bullets([
        'Système d’exploitation : Windows 10 et Windows 11 sur les postes clients, Windows Server sur le serveur.',
        'Navigateurs web : Chrome, Firefox et Edge sont disponibles sur l’ensemble des postes.',
        'Suite bureautique : Microsoft Office, avec une forte dépendance à Excel pour le suivi actuel.',
        'Base de données : MySQL, déjà utilisée par plusieurs applications internes.',
    ]);

    $d->h2('4.2. Critique de l’existant');
    $d->p('L’analyse de l’existant fait apparaître des avantages réels, mais aussi des limites incompatibles avec les exigences de fiabilité et de traçabilité du service.');
    $d->table(
        ['Avantages', 'Inconvénients et limites'],
        [
            ['Interface familière : les agents maîtrisent Excel et les tableurs.', 'Saisie manuelle, donc source d’erreurs et de doublons.'],
            ['Consultation possible depuis plusieurs postes du réseau.', 'Aucun horodatage fiable des mouvements et des affectations.'],
            ['Aucune formation nécessaire pour l’utilisation de base.', 'Informations dispersées entre plusieurs fichiers et services.'],
            ['Flexibilité et adaptation rapide des tableaux.', 'Absence de règles de gestion : statuts incohérents, matériel affecté deux fois.'],
            ['Maintenance minimale, sans compétence technique spécialisée.', 'Pas de gestion des rôles ni de traçabilité des consultations et modifications.'],
            ['Coût logiciel nul.', 'Pas d’alertes sur les garanties, les licences ou les maintenances en retard.'],
            ['—', 'Production de rapports lente et non standardisée ; pas d’export PDF officiel.'],
        ],
        [7.4, 8.6],
        'Avantages et inconvénients du système actuel'
    );

    $d->h2('4.3. Conception avant-projet');

    $d->h3('4.3.1. Proposition de solutions');
    $d->p('Après avoir analysé les problèmes rencontrés, la solution proposée doit répondre à plusieurs critères : être fiable, faciliter la gestion du parc, empêcher la modification non autorisée des données et rester simple à utiliser pour les agents. Trois pistes ont été examinées.');
    $d->table(
        ['Solution envisagée', 'Avantages', 'Limites', 'Décision'],
        [
            ['Conserver Excel en l’améliorant (modèles, contrôles de saisie)', 'Coût nul, habitudes conservées', 'Pas de gestion des rôles, pas d’historique, pas d’accès concurrent fiable', 'Écartée'],
            ['Acquérir un logiciel de gestion de parc du marché', 'Fonctionnalités complètes, support éditeur', 'Coût de licence, paramétrage lourd, dépendance à un prestataire', 'Écartée'],
            ['Développer une application web intranet sur mesure', 'Adaptée aux processus de la DGSR, maîtrisée en interne, évolutive, sans licence', 'Nécessite un temps de développement et une maintenance applicative', 'Retenue'],
        ],
        [5.4, 4.0, 4.4, 2.2],
        'Comparaison des solutions envisagées',
        '9'
    );
    $d->p('La solution retenue est donc une application web intranet développée sur mesure. Elle sera accessible depuis un navigateur, sans installation sur les postes clients, et hébergée sur le serveur local de l’établissement. Cette approche garantit la maîtrise des données, la possibilité de faire évoluer l’outil et l’absence de coût de licence.');

    $d->h3('4.3.2. Méthodes de conception et outils');
    $d->p('Pour mener à bien l’étude, une méthode de conception appropriée a été mise en œuvre : la méthode MERISE (Méthode d’Étude et de Réalisation Informatique pour les Systèmes d’Entreprise). Elle permet de structurer les données et d’organiser les relations entre les différentes entités de la base de données. La méthode Agile a été examinée à titre comparatif, pour sa souplesse et sa capacité d’adaptation aux changements.');
    $d->table(
        ['Critère de comparaison', 'MERISE', 'AGILE'],
        [
            ['Philosophie de base', 'Approche systémique et séquentielle.', 'Approche itérative et adaptative.'],
            ['Cycle de vie', '« Planifier d’abord, exécuter après ».', '« Expérimenter, apprendre, ajuster ».'],
            ['Point de départ', 'Séquentiel en cascade : étapes strictes (conception, réalisation, validation).', 'Itératif en sprints : cycles courts de planification, développement et revue.'],
            ['Gestion des risques', 'Préventive : les risques sont identifiés et traités pendant la conception.', 'Adaptative : les risques sont gérés au fur et à mesure des sprints.'],
            ['Livrables', 'Dossier d’analyse, MCD, MLD, MCT, MOT, dossier technique.', 'Product Backlog, incréments fonctionnels, produit minimum viable.'],
        ],
        [4.0, 6.0, 6.0],
        'Comparaison méthodologique entre MERISE et Agile'
    );
    $d->p('La méthode MERISE, développée en France dans les années 1970-1980, a été privilégiée en raison de sa forte orientation vers la modélisation des données et de sa structure rigoureuse, mieux adaptée à la conception d’un système d’information de gestion. Elle offre un cadre clair pour passer des besoins exprimés par le service aux tables de la base de données.');

    $d->h3('4.3.3. Choix du système de gestion de base de données');
    $d->p('La sélection d’un système de gestion de base de données est cruciale pour assurer l’efficacité et la performance de l’application. MySQL a été retenu pour sa simplicité d’administration, sa compatibilité avec l’environnement PHP, ses performances sur les applications web de taille moyenne et sa présence dans l’infrastructure existante.');
    $d->table(
        ['Critère', 'MySQL', 'PostgreSQL', 'Oracle Database'],
        [
            ['Type de SGBD', 'Relationnel', 'Relationnel / objet-relationnel', 'Relationnel'],
            ['Licence', 'Open source (GPL)', 'Open source', 'Propriétaire (payant)'],
            ['Coût', 'Gratuit', 'Gratuit', 'Très élevé'],
            ['Complexité', 'Simple à moyen', 'Moyen à élevé', 'Très élevée'],
            ['Performance', 'Très rapide pour les applications web', 'Très performant sur les requêtes complexes', 'Excellente sur de très gros volumes'],
            ['Intégration PHP', 'Native (PDO, Eloquent)', 'Excellente', 'Nécessite des pilotes spécifiques'],
            ['Administration', 'phpMyAdmin, outils simples', 'pgAdmin, configuration plus fine', 'Outils d’entreprise, expertise requise'],
        ],
        [3.6, 4.4, 4.4, 3.6],
        'Tableau comparatif entre SGBDR'
    );
    $d->p('PostgreSQL et MySQL sont des SGBD open source largement utilisés dans les projets académiques et professionnels, tandis qu’Oracle est principalement destiné aux grandes entreprises nécessitant des performances et une sécurité très élevées, mais à un coût important. MySQL couvre largement les besoins du projet : volumétrie modérée, relations nombreuses, contraintes d’intégrité et transactions.');

    $d->h3('4.3.4. Choix du framework back-end');
    $d->p('Pour la partie serveur, le framework Laravel a été retenu. Laravel est un framework PHP open source reconnu pour sa robustesse, sa sécurité et sa rapidité de développement. Il adopte une architecture MVC (Modèle – Vue – Contrôleur) et fournit nativement les briques nécessaires au projet : routage, ORM Eloquent, validation, migrations, authentification par jetons et files d’attente.');
    $d->table(
        ['Critère', 'Laravel', 'Symfony', 'Django (Python)'],
        [
            ['Langage', 'PHP 8.3+', 'PHP 8.2+', 'Python 3.12+'],
            ['Architecture', 'MVC', 'Composants / MVC', 'MVT (proche de MVC)'],
            ['ORM', 'Eloquent (très expressif)', 'Doctrine', 'Django ORM'],
            ['Authentification API', 'Sanctum intégré', 'À configurer (Security, JWT)', 'DRF + token/JWT'],
            ['Migrations', 'Intégrées et simples', 'Doctrine Migrations', 'Intégrées'],
            ['Courbe d’apprentissage', 'Modérée', 'Plus élevée', 'Modérée'],
            ['Écosystème', 'Très riche, documentation abondante', 'Riche, orienté entreprise', 'Riche, orienté data/science'],
        ],
        [3.8, 4.4, 4.2, 3.6],
        'Comparaison des frameworks back-end'
    );
    $d->p('Laravel a été préféré à Symfony pour sa simplicité de mise en route et à Django pour la cohérence avec l’environnement PHP déjà présent sur le serveur de l’établissement. Il permet de développer rapidement une API REST tout en conservant une structure de code claire et testable.');

    $d->h3('4.3.5. Choix de la technologie front-end');
    $d->p('L’interface utilisateur a été développée avec React, une bibliothèque JavaScript maintenue par Meta. React permet de construire des interfaces réactives à partir de composants réutilisables, ce qui convient parfaitement à une application comportant de nombreuses listes, formulaires et filtres.');
    $d->table(
        ['Critère', 'React', 'Vue.js', 'Angular'],
        [
            ['Nature', 'Bibliothèque UI', 'Framework progressif', 'Framework complet'],
            ['Courbe d’apprentissage', 'Modérée (JSX, hooks)', 'Douce', 'Élevée (TypeScript, RxJS)'],
            ['Écosystème', 'Très vaste', 'Vaste', 'Structuré, plus fermé'],
            ['Performance', 'Très bonne (DOM virtuel)', 'Très bonne', 'Très bonne'],
            ['Adéquation au projet', 'Élevée : composants, formulaires, tableaux', 'Élevée', 'Suffisante mais plus lourde'],
        ],
        [4.0, 5.2, 3.6, 3.2],
        'Comparaison des technologies front-end'
    );
    $d->p('React a été retenu pour la souplesse de son écosystème et la possibilité de composer l’interface à partir de composants métier (tableau d’équipements, fiche matériel, formulaire d’affectation, tableau de bord). Le routage est assuré par React Router et les appels réseau par Axios.');

    $d->h3('4.3.6. Environnement de développement et outils');
    $d->p('**Système de contrôle de version.** Git a été utilisé pour suivre les modifications du code et disposer d’un historique. Son modèle distribué permet de travailler localement, de créer des branches pour chaque fonctionnalité et de fusionner les évolutions. Subversion (SVN) et Mercurial ont été écartés : le premier dépend d’un serveur central, le second bénéficie d’une communauté plus restreinte.');
    $d->p('**Éditeur de code.** Visual Studio Code a été choisi pour sa légèreté, ses extensions (PHP Intelephense, ESLint, Prettier, Tailwind CSS IntelliSense) et son terminal intégré, qui évite de multiplier les fenêtres pendant le développement.');
    $d->p('**Compilation des assets.** Vite assure un rechargement rapide pendant le développement et produit des fichiers optimisés pour la production. Tailwind CSS fournit les classes utilitaires utilisées pour construire l’interface, tandis que Lucide React fournit les icônes.');
    $d->p('**Serveur local.** WampServer regroupe Apache, PHP et MySQL sur le poste de développement. Il permet de reproduire fidèlement l’environnement du serveur de l’établissement et de tester l’application en mode intranet.');

    /* ================================================================ */
    /* CHAPITRE 5 — ANALYSE CONCEPTUELLE                                 */
    /* ================================================================ */

    $d->h1('Chapitre 5. Analyse conceptuelle');

    $d->h2('5.1. Présentation de la méthode MERISE');
    $d->p('MERISE (Méthode d’Étude et de Réalisation Informatique pour les Systèmes d’Entreprise) est une méthode de conception de systèmes d’information développée en France dans les années 1970-1980. Elle propose une approche systémique et structurée, organisée autour de trois cycles et de trois niveaux d’abstraction.');
    $d->p('**Les trois cycles MERISE :**');
    $d->bullets([
        '**Cycle de vie** : enchaînement des étapes du projet, depuis l’étude préalable jusqu’à la mise en service et la maintenance (schéma directeur, étude préalable, étude détaillée, étude technique, production du logiciel, mise en service, maintenance).',
        '**Cycle de décision** : les étapes de validation par les décideurs (approbation et lancement, choix d’une solution, accord des utilisateurs, accord des réalisateurs, recette provisoire, conformité du système, recette définitive).',
        '**Cycle d’abstraction** : passage du monde réel au système informatique, en décrivant successivement les données, les traitements et les flux à trois niveaux : conceptuel, organisationnel, logique et physique.',
    ]);
    $d->table(
        ['Système d’information', 'Niveau', 'Données', 'Traitements', 'Flux'],
        [
            ['Système d’information', 'Conceptuel', 'MCD : signification des informations, sans contrainte technique', 'MCT : activités du domaine sans préciser les ressources', 'MCF : relations entre le domaine et le reste du SI'],
            ['Système d’information', 'Organisationnel', 'MOD : signification des informations avec contraintes', 'MOT : fonctionnement du domaine avec les ressources et leur organisation', 'MOF : relations entre les acteurs'],
            ['Système d’information informatisé', 'Logique', 'MLD : description des données tenant compte des conditions de mémorisation', 'MLT : fonctionnement avec les ressources informatiques', 'MLF : relations entre les systèmes informatiques'],
            ['Système d’information informatisé', 'Physique', 'MPD : description de la base dans la syntaxe du SGBD', 'MPT : architecture technique des programmes', 'MPF : supports techniques des flux'],
        ],
        [3.0, 2.9, 3.9, 3.6, 2.6],
        'Cycle d’abstraction MERISE'
    );
    $d->p('Dans le cadre de ce projet, le niveau conceptuel a servi à comprendre le métier et à stabiliser le vocabulaire ; le niveau organisationnel a précisé qui fait quoi, où et avec quelles ressources ; le niveau logique a abouti au modèle relationnel implémenté dans MySQL.');

    $d->h2('5.2. Dictionnaire des données');
    $d->p('Le dictionnaire des données répertorie toutes les données nécessaires à la construction du modèle conceptuel. Chaque rubrique est décrite par son type, sa taille, la possibilité qu’elle soit vide, son rôle (clé primaire ou étrangère) et une description métier. Plusieurs tableaux présentent, pour chaque entité, les rubriques classées par ordre alphabétique.');
    $d->p('Le type **PRI** désigne une clé primaire, **FK** une clé étrangère et **UK** une contrainte d’unicité. La colonne « Null » indique si la donnée peut être vide.');

    $entetes = ['Rubrique', 'Type', 'Taille', 'Null', 'Clé', 'Description'];
    $largeurs = [3.6, 2.0, 1.4, 1.2, 1.6, 6.2];

    $d->h3('a) Entité AGENT');
    $d->table($entetes, [
        ['id_agent', 'BIGINT', '20', 'Non', 'PRI', 'Identifiant technique de l’agent (auto-incrémenté).'],
        ['matricule', 'VARCHAR', '30', 'Non', 'UK', 'Matricule unique de l’agent (identifiant métier).'],
        ['nom_naiss', 'VARCHAR', '100', 'Non', '—', 'Nom de naissance de l’agent.'],
        ['prenom', 'VARCHAR', '100', 'Non', '—', 'Prénom de l’agent.'],
        ['sexe', 'ENUM', 'M/F', 'Non', '—', 'Sexe de l’agent.'],
        ['fonction', 'VARCHAR', '100', 'Oui', '—', 'Poste occupé (technicien, chef de service, etc.).'],
        ['telephone', 'VARCHAR', '30', 'Oui', '—', 'Numéro de contact professionnel.'],
        ['email', 'VARCHAR', '150', 'Oui', '—', 'Adresse électronique professionnelle.'],
        ['date_embauche', 'DATE', '—', 'Oui', '—', 'Date d’entrée dans l’établissement.'],
        ['statut', 'ENUM', '—', 'Non', '—', 'actif, inactif, congé ou mutation.'],
        ['id_direction', 'BIGINT', '20', 'Non', 'FK', 'Direction de rattachement.'],
        ['id_service', 'BIGINT', '20', 'Oui', 'FK', 'Service de rattachement.'],
    ], $largeurs, 'Dictionnaire des données — entité AGENT', '9.5', true);

    $d->h3('b) Entité ÉQUIPEMENT');
    $d->table($entetes, [
        ['id_equipement', 'BIGINT', '20', 'Non', 'PRI', 'Identifiant technique de l’équipement.'],
        ['code_inventaire', 'VARCHAR', '50', 'Non', 'UK', 'Code d’inventaire (ex. GPI-00001).'],
        ['numero_serie', 'VARCHAR', '100', 'Oui', 'UK', 'Numéro de série constructeur.'],
        ['designation', 'VARCHAR', '200', 'Non', '—', 'Désignation du matériel.'],
        ['description', 'TEXT', '—', 'Oui', '—', 'Description complémentaire.'],
        ['date_acquisition', 'DATE', '—', 'Oui', '—', 'Date d’achat ou d’entrée au parc.'],
        ['date_mise_service', 'DATE', '—', 'Oui', '—', 'Date de mise en service.'],
        ['prix_acquisition', 'DECIMAL', '14,2', 'Oui', '—', 'Prix d’achat en ariary.'],
        ['garantie_debut', 'DATE', '—', 'Oui', '—', 'Début de la garantie.'],
        ['garantie_fin', 'DATE', '—', 'Oui', '—', 'Fin de la garantie (alertes à 60 jours).'],
        ['statut', 'ENUM', '—', 'Non', '—', 'en_service, en_stock, en_maintenance, reforme, perdu, reserve.'],
        ['id_modele', 'BIGINT', '20', 'Oui', 'FK', 'Modèle du matériel.'],
        ['id_categorie', 'BIGINT', '20', 'Oui', 'FK', 'Catégorie (ordinateur, serveur, imprimante…).'],
        ['id_marque', 'BIGINT', '20', 'Oui', 'FK', 'Marque du matériel.'],
        ['id_direction', 'BIGINT', '20', 'Oui', 'FK', 'Direction d’affectation.'],
        ['id_service', 'BIGINT', '20', 'Oui', 'FK', 'Service d’affectation.'],
        ['id_fournisseur', 'BIGINT', '20', 'Oui', 'FK', 'Fournisseur du matériel.'],
        ['id_localisation', 'BIGINT', '20', 'Oui', 'FK', 'Localisation physique (site, bâtiment, bureau).'],
        ['id_etat', 'BIGINT', '20', 'Oui', 'FK', 'État physique constaté.'],
    ], $largeurs, 'Dictionnaire des données — entité ÉQUIPEMENT', '9.5', true);

    $d->h3('c) Entité AFFECTATION');
    $d->table($entetes, [
        ['id_affectation', 'BIGINT', '20', 'Non', 'PRI', 'Identifiant de l’affectation.'],
        ['date_affectation', 'DATE', '—', 'Non', '—', 'Date de remise du matériel.'],
        ['date_fin', 'DATE', '—', 'Oui', '—', 'Date de restitution (nulle si en cours).'],
        ['motif', 'TEXT', '—', 'Oui', '—', 'Motif de l’affectation.'],
        ['commentaire', 'TEXT', '—', 'Oui', '—', 'Observations complémentaires.'],
        ['id_equipement', 'BIGINT', '20', 'Non', 'FK', 'Équipement concerné.'],
        ['id_agent', 'BIGINT', '20', 'Non', 'FK', 'Agent bénéficiaire.'],
    ], $largeurs, 'Dictionnaire des données — entité AFFECTATION', '9.5', true);

    $d->h3('d) Entité TICKET');
    $d->table($entetes, [
        ['id_ticket', 'BIGINT', '20', 'Non', 'PRI', 'Identifiant du ticket.'],
        ['reference_ticket', 'VARCHAR', '30', 'Non', 'UK', 'Référence générée (TCK-année-numéro).'],
        ['titre', 'VARCHAR', '200', 'Non', '—', 'Objet de la demande.'],
        ['description', 'TEXT', '—', 'Oui', '—', 'Description détaillée du problème.'],
        ['priorite', 'ENUM', '—', 'Non', '—', 'basse, moyenne, haute ou critique.'],
        ['date_creation', 'DATE', '—', 'Oui', '—', 'Date d’ouverture du ticket.'],
        ['date_cloture', 'DATE', '—', 'Oui', '—', 'Date de clôture ou de résolution.'],
        ['statut', 'ENUM', '—', 'Non', '—', 'ouvert, en_cours, resolu, ferme.'],
        ['id_equipement', 'BIGINT', '20', 'Oui', 'FK', 'Équipement concerné.'],
        ['id_agent', 'BIGINT', '20', 'Oui', 'FK', 'Agent demandeur.'],
    ], $largeurs, 'Dictionnaire des données — entité TICKET', '9.5', true);

    $d->h3('e) Entité MAINTENANCE');
    $d->table($entetes, [
        ['id_maintenance', 'BIGINT', '20', 'Non', 'PRI', 'Identifiant de l’intervention.'],
        ['date_demande', 'DATE', '—', 'Oui', '—', 'Date de la demande d’intervention.'],
        ['date_debut', 'DATE', '—', 'Oui', '—', 'Date de début de l’intervention.'],
        ['date_fin', 'DATE', '—', 'Oui', '—', 'Date de fin de l’intervention.'],
        ['description_probleme', 'TEXT', '—', 'Oui', '—', 'Panne ou symptômes constatés.'],
        ['diagnostic', 'TEXT', '—', 'Oui', '—', 'Diagnostic et actions réalisées.'],
        ['technicien', 'VARCHAR', '150', 'Oui', '—', 'Technicien en charge du dossier.'],
        ['statut', 'ENUM', '—', 'Non', '—', 'demandee, planifiee, en_cours, terminee, annulee.'],
        ['id_equipement', 'BIGINT', '20', 'Non', 'FK', 'Équipement en maintenance.'],
        ['id_type_maintenance', 'BIGINT', '20', 'Non', 'FK', 'Type d’intervention (préventive, curative…).'],
        ['id_agent', 'BIGINT', '20', 'Oui', 'FK', 'Agent à l’origine de la demande.'],
    ], $largeurs, 'Dictionnaire des données — entité MAINTENANCE', '9.5', true);

    $d->h3('f) Entité ACHAT');
    $d->table($entetes, [
        ['id_achat', 'BIGINT', '20', 'Non', 'PRI', 'Identifiant de l’achat.'],
        ['reference_achat', 'VARCHAR', '50', 'Oui', 'UK', 'Référence interne du marché ou de la commande.'],
        ['date_achat', 'DATE', '—', 'Oui', '—', 'Date de la commande ou de l’achat.'],
        ['numero_facture', 'VARCHAR', '50', 'Oui', '—', 'Numéro de facture fournisseur.'],
        ['bon_commande', 'VARCHAR', '50', 'Oui', '—', 'Référence du bon de commande.'],
        ['montant_total', 'DECIMAL', '14,2', 'Oui', '—', 'Montant total de l’achat.'],
        ['statut', 'ENUM', '—', 'Non', '—', 'commande, livre_partiel, livre, annule.'],
        ['id_fournisseur', 'BIGINT', '20', 'Oui', 'FK', 'Fournisseur retenu.'],
    ], $largeurs, 'Dictionnaire des données — entité ACHAT', '9.5', true);

    $d->h3('g) Entité LOGICIEL');
    $d->table($entetes, [
        ['id_logiciel', 'BIGINT', '20', 'Non', 'PRI', 'Identifiant du logiciel.'],
        ['nom', 'VARCHAR', '150', 'Non', '—', 'Nom commercial du logiciel.'],
        ['version', 'VARCHAR', '50', 'Oui', '—', 'Version de référence.'],
        ['editeur', 'VARCHAR', '150', 'Oui', '—', 'Éditeur du logiciel.'],
        ['reference_licence', 'VARCHAR', '50', 'Non', 'UK', 'Référence unique de la licence.'],
        ['date_expiration', 'DATE', '—', 'Oui', '—', 'Date d’expiration de la licence.'],
    ], $largeurs, 'Dictionnaire des données — entité LOGICIEL', '9.5', true);

    $d->h2('5.3. Règles de gestion');
    $d->p('Les règles de gestion (RG) sont les contraintes métier qui régissent le fonctionnement du système. Elles garantissent l’intégrité, la cohérence et la conformité aux processus de la DGSR. Elles ont été traduites dans le code, dans les validations et dans les contraintes de la base de données.');
    $d->table(
        ['Code', 'Règle de gestion', 'Traduction technique'],
        [
            ['RG01', 'Un équipement possède un code d’inventaire unique et un numéro de série unique s’il est renseigné.', 'Contraintes UNIQUE sur code_inventaire et numero_serie.'],
            ['RG02', 'Un agent possède un matricule unique et immuable.', 'Contrainte UNIQUE sur matricule.'],
            ['RG03', 'Un équipement ne peut être affecté qu’à un seul agent à la fois.', 'Contrôle applicatif à la création d’une affectation ; date_fin nulle pour l’affectation en cours.'],
            ['RG04', 'Une affectation terminée ne peut plus être modifiée, seule la restitution est autorisée.', 'Route dédiée /affectations/{id}/restitution ; mise à jour de date_fin.'],
            ['RG05', 'Un ticket possède une référence unique de la forme TCK-année-numéro.', 'Génération dans une transaction, contrainte UNIQUE sur reference_ticket.'],
            ['RG06', 'Un ticket clôturé ou résolu renseigne automatiquement sa date de clôture.', 'Contrôle dans TicketController lors du changement de statut.'],
            ['RG07', 'Un équipement en maintenance ne peut pas être affecté à un nouvel agent.', 'Contrôle de statut avant création d’affectation.'],
            ['RG08', 'La suppression d’un équipement ou d’un agent est logique (corbeille) et réversible.', 'SoftDeletes sur equipements et agents ; restauration depuis la corbeille.'],
            ['RG09', 'Un utilisateur ne peut accéder qu’aux fonctionnalités autorisées par son rôle.', 'Middleware role:… et policies côté API.'],
            ['RG10', 'Un agent ne peut consulter que les données du parc, pas les modifier.', 'Rôle utilisateur en lecture seule ; routes d’écriture protégées.'],
            ['RG11', 'Toute opération sensible est tracée dans le journal d’activité.', 'Table journal_activites et notifications associées.'],
            ['RG12', 'Une licence expirée ne peut plus être associée à une nouvelle installation.', 'Contrôle du statut de la licence avant installation.'],
        ],
        [1.4, 8.6, 6.0],
        'Règles de gestion du système'
    );
    $d->p('Ces règles ont été définies avec le Service Informatique lors des entretiens de cadrage. Elles constituent la référence pour les tests de validation présentés au chapitre 7.');

    $d->h2('5.4. Diagramme de flux');
    $d->p('Les modèles de flux représentent ce qui doit être étudié dans le cadre du projet, à partir de l’analyse des flux échangés. Le diagramme de flux est une représentation graphique des acteurs et des informations qui circulent entre eux.');
    $d->bullets([
        '**Le domaine** : découpage de l’organisation correspondant à une finalité majeure ; ici, la gestion du parc informatique.',
        '**L’acteur** : unité active intervenant dans le fonctionnement du système opérant (service, agent, application).',
        '**Le flux** : échange d’informations entre acteurs, matérialisé par un document, une requête ou une notification.',
    ]);

    $d->h3('5.4.1. Acteurs du système');
    $d->table(
        ['Acteur', 'Rôle', 'Responsabilités'],
        [
            ['Administrateur', 'Gestionnaire du système', 'Gestion des comptes et des rôles, configuration, supervision, journal d’activité.'],
            ['Gestionnaire de parc', 'Responsable du parc', 'Création et mise à jour des équipements, affectations, achats, fournisseurs et référentiels.'],
            ['Technicien', 'Intervenant technique', 'Traitement des tickets et des maintenances, installations logicielles, diagnostics.'],
            ['Agent', 'Utilisateur final', 'Consultation du matériel affecté, déclaration d’un ticket, consultation de son profil.'],
            ['Système GPI', 'Application Laravel / React', 'Traitement, validation, stockage et restitution des données.'],
            ['Base de données MySQL', 'Persistance', 'Stockage des données, contraintes d’intégrité, historique.'],
            ['Service de messagerie / intranet', 'Diffusion', 'Mise à disposition de l’application sur le réseau local.'],
        ],
        [4.0, 4.6, 7.4],
        'Acteurs du système'
    );

    $d->h3('5.4.2. Détail des flux d’informations');
    $d->p('**Flux 1 — Gestion du parc.** L’administrateur ou le gestionnaire saisit les caractéristiques d’un équipement (désignation, marque, modèle, numéro de série, prix, garantie). Le système valide les champs obligatoires et l’unicité du code d’inventaire, puis enregistre l’équipement et renvoie une confirmation. En cas d’erreur, un message explicite indique le champ concerné.');
    $d->p('**Flux 2 — Authentification et accès.** L’agent saisit son identifiant et son mot de passe. Le système vérifie les informations, génère un jeton d’accès et renvoie le profil avec les rôles associés. L’interface adapte ensuite les menus et les actions autorisées. Une tentative échouée est limitée par un mécanisme de limitation de débit (six tentatives par minute).');
    $d->p('**Flux 3 — Affectation et restitution.** Le gestionnaire sélectionne un équipement disponible et un agent, puis enregistre l’affectation avec une date et un motif. Le système vérifie que l’équipement n’est pas déjà affecté et met à jour son statut. À la restitution, la date de fin est renseignée et l’équipement redevient disponible.');
    $d->p('**Flux 4 — Assistance et maintenance.** L’agent déclare un ticket (titre, description, priorité). Le technicien le prend en charge, change son statut, ajoute des commentaires et, si nécessaire, crée une maintenance liée. Chaque changement de statut déclenche une notification pour le demandeur et pour les intervenants.');
    $d->p('**Gestion des erreurs.** Les erreurs de saisie sont signalées à l’utilisateur par un message clair et un champ mis en évidence. Les erreurs système sont journalisées et une alerte est envoyée à l’administrateur. Les exports PDF en échec sont relancés après vérification des données source.');

    $d->h2('5.5. Modélisation des données');

    $d->h3('5.5.1. Modèle Conceptuel des Données (MCD)');
    $d->p('Le MCD est une représentation graphique de haut niveau qui permet de comprendre simplement comment les différents éléments du système sont liés entre eux. Faisant partie de la boîte à outils MERISE, il décrit les données utilisées par le système d’information et leurs relations. Les informations sont représentées logiquement à l’aide d’un ensemble de règles et de diagrammes codifiés :');
    $d->bullets([
        'les **entités** (un rectangle = un objet) ;',
        'les **propriétés** (la liste des données de l’entité) ;',
        'les **relations** qui expliquent comment les entités sont reliées entre elles (losanges) ;',
        'les **cardinalités** (les chiffres portés sur chaque patte de la relation).',
    ]);
    $d->p('La construction du MCD suit quatre étapes : obtenir les règles de gestion du besoin à informatiser, recenser les données dans un dictionnaire, comprendre les relations et les dépendances entre les données, puis construire le modèle. Le MCD du projet GPI est présenté à la figure 1. Il regroupe les entités du parc, de l’organisation, des achats, de la maintenance, de l’inventaire et de la traçabilité.');
    $d->figure('docs/merise/png/MCD.png', 'Modèle Conceptuel des Données (MCD) du système GPI', 16.0);
    $d->p('**Interprétation des principales relations :**');
    $d->bullets([
        'Une **direction** regroupe zéro ou plusieurs **services** ; un service relève d’une et une seule direction.',
        'Un **service** emploie zéro ou plusieurs **agents** ; un agent est rattaché à une direction et, facultativement, à un service.',
        'Un **agent** peut recevoir plusieurs **affectations** ; une affectation concerne un seul agent et un seul équipement.',
        'Un **équipement** peut faire l’objet de plusieurs **affectations**, **maintenances**, **tickets** et **mouvements** ; chaque opération référence un seul équipement.',
        'Un **ticket** peut contenir plusieurs **commentaires** ; chaque commentaire est rédigé par un utilisateur.',
        'Un **achat** comporte plusieurs **lignes de détail** ; chaque ligne peut être rattachée à un équipement.',
        'Un **logiciel** possède plusieurs **licences** et peut être installé sur plusieurs équipements.',
        'Un **inventaire** comporte plusieurs **lignes de constat**, chacune portant sur un équipement.',
        'Un **équipement** possède au plus un **QR code** et peut être associé à plusieurs **documents**.',
    ]);

    $d->h3('5.5.2. Modèle Logique des Données (MLD)');
    $d->p('Le MLD est une représentation textuelle de la base de données à informatiser, consécutive au travail d’analyse du MCD et précédant le modèle physique. Le passage du MCD au MLD applique six règles :');
    $d->bullets([
        '**Règle 1** : une entité devient une relation (table) ; ses propriétés deviennent des attributs et son identifiant devient la clé primaire.',
        '**Règle 2** : pour une relation binaire de cardinalités (X,1) – (X,n), la clé primaire de la table côté (X,n) devient une clé étrangère dans la table côté (X,1).',
        '**Règle 3** : pour une relation binaire (X,n) – (X,n), une table supplémentaire est créée, avec une clé primaire composée des identifiants des deux entités.',
        '**Règle 4** : pour une relation n-aire, une table est créée avec la concaténation des identifiants des entités participantes.',
        '**Règle 5** : pour une association réflexive, la clé primaire se dédouble et devient clé étrangère dans la même table, ou une table de liaison est créée selon les cardinalités.',
        '**Règle 6** : pour une relation binaire (0,1) – (1,1), la clé primaire de la table côté (0,1) devient une clé étrangère dans la table côté (1,1).',
    ]);
    $d->p('Le MLD obtenu comporte les relations principales (les clés primaires sont soulignées dans le modèle graphique et les clés étrangères sont précédées du symbole #) :');
    $d->bullets([
        '**DIRECTION** (id_direction, code_direction, nom_direction, description, telephone, email, statut)',
        '**SERVICE** (id_service, code_service, nom_service, description, statut, #id_direction)',
        '**AGENT** (id_agent, matricule, nom_naiss, prenom, sexe, fonction, telephone, email, date_embauche, statut, #id_direction, #id_service)',
        '**UTILISATEUR** (id_utilisateur, username, email, password, actif, dernier_connexion, #id_agent)',
        '**ROLE** (id_role, nom_role, description) — **ROLE_UTILISATEUR** (#id_utilisateur, #id_role)',
        '**SITE** (id_site, code_site, nom_site, ville, statut) — **BATIMENT** (id_batiment, code_batiment, nom_batiment, statut, #id_site) — **LOCALISATION** (id_localisation, code_localisation, etage, bureau, statut, #id_batiment)',
        '**CATEGORIE** (id_categorie, code_categorie, nom_categorie, statut) — **MARQUE** (id_marque, nom_marque) — **MODELE** (id_modele, reference_modele, nom_modele, #id_categorie, #id_marque)',
        '**ETAT_EQUIPEMENT** (id_etat, nom_etat, description)',
        '**EQUIPEMENT** (id_equipement, code_inventaire, numero_serie, designation, date_acquisition, date_mise_service, prix_acquisition, garantie_debut, garantie_fin, statut, #id_modele, #id_categorie, #id_marque, #id_direction, #id_service, #id_fournisseur, #id_localisation, #id_etat, #id_detail_achat)',
        '**FOURNISSEUR** (id_fournisseur, raison_sociale, contact, telephone, email, adresse, rcs, statut)',
        '**ACHAT** (id_achat, reference_achat, date_achat, numero_facture, bon_commande, montant_total, statut, #id_fournisseur)',
        '**DETAIL_ACHAT** (id_detail_achat, quantite, prix_unitaire, montant, date_livraison, #id_achat, #id_equipement)',
        '**AFFECTATION** (id_affectation, date_affectation, date_fin, motif, commentaire, #id_equipement, #id_agent)',
        '**TYPE_MAINTENANCE** (id_type_maintenance, nom_type, description) — **MAINTENANCE** (id_maintenance, date_demande, date_debut, date_fin, description_probleme, diagnostic, technicien, statut, #id_equipement, #id_type_maintenance, #id_agent)',
        '**TICKET** (id_ticket, reference_ticket, titre, description, priorite, date_creation, date_cloture, statut, #id_equipement, #id_agent) — **TICKET_COMMENTAIRE** (id_commentaire, contenu, date_commentaire, #id_ticket, #id_utilisateur)',
        '**INVENTAIRE** (id_inventaire, reference, date_debut, date_fin, description, statut, #id_utilisateur) — **INVENTAIRE_DETAIL** (id_detail, presence, date_constat, observation, statut, #id_inventaire, #id_equipement)',
        '**LOGICIEL** (id_logiciel, nom, version, editeur, description) — **LICENCE** (id_licence, reference_licence, type_licence, date_acquisition, date_expiration, numero_serie, statut, #id_logiciel) — **INSTALLATION_LOGICIEL** (id_installation, date_installation, version_installee, licence, statut, #id_logiciel, #id_equipement)',
        '**MOUVEMENT** (id_mouvement, type_mouvement, date_mouvement, #id_equipement, #ancienne_localisation, #nouvelle_localisation, #id_utilisateur) — **MOUVEMENT_HISTORIQUE** (id_historique, #id_mouvement, #id_utilisateur)',
        '**DOCUMENT** (id_document, nom_document, type_document, chemin_fichier, #id_equipement, #id_utilisateur) — **QR_CODE** (id_qrcode, contenu, date_generation, statut, #id_equipement)',
        '**NOTIFICATION** (id_notification, titre, message, lu, #id_utilisateur) — **JOURNAL_ACTIVITE** (id_journal, action, entite, #id_utilisateur)',
    ], false, ['align' => 'left']);
    $d->figure('docs/merise/png/MLD.png', 'Modèle Logique des Données (MLD) du système GPI', 16.0);

    $d->h3('5.5.3. Modèle Conceptuel des Traitements (MCT)');
    $d->p('Le MCT permet de traiter la dynamique du système d’information, c’est-à-dire les opérations réalisées en fonction d’événements. Il représente de façon schématique l’activité du système sans faire référence à des choix organisationnels ou à des moyens d’exécution : il définit ce qui doit être fait, mais ne dit ni quand, ni comment, ni où. Deux MCT ont été produits pour couvrir les processus principaux du projet.');
    $d->p('Le premier décrit le cycle **tickets, affectations et inventaire** : déclaration d’un ticket par un agent, qualification et affectation à un technicien, création d’une maintenance si nécessaire, clôture et mise à jour de l’historique. Le second décrit la **restitution et la réforme** d’un matériel : constat de l’état, décision de restitution ou de réforme, mise à jour du statut et génération du mouvement.');
    $d->figure('docs/merise/png/MCT-tickets-affectation-inventaire.png', 'Modèle Conceptuel des Traitements (MCT) — tickets, affectations et inventaire', 13.5);
    $d->figure('docs/merise/png/MCT-restitution-reforme.png', 'Modèle Conceptuel des Traitements (MCT) — restitution et réforme', 11.5);

    $d->h3('5.5.4. Modèle Organisationnel des Traitements (MOT)');
    $d->p('Le modèle organisationnel des traitements décrit les propriétés des traitements non traitées par le modèle conceptuel, à savoir le temps, les ressources et le lieu. Il représente le modèle conceptuel des traitements dans un tableau dont les colonnes précisent la durée, le lieu, les responsables et les ressources nécessaires à chaque action.');
    $d->p('La première étape consiste à découper les opérations en procédures fonctionnelles, c’est-à-dire une succession de traitements déclenchée par un événement. Le tableau associe ensuite le traitement, son déroulement, l’acteur, le lieu et les ressources du poste de travail.');
    $d->figure('docs/merise/png/MOT.png', 'Modèle Organisationnel des Traitements (MOT) du système GPI', 16.0);

    $d->table(
        ['Traitement', 'Acteur', 'Lieu', 'Ressources', 'Durée'],
        [
            ['Enregistrer un équipement', 'Gestionnaire de parc', 'Bureau du service informatique', 'Poste connecté, navigateur, fiche de réception', '5 min'],
            ['Affecter un matériel', 'Gestionnaire de parc', 'Bureau du service informatique', 'Poste connecté, bon de remise', '3 min'],
            ['Déclarer un ticket', 'Agent', 'Tout poste du réseau', 'Navigateur, identifiants', '2 min'],
            ['Traiter un ticket', 'Technicien', 'Atelier technique', 'Poste connecté, outils de diagnostic', '15 à 60 min'],
            ['Restituer un matériel', 'Gestionnaire de parc', 'Bureau du service informatique', 'Poste connecté, fiche de restitution', '5 min'],
            ['Lancer un inventaire', 'Administrateur', 'Bureau du service informatique', 'Poste connecté, liste du parc', 'Variable'],
            ['Éditer un rapport PDF', 'Gestionnaire / direction', 'Bureau ou salle de réunion', 'Navigateur, imprimante', '2 min'],
        ],
        [3.8, 3.1, 3.7, 3.6, 1.8],
        'Traitements, acteurs et ressources du système'
    );
};
