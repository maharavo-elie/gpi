import { useState, useEffect, createContext, useContext } from 'react';

/* ============================================================
   i18n partagé : FR par défaut, EN disponible.
   - TRADUCTIONS : textes de la page de connexion
   - NAV : libellés de la navigation et de l'entête de l'app
   - DICT : dictionnaire de l'application, indexé par le texte FR
     (t('Annuler') → 'Cancel' en EN, le texte FR sinon)
   - LangueProvider : une seule source de langue pour tous les
     composants (connexion + app), mémorisée dans localStorage
   ============================================================ */

const TRADUCTIONS = {
    fr: {
        ministere: 'Ministère des Transports et de la Météorologie',
        portail: 'Portail Centralisé de Gestion',
        journal: (
            <>
                <span className="text-slate-700 font-semibold">JOURNAL_ACTIVITE</span> (BLOC 15) trace chaque session.
            </>
        ),
        noeud: "Nœud d'Authentification",
        reseau: 'Réseau Opérationnel',
        support: 'Support : assistance-dsi@dgsr.mg',
        accesReserve: 'Accès Réserve — Confidentiel Défense',
        titreForm: 'Ouverture de session étatique',
        sousTitre: 'Saisissez vos identifiants répertoriés au registre national des agents.',
        identifiant: 'AGENT.matricule',
        placeholderIdent: 'Ex : A-0248 ou admin@dgsr.mg',
        cleAcces: "Clé d'accès",
        bouton: 'Accéder au Système DGSR',
        legal:
            "Accès strictement réservé aux personnels habilités de la République de Madagascar. Tout accès non autorisé fait l'objet de poursuites conformément à la législation en vigueur.",
        erreurServeur: 'Connexion impossible. Vérifiez le serveur.',
    },
    en: {
        ministere: 'Ministry of Transport and Meteorology',
        portail: 'Centralized Management Portal',
        journal: (
            <>
                <span className="text-slate-700 font-semibold">JOURNAL_ACTIVITE</span> (BLOCK 15) logs every session.
            </>
        ),
        noeud: 'Authentication Node',
        reseau: 'Operational Network',
        support: 'Support: assistance-dsi@dgsr.mg',
        accesReserve: 'Restricted Access — Defense Confidential',
        titreForm: 'State sign-in portal',
        sousTitre: 'Enter your credentials registered in the national staff register.',
        identifiant: 'AGENT.ID',
        placeholderIdent: 'E.g.: A-0248 or admin@dgsr.mg',
        cleAcces: 'Access key',
        bouton: 'Access the DGSR System',
        legal:
            'Access is strictly reserved to authorized staff of the Republic of Madagascar. Any unauthorized access will be prosecuted in accordance with applicable law.',
        erreurServeur: 'Unable to sign in. Please check the server.',
    },
};

/* Contexte de langue : partagé par la connexion ET toute l'application. */
const ContexteLangue = createContext(null);

export function LangueProvider({ children }) {
    const [langue, setLangue] = useState(() => localStorage.getItem('gpi_lang') ?? 'fr');

    useEffect(() => {
        localStorage.setItem('gpi_lang', langue);
        document.documentElement.lang = langue;
    }, [langue]);

    const basculer = () => setLangue((l) => (l === 'fr' ? 'en' : 'fr'));

    return <ContexteLangue.Provider value={{ langue, setLangue, basculer }}>{children}</ContexteLangue.Provider>;
}

export function useLangue() {
    const ctx = useContext(ContexteLangue);
    /* Repli (hors provider) : état local mémorisé. Les hooks restent appelés
       dans le même ordre, même quand le contexte existe. */
    const [local, setLocal] = useState(() => localStorage.getItem('gpi_lang') ?? 'fr');
    const langue = ctx?.langue ?? local;
    const setLangue = ctx?.setLangue ?? setLocal;

    useEffect(() => {
        localStorage.setItem('gpi_lang', langue);
    }, [langue]);

    const basculer = () => setLangue((l) => (l === 'fr' ? 'en' : 'fr'));
    return { langue, setLangue, basculer };
}

/* Navigation : libellés par route (index 0 = FR, 1 = EN) */
const NAV = {
    sections: {
        Organisation: ['Organisation', 'Organization'],
        Localisation: ['Localisation', 'Location'],
        'Parc informatique': ['Parc informatique', 'IT Assets'],
        Gestion: ['Gestion', 'Management'],
        Maintenance: ['Maintenance', 'Maintenance'],
        Autres: ['Autres', 'Others'],
        Rapports: ['Rapports', 'Reports'],
        Système: ['Système', 'System'],
    },
    items: {
        '/': ['Tableau de bord', 'Dashboard'],
        '/directions': ['Directions', 'Directorates'],
        '/services': ['Services', 'Departments'],
        '/agents': ['Agents', 'Staff'],
        '/sites': ['Sites', 'Sites'],
        '/batiments': ['Bâtiments', 'Buildings'],
        '/localisations': ['Localisations', 'Locations'],
        '/equipements': ['Équipements', 'Equipment'],
        '/categories': ['Catégories', 'Categories'],
        '/marques': ['Marques', 'Brands'],
        '/modeles': ['Modèles', 'Models'],
        '/fournisseurs': ['Fournisseurs', 'Suppliers'],
        '/achats': ['Achats', 'Purchases'],
        '/affectations': ['Affectations', 'Assignments'],
        '/maintenances': ['Maintenances', 'Maintenances'],
        '/tickets': ['Tickets', 'Tickets'],
        '/inventaires': ['Inventaires', 'Inventories'],
        '/logiciels': ['Logiciels', 'Software'],
        '/rapports': ['Rapports & Historiques', 'Reports & History'],
        '/corbeille': ['Corbeille', 'Trash'],
        '/parametres': ['Paramètres', 'Settings'],
    },
    /* Entête et divers de l'app */
    ui: {
        rechercher: ['Rechercher…', 'Search…'],
        rechercherAstuce: ['Code inventaire, n° série, matricule agent', 'Inventory code, serial no., staff ID'],
        confidentiel: ['Confidentiel Défense', 'Defense Confidential'],
        ouvrirMenu: ['Ouvrir le menu', 'Open menu'],
        parcInformatique: ['Parc Informatique', 'IT Assets'],
        reseauInterne: ['Réseau DGSR Interne', 'DGSR Internal Network'],
        voirProfil: ['Voir / modifier mon profil', 'View / edit my profile'],
        seDeconnecter: ['Se déconnecter', 'Sign out'],
        titreDeconnexion: ['Se déconnecter ?', 'Sign out?'],
        resterConnecte: ['Rester connecté', 'Stay signed in'],
        deconnexionEnCours: ['Déconnexion…', 'Signing out…'],
        messageDeconnexion: ['Voulez-vous vraiment vous déconnecter ?', 'Do you really want to sign out?'],
        fermerSession: ['Voulez-vous vraiment fermer la session de', 'Do you really want to close the session of'],
    },
};

/* Dictionnaire de l'application : clé = texte français du code,
   valeur = [FR, EN]. t(francais) renvoie l'entrée de la langue
   courante — un texte inconnu est renvoyé tel quel (fallback FR). */
const D = (fr, en) => [fr, en];

/* Libellé dépendant de la langue, hors hooks (statuts, priorités…) :
   lit la langue courante à chaque rendu — les composants se re-rendent
   quand la langue change via le contexte, donc la valeur est à jour. */
const langueLocale = () => {
    try {
        return (typeof window !== 'undefined' && localStorage.getItem('gpi_lang')) || 'fr';
    } catch {
        return 'fr';
    }
};
export const champTraduit = (fr, en) => ({ get label() { return langueLocale() === 'en' ? en : fr; } });

const DICT = {
    /* --- ui.jsx : modales, boutons, états vides --- */
    'Annuler': D('Annuler', 'Cancel'),
    'Enregistrer': D('Enregistrer', 'Save'),
    'Enregistrement…': D('Enregistrement…', 'Saving…'),
    'Enregistrer les modifications': D('Enregistrer les modifications', 'Save changes'),
    'Créer': D('Créer', 'Create'),
    'EDITION': D('EDITION', 'EDIT'),
    'NOUVEAU': D('NOUVEAU', 'NEW'),
    'Confirmer la suppression': D('Confirmer la suppression', 'Confirm deletion'),
    'Supprimer': D('Supprimer', 'Delete'),
    'Suppression…': D('Suppression…', 'Deleting…'),
    'Modifier': D('Modifier', 'Edit'),
    'Chargement…': D('Chargement…', 'Loading…'),
    'Chargement': D('Chargement', 'Loading'),
    'Aucun élément': D('Aucun élément', 'No items'),
    'Ajoutez le premier ou ajustez la recherche.': D('Ajoutez le premier ou ajustez la recherche.', 'Add the first one or adjust your search.'),
    'Lecture seule': D('Lecture seule', 'Read only'),
    'Voulez-vous vraiment supprimer ': D('Voulez-vous vraiment supprimer ', 'Do you really want to delete '),
    "Voulez-vous vraiment supprimer l'équipement ": D("Voulez-vous vraiment supprimer l'équipement ", 'Do you really want to delete equipment item '),
    ' ? Cette action est définitive.': D(' ? Cette action est définitive.', '? This action is permanent.'),
    'Ajouter': D('Ajouter', 'Add'),
    'Rechercher…': D('Rechercher…', 'Search…'),
    'Tous les statuts': D('Tous les statuts', 'All statuses'),
    'Modifications enregistrées.': D('Modifications enregistrées.', 'Changes saved.'),
    'créé(e).': D('créé(e).', 'created.'),
    'Élément créé.': D('Élément créé.', 'Item created.'),
    'Élément supprimé.': D('Élément supprimé.', 'Item deleted.'),
    'Suppression impossible (élément utilisé ailleurs).': D('Suppression impossible (élément utilisé ailleurs).', 'Cannot delete (item is used elsewhere).'),
    'Génération du PDF impossible.': D('Génération du PDF impossible.', 'Unable to generate the PDF.'),
    'Nouvel élément — ': D('Nouvel élément — ', 'New item — '),
    'Élément': D('Élément', 'Item'),
    'élément(s)': D('élément(s)', 'item(s)'),

    /* --- actions / tableaux communs --- */
    'Imprimer PDF': D('Imprimer PDF', 'Print PDF'),
    'Génération…': D('Génération…', 'Generating…'),
    'Export…': D('Export…', 'Export…'),
    'Détail': D('Détail', 'Detail'),
    'Précédent': D('Précédent', 'Previous'),
    'Suivant': D('Suivant', 'Next'),
    'Actions': D('Actions', 'Actions'),
    'Statut': D('Statut', 'Status'),
    'Nom': D('Nom', 'Name'),
    'Voir': D('Voir', 'View'),
    'Restituer': D('Restituer', 'Restock'),
    'Restaurer': D('Restaurer', 'Restore'),
    'Restauration…': D('Restauration…', 'Restoring…'),
    'Supprimer définitivement': D('Supprimer définitivement', 'Delete permanently'),
    'Vider': D('Vider', 'Empty'),
    'Fermer': D('Fermer', 'Close'),
    'Appliquer': D('Appliquer', 'Apply'),
    'Tout voir': D('Tout voir', 'View all'),
    'Tout supprimer': D('Tout supprimer', 'Delete all'),
    'Tout supprimer ?': D('Tout supprimer ?', 'Delete all?'),
    'Supprimer cette entrée ?': D('Supprimer cette entrée ?', 'Delete this entry?'),
    'Supprimer cette entrée': D('Supprimer cette entrée', 'Delete this entry'),

    /* --- statuts, badges, valeurs connues --- */
    'En service': D('En service', 'In service'),
    'En stock': D('En stock', 'In stock'),
    'En maintenance': D('En maintenance', 'Under maintenance'),
    'Réformé': D('Réformé', 'Decommissioned'),
    'Perdu': D('Perdu', 'Lost'),
    'Réservé': D('Réservé', 'Reserved'),
    'Basse': D('Basse', 'Low'),
    'Moyenne': D('Moyenne', 'Medium'),
    'Haute': D('Haute', 'High'),
    'Critique': D('Critique', 'Critical'),
    'Ouvert': D('Ouvert', 'Open'),
    'En cours': D('En cours', 'In progress'),
    'en cours': D('en cours', 'under way'),
    'terminée': D('terminée', 'completed'),
    'clôturée': D('clôturée', 'closed'),
    'Résolu': D('Résolu', 'Resolved'),
    'Fermé': D('Fermé', 'Closed'),
    'Demandée': D('Demandée', 'Requested'),
    'Planifiée': D('Planifiée', 'Scheduled'),
    'Terminée': D('Terminée', 'Completed'),
    'Annulée': D('Annulée', 'Cancelled'),
    'Commandé': D('Commandé', 'Ordered'),
    'Livré partiel': D('Livré partiel', 'Partially delivered'),
    'Livré': D('Livré', 'Delivered'),
    'Annulé': D('Annulé', 'Cancelled'),
    'Actif': D('Actif', 'Active'),
    'Inactif': D('Inactif', 'Inactive'),
    'actif': D('actif', 'active'),
    'inactif': D('inactif', 'inactive'),
    'Congé': D('Congé', 'On leave'),
    'Mutation': D('Mutation', 'Transfer'),
    'conge': D('conge', 'on leave'),
    'mutation': D('mutation', 'transfer'),
    'Masculin': D('Masculin', 'Male'),
    'Féminin': D('Féminin', 'Female'),
    'Stock': D('Stock', 'Stock'),
    "Moins d'un an": D("Moins d'un an", 'Less than a year'),
    ' an': D(' an', ' year'),
    ' ans': D(' ans', ' years'),
    "d'ancienneté": D("d'ancienneté", 'of service'),
    'Écart': D('Écart', 'Mismatch'),
    'Vérifié': D('Vérifié', 'Verified'),
    'À vérifier': D('À vérifier', 'To verify'),
    'Info': D('Info', 'Info'),
    'Alerte': D('Alerte', 'Alert'),
    'Attention': D('Attention', 'Warning'),
    'Réglé': D('Réglé', 'Resolved'),
    'Système': D('Système', 'System'),

    /* --- titres de pages / sections / navigation --- */
    'Tableau de bord': D('Tableau de bord', 'Dashboard'),
    'Équipements': D('Équipements', 'Equipment'),
    'Équipement': D('Équipement', 'Equipment'),
    'Agents': D('Agents', 'Staff'),
    'Agent': D('Agent', 'Agent'),
    'Corbeille': D('Corbeille', 'Trash'),
    'Inventaires': D('Inventaires', 'Inventories'),
    'Paramètres': D('Paramètres', 'Settings'),
    'Catégories': D('Catégories', 'Categories'),
    'Catégorie': D('Catégorie', 'Category'),
    'Marques': D('Marques', 'Brands'),
    'Marque': D('Marque', 'Brand'),
    'Modèles': D('Modèles', 'Models'),
    'Modèle': D('Modèle', 'Model'),
    'Services': D('Services', 'Departments'),
    'Service': D('Service', 'Department'),
    'Directions': D('Directions', 'Directorates'),
    'Direction': D('Direction', 'Directorate'),
    'Sites': D('Sites', 'Sites'),
    'Site': D('Site', 'Site'),
    'Bâtiments': D('Bâtiments', 'Buildings'),
    'Bâtiment': D('Bâtiment', 'Building'),
    'Localisations': D('Localisations', 'Locations'),
    'Localisation': D('Localisation', 'Location'),
    'Fournisseurs': D('Fournisseurs', 'Suppliers'),
    'Fournisseur': D('Fournisseur', 'Supplier'),
    'Achats': D('Achats', 'Purchases'),
    'Achat': D('Achat', 'Purchase'),
    'Affectations': D('Affectations', 'Assignments'),
    'Affectation': D('Affectation', 'Assignment'),
    'Maintenances': D('Maintenances', 'Maintenances'),
    'Maintenance': D('Maintenance', 'Maintenance'),
    'Logiciels': D('Logiciels', 'Software'),
    'Logiciel': D('Logiciel', 'Software'),
    'Rapports & Historiques': D('Rapports & Historiques', 'Reports & History'),
    'Synthèse du parc, historique des transactions de matériel et traçabilité des opérations': D(
        'Synthèse du parc, historique des transactions de matériel et traçabilité des opérations',
        'Fleet summary, asset transaction history and operation audit trail',
    ),
    'Synthèse': D('Synthèse', 'Summary'),
    'Mouvements de matériel': D('Mouvements de matériel', 'Asset movements'),
    "Journal d'activité": D("Journal d'activité", 'Activity log'),

    /* --- colonnes / champs de formulaires --- */
    'Code': D('Code', 'Code'),
    'Description': D('Description', 'Description'),
    'Référence': D('Référence', 'Reference'),
    'Raison sociale': D('Raison sociale', 'Legal name'),
    'Contact': D('Contact', 'Contact'),
    'Personne de contact': D('Personne de contact', 'Contact person'),
    'Email': D('Email', 'Email'),
    'Téléphone': D('Téléphone', 'Phone'),
    'Étage': D('Étage', 'Floor'),
    'Bureau': D('Bureau', 'Office'),
    'Adresse': D('Adresse', 'Address'),
    'Ville': D('Ville', 'City'),
    'Version': D('Version', 'Version'),
    'Éditeur': D('Éditeur', 'Publisher'),
    'Licences': D('Licences', 'Licenses'),
    'Installations': D('Installations', 'Installations'),
    'Nom du logiciel': D('Nom du logiciel', 'Software name'),
    ' licence(s)': D(' licence(s)', ' license(s)'),
    ' poste(s)': D(' poste(s)', ' workstation(s)'),
    'N° de facture': D('N° de facture', 'Invoice no.'),
    'Facture': D('Facture', 'Invoice'),
    'Montant': D('Montant', 'Amount'),
    'Montant total (Ar)': D('Montant total (Ar)', 'Total amount (Ar)'),
    "Date de l'achat": D("Date de l'achat", 'Purchase date'),
    'Bon de commande': D('Bon de commande', 'Purchase order'),
    'Référence (ACH-2026-001)': D('Référence (ACH-2026-001)', 'Reference (PUR-2026-001)'),
    'Type de maintenance': D('Type de maintenance', 'Maintenance type'),
    'Demandée le': D('Demandée le', 'Requested on'),
    'Début': D('Début', 'Start'),
    'Fin': D('Fin', 'End'),
    'Technicien': D('Technicien', 'Technician'),
    'Problème décrit': D('Problème décrit', 'Reported issue'),
    'Date de demande': D('Date de demande', 'Request date'),
    'Date de début': D('Date de début', 'Start date'),
    'Date de fin': D('Date de fin', 'End date'),
    'Diagnostic': D('Diagnostic', 'Diagnosis'),
    'Nom de la direction': D('Nom de la direction', 'Directorate name'),
    'Nom du service': D('Nom du service', 'Department name'),
    'Nom de la catégorie': D('Nom de la catégorie', 'Category name'),
    'Nom de la marque': D('Nom de la marque', 'Brand name'),
    'Nom du modèle': D('Nom du modèle', 'Model name'),
    'Nom du site': D('Nom du site', 'Site name'),
    'Nom du bâtiment': D('Nom du bâtiment', 'Building name'),
    'Nom de la localisation': D('Nom de la localisation', 'Location name'),
    "Nom de l'état": D("Nom de l'état", 'State name'),
    'Nom de la valeur': D('Nom de la valeur', 'Value name'),

    /* --- Dashboard --- */
    "Vue d'ensemble du parc informatique de la DGSR": D(
        "Vue d'ensemble du parc informatique de la DGSR",
        'Overview of the DGSR IT asset fleet',
    ),
    'Chargement du tableau de bord…': D('Chargement du tableau de bord…', 'Loading the dashboard…'),
    'Matériels répertoriés': D('Matériels répertoriés', 'Registered assets'),
    'Tickets ouverts': D('Tickets ouverts', 'Open tickets'),
    'Maintenances en cours': D('Maintenances en cours', 'Ongoing maintenances'),
    'Affectations actives': D('Affectations actives', 'Active assignments'),
    'Gérer': D('Gérer', 'Manage'),
    'Répartition par statut': D('Répartition par statut', 'Breakdown by status'),
    'Par catégorie': D('Par catégorie', 'By category'),
    'Valeur totale du parc': D('Valeur totale du parc', 'Total fleet value'),
    'Derniers tickets': D('Derniers tickets', 'Latest tickets'),
    'Aucun ticket pour le moment.': D('Aucun ticket pour le moment.', 'No tickets yet.'),
    'Derniers mouvements': D('Derniers mouvements', 'Latest movements'),
    'garanties < 60 j': D('garanties < 60 j', 'warranties < 60 days'),
    'Un inventaire est ': D('Un inventaire est ', 'An inventory is '),
    ' campagne(s) active(s).': D(' campagne(s) active(s).', ' active campaign(s).'),

    /* --- Corbeille --- */
    'Équipements et agents supprimés — restaurez-les ou effacez-les définitivement': D(
        'Équipements et agents supprimés — restaurez-les ou effacez-les définitivement',
        'Deleted equipment and staff — restore them or purge them permanently',
    ),
    'Supprimé le': D('Supprimé le', 'Deleted on'),
    'Corbeille des ': D('Corbeille des ', 'Trash · '),
    'Chargement de la corbeille…': D('Chargement de la corbeille…', 'Loading the trash…'),
    'Aucun élément supprimé pour le moment.': D('Aucun élément supprimé pour le moment.', 'Nothing deleted yet.'),
    ' : vide': D(' : vide', ': empty'),
    'Restaurer cet élément ?': D('Restaurer cet élément ?', 'Restore this item?'),
    'Restaurer cet élément': D('Restaurer cet élément', 'Restore this item'),
    "L'élément redeviendra visible normalement dans l'application.": D(
        "L'élément redeviendra visible normalement dans l'application.",
        'The item will become normally visible again in the application.',
    ),
    'Supprimer définitivement ?': D('Supprimer définitivement ?', 'Delete permanently?'),
    "L'élément sera effacé de la base de données. Cette action est ": D(
        "L'élément sera effacé de la base de données. Cette action est ",
        'The item will be erased from the database. This action is ',
    ),
    'irréversible': D('irréversible', 'irreversible'),
    'Vider cette corbeille ?': D('Vider cette corbeille ?', 'Empty this trash?'),
    'Tous les éléments supprimés de cette section seront effacés définitivement. Action ': D(
        'Tous les éléments supprimés de cette section seront effacés définitivement. Action ',
        'All deleted items in this section will be permanently erased. Action ',
    ),
    'Purge…': D('Purge…', 'Purging…'),

    /* --- Inventaires --- */
    'Campagnes de vérification du parc': D('Campagnes de vérification du parc', 'Fleet verification campaigns'),
    'Chargement des inventaires…': D('Chargement des inventaires…', 'Loading the inventories…'),
    ' vérifié(s) · ': D(' vérifié(s) · ', ' verified · '),
    ' écart(s)': D(' écart(s)', ' mismatch(es)'),

    /* --- Équipements (liste) --- */
    'Code inventaire': D('Code inventaire', 'Inventory code'),
    'N° de série': D('N° de série', 'Serial no.'),
    'Désignation': D('Désignation', 'Designation'),
    "Date d'acquisition": D("Date d'acquisition", 'Acquisition date'),
    "Prix d'acquisition (Ar)": D("Prix d'acquisition (Ar)", 'Acquisition price (Ar)'),
    'Chargement des équipements…': D('Chargement des équipements…', 'Loading equipment…'),
    'Aucun équipement trouvé': D('Aucun équipement trouvé', 'No equipment found'),
    'Ajustez les filtres ou créez un nouvel équipement.': D('Ajustez les filtres ou créez un nouvel équipement.', 'Adjust the filters or create a new equipment item.'),
    ' équipement(s) au parc': D(' équipement(s) au parc', ' equipment item(s) in the fleet'),
    ' équipements': D(' équipements', ' equipment items'),
    'Rechercher par code inventaire, n° série, désignation…': D(
        'Rechercher par code inventaire, n° série, désignation…',
        'Search by inventory code, serial no., designation…',
    ),
    'Toutes catégories': D('Toutes catégories', 'All categories'),
    'Nouvel équipement': D('Nouvel équipement', 'New equipment'),
    'Supprimer cet équipement': D('Supprimer cet équipement', 'Delete this equipment item'),
    'Modifier cet équipement': D('Modifier cet équipement', 'Edit this equipment item'),
    'Voir la fiche détaillée': D('Voir la fiche détaillée', 'View the detail sheet'),
    'Modifier — ': D('Modifier — ', 'Edit — '),
    'Enregistrement impossible.': D('Enregistrement impossible.', 'Unable to save.'),
    'Page ': D('Page ', 'Page '),

    /* --- EquipementDetail --- */
    'Équipement introuvable.': D('Équipement introuvable.', 'Equipment not found.'),
    'Retour à la liste': D('Retour à la liste', 'Back to the list'),
    'Retour aux équipements': D('Retour aux équipements', 'Back to equipment'),
    'Fiche PDF': D('Fiche PDF', 'PDF sheet'),
    'Caractéristiques': D('Caractéristiques', 'Specifications'),
    'Cycle de vie': D('Cycle de vie', 'Life cycle'),
    'Acquisition': D('Acquisition', 'Acquisition'),
    'Mise en service': D('Mise en service', 'Commissioning'),
    "Prix d'acquisition": D("Prix d'acquisition", 'Acquisition price'),
    'Garantie': D('Garantie', 'Warranty'),
    "jusqu'au ": D("jusqu'au ", 'until '),
    'Créée le': D('Créée le', 'Created on'),
    ' (fiche : ': D(' (fiche : ', ' (record: '),
    ')': D(')', ')'),
    'Jamais affecté.': D('Jamais affecté.', 'Never assigned.'),
    ' · depuis le ': D(' · depuis le ', ' · since '),
    'depuis le ': D('depuis le ', 'since '),
    'Maintenance & tickets': D('Maintenance & tickets', 'Maintenance & tickets'),
    'Aucune intervention enregistrée.': D('Aucune intervention enregistrée.', 'No intervention recorded.'),
    ' · priorité ': D(' · priorité ', ' · priority '),
    'Logiciels installés': D('Logiciels installés', 'Installed software'),
    'Aucun logiciel enregistré.': D('Aucun logiciel enregistré.', 'No software recorded.'),
    'Mouvements': D('Mouvements', 'Movements'),
    'Aucun mouvement.': D('Aucun mouvement.', 'No movements.'),
    'Documents': D('Documents', 'Documents'),
    'Aucun document attaché.': D('Aucun document attaché.', 'No document attached.'),
    'Chargement de la fiche…': D('Chargement de la fiche…', 'Loading the detail sheet…'),
    'sans n° série': D('sans n° série', 'no serial no.'),
    'État : ': D('État : ', 'State: '),
    'État': D('État', 'State'),
    'Direction': D('Direction', 'Directorate'),
    'Affectations (': D('Affectations (', 'Assignments ('),
    'Logiciels installés (': D('Logiciels installés (', 'Installed software ('),
    'Mouvements (': D('Mouvements (', 'Movements ('),
    'Documents (': D('Documents (', 'Documents ('),

    /* --- Tickets --- */
    "Tickets d'assistance": D("Tickets d'assistance", 'Support tickets'),
    ' ticket(s)': D(' ticket(s)', ' ticket(s)'),
    'Nouveau ticket': D('Nouveau ticket', 'New ticket'),
    'Rechercher un ticket…': D('Rechercher un ticket…', 'Search a ticket…'),
    'Chargement des tickets…': D('Chargement des tickets…', 'Loading tickets…'),
    'Aucun ticket': D('Aucun ticket', 'No tickets'),
    "Créez le premier ticket d'assistance.": D("Créez le premier ticket d'assistance.", 'Create the first support ticket.'),
    'Supprimer ce ticket': D('Supprimer ce ticket', 'Delete this ticket'),
    'Modifier ce ticket': D('Modifier ce ticket', 'Edit this ticket'),
    'Changer le statut': D('Changer le statut', 'Change status'),
    'Titre': D('Titre', 'Title'),
    'Priorité': D('Priorité', 'Priority'),
    'Agent déclarant': D('Agent déclarant', 'Reporting agent'),
    'créé le ': D('créé le ', 'created on '),
    'Aucun commentaire.': D('Aucun commentaire.', 'No comments.'),
    'Ajouter un commentaire…': D('Ajouter un commentaire…', 'Add a comment…'),
    'Commentaires (': D('Commentaires (', 'Comments ('),
    'Voulez-vous vraiment supprimer le ticket ': D('Voulez-vous vraiment supprimer le ticket ', 'Do you really want to delete the ticket '),
    'Clôturé le ': D('Clôturé le ', 'Closed on '),
    'Priorité ': D('Priorité ', 'Priority '),

    /* --- Affectations --- */
    'Affectations en cours': D('Affectations en cours', 'Ongoing assignments'),
    'Affecter un équipement': D('Affecter un équipement', 'Assign equipment'),
    'Chargement des affectations…': D('Chargement des affectations…', 'Loading assignments…'),
    'Aucune affectation active': D('Aucune affectation active', 'No active assignment'),
    ' en cours · ': D(' en cours · ', ' ongoing · '),
    ' terminée(s)': D(' terminée(s)', ' completed'),
    'Restituer au stock': D('Restituer au stock', 'Return to stock'),
    'Restitution réservée aux gestionnaires': D('Restitution réservée aux gestionnaires', 'Restocking restricted to managers'),
    'Historique': D('Historique', 'History'),
    'Confirmer la restitution': D('Confirmer la restitution', 'Confirm the return'),
    "L'équipement ": D("L'équipement ", 'Equipment item '),
    ' sera rendu au stock et l\'affectation de ': D(' sera rendu au stock et l\'affectation de ', ' will be returned to stock and the assignment of '),
    ' sera clôturée.': D(' sera clôturée.', ' will be closed.'),
    "Date d'affectation": D("Date d'affectation", 'Assignment date'),
    'Motif': D('Motif', 'Reason'),
    'Besoin de service…': D('Besoin de service…', 'Department request…'),
    'Choisir un équipement…': D('Choisir un équipement…', 'Choose an equipment item…'),
    'Choisir un agent…': D('Choisir un agent…', 'Choose an agent…'),
    'Affectation…': D('Affectation…', 'Assigning…'),
    'Affecter': D('Affecter', 'Assign'),
    'Affectation impossible.': D('Affectation impossible.', 'Unable to assign.'),

    /* --- Agents --- */
    ' agent(s) enregistré(s)': D(' agent(s) enregistré(s)', ' staff member(s) recorded'),
    'Nouvel agent': D('Nouvel agent', 'New agent'),
    'Rechercher par matricule, nom, fonction…': D('Rechercher par matricule, nom, fonction…', 'Search by staff ID, name, role…'),
    'Chargement des agents…': D('Chargement des agents…', 'Loading staff…'),
    'Aucun agent trouvé': D('Aucun agent trouvé', 'No staff found'),
    'Matricule': D('Matricule', 'Staff ID'),
    'Nom de naissance': D('Nom de naissance', 'Birth name'),
    'Prénom': D('Prénom', 'First name'),
    'Sexe': D('Sexe', 'Sex'),
    'Fonction': D('Fonction', 'Role'),
    "Date d'embauche": D("Date d'embauche", 'Hiring date'),
    'Supprimer cet agent': D('Supprimer cet agent', 'Delete this staff member'),
    'Modifier cet agent': D('Modifier cet agent', 'Edit this staff member'),
    'Voir toutes les informations de cet agent': D('Voir toutes les informations de cet agent', 'View all information about this staff member'),
    "Informations de l'agent": D("Informations de l'agent", 'Staff member details'),
    'Fonction': D('Fonction', 'Role'),
    'Fonction non renseignée': D('Fonction non renseignée', 'No role given'),
    'Ancienneté': D('Ancienneté', 'Seniority'),
    "Voulez-vous vraiment supprimer l'agent ": D("Voulez-vous vraiment supprimer l'agent ", 'Do you really want to delete the staff member '),

    /* --- Rapports --- */
    'Synthèse du parc, historique des transactions de matériel et traçabilité des opérations': D(
        'Synthèse du parc, historique des transactions de matériel et traçabilité des opérations',
        'Fleet overview, asset transaction history and operation audit trail',
    ),
    'Année en cours': D('Année en cours', 'Current year'),
    '12 derniers mois': D('12 derniers mois', 'Last 12 months'),
    '90 derniers jours': D('90 derniers jours', 'Last 90 days'),
    '30 derniers jours': D('30 derniers jours', 'Last 30 days'),
    'Valeur du parc': D('Valeur du parc', 'Fleet value'),
    'Mouvements sur la période': D('Mouvements sur la période', 'Movements in the period'),
    'Achats sur la période': D('Achats sur la période', 'Purchases in the period'),
    'Flux de matériel — 12 derniers mois': D('Flux de matériel — 12 derniers mois', 'Asset flows — last 12 months'),
    'Entrées': D('Entrées', 'Inflows'),
    'Sorties': D('Sorties', 'Outflows'),
    'Transactions par type — ': D('Transactions par type — ', 'Transactions by type — '),
    'Parc par direction (top 8)': D('Parc par direction (top 8)', 'Fleet by directorate (top 8)'),
    'Aucune direction rattachée.': D('Aucune direction rattachée.', 'No directorate linked.'),
    'Parc par catégorie': D('Parc par catégorie', 'Fleet by category'),
    'Matériel le plus mobile de la période (affectations cumulées)': D(
        'Matériel le plus mobile de la période (affectations cumulées)',
        'Most-moved assets in the period (cumulative assignments)',
    ),
    'Aucune affectation sur la période.': D('Aucune affectation sur la période.', 'No assignments in the period.'),
    'Historique des transactions de matériel': D('Historique des transactions de matériel', 'Asset transaction history'),
    'Code inventaire, n° série, motif, utilisateur…': D('Code inventaire, n° série, motif, utilisateur…', 'Inventory code, serial no., reason, user…'),
    'Tous les types': D('Tous les types', 'All types'),
    'Chargement des mouvements…': D('Chargement des mouvements…', 'Loading movements…'),
    'Aucun mouvement trouvé.': D('Aucun mouvement trouvé.', 'No movements found.'),
    'Ajustez les filtres ou la période.': D('Ajustez les filtres ou la période.', 'Adjust the filters or the period.'),
    'Date': D('Date', 'Date'),
    'Type': D('Type', 'Type'),
    'Effectué par': D('Effectué par', 'Performed by'),
    "L'intégralité de l'historique des mouvements (": D(
        "L'intégralité de l'historique des mouvements (",
        'The entire movement history (',
    ),
    "L'intégralité du journal d'activité (": D(
        "L'intégralité du journal d'activité (",
        'The entire activity log (',
    ),
    ' entrée(s)) sera définitivement effacée. Cette action est irréversible.': D(
        ' entrée(s)) sera définitivement effacée. Cette action est irréversible.',
        ' entries) will be permanently erased. This action is irreversible.',
    ),
    "Cette entrée de l'historique des mouvements sera définitivement effacée. Cette action est irréversible.": D(
        "Cette entrée de l'historique des mouvements sera définitivement effacée. Cette action est irréversible.",
        'This history entry will be permanently erased. This action is irreversible.',
    ),
    "Cette entrée du journal d'activité sera définitivement effacée. Cette action est irréversible.": D(
        "Cette entrée du journal d'activité sera définitivement effacée. Cette action est irréversible.",
        'This log entry will be permanently erased. This action is irreversible.',
    ),
    "Journal d'activité — traçabilité des opérations": D(
        "Journal d'activité — traçabilité des opérations",
        'Activity log — operation audit trail',
    ),
    'Action, table, utilisateur, adresse IP…': D('Action, table, utilisateur, adresse IP…', 'Action, table, user, IP address…'),
    'Chargement du journal…': D('Chargement du journal…', 'Loading the log…'),
    'Aucune activité enregistrée.': D('Aucune activité enregistrée.', 'No activity recorded.'),
    'Horodatage': D('Horodatage', 'Timestamp'),
    'Table': D('Table', 'Table'),
    'Utilisateur': D('Utilisateur', 'User'),
    'Adresse IP': D('Adresse IP', 'IP address'),
    'Calcul de la synthèse…': D('Calcul de la synthèse…', 'Computing the summary…'),
    'entrée(s)': D('entrée(s)', 'entries'),
    'sortie(s)': D('sortie(s)', 'outflow(s)'),
    'Action': D('Action', 'Action'),
    "L'intégralité": D("L'intégralité", 'All'),

    /* types de mouvement */
    'Entrée en stock': D('Entrée en stock', 'Stock entry'),
    'affectation': D('affectation', 'assignment'),
    'restitution': D('restitution', 'return'),
    'transfert': D('transfert', 'transfer'),
    'maintenance': D('maintenance', 'maintenance'),
    'reforme': D('reforme', 'decommissioning'),
    'stock': D('stock', 'stock'),
    'priorité ': D('priorité ', 'priority '),
    'Restitution': D('Restitution', 'Return'),
    'Transfert': D('Transfert', 'Transfer'),
    'Réforme': D('Réforme', 'Decommissioning'),

    /* --- Paramètres --- */
    "Préférences d'interface et configuration des référentiels": D(
        "Préférences d'interface et configuration des référentiels",
        'Interface preferences and reference-data configuration',
    ),
    'Chargement des paramètres…': D('Chargement des paramètres…', 'Loading settings…'),
    "Thème de l'interface": D("Thème de l'interface", 'Interface theme'),
    'Mode sombre': D('Mode sombre', 'Dark mode'),
    'Mode clair': D('Mode clair', 'Light mode'),
    'Interface': D('Interface', 'Interface'),
    'Sidebar élargie': D('Sidebar élargie', 'Wide sidebar'),
    '320px au lieu de 288px': D('320px au lieu de 288px', '320px instead of 288px'),
    'Sidebar repliée': D('Sidebar repliée', 'Collapsed sidebar'),
    'Icônes seules (76px)': D('Icônes seules (76px)', 'Icons only (76px)'),
    'Densité': D('Densité', 'Density'),
    'Compacte': D('Compacte', 'Compact'),
    'Confortable': D('Confortable', 'Comfortable'),
    'Spacieuse': D('Spacieuse', 'Spacious'),
    "Sons d'interface": D("Sons d'interface", 'Interface sounds'),
    'Retour sonore sur les actions': D('Retour sonore sur les actions', 'Audio feedback on actions'),
    'Réglages complets dans la section ci-dessous': D('Réglages complets dans la section ci-dessous', 'Full settings in the section below'),
    'Réinitialiser les préférences': D('Réinitialiser les préférences', 'Reset preferences'),
    'Sons': D('Sons', 'Sounds'),
    'Volume général': D('Volume général', 'Master volume'),
    'Discret': D('Discret', 'Quiet'),
    'Fort': D('Fort', 'Loud'),
    'Pack de sons': D('Pack de sons', 'Sound pack'),
    "Tester les sons du pack « ": D("Tester les sons du pack « ", 'Test the sounds of pack « '),
    " » (": D(" » (", ' » ('),
    ')': D(')', ')'),
    '⚡ Anime': D('⚡ Anime', '⚡ Anime'),
    "💡 Les sons sont synthétisés en direct (Web Audio API) — aucun fichier à télécharger. Ils se déclenchent automatiquement sur les actions de l'application. Une pastille 🔊 apparaît en bas à droite à chaque son joué — si elle apparaît mais que vous n'entendez rien, montez le volume système ou vérifiez votre périphérique de sortie.": D(
        "💡 Les sons sont synthétisés en direct (Web Audio API) — aucun fichier à télécharger. Ils se déclenchent automatiquement sur les actions de l'application. Une pastille 🔊 apparaît en bas à droite à chaque son joué — si elle apparaît mais que vous n'entendez rien, montez le volume système ou vérifiez votre périphérique de sortie.",
        '💡 Sounds are synthesized on the fly (Web Audio API) — no files to download. They play automatically on application actions. A 🔊 badge appears in the bottom-right corner each time a sound plays — if you see it but hear nothing, raise your system volume or check your output device.',
    ),
    "Chaque thème anime affiche sa scène : Shibuya la nuit (JJK), l'allée des glycines (Demon Slayer), le château de Clover, le portail du Système, la Vallée de la Fin (Naruto), le Grand Line (One Piece). Importez votre propre image de personnage si vous préférez.": D(
        "Chaque thème anime affiche sa scène : Shibuya la nuit (JJK), l'allée des glycines (Demon Slayer), le château de Clover, le portail du Système, la Vallée de la Fin (Naruto), le Grand Line (One Piece). Importez votre propre image de personnage si vous préférez.",
        'Each anime theme shows its own scene: Shibuya at night (JJK), the wisteria lane (Demon Slayer), the Clover castle, the System gate, the Valley of the End (Naruto), the Grand Line (One Piece). Import your own character image if you prefer.',
    ),
    "Votre image (fichier ou URL) remplace la scène — stockée localement, jamais envoyée au serveur. Trouvez n'importe quelle image de personnage sur le web et collez son adresse ici.": D(
        "Votre image (fichier ou URL) remplace la scène — stockée localement, jamais envoyée au serveur. Trouvez n'importe quelle image de personnage sur le web et collez son adresse ici.",
        'Your image (file or URL) replaces the scene — stored locally, never sent to the server. Find any character image on the web and paste its address here.',
    ),
    "Clic": D('Clic', 'Click'),
    'Ouvrir': D('Ouvrir', 'Open'),
    'Succès': D('Succès', 'Success'),
    'Thème': D('Thème', 'Theme'),
    "Fond d'écran (thèmes anime)": D("Fond d'écran (thèmes anime)", 'Wallpaper (anime themes)'),
    'Voile de lisibilité': D('Voile de lisibilité', 'Readability veil'),
    'Fond visible': D('Fond visible', 'Wallpaper visible'),
    'Contenu net': D('Contenu net', 'Crisp content'),
    'Image personnalisée': D('Image personnalisée', 'Custom image'),
    "Retirer l'image": D("Retirer l'image", 'Remove the image'),
    'Importer depuis votre PC…': D('Importer depuis votre PC…', 'Import from your PC…'),
    "Ou collez l'URL d'une image…": D("Ou collez l'URL d'une image…", 'Or paste an image URL…'),
    'Image trop lourde (max 4 Mo).': D('Image trop lourde (max 4 Mo).', 'Image too large (max 4 MB).'),
    "Fond d'écran personnalisé appliqué.": D("Fond d'écran personnalisé appliqué.", 'Custom wallpaper applied.'),
    "Image appliquée depuis l'URL.": D("Image appliquée depuis l'URL.", 'Image applied from the URL.'),
    'Configuration des interfaces (référentiels)': D(
        'Configuration des interfaces (référentiels)',
        'Interface configuration (reference data)',
    ),
    'Aucun élément — cliquez sur « Ajouter » pour créer le premier.': D(
        'Aucun élément — cliquez sur « Ajouter » pour créer le premier.',
        'No items — click “Add” to create the first one.',
    ),
    'Modèle — ': D('Modèle — ', 'Model — '),
    'RCS': D('RCS', 'RCS'),
    'États': D('États', 'States'),
    "Nom de l'état": D("Nom de l'état", 'State name'),

    /* --- Notifications --- */
    'Notifications': D('Notifications', 'Notifications'),
    'Aucune notification — tout est au vert.': D('Aucune notification — tout est au vert.', 'No notifications — nothing pending.'),
    'Tout marquer comme lu': D('Tout marquer comme lu', 'Mark all as read'),

    /* --- Profil --- */
    "Nom d'utilisateur": D("Nom d'utilisateur", 'Username'),
    'Dernière connexion': D('Dernière connexion', 'Last sign-in'),
    'Mon profil': D('Mon profil', 'My profile'),
    'Modifier mon profil': D('Modifier mon profil', 'Edit my profile'),
    'Changer mon mot de passe': D('Changer mon mot de passe', 'Change my password'),
    'Profil enregistré.': D('Profil enregistré.', 'Profile saved.'),
    'Mot de passe modifié avec succès. Vos autres sessions ont été fermées.': D(
        'Mot de passe modifié avec succès. Vos autres sessions ont été fermées.',
        'Password changed successfully. Your other sessions have been signed out.',
    ),
    'Mot de passe actuel': D('Mot de passe actuel', 'Current password'),
    'Nouveau mot de passe': D('Nouveau mot de passe', 'New password'),
    'Confirmer le nouveau mot de passe': D('Confirmer le nouveau mot de passe', 'Confirm the new password'),
    'Masquer': D('Masquer', 'Hide'),
    'Afficher': D('Afficher', 'Show'),
    '8 caractères minimum. Les autres sessions actives seront déconnectées.': D(
        '8 caractères minimum. Les autres sessions actives seront déconnectées.',
        'Minimum 8 characters. Other active sessions will be signed out.',
    ),
    'Mot de passe': D('Mot de passe', 'Password'),
    'Nom, matricule, fonction et service proviennent du référentiel agents (réservé au SIT).': D(
        'Nom, matricule, fonction et service proviennent du référentiel agents (réservé au SIT).',
        'Name, staff ID, role and department come from the staff registry (SIT only).',
    ),
    'Modification impossible.': D('Modification impossible.', 'Unable to change.'),
};

/* Langue active : FR par défaut, mémorisée dans localStorage (gpi_lang) */

/* t = traduction d'un texte FR de l'application (dictionnaire DICT) */
export function makeT(langue) {
    return (fr) => {
        if (fr == null) return fr;
        const [frTxt, enTxt] = DICT[fr] ?? [fr, fr];
        return langue === 'en' ? enTxt : frTxt;
    };
}

/* Hook de traduction : { langue, t } */
export function useT() {
    const { langue } = useLangue();
    return { langue, t: makeT(langue) };
}

/* t = traductions de la page de connexion */
export const tConnexion = (langue) => TRADUCTIONS[langue] ?? TRADUCTIONS.fr;

/* Libellé d'un élément de navigation dans la langue courante (fallback FR) */
export const labelNav = (cle, langue) => {
    const [fr, en] = NAV.items[cle] ?? [cle, cle];
    return langue === 'en' ? en : fr;
};

export const labelSection = (cle, langue) => {
    const [fr, en] = NAV.sections[cle] ?? [cle, cle];
    return langue === 'en' ? en : fr;
};

export const labelUi = (cle, langue) => {
    const [fr, en] = NAV.ui[cle] ?? [cle, cle];
    return langue === 'en' ? en : fr;
};
