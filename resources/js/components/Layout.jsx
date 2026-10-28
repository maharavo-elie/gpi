import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Monitor, Users, LifeBuoy, ArrowLeftRight, Boxes,
    LogOut, Menu, X, ShieldCheck, Search, Wifi, Lock, Settings,
    Building2, Network, MapPin, Building, Layers, Tags, Circle, Wrench,
    Truck, ShoppingCart, SlidersHorizontal, Ticket, ClipboardList, Package,
    Archive, Trash2,
    FileBarChart2, Languages,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth, aRole, ROLES_ECRITURE } from '../auth';
import { useSettings } from '../settings';
import { sons } from '../lib/sons';
import { useLangue, labelNav, labelSection, labelUi } from '../lib/i18n';
import FondEcran from './FondEcran';
import { ConfirmModal } from './ui';
import ProfilModal from './Profil';
import Notifications from './Notifications';
import { User } from 'lucide-react';

const sections = [
    {
        label: null,
        items: [
            { to: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
        ],
    },
    {
        label: 'Organisation',
        icone: Building2,
        items: [
            { to: '/directions', label: 'Directions', icon: Building2 },
            { to: '/services', label: 'Services', icon: Network },
            { to: '/agents', label: 'Agents', icon: Users },
        ],
    },
    {
        label: 'Localisation',
        icone: MapPin,
        items: [
            { to: '/sites', label: 'Sites', icon: MapPin },
            { to: '/batiments', label: 'Bâtiments', icon: Building },
            { to: '/localisations', label: 'Localisations', icon: Layers },
        ],
    },
    {
        label: 'Parc informatique',
        icone: Monitor,
        items: [
            { to: '/equipements', label: 'Équipements', icon: Monitor },
            { to: '/categories', label: 'Catégories', icon: Tags },
            { to: '/marques', label: 'Marques', icon: Circle },
            { to: '/modeles', label: 'Modèles', icon: Layers },
        ],
    },
    {
        label: 'Gestion',
        icone: ArrowLeftRight,
        items: [
            { to: '/fournisseurs', label: 'Fournisseurs', icon: Truck },
            { to: '/achats', label: 'Achats', icon: ShoppingCart },
            { to: '/affectations', label: 'Affectations', icon: ArrowLeftRight },
        ],
    },
    {
        label: 'Maintenance',
        icone: Wrench,
        items: [
            { to: '/maintenances', label: 'Maintenances', icon: Wrench },
            { to: '/tickets', label: 'Tickets', icon: LifeBuoy },
        ],
    },
    {
        label: 'Autres',
        icone: Boxes,
        items: [
            { to: '/inventaires', label: 'Inventaires', icon: ClipboardList },
            { to: '/logiciels', label: 'Logiciels', icon: Package },
        ],
    },
    {
        label: 'Rapports',
        icone: FileBarChart2,
        items: [
            { to: '/rapports', label: 'Rapports & Historiques', icon: FileBarChart2 },
        ],
    },
    {
        label: 'Système',
        icone: Settings,
        items: [
            { to: '/corbeille', label: 'Corbeille', icon: Trash2 },
            { to: '/parametres', label: 'Paramètres', icon: Settings },
        ],
    },
];

export default function Layout() {
    const { user, logout } = useAuth();
    const { settings } = useSettings();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [confirmDeconnexion, setConfirmDeconnexion] = useState(false);
    const [deconnexionEnCours, setDeconnexionEnCours] = useState(false);
    const [profilOuvert, setProfilOuvert] = useState(false);

    // Langue de l'interface : FR par défaut, partagee avec la page de connexion
    const { langue, basculer: basculerLangue } = useLangue();

    const handleLogout = async () => {
        setDeconnexionEnCours(true);
        try {
            await logout();
            navigate('/connexion', { replace: true });
        } finally {
            setDeconnexionEnCours(false);
            setConfirmDeconnexion(false);
        }
    };

    const nom = user?.agent ? `${user.agent.prenom} ${user.agent.nom_naiss}` : user?.username;
    const roleLabel = user?.roles?.map((r) => r.nom_role).join(', ') || 'utilisateur';
    const replie = settings.sidebarRepliee && !open;
    const largeurReelle = settings.sidebarRepliee ? '76px' : settings.sidebarElargie ? '320px' : '288px';

    /* Responsive : sur <lg (mobile/tablette), la sidebar est une surcouche
       (open/close) et ne pousse pas le contenu ; le padding ne s'applique
       qu'à partir de 1024px via la media query CSS ci-dessous. */
    const [estGrand, setEstGrand] = useState(() => window.innerWidth >= 1024);
    useEffect(() => {
        const maj = () => setEstGrand(window.innerWidth >= 1024);
        window.addEventListener('resize', maj);
        return () => window.removeEventListener('resize', maj);
    }, []);
    const stylePadding = estGrand ? { paddingLeft: largeurReelle } : null;

    const peutVoirCorbeille = aRole(user, ROLES_ECRITURE);
    const sectionsFiltrees = sections
        .map((s) => ({
            ...s,
            items: s.items.filter((it) => it.to !== '/corbeille' || peutVoirCorbeille),
        }))
        .filter((s) => s.items.length > 0);

    const navLinkClass = ({ isActive }) =>
        `block rounded-lg text-[13px] transition-all active:scale-[.98] ${
            replie ? 'mx-auto w-9 text-center py-2.5' : 'px-3 py-1.5'
        } ${
            isActive
                ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-600/30 anim-glow'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 hover:pl-4'
        }`;

    return (
        <div className="min-h-screen text-slate-800 antialiased">
            {/* Fond d'écran anime : scène du thème ou image perso — peint SOUS le contenu */}
            <FondEcran />

            {/* Sidebar (largeur configurable : 320px par défaut, 76px repliée) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-slate-900 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.35)] transition-all duration-200 lg:translate-x-0 ${
                    replie ? 'w-[76px]' : settings.sidebarElargie ? 'w-80' : 'w-72'
                } ${open ? 'translate-x-0 w-80' : '-translate-x-full'}`}
            >
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Logo */}
                    <div className={`h-16 flex items-center bg-slate-950 border-b border-slate-200/60 shrink-0 ${replie ? 'px-3 justify-center' : 'px-5 gap-3'}`}>
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                            DGSR
                        </div>
                        {! replie && (
                            <>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[15px] font-bold tracking-tight text-slate-800 truncate">
                                        DGSR
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500 truncate">
                                        {labelUi('parcInformatique', langue)}
                                    </span>
                                </div>
                                <button className="lg:hidden ml-auto p-1 text-slate-400 hover:text-slate-800" onClick={() => setOpen(false)}>
                                    <X size={18} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Navigation par domaines */}
                    <nav className={`flex-1 overflow-y-auto py-3 space-y-3 ${replie ? 'px-2' : 'px-3'}`}>
                        {sectionsFiltrees.map((section, i) => (
                            <div key={section.label ?? `s${i}`}>
                                {section.label && ! replie && (
                                    <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                        {section.icone && <section.icone size={11} className="shrink-0" />}
                                        {labelSection(section.label, langue)}
                                    </div>
                                )}
                                <div className="flex flex-col gap-0.5">
                                    {section.items.map(({ to, label, end, icon: Icon }) => (
                                        <NavLink
                                            key={to}
                                            to={to}
                                            end={end}
                                            onClick={() => { setOpen(false); sons.clic(); }}
                                            title={replie ? labelNav(to, langue) : undefined}
                                            className={navLinkClass}
                                        >
                                            {! replie ? (
                                                <span className="flex items-center gap-2">
                                                    {Icon && <Icon size={15} className={replie ? '' : 'shrink-0 opacity-80'} />}
                                                    <span className="truncate">{labelNav(to, langue)}</span>
                                                </span>
                                            ) : (
                                                <Icon size={17} className="mx-auto" />
                                            )}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Statut réseau (signature Stitch) */}
                <div className={`p-4 bg-slate-950 border-t border-slate-200/60 flex items-center ${replie ? 'justify-center' : 'justify-between'}`}>
                    {replie ? (
                        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" title="Réseau DGSR Interne" />
                    ) : (
                        <>
                            <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                                        {labelUi('reseauInterne', langue)}
                                    </span>
                                    <span className="text-[12px] font-mono text-slate-400">VLAN-04 // 10.14.0.0</span>
                                </div>
                            </div>
                            <Wifi size={16} className="text-slate-400" />
                        </>
                    )}
                </div>
            </aside>

            {/* Overlay mobile */}
            {open && <div className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden" onClick={() => setOpen(false)} />}

            {/* Topbar : recherche + session — sur mobile : pleine largeur */}
            <header style={stylePadding}>
                <div
                    className="fixed top-0 right-0 z-30 h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/60 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3 transition-all duration-200"
                    style={estGrand ? { left: largeurReelle } : null}
                >
                    <div className="flex items-center gap-3 flex-1 min-w-0 max-w-2xl">
                        <button aria-label={labelUi('ouvrirMenu', langue)} className="lg:hidden p-1.5 -ml-1.5 shrink-0 text-slate-400 hover:text-slate-800" onClick={() => setOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="relative w-full min-w-0 max-w-md">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                className="w-full min-w-0 h-9 sm:h-10 pl-8 sm:pl-9 pr-2 sm:pr-3 bg-card-high rounded-lg text-slate-700 placeholder:text-slate-400 text-[12px] focus:outline-none focus:bg-slate-50 transition-colors"
                                placeholder={labelUi('rechercher', langue)}
                                title={labelUi('rechercherAstuce', langue)}
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100">
                            <Lock size={14} className="text-sky-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                                {labelUi('confidentiel', langue)}
                            </span>
                        </div>
                        <Notifications />
                        {/* Sélecteur de langue : FR ⇄ EN (mémorisé, partagé avec la connexion) */}
                        <button
                            onClick={() => { sons.clic(); basculerLangue(); }}
                            title={langue === 'fr' ? 'Switch to English' : 'Passer en français'}
                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-500"
                        >
                            <Languages size={15} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                                {langue === 'fr' ? 'EN' : 'FR'}
                            </span>
                        </button>
                        <button
                            onClick={() => { sons.clic(); setProfilOuvert(true); }}
                            title={labelUi('voirProfil', langue)}
                            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
                        >
                            <div className="hidden sm:flex flex-col text-right leading-tight">
                                <span className="text-[11px] font-semibold text-slate-800">{nom}</span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{roleLabel}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                                {(nom ?? 'U').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <User size={13} className="text-slate-400" />
                        </button>
                        <button
                            onClick={() => { sons.clic(); setConfirmDeconnexion(true); }}
                            title={labelUi('seDeconnecter', langue)}
                            className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <LogOut size={17} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Modal profil (voir / modifier / mot de passe) */}
            <ProfilModal open={profilOuvert} onClose={() => setProfilOuvert(false)} />

            {/* Confirmation de déconnexion */}
            <ConfirmModal
                open={confirmDeconnexion}
                title={labelUi('titreDeconnexion', langue)}
                message={nom
                    ? <>{labelUi('fermerSession', langue)} <strong className="text-slate-700">{nom}</strong> ?</>
                    : labelUi('messageDeconnexion', langue)}
                confirmLabel={labelUi('seDeconnecter', langue)}
                cancelLabel={labelUi('resterConnecte', langue)}
                icone={<LogOut size={15} />}
                busyLabel={labelUi('deconnexionEnCours', langue)}
                busy={deconnexionEnCours}
                onConfirm={handleLogout}
                onClose={() => setConfirmDeconnexion(false)}
            />

            {/* Contenu — au-dessus du fond d'écran (z-10 > z-0) */}
            <div style={stylePadding} className="relative z-10 pt-16 transition-all duration-200">
                <main key={location.pathname} className={`anim-fade-up max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 ${settings.densite === 'spacieuse' ? 'py-8 text-[14px]' : settings.densite === 'compacte' ? 'py-4 text-[13px]' : 'py-6'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
