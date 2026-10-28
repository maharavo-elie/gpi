import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Lock, Eye, EyeOff, ArrowRight, ShieldCheck, BadgeCheck,
    Database, Wifi, AlertCircle, User, Sun, Moon, Languages,
} from 'lucide-react';
import { useAuth } from '../auth';
import { useSettings } from '../settings';
import { sons } from '../lib/sons';
import { useLangue, tConnexion } from '../lib/i18n';

export default function Connexion() {
    const { login } = useAuth();
    const { settings } = useSettings();
    const navigate = useNavigate();
    const location = useLocation();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);

    // Langue : FR par défaut, choix mémorisé localement (hook partagé avec l'app)
    const { langue, basculer: basculerLangue } = useLangue();
    const t = tConnexion(langue);

    // Mode clair de l'écran de connexion : applique un thème clair sur <html>,
    // et restaure le thème de l'utilisateur en quittant la page.
    const [modeLogin, setModeLogin] = useState(() => localStorage.getItem('gpi_login_mode') ?? 'sombre');
    const themeClairActif = settings.theme?.startsWith('clair');

    useEffect(() => {
        localStorage.setItem('gpi_login_mode', modeLogin);
        const clairVoulu = modeLogin === 'clair';
        if (clairVoulu) {
            document.documentElement.setAttribute('data-theme', themeClairActif ? settings.theme : 'clair-bleu');
        } else {
            document.documentElement.setAttribute('data-theme', themeClairActif ? 'navy' : settings.theme);
        }
        return () => document.documentElement.setAttribute('data-theme', settings.theme);
    }, [modeLogin, settings.theme, themeClairActif]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setBusy(true);
        try {
            await login(identifier, password);
            sons.succes();
            navigate(location.state?.from || '/', { replace: true });
        } catch (err) {
            const msg = err.response?.data?.errors?.email?.[0]
                || err.response?.data?.message
                || t.erreurServeur;
            setError(msg);
            sons.alerte();
        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            className="relative min-h-screen bg-slate-950 text-slate-800 flex items-center justify-center p-4 antialiased"
            style={{
                backgroundImage:
                    'radial-gradient(rgba(37,99,235,0.12) 1px, transparent 0)',
                backgroundSize: '28px 28px',
            }}
        >
            {/* Réglages rapides : langue + mode clair */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                    type="button"
                    onClick={basculerLangue}
                    title={langue === 'fr' ? 'Switch to English' : 'Passer en français'}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-card-high border border-slate-200/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-blue-400 hover:border-blue-400/40 transition"
                >
                    <Languages size={14} />
                    {langue === 'fr' ? 'EN' : 'FR'}
                </button>
                <button
                    type="button"
                    onClick={() => setModeLogin((m) => (m === 'clair' ? 'sombre' : 'clair'))}
                    title={modeLogin === 'clair' ? 'Mode sombre' : 'Mode clair'}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-card-high border border-slate-200/50 text-slate-500 hover:text-blue-400 hover:border-blue-400/40 transition"
                >
                    {modeLogin === 'clair' ? <Moon size={14} /> : <Sun size={14} />}
                </button>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.45)] border border-slate-200/50">
                {/* Colonne gauche : branding étatique (Stitch) */}
                <div className="lg:col-span-5 bg-slate-900 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full filter blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        {/* Badges système */}
                        <div className="flex flex-wrap items-center gap-2 mb-8">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-card-high text-sky-400 font-mono text-[10px] font-medium uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                                MCD SEC-BLOC 01 &amp; 15
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-card-high text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                                SYSTEME_AUTHENTIFICATION_V4.2
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/30 shrink-0">
                                DGSR
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    <ShieldCheck size={12} className="text-sky-400" />
                                    {t.ministere}
                                </div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-800 leading-tight mt-0.5">
                                    DGSR MADAGASCAR
                                </h1>
                                <p className="text-[11px] text-sky-400 font-semibold uppercase tracking-wider">
                                    {t.portail}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 italic mb-8">« Lahitokana ny Aina »</p>

                        {/* Schéma relationnel MCD */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-200/50 mb-4">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                                <Database size={12} className="text-blue-400" />
                                PK_RELATIONAL_PASS
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                                <span className="px-2 py-1 rounded bg-card-high text-blue-300">DIRECTION</span>
                                <span className="px-2 py-1 rounded bg-card-high text-blue-300">SERVICE</span>
                                <span className="px-2 py-1 rounded bg-card-high text-sky-400">AGENT</span>
                                <span className="px-2 py-1 rounded bg-card-high text-sky-400">UTILISATEUR</span>
                            </div>
                            <p className="mt-3 text-[10px] text-slate-500 leading-relaxed">{t.journal}</p>
                        </div>

                        {/* Nœud d'authentification */}
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-200/50 space-y-2.5">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                <Wifi size={12} className="text-sky-400" />
                                {t.noeud}
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="font-mono text-slate-700 font-semibold">SRV-MG-TNR-01</span>
                                <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                    {t.reseau}
                                </span>
                            </div>
                            <div className="h-px bg-slate-200/50" />
                            <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-500 uppercase tracking-wider font-semibold">INTRANET GOV (DGSR-NET)</span>
                                <span className="font-mono text-slate-400">ED25519-SHA512</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-6 mt-6 flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950 border border-slate-200/50 text-slate-500 font-mono uppercase tracking-wider">
                            <Lock size={10} className="text-sky-400" /> TLS 1.3 / EAL4+
                        </span>
                        <span className="text-slate-500 font-semibold uppercase tracking-wider">{t.support}</span>
                    </div>
                </div>

                {/* Colonne droite : formulaire */}
                <div className="lg:col-span-7 bg-slate-900 p-8 sm:p-12 flex flex-col justify-center relative">
                    <div className="max-w-md w-full mx-auto space-y-6">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card-high border border-slate-200/50 text-sky-400 text-[10px] font-bold uppercase tracking-wider mb-4">
                                <BadgeCheck size={12} />
                                {t.accesReserve}
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                                {t.titreForm}
                            </h2>
                            <p className="text-[13px] text-slate-500 mt-1.5">
                                {t.sousTitre}
                            </p>
                        </div>

                        {error && (
                            <div className="anim-shake flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-500">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="identifier" className="flex items-center gap-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                    <User size={11} /> {t.identifiant}
                                </label>
                                <div className="relative rounded-lg">
                                    <input
                                        type="text"
                                        id="identifier"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder={t.placeholderIdent}
                                        autoComplete="username"
                                        className="block w-full px-4 py-2.5 bg-card-high border border-slate-200/50 rounded-lg text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-blue-400 transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="flex items-center gap-1.5 block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                    <Lock size={11} /> {t.cleAcces}
                                </label>
                                <div className="relative rounded-lg">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        autoComplete="current-password"
                                        className="block w-full pl-4 pr-10 py-2.5 bg-card-high border border-slate-200/50 rounded-lg text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-blue-400 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-800"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={busy}
                                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-bold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition-all group"
                            >
                                {busy ? (
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{t.bouton}</span>
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="pt-4 border-t border-slate-200/50 text-center">
                            <p className="text-[11px] text-slate-500 leading-normal">
                                {t.legal}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
