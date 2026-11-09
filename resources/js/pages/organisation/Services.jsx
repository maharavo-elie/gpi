import ResourcePage from '../../components/ResourcePage';
import { badgeActif } from '../../lib/constants';

const badgeStatut = (v) => (v === 'actif'
    ? badgeActif('actif')
    : badgeActif('inactif'));

export default function Services() {
    return (
        <ResourcePage
            titre="Services"
            endpoint="/referentiel/services"
            nomRessource="services"
            idKey="id_service"
            labelElement="Service"
            filtreStatut={[['actif', 'Actif'], ['inactif', 'Inactif']]}
            colonnes={[
                { key: 'code_service', label: 'Code', width: 'w-24', mono: true },
                { key: 'nom_service', label: 'Nom' },
                { key: 'direction', label: 'Direction', render: (s) => s.direction?.nom_direction ?? '—' },
                { key: 'statut', label: 'Statut', badge: badgeStatut },
            ]}
            champs={[
                { key: 'id_direction', label: "Direction d'attachement", type: 'ref', source: 'directions', idSource: 'id_direction', get: (d) => d.nom_direction, required: true },
                { key: 'nom_service', label: 'Nom du service', required: true },
                { key: 'code_service', label: 'Code (généré si vide)' },
                { key: 'statut', label: 'Statut', type: 'select', options: [['actif', 'Actif'], ['inactif', 'Inactif']] },
            ]}
        />
    );
}
