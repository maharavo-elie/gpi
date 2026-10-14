-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 21 sep. 2026 à 12:01
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gpi`
--

-- --------------------------------------------------------

--
-- Structure de la table `achats`
--

DROP TABLE IF EXISTS `achats`;
CREATE TABLE IF NOT EXISTS `achats` (
  `id_achat` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_achat` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_achat` date DEFAULT NULL,
  `numero_facture` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bon_commande` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `montant_total` decimal(14,2) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('commande','livre_partiel','livre','annule') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'commande',
  `id_fournisseur` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_achat`),
  UNIQUE KEY `achats_reference_achat_unique` (`reference_achat`),
  KEY `achats_id_fournisseur_foreign` (`id_fournisseur`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `achats`
--

INSERT INTO `achats` (`id_achat`, `reference_achat`, `date_achat`, `numero_facture`, `bon_commande`, `montant_total`, `description`, `statut`, `id_fournisseur`, `created_at`, `updated_at`) VALUES
(1, 'ACH-2025-001', '2025-02-14', 'FAC-2025-0142', 'BC-2025-0031', 24750000.00, 'Acquisition d\'équipements informatiques', 'livre', 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'ACH-2025-002', '2025-05-03', 'FAC-2025-0311', 'BC-2025-0074', 8900000.00, 'Acquisition d\'équipements informatiques', 'livre', 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'ACH-2026-001', '2026-01-20', 'FAC-2026-0102', 'BC-2026-0012', 14300000.00, 'Acquisition d\'équipements informatiques', 'livre', 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'ACH-2026-002', '2026-08-11', 'FAC-2026-0488', 'BC-2026-0144', 5600000.00, 'Acquisition d\'équipements informatiques', 'commande', 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `affectations`
--

DROP TABLE IF EXISTS `affectations`;
CREATE TABLE IF NOT EXISTS `affectations` (
  `id_affectation` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_affectation` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `motif` text COLLATE utf8mb4_unicode_ci,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `id_equipement` bigint UNSIGNED NOT NULL,
  `id_agent` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_affectation`),
  KEY `affectations_id_equipement_foreign` (`id_equipement`),
  KEY `affectations_id_agent_foreign` (`id_agent`),
  KEY `affectations_date_fin_index` (`date_fin`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `affectations`
--

INSERT INTO `affectations` (`id_affectation`, `date_affectation`, `date_fin`, `motif`, `commentaire`, `id_equipement`, `id_agent`, `created_at`, `updated_at`) VALUES
(1, '2026-07-05', NULL, 'Besoin de service', 'Affectation en cours', 1, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(2, '2026-02-11', NULL, 'Besoin de service', 'Affectation en cours', 2, 2, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(3, '2026-08-17', NULL, 'Besoin de service', 'Affectation en cours', 5, 3, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(4, '2025-12-09', NULL, 'Besoin de service', 'Affectation en cours', 7, 4, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(5, '2025-12-08', NULL, 'Besoin de service', 'Affectation en cours', 10, 5, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(6, '2026-06-22', NULL, 'Besoin de service', 'Affectation en cours', 11, 6, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(7, '2026-02-23', NULL, 'Besoin de service', 'Affectation en cours', 12, 7, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(8, '2026-06-09', NULL, 'Besoin de service', 'Affectation en cours', 15, 8, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(9, '2026-02-19', NULL, 'Besoin de service', 'Affectation en cours', 17, 9, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(10, '2025-12-22', NULL, 'Besoin de service', 'Affectation en cours', 20, 10, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(11, '2026-05-27', NULL, 'Besoin de service', 'Affectation en cours', 21, 11, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(12, '2026-05-01', NULL, 'Besoin de service', 'Affectation en cours', 22, 12, '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `agents`
--

DROP TABLE IF EXISTS `agents`;
CREATE TABLE IF NOT EXISTS `agents` (
  `id_agent` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `matricule` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_naiss` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sexe` enum('M','F') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'M',
  `fonction` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_embauche` date DEFAULT NULL,
  `statut` enum('actif','inactif','conge','mutation') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `id_direction` bigint UNSIGNED NOT NULL,
  `id_service` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_agent`),
  UNIQUE KEY `agents_matricule_unique` (`matricule`),
  KEY `agents_id_direction_foreign` (`id_direction`),
  KEY `agents_id_service_foreign` (`id_service`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `agents`
--

INSERT INTO `agents` (`id_agent`, `matricule`, `nom_naiss`, `prenom`, `sexe`, `fonction`, `telephone`, `email`, `date_embauche`, `statut`, `id_direction`, `id_service`, `created_at`, `updated_at`) VALUES
(1, 'AG-2024-001', 'RAKOTO', 'Jean', 'M', 'Chef de service', '+261 34 86 286 31', 'jean.rakoto@dgsr.mg', '2014-01-27', 'actif', 1, 1, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(2, 'AG-2024-002', 'RASOA', 'Marie', 'F', 'Gestionnaire de parc', '+261 34 22 340 70', 'marie.rasoa@dgsr.mg', '2007-06-09', 'actif', 1, 1, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(3, 'AG-2024-003', 'RANDRIA', 'Hery', 'M', 'Technicien informatique', '+261 34 45 612 58', 'hery.randria@dgsr.mg', '2019-05-10', 'actif', 1, 1, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(4, 'AG-2024-004', 'RAVELO', 'Noro', 'M', 'Ingénieur systèmes', '+261 34 80 782 23', 'noro.ravelo@dgsr.mg', '2022-11-30', 'actif', 1, 1, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(5, 'AG-2024-005', 'RAKOTOARISOA', 'Tojo', 'F', 'Agent de bureau', '+261 34 61 208 59', 'tojo.rakotoarisoa@dgsr.mg', '2007-04-26', 'actif', 1, 2, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(6, 'AG-2024-006', 'RAZAFI', 'Lalao', 'M', 'Chef de service', '+261 34 45 891 15', 'lalao.razafi@dgsr.mg', '2012-12-08', 'actif', 2, 3, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(7, 'AG-2024-007', 'ANDRIA', 'Rivo', 'M', 'Contrôleur technique', '+261 34 64 527 56', 'rivo.andria@dgsr.mg', '2019-05-10', 'actif', 3, 5, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(8, 'AG-2024-008', 'RAKOTONDRA', 'Fanja', 'F', 'Agent de bureau', '+261 34 78 452 14', 'fanja.rakotondra@dgsr.mg', '2020-07-02', 'conge', 3, 5, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(9, 'AG-2024-009', 'RANAIVO', 'Mamy', 'M', 'Contrôleur technique', '+261 34 39 478 55', 'mamy.ranaivo@dgsr.mg', '2011-03-07', 'actif', 3, 6, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(10, 'AG-2024-010', 'RASOLO', 'Hasina', 'M', 'Agent de bureau', '+261 34 84 756 32', 'hasina.rasolo@dgsr.mg', '2013-09-18', 'actif', 3, 7, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(11, 'AG-2024-011', 'RAKOTO', 'Jean', 'F', 'Chef de service', '+261 34 20 922 56', 'jean.rakoto@dgsr.mg', '2011-09-02', 'actif', 4, 8, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(12, 'AG-2024-012', 'RASOA', 'Marie', 'M', 'Gestionnaire de parc', '+261 34 64 387 32', 'marie.rasoa@dgsr.mg', '2015-09-17', 'actif', 4, 9, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(13, 'AG-2024-013', 'RANDRIA', 'Hery', 'M', 'Technicien informatique', '+261 34 83 708 15', 'hery.randria@dgsr.mg', '2013-07-09', 'actif', 2, 4, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(14, 'AG-2024-014', 'RAVELO', 'Noro', 'F', 'Assistant administratif', '+261 34 11 926 67', 'noro.ravelo@dgsr.mg', '2014-01-28', 'actif', 1, 2, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(15, 'AG-2024-015', 'RAKOTOARISOA', 'Tojo', 'M', 'Contrôleur technique', '+261 34 23 971 71', 'tojo.rakotoarisoa@dgsr.mg', '2008-08-24', 'actif', 3, 7, '2026-09-19 10:36:09', '2026-09-19 10:36:09');

-- --------------------------------------------------------

--
-- Structure de la table `batiments`
--

DROP TABLE IF EXISTS `batiments`;
CREATE TABLE IF NOT EXISTS `batiments` (
  `id_batiment` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code_batiment` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_batiment` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('actif','inactif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `id_site` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_batiment`),
  UNIQUE KEY `batiments_code_batiment_unique` (`code_batiment`),
  KEY `batiments_id_site_foreign` (`id_site`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `batiments`
--

INSERT INTO `batiments` (`id_batiment`, `code_batiment`, `nom_batiment`, `description`, `statut`, `id_site`, `created_at`, `updated_at`) VALUES
(1, 'BAT-A', 'Bâtiment A - Administration', NULL, 'actif', 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'BAT-B', 'Bâtiment B - Technique', NULL, 'actif', 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'BAT-CRT1', 'Hall de réception 1', NULL, 'actif', 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'BAT-CRT2', 'Bâtiment bureaux CRT', NULL, 'actif', 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, 'BAT-MAH1', 'Bâtiment principal', NULL, 'actif', 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id_categorie` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code_categorie` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_categorie` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('actif','inactif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_categorie`),
  UNIQUE KEY `categories_code_categorie_unique` (`code_categorie`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id_categorie`, `code_categorie`, `nom_categorie`, `description`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'ORDI', 'Ordinateur', 'Ordinateurs de bureau et portables', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'IMPR', 'Imprimante', 'Imprimantes et multifonctions', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'RESE', 'Équipement réseau', 'Switchs, routeurs, points d\'accès', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'SERV', 'Serveur', 'Serveurs physiques', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, 'SCAN', 'Scanner', 'Scanners et périphériques d\'acquisition', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(6, 'TEL', 'Téléphonie', 'Téléphones fixes et IP', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `detail_achats`
--

DROP TABLE IF EXISTS `detail_achats`;
CREATE TABLE IF NOT EXISTS `detail_achats` (
  `id_detail_achat` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `quantite` int NOT NULL DEFAULT '1',
  `prix_unitaire` decimal(14,2) DEFAULT NULL,
  `montant` decimal(14,2) DEFAULT NULL,
  `date_livraison` date NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `id_achat` bigint UNSIGNED NOT NULL,
  `id_equipement` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_detail_achat`),
  KEY `detail_achats_id_achat_foreign` (`id_achat`),
  KEY `detail_achats_id_equipement_foreign` (`id_equipement`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `detail_achats`
--

INSERT INTO `detail_achats` (`id_detail_achat`, `quantite`, `prix_unitaire`, `montant`, `date_livraison`, `description`, `id_achat`, `id_equipement`, `created_at`, `updated_at`) VALUES
(1, 4, 8250000.00, 24750000.00, '2025-03-07', 'Lot d\'équipements', 1, NULL, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 5, 1483333.33, 8900000.00, '2025-05-24', 'Lot d\'équipements', 2, NULL, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 4, 4766666.67, 14300000.00, '2026-02-10', 'Lot d\'équipements', 3, NULL, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 2, 1120000.00, 5600000.00, '2026-09-19', 'Lot d\'équipements', 4, NULL, '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `directions`
--

DROP TABLE IF EXISTS `directions`;
CREATE TABLE IF NOT EXISTS `directions` (
  `id_direction` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code_direction` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_direction` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('actif','inactif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_direction`),
  UNIQUE KEY `directions_code_direction_unique` (`code_direction`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `directions`
--

INSERT INTO `directions` (`id_direction`, `code_direction`, `nom_direction`, `description`, `telephone`, `email`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'DG', 'Direction Générale', 'Pilotage et coordination de la DGSR', '+261 20 22 362 22', 'dg@dgsr.mg', 'actif', '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(2, 'DT', 'Direction Technique', 'Systèmes d\'information, réception technique et immatriculation', '+261 20 22 324 97', 'dt@dgsr.mg', 'actif', '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(3, 'DOR', 'Direction des Opérations Routières', 'Centres de réception technique et CENSERO', '+261 20 22 377 90', 'dor@dgsr.mg', 'actif', '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(4, 'DAF', 'Direction Administrative et Financière', 'Ressources humaines, finances et logistique', '+261 34 12 345 67', 'daf@dgsr.mg', 'actif', '2026-09-19 10:36:08', '2026-09-21 04:44:53');

-- --------------------------------------------------------

--
-- Structure de la table `documents`
--

DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id_document` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_document` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_document` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chemin_fichier` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taille_fichier` bigint UNSIGNED DEFAULT NULL,
  `mime_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `id_equipement` bigint UNSIGNED DEFAULT NULL,
  `id_utilisateur` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_document`),
  KEY `documents_id_equipement_foreign` (`id_equipement`),
  KEY `documents_id_utilisateur_foreign` (`id_utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `equipements`
--

DROP TABLE IF EXISTS `equipements`;
CREATE TABLE IF NOT EXISTS `equipements` (
  `id_equipement` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code_inventaire` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_serie` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date_acquisition` date DEFAULT NULL,
  `date_mise_service` date DEFAULT NULL,
  `prix_acquisition` decimal(14,2) DEFAULT NULL,
  `garantie_debut` date DEFAULT NULL,
  `garantie_fin` date DEFAULT NULL,
  `statut` enum('en_service','en_stock','en_maintenance','reforme','perdu','reserve') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en_stock',
  `id_modele` bigint UNSIGNED DEFAULT NULL,
  `id_categorie` bigint UNSIGNED DEFAULT NULL,
  `id_marque` bigint UNSIGNED DEFAULT NULL,
  `id_direction` bigint UNSIGNED DEFAULT NULL,
  `id_service` bigint UNSIGNED DEFAULT NULL,
  `id_fournisseur` bigint UNSIGNED DEFAULT NULL,
  `id_localisation` bigint UNSIGNED DEFAULT NULL,
  `id_etat` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_equipement`),
  UNIQUE KEY `equipements_code_inventaire_unique` (`code_inventaire`),
  UNIQUE KEY `equipements_numero_serie_unique` (`numero_serie`),
  KEY `equipements_id_modele_foreign` (`id_modele`),
  KEY `equipements_id_categorie_foreign` (`id_categorie`),
  KEY `equipements_id_marque_foreign` (`id_marque`),
  KEY `equipements_id_direction_foreign` (`id_direction`),
  KEY `equipements_id_service_foreign` (`id_service`),
  KEY `equipements_id_localisation_foreign` (`id_localisation`),
  KEY `equipements_id_etat_foreign` (`id_etat`),
  KEY `equipements_statut_index` (`statut`),
  KEY `equipements_id_fournisseur_foreign` (`id_fournisseur`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `equipements`
--

INSERT INTO `equipements` (`id_equipement`, `code_inventaire`, `numero_serie`, `designation`, `description`, `date_acquisition`, `date_mise_service`, `prix_acquisition`, `garantie_debut`, `garantie_fin`, `statut`, `id_modele`, `id_categorie`, `id_marque`, `id_direction`, `id_service`, `id_fournisseur`, `id_localisation`, `id_etat`, `created_at`, `updated_at`) VALUES
(1, 'GPI-00001', 'SN000719061B', 'HP EliteBook 450 G9', 'Équipement de parc informatique DGSR', '2024-05-02', '2024-01-07', 2641000.00, '2023-06-19', '2027-11-19', 'en_service', 1, 1, 1, 1, NULL, 2, 4, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:12'),
(2, 'GPI-00002', 'SN000200578C', 'Lenovo ThinkPad E14', 'Équipement de parc informatique DGSR', '2024-12-21', '2023-04-09', 2519000.00, '2025-04-19', '2026-12-19', 'en_service', 5, 1, 3, 3, NULL, 3, 5, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:12'),
(3, 'GPI-00003', 'SN000528770D', 'HP ProLiant DL380 Gen10', 'Équipement de parc informatique DGSR', '2025-11-01', '2023-11-05', 957000.00, '2025-11-19', '2028-05-19', 'en_stock', 12, 4, 1, 2, NULL, 4, NULL, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'GPI-00004', 'SN000514038E', 'HP EliteBook 450 G9', 'Équipement de parc informatique DGSR', '2023-06-07', '2023-04-14', 1283000.00, '2025-09-19', '2026-06-19', 'en_maintenance', 1, 1, 1, 1, NULL, 1, 5, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, 'GPI-00005', 'SN000319651F', 'TP-Link EAP225', 'Équipement de parc informatique DGSR', '2025-07-23', '2026-06-28', 2026000.00, '2025-03-19', '2027-11-19', 'en_service', 11, 3, 6, 3, NULL, 2, 6, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(6, 'GPI-00006', 'SN000193581G', 'HP ProDesk 400 G7', 'Équipement de parc informatique DGSR', '2023-09-30', '2025-03-29', 2935000.00, '2026-03-19', '2027-02-19', 'reforme', 2, 1, 1, 2, NULL, 3, 7, 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(7, 'GPI-00007', 'SN000324621H', 'HP ProDesk 400 G7', 'Équipement de parc informatique DGSR', '2026-03-17', '2023-10-01', 3361000.00, '2023-04-19', '2026-02-19', 'en_service', 2, 1, 1, 1, NULL, 4, 7, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:12'),
(8, 'GPI-00008', 'SN000306219I', 'TP-Link EAP225', 'Équipement de parc informatique DGSR', '2022-12-17', '2025-01-08', 3440000.00, '2025-11-19', '2026-06-19', 'reserve', 11, 3, 6, 3, NULL, 1, 9, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(9, 'GPI-00009', 'SN000174819J', 'HP LaserJet Pro M404dn', 'Équipement de parc informatique DGSR', '2025-02-23', '2024-03-15', 2989000.00, '2023-02-19', '2026-01-19', 'en_stock', 7, 2, 1, 2, NULL, 2, NULL, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(10, 'GPI-00010', 'SN000690989K', 'HP LaserJet Pro M404dn', 'Équipement de parc informatique DGSR', '2025-02-27', '2023-12-31', 3987000.00, '2026-01-19', '2028-03-19', 'en_service', 7, 2, 1, 1, NULL, 3, 8, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:12'),
(11, 'GPI-00011', 'SN000885880L', 'HP EliteBook 450 G9', 'Équipement de parc informatique DGSR', '2025-08-30', '2025-03-14', 2422000.00, '2025-01-19', '2028-01-19', 'en_service', 1, 1, 1, 3, NULL, 4, 9, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:12'),
(12, 'GPI-00012', 'SN000139560M', 'TP-Link EAP225', 'Équipement de parc informatique DGSR', '2023-05-09', '2023-02-11', 2704000.00, '2026-03-19', '2026-06-19', 'en_service', 11, 3, 6, 2, NULL, 1, 3, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(13, 'GPI-00013', 'SN000599991N', 'Dell Latitude 3520', 'Équipement de parc informatique DGSR', '2025-07-20', '2023-02-07', 906000.00, '2025-10-19', '2027-02-19', 'en_stock', 3, 1, 2, 1, NULL, 2, NULL, 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(14, 'GPI-00014', 'SN000859824O', 'HP EliteBook 450 G9', 'Équipement de parc informatique DGSR', '2024-08-15', '2023-12-03', 1805000.00, '2025-07-19', '2027-02-19', 'en_maintenance', 1, 1, 1, 3, NULL, 3, 5, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(15, 'GPI-00015', 'SN000132415P', 'Lenovo ThinkCentre M720q', 'Équipement de parc informatique DGSR', '2024-12-30', '2025-06-19', 3908000.00, '2025-09-19', '2028-09-19', 'en_service', 6, 1, 3, 2, NULL, 4, 6, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(16, 'GPI-00016', 'SN000860967Q', 'Lenovo ThinkPad E14', 'Équipement de parc informatique DGSR', '2024-09-02', '2026-08-05', 638000.00, '2023-05-19', '2026-02-19', 'reforme', 5, 1, 3, 1, NULL, 1, 7, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(17, 'GPI-00017', 'SN000783616R', 'Dell OptiPlex 7010', 'Équipement de parc informatique DGSR', '2024-02-14', '2024-03-21', 1213000.00, '2024-09-19', '2026-06-19', 'en_service', 4, 1, 2, 3, NULL, 2, 8, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(18, 'GPI-00018', 'SN000407884S', 'Canon imageRUNNER 2625', 'Équipement de parc informatique DGSR', '2023-03-24', '2023-07-19', 1645000.00, '2023-04-19', '2026-06-19', 'reserve', 8, 2, 4, 2, NULL, 3, 9, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(19, 'GPI-00019', 'SN000494845T', 'Canon DR-C2580U', 'Équipement de parc informatique DGSR', '2026-01-01', '2025-04-17', 2167000.00, '2025-04-19', '2027-10-19', 'en_stock', 13, 5, 4, 1, NULL, 4, NULL, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(20, 'GPI-00020', 'SN000119302U', 'Canon DR-C2580U', 'Équipement de parc informatique DGSR', '2023-11-10', '2024-04-29', 3974000.00, '2024-07-19', '2026-12-19', 'en_service', 13, 5, 4, 3, NULL, 1, 1, 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(21, 'GPI-00021', 'SN000899524V', 'Lenovo ThinkPad E14', 'Équipement de parc informatique DGSR', '2024-04-17', '2023-07-14', 3212000.00, '2025-10-19', '2027-11-19', 'en_service', 5, 1, 3, 2, NULL, 2, 2, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(22, 'GPI-00022', 'SN000572606W', 'HP ProLiant DL380 Gen10', 'Équipement de parc informatique DGSR', '2025-04-13', '2024-06-19', 1357000.00, '2025-07-19', '2027-09-19', 'en_service', 12, 4, 1, 1, NULL, 3, 3, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(23, 'GPI-00023', 'SN000650214X', 'Dell OptiPlex 7010', 'Équipement de parc informatique DGSR', '2023-09-01', '2024-06-30', 923000.00, '2024-01-19', '2028-03-19', 'en_stock', 4, 1, 2, 3, NULL, 4, NULL, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(24, 'GPI-00024', 'SN000183237Y', 'Canon imageRUNNER 2625', 'Équipement de parc informatique DGSR', '2024-04-23', '2026-03-28', 2395000.00, '2022-10-19', '2028-07-19', 'en_maintenance', 8, 2, 4, 2, NULL, 1, 5, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(25, 'GPI-00025', 'SN000464849Z', 'HP ProDesk 400 G7', 'Équipement de parc informatique DGSR', '2023-09-17', '2025-07-14', 4032000.00, '2025-12-19', '2026-02-19', 'en_service', 2, 1, 1, 1, NULL, 2, 6, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(26, 'GPI-00026', 'SN000726628A', 'HP EliteBook 450 G9', 'Équipement de parc informatique DGSR', '2022-09-11', '2025-08-03', 3929000.00, '2023-10-19', '2026-07-19', 'reforme', 1, 1, 1, 3, NULL, 3, 7, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(27, 'GPI-00027', 'SN000439004B', 'Dell OptiPlex 7010', 'Équipement de parc informatique DGSR', '2024-10-13', '2023-01-23', 1388000.00, '2025-02-19', '2028-02-19', 'en_service', 4, 1, 2, 2, NULL, 4, 8, 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(28, 'GPI-00028', 'SN000392889C', 'TP-Link EAP225', 'Équipement de parc informatique DGSR', '2023-04-08', '2024-05-20', 3761000.00, '2023-01-19', '2028-01-19', 'reserve', 11, 3, 6, 1, NULL, 1, 9, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(29, 'GPI-00029', 'SN000975898D', 'HP ProLiant DL380 Gen10', 'Équipement de parc informatique DGSR', '2024-03-17', '2025-11-13', 2481000.00, '2024-08-19', '2026-06-19', 'en_stock', 12, 4, 1, 3, NULL, 2, NULL, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(30, 'GPI-00030', 'SN000893017E', 'HP EliteBook 450 G9', 'Équipement de parc informatique DGSR', '2025-11-24', '2023-03-10', 728000.00, '2023-02-19', '2025-11-19', 'en_service', 1, 1, 1, 2, NULL, 3, 1, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(31, 'GPI-00031', 'SN000628890F', 'HP EliteBook 450 G9', 'Équipement de parc informatique DGSR', '2022-09-26', '2024-08-26', 624000.00, '2024-07-19', '2026-07-19', 'en_service', 1, 1, 1, 1, NULL, 4, 2, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(32, 'GPI-00032', 'SN000850196G', 'Dell Latitude 3520', 'Équipement de parc informatique DGSR', '2025-02-03', '2024-11-19', 1804000.00, '2025-11-19', '2025-12-19', 'en_service', 3, 1, 2, 3, NULL, 1, 3, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(33, 'GPI-00033', 'SN000238504H', 'Cisco Catalyst 2960-X', 'Équipement de parc informatique DGSR', '2026-02-07', '2025-10-09', 3599000.00, '2024-06-19', '2028-05-19', 'en_stock', 10, 3, 5, 2, NULL, 2, NULL, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(34, 'GPI-00034', 'SN000500676I', 'HP LaserJet Pro M404dn', 'Équipement de parc informatique DGSR', '2024-04-06', '2024-06-30', 2751000.00, '2023-01-19', '2026-03-19', 'en_maintenance', 7, 2, 1, 1, NULL, 3, 5, 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `etat_equipements`
--

DROP TABLE IF EXISTS `etat_equipements`;
CREATE TABLE IF NOT EXISTS `etat_equipements` (
  `id_etat` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_etat` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_etat`),
  UNIQUE KEY `etat_equipements_nom_etat_unique` (`nom_etat`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `etat_equipements`
--

INSERT INTO `etat_equipements` (`id_etat`, `nom_etat`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Neuf', 'Équipement neuf, jamais utilisé', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'Bon état', 'Équipement en bon état de fonctionnement', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'Passable', 'Équipement fonctionnel avec traces d\'usure', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'Dégradé', 'Équipement nécessitant une intervention', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, 'Hors service', 'Équipement inutilisable', '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fournisseurs`
--

DROP TABLE IF EXISTS `fournisseurs`;
CREATE TABLE IF NOT EXISTS `fournisseurs` (
  `id_fournisseur` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `raison_sociale` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rcs` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('actif','inactif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_fournisseur`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `fournisseurs`
--

INSERT INTO `fournisseurs` (`id_fournisseur`, `raison_sociale`, `contact`, `telephone`, `email`, `adresse`, `rcs`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'ANTANANARIVO INFORMATIQUE SARL', 'M. Rakotobe', '+261 20 22 345 67', 'contact@antanainfo.mg', 'Lot II M 45, Ankorondrano, Antananarivo', '2014B01234', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'TECHNOLOGIES PLUS', 'Mme Razanamalala', '+261 20 22 654 32', 'ventes@techplus.mg', 'Immeuble Sky, Ankorondrano, Antananarivo', '2018B04567', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'MADATECH DISTRIBUTION', 'M. Rajaonarivelo', '+261 32 40 123 45', 'info@madatech.mg', 'Route des Hydrocarbures, Toamasina', '2016B07890', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'GLOBAL PRINT MALAGASY', 'Mme Ranaivoson', '+261 20 22 987 65', 'contact@globalprint.mg', 'Analakely, Antananarivo', '2020B03211', 'actif', '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `installation_logiciels`
--

DROP TABLE IF EXISTS `installation_logiciels`;
CREATE TABLE IF NOT EXISTS `installation_logiciels` (
  `id_installation` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_installation` date DEFAULT NULL,
  `version_installee` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licence` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('installe','desinstalle','erreur') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'installe',
  `id_logiciel` bigint UNSIGNED NOT NULL,
  `id_equipement` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_installation`),
  UNIQUE KEY `installation_logiciels_id_logiciel_id_equipement_unique` (`id_logiciel`,`id_equipement`),
  KEY `installation_logiciels_id_equipement_foreign` (`id_equipement`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `installation_logiciels`
--

INSERT INTO `installation_logiciels` (`id_installation`, `date_installation`, `version_installee`, `licence`, `statut`, `id_logiciel`, `id_equipement`, `created_at`, `updated_at`) VALUES
(1, '2026-05-31', '23H2', 'LIC-W11-001', 'installe', 1, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(2, '2026-04-04', 'LTSC', 'LIC-W11-001', 'installe', 2, 2, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(3, '2026-08-06', 'v12', 'LIC-W11-001', 'installe', 3, 5, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(4, '2026-03-05', '2024', 'LIC-W11-001', 'installe', 4, 7, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(5, '2026-05-12', 'v3.2', 'LIC-W11-001', 'installe', 5, 10, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(6, '2026-07-19', '23H2', 'LIC-W11-001', 'installe', 1, 11, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(7, '2026-05-18', 'LTSC', 'LIC-W11-001', 'installe', 2, 12, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(8, '2026-04-16', 'v12', 'LIC-W11-001', 'installe', 3, 15, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(9, '2026-06-09', '2024', 'LIC-W11-001', 'installe', 4, 17, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(10, '2026-06-02', 'v3.2', 'LIC-W11-001', 'installe', 5, 20, '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `inventaires`
--

DROP TABLE IF EXISTS `inventaires`;
CREATE TABLE IF NOT EXISTS `inventaires` (
  `id_inventaire` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('planifie','en_cours','cloture','annule') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planifie',
  `id_utilisateur` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_inventaire`),
  UNIQUE KEY `inventaires_reference_unique` (`reference`),
  KEY `inventaires_id_utilisateur_foreign` (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `inventaires`
--

INSERT INTO `inventaires` (`id_inventaire`, `reference`, `date_debut`, `date_fin`, `description`, `statut`, `id_utilisateur`, `created_at`, `updated_at`) VALUES
(1, 'INV-2026-ANNUEL', '2026-09-04', NULL, 'Inventaire annuel du parc informatique', 'en_cours', 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `inventaire_details`
--

DROP TABLE IF EXISTS `inventaire_details`;
CREATE TABLE IF NOT EXISTS `inventaire_details` (
  `id_detail` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `presence` tinyint(1) NOT NULL DEFAULT '1',
  `date_constat` date DEFAULT NULL,
  `observation` text COLLATE utf8mb4_unicode_ci,
  `date_verification` date DEFAULT NULL,
  `statut` enum('a_verifier','verifie','ecart') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'a_verifier',
  `id_inventaire` bigint UNSIGNED NOT NULL,
  `id_equipement` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_detail`),
  UNIQUE KEY `inventaire_details_id_inventaire_id_equipement_unique` (`id_inventaire`,`id_equipement`),
  KEY `inventaire_details_id_equipement_foreign` (`id_equipement`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `inventaire_details`
--

INSERT INTO `inventaire_details` (`id_detail`, `presence`, `date_constat`, `observation`, `date_verification`, `statut`, `id_inventaire`, `id_equipement`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-09-12', 'Équipement présent et fonctionnel', '2026-09-19', 'verifie', 1, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(2, 1, '2026-09-15', 'Équipement présent et fonctionnel', '2026-09-17', 'verifie', 1, 2, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(3, 1, '2026-09-11', 'Équipement présent et fonctionnel', '2026-09-17', 'verifie', 1, 5, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(4, 1, '2026-09-13', 'Équipement présent et fonctionnel', '2026-09-19', 'verifie', 1, 7, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(5, 1, '2026-09-16', 'Équipement présent et fonctionnel', '2026-09-14', 'verifie', 1, 10, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(6, 1, '2026-09-18', 'Équipement présent et fonctionnel', '2026-09-19', 'verifie', 1, 11, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(7, 1, '2026-09-09', 'Équipement présent et fonctionnel', '2026-09-16', 'verifie', 1, 12, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(8, 1, '2026-09-09', 'Équipement présent et fonctionnel', '2026-09-17', 'verifie', 1, 15, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(9, 1, '2026-09-09', 'Équipement présent et fonctionnel', '2026-09-14', 'verifie', 1, 17, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(10, 0, '2026-09-15', 'Équipement introuvable au poste déclaré', '2026-09-14', 'ecart', 1, 20, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(11, 1, '2026-09-18', 'Équipement présent et fonctionnel', '2026-09-14', 'verifie', 1, 21, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(12, 1, '2026-09-12', 'Équipement présent et fonctionnel', '2026-09-14', 'verifie', 1, 22, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(13, 1, '2026-09-16', 'Équipement présent et fonctionnel', '2026-09-17', 'verifie', 1, 25, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(14, 1, '2026-09-16', 'Équipement présent et fonctionnel', '2026-09-15', 'verifie', 1, 27, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(15, 1, '2026-09-12', 'Équipement présent et fonctionnel', '2026-09-14', 'verifie', 1, 30, '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `journal_activites`
--

DROP TABLE IF EXISTS `journal_activites`;
CREATE TABLE IF NOT EXISTS `journal_activites` (
  `id_log` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `table_concernee` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_element` bigint UNSIGNED DEFAULT NULL,
  `anciennes_valeurs` text COLLATE utf8mb4_unicode_ci,
  `nouvelles_valeurs` text COLLATE utf8mb4_unicode_ci,
  `adresse_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_action` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_utilisateur` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_log`),
  KEY `journal_activites_id_utilisateur_foreign` (`id_utilisateur`),
  KEY `journal_activites_table_concernee_id_element_index` (`table_concernee`,`id_element`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `journal_activites`
--

INSERT INTO `journal_activites` (`id_log`, `action`, `table_concernee`, `id_element`, `anciennes_valeurs`, `nouvelles_valeurs`, `adresse_ip`, `date_action`, `id_utilisateur`, `created_at`, `updated_at`) VALUES
(1, 'création ticket', 'tickets', 6, NULL, '{\"titre\":\"repar\",\"description\":\"test\",\"priorite\":\"moyenne\",\"id_equipement\":\"17\",\"reference_ticket\":\"TCK-2026-006\",\"date_creation\":\"2026-09-19 00:00:00\",\"updated_at\":\"2026-09-19 15:36:51\",\"created_at\":\"2026-09-19 15:36:51\",\"id_ticket\":6}', '127.0.0.1', '2026-09-19 15:36:51', 1, '2026-09-19 12:36:51', '2026-09-19 12:36:51'),
(2, 'suppression maintenance', 'maintenances', 8, NULL, '{\"id_maintenance\":8,\"date_demande\":\"2026-08-22\",\"date_debut\":\"2026-09-15\",\"date_fin\":null,\"description_probleme\":\"\\u00c9cran HS\",\"diagnostic\":null,\"technicien\":\"Noro RAVELO\",\"statut\":\"en_cours\",\"id_equipement\":6,\"id_type_maintenance\":1,\"id_agent\":8,\"created_at\":\"2026-09-19 13:36:11\",\"updated_at\":\"2026-09-19 13:36:11\"}', '127.0.0.1', '2026-09-21 08:30:53', 1, '2026-09-21 05:30:53', '2026-09-21 05:30:53'),
(3, 'modification maintenance', 'maintenances', 7, NULL, '{\"id_maintenance\":7,\"date_demande\":\"2026-08-31 00:00:00\",\"date_debut\":null,\"date_fin\":null,\"description_probleme\":\"Lenteur excessive\",\"diagnostic\":null,\"technicien\":\"Hery RANDRIA\",\"statut\":\"planifiee\",\"id_equipement\":20,\"id_type_maintenance\":\"3\",\"id_agent\":7,\"created_at\":\"2026-09-19 13:36:11\",\"updated_at\":\"2026-09-21 08:31:06\"}', '127.0.0.1', '2026-09-21 08:31:06', 1, '2026-09-21 05:31:06', '2026-09-21 05:31:06');

-- --------------------------------------------------------

--
-- Structure de la table `licences`
--

DROP TABLE IF EXISTS `licences`;
CREATE TABLE IF NOT EXISTS `licences` (
  `id_licence` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_licence` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_licence` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nb_licences` int NOT NULL DEFAULT '1',
  `date_acquisition` date DEFAULT NULL,
  `date_expiration` date DEFAULT NULL,
  `numero_serie` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('active','expiree','revoke') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `id_logiciel` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_licence`),
  UNIQUE KEY `licences_reference_licence_unique` (`reference_licence`),
  KEY `licences_id_logiciel_foreign` (`id_logiciel`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `licences`
--

INSERT INTO `licences` (`id_licence`, `reference_licence`, `type_licence`, `nb_licences`, `date_acquisition`, `date_expiration`, `numero_serie`, `statut`, `id_logiciel`, `created_at`, `updated_at`) VALUES
(1, 'LIC-W11-001', 'OEM', 20, '2025-08-19', '2026-12-19', 'XXXX-40C0-ZEC1', 'active', 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(2, 'LIC-O365-001', 'Abonnement annuel', 50, '2025-09-19', '2026-10-19', 'XXXX-5BMC-GDXP', 'active', 2, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(3, 'LIC-ESET-001', 'Abonnement annuel', 35, '2025-10-19', '2026-10-19', 'XXXX-LXX3-AXAW', 'active', 3, '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `localisations`
--

DROP TABLE IF EXISTS `localisations`;
CREATE TABLE IF NOT EXISTS `localisations` (
  `id_localisation` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code_localisation` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_localisation` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `etage` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bureau` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('actif','inactif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `id_batiment` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_localisation`),
  UNIQUE KEY `localisations_code_localisation_unique` (`code_localisation`),
  KEY `localisations_id_batiment_foreign` (`id_batiment`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `localisations`
--

INSERT INTO `localisations` (`id_localisation`, `code_localisation`, `nom_localisation`, `etage`, `bureau`, `description`, `statut`, `id_batiment`, `created_at`, `updated_at`) VALUES
(1, 'LOC-RDC-01', 'RDC - Bureau direction générale', 'RDC', 'B01', NULL, 'actif', 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'LOC-RDC-02', 'RDC - Service informatique', 'RDC', 'B04', NULL, 'actif', 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'LOC-ET1-01', '1er étage - Service RH', '1er étage', 'B11', NULL, 'actif', 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'LOC-ET1-02', '1er étage - Service finances', '1er étage', 'B12', NULL, 'actif', 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, 'LOC-ET2-01', '2e étage - Salle serveurs', '2e étage', 'B21', NULL, 'actif', 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(6, 'LOC-ET2-02', '2e étage - Atelier technique', '2e étage', 'B23', NULL, 'actif', 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(7, 'LOC-CRT-01', 'CRT - Hall réception poste 1', 'RDC', 'P01', NULL, 'actif', 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(8, 'LOC-CRT-02', 'CRT - Hall réception poste 2', 'RDC', 'P02', NULL, 'actif', 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(9, 'LOC-CRT-03', 'CRT - Bureau chef de centre', '1er étage', 'B01', NULL, 'actif', 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(10, 'LOC-MAH-01', 'Mahajanga - Salle informatique', 'RDC', 'B01', NULL, 'actif', 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `logiciels`
--

DROP TABLE IF EXISTS `logiciels`;
CREATE TABLE IF NOT EXISTS `logiciels` (
  `id_logiciel` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `editeur` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_logiciel`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `logiciels`
--

INSERT INTO `logiciels` (`id_logiciel`, `nom`, `version`, `editeur`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Windows 11 Pro', '23H2', 'Microsoft', 'Logiciel standard du socle DGSR', '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(2, 'Microsoft Office 365', 'LTSC', 'Microsoft', 'Logiciel standard du socle DGSR', '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(3, 'Antivirus ESET', 'v12', 'ESET', 'Logiciel standard du socle DGSR', '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(4, 'Adobe Acrobat Reader', '2024', 'Adobe', 'Logiciel standard du socle DGSR', '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(5, 'Outil Immatriculation DGSR', 'v3.2', 'SIT DGSR', 'Logiciel standard du socle DGSR', '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `maintenances`
--

DROP TABLE IF EXISTS `maintenances`;
CREATE TABLE IF NOT EXISTS `maintenances` (
  `id_maintenance` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_demande` date DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `description_probleme` text COLLATE utf8mb4_unicode_ci,
  `diagnostic` text COLLATE utf8mb4_unicode_ci,
  `technicien` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `statut` enum('demandee','planifiee','en_cours','terminee','annulee') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'demandee',
  `id_equipement` bigint UNSIGNED NOT NULL,
  `id_type_maintenance` bigint UNSIGNED NOT NULL,
  `id_agent` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_maintenance`),
  KEY `maintenances_id_equipement_foreign` (`id_equipement`),
  KEY `maintenances_id_type_maintenance_foreign` (`id_type_maintenance`),
  KEY `maintenances_id_agent_foreign` (`id_agent`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `maintenances`
--

INSERT INTO `maintenances` (`id_maintenance`, `date_demande`, `date_debut`, `date_fin`, `description_probleme`, `diagnostic`, `technicien`, `statut`, `id_equipement`, `id_type_maintenance`, `id_agent`, `created_at`, `updated_at`) VALUES
(1, '2026-09-06', NULL, NULL, 'Panne d\'alimentation', NULL, 'Hery RANDRIA', 'demandee', 30, 2, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, '2026-08-27', NULL, NULL, 'Lenteur excessive', NULL, 'Noro RAVELO', 'planifiee', 11, 3, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, '2026-08-10', '2026-09-15', NULL, 'Écran HS', NULL, 'Hery RANDRIA', 'en_cours', 33, 4, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, '2026-08-20', '2026-09-16', '2026-09-17', 'Périphérique non détecté', 'Composant remplacé, tests OK', 'Noro RAVELO', 'terminee', 29, 1, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, '2026-09-02', '2026-09-14', '2026-09-18', 'Surchauffe', 'Composant remplacé, tests OK', 'Hery RANDRIA', 'terminee', 5, 2, 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(6, '2026-08-26', NULL, NULL, 'Panne d\'alimentation', NULL, 'Noro RAVELO', 'demandee', 2, 3, 6, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(7, '2026-08-31', NULL, NULL, 'Lenteur excessive', NULL, 'Hery RANDRIA', 'planifiee', 20, 3, 7, '2026-09-19 10:36:11', '2026-09-21 05:31:06');

-- --------------------------------------------------------

--
-- Structure de la table `marques`
--

DROP TABLE IF EXISTS `marques`;
CREATE TABLE IF NOT EXISTS `marques` (
  `id_marque` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_marque` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_marque`),
  UNIQUE KEY `marques_nom_marque_unique` (`nom_marque`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `marques`
--

INSERT INTO `marques` (`id_marque`, `nom_marque`, `description`, `created_at`, `updated_at`) VALUES
(1, 'HP', 'Constructeur HP', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'Dell', 'Constructeur Dell', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'Lenovo', 'Constructeur Lenovo', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'Canon', 'Constructeur Canon', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, 'Cisco', 'Constructeur Cisco', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(6, 'TP-Link', 'Constructeur TP-Link', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(7, 'Epson', 'Constructeur Epson', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(8, 'Hikvision', 'Constructeur Hikvision', '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_09_19_131639_create_personal_access_tokens_table', 1),
(5, '2026_09_19_140001_create_organisation_tables', 1),
(6, '2026_09_19_140002_create_localisation_tables', 1),
(7, '2026_09_19_140003_create_parc_tables', 1),
(8, '2026_09_19_140004_create_achats_tables', 1),
(9, '2026_09_19_140005_create_maintenance_tables', 1),
(10, '2026_09_19_140006_create_inventaire_tables', 1),
(11, '2026_09_19_140007_create_logiciels_tables', 1),
(12, '2026_09_19_140008_create_affectations_table', 1),
(13, '2026_09_19_140009_create_mouvements_tables', 1),
(14, '2026_09_19_140010_create_divers_tables', 1);

-- --------------------------------------------------------

--
-- Structure de la table `modeles`
--

DROP TABLE IF EXISTS `modeles`;
CREATE TABLE IF NOT EXISTS `modeles` (
  `id_modele` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_modele` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_modele` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `id_categorie` bigint UNSIGNED NOT NULL,
  `id_marque` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_modele`),
  UNIQUE KEY `modeles_reference_modele_unique` (`reference_modele`),
  KEY `modeles_id_categorie_foreign` (`id_categorie`),
  KEY `modeles_id_marque_foreign` (`id_marque`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `modeles`
--

INSERT INTO `modeles` (`id_modele`, `reference_modele`, `nom_modele`, `description`, `id_categorie`, `id_marque`, `created_at`, `updated_at`) VALUES
(1, 'HP-450G9', 'HP EliteBook 450 G9', NULL, 1, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'HP-PROD4', 'HP ProDesk 400 G7', NULL, 1, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'DEL-LAT3520', 'Dell Latitude 3520', NULL, 1, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'DEL-OPT7010', 'Dell OptiPlex 7010', NULL, 1, 2, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, 'LEN-THINKE14', 'Lenovo ThinkPad E14', NULL, 1, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(6, 'LEN-M720', 'Lenovo ThinkCentre M720q', NULL, 1, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(7, 'HP-LJPRO', 'HP LaserJet Pro M404dn', NULL, 2, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(8, 'CAN-IR2625', 'Canon imageRUNNER 2625', NULL, 2, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(9, 'EPS-WF3820', 'Epson WorkForce WF-3820', NULL, 2, 7, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(10, 'CISCO-2960', 'Cisco Catalyst 2960-X', NULL, 3, 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(11, 'TPL-EAP225', 'TP-Link EAP225', NULL, 3, 6, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(12, 'HP-PROL30', 'HP ProLiant DL380 Gen10', NULL, 4, 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(13, 'CAN-DR2580', 'Canon DR-C2580U', NULL, 5, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(14, 'HIK-DS2CD', 'Hikvision DS-2CD2143', NULL, 6, 8, '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `mouvements`
--

DROP TABLE IF EXISTS `mouvements`;
CREATE TABLE IF NOT EXISTS `mouvements` (
  `id_mouvement` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `type_mouvement` enum('affectation','restitution','transfert','maintenance','reforme','stock') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'stock',
  `motif` text COLLATE utf8mb4_unicode_ci,
  `ancienne_localisation` bigint UNSIGNED DEFAULT NULL,
  `nouvelle_localisation` bigint UNSIGNED DEFAULT NULL,
  `date_mouvement` date NOT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `id_equipement` bigint UNSIGNED NOT NULL,
  `id_utilisateur` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_mouvement`),
  KEY `mouvements_ancienne_localisation_foreign` (`ancienne_localisation`),
  KEY `mouvements_nouvelle_localisation_foreign` (`nouvelle_localisation`),
  KEY `mouvements_id_utilisateur_foreign` (`id_utilisateur`),
  KEY `mouvements_id_equipement_date_mouvement_index` (`id_equipement`,`date_mouvement`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `mouvements`
--

INSERT INTO `mouvements` (`id_mouvement`, `type_mouvement`, `motif`, `ancienne_localisation`, `nouvelle_localisation`, `date_mouvement`, `commentaire`, `id_equipement`, `id_utilisateur`, `created_at`, `updated_at`) VALUES
(1, 'transfert', 'Réorganisation des services', 1, 4, '2026-09-08', 'Transfert inter-service', 1, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(2, 'transfert', 'Réorganisation des services', 2, 5, '2026-07-25', 'Transfert inter-service', 2, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(3, 'transfert', 'Réorganisation des services', 3, 6, '2026-09-02', 'Transfert inter-service', 5, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(4, 'transfert', 'Réorganisation des services', 4, 7, '2026-08-25', 'Transfert inter-service', 7, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(5, 'transfert', 'Réorganisation des services', 5, 8, '2026-08-10', 'Transfert inter-service', 10, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(6, 'transfert', 'Réorganisation des services', 6, 9, '2026-08-04', 'Transfert inter-service', 11, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `mouvement_historiques`
--

DROP TABLE IF EXISTS `mouvement_historiques`;
CREATE TABLE IF NOT EXISTS `mouvement_historiques` (
  `id_historique` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `table_concernee` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_enregistrement` bigint UNSIGNED NOT NULL,
  `champ` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ancienne_valeur` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nouvelle_valeur` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  `id_mouvement` bigint UNSIGNED DEFAULT NULL,
  `id_utilisateur` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_historique`),
  KEY `mouvement_historiques_id_mouvement_foreign` (`id_mouvement`),
  KEY `mouvement_historiques_id_utilisateur_foreign` (`id_utilisateur`),
  KEY `mouvement_historiques_table_concernee_id_enregistrement_index` (`table_concernee`,`id_enregistrement`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `mouvement_historiques`
--

INSERT INTO `mouvement_historiques` (`id_historique`, `table_concernee`, `id_enregistrement`, `champ`, `ancienne_valeur`, `nouvelle_valeur`, `commentaire`, `id_mouvement`, `id_utilisateur`, `created_at`, `updated_at`) VALUES
(1, 'equipements', 1, 'id_localisation', 'LOC-RDC-01', 'LOC-ET1-02', 'Historique du transfert', 1, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(2, 'equipements', 2, 'id_localisation', 'LOC-RDC-02', 'LOC-ET2-01', 'Historique du transfert', 2, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(3, 'equipements', 5, 'id_localisation', 'LOC-ET1-01', 'LOC-ET2-02', 'Historique du transfert', 3, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(4, 'equipements', 7, 'id_localisation', 'LOC-ET1-02', 'LOC-CRT-01', 'Historique du transfert', 4, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(5, 'equipements', 10, 'id_localisation', 'LOC-ET2-01', 'LOC-CRT-02', 'Historique du transfert', 5, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(6, 'equipements', 11, 'id_localisation', 'LOC-ET2-02', 'LOC-CRT-03', 'Historique du transfert', 6, 1, '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id_notification` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `titre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `type` enum('info','warning','alerte','succes') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info',
  `lu` tinyint(1) NOT NULL DEFAULT '0',
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_utilisateur` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_notification`),
  KEY `notifications_id_utilisateur_lu_index` (`id_utilisateur`,`lu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(3, 'App\\Models\\Utilisateur', 1, 'spa', '6d9bc9558dd53e8e34f9bd5deabaadb6867a70cb128816a1a9c71172677c4b5f', '[\"*\"]', '2026-09-21 03:35:33', NULL, '2026-09-21 03:34:24', '2026-09-21 03:35:33'),
(5, 'App\\Models\\Utilisateur', 1, 'spa', '92fea8e53720c403445bcffd060ffa3104cd81e3dbba9b6858886d8ac28b7a61', '[\"*\"]', '2026-09-21 05:43:32', NULL, '2026-09-21 03:40:17', '2026-09-21 05:43:32'),
(6, 'App\\Models\\Utilisateur', 1, 'spa', 'dd1bc225234179cb84171c2a722a2f8748ac3e37791d9b10f7fa74cadd64491f', '[\"*\"]', '2026-09-21 08:44:17', NULL, '2026-09-21 04:20:04', '2026-09-21 08:44:17'),
(7, 'App\\Models\\Utilisateur', 1, 'spa', '49d14ca38675715483aea6ccf1557cdee4280acaeb9afd7b984256fc1f5a67a4', '[\"*\"]', NULL, NULL, '2026-09-21 04:32:12', '2026-09-21 04:32:12'),
(8, 'App\\Models\\Utilisateur', 1, 'spa', '1971a3681a39e4a80fe52bba34650aaa44a1986b888ab417961f5241531bd7bd', '[\"*\"]', '2026-09-21 04:33:48', NULL, '2026-09-21 04:33:45', '2026-09-21 04:33:48'),
(9, 'App\\Models\\Utilisateur', 1, 'spa', '0973411fb771b016fe512198d56ff9252abf61c80fe258fd873b48619e7db05f', '[\"*\"]', '2026-09-21 04:42:24', NULL, '2026-09-21 04:42:23', '2026-09-21 04:42:24'),
(10, 'App\\Models\\Utilisateur', 1, 'spa', '0861f88eb323c744281c5c8738f816895e41055e62065b65dad817d26f9da781', '[\"*\"]', '2026-09-21 05:19:02', NULL, '2026-09-21 05:18:58', '2026-09-21 05:19:02'),
(11, 'App\\Models\\Utilisateur', 1, 'spa', '60516a55a6ad2777893e13f984b5a9bb59b369949abf674cf593acfe79852169', '[\"*\"]', '2026-09-21 05:21:58', NULL, '2026-09-21 05:21:53', '2026-09-21 05:21:58'),
(12, 'App\\Models\\Utilisateur', 1, 'spa', '494e19d918258278a8b9d53366d3f7ed9c37c581ee6c13b118758f7da2a5351a', '[\"*\"]', '2026-09-21 08:57:59', NULL, '2026-09-21 05:37:56', '2026-09-21 08:57:59');

-- --------------------------------------------------------

--
-- Structure de la table `qr_codes`
--

DROP TABLE IF EXISTS `qr_codes`;
CREATE TABLE IF NOT EXISTS `qr_codes` (
  `id_qrcode` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `contenu` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_generation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `statut` enum('actif','inactif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `id_equipement` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_qrcode`),
  UNIQUE KEY `qr_codes_id_equipement_unique` (`id_equipement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id_role` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `roles_nom_role_unique` (`nom_role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id_role`, `nom_role`, `description`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Accès complet au système', '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(2, 'gestionnaire_parc', 'Gestion du parc informatique', '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(3, 'technicien', 'Interventions de maintenance et tickets', '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(4, 'utilisateur', 'Consultation et demandes', '2026-09-19 10:36:09', '2026-09-19 10:36:09');

-- --------------------------------------------------------

--
-- Structure de la table `role_utilisateur`
--

DROP TABLE IF EXISTS `role_utilisateur`;
CREATE TABLE IF NOT EXISTS `role_utilisateur` (
  `id_utilisateur` bigint UNSIGNED NOT NULL,
  `id_role` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`id_utilisateur`,`id_role`),
  KEY `role_utilisateur_id_role_foreign` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `role_utilisateur`
--

INSERT INTO `role_utilisateur` (`id_utilisateur`, `id_role`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 3),
(5, 4);

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id_service` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code_service` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_service` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('actif','inactif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `id_direction` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_service`),
  UNIQUE KEY `services_code_service_unique` (`code_service`),
  KEY `services_id_direction_foreign` (`id_direction`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id_service`, `code_service`, `nom_service`, `description`, `statut`, `id_direction`, `created_at`, `updated_at`) VALUES
(1, 'SIT', 'Service Informatique', NULL, 'actif', 1, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(2, 'SEC', 'Secrétariat Central', NULL, 'actif', 1, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(3, 'SPEG', 'Service Planification et Études', NULL, 'actif', 2, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(4, 'SS', 'Service Sécurité', NULL, 'actif', 2, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(5, 'CRT-ANA', 'CRT Antananarivo', NULL, 'actif', 3, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(6, 'CRT-MAH', 'CRT Mahajanga', NULL, 'actif', 3, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(7, 'CEN', 'CENSERO Antananarivo', NULL, 'actif', 3, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(8, 'SRH', 'Service Ressources Humaines', NULL, 'actif', 4, '2026-09-19 10:36:08', '2026-09-19 10:36:08'),
(9, 'SFB', 'Service Finances et Budget', NULL, 'actif', 4, '2026-09-19 10:36:08', '2026-09-19 10:36:08');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('1BUurQ4ozQyzpnLwVQ167LH4fNhkZBea39VAZxg2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Freebuff/0.0.127 Chrome/130.0.6723.191 Electron/33.4.11 Safari/537.36', 'eyJfdG9rZW4iOiJaTEpuNUhGRXZLMnZ4SWhEaEl5VTlreGwyNUpJNmhaTDZNTlNlbDloIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789991055),
('9D0b7m78c6Jp27F6BiAoHuYL1eC0Ly53kx3Z1NSJ', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiIxd0pYMmpyNnh1ODh6WmN3MWVBR09KMWdxSmNmY3BxZXdFcWsyZ2xhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789973585),
('ABIfUm0URe1QDSVAGusMy3AtoXue4KUSxodYvtyj', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiIyR1VJRU9HNWFrSHRtWVdRTXFwczdqTVBRNFpBNWhhdHRYTGlIQWVhIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789973509),
('d9BEFpyAIWSuhDEi0kkHbrZBzgOv3XeXQw2TbGsR', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiJDYTFWdEZTUHNDNXRuZDFaMldvQzRjQ2hQM0dhM1g3Q1pjRkZlVll4IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789983820),
('DuIueJAbEIslkaqDTwAQmFvPZYiznCv46l7AXjMR', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiJaSEF4elZZdnhxZ1dDR3VUTUV1R2ZtekRXaFQ4MHZkRmN6VGVrTmM3IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789974677),
('GtlDX52OFYnH7ocDTMXVI7kbBULam9wBevGEL385', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiJKVWpTUWl0SVFDV2lyc0h3UDJCTGRMWUFWQ2k1a3czbXVqbmNuMjBjIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789976403),
('I8TuWalKdehNgUyOtfMNlMzjO6Jh4SMxeqMkTLK3', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiJtYzcxaDdlNXdyNWNLUDB4dEZDcnpVS1hFaUtvRkg0NG9LVHpncE1TIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789975280),
('Je02TKl523zPaCPLFlJjmcakudkLaaVwSToVOSp1', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiJHOGdpcTV4NG5CUkF4eVVzU1J1ZkdQNFdNT2doaFNKWjlSVGpiUFZMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789990127),
('kdYKSsDzrrDhUbh7BL5xl8wyLZDbADsi22ulxSLZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJZRkVSeDhuUTdEWkNXajY1c3FoazZvcjE1TmNrMmlUZnhPOUp4NWVsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9jYXRlZ29yaWVzIiwicm91dGUiOiJzcGEifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1789991804),
('SW3DaJ0iO8p1p272T4SLe4MhSrJjgv7VfBQ6u8MH', NULL, '127.0.0.1', 'Bun/1.4.2', 'eyJfdG9rZW4iOiJ5OUpzOTJMUDhUWHp3ZDNFVnhPUmdRWjVzUm1zNkZrVHZGV1RnMUoxIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789976435),
('TigBrZqCFUUrRCA1UVBoLHAvaovoJjip7UiZFDiH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.138.0 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36', 'eyJfdG9rZW4iOiJQQW1Hc1A3d00yZHNVbEx6ZFRSc3ZLMWRETlNyMlIzQWNKMDByb3RMIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789980211),
('uGBF2977Y7IC5rmxwFrpXEaHm4FODwWSK9RnJJ0i', NULL, '127.0.0.1', 'Bun/1.4.2', 'eyJfdG9rZW4iOiJ4MmVXbGdJRXFuWW5DSVhaMGFmMG9POVpqbktnWFBXZEpxcEdQTHZSIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789982812),
('xLdl9AeEbb3alJP0sJ99LcxH4Z9TiK4cUd63DD0C', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiJuVHRGaUxqVmY0VWZYdENFUnVxaFVYN0htb2l0bzRDVzhUVG9WSFZsIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789982707),
('ze5iYglCLVkJYaZF8xLcTT7Gw8FxAhNPQZagT73U', NULL, '127.0.0.1', 'curl/8.21.0', 'eyJfdG9rZW4iOiJxZUE5cFZwNWNKUUNFMmt2a1JOSTdqcTB1NVNXVXlOWDVhaFc3NmtyIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJhY2N1ZWlsIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1789973539);

-- --------------------------------------------------------

--
-- Structure de la table `sites`
--

DROP TABLE IF EXISTS `sites`;
CREATE TABLE IF NOT EXISTS `sites` (
  `id_site` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `code_site` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_site` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ville` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `statut` enum('actif','inactif') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'actif',
  `id_direction` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_site`),
  UNIQUE KEY `sites_code_site_unique` (`code_site`),
  KEY `sites_id_direction_foreign` (`id_direction`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sites`
--

INSERT INTO `sites` (`id_site`, `code_site`, `nom_site`, `ville`, `description`, `statut`, `id_direction`, `created_at`, `updated_at`) VALUES
(1, 'SIEGE', 'Siège DGSR', 'Antananarivo', NULL, 'actif', 1, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'CRT-ANA-S', 'CRT Antananarivo', 'Antananarivo', NULL, 'actif', 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'CRT-MAH-S', 'CRT Mahajanga', 'Mahajanga', NULL, 'actif', 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE IF NOT EXISTS `tickets` (
  `id_ticket` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference_ticket` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titre` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `priorite` enum('basse','moyenne','haute','critique') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'moyenne',
  `date_creation` date DEFAULT NULL,
  `date_cloture` date DEFAULT NULL,
  `statut` enum('ouvert','en_cours','resolu','ferme') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ouvert',
  `id_equipement` bigint UNSIGNED DEFAULT NULL,
  `id_agent` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_ticket`),
  UNIQUE KEY `tickets_reference_ticket_unique` (`reference_ticket`),
  KEY `tickets_id_equipement_foreign` (`id_equipement`),
  KEY `tickets_id_agent_foreign` (`id_agent`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tickets`
--

INSERT INTO `tickets` (`id_ticket`, `reference_ticket`, `titre`, `description`, `priorite`, `date_creation`, `date_cloture`, `statut`, `id_equipement`, `id_agent`, `created_at`, `updated_at`) VALUES
(1, 'TCK-2026-001', 'Ordinateur ne démarre plus', 'Signalé par un agent du service. Merci d\'intervenir rapidement.', 'haute', '2026-09-05', NULL, 'ouvert', 30, 4, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'TCK-2026-002', 'Imprimante en panne de papier', 'Signalé par un agent du service. Merci d\'intervenir rapidement.', 'moyenne', '2026-09-16', NULL, 'en_cours', 11, 5, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'TCK-2026-003', 'Connexion réseau instable au CRT', 'Signalé par un agent du service. Merci d\'intervenir rapidement.', 'haute', '2026-09-01', '2026-09-19', 'resolu', 33, 6, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'TCK-2026-004', 'Mot de passe oublié session Windows', 'Signalé par un agent du service. Merci d\'intervenir rapidement.', 'basse', '2026-08-30', '2026-09-19', 'ferme', 29, 7, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(5, 'TCK-2026-005', 'Demande d\'installation logiciel', 'Signalé par un agent du service. Merci d\'intervenir rapidement.', 'moyenne', '2026-09-03', NULL, 'ouvert', 5, 8, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(6, 'TCK-2026-006', 'repar', 'test', 'moyenne', '2026-09-19', NULL, 'ouvert', 17, NULL, '2026-09-19 12:36:51', '2026-09-19 12:36:51');

-- --------------------------------------------------------

--
-- Structure de la table `ticket_commentaires`
--

DROP TABLE IF EXISTS `ticket_commentaires`;
CREATE TABLE IF NOT EXISTS `ticket_commentaires` (
  `id_commentaire` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `contenu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_commentaire` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_ticket` bigint UNSIGNED NOT NULL,
  `id_utilisateur` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_commentaire`),
  KEY `ticket_commentaires_id_ticket_foreign` (`id_ticket`),
  KEY `ticket_commentaires_id_utilisateur_foreign` (`id_utilisateur`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ticket_commentaires`
--

INSERT INTO `ticket_commentaires` (`id_commentaire`, `contenu`, `date_commentaire`, `id_ticket`, `id_utilisateur`, `created_at`, `updated_at`) VALUES
(1, 'Demande prise en compte par le SIT.', '2026-09-15 10:36:11', 1, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'Demande prise en compte par le SIT.', '2026-09-18 10:36:11', 2, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'Demande prise en compte par le SIT.', '2026-09-16 10:36:11', 3, 3, '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'Demande prise en compte par le SIT.', '2026-09-16 10:36:12', 4, 3, '2026-09-19 10:36:12', '2026-09-19 10:36:12'),
(5, 'Demande prise en compte par le SIT.', '2026-09-14 10:36:12', 5, 3, '2026-09-19 10:36:12', '2026-09-19 10:36:12');

-- --------------------------------------------------------

--
-- Structure de la table `type_maintenances`
--

DROP TABLE IF EXISTS `type_maintenances`;
CREATE TABLE IF NOT EXISTS `type_maintenances` (
  `id_type_maintenance` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_type_maintenance`),
  UNIQUE KEY `type_maintenances_nom_type_unique` (`nom_type`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `type_maintenances`
--

INSERT INTO `type_maintenances` (`id_type_maintenance`, `nom_type`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Préventive', 'Maintenance planifiée régulière', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(2, 'Curative', 'Intervention suite à une panne', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(3, 'Mise à jour', 'Mises à jour logicielles et firmware', '2026-09-19 10:36:11', '2026-09-19 10:36:11'),
(4, 'Nettoyage', 'Nettoyage physique des équipements', '2026-09-19 10:36:11', '2026-09-19 10:36:11');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id_utilisateur` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT '1',
  `dernier_connexion` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_agent` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `utilisateurs_username_unique` (`username`),
  UNIQUE KEY `utilisateurs_email_unique` (`email`),
  KEY `utilisateurs_id_agent_foreign` (`id_agent`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id_utilisateur`, `username`, `email`, `password`, `actif`, `dernier_connexion`, `remember_token`, `id_agent`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@dgsr.mg', '$2y$12$qxMvAZYoQR7ml1IudyEaX.pxmNKA/AjWdF8vB6aRMli58NZeyb.Mu', 1, '2026-09-21 05:37:56', NULL, 1, '2026-09-19 10:36:09', '2026-09-21 05:37:56'),
(2, 'r.rakoto', 'jean.rakoto@dgsr.mg', '$2y$12$V3MOCbAbPmmo4J3M6kO0AOLwe167a.bMc/LN0Uy6W91rN2ndI1DZW', 1, '2026-09-18 10:36:09', NULL, 2, '2026-09-19 10:36:09', '2026-09-19 10:36:09'),
(3, 't.raso', 'marie.rasoa@dgsr.mg', '$2y$12$XuKqN8YjQzTFHYTZf87Ifu2Xf8jAi.CUqaMbEy1mnCaVGW8MBk2DS', 1, '2026-09-16 10:36:10', NULL, 3, '2026-09-19 10:36:10', '2026-09-19 10:36:10'),
(4, 'h.ran', 'hery.randria@dgsr.mg', '$2y$12$id7b.l7s9AADs7BqP1kWjejACE66FDl8im1ekAvUEyji.iq6injLG', 1, '2026-09-16 10:36:10', NULL, 4, '2026-09-19 10:36:10', '2026-09-19 10:36:10'),
(5, 'n.rav', 'noro.ravelo@dgsr.mg', '$2y$12$K8MJ.mJU1W1uGs/ow1hng.pLEHi2KL1pqG1lLn7vBkNCq5bGLRndW', 1, '2026-09-19 10:36:11', NULL, 7, '2026-09-19 10:36:11', '2026-09-19 10:36:11');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `achats`
--
ALTER TABLE `achats`
  ADD CONSTRAINT `achats_id_fournisseur_foreign` FOREIGN KEY (`id_fournisseur`) REFERENCES `fournisseurs` (`id_fournisseur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `affectations`
--
ALTER TABLE `affectations`
  ADD CONSTRAINT `affectations_id_agent_foreign` FOREIGN KEY (`id_agent`) REFERENCES `agents` (`id_agent`) ON DELETE CASCADE,
  ADD CONSTRAINT `affectations_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE CASCADE;

--
-- Contraintes pour la table `agents`
--
ALTER TABLE `agents`
  ADD CONSTRAINT `agents_id_direction_foreign` FOREIGN KEY (`id_direction`) REFERENCES `directions` (`id_direction`) ON DELETE RESTRICT,
  ADD CONSTRAINT `agents_id_service_foreign` FOREIGN KEY (`id_service`) REFERENCES `services` (`id_service`) ON DELETE SET NULL;

--
-- Contraintes pour la table `batiments`
--
ALTER TABLE `batiments`
  ADD CONSTRAINT `batiments_id_site_foreign` FOREIGN KEY (`id_site`) REFERENCES `sites` (`id_site`) ON DELETE CASCADE;

--
-- Contraintes pour la table `detail_achats`
--
ALTER TABLE `detail_achats`
  ADD CONSTRAINT `detail_achats_id_achat_foreign` FOREIGN KEY (`id_achat`) REFERENCES `achats` (`id_achat`) ON DELETE CASCADE,
  ADD CONSTRAINT `detail_achats_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE SET NULL;

--
-- Contraintes pour la table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE CASCADE,
  ADD CONSTRAINT `documents_id_utilisateur_foreign` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `equipements`
--
ALTER TABLE `equipements`
  ADD CONSTRAINT `equipements_id_categorie_foreign` FOREIGN KEY (`id_categorie`) REFERENCES `categories` (`id_categorie`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipements_id_direction_foreign` FOREIGN KEY (`id_direction`) REFERENCES `directions` (`id_direction`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipements_id_etat_foreign` FOREIGN KEY (`id_etat`) REFERENCES `etat_equipements` (`id_etat`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipements_id_fournisseur_foreign` FOREIGN KEY (`id_fournisseur`) REFERENCES `fournisseurs` (`id_fournisseur`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipements_id_localisation_foreign` FOREIGN KEY (`id_localisation`) REFERENCES `localisations` (`id_localisation`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipements_id_marque_foreign` FOREIGN KEY (`id_marque`) REFERENCES `marques` (`id_marque`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipements_id_modele_foreign` FOREIGN KEY (`id_modele`) REFERENCES `modeles` (`id_modele`) ON DELETE SET NULL,
  ADD CONSTRAINT `equipements_id_service_foreign` FOREIGN KEY (`id_service`) REFERENCES `services` (`id_service`) ON DELETE SET NULL;

--
-- Contraintes pour la table `installation_logiciels`
--
ALTER TABLE `installation_logiciels`
  ADD CONSTRAINT `installation_logiciels_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE CASCADE,
  ADD CONSTRAINT `installation_logiciels_id_logiciel_foreign` FOREIGN KEY (`id_logiciel`) REFERENCES `logiciels` (`id_logiciel`) ON DELETE CASCADE;

--
-- Contraintes pour la table `inventaires`
--
ALTER TABLE `inventaires`
  ADD CONSTRAINT `inventaires_id_utilisateur_foreign` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `inventaire_details`
--
ALTER TABLE `inventaire_details`
  ADD CONSTRAINT `inventaire_details_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE CASCADE,
  ADD CONSTRAINT `inventaire_details_id_inventaire_foreign` FOREIGN KEY (`id_inventaire`) REFERENCES `inventaires` (`id_inventaire`) ON DELETE CASCADE;

--
-- Contraintes pour la table `journal_activites`
--
ALTER TABLE `journal_activites`
  ADD CONSTRAINT `journal_activites_id_utilisateur_foreign` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `licences`
--
ALTER TABLE `licences`
  ADD CONSTRAINT `licences_id_logiciel_foreign` FOREIGN KEY (`id_logiciel`) REFERENCES `logiciels` (`id_logiciel`) ON DELETE CASCADE;

--
-- Contraintes pour la table `localisations`
--
ALTER TABLE `localisations`
  ADD CONSTRAINT `localisations_id_batiment_foreign` FOREIGN KEY (`id_batiment`) REFERENCES `batiments` (`id_batiment`) ON DELETE CASCADE;

--
-- Contraintes pour la table `maintenances`
--
ALTER TABLE `maintenances`
  ADD CONSTRAINT `maintenances_id_agent_foreign` FOREIGN KEY (`id_agent`) REFERENCES `agents` (`id_agent`) ON DELETE SET NULL,
  ADD CONSTRAINT `maintenances_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE CASCADE,
  ADD CONSTRAINT `maintenances_id_type_maintenance_foreign` FOREIGN KEY (`id_type_maintenance`) REFERENCES `type_maintenances` (`id_type_maintenance`) ON DELETE RESTRICT;

--
-- Contraintes pour la table `modeles`
--
ALTER TABLE `modeles`
  ADD CONSTRAINT `modeles_id_categorie_foreign` FOREIGN KEY (`id_categorie`) REFERENCES `categories` (`id_categorie`) ON DELETE RESTRICT,
  ADD CONSTRAINT `modeles_id_marque_foreign` FOREIGN KEY (`id_marque`) REFERENCES `marques` (`id_marque`) ON DELETE RESTRICT;

--
-- Contraintes pour la table `mouvements`
--
ALTER TABLE `mouvements`
  ADD CONSTRAINT `mouvements_ancienne_localisation_foreign` FOREIGN KEY (`ancienne_localisation`) REFERENCES `localisations` (`id_localisation`) ON DELETE SET NULL,
  ADD CONSTRAINT `mouvements_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE CASCADE,
  ADD CONSTRAINT `mouvements_id_utilisateur_foreign` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL,
  ADD CONSTRAINT `mouvements_nouvelle_localisation_foreign` FOREIGN KEY (`nouvelle_localisation`) REFERENCES `localisations` (`id_localisation`) ON DELETE SET NULL;

--
-- Contraintes pour la table `mouvement_historiques`
--
ALTER TABLE `mouvement_historiques`
  ADD CONSTRAINT `mouvement_historiques_id_mouvement_foreign` FOREIGN KEY (`id_mouvement`) REFERENCES `mouvements` (`id_mouvement`) ON DELETE CASCADE,
  ADD CONSTRAINT `mouvement_historiques_id_utilisateur_foreign` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_id_utilisateur_foreign` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `qr_codes`
--
ALTER TABLE `qr_codes`
  ADD CONSTRAINT `qr_codes_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE CASCADE;

--
-- Contraintes pour la table `role_utilisateur`
--
ALTER TABLE `role_utilisateur`
  ADD CONSTRAINT `role_utilisateur_id_role_foreign` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_utilisateur_id_utilisateur_foreign` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE CASCADE;

--
-- Contraintes pour la table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_id_direction_foreign` FOREIGN KEY (`id_direction`) REFERENCES `directions` (`id_direction`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sites`
--
ALTER TABLE `sites`
  ADD CONSTRAINT `sites_id_direction_foreign` FOREIGN KEY (`id_direction`) REFERENCES `directions` (`id_direction`) ON DELETE SET NULL;

--
-- Contraintes pour la table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_id_agent_foreign` FOREIGN KEY (`id_agent`) REFERENCES `agents` (`id_agent`) ON DELETE SET NULL,
  ADD CONSTRAINT `tickets_id_equipement_foreign` FOREIGN KEY (`id_equipement`) REFERENCES `equipements` (`id_equipement`) ON DELETE SET NULL;

--
-- Contraintes pour la table `ticket_commentaires`
--
ALTER TABLE `ticket_commentaires`
  ADD CONSTRAINT `ticket_commentaires_id_ticket_foreign` FOREIGN KEY (`id_ticket`) REFERENCES `tickets` (`id_ticket`) ON DELETE CASCADE,
  ADD CONSTRAINT `ticket_commentaires_id_utilisateur_foreign` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateurs` (`id_utilisateur`) ON DELETE SET NULL;

--
-- Contraintes pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD CONSTRAINT `utilisateurs_id_agent_foreign` FOREIGN KEY (`id_agent`) REFERENCES `agents` (`id_agent`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
