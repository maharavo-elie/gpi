import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Monitor, LifeBuoy, ArrowLeftRight, Wrench, Boxes, BadgeAlert,
    TrendingUp, ArrowRight, CircleDollarSign, ShieldCheck,
} from 'lucide-react';
import { api } from '../api';
import { Spinner, PageHeader } from '../components/ui';
import { STATUTS_EQUIPEMENT, STATUTS_TICKET, formatDate, formatAr } from '../lib/constants';
import { useCompteur } from '../lib/useCompteur';
import { useT } from '../lib/i18n';

const ICONS = {
    Ordinateur: Monitor,
    Imprimante: Wrench,
    'Équipement réseau': TrendingUp,
};

/* Couleurs du camembert — variables Tailwind, donc thématisables */
const COULEURS_STATUT = {
    en_service: 'var(--color-vert-500)',
    en_stock: 'var(--color-blue-500)',
    en_maintenance: 'var(--color-orange-400)',
    reforme: 'var(--color-slate-400)',
    perdu: 'var(--color-rose-500)',
    reserve: 'var(--color-jaune-400)',
};

/* Camembert (donut) animé de la répartition par statut :
   anneau SVG + centre dynamique + légende interactive synchronisée. */
function Camembert({ stats }) {
    const { t } = useT();
    const [pret, setPret] = useState(false);
    const [survol, setSurvol] = useState(null);

    useEffect(() => {
        const id = setTimeout(() => setPret(true), 100);
        return () => clearTimeout(id);
    }, []);

    const parts = Object.entries(STATUTS_EQUIPEMENT)
        .map(([key, meta]) => ({
            key,
            label: t(meta.label),
            total: stats.par_statut[key] || 0,
            couleur: COULEURS_STATUT[key] ?? 'var(--color-slate-400)',
        }))
        .filter((p) => p.total > 0);

    const somme = parts.reduce((s, p) => s + p.total, 0);
    const R = 64;
    const C = 2 * Math.PI * R;
    let cumul = 0;

    const actif = survol ? parts.find((p) => p.key === survol) : null;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            {/* Anneau */}
            <div className="relative shrink-0">
                <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label={t('Répartition par statut')}>
                    <circle cx="80" cy="80" r={R} fill="none" strokeWidth="22" className="stroke-slate-100" />
                    {parts.map((p) => {
                        const len = somme ? (p.total / somme) * C : 0;
                        const visible = Math.max(len - 3, 0);
                        const offset = -cumul;
                        cumul += len;
                        return (
                            <circle
                                key={p.key}
                                cx="80" cy="80" r={R} fill="none"
                                strokeWidth={survol === p.key ? 27 : 22}
                                stroke={p.couleur}
                                strokeDasharray={pret ? `${visible} ${C - visible}` : `0 ${C}`}
                                strokeDashoffset={offset}
                                className="transition-all duration-700 ease-out cursor-pointer"
                                style={{ opacity: survol && survol !== p.key ? 0.35 : 1 }}
                                onMouseEnter={() => setSurvol(p.key)}
                                onMouseLeave={() => setSurvol(null)}
                            />
                        );
                    })}
                </svg>
                {/* Centre dynamique : total au repos, détail au survol */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-800 tabular-nums">
                        {actif ? actif.total : somme}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 max-w-[90px] text-center leading-tight">
                        {actif ? actif.label : t('Équipements')}
                    </span>
                </div>
            </div>

            {/* Légende interactive */}
            <ul className="flex-1 w-full space-y-1">
                {parts.map((p) => {
                    const pct = somme ? Math.round((p.total / somme) * 100) : 0;
                    const survolSur = survol === p.key;
                    return (
                        <li key={p.key}>
                            <button
                                type="button"
                                onMouseEnter={() => setSurvol(p.key)}
                                onMouseLeave={() => setSurvol(null)}
                                onFocus={() => setSurvol(p.key)}
                                onBlur={() => setSurvol(null)}
                                className={`w-full flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition-all ${
                                    survolSur ? 'bg-slate-100' : 'hover:bg-slate-50'
                                }`}
                            >
                                <span className="flex items-center gap-2 min-w-0">
                                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: p.couleur }} />
                                    <span className={`font-semibold truncate transition-colors ${survolSur ? 'text-slate-800' : 'text-slate-700'}`}>
                                        {p.label}
                                    </span>
                                </span>
                                <span className="tabular-nums text-slate-500 shrink-0">{p.total} · {pct}%</span>
                            </button>
                        </li>
                    );
                })}
                {parts.length === 0 && (
                    <li className="text-xs text-slate-400 py-3 text-center">{t('Aucun équipement trouvé')}</li>
                )}
            </ul>
        </div>
    );
}

/* Carte KPI avec compteur animé */
function CarteKPI({ label, value, icon: Icon, accent, iconText, to }) {
    const compte = useCompteur(value);
    const { t } = useT();
    return (
        <Link
            to={to}
            className="anim-fade-up bg-card rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 transition-all duration-200 group"
        >
            <div className={`absolute top-0 left-0 right-0 h-1 ${accent}`} />
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
                    <span className="text-[24px] sm:text-[32px] leading-8 sm:leading-10 font-bold text-slate-800 tabular-nums">{compte}</span>
                </div>
                <div className={`p-2.5 rounded-lg bg-slate-100 ${iconText} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={22} />
                </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500 font-medium flex items-center gap-1">
                {t('Gérer')}
                <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
        </Link>
    );
}

export default function Dashboard() {
    const { t } = useT();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/dashboard').then(({ data }) => setStats(data));
    }, []);

    if (! stats) return <Spinner label={t('Chargement du tableau de bord…')} />;

    const cards = [
        { label: t('Matériels répertoriés'), value: stats.total_equipements, icon: Monitor, accent: 'bg-blue-600', iconText: 'text-blue-400', to: '/equipements' },
        { label: t('Tickets ouverts'), value: stats.tickets_ouverts, icon: LifeBuoy, accent: 'bg-rose-500', iconText: 'text-rose-400', to: '/tickets' },
        { label: t('Maintenances en cours'), value: stats.maintenances_cours, icon: Wrench, accent: 'bg-orange-400', iconText: 'text-orange-400', to: '/maintenances' },
        { label: t('Affectations actives'), value: stats.affectations_actives, icon: ArrowLeftRight, accent: 'bg-vert-500', iconText: 'text-vert-400', to: '/affectations' },
    ];

    return (
        <div>
            <PageHeader
                title={t('Tableau de bord')}
                subtitle={t("Vue d'ensemble du parc informatique de la DGSR")}
            />

            {/* Orbes décoratifs flottants en arrière-plan, teintés par l'aura du thème */}
            <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div className="anim-float absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl" style={{ background: 'var(--aura-1, rgba(37,99,235,.10))' }} />
                <div className="anim-float absolute top-1/2 -left-32 w-80 h-80 rounded-full blur-3xl" style={{ background: 'var(--aura-2, rgba(0,166,224,.07))', animationDelay: '-4.5s' }} />
                <div className="anim-float absolute -bottom-32 right-1/4 w-72 h-72 rounded-full blur-3xl" style={{ background: 'var(--aura-1, rgba(37,99,235,.10))', animationDelay: '-8s', opacity: .6 }} />
            </div>

            {/* Cartes principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {cards.map(({ label, value, icon: Icon, accent, iconText, to }, i) => (
                    <div key={label} className={`anim-fade-up anim-d${i + 1} lift rounded-xl`}>
                        <CarteKPI label={label} value={value} icon={Icon} accent={accent} iconText={iconText} to={to} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Répartition par statut — en camembert */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">{t('Répartition par statut')}</h3>
                    <Camembert stats={stats} />
                </div>

                {/* Par catégorie */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">{t('Par catégorie')}</h3>
                    <div className="space-y-2">
                        {stats.par_categorie.map((c) => (
                            <div key={c.nom_categorie} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                                <span className="text-slate-700 font-medium">{c.nom_categorie}</span>
                                <span className="font-bold text-slate-800">{c.total}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1.5">
                            <CircleDollarSign size={14} /> {t('Valeur totale du parc')}
                        </span>
                        <span className="font-bold text-slate-800">{formatAr(stats.valeur_parc)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Derniers tickets */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-800">{t('Derniers tickets')}</h3>
                        <Link to="/tickets" className="text-xs font-semibold text-blue-400 hover:underline">{t('Tout voir')}</Link>
                    </div>
                    <div className="space-y-2">
                        {stats.derniers_tickets.map((t) => (
                            <div key={t.id_ticket} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-slate-100 last:border-0">
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-800 truncate">{t.titre}</div>
                                    <div className="text-[11px] text-slate-500">
                                        {t.reference_ticket} · {t.equipement?.code_inventaire ?? '—'}
                                    </div>
                                </div>
                                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    t.statut === 'ouvert' ? 'bg-rose-100 text-rose-400 border-rose-200'
                                    : t.statut === 'en_cours' ? 'bg-orange-100 text-orange-400 border-orange-200'
                                    : t.statut === 'resolu' ? 'bg-vert-100 text-vert-400 border-vert-200'
                                    : 'bg-slate-200 text-slate-500 border-slate-300'
                                }`}>
                                    {STATUTS_TICKET[t.statut]?.label ?? t(t.statut.replace('_', ' '))}
                                </span>
                            </div>
                        ))}
                        {stats.derniers_tickets.length === 0 && (
                            <p className="text-xs text-slate-500 py-3">{t('Aucun ticket pour le moment.')}</p>
                        )}
                    </div>
                </div>

                {/* Derniers mouvements */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-800">{t('Derniers mouvements')}</h3>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <BadgeAlert size={13} /> {stats.garanties_expirantes} {t('garanties < 60 j')}
                        </span>
                    </div>
                    <div className="space-y-2">
                        {stats.derniers_mouvements.map((m) => (
                            <div key={m.id_mouvement} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-slate-100 last:border-0">
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-800 truncate">
                                        {m.equipement?.designation ?? t('Équipement')}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        {m.type_mouvement} · {formatDate(m.date_mouvement)}
                                    </div>
                                </div>
                                <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                    {m.equipement?.code_inventaire ?? '—'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {stats.inventaires_cours > 0 && (
                <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-200 p-4 flex items-center gap-3 text-sm text-blue-300">
                    <Boxes size={18} className="text-blue-400" />
                    <span>
                        {t('Un inventaire est ')}<strong>{t('en cours')}</strong> — {stats.inventaires_cours} {t(' campagne(s) active(s).')}
                    </span>
                </div>
            )}
        </div>
    );
}
