import { useEffect, useState } from 'react';
import {
    Layout, Building2, Network, Tags, Boxes, Wrench,
    MapPin, Building, Layers, ShieldCheck, Truck, Plus, Pencil, Trash2, RotateCcw, SlidersHorizontal,
    Sun, Moon, Check, Zap, Play, Volume2, Volume1, Image as ImageIcon, Upload,
} from 'lucide-react';
import { api } from '../../api';
import { Spinner, PageHeader, Badge, Field, inputClass, ErrorText, EditModal, ConfirmModal } from '../../components/ui';
import { useSettings, THEMES } from '../../settings';
import { sons, PACKS_SONS } from '../../lib/sons';
import { SCENES } from '../../components/FondEcran';
import { useAuth, aRole, ROLES_ECRITURE } from '../../auth';

/* Boutons d'écoute de la section Sons */
const SONS_TEST = [
    { id: 'clic', label: 'Clic' },
    { id: 'ouvrir', label: 'Ouvrir' },
    { id: 'fermer', label: 'Fermer' },
    { id: 'succes', label: 'Succès' },
    { id: 'alerte', label: 'Alerte' },
    { id: 'tintement', label: 'Thème' },
];

/* Identifiant primaire de chaque type de référentiel */
const ID_KEYS = {
    directions: 'id_direction',
    services: 'id_service',
    categories: 'id_categorie',
    marques: 'id_marque',
    modeles: 'id_modele',
    sites: 'id_site',
    batiments: 'id_batiment',
    localisations: 'id_localisation',
    etats: 'id_etat',
    fournisseurs: 'id_fournisseur',
};

/* Colonnes affichées par type */
const COLONNES = {
    directions: [
        { key: 'code_direction', label: 'Code', width: 'w-20', mono: true },
        { key: 'nom_direction', label: 'Nom' },
        { key: 'email', label: 'Email' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'statut', label: 'Statut', badge: true },
    ],
    services: [
        { key: 'code_service', label: 'Code', width: 'w-20', mono: true },
        { key: 'nom_service', label: 'Nom' },
        { key: 'direction', label: 'Direction', relation: (s) => s.direction?.code_direction ?? '—' },
        { key: 'statut', label: 'Statut', badge: true },
    ],
    categories: [
        { key: 'code_categorie', label: 'Code', width: 'w-20', mono: true },
        { key: 'nom_categorie', label: 'Nom' },
        { key: 'description', label: 'Description' },
    ],
    marques: [
        { key: 'nom_marque', label: 'Nom' },
        { key: 'description', label: 'Description' },
    ],
    modeles: [
        { key: 'nom_modele', label: 'Modèle' },
        { key: 'marque', label: 'Marque', relation: (m) => m.marque?.nom_marque ?? '—' },
        { key: 'categorie', label: 'Catégorie', relation: (m) => m.categorie?.nom_categorie ?? '—' },
    ],
    sites: [
        { key: 'code_site', label: 'Code', width: 'w-20', mono: true },
        { key: 'nom_site', label: 'Site' },
        { key: 'adresse', label: 'Adresse' },
        { key: 'statut', label: 'Statut', badge: true },
    ],
    batiments: [
        { key: 'nom_batiment', label: 'Bâtiment' },
        { key: 'site', label: 'Site', relation: (b) => b.site?.nom_site ?? '—' },
        { key: 'statut', label: 'Statut', badge: true },
    ],
    localisations: [
        { key: 'code_localisation', label: 'Code', width: 'w-24', mono: true },
        { key: 'nom_localisation', label: 'Localisation' },
        { key: 'etage', label: 'Étage', width: 'w-20' },
        { key: 'batiment', label: 'Bâtiment', relation: (l) => l.batiment ? `${l.batiment.nom_batiment} · ${l.batiment.site?.nom_site ?? ''}` : '—' },
        { key: 'statut', label: 'Statut', badge: true },
    ],
    etats: [
        { key: 'nom_etat', label: 'État' },
        { key: 'description', label: 'Description' },
    ],
    fournisseurs: [
        { key: 'raison_sociale', label: 'Raison sociale' },
        { key: 'contact', label: 'Contact' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'email', label: 'Email' },
    ],
};

/* Champs du formulaire d'édition par type */
const FORMULAIRES = {
    directions: [
        { key: 'code_direction', label: 'Code' },
        { key: 'nom_direction', label: 'Nom de la direction', required: true },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'statut', label: 'Statut', type: 'select', options: [['actif', 'Actif'], ['inactif', 'Inactif']] },
    ],
    services: [
        { key: 'code_service', label: 'Code' },
        { key: 'nom_service', label: 'Nom du service', required: true },
        { key: 'id_direction', label: 'Direction', type: 'ref', source: 'directions', get: (d) => d.nom_direction, required: true },
        { key: 'statut', label: 'Statut', type: 'select', options: [['actif', 'Actif'], ['inactif', 'Inactif']] },
    ],
    categories: [
        { key: 'code_categorie', label: 'Code' },
        { key: 'nom_categorie', label: 'Nom de la catégorie', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
    ],
    marques: [
        { key: 'nom_marque', label: 'Nom de la marque', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
    ],
    modeles: [
        { key: 'nom_modele', label: 'Nom du modèle', required: true },
        { key: 'reference_modele', label: 'Référence' },
        { key: 'id_marque', label: 'Marque', type: 'ref', source: 'marques', get: (m) => m.nom_marque },
        { key: 'id_categorie', label: 'Catégorie', type: 'ref', source: 'categories', get: (c) => c.nom_categorie },
    ],
    sites: [
        { key: 'code_site', label: 'Code' },
        { key: 'nom_site', label: 'Nom du site', required: true },
        { key: 'adresse', label: 'Adresse' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'statut', label: 'Statut', type: 'select', options: [['actif', 'Actif'], ['inactif', 'Inactif']] },
    ],
    batiments: [
        { key: 'code_batiment', label: 'Code' },
        { key: 'nom_batiment', label: 'Nom du bâtiment', required: true },
        { key: 'id_site', label: 'Site', type: 'ref', source: 'sites', get: (s) => s.nom_site, required: true },
        { key: 'statut', label: 'Statut', type: 'select', options: [['actif', 'Actif'], ['inactif', 'Inactif']] },
    ],
    localisations: [
        { key: 'code_localisation', label: 'Code' },
        { key: 'nom_localisation', label: 'Nom de la localisation', required: true },
        { key: 'etage', label: 'Étage' },
        { key: 'bureau', label: 'Bureau' },
        { key: 'id_batiment', label: 'Bâtiment', type: 'ref', source: 'batiments', get: (b) => b.nom_batiment, required: true },
        { key: 'statut', label: 'Statut', type: 'select', options: [['actif', 'Actif'], ['inactif', 'Inactif']] },
    ],
    etats: [
        { key: 'nom_etat', label: 'Nom de l\u2019état', required: true },
        { key: 'description', label: 'Description', type: 'textarea' },
    ],
    fournisseurs: [
        { key: 'raison_sociale', label: 'Raison sociale', required: true },
        { key: 'contact', label: 'Personne de contact' },
        { key: 'telephone', label: 'Téléphone' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'adresse', label: 'Adresse' },
        { key: 'rcs', label: 'RCS' },
    ],
};

const ONGLETS = [
    { key: 'directions', label: 'Directions', icon: Building2 },
    { key: 'services', label: 'Services', icon: Network },
    { key: 'sites', label: 'Sites', icon: MapPin },
    { key: 'batiments', label: 'Bâtiments', icon: Building },
    { key: 'localisations', label: 'Localisations', icon: Layers },
    { key: 'categories', label: 'Catégories', icon: Tags },
    { key: 'marques', label: 'Marques', icon: Boxes },
    { key: 'modeles', label: 'Modèles', icon: Wrench },
    { key: 'etats', label: 'États', icon: ShieldCheck },
    { key: 'fournisseurs', label: 'Fournisseurs', icon: Truck },
];

export default function Parametres() {
    const { user } = useAuth();
    const peutEcrire = aRole(user, ROLES_ECRITURE);
    const { settings, update, reset } = useSettings();
    const [urlPerso, setUrlPerso] = useState('');
    const sonsActifs = settings.sons !== false;
    const packActuel = PACKS_SONS.find((p) => p.id === (settings.packSons ?? 'classique'));
    const [ref, setRef] = useState(null);
    const [onglet, setOnglet] = useState('directions');
    const [modal, setModal] = useState(null); // null | { mode, item? }
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState(null);
    const [aSupprimer, setASupprimer] = useState(null);
    const [busySuppression, setBusySuppression] = useState(false);

    const chargeRef = () => api.get('/referentiel').then(({ data }) => setRef(data));
    useEffect(() => { chargeRef(); }, []);

    const type = onglet;
    const items = ref?.[type] ?? [];
    const colonnes = COLONNES[type] ?? [];
    const champs = FORMULAIRES[type] ?? [];
    const idKey = ID_KEYS[type];

    const notifier = (text, typeMsg = 'info') => {
        setMessage({ text, type: typeMsg });
        setTimeout(() => setMessage(null), 4000);
    };

    const ouvrirCreation = () => {
        const vide = {};
        champs.forEach((c) => {
            vide[c.key] = c.type === 'select' ? (c.options?.[0]?.[0] ?? '') : '';
        });
        setForm(vide);
        setErrors(null);
        setModal({ mode: 'create' });
    };

    const ouvrirEdition = (item) => {
        const data = {};
        champs.forEach((c) => { data[c.key] = item[c.key] ?? ''; });
        setForm(data);
        setErrors(null);
        setModal({ mode: 'edit', item });
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors(null);
        try {
            const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v]));
            if (modal?.mode === 'edit') {
                await api.put(`/referentiel/${type}/${modal.item[idKey]}`, payload);
                notifier('Modifications enregistrées.');
            } else {
                await api.post(`/referentiel/${type}`, payload);
                notifier('Élément créé.');
            }
            setModal(null);
            await chargeRef();
        } catch (err) {
            setErrors(err.response?.data?.errors ?? { erreur: [err.response?.data?.message ?? 'Enregistrement impossible.'] });
        } finally {
            setBusy(false);
        }
    };

    const supprimer = (item) => {
        setASupprimer(item);
    };

    const confirmerSuppression = async () => {
        if (! aSupprimer) return;
        setBusySuppression(true);
        try {
            await api.delete(`/referentiel/${type}/${aSupprimer[idKey]}`);
            notifier('Élément supprimé.');
            setASupprimer(null);
            await chargeRef();
        } catch (err) {
            notifier(err.response?.data?.message ?? 'Suppression impossible (élément utilisé ailleurs).', 'error');
        } finally {
            setBusySuppression(false);
        }
    };

    if (! ref) return <Spinner label="Chargement des paramètres…" />;

    return (
        <div>
            <PageHeader title="Paramètres" subtitle="Préférences d'interface et configuration des référentiels" />

            {message && (
                <div className={`mb-4 rounded-lg border p-3 text-sm ${
                    message.type === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-vert-100 border-vert-400 text-vert-600'
                }`}>
                    {message.text}
                </div>
            )}

            {/* Thème : mode clair / sombre + 15 thèmes */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-5 mb-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4">
                    <Sun size={16} className="text-sky-400" /> Thème de l'interface
                </h3>
                {(() => {
                    const modeActuel = THEMES.find((t) => t.id === settings.theme)?.mode ?? 'sombre';
                    const modes = [
                        { id: 'sombre', cible: 'navy', label: 'Mode sombre' },
                        { id: 'clair', cible: 'clair-bleu', label: 'Mode clair' },
                        { id: 'anime', cible: 'jjk', label: '⚡ Anime' },
                    ];
                    return (
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {modes.map(({ id, cible, label }) => (
                                <button
                                    key={id}
                                    onClick={() => {
                                        update({ theme: cible });
                                        sons.tintement();
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                                        modeActuel === id
                                            ? 'bg-blue-600 text-white shadow-sm anim-glow'
                                            : 'bg-slate-100 text-slate-500 hover:bg-card-high hover:text-slate-800 border border-slate-200/50'
                                    }`}
                                >
                                    {id === 'sombre' ? <Moon size={13} /> : id === 'clair' ? <Sun size={13} /> : <Zap size={13} />}
                                    {label}
                                </button>
                            ))}
                        </div>
                    );
                })()}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {THEMES.map((t, i) => {
                        const actif = settings.theme === t.id;
                        const anime = t.mode === 'anime';
                        return (
                            <button
                                key={t.id}
                                onClick={() => { update({ theme: t.id }); sons.tintement(); }}
                                className={`anim-fade-up flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all hover:-translate-y-0.5 ${
                                    actif
                                        ? anime
                                            ? 'border-blue-400 ring-2 ring-blue-600/40 bg-card-high anim-glow'
                                            : 'border-blue-400 ring-2 ring-blue-600/40 bg-card-high'
                                        : 'border-slate-200/50 bg-slate-100 hover:bg-card-high'
                                }`}
                                style={{ animationDelay: `${Math.min(i * 40, 500)}ms` }}
                            >
                                <span
                                    className={`w-10 h-10 rounded-lg shrink-0 border border-slate-300 flex items-center justify-center ${anime && actif ? 'anim-spin-glow' : ''}`}
                                    style={{ background: `linear-gradient(135deg, ${t.apercu[0]} 0%, ${t.apercu[0]} 55%, ${t.apercu[2]} 100%)` }}
                                >
                                    {actif && <Check size={16} className="text-white drop-shadow" />}
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-xs font-bold text-slate-800 truncate">
                                        {anime && <Zap size={10} className="inline text-blue-400 mr-1" />}{t.nom}
                                    </span>
                                    <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                                        {anime ? '⚡ Anime' : t.mode}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Préférences d'interface */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-5 mb-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4">
                    <Layout size={16} className="text-sky-400" /> Interface
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/50 bg-slate-100 p-3.5 cursor-pointer hover:bg-card-high transition">
                        <div>
                            <div className="text-sm font-semibold text-slate-800">Sidebar élargie</div>
                            <div className="text-[11px] text-slate-500">320px au lieu de 288px</div>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.sidebarElargie}
                            onChange={(e) => update({ sidebarElargie: e.target.checked, sidebarRepliee: e.target.checked ? false : settings.sidebarRepliee })}
                            className="w-4 h-4 accent-blue-600"
                        />
                    </label>
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/50 bg-slate-100 p-3.5 cursor-pointer hover:bg-card-high transition">
                        <div>
                            <div className="text-sm font-semibold text-slate-800">Sidebar repliée</div>
                            <div className="text-[11px] text-slate-500">Icônes seules (76px)</div>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.sidebarRepliee}
                            onChange={(e) => update({ sidebarRepliee: e.target.checked })}
                            className="w-4 h-4 accent-blue-600"
                        />
                    </label>
                    <div className="rounded-xl border border-slate-200/50 bg-slate-100 p-3.5">
                        <div className="text-sm font-semibold text-slate-800 mb-1">Densité</div>
                        <select
                            value={settings.densite}
                            onChange={(e) => update({ densite: e.target.value })}
                            className={`${inputClass} py-1.5 text-xs`}
                        >
                            <option value="compacte">Compacte</option>
                            <option value="confortable">Confortable</option>
                            <option value="spacieuse">Spacieuse</option>
                        </select>
                    </div>
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/50 bg-slate-100 p-3.5 cursor-pointer hover:bg-card-high transition">
                        <div>
                            <div className="text-sm font-semibold text-slate-800">Sons d'interface</div>
                            <div className="text-[11px] text-slate-500">Retour sonore sur les actions</div>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.sons !== false}
                            onChange={(e) => { update({ sons: e.target.checked }); if (e.target.checked) sons.tintement(); }}
                            className="w-4 h-4 accent-blue-600"
                        />
                    </label>
                    <div className="rounded-xl border border-slate-200/50 bg-slate-100 p-3.5 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-800">Sons d'interface</div>
                            <div className="text-[11px] text-slate-500">Réglages complets dans la section ci-dessous</div>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.sons !== false}
                            onChange={(e) => { update({ sons: e.target.checked }); if (e.target.checked) sons.tintement(); }}
                            className="w-4 h-4 accent-blue-600"
                        />
                    </div>
                </div>
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-card-high text-slate-600 hover:text-slate-800 text-xs font-semibold"
                    >
                        <RotateCcw size={13} /> Réinitialiser les préférences
                    </button>
                </div>
            </div>

            {/* ============================================================ */}
            {/* Sons — section dédiée */}
            {/* ============================================================ */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Volume2 size={16} className="text-sky-400" /> Sons
                    </h3>
                    {/* Master switch visuel */}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={sonsActifs}
                        onClick={() => { update({ sons: ! sonsActifs }); if (! sonsActifs) setTimeout(() => sons.tintement(), 60); }}
                        className={`relative w-12 h-6.5 rounded-full transition-colors ${sonsActifs ? 'bg-vert-600' : 'bg-slate-300'}`}
                    >
                        <span
                            className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white shadow transition-all ${sonsActifs ? 'left-6' : 'left-0.5'}`}
                        />
                    </button>
                </div>

                <div className={! sonsActifs ? 'opacity-40 pointer-events-none select-none' : 'anim-fade-up'}>
                    {/* Volume + pack côte à côte */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="rounded-xl border border-slate-200/50 bg-slate-100 p-3.5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                    <Volume1 size={14} className="text-sky-400" /> Volume général
                                </span>
                                <span className="font-mono text-xs font-bold text-blue-400">{settings.volumeSon ?? 70}%</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={100}
                                step={5}
                                value={settings.volumeSon ?? 70}
                                onChange={(e) => update({ volumeSon: Number(e.target.value) })}
                                onMouseUp={() => sons.tintement()}
                                onTouchEnd={() => sons.tintement()}
                                className="w-full accent-blue-600 cursor-pointer"
                            />
                            <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">
                                <span>Discret</span><span>Fort</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200/50 bg-slate-100 p-3.5">
                            <div className="text-sm font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                                <Zap size={13} className="text-blue-400" /> Pack de sons
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={settings.packSons ?? 'classique'}
                                    onChange={(e) => { update({ packSons: e.target.value }); sons.tintement(); }}
                                    className={`${inputClass} py-1.5 text-xs flex-1`}
                                >
                                    {PACKS_SONS.map((p) => (
                                        <option key={p.id} value={p.id}>{p.nom} — {p.univers}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1.5 italic">
                                {PACKS_SONS.find((p) => p.id === (settings.packSons ?? 'classique'))?.exemple}
                            </div>
                        </div>
                    </div>

                    {/* Test de chaque son du pack actif */}
                    <div className="rounded-xl border border-slate-200/50 bg-slate-100 p-3.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                            Tester les sons du pack «&nbsp;{packActuel?.nom}&nbsp;» ({packActuel?.univers})
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                            {SONS_TEST.map(({ id, label }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => sons[id]()}
                                    className="inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border border-slate-200/50 bg-card hover:bg-card-high hover:-translate-y-0.5 text-slate-600 hover:text-blue-400 text-xs font-semibold transition-all active:scale-[.95]"
                                >
                                    <Play size={11} className="shrink-0" /> {label}
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2.5">
                            💡 Les sons sont synthétisés en direct (Web Audio API) — aucun fichier à télécharger.
                            Ils se déclenchent automatiquement sur les actions de l'application. Une pastille 🔊 apparaît en bas à droite à chaque son joué —
                            si elle apparaît mais que vous n'entendez rien, montez le volume système ou vérifiez votre périphérique de sortie.
                        </p>
                    </div>
                </div>
            </div>

            {/* ============================================================ */}
            {/* Fond d'écran — section dédiée aux thèmes anime */}
            {/* ============================================================ */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <ImageIcon size={16} className="text-sky-400" /> Fond d'écran (thèmes anime)
                    </h3>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={settings.wallpaper !== false}
                        onClick={() => { update({ wallpaper: settings.wallpaper === false }); sons.clic(); }}
                        className={`relative w-12 h-6.5 rounded-full transition-colors ${settings.wallpaper !== false ? 'bg-vert-600' : 'bg-slate-300'}`}
                    >
                        <span className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white shadow transition-all ${settings.wallpaper !== false ? 'left-6' : 'left-0.5'}`} />
                    </button>
                </div>
                <p className="text-[11px] text-slate-500 mb-4">
                    Chaque thème anime affiche sa scène : Shibuya la nuit (JJK), l'allée des glycines (Demon Slayer),
                    le château de Clover, le portail du Système, la Vallée de la Fin (Naruto), le Grand Line (One Piece).
                    Importez votre propre image de personnage si vous préférez.
                </p>

                <div className={settings.wallpaper === false ? 'opacity-40 pointer-events-none select-none' : ''}>
                    {/* Scènes disponibles (aperçu miniatures) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-4">
                        {Object.entries(SCENES).map(([id, s]) => {
                            const actif = settings.theme === id && ! settings.wallpaperPerso;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => { update({ theme: id, wallpaperPerso: null }); sons.tintement(); }}
                                    className={`anim-fade-up rounded-xl border p-2 text-left transition-all hover:-translate-y-0.5 ${
                                        actif ? 'border-blue-400 ring-2 ring-blue-600/40 bg-card-high' : 'border-slate-200/50 bg-slate-100 hover:bg-card-high'
                                    }`}
                                >
                                    <div className="h-14 rounded-lg mb-1.5 relative overflow-hidden" style={{ background: THEMES.find(t => t.id === id)?.apercu?.[0] ?? '#000' }}>
                                        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 70%, ${THEMES.find(t => t.id === id)?.apercu?.[2] ?? '#666'}44, transparent 70%)` }} />
                                        <span className="absolute bottom-1 left-1.5 text-[8px] font-mono font-bold uppercase tracking-wider text-white/70">{s.univers}</span>
                                    </div>
                                    <span className="block text-[10px] font-bold text-slate-700 truncate">{s.nom}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Voile + image perso */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200/50 bg-slate-100 p-3.5">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-slate-800">Voile de lisibilité</span>
                                <span className="font-mono text-xs font-bold text-blue-400">{settings.wallpaperVoile ?? 55}%</span>
                            </div>
                            <input
                                type="range"
                                min={20}
                                max={90}
                                step={5}
                                value={settings.wallpaperVoile ?? 55}
                                onChange={(e) => update({ wallpaperVoile: Number(e.target.value) })}
                                className="w-full accent-blue-600 cursor-pointer"
                            />
                            <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">
                                <span>Fond visible</span><span>Contenu net</span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200/50 bg-slate-100 p-3.5">
                            <div className="text-sm font-semibold text-slate-800 mb-2">Image personnalisée</div>
                            {settings.wallpaperPerso ? (
                                <div className="flex items-center gap-2.5">
                                    <img src={settings.wallpaperPerso} alt="Fond personnalisé" className="w-16 h-11 object-cover rounded-lg border border-slate-300" />
                                    <button
                                        type="button"
                                        onClick={() => { update({ wallpaperPerso: null }); sons.alerte(); }}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200/60 bg-rose-100 hover:bg-rose-200 text-rose-400 text-xs font-semibold transition active:scale-[.95]"
                                    >
                                        <Trash2 size={12} /> Retirer l'image
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200/50 bg-blue-100 hover:bg-blue-200 text-blue-400 text-xs font-bold cursor-pointer transition active:scale-[.97]">
                                        <Upload size={13} /> Importer depuis votre PC…
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const fichier = e.target.files?.[0];
                                                if (! fichier) return;
                                                if (fichier.size > 4 * 1024 * 1024) {
                                                    notifier('Image trop lourde (max 4 Mo).', 'error');
                                                    sons.alerte();
                                                    return;
                                                }
                                                const lecteur = new FileReader();
                                                lecteur.onload = () => {
                                                    update({ wallpaperPerso: lecteur.result });
                                                    sons.succes();
                                                    notifier('Fond d\u2019écran personnalisé appliqué.');
                                                };
                                                lecteur.readAsDataURL(fichier);
                                            }}
                                        />
                                    </label>
                                    <div className="flex gap-1.5">
                                        <input
                                            type="url"
                                            placeholder="Ou collez l'URL d'une image…"
                                            value={urlPerso}
                                            onChange={(e) => setUrlPerso(e.target.value)}
                                            className={`${inputClass} py-1.5 text-xs flex-1`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (! urlPerso.trim().startsWith('http')) return;
                                                update({ wallpaperPerso: urlPerso.trim() });
                                                setUrlPerso('');
                                                sons.succes();
                                                notifier('Image appliquée depuis l\u2019URL.');
                                            }}
                                            className="shrink-0 inline-flex items-center px-2.5 py-1.5 rounded-lg border border-blue-200/50 bg-blue-100 hover:bg-blue-200 text-blue-400 text-xs font-bold transition active:scale-[.95]"
                                        >
                                            Appliquer
                                        </button>
                                    </div>
                                </div>
                            )}
                            <p className="text-[10px] text-slate-500 mt-2">
                                Votre image (fichier ou URL) remplace la scène — stockée localement, jamais envoyée au serveur.
                                Trouvez n'importe quelle image de personnage sur le web et collez son adresse ici.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration des référentiels */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 flex-wrap gap-3">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <SlidersHorizontal size={16} className="text-sky-400" /> Configuration des interfaces (référentiels)
                    </h3>
                    {peutEcrire && (
                        <button
                            onClick={ouvrirCreation}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-600/25"
                        >
                            <Plus size={15} /> Ajouter
                        </button>
                    )}
                </div>

                {/* Onglets */}
                <div className="px-4 pt-3 flex gap-1 flex-wrap border-b border-slate-200/50">
                    {ONGLETS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setOnglet(key)}
                            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
                                onglet === key
                                    ? 'bg-card-high text-sky-400 border border-b-0 border-slate-200/50'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                        >
                            <Icon size={13} /> {label}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-200/50">
                                {colonnes.map((c) => (
                                    <th key={c.key} className={`px-4 py-2.5 font-bold ${c.width ?? ''}`}>{c.label}</th>
                                ))}
                                <th className="px-4 py-2.5 text-right font-bold w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item) => (
                                <tr key={item[idKey]} className="hover:bg-blue-50/30 transition">
                                    {colonnes.map((c) => (
                                        <td key={c.key} className="px-4 py-2.5 text-slate-700">
                                            {c.relation
                                                ? c.relation(item)
                                                : c.badge
                                                    ? <Badge color={item[c.key] === 'inactif' ? 'bg-rose-100 text-rose-400 border-rose-200' : 'bg-vert-100 text-vert-400 border-vert-200'}>{item[c.key] ?? '—'}</Badge>
                                                    : c.mono
                                                        ? <span className="font-mono text-xs font-semibold text-blue-300">{item[c.key] ?? '—'}</span>
                                                        : (item[c.key] ?? '—')}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {peutEcrire && (
                                                <button
                                                    onClick={() => ouvrirEdition(item)}
                                                    title="Modifier"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-card-high text-slate-600 hover:text-sky-400 text-xs font-semibold transition-colors"
                                                >
                                                    <Pencil size={13} /> Modifier
                                                </button>
                                            )}
                                            {peutEcrire && (
                                                <button
                                                    onClick={() => supprimer(item)}
                                                    title="Supprimer"
                                                    className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-rose-50 hover:text-rose-500 text-slate-600 text-xs font-semibold transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            )}
                                            {!peutEcrire && (
                                                <span className="text-xs text-slate-400 italic">Lecture seule</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={colonnes.length + 1} className="px-4 py-8 text-center text-sm text-slate-500">
                                        Aucun élément — cliquez sur « Ajouter » pour créer le premier.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modale création / édition référentiel */}
            <EditModal
                open={!! modal}
                mode={modal?.mode}
                onClose={() => setModal(null)}
                onSubmit={submit}
                busy={busy}
                title={modal?.mode === 'edit' ? `Modifier — ${ONGLETS.find((o) => o.key === type)?.label}` : `Nouvel élément — ${ONGLETS.find((o) => o.key === type)?.label}`}
                width="max-w-lg"
            >
                <ErrorText errors={errors} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {champs.map((c) => (
                        <Field key={c.key} label={c.label} required={c.required}>
                            {c.type === 'select' ? (
                                <select value={form[c.key] ?? ''} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })} className={inputClass}>
                                    {c.options.map(([v, l]) => (
                                        <option key={v} value={v}>{l}</option>
                                    ))}
                                </select>
                            ) : c.type === 'ref' ? (
                                <select value={form[c.key] ?? ''} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })} className={inputClass}>
                                    <option value="">—</option>
                                    {(ref?.[c.source] ?? []).map((o) => (
                                        <option key={o[ID_KEYS[c.source]]} value={o[ID_KEYS[c.source]]}>{c.get(o)}</option>
                                    ))}
                                </select>
                            ) : c.type === 'textarea' ? (
                                <textarea rows={2} value={form[c.key] ?? ''} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })} className={inputClass} />
                            ) : (
                                <input
                                    type={c.type ?? 'text'}
                                    required={c.required}
                                    value={form[c.key] ?? ''}
                                    onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                                    className={inputClass}
                                />
                            )}
                        </Field>
                    ))}
                </div>
            </EditModal>

            {/* Confirmation de suppression au centre de l'écran */}
            <ConfirmModal
                open={!! aSupprimer}
                message={aSupprimer
                    ? <>Voulez-vous vraiment supprimer <strong className="text-slate-700">« {aSupprimer[colonnes.find((c) => ! c.relation)?.key ?? idKey] ?? aSupprimer[idKey]} »</strong> ? Cette action est définitive.</>
                    : ''}
                busy={busySuppression}
                onConfirm={confirmerSuppression}
                onClose={() => setASupprimer(null)}
            />
        </div>
    );
}
