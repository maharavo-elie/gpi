<?php

/**
 * Pages liminaires : couverture, CV, sommaire, remerciements,
 * listes des figures/tableaux, abréviations, introduction générale.
 */
return function (WordDoc $d): void {
    /* ---------------------------------------------------------------- */
    /* PAGE DE GARDE                                                     */
    /* ---------------------------------------------------------------- */

    $d->p('', 'CouvertureTexte', ['spacing' => 240]);
    $d->p('RÉPUBLIQUE DE MADAGASCAR', 'CouvertureInstitution');
    $d->p('UNIVERSITÉ DE FIANARANTSOA', 'CouvertureInstitution');
    $d->p('ÉCOLE NATIONALE D’INFORMATIQUE', 'CouvertureInstitution');
    $d->p('Centre d’étude de Toliara', 'CouvertureTexte', ['spacing' => 300]);
    $d->p('', 'CouvertureTexte');
    $d->p('RAPPORT DE STAGE EN DEUXIÈME ANNÉE DE LICENCE PROFESSIONNELLE', 'CouvertureTexte');
    $d->p('Mention : Informatique', 'CouvertureTexte');
    $d->p('Parcours : Informatique Générale', 'CouvertureTexte', ['spacing' => 240]);
    $d->p('', 'CouvertureTexte');
    $d->p('Intitulé :', 'CouvertureTexte', ['spacing' => 120]);
    $d->p('CONCEPTION ET DÉVELOPPEMENT D’UNE APPLICATION DE GESTION DU PARC INFORMATIQUE (GPI)', 'CouvertureTitre');
    $d->p('Cas de la Direction Générale de la Sécurité Routière (DGSR)', 'CouvertureSousTitre');
    $d->p('', 'CouvertureTexte');
    $d->p('Présenté le : ...............................', 'CouvertureTexte');
    $d->p('Par : Monsieur RAKOTOMAMINIRIANA Fanomezaniavo Fenohery Sarobidy', 'CouvertureNom');
    $d->p('', 'CouvertureTexte');
    $d->p('Membres du jury :', 'CouvertureTexte');
    $d->p('Rapporteurs :', 'CouvertureTexte');
    $d->p('- ......................................... (Encadreur pédagogique)', 'CouvertureTexte');
    $d->p('- ......................................... (Encadreur professionnel)', 'CouvertureTexte', ['spacing' => 160]);
    $d->p('Année universitaire 2025 - 2026', 'CouvertureNom');
    $d->p('', 'CouvertureTexte', ['spacing' => 120]);
    $d->p('Tampon et signature du responsable', 'CouvertureTexte');

    // La page de garde forme sa propre section : elle n’est ni en-têtée
    // ni numérotée, et la numérotation romaine commence au curriculum vitae.
    $d->sectionBreak([]);

    /* ---------------------------------------------------------------- */
    /* CURRICULUM VITAE                                                  */
    /* ---------------------------------------------------------------- */

    $d->p('CURRICULUM VITAE', 'Heading2', ['pageBreakBefore' => false]);
    $d->p('RAKOTOMAMINIRIANA FANOMEZANIAVO FENOHERY SAROBIDY', 'CouvertureNom');
    $d->p('', 'CouvertureTexte');

    $d->bullets([
        '**Âge** : 23 ans',
        '**Situation matrimoniale** : Célibataire',
        '**Téléphone** : +261 34 28 752 34',
        '**E-mail** : rfanomezaniavo@gmail.com',
        '**Portfolio** : https://fenohery-pf-00.vercel.app',
        '**Adresse** : Maninday',
    ]);

    $d->h3('PERSONNALITÉS');
    $d->p('Je suis passionné par le monde du numérique et par tout ce qui s’y rapporte. J’aime apprendre, je suis dynamique et sérieux, et je m’attache à mener à terme les missions qui me sont confiées.');

    $d->h3('DIPLÔMES ET FORMATIONS');
    $d->bullets([
        '**Depuis 2023** : deuxième année de Licence à l’École Nationale d’Informatique de Fianarantsoa, centre d’étude de Toliara.',
        '**2020 – 2023** : Mathématiques et Informatique à la Faculté des Sciences d’Ankatso.',
        '**2021 – 2022** : Anglais à l’English Teaching Program (ETP) d’Antsahavola.',
        '**2019 – 2020** : Baccalauréat série C à l’École Sacré-Cœur d’Anosisoa.',
    ]);

    $d->h3('EXPÉRIENCES PROFESSIONNELLES');
    $d->bullets([
        '**Décembre 2024 – Février 2025** : développeur web front-end chez SAHA Technology.',
        '**Septembre 2025 – Novembre 2025** : développeur d’applications avec Odoo chez ENEAM à Ivato.',
        '**2025 – 2026** : stage de fin de deuxième année de Licence au sein de la Direction Générale de la Sécurité Routière (DGSR), service informatique.',
    ]);

    $d->h3('LANGUES');
    $d->bullets([
        '**Malgache** : langue maternelle.',
        '**Français** : parler, lire, écrire.',
        '**Anglais** : parler, lire, écrire.',
    ]);

    $d->h3('COMPÉTENCES');
    $d->bullets([
        '**Technologies web et design** : React, Tailwind CSS, ExpressJS, NodeJS, Laravel, Figma.',
        '**Langages de programmation** : C/C++, JavaScript, PHP, Python.',
        '**Systèmes de gestion de bases de données** : MySQL, SQLite et PostgreSQL.',
        '**Environnements de développement et collaboratifs** : Git/GitHub, Docker et Vagrant.',
        '**Réseaux informatiques** : TCP/IP, modèle ISO et routage IP (RIP et OSPF).',
        '**Informatique bureautique** : Word, Excel et PowerPoint.',
        '**Systèmes** : Windows et Unix/Linux.',
    ]);

    $d->h3('CENTRES D’INTÉRÊT');
    $d->bullets(['Technologie', 'Jeux vidéo', 'Films', 'Musique', 'Jeux d’échecs']);

    /* ---------------------------------------------------------------- */
    /* SOMMAIRE                                                          */
    /* ---------------------------------------------------------------- */

    // Le titre du sommaire ne porte pas de niveau hiérarchique : il ne doit pas
    // se citer lui-même dans la liste des entrées.
    $d->p('SOMMAIRE', 'TitreLiminaire', ['pageBreakBefore' => true]);
    $d->p('Le sommaire présente les parties, les chapitres et les titres de premier niveau du rapport. La table des matières, placée en fin de document, en donne le détail complet.', 'Corps');

    // Le sommaire s’arrête aux titres de premier niveau (x.y) ; la table des
    // matières reprend ensuite tous les niveaux du plan.
    $d->toc('TOC \\o "1-3" \\h \\z', 'Le sommaire se met à jour automatiquement à l’ouverture du document.');

    /* ---------------------------------------------------------------- */
    /* REMERCIEMENTS                                                     */
    /* ---------------------------------------------------------------- */

    $d->h1('REMERCIEMENTS');

    $d->p('Avant de commencer, je remercie Dieu tout-puissant, sans qui rien de tout cela n’aurait été possible. Mes remerciements s’adressent également à celles et ceux qui ont rendu ce stage possible.');

    $d->p('– À **Monsieur HAJALALAINA Aimé Richard**, Professeur, Président de l’Université de Fianarantsoa, pour son engagement en faveur de l’excellence académique et son soutien aux étudiants.', 'Remerciement');
    $d->p('– À **Monsieur ANDRIAMANANTENA Razafiharison**, Président de l’Université de Toliara, pour avoir accordé l’intégration du centre d’étude de l’ENI au sein de l’Université de Toliara.', 'Remerciement');
    $d->p('– Au **Docteur MAHATODY Thomas**, Directeur de l’École Nationale d’Informatique de Fianarantsoa, pour la qualité de la formation dispensée et son attention aux conditions de stage des étudiants.', 'Remerciement');
    $d->p('– À **Monsieur le Directeur Général de la Direction Générale de la Sécurité Routière**, pour avoir accepté ma candidature et m’avoir accueilli au sein de son établissement durant toute la période du stage.', 'Remerciement');
    $d->p('– À **Monsieur RABETAFIKA Louis Haja**, Maître de Conférences, responsable de la mention Informatique, pour ses conseils méthodologiques et son suivi de la formation.', 'Remerciement');
    $d->p('– À **Monsieur GILANTE Gesazafy**, responsable du parcours Informatique Générale, pour son accompagnement tout au long de l’année universitaire.', 'Remerciement');
    $d->p('– À **Monsieur RAZAFINDRAMONJA Herinantenaina Clément Aubert**, Assistant d’Enseignement Supérieur et de Recherche à l’ENI, mon encadreur pédagogique et rapporteur, pour ses orientations, sa rigueur méthodologique et ses relectures attentives de ce rapport.', 'Remerciement');
    $d->p('– À **Monsieur RABENJARISOA Tantelinirina**, responsable du Service Informatique de la DGSR et mon encadreur professionnel, pour m’avoir guidé dans la réalisation du projet, pour sa disponibilité et pour la confiance qu’il m’a accordée.', 'Remerciement');
    $d->p('– À l’ensemble du **Service Informatique de la DGSR**, pour son accueil, ses explications sur l’organisation du parc et sa participation aux tests de l’application.', 'Remerciement');
    $d->p('– À tous les **corps enseignants** de l’ENI, pour leur patience et leur engagement malgré leurs charges académiques.', 'Remerciement');
    $d->p('– À mes **parents** et à tous mes **proches**, pour leur soutien, financier comme moral, et pour leurs prières.', 'Remerciement');

    /* ---------------------------------------------------------------- */
    /* LISTES                                                            */
    /* ---------------------------------------------------------------- */

    $d->h1('LISTE DES FIGURES');
    $d->toc('TOC \\h \\z \\c "Figure"', 'La liste des figures se met à jour automatiquement à l’ouverture du document.');

    $d->h1('LISTE DES TABLEAUX');
    $d->toc('TOC \\h \\z \\c "Tableau"', 'La liste des tableaux se met à jour automatiquement à l’ouverture du document.');

    /* ---------------------------------------------------------------- */
    /* ABRÉVIATIONS                                                      */
    /* ---------------------------------------------------------------- */

    $d->h1('LISTE DES ABRÉVIATIONS');

    $abbr = [
        'API' => 'Application Programming Interface (interface de programmation applicative)',
        'CENSERO' => 'Centre National de Sécurité Routière',
        'CLI' => 'Command Line Interface (interface en ligne de commande)',
        'CRT' => 'Centre de Réception Technique',
        'CRUD' => 'Create, Read, Update, Delete',
        'DAF' => 'Direction Administrative et Financière',
        'DG' => 'Direction Générale',
        'DGSR' => 'Direction Générale de la Sécurité Routière',
        'DOR' => 'Direction des Opérations Routières',
        'DT' => 'Direction Technique',
        'ENI' => 'École Nationale d’Informatique',
        'GPI' => 'Gestion du Parc Informatique',
        'HTTP(S)' => 'HyperText Transfer Protocol (Secure)',
        'IDE' => 'Integrated Development Environment',
        'JSON' => 'JavaScript Object Notation',
        'LMD' => 'Licence – Master – Doctorat',
        'MCD' => 'Modèle Conceptuel des Données',
        'MCF' => 'Modèle Conceptuel des Flux',
        'MCT' => 'Modèle Conceptuel des Traitements',
        'MERISE' => 'Méthode d’Étude et de Réalisation Informatique pour les Systèmes d’Entreprise',
        'MLD' => 'Modèle Logique des Données',
        'MLT' => 'Modèle Logique des Traitements',
        'MOD' => 'Modèle Organisationnel des Données',
        'MOT' => 'Modèle Organisationnel des Traitements',
        'MPD' => 'Modèle Physique des Données',
        'MVC' => 'Modèle – Vue – Contrôleur',
        'ORM' => 'Object-Relational Mapping (mapping objet-relationnel)',
        'PDF' => 'Portable Document Format',
        'PHP' => 'PHP: Hypertext Preprocessor',
        'QR' => 'Quick Response (code-barres bidimensionnel)',
        'RG' => 'Règle de gestion',
        'SGBD' => 'Système de Gestion de Base de Données',
        'SGBDR' => 'Système de Gestion de Base de Données Relationnelle',
        'SPA' => 'Single Page Application (application web mono-page)',
        'SQL' => 'Structured Query Language',
        'TIC' => 'Technologies de l’Information et de la Communication',
        'UI' => 'User Interface (interface utilisateur)',
        'UX' => 'User Experience (expérience utilisateur)',
    ];

    $rows = [];
    foreach (WordDoc::alphaSort($abbr) as $sigle => $definition) {
        $rows[] = [$sigle, $definition];
    }
    // Corps 9 pt : la nomenclature tient ainsi sur une seule page.
    $d->table(['Sigle', 'Signification'], $rows, [3.2, 12.8], null, '9');

    // Fin des pages liminaires : la numérotation redémarre à 1 dans la partie rédigée.
    $d->sectionBreak(['footer' => 'footer2.xml', 'numFmt' => 'upperRoman', 'start' => 1]);

    /* ---------------------------------------------------------------- */
    /* INTRODUCTION GÉNÉRALE                                             */
    /* ---------------------------------------------------------------- */

    $d->p('INTRODUCTION GÉNÉRALE', 'Heading2', ['pageBreakBefore' => false]);

    $d->p('Dans toute organisation, le parc informatique représente à la fois un investissement financier important et un outil de travail quotidien. Ordinateurs, serveurs, imprimantes, équipements réseau et logiciels conditionnent le fonctionnement des services : dès qu’un matériel est mal inventorié, mal affecté ou mal suivi, ce sont les activités de l’établissement tout entier qui ralentissent. La gestion du parc informatique est donc devenue un enjeu de gouvernance, de sécurité et de maîtrise des coûts.');
    $d->p('La Direction Générale de la Sécurité Routière (DGSR) n’échappe pas à cette réalité. Son parc informatique est réparti entre le siège et les structures déconcentrées (centres de réception technique, CENSERO), entre plusieurs directions et services, et entre des agents qui changent de poste, de bureau ou d’affectation. Le suivi de ce parc repose encore largement sur des fichiers tableurs, des registres papier et des échanges de courriels : les informations sont dispersées, parfois contradictoires, et il est difficile de savoir avec certitude quel matériel est en service, en stock, en maintenance ou réformé, ni à quel agent il est affecté.');
    $d->p('C’est dans ce contexte que s’inscrit mon stage de deuxième année de Licence Professionnelle, effectué au sein du Service Informatique de la DGSR. L’objectif principal est la conception et le développement d’une application web intranet de **gestion du parc informatique (GPI)**. Cette plateforme doit centraliser l’inventaire des équipements, suivre leurs affectations et leurs mouvements, organiser les maintenances et les tickets d’assistance, gérer les achats et les fournisseurs, recenser les logiciels et leurs licences, et produire des rapports et des exports PDF destinés aux responsables.');
    $d->p('Pour répondre aux exigences fonctionnelles et techniques du projet, j’ai mis en œuvre une architecture web moderne et complémentaire :');
    $d->bullets([
        '**Laravel**, framework PHP, pour la partie serveur : il expose une API REST, gère l’authentification, les rôles et les règles de gestion, et s’appuie sur l’ORM Eloquent pour dialoguer avec la base de données.',
        '**React**, bibliothèque JavaScript, pour la partie cliente : elle fournit une interface réactive et ergonomique, organisée en pages et en composants réutilisables.',
        '**MySQL**, système de gestion de base de données relationnelle, choisi pour sa fiabilité, sa simplicité d’administration et son intégration naturelle avec l’écosystème PHP.',
        '**Vite** et **Tailwind CSS** pour la compilation des assets et la mise en forme de l’interface, **Git** pour le suivi des versions et **Visual Studio Code** comme environnement de développement.',
    ]);
    $d->p('Ce rapport retrace les différentes étapes de la conception de cette plateforme, depuis l’analyse des besoins jusqu’à la mise en œuvre technique, en passant par les choix technologiques, les contraintes rencontrées et les solutions apportées.');
    $d->p('Il est organisé en trois parties. La **première partie** présente le cadre du stage : l’ENI, la DGSR et la description du projet. La **deuxième partie** expose l’analyse de l’existant et la conception du système selon la méthode MERISE (dictionnaire des données, règles de gestion, diagrammes de flux, MCD, MLD, MCT et MOT). La **troisième partie** détaille la réalisation : mise en place de l’environnement, architecture de l’application, développement, présentation des interfaces, tests et perspectives.');
};
