import ResourcePage from '../../components/ResourcePage';
import { formatAr } from '../../lib/constants';

const BADGES = {
    commande: 'bg-sky-100 text-sky-400 border-sky-200',
    livre_partiel: 'bg-orange-100 text-orange-400 border-orange-200',
    livre: 'bg-vert-100 text-vert-400 border-vert-200',
    annule: 'bg-rose-100 text-rose-400 border-rose-200',
};
const LABELS = { commande: 'Commandé', livre_partiel: 'Livré partiel', livre: 'Livré', annule: 'Annulé' };

export default function Achats() {
    return (
        <ResourcePage
            titre="Achats"
            endpoint="/achats"
            nomRessource="achats"
            idKey="id_achat"
            labelElement="Achat"
            filtreStatut={Object.entries(LABELS).map(([v, l]) => [v, l])}
            colonnes={[
                { key: 'reference_achat', label: 'Référence', mono: true },
                { key: 'date_achat', label: 'Date', date: true },
                { key: 'numero_facture', label: 'Facture', mono: true },
                { key: 'fournisseur', label: 'Fournisseur', render: (a) => a.fournisseur?.raison_sociale ?? '—' },
                { key: 'montant_total', label: 'Montant', render: (a) => (a.montant_total != null ? formatAr(a.montant_total) : '—') },
                { key: 'statut', label: 'Statut', badge: (v) => BADGES[v] ?? 'bg-slate-100 text-slate-700 border-slate-200', badgeLabel: (v) => LABELS[v] ?? v },
            ]}
            champs={[
                { key: 'reference_achat', label: 'Référence (ACH-2026-001)' },
                { key: 'date_achat', label: 'Date de l\u2019achat', type: 'date' },
                { key: 'id_fournisseur', label: 'Fournisseur', type: 'ref', source: 'fournisseurs', idSource: 'id_fournisseur', get: (f) => f.raison_sociale },
                { key: 'numero_facture', label: 'N° de facture' },
                { key: 'bon_commande', label: 'Bon de commande' },
                { key: 'montant_total', label: 'Montant total (Ar)', type: 'number' },
                { key: 'statut', label: 'Statut', type: 'select', options: Object.entries(LABELS) },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
    );
}
