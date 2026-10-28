import { useEffect, useRef, useState } from 'react';
import { X, Pencil, Eye, EyeOff, KeyRound, User, Mail, Phone, ShieldCheck, Save, Briefcase, MapPin } from 'lucide-react';
import { createPortal } from 'react-dom';
import { api } from '../api';
import { sons } from '../lib/sons';
import { Field, inputClass, ErrorText } from './ui';
import { useAuth } from '../auth';
import { useT } from '../lib/i18n';

const initiales = (nom) =>
    (nom ?? 'U').split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

const Infos = ({ user }) => {
    const { t, langue } = useT();
    const agent = user?.agent;
    const lignes = [
        { icone: User, label: "Nom d'utilisateur", valeur: user?.username ?? '—' },
        { icone: Mail, label: 'Email', valeur: user?.email ?? '—' },
        { icone: Phone, label: 'Téléphone', valeur: agent?.telephone ?? '—' },
        { icone: Briefcase, label: 'Fonction', valeur: agent?.fonction ? t(agent?.fonction) : '—' },
        { icone: MapPin, label: 'Service', valeur: agent?.service ? `${agent.service.nom_service} · ${agent.service.direction?.nom_direction ?? ''}` : '—' },
        { icone: ShieldCheck, label: 'Dernière connexion', valeur: user?.dernier_connexion ? new Date(user.dernier_connexion).toLocaleString(langue === 'en' ? 'en-GB' : 'fr-FR') : '—' },
    ];
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100 border border-slate-200/50">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                    {initiales(agent ? `${agent.prenom} ${agent.nom_naiss}` : user?.username)}
                </div>
                <div className="min-w-0">
                    <div className="font-bold text-slate-800 truncate">
                        {agent ? `${agent.prenom} ${agent.nom_naiss}` : user?.username}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {agent?.matricule && <span className="font-mono text-[11px] text-blue-300">{agent.matricule}</span>}
                        {(user?.roles ?? []).map((r) => (
                            <span key={r.nom_role} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-400 border border-blue-200/50">
                                {r.nom_role}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <dl className="rounded-xl border border-slate-200/50 divide-y divide-slate-100 overflow-hidden">
                {lignes.map(({ icone: Icon, label, valeur }) => (
                    <div key={label} className="flex items-center gap-3 px-3.5 py-2.5">
                        <Icon size={14} className="text-slate-400 shrink-0" />
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 w-36 shrink-0">{t(label)}</span>
                        <span className="text-sm text-slate-700 min-w-0 truncate">{valeur}</span>
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default function ProfilModal({ open, onClose }) {
    const { user, majUtilisateur } = useAuth();
    const { t, langue } = useT();
    const [vue, setVue] = useState('voir'); // 'voir' | 'editer' | 'mdp'
    const [form, setForm] = useState({});
    const [mdp, setMdp] = useState({ mot_de_passe: '', nouveau: '', confirmation: '' });
    const [errors, setErrors] = useState(null);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState(null);
    const [profil, setProfil] = useState(null);
    /* Sichtibilité des champs mot de passe (œil ouvert / fermé par champ). */
    const [voirMdp, setVoirMdp] = useState({ mot_de_passe: false, nouveau: false, confirmation: false });

    /* Garde-fou anti double-clic : quand on clique « Modifier » ou « Mot de
       passe », le bouton « Enregistrer » prend sa place à l'écran. Le navigateur
       peut délivrer le relâchement/clic résiduel sur le NOUVEAU bouton situé à
       la même position, ce qui soumettait le formulaire aussitôt ouvert. On
       ignore donc toute soumission dans les 350 ms qui suivent un changement
       de vue (un vrai clic ne peut pas suivre aussi vite). */
    const changementVueA = useRef(0);

    useEffect(() => {
        if (!open) return;
        setVue('voir');
        setErrors(null);
        setMessage(null);
        setProfil(null);
        api.get('/profil')
            .then(({ data }) => setProfil(data))
            .catch(() => setProfil(user));
    }, [open, user]);

    if (! open) return null;

    const source = profil ?? user;
    const agent = source?.agent;
    const title = vue === 'voir' ? t('Mon profil') : vue === 'editer' ? t('Modifier mon profil') : t('Changer mon mot de passe');
    const bad = vue === 'voir' ? 'bg-blue-600' : 'bg-orange-600';

    const ouvrirEdition = () => {
        setForm({
            username: source?.username ?? '',
            email: source?.email ?? '',
            telephone: agent?.telephone ?? '',
        });
        setErrors(null);
        setMessage(null);
        sons.ouvrir();
        changementVueA.current = Date.now();
        setVue('editer');
    };

    const boutonActif = () => Date.now() - changementVueA.current < 350;

    const enregistrerProfil = async (e) => {
        e.preventDefault();
        if (boutonActif()) return;
        setBusy(true);
        setErrors(null);
        try {
            const { data } = await api.patch('/profil', form);
            majUtilisateur(data);
            setProfil(data);
            setMessage(t('Profil enregistré.'));
            sons.succes();
            setVue('voir');
        } catch (err) {
            sons.alerte();
            setErrors(err.response?.data?.errors ?? { erreur: [err.response?.data?.message ?? t('Enregistrement impossible.')] });
        } finally {
            setBusy(false);
        }
    };

    const enregistrerMdp = async (e) => {
        e.preventDefault();
        if (boutonActif()) return;
        setBusy(true);
        setErrors(null);
        try {
            await api.put('/profil/mot-de-passe', mdp);
            setMdp({ mot_de_passe: '', nouveau: '', confirmation: '' });
            setVoirMdp({ mot_de_passe: false, nouveau: false, confirmation: false });
            setMessage(t('Mot de passe modifié avec succès. Vos autres sessions ont été fermées.'));
            sons.succes();
            setVue('voir');
        } catch (err) {
            sons.alerte();
            setErrors(err.response?.data?.errors ?? { erreur: [err.response?.data?.message ?? t('Modification impossible.')] });
        } finally {
            setBusy(false);
        }
    };

    const fermer = () => { sons.fermer(); onClose(); };

    return createPortal(
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm anim-fade-in"
            onMouseDown={(e) => { if (e.target === e.currentTarget && ! busy) fermer(); }}
        >
            <div className="anim-pop bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col border border-slate-200/50">
                <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-slate-200/50 shrink-0">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${bad}`}>
                            {vue === 'voir' ? <Eye size={13} /> : vue === 'editer' ? <Pencil size={13} /> : <KeyRound size={13} />}
                        </span>
                        {title}
                    </h2>
                    <button onClick={fermer} className="p-1.5 text-slate-400 hover:text-slate-800 transition hover:rotate-90">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto flex-1">
                    {message && (
                        <div className="anim-fade-in mb-3 rounded-lg bg-vert-100 border border-vert-400 px-3 py-2 text-xs font-semibold text-vert-600">
                            {message}
                        </div>
                    )}

                    {vue === 'voir' && <Infos user={source} />}

                    {vue === 'editer' && (
                        <form id="form-profil" onSubmit={enregistrerProfil} className="space-y-3">
                            <ErrorText errors={errors} />
                            <Field label={t("Nom d'utilisateur")} required>
                                <input className={inputClass} value={form.username ?? ''} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
                            </Field>
                            <Field label={t('Email')} required>
                                <input type="email" className={inputClass} value={form.email ?? ''} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                            </Field>
                            <Field label={t('Téléphone')}>
                                <input className={inputClass} value={form.telephone ?? ''} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="+261 …" />
                            </Field>
                            <p className="text-[10px] text-slate-500">
                                Nom, matricule, fonction et service proviennent du référentiel agents (réservé au SIT).
                            </p>
                        </form>
                    )}

                    {vue === 'mdp' && (
                        <form id="form-mdp" onSubmit={enregistrerMdp} className="space-y-3">
                            <ErrorText errors={errors} />
                            <Field label={t('Mot de passe actuel')} required>
                                <div className="relative">
                                    <input
                                        type={voirMdp.mot_de_passe ? 'text' : 'password'}
                                        className={`${inputClass} pr-10`}
                                        value={mdp.mot_de_passe}
                                        onChange={(e) => setMdp({ ...mdp, mot_de_passe: e.target.value })}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setVoirMdp((v) => ({ ...v, mot_de_passe: ! v.mot_de_passe }))}
                                        title={voirMdp.mot_de_passe ? t('Masquer') : t('Afficher')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        {voirMdp.mot_de_passe ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </Field>
                            <Field label={t('Nouveau mot de passe')} required>
                                <div className="relative">
                                    <input
                                        type={voirMdp.nouveau ? 'text' : 'password'}
                                        className={`${inputClass} pr-10`}
                                        value={mdp.nouveau}
                                        onChange={(e) => setMdp({ ...mdp, nouveau: e.target.value })}
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setVoirMdp((v) => ({ ...v, nouveau: ! v.nouveau }))}
                                        title={voirMdp.nouveau ? t('Masquer') : t('Afficher')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        {voirMdp.nouveau ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </Field>
                            <Field label={t('Confirmer le nouveau mot de passe')} required>
                                <div className="relative">
                                    <input
                                        type={voirMdp.confirmation ? 'text' : 'password'}
                                        className={`${inputClass} pr-10`}
                                        value={mdp.confirmation}
                                        onChange={(e) => setMdp({ ...mdp, confirmation: e.target.value })}
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                    />
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setVoirMdp((v) => ({ ...v, confirmation: ! v.confirmation }))}
                                        title={voirMdp.confirmation ? t('Masquer') : t('Afficher')}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-blue-400 transition-colors"
                                    >
                                        {voirMdp.confirmation ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </Field>
                            <p className="text-[10px] text-slate-500">8 caractères minimum. Les autres sessions actives seront déconnectées.</p>
                        </form>
                    )}
                </div>

                <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-slate-200/50 shrink-0">
                    {vue === 'voir' ? (
                        <>
                            <button
                                type="button"
                                onClick={() => { sons.clic(); setErrors(null); setMessage(null); changementVueA.current = Date.now(); setVue('mdp'); }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-card-high text-slate-600 hover:text-blue-400 text-xs font-semibold transition"
                            >
                                <KeyRound size={13} /> {t('Mot de passe')}
                            </button>
                            <button
                                type="button"
                                onClick={ouvrirEdition}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm shadow-orange-600/30 transition active:scale-[.97]"
                            >
                                <Pencil size={13} /> {t('Modifier')}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => { sons.fermer(); setVue('voir'); setErrors(null); }}
                                className="px-3.5 py-2 rounded-lg border border-slate-200/50 text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                            >
                                {t('Annuler')}
                            </button>
                            <button
                                type="submit"
                                form={vue === 'editer' ? 'form-profil' : 'form-mdp'}
                                disabled={busy}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-vert-600 hover:bg-vert-700 disabled:opacity-60 text-white text-xs font-bold shadow-sm shadow-vert-600/30 transition active:scale-[.97]"
                            >
                                <Save size={13} /> {busy ? t('Enregistrement…') : t('Enregistrer')}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    );
}
