import ResourcePage from '../../components/ResourcePage';
import { badgeActif } from '../../lib/constants';

const badgeStatut = (v) => (v === 'actif'
    ? badgeActif('actif')
    : badgeActif('inactif'));

export default function Sites() {
    return (
        <ResourcePage
            titre="Sites"
            endpoint="/referentiel/sites"
            nomRessource="sites"
            idKey="id_site"
            labelElement="Site"
            filtreStatut={[['actif', 'Actif'], ['inactif', 'Inactif']]}
            colonnes={[
                { key: 'code_site', label: 'Code', width: 'w-24', mono: true },
                { key: 'nom_site', label: 'Site' },
                { key: 'adresse', label: 'Adresse' },
                { key: 'telephone', label: 'Téléphone' },
                { key: 'statut', label: 'Statut', badge: badgeStatut },
            ]}
            champs={[
                { key: 'code_site', label: 'Code' },
                { key: 'nom_site', label: 'Nom du site', required: true },
                { key: 'ville', label: 'Ville' },
                { key: 'adresse', label: 'Adresse' },
                { key: 'telephone', label: 'Téléphone' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'statut', label: 'Statut', type: 'select', options: [['actif', 'Actif'], ['inactif', 'Inactif']] },
            ]}
        />
    );
}
