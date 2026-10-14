import ResourcePage from '../../components/ResourcePage';

export default function Categories() {
    return (
        <ResourcePage
            titre="Catégories"
            endpoint="/referentiel/categories"
            nomRessource="categories"
            idKey="id_categorie"
            labelElement="Catégorie"
            colonnes={[
                { key: 'code_categorie', label: 'Code', width: 'w-24', mono: true },
                { key: 'nom_categorie', label: 'Nom' },
                { key: 'description', label: 'Description' },
            ]}
            champs={[
                { key: 'code_categorie', label: 'Code' },
                { key: 'nom_categorie', label: 'Nom de la catégorie', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
    );
}
