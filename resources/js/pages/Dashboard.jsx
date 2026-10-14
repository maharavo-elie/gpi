import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Monitor, LifeBuoy, ArrowLeftRight, Wrench, Boxes, BadgeAlert,
    TrendingUp, ArrowRight, CircleDollarSign, ShieldCheck,
} from 'lucide-react';
import { api } from '../api';
import { Spinner, PageHeader } from '../components/ui';
import { STATUTS_EQUIPEMENT, formatDate, formatAr } from '../lib/constants';
import { useCompteur } from '../lib/useCompteur';

const ICONS = {
    Ordinateur: Monitor,
    Imprimante: Wrench,
    'Équipement réseau': TrendingUp,
};

/* Carte KPI avec compteur animé */
function CarteKPI({ label, value, icon: Icon, accent, iconText, to }) {
    const compte = useCompteur(value);
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
                Gérer
                <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
        </Link>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/dashboard').then(({ data }) => setStats(data));
    }, []);

    if (! stats) return <Spinner label="Chargement du tableau de bord…" />;

    const cards = [
        { label: 'Matériels répertoriés', value: stats.total_equipements, icon: Monitor, accent: 'bg-blue-600', iconText: 'text-blue-400', to: '/equipements' },
        { label: 'Tickets ouverts', value: stats.tickets_ouverts, icon: LifeBuoy, accent: 'bg-rose-500', iconText: 'text-rose-400', to: '/tickets' },
        { label: 'Maintenances en cours', value: stats.maintenances_cours, icon: Wrench, accent: 'bg-orange-400', iconText: 'text-orange-400', to: '/maintenances' },
        { label: 'Affectations actives', value: stats.affectations_actives, icon: ArrowLeftRight, accent: 'bg-vert-500', iconText: 'text-vert-400', to: '/affectations' },
    ];

    return (
        <div>
            <PageHeader
                title="Tableau de bord"
                subtitle="Vue d'ensemble du parc informatique de la DGSR"
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
                {/* Répartition par statut */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Répartition par statut</h3>
                    <div className="space-y-2.5">
                        {Object.entries(STATUTS_EQUIPEMENT).map(([key, meta]) => {
                            const total = stats.par_statut[key] || 0;
                            const pct = stats.total_equipements ? Math.round((total / stats.total_equipements) * 100) : 0;
                            return (
                                <div key={key}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="font-semibold text-slate-700">{meta.label}</span>
                                        <span className="text-slate-500">{total} · {pct}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                                                key === 'en_service' ? 'bg-vert-500'
                                                : key === 'en_stock' ? 'bg-blue-500'
                                                : key === 'en_maintenance' ? 'bg-orange-400'
                                                : key === 'reforme' ? 'bg-slate-400'
                                                : key === 'perdu' ? 'bg-rose-500' : 'bg-jaune-400'
                                            }`}
                                            style={{ width: stats ? `${pct}%` : '0%' }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Par catégorie */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Par catégorie</h3>
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
                            <CircleDollarSign size={14} /> Valeur totale du parc
                        </span>
                        <span className="font-bold text-slate-800">{formatAr(stats.valeur_parc)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Derniers tickets */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-800">Derniers tickets</h3>
                        <Link to="/tickets" className="text-xs font-semibold text-blue-400 hover:underline">Tout voir</Link>
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
                                    {t.statut.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                        {stats.derniers_tickets.length === 0 && (
                            <p className="text-xs text-slate-500 py-3">Aucun ticket pour le moment.</p>
                        )}
                    </div>
                </div>

                {/* Derniers mouvements */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-slate-800">Derniers mouvements</h3>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <BadgeAlert size={13} /> {stats.garanties_expirantes} garanties &lt; 60 j
                        </span>
                    </div>
                    <div className="space-y-2">
                        {stats.derniers_mouvements.map((m) => (
                            <div key={m.id_mouvement} className="flex items-center justify-between gap-3 text-sm py-2 border-b border-slate-100 last:border-0">
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-800 truncate">
                                        {m.equipement?.designation ?? 'Équipement'}
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
                        Un inventaire est <strong>en cours</strong> — {stats.inventaires_cours} campagne(s) active(s).
                    </span>
                </div>
            )}
        </div>
    );
}
