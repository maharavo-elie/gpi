<?php

/**
 * Fin du rapport : conclusion, bibliographie, webographie, glossaire,
 * table des matières, résumé et abstract.
 */
return function (WordDoc $d): void {
    /* ---------------------------------------------------------------- */
    /* CONCLUSION                                                        */
    /* ---------------------------------------------------------------- */

    $d->h1('CONCLUSION GÉNÉRALE');

    $d->p('Ce projet avait pour objectif principal de concevoir et de développer une application de gestion du parc informatique pour la Direction Générale de la Sécurité Routière, en s’appuyant sur des technologies modernes et adaptées aux besoins actuels des administrations. Tout au long de ce travail, une démarche méthodique a été suivie, depuis l’analyse des besoins jusqu’à la réalisation et à la présentation de l’application finale.');
    $d->p('Dans un premier temps, l’étude préalable a permis de comprendre le contexte du projet et de définir les fonctionnalités essentielles du système. Le diagnostic de l’existant a mis en évidence les limites des fichiers tableurs : informations dispersées, absence de traçabilité, doublons et difficulté à produire des rapports fiables. La modélisation de la base de données et de l’architecture de l’application a ensuite joué un rôle clé dans l’organisation et la cohérence de la solution.');
    $d->p('Le choix des technologies — Laravel pour le back-end, React pour l’interface, MySQL pour la gestion des données — s’est révélé pertinent en raison de leur robustesse, de leur évolutivité et de leur large adoption dans le monde professionnel. La méthode MERISE a fourni un cadre rigoureux pour passer des besoins exprimés aux tables de la base de données, puis aux traitements et aux interfaces.');
    $d->p('La phase de développement a permis de mettre en pratique les connaissances théoriques acquises durant la formation. Le codage a été réalisé de manière structurée, en respectant les bonnes pratiques du framework : contrôleurs mutualisés, validation systématique, modèles Eloquent, middleware de rôles et migrations versionnées. Les différentes fonctionnalités ont été testées afin de garantir le bon fonctionnement de l’application et la fiabilité des données manipulées.');
    $d->p('L’application obtenue centralise l’inventaire de trente-quatre équipements, le suivi de quatorze agents, les affectations, les achats, les maintenances, les tickets, les inventaires et les logiciels. Elle produit des indicateurs consolidés et des exports PDF destinés aux responsables. Elle répond ainsi aux objectifs fixés au début du projet et apporte au Service Informatique un outil de travail quotidien, plus fiable et plus rapide que les fichiers qu’il remplace.');
    $d->p('Ce projet constitue une expérience enrichissante, tant sur le plan technique que méthodologique. Il m’a permis de renforcer mes compétences en conception de systèmes d’information, en développement d’API, en modélisation de bases de données et en intégration d’interfaces. Il m’a également confronté aux contraintes réelles d’un projet : comprendre un besoin exprimé par des utilisateurs, arbitrer entre plusieurs solutions, corriger des anomalies et documenter le travail réalisé.');
    $d->p('Plusieurs perspectives restent ouvertes : l’étiquetage par QR code, une application mobile, les notifications par courriel, la synchronisation avec l’annuaire de l’établissement et l’automatisation des sauvegardes. Ces évolutions permettront d’étendre la portée de l’outil et d’en faire un véritable système de pilotage du parc informatique.');

    /* ---------------------------------------------------------------- */
    /* BIBLIOGRAPHIE                                                     */
    /* ---------------------------------------------------------------- */

    $d->h1('BIBLIOGRAPHIE');

    $d->p('[1] TARDIEU H., ROCHFELD A., COLLETTI R., *La méthode Merise : principes et outils*, Éditions d’Organisation, Paris, 1983, 348 pages.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[2] DATE C. J., *Introduction aux systèmes de bases de données*, Addison-Wesley, Paris, 2000, 247 pages.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[3] GAMMA E., HELM R., JOHNSON R., VLISSIDES J., *Design Patterns : Elements of Reusable Object-Oriented Software*, Addison-Wesley, 1994, 395 pages.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[4] FREEMAN A., ROBSON E., *Head First JavaScript Programming*, O’Reilly Media, 2014, 704 pages.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[5] NANOU B., *Architecture logicielle : concevoir des applications robustes et évolutives*, Dunod, 2022, 256 pages.', 'Corps', ['align' => 'left', 'indent' => 0]);

    /* ---------------------------------------------------------------- */
    /* WEBOGRAPHIE                                                       */
    /* ---------------------------------------------------------------- */

    $d->h1('WEBOGRAPHIE');

    $d->p('[1] https://laravel.com/docs — Documentation officielle de Laravel, consultée en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[2] https://fr.react.dev — Documentation officielle de React, consultée en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[3] https://dev.mysql.com/doc/ — Manuel de référence MySQL 8.4, consulté en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[4] https://tailwindcss.com/docs — Documentation de Tailwind CSS, consultée en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[5] https://vite.dev/guide/ — Guide officiel de Vite, consulté en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[6] https://getcomposer.org/doc/ — Documentation de Composer, consultée en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[7] https://git-scm.com/book/fr/v2 — Pro Git, livre de référence en français, consulté en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[8] https://developer.mozilla.org/fr/ — Ressources pour les développeurs web, consultées en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[9] https://www.php.net/manual/fr/ — Manuel PHP, consulté en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);
    $d->p('[10] https://web.maths.unsw.edu.au/~lafaye/CCM/merise/concintro.htm — Cours de MERISE, consulté en 2026.', 'Corps', ['align' => 'left', 'indent' => 0]);

    /* ---------------------------------------------------------------- */
    /* GLOSSAIRE                                                         */
    /* ---------------------------------------------------------------- */

    $d->h1('GLOSSAIRE');

    $glossaire = [
        'API' => 'Interface permettant à deux applications de communiquer entre elles. Dans ce projet, l’API REST expose les données du parc au format JSON.',
        'Back-end' => 'Partie serveur de l’application, qui gère la logique métier, les règles de gestion et l’accès aux données.',
        'Base de données' => 'Ensemble structuré de données stockées et gérées par un système de gestion de base de données.',
        'Composant' => 'Élément d’interface réutilisable (tableau, formulaire, bouton) construit avec React.',
        'Corbeille' => 'Fonctionnalité de suppression logique permettant de restaurer un élément supprimé.',
        'CRUD' => 'Ensemble des opérations de création, lecture, mise à jour et suppression.',
        'Eloquent' => 'ORM de Laravel, qui fait correspondre les tables de la base à des classes PHP.',
        'Front-end' => 'Partie visible de l’application, avec laquelle l’utilisateur interagit.',
        'Git' => 'Système de gestion de versions distribué, utilisé pour suivre les modifications du code.',
        'Intranet' => 'Réseau local interne à une organisation, accessible uniquement depuis ses postes.',
        'Jeton (token)' => 'Chaîne générée à l’authentification et transmise à chaque requête pour prouver l’identité de l’utilisateur.',
        'Laravel' => 'Framework PHP open source fondé sur l’architecture MVC, utilisé pour le back-end.',
        'MCD' => 'Modèle Conceptuel des Données : représentation des entités, propriétés, relations et cardinalités.',
        'MERISE' => 'Méthode de conception des systèmes d’information fondée sur la modélisation des données et des traitements.',
        'Middleware' => 'Composant logiciel qui intercepte une requête HTTP pour appliquer un contrôle, par exemple la vérification d’un rôle.',
        'Migration' => 'Fichier versionné qui décrit une évolution du schéma de la base de données.',
        'MLD' => 'Modèle Logique des Données : traduction du MCD en relations (tables) avec clés primaires et étrangères.',
        'MySQL' => 'Système de gestion de base de données relationnelle open source utilisé pour stocker les données.',
        'ORM' => 'Object-Relational Mapping : mécanisme qui fait correspondre les objets du code aux tables de la base.',
        'QR code' => 'Code-barres bidimensionnel pouvant contenir une adresse ou un identifiant, utilisé pour étiqueter les équipements.',
        'React' => 'Bibliothèque JavaScript de construction d’interfaces utilisateur, utilisée pour le front-end.',
        'Référentiel' => 'Table de données de référence (catégories, marques, modèles, états) utilisée pour classer les équipements.',
        'REST' => 'Style d’architecture des services web fondé sur les ressources et les verbes HTTP.',
        'Sanctum' => 'Bibliothèque d’authentification de Laravel, utilisée pour générer et vérifier les jetons d’accès.',
        'SGBD' => 'Système de Gestion de Base de Données.',
        'SPA' => 'Single Page Application : application web qui charge une seule page et met à jour son contenu sans rechargement.',
        'Vite' => 'Outil de compilation et de serveur de développement pour les applications JavaScript.',
    ];

    $rows = [];
    foreach ($glossaire as $terme => $definition) {
        $rows[] = [$terme, $definition];
    }
    $d->table(['Terme', 'Définition'], $rows, [3.6, 12.4]);

    /* ---------------------------------------------------------------- */
    /* TABLE DES MATIÈRES                                                */
    /* ---------------------------------------------------------------- */

    $d->h1('TABLE DES MATIÈRES');
    $d->toc('TOC \\o "1-3" \\h \\z \\u', 'La table des matières se met à jour automatiquement à l’ouverture du document (Ctrl+A puis F9 si nécessaire).');

    /* ---------------------------------------------------------------- */
    /* RÉSUMÉ                                                            */
    /* ---------------------------------------------------------------- */

    $d->h1('RÉSUMÉ');

    $d->p('Ce projet porte sur la conception et le développement d’une application web intranet de gestion du parc informatique (GPI) pour la Direction Générale de la Sécurité Routière. L’objectif est de remplacer les fichiers tableurs dispersés par une plateforme centralisée, fiable et traçable.');
    $d->p('La démarche adoptée s’appuie sur la méthode MERISE : analyse de l’existant, dictionnaire des données, règles de gestion, diagrammes de flux, modèle conceptuel des données, modèle logique, modèle conceptuel des traitements et modèle organisationnel. L’application a été développée avec Laravel pour l’API REST, React pour l’interface et MySQL pour le stockage.');
    $d->p('La plateforme couvre l’inventaire des équipements, les affectations et restitutions, les maintenances et tickets d’assistance, les achats et fournisseurs, les logiciels et licences, les campagnes d’inventaire, la traçabilité des mouvements et la production de rapports exportables en PDF. Elle repose sur quatre rôles (administrateur, gestionnaire de parc, technicien, utilisateur) et sur des règles de gestion vérifiées par des tests.');
    $d->p('Les résultats obtenus montrent que l’application répond aux besoins définis : le parc de trente-quatre équipements et les quatorze agents sont centralisés, les affectations sont suivies et les responsables disposent d’indicateurs à jour. Ce travail a permis de mettre en pratique les connaissances acquises durant la formation et de développer des compétences en conception, développement, sécurisation et déploiement d’applications.');

    $d->p('**Mots-clés** : gestion du parc informatique, MERISE, Laravel, React, MySQL, API REST, application intranet, inventaire, affectation, maintenance.');

    /* ---------------------------------------------------------------- */
    /* ABSTRACT                                                          */
    /* ---------------------------------------------------------------- */

    $d->h1('ABSTRACT');

    $d->p('This project deals with the design and development of an intranet web application for IT asset management (GPI) at the General Directorate for Road Safety. The aim is to replace scattered spreadsheet files with a centralized, reliable and auditable platform.');
    $d->p('The approach is based on the MERISE method: analysis of the existing system, data dictionary, business rules, data flow diagrams, conceptual data model, logical model, conceptual process model and organizational process model. The application was built with Laravel for the REST API, React for the user interface and MySQL for data storage.');
    $d->p('The platform covers equipment inventory, assignments and returns, maintenance and support tickets, purchases and suppliers, software and licences, inventory campaigns, movement tracking and PDF reports. It relies on four roles (administrator, asset manager, technician, user) and on business rules verified by tests.');
    $d->p('The results show that the application meets the defined requirements: the thirty-four pieces of equipment and fourteen agents are centralized, assignments are tracked and managers have up-to-date indicators. This work made it possible to put theoretical knowledge into practice and to develop skills in design, development, security and deployment.');

    $d->p('**Keywords**: IT asset management, MERISE, Laravel, React, MySQL, REST API, intranet application, inventory, assignment, maintenance.');
};
