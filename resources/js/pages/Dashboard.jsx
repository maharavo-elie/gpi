import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Monitor, LifeBuoy, ArrowLeftRight, Wrench, Boxes, BadgeAlert,
    ArrowRight, CircleDollarSign, ShieldCheck, Activity, TrendingUp,
} from 'lucide-react';
import { api } from '../api';
import { Spinner, PageHeader } from '../components/ui';
import { STATUTS_EQUIPEMENT, STATUTS_TICKET, PRIORITES, formatDate, formatAr } from '../lib/constants';
import { useCompteur } from '../lib/useCompteur';
import { useT } from '../lib/i18n';

/* Couleurs du camembert — variables Tailwind, donc thématisables */
const COULEURS_STATUT = {
    en_service: 'var(--color-vert-500)',
    en_stock: 'var(--color-blue-500)',
    en_maintenance: 'var(--color-orange-400)',
    reforme: 'var(--color-slate-400)',
    perdu: 'var(--color-rose-500)',
    reserve: 'var(--color-jaune-400)',
};

const COULEURS_PRIORITE = {
    basse: 'var(--color-slate-400)',
    moyenne: 'var(--color-jaune-400)',
    haute: 'var(--color-orange-400)',
    critique: 'var(--color-rose-500)',
};

const somme = (valeurs) => Object.values(valeurs ?? {}).reduce((total, valeur) => total + (Number(valeur) || 0), 0);

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

    const total = parts.reduce((s, p) => s + p.total, 0);
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
                        const len = total ? (p.total / total) * C : 0;
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
                        {actif ? actif.total : total}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 max-w-[90px] text-center leading-tight">
                        {actif ? actif.label : t('Équipements')}
                    </span>
                </div>
            </div>

            {/* Légende interactive */}
            <ul className="flex-1 w-full space-y-1">
                {parts.map((p) => {
                    const pct = total ? Math.round((p.total / total) * 100) : 0;
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

/* Histogramme d'évolution (entrées / sorties sur 12 mois) en CSS pur :
   2 barres par mois, ascenseur au survol avec détail dans le title. */
function FluxMensuel({ data }) {
    const { t } = useT();
    const max = Math.max(1, ...data.flatMap((d) => [d.entrees, d.sorties]));
    return (
        <div>
            <div className="flex items-end gap-1.5 h-40">
                {data.map((d) => (
                    <div
                        key={d.mois}
                        className="flex-1 flex flex-col items-center gap-1 min-w-0"
                        title={`${d.mois} — ${d.entrees} ${t('entrée(s)')}, ${d.sorties} ${t('sortie(s)')}`}
                    >
                        <div className="w-full flex items-end justify-center gap-0.5 h-32">
                            <div
                                className="w-1/3 max-w-5 rounded-t bg-blue-500 hover:bg-blue-600 transition-all duration-700"
                                style={{ height: `${(d.entrees / max) * 100}%` }}
                            />
                            <div
                                className="w-1/3 max-w-5 rounded-t bg-vert-500 hover:bg-vert-600 transition-all duration-700"
                                style={{ height: `${(d.sorties / max) * 100}%` }}
                            />
                        </div>
                        <span className="text-[8px] font-semibold text-slate-400 truncate w-full text-center">{d.mois.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> {t('Entrées')}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vert-500" /> {t('Sorties')}</span>
            </div>
        </div>
    );
}

/* Barres proportionnelles horizontales : lecture immédiate des écarts. */
function BarresProportion({ entrees, couleur = 'bg-blue-500', traduire = true }) {
    const { t } = useT();
    const liste = Object.entries(entrees);
    const max = Math.max(1, ...liste.map(([, v]) => v));
    return (
        <div className="space-y-2">
            {liste.length === 0 && <p className="text-xs text-slate-400">{t('Aucune donnée.')}</p>}
            {liste.map(([lbl, v]) => (
                <div key={lbl}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="font-semibold text-slate-700 truncate">{traduire ? t(lbl.replace('_', ' ')) : lbl}</span>
                        <span className="text-slate-500 tabular-nums shrink-0">{v}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${couleur}`} style={{ width: `${(v / max) * 100}%` }} />
                    </div>
                </div>
            ))}
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

/* Petite statistique compacte pour les indicateurs secondaires. */
function CarteMini({ label, value, detail, icon: Icon, accent }) {
    return (
        <div className="bg-card rounded-xl border border-slate-200 shadow-sm p-3.5 flex items-center gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 ${accent}`}>
                <Icon size={18} />
            </div>
            <div className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 truncate">{label}</div>
                <div className="text-sm font-bold text-slate-800 tabular-nums truncate">{value}</div>
                {detail && <div className="text-[10px] text-slate-500 truncate">{detail}</div>}
            </div>
        </div>
    );
}

/* Jauge circulaire pour les taux de santé du parc. */
function Jauge({ pourcentage, label, detail, icone: Icon, couleur }) {
    const { t } = useT();
    const pct = Math.max(0, Math.min(100, Math.round(Number(pourcentage) || 0)));
    const rayon = 42;
    const circonference = 2 * Math.PI * rayon;
    const arc = (pct / 100) * circonference;

    return (
        <div className="flex flex-col items-center text-center min-w-0">
            <div className="relative w-[108px] h-[108px]">
                <svg viewBox="0 0 108 108" className="w-full h-full -rotate-90" role="img" aria-label={`${t(label)} : ${pct} %`}>
                    <circle cx="54" cy="54" r={rayon} fill="none" strokeWidth="9" className="stroke-slate-100" />
                    <circle
                        cx="54" cy="54" r={rayon} fill="none" strokeWidth="9"
                        stroke={couleur} strokeLinecap="round"
                        strokeDasharray={`${arc} ${circonference - arc}`}
                        className="transition-all duration-700"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-slate-800 tabular-nums">{pct}%</span>
                    {Icon && <Icon size={12} className="mt-0.5 text-slate-400" />}
                </div>
            </div>
            <span className="mt-2 text-[11px] font-bold text-slate-700">{t(label)}</span>
            <span className="mt-0.5 text-[10px] text-slate-500 leading-tight">{detail}</span>
        </div>
    );
}

/* Courbe lissée par spline de Catmull-Rom, convertie en courbes de Bézier. */
function cheminCourbe(points) {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let chemin = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i - 1] ?? points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] ?? p2;
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        chemin += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return chemin;
}

/* Courbe d'évolution multi-séries avec aires dégradées et points interactifs. */
function CourbeEvolution({ data, series, ariaLabel }) {
    const { t } = useT();
    const identifiant = useId().replace(/[^a-zA-Z0-9_-]/g, '') || 'courbe';

    if (! data || data.length === 0) {
        return <p className="text-xs text-slate-500 py-6 text-center">{t('Aucune donnée.')}</p>;
    }

    const largeur = 600;
    const hauteur = 230;
    const marge = { haut: 14, droite: 14, bas: 30, gauche: 34 };
    const largeurUtile = largeur - marge.gauche - marge.droite;
    const hauteurUtile = hauteur - marge.haut - marge.bas;
    const maximum = Math.max(1, ...data.flatMap((ligne) => series.map((serie) => Number(ligne[serie.key]) || 0)));
    const plafond = Math.max(4, Math.ceil(maximum / 4) * 4);
    const x = (index) => marge.gauche + (index / Math.max(1, data.length - 1)) * largeurUtile;
    const y = (valeur) => marge.haut + hauteurUtile - ((Number(valeur) || 0) / plafond) * hauteurUtile;

    return (
        <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                {series.map((serie) => (
                    <span key={serie.key} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: serie.couleur }} />
                        {t(serie.label)}
                    </span>
                ))}
            </div>
            <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="w-full h-52" role="img" aria-label={ariaLabel}>
                <defs>
                    {series.map((serie, index) => (
                        <linearGradient key={serie.key} id={`${identifiant}-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={serie.couleur} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={serie.couleur} stopOpacity="0.02" />
                        </linearGradient>
                    ))}
                </defs>
                {Array.from({ length: 5 }, (_, index) => {
                    const valeur = Math.round(plafond - (plafond / 4) * index);
                    const ligneY = marge.haut + (hauteurUtile / 4) * index;
                    return (
                        <g key={`grille-${index}`}>
                            <line
                                x1={marge.gauche} y1={ligneY} x2={largeur - marge.droite} y2={ligneY}
                                stroke="var(--color-slate-200)" strokeWidth="1" opacity="0.55"
                            />
                            <text x={marge.gauche - 8} y={ligneY + 3} textAnchor="end" fontSize="9" style={{ fill: 'var(--color-slate-500)' }}>
                                {valeur}
                            </text>
                        </g>
                    );
                })}
                {data.map((ligne, index) => (
                    index % 2 === 0 ? (
                        <text
                            key={`mois-${ligne.mois}`} x={x(index)} y={hauteur - 7} textAnchor="middle"
                            fontSize="9" style={{ fill: 'var(--color-slate-500)' }}
                        >
                            {ligne.mois.split(' ')[0]}
                        </text>
                    ) : null
                ))}
                {series.map((serie, index) => {
                    const points = data.map((ligne, pointIndex) => ({
                        x: x(pointIndex),
                        y: y(ligne[serie.key]),
                        valeur: Number(ligne[serie.key]) || 0,
                        mois: ligne.mois,
                    }));
                    const courbe = cheminCourbe(points);
                    const baseline = marge.haut + hauteurUtile;
                    const aire = `${courbe} L ${points[points.length - 1].x.toFixed(1)} ${baseline} L ${points[0].x.toFixed(1)} ${baseline} Z`;
                    return (
                        <g key={serie.key}>
                            <path d={aire} fill={`url(#${identifiant}-${index})`} />
                            <path
                                d={courbe} fill="none" stroke={serie.couleur} strokeWidth="2.5"
                                strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                            />
                            {points.map((point, pointIndex) => (
                                <circle
                                    key={`${serie.key}-${pointIndex}`}
                                    cx={point.x} cy={point.y} r="2.8"
                                    fill={serie.couleur} stroke="var(--color-card)" strokeWidth="1.5"
                                >
                                    <title>{`${point.mois} — ${t(serie.label)} : ${point.valeur}`}</title>
                                </circle>
                            ))}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

/* Donut compact pour la répartition des tickets par priorité. */
function DonutPriorites({ data }) {
    const { t } = useT();
    const [survol, setSurvol] = useState(null);
    const parts = Object.entries(PRIORITES)
        .map(([key, meta]) => ({
            key,
            label: t(meta.label),
            total: Number(data?.[key] ?? 0) || 0,
            couleur: COULEURS_PRIORITE[key] ?? 'var(--color-slate-400)',
        }))
        .filter((part) => part.total > 0);
    const total = parts.reduce((s, part) => s + part.total, 0);
    const actif = survol ? parts.find((part) => part.key === survol) : null;
    const rayon = 52;
    const circonference = 2 * Math.PI * rayon;
    let cumul = 0;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative shrink-0">
                <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label={t('Répartition des tickets par priorité')}>
                    <circle cx="66" cy="66" r={rayon} fill="none" strokeWidth="18" className="stroke-slate-100" />
                    <g transform="rotate(-90 66 66)">
                        {parts.map((part) => {
                            const longueur = total ? (part.total / total) * circonference : 0;
                            const visible = Math.max(longueur - 3, 0);
                            const offset = -cumul;
                            cumul += longueur;
                            return (
                                <circle
                                    key={part.key}
                                    cx="66" cy="66" r={rayon} fill="none"
                                    strokeWidth={survol === part.key ? 23 : 18}
                                    stroke={part.couleur}
                                    strokeDasharray={`${visible} ${circonference - visible}`}
                                    strokeDashoffset={offset}
                                    className="transition-all duration-500 cursor-pointer"
                                    style={{ opacity: survol && survol !== part.key ? 0.35 : 1 }}
                                    onMouseEnter={() => setSurvol(part.key)}
                                    onMouseLeave={() => setSurvol(null)}
                                />
                            );
                        })}
                    </g>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-800 tabular-nums">{actif ? actif.total : total}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 max-w-[80px] text-center leading-tight">
                        {actif ? actif.label : t('Tickets')}
                    </span>
                </div>
            </div>
            <ul className="flex-1 w-full space-y-1">
                {parts.map((part) => (
                    <li key={part.key}>
                        <button
                            type="button"
                            onMouseEnter={() => setSurvol(part.key)}
                            onMouseLeave={() => setSurvol(null)}
                            onFocus={() => setSurvol(part.key)}
                            onBlur={() => setSurvol(null)}
                            className={`w-full flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                                survol === part.key ? 'bg-slate-100' : 'hover:bg-slate-100/60'
                            }`}
                        >
                            <span className="flex items-center gap-2 min-w-0">
                                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: part.couleur }} />
                                <span className="font-semibold text-slate-700 truncate">{part.label}</span>
                            </span>
                            <span className="tabular-nums text-slate-500 shrink-0">{part.total}</span>
                        </button>
                    </li>
                ))}
                {parts.length === 0 && (
                    <li className="text-xs text-slate-400 py-3 text-center">{t('Aucune donnée.')}</li>
                )}
            </ul>
        </div>
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

    const equipementsTotal = somme(stats.par_statut);
    const enService = Number(stats.par_statut?.en_service) || 0;
    const ticketsTotal = somme(stats.tickets_par_statut);
    const ticketsResolus = (Number(stats.tickets_par_statut?.resolu) || 0) + (Number(stats.tickets_par_statut?.ferme) || 0);
    const tauxDisponibilite = equipementsTotal ? (enService / equipementsTotal) * 100 : 0;
    const tauxAffectation = equipementsTotal ? ((Number(stats.affectations_actives) || 0) / equipementsTotal) * 100 : 0;
    const tauxResolution = ticketsTotal ? (ticketsResolus / ticketsTotal) * 100 : 0;

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

            {/* Santé du parc : jauges + indicateurs financiers et logistiques */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
                <div className="xl:col-span-2 bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Activity size={15} className="text-blue-400" />
                                {t('Santé du parc')}
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1">{t('Indicateurs clés de disponibilité et de traitement')}</p>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-vert-200 bg-vert-100 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-vert-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-vert-400 anim-pulse-dot" />
                            {t('Temps réel')}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                        <Jauge
                            pourcentage={tauxDisponibilite}
                            label="Disponibilité"
                            detail={`${enService} / ${equipementsTotal} ${t('équipements en service')}`}
                            icone={Monitor}
                            couleur="var(--color-vert-500)"
                        />
                        <Jauge
                            pourcentage={tauxAffectation}
                            label="Taux d'affectation"
                            detail={`${Number(stats.affectations_actives) || 0} / ${equipementsTotal} ${t('équipements affectés')}`}
                            icone={ArrowLeftRight}
                            couleur="var(--color-blue-500)"
                        />
                        <Jauge
                            pourcentage={tauxResolution}
                            label="Taux de résolution"
                            detail={`${ticketsResolus} / ${ticketsTotal} ${t('tickets résolus')}`}
                            icone={ShieldCheck}
                            couleur="var(--color-orange-400)"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
                    <CarteMini
                        label={t('Valeur totale du parc')}
                        value={formatAr(stats.valeur_parc)}
                        detail={t('Valorisation des équipements')}
                        icon={CircleDollarSign}
                        accent="text-blue-400"
                    />
                    <CarteMini
                        label={t('Garanties à surveiller')}
                        value={Number(stats.garanties_expirantes) || 0}
                        detail={t('Expirent sous 60 jours')}
                        icon={BadgeAlert}
                        accent="text-orange-400"
                    />
                    <CarteMini
                        label={t('Inventaires en cours')}
                        value={Number(stats.inventaires_cours) || 0}
                        detail={t('Campagnes actives')}
                        icon={Boxes}
                        accent="text-vert-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Répartition par statut — en camembert */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">{t('Répartition par statut')}</h3>
                    <Camembert stats={stats} />
                </div>

                {/* Évolution entrées / sorties sur 12 mois */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={15} className="text-blue-400" />
                        {t('Flux de matériel — 12 derniers mois')}
                    </h3>
                    <FluxMensuel data={stats.flux_mensuels ?? []} />
                </div>
            </div>

            {/* Courbe des tickets + répartition par priorité */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2 bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">{t('Tickets — 12 derniers mois')}</h3>
                            <p className="text-[11px] text-slate-500 mt-1">{t('Créations et résolutions mensuelles')}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-lg font-bold text-slate-800 tabular-nums">{Number(stats.tickets_ouverts) || 0}</div>
                            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{t('ouverts')}</div>
                        </div>
                    </div>
                    <CourbeEvolution
                        data={stats.tickets_mensuels ?? []}
                        series={[
                            { key: 'crees', label: 'Créés', couleur: 'var(--color-blue-500)' },
                            { key: 'resolus', label: 'Résolus', couleur: 'var(--color-vert-500)' },
                        ]}
                        ariaLabel={t('Évolution des tickets créés et résolus')}
                    />
                </div>

                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="text-sm font-bold text-slate-800">{t('Tickets par priorité')}</h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{ticketsTotal} {t('tickets')}</span>
                    </div>
                    <DonutPriorites data={stats.tickets_par_priorite ?? {}} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Par catégorie — barres proportionnelles */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">{t('Par catégorie')}</h3>
                    <BarresProportion
                        entrees={Object.fromEntries(stats.par_categorie.map((c) => [c.nom_categorie, c.total]))}
                        couleur="bg-vert-500"
                        traduire={false}
                    />
                </div>

                {/* Par direction */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">{t('Par direction')}</h3>
                    <BarresProportion
                        entrees={Object.fromEntries(stats.par_direction.map((d) => [d.code_direction, d.total]))}
                        couleur="bg-blue-500"
                        traduire={false}
                    />
                </div>

                {/* Tickets et maintenances */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">{t('Tickets — par statut')}</h3>
                    <BarresProportion entrees={stats.tickets_par_statut ?? {}} couleur="bg-rose-400" />
                    <h3 className="text-sm font-bold text-slate-800 mb-3 mt-5">{t('Maintenances — par statut')}</h3>
                    <BarresProportion entrees={stats.maintenances_par_statut ?? {}} couleur="bg-orange-400" />
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
                        {(stats.derniers_tickets ?? []).map((ticket) => (
                            <div key={ticket.id_ticket} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-slate-100 last:border-0">
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-800 truncate">{ticket.titre}</div>
                                    <div className="text-[11px] text-slate-500">
                                        {ticket.reference_ticket} · {ticket.equipement?.code_inventaire ?? '—'}
                                    </div>
                                </div>
                                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                    ticket.statut === 'ouvert' ? 'bg-rose-100 text-rose-400 border-rose-200'
                                    : ticket.statut === 'en_cours' ? 'bg-orange-100 text-orange-400 border-orange-200'
                                    : ticket.statut === 'resolu' ? 'bg-vert-100 text-vert-400 border-vert-200'
                                    : 'bg-slate-200 text-slate-500 border-slate-300'
                                }`}>
                                    {STATUTS_TICKET[ticket.statut]?.label ?? t(ticket.statut.replace('_', ' '))}
                                </span>
                            </div>
                        ))}
                        {(stats.derniers_tickets ?? []).length === 0 && (
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
                        {(stats.derniers_mouvements ?? []).map((m) => (
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
