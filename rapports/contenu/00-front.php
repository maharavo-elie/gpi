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
    $d->p('Membre du jury :', 'CouvertureTexte');
    $d->p('Rapporteurs :', 'CouvertureTexte');
    $d->p('- ...................................................', 'CouvertureTexte');
    $d->p('- ...................................................', 'CouvertureTexte', ['spacing' => 360]);
    $d->p('Année universitaire 2025 - 2026', 'CouvertureNom');

    /* ---------------------------------------------------------------- */
    /* CURRICULUM VITAE                                                  */
    /* ---------------------------------------------------------------- */

    $d->pageBreak();
    $d->p('CURRICULUM VITAE', 'Titre1', ['pageBreakBefore' => false]);
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

    $d->h1('SOMMAIRE');
    $d->p('Le présent rapport est organisé en trois parties, elles-mêmes subdivisées en chapitres.', 'Corps');

    $d->p('**Curriculum vitae**', 'Sommaire');
    $d->p('**Sommaire**', 'Sommaire');
    $d->p('**Remerciements**', 'Sommaire');
    $d->p('**Liste des figures**', 'Sommaire');
    $d->p('**Liste des tableaux**', 'Sommaire');
    $d->p('**Liste des abréviations**', 'Sommaire');
    $d->p('**Introduction générale**', 'Sommaire');

    $d->p('**PARTIE I. PRÉSENTATIONS**', 'Sommaire');
    $d->p('Chapitre 1. Présentation de l’ENI', 'Sommaire2');
    $d->p('Chapitre 2. Présentation de la DGSR', 'Sommaire2');
    $d->p('Chapitre 3. Description du projet', 'Sommaire2');

    $d->p('**PARTIE II. ANALYSE ET CONCEPTION**', 'Sommaire');
    $d->p('Chapitre 4. Analyse préalable', 'Sommaire2');
    $d->p('Chapitre 5. Analyse conceptuelle', 'Sommaire2');

    $d->p('**PARTIE III. RÉALISATION**', 'Sommaire');
    $d->p('Chapitre 6. Mise en place de l’environnement de développement', 'Sommaire2');
    $d->p('Chapitre 7. Développement de l’application', 'Sommaire2');

    $d->p('**Conclusion générale**', 'Sommaire');
    $d->p('**Bibliographie**', 'Sommaire');
    $d->p('**Webographie**', 'Sommaire');
    $d->p('**Glossaire**', 'Sommaire');
    $d->p('**Table des matières**', 'Sommaire');
    $d->p('**Résumé**', 'Sommaire');
    $d->p('**Abstract**', 'Sommaire');

    /* ---------------------------------------------------------------- */
    /* REMERCIEMENTS                                                     */
    /* ---------------------------------------------------------------- */

    $d->h1('REMERCIEMENTS');

    $d->p('Avant de commencer, je remercie Dieu tout-puissant, sans qui rien de tout cela n’aurait été possible. Je souhaite également exprimer ma profonde gratitude :');
    $d->bullets([
        'À **Monsieur HAJALALAINA Aimé Richard**, Professeur et Président de l’Université de Fianarantsoa, pour son engagement en faveur de l’excellence académique et son soutien aux étudiants.',
        'À **Monsieur ANDRIAMANANTENA Razafiharison**, Président de l’Université de Toliara, pour avoir accordé l’intégration de l’ENI au sein de l’université de Toliara.',
        'Au **Docteur MAHATODY Thomas**, Directeur de l’École Nationale d’Informatique de Fianarantsoa, pour la qualité de la formation dispensée et son attention aux conditions de stage des étudiants.',
        'À **Monsieur RABETAFIKA Louis Haja**, Maître de Conférences et responsable de la mention Informatique, pour ses conseils méthodologiques.',
        'À **Monsieur GILANTE Gesazafy**, responsable du parcours Informatique Générale, pour son accompagnement tout au long de l’année.',
        'À **Monsieur RAZAFINDRAMONJA Herinantenaina Clément Aubert**, Assistant d’Enseignement Supérieur et de Recherche à l’ENI, pour sa générosité et la qualité de son encadrement pédagogique.',
        'À mon **encadreur pédagogique**, pour ses orientations et ses relectures tout au long de la rédaction de ce rapport.',
        'À **Monsieur RANDRIAMIFIDY Hugues Emmanuel**, Directeur Général de l’École Nationale d’Enseignement de l’Aéronautique et de la Météorologie, pour m’avoir accueilli dans son établissement.',
        'À **Monsieur RABENJARISOA Tantelinirina**, responsable informatique et mon encadreur professionnel, pour m’avoir guidé dans la réalisation du projet, pour sa disponibilité et pour la confiance qu’il m’a accordée.',
        'À l’ensemble du **Service Informatique de la DGSR**, pour son accueil, ses explications sur l’organisation du parc et sa participation aux tests de l’application.',
        'À tous les **corps enseignants** de l’ENI, pour leur patience et leur engagement malgré leurs charges académiques.',
        'À mes **parents** et à tous mes **proches**, pour leur soutien, financier comme moral, et pour leurs prières.',
    ], false, ['after' => 0]);

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
        'CRT' => 'Centre de Réception Technique',
        'CENSERO' => 'Centre National de Sécurité Routière',
        'CLI' => 'Command Line Interface (interface en ligne de commande)',
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
        'MCT' => 'Modèle Conceptuel des Traitements',
        'MERISE' => 'Méthode d’Étude et de Réalisation Informatique pour les Systèmes d’Entreprise',
        'MLD' => 'Modèle Logique des Données',
        'MOT' => 'Modèle Organisationnel des Traitements',
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
        'RGPD' => 'Règlement Général sur la Protection des Données',
    ];

    $rows = [];
    foreach ($abbr as $sigle => $definition) {
        $rows[] = [$sigle, $definition];
    }
    $d->table(['Sigle', 'Signification'], $rows, [3.2, 12.8]);

    // Fin des pages liminaires : la numérotation redémarre à 1 dans la partie rédigée.
    $d->sectionBreak(['footer' => 'footer2.xml', 'numFmt' => 'lowerRoman', 'start' => 1, 'titlePg' => true]);

    /* ---------------------------------------------------------------- */
    /* INTRODUCTION GÉNÉRALE                                             */
    /* ---------------------------------------------------------------- */

    $d->h1('INTRODUCTION GÉNÉRALE');

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
