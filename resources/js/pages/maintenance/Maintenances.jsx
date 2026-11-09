import ResourcePage from '../../components/ResourcePage';
import { ROLES_INTERVENTION } from '../../auth';

const STATUT_BOOT = {
    demandee: 'bg-slate-100 text-slate-600 border-slate-200',
    planifiee: 'bg-slate-100 text-sky-400 border-slate-200',
    en_cours: 'bg-sky-100 text-sky-400 border-sky-200',
    en_attente_piece: 'bg-jaune-100 text-jaune-400 border-jaune-200',
    terminee: 'bg-blue-600 text-white border-blue-600',
    succes: 'bg-vert-100 text-vert-400 border-vert-200',
    hors_service: 'bg-rose-100 text-rose-400 border-rose-200',
    annulee: 'bg-slate-200 text-slate-700 border-slate-300',
};
const STATUT_LIBELLE = {
    demandee: 'Demandée',
    planifiee: 'Planifiée',
    en_cours: 'En cours',
    en_attente_piece: 'En attente de pièce',
    terminee: 'Terminée',
    succes: 'Succès',
    hors_service: 'Hors service',
    annulee: 'Annulée',
};

export default function Maintenances() {
    return (
        <ResourcePage
            titre="Maintenances"
            endpoint="/maintenances"
            nomRessource="maintenances"
            rolesEcriture={ROLES_INTERVENTION}
            idKey="id_maintenance"
            labelElement="Maintenance"
            filtreStatut={Object.entries(STATUT_LIBELLE).map(([v, l]) => [v, l])}
            colonnes={[
                { key: 'equipement', label: 'Équipement', render: (m) => m.equipement ? `${m.equipement.code_inventaire} — ${m.equipement.designation}` : '—' },
                { key: 'type', label: 'Type', render: (m) => m.type?.nom_type ?? '—' },
                { key: 'date_demande', label: 'Demandée le', date: true },
                { key: 'date_debut', label: 'Ouverture', date: true },
                { key: 'date_fin', label: 'Clôture', date: true },
                { key: 'technicien', label: 'Technicien' },
                { key: 'mode_intervention', label: "Mode d'intervention", render: (m) => m.mode_intervention
                    ? <span className={m.mode_intervention === 'externe' ? 'text-orange-500 font-semibold' : 'text-sky-500 font-semibold'}>
                        {m.mode_intervention === 'externe' ? 'Externe' : 'Interne'}
                    </span>
                    : '—' },
                { key: 'statut', label: 'Statut', badge: (v) => STATUT_BOOT[v] ?? 'bg-slate-100 text-slate-700 border-slate-200', badgeLabel: (v) => STATUT_LIBELLE[v] ?? v },
            ]}
            champs={[
                { key: 'id_equipement', label: 'Équipement', type: 'ref', source: 'equipementsMini', idSource: 'id_equipement', get: (e) => `${e.code_inventaire} — ${e.designation}`, required: true },
                { key: 'id_type_maintenance', label: 'Type de maintenance', type: 'ref', source: 'typeMaintenances', idSource: 'id_type_maintenance', get: (t) => t.nom_type, required: true },
                { key: 'statut', label: 'Statut', type: 'select', options: Object.entries(STATUT_LIBELLE) },
                { key: 'technicien', label: 'Technicien' },
                { key: 'mode_intervention', label: "Mode d'intervention", type: 'select', options: [['interne', 'Technicien interne'], ['externe', 'Technicien externe']] },
                { key: 'date_demande', label: 'Date de demande', type: 'date' },
                { key: 'date_debut', label: "Date d'ouverture", type: 'date' },
                { key: 'date_fin', label: 'Date de clôture', type: 'date' },
                { key: 'description_probleme', label: 'Problème décrit', type: 'textarea' },
                { key: 'diagnostic', label: 'Diagnostic', type: 'textarea' },
            ]}
        />
    );
}
