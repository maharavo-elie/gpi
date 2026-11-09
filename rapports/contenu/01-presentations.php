<?php

/**
 * PARTIE I — PRÉSENTATIONS (chapitres 1 à 3).
 */
return function (WordDoc $d): void {
    $d->part('PARTIE I. PRÉSENTATIONS');
    $d->p('Cette première partie situe le cadre du stage. Elle présente successivement l’établissement de formation, l’École Nationale d’Informatique, l’organisme d’accueil, la Direction Générale de la Sécurité Routière, puis le projet lui-même : son origine, ses objectifs, ses moyens et ses résultats attendus.', 'Corps');

    /* ================================================================ */
    /* CHAPITRE 1 — L'ENI                                                */
    /* ================================================================ */

    $d->h1('Chapitre 1. Présentation de l’ENI');

    $d->p('L’ENI, connue sous le nom d’École Nationale d’Informatique, est située au cœur de Fianarantsoa. C’est un établissement public où l’on forme des techniciens supérieurs, des licenciés et des ingénieurs dans le domaine de l’informatique.');

    $d->h2('1.1. Informations d’ordre général');
    $d->p('L’École Nationale d’Informatique est un établissement d’enseignement supérieur rattaché académiquement et administrativement à l’Université de Fianarantsoa. Elle siège à Tanambao – Antaninarenina, à Fianarantsoa. Les coordonnées pour une prise de contact avec l’école sont les suivantes :');
    $d->bullets([
        'Antaninarenina Tanambao, BP 1487 Fianarantsoa (301) ;',
        'Téléphone : +261 34 05 733 36 ou +261 33 42 302 02 ;',
        'Messagerie : eni@eni-univ-fianar.mg ;',
        'Site web : www.eni-univ-fianar.mg.',
    ]);

    $d->h2('1.2. Missions et historique');
    $d->p('L’ENI se positionne sur l’échiquier socio-éducatif malgache comme le principal secteur de diffusion et de vulgarisation des connaissances et des technologies informatiques. Cette école supérieure peut être considérée aujourd’hui comme la vitrine et la pépinière des élites informaticiennes du pays.');
    $d->p('De façon formelle, l’ENI a été créée par le décret n° 83-185 du 24 mai 1983, comme étant le seul établissement universitaire professionnalisé au niveau national, destiné à former des techniciens et des ingénieurs de haut niveau, aptes à répondre aux besoins et aux exigences d’informatisation des entreprises, des sociétés et des organes implantés à Madagascar.');
    $d->p('L’ENI a par conséquent pour mission de former des spécialistes informaticiens compétents et opérationnels de différents niveaux, notamment :');
    $d->bullets([
        'en fournissant aux étudiants des connaissances de base en informatique ;',
        'en leur transmettant le savoir-faire requis, à travers la professionnalisation des formations dispensées et une meilleure adéquation entre les formations et les besoins évolutifs des sociétés et des entreprises ;',
        'en initiant les étudiants aux activités de recherche dans les différents domaines des Technologies de l’Information et de la Communication (TIC).',
    ]);
    $d->p('La filière de formation d’analystes programmeurs a été mise en place à l’école en 1983, puis gelée en 1996, tandis que la filière de formation d’ingénieurs a été ouverte en 1986.');
    $d->p('Une formation de troisième cycle a été ouverte à l’école depuis l’année 2003-2004, grâce à la coopération académique et scientifique entre l’Université de Fianarantsoa, pour le compte de l’ENI, et l’Université Paul Sabatier de Toulouse (UPST). Cette filière avait pour objectif de former certains étudiants à la recherche dans les différents domaines de l’informatique, et notamment de préparer la relève des enseignants-chercheurs en poste.');
    $d->p('Pendant l’année 2007-2008, la formation en vue de l’obtention du diplôme de Licence Professionnelle en Informatique a été mise en place à l’ENI avec deux parcours : Génie Logiciel et Bases de Données, d’une part, Administration des Systèmes et Réseaux, d’autre part. La mise en place de ces deux options devait répondre au besoin de basculement vers le système Licence – Master – Doctorat (LMD).');
    $d->p('En vue de surmonter les difficultés liées à la limitation de l’effectif des étudiants accueillis, notamment à cause du manque d’infrastructures, un système de « formation hybride » a été mis en place à partir de l’année 2010. Il s’agit d’un système de formation semi-présentielle et à distance avec l’utilisation de la visioconférence. Ce système a été créé à Fianarantsoa ainsi qu’à l’Université de Toliara ; il est à l’origine du parcours Informatique Générale.');
    $d->p('En 2023, la mention Intelligence Artificielle (IA) a été ouverte au sein de l’école pour répondre aux besoins des entreprises. La formation est destinée aux étudiants titulaires d’une licence (Bac + 3) en mathématiques, en statistiques ou en informatique. La mention IA comporte deux parcours : Gouvernance et Ingénierie de Données (GID) et Objets Connectés et Cybersécurité (OCC).');
    $d->p('Depuis l’année universitaire 2024-2025, la mention Expertise Digitale est officiellement ouverte au grand public. Elle propose deux parcours distincts : Métiers du Digital (MDi), disponible aux niveaux Licence et Master, et Audit des Systèmes d’Information (ASI), proposé au niveau Master uniquement. Le système d’enseignement adopté pour cette mention est un système en ligne : les cours et ressources pédagogiques sont accessibles en permanence via la plateforme Moodle, et des regroupements en présentiel ou en ligne sont organisés périodiquement.');

    $d->h2('1.3. Organigramme institutionnel');
    $d->p('Cet organigramme de l’école s’inspire des dispositions du décret n° 83-185 du 24 mai 1983. L’ENI est administrée par un conseil d’école et dirigée par un directeur nommé par décret adopté en Conseil des ministres. Le Collège des enseignants, qui regroupe tous les enseignants-chercheurs permanents de l’école, est chargé de résoudre les problèmes liés à l’organisation pédagogique des enseignements. Le Conseil scientifique propose les orientations pédagogiques et scientifiques de l’établissement, en tenant compte de l’évolution du marché du travail et de l’adéquation des formations dispensées avec les besoins des entreprises.');
    $d->table(
        ['Organe', 'Rôle principal'],
        [
            ['Conseil d’école', 'Orientation générale, validation des décisions statutaires et budgétaires de l’établissement.'],
            ['Directeur', 'Direction exécutive de l’école, nomination par décret en Conseil des ministres, représentation auprès des tutelles.'],
            ['Conseil scientifique', 'Orientations pédagogiques et scientifiques, adéquation des formations avec le marché du travail.'],
            ['Collège des enseignants', 'Organisation pédagogique des enseignements, délibérations et suivi des étudiants.'],
            ['Responsables de mentions et de parcours', 'Pilotage des programmes, coordination des équipes pédagogiques et suivi des stages.'],
            ['Services administratifs', 'Scolarité, ressources humaines, finances, informatique et logistique.'],
        ],
        [5.0, 11.0],
        'Organes de gouvernance de l’ENI'
    );

    $d->h2('1.4. Domaines de spécialisation');
    $d->p('Les activités de formation et de recherche organisées à l’ENI portent sur les domaines suivants :');
    $d->bullets([
        'Génie Logiciel et Bases de Données (GB) ;',
        'Administration des Systèmes et Réseaux (ASR) ;',
        'Informatique Générale (IG) ;',
        'Modélisation informatique et mathématique des systèmes complexes ;',
        'Intelligence Artificielle (IA).',
    ]);
    $d->p('Le système de formation pédagogique de l’école articule étroitement la théorie et la pratique, comme le montre le tableau suivant.');
    $d->table(
        ['Formation théorique', 'Formation pratique'],
        [
            ['Enseignement théorique', 'Études de cas'],
            ['Travaux dirigés', 'Travaux de réalisation'],
            ['Travaux pratiques', 'Projets et projets tutorés'],
            ['Conférences', 'Voyages d’études'],
            ['—', 'Stage en entreprise'],
        ],
        [8.0, 8.0],
        'Organisation du système de formation'
    );

    $d->h2('1.5. Architecture des formations pédagogiques');
    $d->p('Le recrutement des étudiants à l’ENI se fait uniquement par voie de concours d’envergure nationale en première année. Les offres de formation organisées par l’école ont été validées par la Commission Nationale d’Habilitation (CNH). Au sein de l’ENI, il existe plusieurs mentions et plusieurs parcours, récapitulés dans le tableau ci-dessous.');
    $d->table(
        ['Mention', 'Parcours'],
        [
            ['Informatique', 'Génie Logiciel et Bases de Données (GB)'],
            ['Informatique', 'Administration des Systèmes et Réseaux (ASR)'],
            ['Informatique', 'Informatique Générale (IG)'],
            ['Intelligence Artificielle', 'Gouvernance et Ingénierie de Données (GID)'],
            ['Intelligence Artificielle', 'Objets Connectés et Cybersécurité (OCC)'],
            ['Expertise Digitale', 'Métiers du Digital (MDi)'],
            ['Expertise Digitale', 'Audit des Systèmes d’Information (ASI)'],
        ],
        [5.5, 10.5],
        'Mentions et parcours au sein de l’ENI'
    );
    $d->p('La licence peut avoir une vocation générale ou professionnelle. Le master peut avoir une vocation professionnelle ou de recherche. L’accès en première année de master est automatique pour les étudiants de l’école qui ont obtenu le diplôme de Licence Professionnelle.');
    $d->table(
        ['Critère', 'Licence professionnelle', 'Master'],
        [
            ['Condition d’admission', 'Voie de concours', 'Voie de concours pour la mention IA'],
            ['Condition d’accès', 'Baccalauréat série C, D ou Technique', 'Être titulaire d’une licence professionnelle'],
            ['Durée de formation', '3 ans', '2 ans'],
            ['Diplôme délivré', 'Diplôme de Licence Professionnelle', 'Master Professionnel ou Master Recherche'],
        ],
        [4.2, 6.0, 5.8],
        'Liste des formations existantes à l’ENI'
    );
    $d->p('Le Master Recherche permet à son titulaire de poursuivre directement des études en doctorat et de s’inscrire dans une école doctorale. Les étudiants diplômés de l’école sont plutôt bien accueillis dans les instituts universitaires étrangers (Canada, Suisse, France).');

    $d->h2('1.6. Relations de l’ENI avec les organismes externes');
    $d->p('Les stages effectués chaque année par les étudiants mettent l’école en rapport permanent avec plus de 400 entreprises et organismes publics, semi-publics et privés, nationaux et internationaux. L’école dispose ainsi d’un réseau d’entreprises, de sociétés et d’organismes qui sont des partenaires pour l’accueil en stage de ses étudiants, et éventuellement pour le recrutement après l’obtention des diplômes.');
    $d->p('Les compétences que l’école cherche à développer chez ses étudiants sont l’adaptabilité, le sens de la responsabilité, le travail en équipe, le goût de l’expérimentation et l’innovation. La vocation de l’ENI est de former des licenciés et des ingénieurs de niveau master avec des qualités scientifiques, techniques et humaines reconnues, capables d’évoluer professionnellement dans des secteurs d’activité variés intégrant l’informatique. Les stages en milieu professionnel permettent de favoriser une meilleure adéquation entre les formations de l’école et les besoins évolutifs du marché de l’emploi.');
    $d->p('Parmi les partenaires de l’école, on peut citer : ACCENTURE Mauritius, Air Madagascar, Airtel, Agence Universitaire de la Francophonie (AUF), AXIAN, Banque Centrale, BIANCO, BlueLine, CNaPS, Bureau National de Gestion des Risques et des Catastrophes (BNGRC), Data Consulting, COLAS, Direction Générale des Douanes, FID, FTM, GNOSYS, INGENOSIA, INSTAT, JIRAMA, MADADEV, Ministère des Postes et Télécommunications, Orange, QMM Fort-Dauphin, Sénat, SOFTWELL, TELMA, WWF, entre autres.');

    $d->h2('1.7. Débouchés professionnels');
    $d->p('Les formations proposées par l’école permettent aux diplômés d’être immédiatement opérationnels sur le marché du travail, avec la connaissance d’un métier complet lié à l’informatique et aux TIC. L’école apporte à ses étudiants un savoir-faire et un savoir-être qui les accompagnent tout au long de leur vie professionnelle. Les diplômés de licence et de master issus de l’ENI peuvent faire carrière dans différents secteurs, comme le résume le tableau suivant.');
    $d->table(
        ['Mention', 'Débouchés professionnels'],
        [
            ['Informatique (GB)', 'Développeur logiciel ou full-stack, ingénieur en développement d’applications (desktop, web, mobile), architecte logiciel, développeur d’API, administrateur de bases de données, data engineer, analyste programmeur, analyste fonctionnel, chef de projet informatique, ingénieur QA, consultant fonctionnel.'],
            ['Informatique (ASR)', 'Administrateur systèmes et réseaux, ingénieur systèmes et réseaux, administrateur cloud, ingénieur virtualisation, ingénieur cybersécurité, analyste SOC, technicien support, architecte réseaux, ingénieur DevOps, administrateur Kubernetes et Docker.'],
            ['Intelligence Artificielle (GID)', 'Développeur IA, data scientist, consultant IA, data analyst, chef de produit, consultant en gouvernance des données.'],
            ['Intelligence Artificielle (OCC)', 'Analyste et ingénieur en cybersécurité, spécialiste en réponse aux incidents, architecte de sécurité, ingénieur IoT, développeur IoT, auditeur en cybersécurité.'],
            ['Expertise Digitale (MDi)', 'Spécialiste en marketing digital, gestionnaire de contenu web, analyste UX/UI, chef de projet digital, stratège en médias sociaux, consultant en transformation digitale.'],
            ['Expertise Digitale (ASI)', 'Auditeur des systèmes d’information, consultant en sécurité des SI, analyste de risques IT, responsable de la conformité IT, expert en gouvernance IT.'],
        ],
        [4.6, 11.4],
        'Débouchés éventuels des jeunes diplômés'
    );

    $d->h2('1.8. Ressources humaines');
    $d->p('Les ressources humaines de l’école sont organisées selon les responsabilités suivantes :');
    $d->bullets([
        '**Directeur de l’école** : Monsieur MAHATODY Thomas, Docteur HDR ;',
        '**Responsable de la mention « Informatique »** : Monsieur RABETAFIKA Louis Haja, Maître de conférences ;',
        '**Responsable de la mention « Intelligence Artificielle »** : Monsieur DIMBISOA William Germain, Maître de conférences ;',
        '**Responsable du parcours « Génie Logiciel et Bases de Données »** : Monsieur RALAIVAO Jean Christian ;',
        '**Responsable du parcours « Administration Systèmes et Réseaux »** : Monsieur SIAKA ;',
        '**Responsable du parcours « Informatique Générale »** : Monsieur GILANTE Gesazafy ;',
        '**Responsable du parcours « Gouvernance et Ingénierie de Données »** : Madame RATIANANTITRA Volatiana Marielle, Maître de conférences ;',
        '**Responsable du parcours « Objets Connectés et Cybersécurité »** : Monsieur RAZAFIMAHATRATRA Hajarisena, Maître de conférences.',
    ]);
    $d->p('L’ENI compte quinze enseignants permanents, dont un professeur titulaire, un professeur, un docteur HDR et huit maîtres de conférences, quatre assistants d’enseignement supérieur et de recherche, dix enseignants vacataires et quarante-et-un personnels administratifs.');

    /* ================================================================ */
    /* CHAPITRE 2 — LA DGSR                                              */
    /* ================================================================ */

    $d->h1('Chapitre 2. Présentation de la DGSR');

    $d->h2('2.1. Statut et missions');
    $d->p('La Direction Générale de la Sécurité Routière (DGSR) est l’administration chargée de la mise en œuvre de la politique nationale de sécurité routière. Placée sous la tutelle du Ministère des Transports et de la Météorologie, elle exerce ses missions sur l’ensemble du territoire et s’appuie sur des structures déconcentrées, notamment les centres de réception technique (CRT) et le Centre National de Sécurité Routière (CENSERO).');
    $d->p('Ses missions s’articulent autour de plusieurs axes :');
    $d->bullets([
        'la **réglementation et le contrôle** des véhicules, par la réception technique et la vérification de leur conformité ;',
        'la **délivrance des titres** liés à la circulation et à la conduite, dans le respect des procédures réglementaires ;',
        'la **prévention et la sensibilisation** des usagers de la route, en partenariat avec les autres acteurs de la sécurité routière ;',
        'l’**exploitation des données** d’accidentalité et de contrôle, afin d’orienter les décisions publiques ;',
        'la **modernisation des services**, par la digitalisation des procédures et la fiabilisation des systèmes d’information.',
    ]);
    $d->p('La devise de l’institution, « Lahitokana ny Aina », rappelle que la sécurité routière est d’abord une affaire de preservation de la vie humaine. Cette exigence se traduit, au quotidien, par la rigueur attendue dans la tenue des dossiers, la traçabilité des opérations et la disponibilité des outils de travail.');

    $d->h2('2.2. Organisation administrative');
    $d->p('La DGSR est structurée en directions et en services, eux-mêmes relayés par les structures territoriales. Le siège coordonne l’ensemble des activités, tandis que les CRT assurent la réception technique des véhicules dans les régions et que le CENSERO intervient sur les actions de sécurité routière. Le tableau suivant présente l’organisation telle qu’elle est enregistrée dans l’application GPI.');
    $d->table(
        ['Direction', 'Code', 'Services rattachés', 'Attributions'],
        [
            ['Direction Générale', 'DG', 'Service Informatique, Secrétariat Central', 'Pilotage, coordination et représentation de l’établissement.'],
            ['Direction Technique', 'DT', 'Service Planification et Études, Service Sécurité', 'Systèmes d’information, réception technique et immatriculation.'],
            ['Direction des Opérations Routières', 'DOR', 'CRT Antananarivo, CRT Mahajanga, CENSERO Antananarivo', 'Centres de réception technique et opérations de sécurité routière.'],
            ['Direction Administrative et Financière', 'DAF', 'Service Ressources Humaines, Service Finances et Budget', 'Ressources humaines, finances et logistique.'],
        ],
        [4.4, 1.6, 5.4, 4.6],
        'Directions et services de la DGSR'
    );
    $d->p('Cette organisation explique la complexité du parc informatique à gérer : les équipements sont répartis entre le siège et les structures territoriales, les agents changent de service ou de direction, et les matériels circulent entre les sites. Une application centralisée devient dès lors indispensable pour conserver une vision fiable de l’affectation de chaque bien.');

    $d->h2('2.3. Organigramme fonctionnel');
    $d->p('L’organigramme fonctionnel met en évidence les relations hiérarchiques et les responsabilités de chaque entité. La Direction Générale impulse la politique de l’établissement ; les directions techniques et opérationnelles mettent en œuvre les activités ; la Direction Administrative et Financière assure les moyens humains, financiers et matériels ; le Service Informatique, rattaché à la Direction Générale, intervient en support transversal.');
    $d->table(
        ['Niveau', 'Entité', 'Responsabilité principale'],
        [
            ['1', 'Direction Générale', 'Définit les orientations, représente l’établissement, contrôle l’exécution des missions.'],
            ['2', 'Direction Technique', 'Assure la réception technique, l’immatriculation et les systèmes d’information métier.'],
            ['2', 'Direction des Opérations Routières', 'Pilote les CRT et le CENSERO, organise les opérations de contrôle et de prévention.'],
            ['2', 'Direction Administrative et Financière', 'Gère les ressources humaines, le budget, les achats et la logistique.'],
            ['3', 'Service Informatique', 'Administre le réseau, le parc informatique, les applications et la sécurité des systèmes.'],
            ['3', 'Services et structures territoriales', 'Exécutent les activités opérationnelles et utilisent les outils mis à disposition.'],
        ],
        [1.6, 6.0, 8.4],
        'Organigramme fonctionnel de la DGSR'
    );

    $d->h2('2.4. Valeurs et engagements');
    $d->p('L’action de la DGSR s’appuie sur un ensemble de valeurs qui structurent également le fonctionnement de son service informatique :');
    $d->bullets([
        '**Sécurité** : protéger les usagers, les agents et les données de l’établissement ;',
        '**Intégrité** : garantir la sincérité des informations et la traçabilité des opérations ;',
        '**Service public** : assurer la continuité et l’accessibilité des services rendus aux citoyens ;',
        '**Rigueur** : appliquer les procédures et contrôler la qualité des données ;',
        '**Innovation** : moderniser les outils et les pratiques pour gagner en efficacité.',
    ]);

    $d->h2('2.5. Le Service Informatique');
    $d->p('Le Service Informatique assure l’administration du réseau local, la gestion du parc, le support aux utilisateurs et la maintenance des applications métier. Il est l’interlocuteur direct du stage. Ses missions quotidiennes ont permis d’identifier précisément les besoins auxquels l’application GPI devait répondre :');
    $d->bullets([
        'inventorier les équipements et connaître leur localisation exacte ;',
        'savoir à quel agent chaque matériel est affecté et depuis quelle date ;',
        'suivre les maintenances, les pannes et les demandes d’assistance ;',
        'conserver l’historique des achats, des fournisseurs et des garanties ;',
        'recenser les logiciels installés et surveiller les licences ;',
        'produire rapidement des états, des rapports et des documents officiels.',
    ]);

    /* ================================================================ */
    /* CHAPITRE 3 — DESCRIPTION DU PROJET                                */
    /* ================================================================ */

    $d->h1('Chapitre 3. Description du projet');

    $d->h2('3.1. Formulation');
    $d->p('La gestion du parc informatique de la DGSR s’effectue encore en grande partie de manière manuelle : fichiers Excel tenus séparément par les services, registres de sortie de matériel, courriels pour signaler une panne, et connaissance informelle des affectations. Ce mode de fonctionnement entraîne des erreurs, des retards de traitement et une difficulté à suivre correctement l’état du parc. L’établissement a donc besoin d’une solution numérique permettant d’automatiser l’enregistrement des équipements, de centraliser les informations d’affectation et de permettre au responsable informatique de suivre facilement chaque matériel. Une application web intranet répond à ce besoin en offrant un système plus rapide, plus précis et plus simple à utiliser.');

    $d->h2('3.2. Objectif et besoins des utilisateurs');
    $d->p('L’objectif du projet est de concevoir une application web de gestion du parc informatique permettant d’automatiser l’inventaire, de réduire les erreurs liées au suivi manuel et de faciliter l’accès aux données pour les responsables et l’administration. L’application est accessible depuis le réseau local de l’établissement, ce qui garantit la confidentialité des informations et un déploiement sans dépendance à Internet.');
    $d->p('Pour répondre aux besoins des utilisateurs, l’application doit :');
    $d->bullets([
        'permettre au service informatique d’enregistrer, de modifier et de consulter les équipements ;',
        'centraliser et sécuriser les données du parc (caractéristiques, prix, garanties, localisation) ;',
        'suivre les affectations et les restitutions de matériel auprès des agents ;',
        'organiser les maintenances et les tickets d’assistance, avec un historique ;',
        'gérer les achats, les fournisseurs et les licences logicielles ;',
        'offrir une consultation rapide de l’état du parc et des indicateurs clés ;',
        'générer des rapports et des exports PDF destinés à la hiérarchie ;',
        'distinguer les droits d’accès selon le rôle de chaque utilisateur.',
    ]);

    $d->h2('3.3. Moyens nécessaires à la réalisation du projet');

    $d->h3('3.3.1. Moyens humains');
    $d->p('Le projet a mobilisé les compétences de plusieurs intervenants au sein de l’établissement : mon encadreur professionnel, responsable du Service Informatique, qui a défini les besoins et validé les choix fonctionnels ; les agents du service, qui ont participé aux tests et apporté des retours sur l’ergonomie ; les responsables administratifs, qui ont précisé les attentes en matière de rapports et de traçabilité. Mon encadreur pédagogique a assuré le suivi méthodologique et la relecture du rapport.');

    $d->h3('3.3.2. Moyens matériels');
    $d->p('Le développement a été réalisé sur un ordinateur portable équipé d’un processeur Intel Core i5, de 16 Go de mémoire vive et d’un disque SSD de 512 Go. Le serveur de test est un poste du réseau local de l’établissement, utilisé pour valider le fonctionnement en mode intranet. Les caractéristiques du poste de développement sont résumées ci-dessous.');
    $d->table(
        ['Élément', 'Caractéristique'],
        [
            ['Processeur', 'Intel Core i5 (4 cœurs, 2,4 GHz)'],
            ['Mémoire vive', '16 Go DDR4'],
            ['Stockage', 'SSD NVMe 512 Go'],
            ['Système d’exploitation', 'Windows 11 Professionnel 64 bits'],
            ['Réseau', 'Connexion Ethernet et Wi-Fi au réseau local de l’établissement'],
            ['Serveur de test', 'Poste fixe du Service Informatique, accessible par son adresse IP locale'],
        ],
        [5.5, 10.5],
        'Caractéristiques du poste de développement'
    );

    $d->h3('3.3.3. Moyens logiciels');
    $d->p('Les logiciels utilisés pour réaliser les différentes tâches du projet sont récapitulés dans le tableau suivant. Les versions indiquées sont celles qui ont servi au développement et aux tests.');
    $d->table(
        ['Logiciel', 'Version', 'Usage'],
        [
            ['Visual Studio Code', '1.10x', 'Éditeur de code et terminal intégré'],
            ['PHP', '8.4.15', 'Langage serveur'],
            ['Laravel', '13.32', 'Framework PHP (API REST, ORM, sécurité)'],
            ['Composer', '2.10.3', 'Gestionnaire de dépendances PHP'],
            ['MySQL', '8.4.7', 'Système de gestion de base de données'],
            ['phpMyAdmin', '5.2.3', 'Administration de la base de données'],
            ['Node.js', '26.12.0', 'Environnement JavaScript pour la compilation'],
            ['npm', '11.20.0', 'Gestionnaire de paquets JavaScript'],
            ['React', '19.3', 'Bibliothèque de l’interface utilisateur'],
            ['Vite', '8.0', 'Serveur de développement et compilation des assets'],
            ['Tailwind CSS', '4.0', 'Mise en forme de l’interface'],
            ['Git', '2.56', 'Gestion de versions'],
            ['WampServer', '3.4', 'Environnement serveur local (Apache, PHP, MySQL)'],
        ],
        [4.6, 3.0, 8.4],
        'Logiciels utilisés et versions'
    );
    $d->p('Le serveur local WampServer fournit Apache, PHP et MySQL sur le poste de développement. Laravel est installé à l’aide de Composer, tandis que React, Vite et Tailwind CSS sont installés avec npm. L’ensemble est versionné avec Git, ce qui permet de revenir sur une modification et de suivre l’évolution du projet.');

    $d->h2('3.4. Résultats attendus');
    $d->p('À la fin de la conception de la plateforme, il doit être facile pour chaque acteur de consulter les informations dont il a besoin et de réaliser ses tâches sans recourir à des fichiers dispersés. Les résultats attendus peuvent être présentés par profil d’utilisateur.');
    $d->table(
        ['Profil', 'Résultats attendus'],
        [
            ['Administrateur', 'Accès complet au système : gestion des comptes, des rôles, des référentiels et du parc ; consultation des journaux d’activité ; suppression et restauration des éléments depuis la corbeille.'],
            ['Gestionnaire de parc', 'Création et modification des équipements, des agents, des affectations, des achats et des fournisseurs ; production des rapports et des exports PDF.'],
            ['Technicien', 'Traitement des tickets et des maintenances ; enregistrement des installations et désinstallations de logiciels ; commentaires sur les tickets.'],
            ['Utilisateur', 'Consultation du parc et des fiches équipement ; déclaration d’un ticket d’assistance ; consultation de son profil.'],
            ['Responsable / direction', 'Vue consolidée du parc : nombre d’équipements, valeur totale, répartition par direction et par statut, tickets ouverts, maintenances en cours, garanties proches de l’échéance.'],
        ],
        [4.2, 11.8],
        'Résultats attendus par profil d’utilisateur'
    );
    $d->p('Au-delà de ces résultats fonctionnels, le projet doit permettre de réduire le temps de recherche d’une information, d’éviter les doubles saisies et de disposer d’un historique fiable des mouvements de matériel.');

    $d->h2('3.5. Chronogramme de travail');
    $d->p('Le diagramme de Gantt ci-dessous représente le chronogramme de travail durant lequel la plateforme a été conçue et développée. Le stage s’est déroulé sur treize semaines, avec des phases qui se chevauchent partiellement afin de tester les modules au fur et à mesure de leur réalisation.');
    $weeks = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13'];
    $planning = [
        ['Phase 1. Analyse des besoins et conception du système', [1, 3]],
        ['Phase 2. Installation de l’environnement et création de la base de données', [3, 5]],
        ['Phase 3. Développement de l’API et des modules métier', [5, 9]],
        ['Phase 4. Développement de l’interface React', [7, 10]],
        ['Phase 5. Tests, corrections et sécurisation', [10, 12]],
        ['Phase 6. Rédaction du rapport et documentation', [11, 13]],
    ];
    $gantt = [];
    foreach ($planning as [$label, [$from, $to]]) {
        $row = [$label];
        for ($i = 1; $i <= 13; $i++) {
            $row[] = ($i >= $from && $i <= $to) ? 'X' : '';
        }
        $gantt[] = $row;
    }
    $d->table(
        array_merge(['Activités'], $weeks),
        $gantt,
        array_merge([5.6], array_fill(0, 13, 0.8)),
        'Diagramme de Gantt du travail pendant treize semaines',
        '8'
    );
    $d->p('Les phases 1 et 2 ont permis de cadrer le besoin et de préparer les outils. Les phases 3 et 4, menées en parallèle, ont constitué le cœur du développement : l’API a été construite module par module, puis consommée par l’interface. La phase 5 a servi à valider les règles de gestion et à corriger les anomalies détectées lors des tests. Enfin, la phase 6 a été consacrée à la rédaction du présent rapport et à la documentation du code.');
};
