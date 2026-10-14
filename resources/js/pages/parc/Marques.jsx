import ResourcePage from '../../components/ResourcePage';

export default function Marques() {
    return (
        <ResourcePage
            titre="Marques"
            endpoint="/referentiel/marques"
            nomRessource="marques"
            idKey="id_marque"
            labelElement="Marque"
            colonnes={[
                { key: 'nom_marque', label: 'Nom' },
                { key: 'description', label: 'Description' },
            ]}
            champs={[
                { key: 'nom_marque', label: 'Nom de la marque', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
    );
}
