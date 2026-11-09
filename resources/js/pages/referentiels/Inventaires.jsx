import { useCallback, useEffect, useMemo, useState } from 'react';
import { Boxes, CheckCircle2, AlertTriangle, FileDown, Search, Cpu, ArrowLeftRight, Wrench, CircleDollarSign, Activity, ArrowUpDown } from 'lucide-react';
import { api } from '../../api';
import { Spinner, PageHeader, Badge, inputClass } from '../../components/ui';
import { STATUTS_EQUIPEMENT, formatDate, formatAr } from '../../lib/constants';
import { telechargerExport, nomExport } from '../../lib/exports';
import { useT } from '../../lib/i18n';

/* Le material a été remplacé par la vue parc : voici les colonnes triables. */
const COLONNES = [
    { key: 'code', label: 'Code' },
    { key: 'designation', label: 'Désignation' },
    { key: 'categorie', label: 'Catégorie', tri: false },
    { key: 'libelle_modele', label: 'Marque / modèle', tri: false },
    { key: 'agent', label: 'Agent affecté', tri: false },
    { key: 'service', label: 'Service' },
    { key: 'direction', label: 'Direction' },
    { key: 'centre', label: 'Centre' },
    { key: 'date_acquisition', label: "Date d'acquisition" },
    { key: 'etat', label: 'État' },
    { key: 'statut', label: 'Statut' },
    { key: 'interventions', label: 'Inter.' },
    { key: 'affectations', label: 'Affect.' },
    { key: 'prix_acquisition', label: 'Valeur', tri: false, monnaie: true },
];

function OngletParc({ referentiel }) {
    const { t } = useT();
    const [rows, setRows] = useState(null);
    const [filtres, setFiltres] = useState({
        q: '', statut: '', id_categorie: '', id_direction: '', id_service: '', id_site: '', id_etat: '',
        date_acquisition_debut: '', date_acquisition_fin: '',
    });
    const [tri, setTri] = useState({ tri: 'code', desc: false });
    const [pdfEnCours, setPdfEnCours] = useState(false);

    const params = useMemo(() => Object.fromEntries(Object.entries({
        ...filtres,
        tri: tri.tri,
        desc: tri.desc ? 1 : '',
    }).filter(([, v]) => v !== '')), [filtres, tri]);

    const load = useCallback(() => {
        api.get('/inventaire-parc', { params }).then(({ data }) => setRows(data));
    }, [params]);

    useEffect(() => { load(); }, [load]);

    const setF = (k) => (e) => setFiltres({ ...filtres, [k]: e.target.value });

    const basculerTri = (key) => {
        if (tri.tri === key) setTri({ tri: key, desc: ! tri.desc });
        // Les décomptes se lisent d'abord du plus grand au plus petit.
        else setTri({ tri: key, desc: ['interventions', 'affectations'].includes(key) });
    };

    const imprimerPdf = async () => {
        setPdfEnCours(true);
        try {
            await telechargerExport('/inventaire-parc/pdf', params, nomExport('inventaire_parc'));
        } finally {
            setPdfEnCours(false);
        }
    };

    if (! rows) return <Spinner label={t("Chargement de l'inventaire…")} />;

    const s = rows.stats;
    const statsKPI = [
        { label: t('Matériels inventoriés'), value: s.total_materiels, icon: Boxes, text: 'text-blue-400' },
        { label: t('Valeur totale'), value: formatAr(s.valeur_totale), icon: CircleDollarSign, text: 'text-vert-400' },
        { label: t('Interventions cumulées'), value: s.interventions_total, icon: Wrench, text: 'text-orange-400' },
        { label: t('Affectations cumulées'), value: s.affectations_total, icon: ArrowLeftRight, text: 'text-sky-400' },
        { label: t('Matériels affectés'), value: s.affectes_actifs, icon: Activity, text: 'text-vert-400' },
    ];

    return (
        <div>
            {/* Récapitulatif global */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                {statsKPI.map(({ label, value, icon: Icon, text }) => (
                    <div key={label} className="bg-card rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">{label}</div>
                            <div className="text-xl font-bold text-slate-800 tabular-nums">{value}</div>
                        </div>
                        <div className={`p-2.5 rounded-lg bg-slate-100 shrink-0 ${text}`}><Icon size={18} /></div>
                    </div>
                ))}
            </div>

            {/* Statistiques : ventilations par statut, catégorie et centre */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {[
                    { titre: t('Répartition par statut'), cls: 'par_statut', couleur: 'bg-blue-500', traduire: true },
                    { titre: t('Répartition par catégorie'), cls: 'par_categorie', couleur: 'bg-vert-500' },
                    { titre: t('Répartition par centre'), cls: 'par_centre', couleur: 'bg-orange-400' },
                ].map(({ titre, cls, couleur, traduire }) => {
                    const entrees = Object.entries(s[cls] ?? {});
                    const max = Math.max(1, ...entrees.map(([, v]) => v));
                    return (
                        <div key={cls} className="bg-card rounded-2xl border border-slate-200 shadow-sm p-4">
                            <h3 className="text-xs font-bold text-slate-800 mb-3">{titre}</h3>
                            <div className="space-y-1.5">
                                {entrees.length === 0 && <p className="text-xs text-slate-500">{t('Aucune donnée.')}</p>}
                                {entrees.map(([lbl, v]) => (
                                    <div key={lbl}>
                                        <div className="flex items-center justify-between text-xs mb-0.5">
                                            <span className="font-semibold text-slate-700 truncate">{traduire ? t(STATUTS_EQUIPEMENT[lbl]?.label ?? lbl) : lbl}</span>
                                            <span className="text-slate-500 tabular-nums">{v}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-700 ${couleur}`} style={{ width: `${(v / max) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filtres */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-3 mb-4 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={filtres.q} onChange={setF('q')} placeholder={t('Rechercher (code, n° série, désignation)…')} className={`${inputClass} pl-9`} />
                    </div>
                    <select value={filtres.statut} onChange={setF('statut')} className={`${inputClass} sm:w-44`}>
                        <option value="">{t('Tous les statuts')}</option>
                        {Object.entries(STATUTS_EQUIPEMENT).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
                    </select>
                    <select value={filtres.id_categorie} onChange={setF('id_categorie')} className={`${inputClass} sm:w-44`}>
                        <option value="">{t('Toutes catégories')}</option>
                        {(referentiel?.categories ?? []).map((c) => <option key={c.id_categorie} value={c.id_categorie}>{c.nom_categorie}</option>)}
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <select value={filtres.id_direction} onChange={setF('id_direction')} className={`${inputClass} sm:w-48`}>
                        <option value="">{t('Toutes directions')}</option>
                        {(referentiel?.directions ?? []).map((d) => <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>)}
                    </select>
                    <select value={filtres.id_service} onChange={setF('id_service')} className={`${inputClass} sm:w-48`}>
                        <option value="">{t('Tous les services')}</option>
                        {(referentiel?.services ?? []).map((sv) => <option key={sv.id_service} value={sv.id_service}>{sv.nom_service}</option>)}
                    </select>
                    <select value={filtres.id_site} onChange={setF('id_site')} className={`${inputClass} sm:w-44`}>
                        <option value="">{t('Tous les centres (sites)')}</option>
                        {(referentiel?.sites ?? []).map((si) => <option key={si.id_site} value={si.id_site}>{si.nom_site}</option>)}
                    </select>
                    <select value={filtres.id_etat} onChange={setF('id_etat')} className={`${inputClass} sm:w-40`}>
                        <option value="">{t('Tous les états')}</option>
                        {(referentiel?.etats ?? []).map((et) => <option key={et.id_etat} value={et.id_etat}>{et.nom_etat}</option>)}
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                    <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">{t('Acquisition du')}</label>
                        <input type="date" value={filtres.date_acquisition_debut} onChange={setF('date_acquisition_debut')} className={`${inputClass} w-40`} />
                    </div>
                    <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">{t('au')}</label>
                        <input type="date" value={filtres.date_acquisition_fin} onChange={setF('date_acquisition_fin')} className={`${inputClass} w-40`} />
                    </div>
                    <button
                        onClick={imprimerPdf}
                        disabled={pdfEnCours}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-300 text-sm font-bold transition-all disabled:opacity-60 sm:ml-auto"
                    >
                        <FileDown size={15} /> {pdfEnCours ? t('Génération…') : t(' Récapitulatif PDF')}
                    </button>
                </div>
            </div>

            {/* Tableau inventaire, colonnes triables */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-200/50">
                                {COLONNES.map((c) => (
                                    <th key={c.key} className="px-3 py-2.5 font-bold whitespace-nowrap">
                                        {c.tri === false ? (
                                            t(c.label)
                                        ) : (
                                            <button onClick={() => basculerTri(c.key)} title={t('Trier par cette colonne')} className="inline-flex items-center gap-1 hover:text-slate-800 transition-colors">
                                                <ArrowUpDown size={11} className={tri.tri === c.key ? 'text-blue-300' : 'text-slate-300'} />
                                                {t(c.label)}
                                                {tri.tri === c.key && (tri.desc ? '▾' : '▴')}
                                            </button>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.rows.map((r) => (
                                <tr key={r.id_equipement?r.id_equipement:r.code_inventaire} className="hover:bg-blue-50/40 transition-colors">
                                    <td className="px-3 py-2 font-mono text-xs font-bold text-blue-300">{r.code_inventaire}</td>
                                    <td className="px-3 py-2 max-w-52"><div className="font-semibold text-slate-800 truncate">{r.designation}</div></td>
                                    <td className="px-3 py-2 text-slate-600">{r.categorie ?? '—'}</td>
                                    <td className="px-3 py-2 text-slate-600">{r.libelle_modele ?? '—'}</td>
                                    <td className="px-3 py-2 text-slate-600">{r.agent ?? '—'}</td>
                                    <td className="px-3 py-2 text-slate-600 max-w-40">{r.service ?? '—'}</td>
                                    <td className="px-3 py-2 text-slate-600 max-w-44">{r.direction ?? '—'}</td>
                                    <td className="px-3 py-2 text-slate-600">{r.centre ?? 'Stock central'}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{formatDate(r.date_acquisition)}</td>
                                    <td className="px-3 py-2 text-slate-600">{r.etat ?? '—'}</td>
                                    <td className="px-3 py-2"><Badge color={STATUTS_EQUIPEMENT[r.statut]?.color}>{STATUTS_EQUIPEMENT[r.statut]?.label ?? r.statut}</Badge></td>
                                    <td className="px-3 py-2 tabular-nums text-slate-700">{r.nb_interventions}</td>
                                    <td className="px-3 py-2 tabular-nums text-slate-700">{r.nb_affectations}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{formatAr(r.prix_acquisition)}</td>
                                </tr>
                            ))}
                            {rows.rows.length === 0 && (
                                <tr>
                                    <td colSpan={COLONNES.length} className="px-4 py-8 text-center text-xs text-slate-500">
                                        <Cpu size={18} className="mx-auto mb-2 text-slate-300" />
                                        {t('Aucun matériel ne correspond aux filtres.')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* Onglet historique : campagnes de vérification (vue d'origine). */
function OngletCampagnes() {
    const { t } = useT();
    const [rows, setRows] = useState(null);
    const [pdfEnCours, setPdfEnCours] = useState(false);

    useEffect(() => {
        api.get('/inventaire-details').then(({ data }) => setRows(data));
    }, []);

    const imprimerPdf = async () => {
        setPdfEnCours(true);
        try {
            await telechargerExport('/rapports/pdf/ressource/inventaires', {}, nomExport('pv_inventaire'));
        } finally {
            setPdfEnCours(false);
        }
    };

    if (! rows) return <Spinner label={t('Chargement des campagnes…')} />;

    const grouped = rows.reduce((acc, d) => {
        (acc[d.inventaire?.reference ?? '—'] ??= { inventaire: d.inventaire, details: [] }).details.push(d);
        return acc;
    }, {});

    return (
        <div>
            <div className="flex justify-end mb-3">
                <button
                    onClick={imprimerPdf}
                    disabled={pdfEnCours}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-300 text-sm font-bold transition-all disabled:opacity-60"
                >
                    <FileDown size={15} /> {pdfEnCours ? t('Génération…') : t('PV (PDF)')}
                </button>
            </div>

            {Object.entries(grouped).map(([ref, { inventaire, details }]) => {
                const ecarts = details.filter((d) => d.statut === 'ecart').length;
                const verifies = details.filter((d) => d.statut === 'verifie').length;
                return (
                    <div key={ref} className="bg-card rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Boxes size={16} className="text-blue-400" />
                                <span className="font-bold text-slate-800 text-sm">{ref}</span>
                                <Badge color={
                                    inventaire?.statut === 'en_cours' ? 'bg-sky-100 text-sky-400 border-sky-200'
                                    : 'bg-jaune-100 text-jaune-400 border-jaune-200'
                                }>
                                    {t(inventaire?.statut?.replace('_', ' '))}
                                </Badge>
                            </div>
                            <div className="text-[11px] text-slate-500">
                                {formatDate(inventaire?.date_debut)} · {verifies}{t(' vérifié(s) · ')}{' '}
                                <span className={ecarts ? 'text-slate-600 font-bold' : ''}>{ecarts}{t(' écart(s)')}</span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {details.map((d) => (
                                <div key={d.id_detail} className="px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
                                    <div className="min-w-0">
                                        <span className="font-mono text-xs font-bold text-blue-300">{d.equipement?.code_inventaire}</span>
                                        <span className="text-slate-600"> · {d.equipement?.designation}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[11px] text-slate-400 hidden sm:inline">{d.observation}</span>
                                        {d.statut === 'ecart'
                                            ? <Badge color="bg-slate-100 text-slate-800 border-slate-200"><AlertTriangle size={11} className="mr-1" />{t('Écart')}</Badge>
                                            : <Badge color="bg-vert-100 text-vert-400 border-vert-200"><CheckCircle2 size={11} className="mr-1" />{d.statut === 'verifie' ? t('Vérifié') : t('À vérifier')}</Badge>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function Inventaires() {
    const { t } = useT();
    const [onglet, setOnglet] = useState('parc');
    const [referentiel, setReferentiel] = useState(null);

    useEffect(() => {
        api.get('/referentiel').then(({ data }) => setReferentiel(data));
    }, []);

    return (
        <div>
            <PageHeader
                title={t('Inventaires')}
                subtitle={t('Inventaire matériel du parc et campagnes de vérification')}
            />

            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start mb-4">
                {[
                    { key: 'parc', label: 'Inventaire du parc', icon: Boxes },
                    { key: 'campagnes', label: 'Campagnes', icon: CheckCircle2 },
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setOnglet(key)}
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

            {onglet === 'parc' && <OngletParc referentiel={referentiel} />}
            {onglet === 'campagnes' && <OngletCampagnes />}
        </div>
    );
}
