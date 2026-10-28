import { champTraduit as L } from './i18n';

/*
 * Code couleur sémantique :
 *   VERT   = actif / en service / résolu / terminé / livré
 *   ROUGE  = inactif / perdu / critique / annulé / ouvert (alerte)
 *   ORANGE = en maintenance / en cours / haute priorité / partiel
 *   JAUNE  = réserve / congé / planifié / priorité moyenne
 *   GRIS   = réformé / fermé / neutre
 *   BLEU   = information, éléments neufs en stock
 */
export const STATUTS_EQUIPEMENT = {
    en_service: { ...L('En service', 'In service'), color: 'bg-vert-100 text-vert-400 border-vert-200' },
    en_stock: { ...L('En stock', 'In stock'), color: 'bg-blue-100 text-blue-300 border-blue-200' },
    en_maintenance: { ...L('En maintenance', 'Under maintenance'), color: 'bg-orange-100 text-orange-400 border-orange-200' },
    reforme: { ...L('Réformé', 'Decommissioned'), color: 'bg-slate-200 text-slate-500 border-slate-300' },
    perdu: { ...L('Perdu', 'Lost'), color: 'bg-rose-100 text-rose-400 border-rose-200' },
    reserve: { ...L('Réservé', 'Reserved'), color: 'bg-jaune-100 text-jaune-400 border-jaune-200' },
};

export const PRIORITES = {
    basse: { ...L('Basse', 'Low'), color: 'bg-slate-100 text-slate-500 border-slate-200' },
    moyenne: { ...L('Moyenne', 'Medium'), color: 'bg-jaune-100 text-jaune-400 border-jaune-200' },
    haute: { ...L('Haute', 'High'), color: 'bg-orange-100 text-orange-400 border-orange-200' },
    critique: { ...L('Critique', 'Critical'), color: 'bg-rose-100 text-rose-400 border-rose-200' },
};

export const STATUTS_TICKET = {
    ouvert: { ...L('Ouvert', 'Open'), color: 'bg-rose-100 text-rose-400 border-rose-200' },
    en_cours: { ...L('En cours', 'In progress'), color: 'bg-orange-100 text-orange-400 border-orange-200' },
    resolu: { ...L('Résolu', 'Resolved'), color: 'bg-vert-100 text-vert-400 border-vert-200' },
    ferme: { ...L('Fermé', 'Closed'), color: 'bg-slate-200 text-slate-500 border-slate-300' },
};

export const STATUTS_MAINTENANCE = {
    demandee: { ...L('Demandée', 'Requested'), color: 'bg-slate-100 text-slate-500 border-slate-200' },
    planifiee: { ...L('Planifiée', 'Scheduled'), color: 'bg-jaune-100 text-jaune-400 border-jaune-200' },
    en_cours: { ...L('En cours', 'In progress'), color: 'bg-orange-100 text-orange-400 border-orange-200' },
    terminee: { ...L('Terminée', 'Completed'), color: 'bg-vert-100 text-vert-400 border-vert-200' },
    annulee: { ...L('Annulée', 'Cancelled'), color: 'bg-rose-100 text-rose-400 border-rose-200' },
};

export const STATUTS_ACHAT = {
    commande: { ...L('Commandé', 'Ordered'), color: 'bg-blue-100 text-blue-300 border-blue-200' },
    livre_partiel: { ...L('Livré partiel', 'Partially delivered'), color: 'bg-orange-100 text-orange-400 border-orange-200' },
    livre: { ...L('Livré', 'Delivered'), color: 'bg-vert-100 text-vert-400 border-vert-200' },
    annule: { ...L('Annulé', 'Cancelled'), color: 'bg-rose-100 text-rose-400 border-rose-200' },
};

/* Actif / Inactif : le duo demandé — vert / rouge */
export const STATUTS_ACTIF = {
    actif: { ...L('Actif', 'Active'), color: 'bg-vert-100 text-vert-400 border-vert-200' },
    inactif: { ...L('Inactif', 'Inactive'), color: 'bg-rose-100 text-rose-400 border-rose-200' },
};

export const badgeActif = (valeur) => STATUTS_ACTIF[valeur]?.color
    ?? (valeur === 'actif' ? STATUTS_ACTIF.actif.color : STATUTS_ACTIF.inactif.color);

export function formatDate(value, langue) {
    if (! value) return '—';
    const lang = langue ?? (() => {
        try { return localStorage.getItem('gpi_lang') || 'fr'; } catch { return 'fr'; }
    })();
    return new Date(value).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatAr(value, langue) {
    if (value == null) return '—';
    const lang = langue ?? (() => {
        try { return localStorage.getItem('gpi_lang') || 'fr'; } catch { return 'fr'; }
    })();
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-MG', { maximumFractionDigits: 0 }).format(value) + ' Ar';
}
