import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    FileBarChart2, ArrowLeftRight, History, Download, FileText, Search, ChevronLeft, ChevronRight,
    Monitor, CircleDollarSign, ShoppingCart, Wrench, LifeBuoy, Boxes, RefreshCw, ExternalLink, Trash2,
} from 'lucide-react';
import { api } from '../api';
import { Spinner, PageHeader, EmptyState, Badge, ConfirmModal } from '../components/ui';
import { useAuth, ROLES_ECRITURE, aRole } from '../auth';
import { STATUTS_EQUIPEMENT, formatDate, formatAr } from '../lib/constants';
import { sons } from '../lib/sons';
import { useT } from '../lib/i18n';

/* ============================================================
   Méta : types de mouvements, journal, presets de période
   ============================================================ */
const TYPES_MOUVEMENT = {
    stock: { label: 'Entrée en stock', color: 'bg-blue-100 text-blue-300 border-blue-200', icon: Boxes },
    affectation: { label: 'Affectation', color: 'bg-vert-100 text-vert-400 border-vert-200', icon: ArrowLeftRight },
    restitution: { label: 'Restitution', color: 'bg-jaune-100 text-jaune-400 border-jaune-200', icon: RefreshCw },
    transfert: { label: 'Transfert', color: 'bg-orange-100 text-orange-400 border-orange-200', icon: ArrowLeftRight },
    maintenance: { label: 'Maintenance', color: 'bg-orange-100 text-orange-400 border-orange-200', icon: Wrench },
    reforme: { label: 'Réforme', color: 'bg-slate-200 text-slate-500 border-slate-300', icon: Boxes },
};

const ONGLETS = [
    { key: 'synthese', label: 'Synthèse', icon: FileBarChart2 },
    { key: 'mouvements', label: 'Mouvements de matériel', icon: ArrowLeftRight },
    { key: 'journal', label: "Journal d'activité", icon: History },
];

const PRESETS = [
    { key: 'annee', label: 'Année en cours' },
    { key: '12m', label: '12 derniers mois' },
    { key: 'trimestre', label: '90 derniers jours' },
    { key: 'mois', label: '30 derniers jours' },
];

const presetVersDates = (preset) => {
    const fin = new Date();
    const debut = new Date();
    if (preset === 'annee') debut.setMonth(0, 1);
    else if (preset === '12m') debut.setMonth(debut.getMonth() - 11, 1);
    else if (preset === 'trimestre') debut.setDate(debut.getDate() - 90);
    else debut.setDate(debut.getDate() - 30);
    const iso = (d) => d.toISOString().slice(0, 10);
    return { date_debut: iso(debut), date_fin: iso(fin) };
};

/* ============================================================
   Petites briques d'affichage
   ============================================================ */
function CarteKPI({ label, value, icon: Icon, iconText }) {
    return (
        <div className="bg-card rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">{label}</div>
                <div className="text-2xl font-bold text-slate-800 tabular-nums">{value}</div>
            </div>
            <div className={`p-2.5 rounded-lg bg-slate-100 shrink-0 ${iconText}`}>
                <Icon size={20} />
            </div>
        </div>
    );
}

function EnteteCarte({ title, action }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">{title}</h3>
            {action}
        </div>
    );
}

/* Histogramme « entrées / sorties » en CSS pur (2 barres par mois) */
function GraphiqueFlux({ data }) {
    const { t } = useT();
    const max = Math.max(1, ...data.flatMap((d) => [d.entrees, d.sorties]));
    return (
        <div className="flex items-end gap-2 h-44">
            {data.map((d) => (
                <div key={d.mois} className="flex-1 flex flex-col items-center gap-1.5 min-w-0" title={`${d.mois} — ${d.entrees} ${t('entrée(s)')}, ${d.sorties} ${t('sortie(s)')}`}>
                    <div className="w-full flex items-end justify-center gap-0.5 h-32">
                        <div className="w-1/3 max-w-4 rounded-t bg-blue-500 transition-all duration-700" style={{ height: `${(d.entrees / max) * 100}%` }} />
                        <div className="w-1/3 max-w-4 rounded-t bg-vert-500 transition-all duration-700" style={{ height: `${(d.sorties / max) * 100}%` }} />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 truncate w-full text-center">{d.mois}</span>
                </div>
            ))}
        </div>
    );
}

function BarreProportion({ label, total, max, color = 'bg-blue-500' }) {
    const pct = max ? Math.round((total / max) * 100) : 0;
    return (
        <div>
            <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 truncate">{label}</span>
                <span className="text-slate-500 tabular-nums">{total}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function Pagination({ page, lastPage, total, onNavigate }) {
    const { t } = useT();
    if (!total) return null;
    return (
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
                {t('Page ')}{page} / {lastPage} — {total} {t('entrée(s)')}
            </span>
            <div className="flex items-center gap-1">
                <button
                    disabled={page <= 1}
                    onClick={() => { sons.clic(); onNavigate(page - 1); }}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={14} />
                </button>
                <button
                    disabled={page >= lastPage}
                    onClick={() => { sons.clic(); onNavigate(page + 1); }}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}

function ChampRecherche({ value, onChange, placeholder }) {
    return (
        <div className="relative flex-1 min-w-52">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                type="text"
                className="w-full h-9 pl-9 pr-3 bg-card-high rounded-lg text-slate-700 placeholder:text-slate-400 text-xs focus:outline-none focus:bg-slate-50 border border-slate-200 transition-colors"
            />
        </div>
    );
}

function ChampDate({ value, onChange }) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type="date"
            className="h-9 px-2.5 bg-card-high rounded-lg text-slate-700 text-xs focus:outline-none border border-slate-200"
        />
    );
}

function BoutonExport({ onClick, busy }) {
    const { t } = useT();
    return (
        <button
            onClick={onClick}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-600 text-xs font-bold transition-all active:scale-[.97]"
        >
            <Download size={14} /> {busy ? t('Export…') : 'CSV'}
        </button>
    );
}

/* Télécharge un blob (PDF/CSV) généré par l'API */
function telecharger(url, params, nomFichier) {
    return api.get(url, { params, responseType: 'blob' }).then((res) => {
        const urlBlob = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = nomFichier;
        a.click();
        URL.revokeObjectURL(urlBlob);
        sons.succes();
    });
}

function BoutonPDF({ onClick, busy }) {
    const { t } = useT();
    return (
        <button
            onClick={onClick}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold shadow-sm shadow-blue-600/30 transition-all active:scale-[.97]"
        >
            <FileText size={14} /> {busy ? t('Génération…') : t('Imprimer PDF')}
        </button>
    );
}

/* ============================================================
   Onglet 1 — Synthèse consolidée
   ============================================================ */
function OngletSynthese({ dates }) {
    const { t } = useT();
    const [data, setData] = useState(null);
    const [pdfBusy, setPdfBusy] = useState(false);

    useEffect(() => {
        setData(null);
        api.get('/rapports/synthese', { params: dates }).then(({ data }) => setData(data));
    }, [dates.debut, dates.fin]); // eslint-disable-line react-hooks/exhaustive-deps

    const exporterPDF = async () => {
        setPdfBusy(true);
        try {
            await telecharger('/rapports/pdf/synthese', dates, `rapport_synthese_${new Date().toISOString().slice(0, 10)}.pdf`);
        } finally {
            setPdfBusy(false);
        }
    };

    if (! data) return <Spinner label={t('Calcul de la synthèse…')} />;

    const k = data.kpi;
    const maxDirection = Math.max(1, ...data.par_direction.map((d) => d.total));
    const maxCategorie = Math.max(1, ...data.par_categorie.map((c) => c.total));

    return (
        <div className="space-y-4">
            {/* Barre d'actions du rapport */}
            <div className="flex items-center justify-end gap-2">
                <BoutonPDF onClick={exporterPDF} busy={pdfBusy} />
            </div>

            {/* KPI principaux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <CarteKPI label={t('Matériels répertoriés')} value={k.total_equipements} icon={Monitor} iconText="text-blue-400" />
                <CarteKPI label={t('Valeur du parc')} value={formatAr(k.valeur_parc)} icon={CircleDollarSign} iconText="text-vert-400" />
                <CarteKPI label={t('Mouvements sur la période')} value={k.mouvements_periode} icon={ArrowLeftRight} iconText="text-orange-400" />
                <CarteKPI label={t('Achats sur la période')} value={`${k.achats_periode} · ${formatAr(k.depenses_periode)}`} icon={ShoppingCart} iconText="text-blue-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-3">
                <CarteKPI label={t('En service')} value={k.en_service} icon={Monitor} iconText="text-vert-400" />
                <CarteKPI label={t('En stock')} value={k.en_stock} icon={Boxes} iconText="text-blue-400" />
                <CarteKPI label={t('En maintenance')} value={k.en_maintenance} icon={Wrench} iconText="text-orange-400" />
                <CarteKPI label={t('Tickets ouverts')} value={k.tickets_ouverts} icon={LifeBuoy} iconText="text-rose-400" />
                <CarteKPI label={t('Affectations actives')} value={k.affectations_actives} icon={ArrowLeftRight} iconText="text-vert-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Flux mensuels */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <EnteteCarte
                        title={t('Flux de matériel — 12 derniers mois')}
                        action={(
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> {t('Entrées')}</span>
                                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-vert-500" /> {t('Sorties')}</span>
                            </div>
                        )}
                    />
                    <GraphiqueFlux data={data.flux_mensuels} />
                </div>

                {/* Mouvements par type sur la période */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <EnteteCarte title={t('Transactions par type — ') + `${formatDate(data.periode.debut)} → ${formatDate(data.periode.fin)}`} />
                    <div className="space-y-2">
                        {Object.entries(TYPES_MOUVEMENT).map(([type, meta]) => {
                            const total = data.mouvements_par_type[type] ?? 0;
                            const max = Math.max(1, ...Object.values(data.mouvements_par_type));
                            const couleurs = {
                                stock: 'bg-blue-500', affectation: 'bg-vert-500', restitution: 'bg-jaune-400',
                                transfert: 'bg-orange-400', maintenance: 'bg-orange-400', reforme: 'bg-slate-400',
                            };
                            return (
                                <div key={type}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                            <meta.icon size={13} className="text-slate-400" /> {t(meta.label)}
                                        </span>
                                        <span className="text-slate-500 tabular-nums">{total}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-700 ${couleurs[type]}`} style={{ width: `${max ? (total / max) * 100 : 0}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Répartition par direction */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <EnteteCarte title={t('Parc par direction (top 8)')} />
                    <div className="space-y-2.5">
                        {data.par_direction.length === 0 && <p className="text-xs text-slate-500">{t('Aucune direction rattachée.')}</p>}
                        {data.par_direction.map((d) => (
                            <BarreProportion
                                key={d.code_direction}
                                label={`${d.code_direction} — ${d.nom_direction}`}
                                total={d.total}
                                max={maxDirection}
                            />
                        ))}
                    </div>
                </div>

                {/* Répartition par catégorie */}
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                    <EnteteCarte title={t('Parc par catégorie')} />
                    <div className="space-y-2.5">
                        {data.par_categorie.map((c) => (
                            <BarreProportion key={c.nom_categorie} label={c.nom_categorie} total={c.total} max={maxCategorie} color="bg-vert-500" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Matériel le plus mobile */}
            <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
                <EnteteCarte title={t('Matériel le plus mobile de la période (affectations cumulées)')} />
                {data.top_mobiles.length === 0
                    ? <p className="text-xs text-slate-500">{t('Aucune affectation sur la période.')}</p>
                    : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                        <th className="py-2 pr-3">{t('Code inventaire')}</th>
                                        <th className="py-2 pr-3">{t('Désignation')}</th>
                                        <th className="py-2 pr-3">{t('Modèle')}</th>
                                        <th className="py-2 text-right">{t('Affectations')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.top_mobiles.map((e) => (
                                        <tr key={e.id_equipement} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/60">
                                            <td className="py-2 pr-3 font-mono text-xs font-bold text-blue-300">{e.code_inventaire}</td>
                                            <td className="py-2 pr-3 text-slate-800">{e.designation}</td>
                                            <td className="py-2 pr-3 text-slate-600">{e.libelle || '—'}</td>
                                            <td className="py-2 text-right font-bold text-slate-800 tabular-nums">{e.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>
        </div>
    );
}

/* ============================================================
   Onglet 2 — Historique des mouvements de matériel
   ============================================================ */
function OngletMouvements() {
    const { user } = useAuth();
    const { t } = useT();
    const peutEffacer = aRole(user, ROLES_ECRITURE);
    const [items, setItems] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [q, setQ] = useState('');
    const [type, setType] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [page, setPage] = useState(1);
    const [exportBusy, setExportBusy] = useState(false);
    const [pdfBusy, setPdfBusy] = useState(false);
    const [aSupprimer, setASupprimer] = useState(null); // mouvement ciblé ou 'tout'
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        const params = Object.fromEntries(Object.entries({ q, type, date_debut: dateDebut, date_fin: dateFin, page, per_page: 20 }).filter(([, v]) => v !== '' && v != null));
        const { data } = await api.get('/rapports/mouvements', { params });
        setItems(data.data ?? []);
        setMeta({ current_page: data.current_page ?? 1, last_page: data.last_page ?? 1, total: data.total ?? 0 });
    }, [q, type, dateDebut, dateFin, page]);

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [load]);

    useEffect(() => { setPage(1); }, [q, type, dateDebut, dateFin]);

    const exporter = async () => {
        setExportBusy(true);
        try {
            const params = Object.fromEntries(Object.entries({ type, date_debut: dateDebut, date_fin: dateFin, q }).filter(([, v]) => v !== ''));
            await telecharger('/rapports/export', { type: 'mouvements', ...params }, `rapport_mouvements_${new Date().toISOString().slice(0, 10)}.csv`);
        } finally {
            setExportBusy(false);
        }
    };

    const exporterPDF = async () => {
        setPdfBusy(true);
        try {
            const params = Object.fromEntries(Object.entries({ type, date_debut: dateDebut, date_fin: dateFin, q }).filter(([, v]) => v !== ''));
            await telecharger('/rapports/pdf/mouvements', params, `rapport_mouvements_${new Date().toISOString().slice(0, 10)}.pdf`);
        } finally {
            setPdfBusy(false);
        }
    };

    const supprimer = async () => {
        setBusy(true);
        try {
            const url = aSupprimer === 'tout' ? '/rapports/mouvements' : `/rapports/mouvements/${aSupprimer.id_mouvement}`;
            const { data } = await api.delete(url);
            sons.succes();
            setASupprimer(null);
            await load();
        } catch {
            sons.alerte();
            setASupprimer(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
            <EnteteCarte
                title={t('Historique des transactions de matériel')}
                action={(
                    <div className="flex items-center gap-2">
                        <BoutonExport onClick={exporter} busy={exportBusy} />
                        <BoutonPDF onClick={exporterPDF} busy={pdfBusy} />
                        {peutEffacer && meta.total > 0 && (
                            <button
                                onClick={() => { sons.clic(); setASupprimer('tout'); }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-400 text-xs font-bold transition-all active:scale-[.97]"
                            >
                                <Trash2 size={14} /> {t('Tout supprimer')}
                            </button>
                        )}
                    </div>
                )}
            />

            {/* Filtres */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <ChampRecherche value={q} onChange={setQ} placeholder={t('Code inventaire, n° série, motif, utilisateur…')} />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-9 px-2.5 bg-card-high rounded-lg text-slate-700 text-xs border border-slate-200 focus:outline-none"
                >
                    <option value="">{t('Tous les types')}</option>
                    {Object.entries(TYPES_MOUVEMENT).map(([v, m]) => <option key={v} value={v}>{t(m.label)}</option>)}
                </select>
                <ChampDate value={dateDebut} onChange={setDateDebut} />
                <span className="text-xs text-slate-400">→</span>
                <ChampDate value={dateFin} onChange={setDateFin} />
            </div>

            {! items
                ? <Spinner label={t('Chargement des mouvements…')} />
                : items.length === 0
                    ? <EmptyState icon={ArrowLeftRight} title={t('Aucun mouvement trouvé.')} hint={t('Ajustez les filtres ou la période.')} />
                    : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                            <th className="py-2 pr-3">{t('Date')}</th>
                                            <th className="py-2 pr-3">{t('Type')}</th>
                                            <th className="py-2 pr-3">{t('Équipement')}</th>
                                            <th className="py-2 pr-3">{t('Motif')}</th>
                                            <th className="py-2 pr-3">{t('Localisation')}</th>
                                            <th className="py-2 pr-3">{t('Effectué par')}</th>
                                            {peutEffacer && <th className="py-2 text-right">{t('Actions')}</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((m) => {
                                            const meta = TYPES_MOUVEMENT[m.type_mouvement] ?? TYPES_MOUVEMENT.stock;
                                            const loc = [m.ancienne_localisation?.nom_localisation, m.nouvelle_localisation?.nom_localisation].filter(Boolean).join(' → ');
                                            return (
                                                <tr key={m.id_mouvement} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/60 align-top">
                                                    <td className="py-2.5 pr-3 whitespace-nowrap text-xs text-slate-500">{formatDate(m.date_mouvement)}</td>
                                                    <td className="py-2.5 pr-3"><Badge color={meta.color}>{t(meta.label)}</Badge></td>
                                                    <td className="py-2.5 pr-3">
                                                        {m.equipement
                                                            ? (
                                                                <a href={`/equipements/${m.equipement.id_equipement}`} className="group">
                                                                    <span className="font-mono text-xs font-bold text-blue-300 group-hover:underline">{m.equipement.code_inventaire}</span>
                                                                    <span className="block text-xs text-slate-600 truncate max-w-56">{m.equipement.designation}</span>
                                                                </a>
                                                            )
                                                            : '—'}
                                                    </td>
                                                    <td className="py-2.5 pr-3 text-xs text-slate-600 max-w-64"><span className="line-clamp-2">{m.motif ?? '—'}</span></td>
                                                    <td className="py-2.5 pr-3 text-xs text-slate-600">{loc || '—'}</td>
                                                    <td className="py-2.5 pr-3 text-xs text-slate-600">{m.utilisateur?.nom_complet ?? m.utilisateur?.username ?? t('Système')}</td>
                                                    {peutEffacer && (
                                                        <td className="py-2.5 text-right">
                                                            <button
                                                                onClick={() => { sons.clic(); setASupprimer(m); }}
                                                                title={t('Supprimer cette entrée')}
                                                                className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                page={meta.current_page}
                                lastPage={meta.last_page}
                                total={meta.total}
                                onNavigate={setPage}
                            />
                        </>
                    )}

            {aSupprimer && (
                <ConfirmModal
                    open
                    busy={busy}
                    title={aSupprimer === 'tout' ? t('Tout supprimer ?') : t('Supprimer cette entrée ?')}
                    message={aSupprimer === 'tout'
                        ? `${t("L'intégralité de l'historique des mouvements (")}${meta.total}${t(' entrée(s)) sera définitivement effacée. Cette action est irréversible.')}`
                        : t("Cette entrée de l'historique des mouvements sera définitivement effacée. Cette action est irréversible.")}
                    onConfirm={supprimer}
                    onClose={() => setASupprimer(null)}
                />
            )}
        </div>
    );
}

/* ============================================================
   Onglet 3 — Journal d'activité applicatif
   ============================================================ */
function OngletJournal() {
    const { user } = useAuth();
    const { t, langue } = useT();
    const peutEffacer = aRole(user, ROLES_ECRITURE);
    const [items, setItems] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [q, setQ] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [page, setPage] = useState(1);
    const [exportBusy, setExportBusy] = useState(false);
    const [pdfBusy, setPdfBusy] = useState(false);
    const [aSupprimer, setASupprimer] = useState(null); // log ciblé ou 'tout'
    const [busy, setBusy] = useState(false);

    const load = useCallback(async () => {
        const params = Object.fromEntries(Object.entries({ q, date_debut: dateDebut, date_fin: dateFin, page, per_page: 30 }).filter(([, v]) => v !== ''));
        const { data } = await api.get('/rapports/journal', { params });
        setItems(data.data ?? []);
        setMeta({ current_page: data.current_page ?? 1, last_page: data.last_page ?? 1, total: data.total ?? 0 });
    }, [q, dateDebut, dateFin, page]);

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [load]);

    useEffect(() => { setPage(1); }, [q, dateDebut, dateFin]);

    const exporter = async () => {
        setExportBusy(true);
        try {
            const params = Object.fromEntries(Object.entries({ date_debut: dateDebut, date_fin: dateFin, q }).filter(([, v]) => v !== ''));
            await telecharger('/rapports/export', { type: 'journal', ...params }, `rapport_journal_${new Date().toISOString().slice(0, 10)}.csv`);
        } finally {
            setExportBusy(false);
        }
    };

    const exporterPDF = async () => {
        setPdfBusy(true);
        try {
            const params = Object.fromEntries(Object.entries({ date_debut: dateDebut, date_fin: dateFin, q }).filter(([, v]) => v !== ''));
            await telecharger('/rapports/pdf/journal', params, `rapport_journal_${new Date().toISOString().slice(0, 10)}.pdf`);
        } finally {
            setPdfBusy(false);
        }
    };

    const couleurAction = (action) => {
        if (action?.startsWith('création')) return 'bg-vert-100 text-vert-400 border-vert-200';
        if (action?.startsWith('suppression')) return 'bg-rose-100 text-rose-400 border-rose-200';
        if (action?.startsWith('modification')) return 'bg-orange-100 text-orange-400 border-orange-200';
        return 'bg-slate-100 text-slate-500 border-slate-200';
    };

    const supprimer = async () => {
        setBusy(true);
        try {
            const url = aSupprimer === 'tout' ? '/rapports/journal' : `/rapports/journal/${aSupprimer.id_log}`;
            const { data } = await api.delete(url);
            sons.succes();
            setASupprimer(null);
            await load();
        } catch {
            sons.alerte();
            setASupprimer(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
            <EnteteCarte
                title={t("Journal d'activité — traçabilité des opérations")}
                action={(
                    <div className="flex items-center gap-2">
                        <BoutonExport onClick={exporter} busy={exportBusy} />
                        <BoutonPDF onClick={exporterPDF} busy={pdfBusy} />
                        {peutEffacer && meta.total > 0 && (
                            <button
                                onClick={() => { sons.clic(); setASupprimer('tout'); }}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-400 text-xs font-bold transition-all active:scale-[.97]"
                            >
                                <Trash2 size={14} /> {t('Tout supprimer')}
                            </button>
                        )}
                    </div>
                )}
            />

            <div className="flex flex-wrap items-center gap-2 mb-4">
                <ChampRecherche value={q} onChange={setQ} placeholder={t('Action, table, utilisateur, adresse IP…')} />
                <ChampDate value={dateDebut} onChange={setDateDebut} />
                <span className="text-xs text-slate-400">→</span>
                <ChampDate value={dateFin} onChange={setDateFin} />
            </div>

            {! items
                ? <Spinner label={t('Chargement du journal…')} />
                : items.length === 0
                    ? <EmptyState icon={History} title={t('Aucune activité enregistrée.')} hint={t('Ajustez les filtres ou la période.')} />
                    : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                            <th className="py-2 pr-3">{t('Horodatage')}</th>
                                            <th className="py-2 pr-3">{t('Action')}</th>
                                            <th className="py-2 pr-3">{t('Table')}</th>
                                            <th className="py-2 pr-3">{t('Élément')}</th>
                                            <th className="py-2 pr-3">{t('Utilisateur')}</th>
                                            <th className="py-2 pr-3">{t('Adresse IP')}</th>
                                            {peutEffacer && <th className="py-2 text-right">{t('Actions')}</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((l) => (
                                            <tr key={l.id_log} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/60">
                                                <td className="py-2.5 pr-3 whitespace-nowrap text-xs text-slate-500 font-mono">
                                                    {l.date_action ? new Date(l.date_action).toLocaleString(langue === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                                                </td>
                                                <td className="py-2.5 pr-3"><Badge color={couleurAction(l.action)}>{l.action}</Badge></td>
                                                <td className="py-2.5 pr-3 text-xs font-mono text-slate-600">{l.table_concernee ?? '—'}</td>
                                                <td className="py-2.5 pr-3 text-xs text-slate-600 tabular-nums">{l.id_element ?? '—'}</td>
                                                <td className="py-2.5 pr-3 text-xs text-slate-800 font-semibold">
                                                    {l.utilisateur?.nom_complet ?? l.utilisateur?.username ?? t('Système')}
                                                </td>
                                                <td className="py-2.5 pr-3 text-xs font-mono text-slate-500">{l.adresse_ip ?? '—'}</td>
                                                {peutEffacer && (
                                                    <td className="py-2.5 text-right">
                                                        <button
                                                            onClick={() => { sons.clic(); setASupprimer(l); }}
                                                            title={t('Supprimer cette entrée')}
                                                            className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                page={meta.current_page}
                                lastPage={meta.last_page}
                                total={meta.total}
                                onNavigate={setPage}
                            />
                        </>
                    )}

            {aSupprimer && (
                <ConfirmModal
                    open
                    busy={busy}
                    title={aSupprimer === 'tout' ? t('Tout supprimer ?') : t('Supprimer cette entrée ?')}
                    message={aSupprimer === 'tout'
                        ? `${t("L'intégralité du journal d'activité (")}${meta.total}${t(' entrée(s)) sera définitivement effacée. Cette action est irréversible.')}`
                        : t("Cette entrée du journal d'activité sera définitivement effacée. Cette action est irréversible.")}
                    onConfirm={supprimer}
                    onClose={() => setASupprimer(null)}
                />
            )}
        </div>
    );
}

/* ============================================================
   Page — Rapports
   ============================================================ */
export default function Rapports() {
    const { t } = useT();
    const [onglet, setOnglet] = useState('synthese');
    const [preset, setPreset] = useState('annee');
    const dates = useMemo(() => presetVersDates(preset), [preset]);

    return (
        <div>
            <PageHeader
                title={t('Rapports & Historiques')}
                subtitle={t('Synthèse du parc, historique des transactions de matériel et traçabilité des opérations')}
            />

            {/* Onglets + période */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start">
                    {ONGLETS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => { setOnglet(key); sons.clic(); }}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                                onglet === key
                                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                                    : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            <Icon size={14} /> {t(label)}
                        </button>
                    ))}
                </div>

                {onglet === 'synthese' && (
                    <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start">
                        {PRESETS.map((p) => (
                            <button
                                key={p.key}
                                onClick={() => { setPreset(p.key); sons.clic(); }}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                    preset === p.key ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30' : 'text-slate-600 hover:text-slate-800'
                                }`}
                            >
                                {t(p.label)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {onglet === 'synthese' && <OngletSynthese dates={dates} />}
            {onglet === 'mouvements' && <OngletMouvements />}
            {onglet === 'journal' && <OngletJournal />}
        </div>
    );
}
