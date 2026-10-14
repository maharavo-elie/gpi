import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import { SettingsProvider } from './settings';
import { sons } from './lib/sons';
import Layout from './components/Layout';
import Connexion from './pages/Connexion';
import Corbeille from './pages/Corbeille';
import Dashboard from './pages/Dashboard';
import Rapports from './pages/Rapports';

// Parc informatique
import Equipements from './pages/parc/Equipements';
import EquipementDetail from './pages/parc/EquipementDetail';
import Categories from './pages/parc/Categories';
import Marques from './pages/parc/Marques';
import Modeles from './pages/parc/Modeles';

// Organisation
import Agents from './pages/organisation/Agents';
import Directions from './pages/organisation/Directions';
import Services from './pages/organisation/Services';

// Localisation
import Sites from './pages/localisation/Sites';
import Batiments from './pages/localisation/Batiments';
import Localisations from './pages/localisation/Localisations';

// Gestion
import Fournisseurs from './pages/gestion/Fournisseurs';
import Achats from './pages/gestion/Achats';
import Affectations from './pages/gestion/Affectations';

// Maintenance
import Maintenances from './pages/maintenance/Maintenances';
import Tickets from './pages/maintenance/Tickets';

// Référentiels divers
import Inventaires from './pages/referentiels/Inventaires';
import Logiciels from './pages/referentiels/Logiciels';

// Système
import Parametres from './pages/systeme/Parametres';
import { Spinner } from './components/ui';

function Protected({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><Spinner /></div>;
    if (! user) return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
    return children;
}

function PublicOnly({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-100"><Spinner /></div>;
    if (user) return <Navigate to="/" replace />;
    return children;
}

// Déverrouillage audio au premier geste utilisateur : sans cela, les navigateurs
// bloquent tout son jusqu'à interaction. On crée le contexte au plus tôt.
const deverrouillerAudio = () => sons.clic();
window.addEventListener('pointerdown', deverrouillerAudio, { once: true, capture: true });

createRoot(document.getElementById('app')).render(
    <SettingsProvider>
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/connexion" element={<PublicOnly><Connexion /></PublicOnly>} />
                <Route element={<Protected><Layout /></Protected>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/equipements" element={<Equipements />} />
                    <Route path="/equipements/:id" element={<EquipementDetail />} />
                    <Route path="/affectations" element={<Affectations />} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="/agents" element={<Agents />} />
                    <Route path="/corbeille" element={<Corbeille />} />
                    <Route path="/inventaires" element={<Inventaires />} />
                    <Route path="/parametres" element={<Parametres />} />
                    <Route path="/directions" element={<Directions />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/sites" element={<Sites />} />
                    <Route path="/batiments" element={<Batiments />} />
                    <Route path="/localisations" element={<Localisations />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/marques" element={<Marques />} />
                    <Route path="/modeles" element={<Modeles />} />
                    <Route path="/fournisseurs" element={<Fournisseurs />} />
                    <Route path="/achats" element={<Achats />} />
                    <Route path="/maintenances" element={<Maintenances />} />
                    <Route path="/logiciels" element={<Logiciels />} />
                    <Route path="/rapports" element={<Rapports />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </AuthProvider>
    </SettingsProvider>,
);
