import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Monitor, Pencil, FileDown, Trash2 } from 'lucide-react';
import { api } from '../../api';
import { Spinner, PageHeader, EmptyState, Badge, Field, inputClass, ErrorText, EditModal, ConfirmModal } from '../../components/ui';
import { STATUTS_EQUIPEMENT, formatDate, formatAr } from '../../lib/constants';
import { telechargerExport, nomExport } from '../../lib/exports';
import { useAuth, aRole, ROLES_ECRITURE } from '../../auth';
import { useT } from '../../lib/i18n';

const VIDE_FORM = {
    code_inventaire: '', numero_serie: '', designation: '', description: '',
    date_acquisition: '', date_mise_service: '', prix_acquisition: '',
    garantie_debut: '', garantie_fin: '', statut: 'en_stock',
    id_modele: '', id_direction: '', id_service: '', id_localisation: '', id_etat: '', id_fournisseur: '',
};

const versForm = (eq) => ({
    code_inventaire: eq.code_inventaire ?? '',
    numero_serie: eq.numero_serie ?? '',
    designation: eq.designation ?? '',
    description: eq.description ?? '',
    date_acquisition: eq.date_acquisition ?? '',
    date_mise_service: eq.date_mise_service ?? '',
    prix_acquisition: eq.prix_acquisition ?? '',
    garantie_debut: eq.garantie_debut ?? '',
    garantie_fin: eq.garantie_fin ?? '',
    statut: eq.statut ?? 'en_stock',
    id_modele: eq.id_modele ?? '',
    id_direction: eq.id_direction ?? '',
    id_service: eq.id_service ?? '',
    id_localisation: eq.id_localisation ?? '',
    id_etat: eq.id_etat ?? '',
    id_fournisseur: eq.id_fournisseur ?? '',
});

export default function Equipements() {
    const { user } = useAuth();
    const { t } = useT();
    const peutEcrire = aRole(user, ROLES_ECRITURE);
    const [data, setData] = useState(null);
    const [filters, setFilters] = useState({ q: '', statut: '', id_categorie: '' });
    const [referentiel, setReferentiel] = useState(null);
    const [modal, setModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', equipement }
    const [form, setForm] = useState(VIDE_FORM);
    const [errors, setErrors] = useState(null);
    const [busy, setBusy] = useState(false);
    const [pdfEnCours, setPdfEnCours] = useState(false);
    const [aSupprimer, setASupprimer] = useState(null);
    const [busySuppression, setBusySuppression] = useState(false);

    const imprimerPdf = async () => {
        setPdfEnCours(true);
        try {
            const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
            await telechargerExport('/rapports/pdf/ressource/equipements', params, nomExport('registre_equipements'));
        } finally {
            setPdfEnCours(false);
        }
    };

    const load = useCallback(async (params = filters) => {
        const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== ''));
        const { data } = await api.get('/equipements', { params: clean });
        setData(data);
    }, [filters]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        api.get('/referentiel').then(({ data }) => setReferentiel(data));
    }, []);

    const setF = (k) => (e) => {
        const next = { ...filters, [k]: e.target.value };
        setFilters(next);
        if (k !== 'q') load(next);
    };

    const ouvrirCreation = () => {
        setForm(VIDE_FORM);
        setErrors(null);
        setModal({ mode: 'create' });
    };

    const ouvrirEdition = (eq) => {
        setForm(versForm(eq));
        setErrors(null);
        setModal({ mode: 'edit', equipement: eq });
    };

    const confirmerSuppression = async () => {
        if (! aSupprimer) return;
        setBusySuppression(true);
        try {
            await api.delete(`/equipements/${aSupprimer.id_equipement}`);
            setASupprimer(null);
            await load();
        } catch (err) {
            setASupprimer(null);
            alert(err.response?.data?.message ?? t('Suppression impossible (élément utilisé ailleurs).'));
        } finally {
            setBusySuppression(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors(null);
        try {
            const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v]));
            if (modal?.mode === 'edit') {
                await api.put(`/equipements/${modal.equipement.id_equipement}`, payload);
            } else {
                await api.post('/equipements', payload);
            }
            setModal(null);
            await load();
        } catch (err) {
            setErrors(err.response?.data?.errors ?? { erreur: [t('Enregistrement impossible.')] });
        } finally {
            setBusy(false);
        }
    };

    if (! data) return <Spinner label={t('Chargement des équipements…')} />;

    const champsForm = (
        <>
            <ErrorText errors={errors} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={t('Code inventaire')} required>
                    <input required value={form.code_inventaire} onChange={(e) => setForm({ ...form, code_inventaire: e.target.value })} className={inputClass} placeholder="GPI-00042" />
                </Field>
                <Field label={t('N° de série')}>
                    <input value={form.numero_serie} onChange={(e) => setForm({ ...form, numero_serie: e.target.value })} className={inputClass} />
                </Field>
                <Field label={t('Désignation')} required>
                    <input required value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className={inputClass} />
                </Field>
                <Field label={t('Statut')} required>
                    <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })} className={inputClass}>
                        {Object.entries(STATUTS_EQUIPEMENT).map(([k, m]) => (
                            <option key={k} value={k}>{m.label}</option>
                        ))}
                    </select>
                </Field>
                <Field label={t('Modèle')}>
                    <select value={form.id_modele} onChange={(e) => setForm({ ...form, id_modele: e.target.value })} className={inputClass}>
                        <option value="">—</option>
                        {referentiel?.modeles?.map((m) => (
                            <option key={m.id_modele} value={m.id_modele}>{m.marque?.nom_marque} {m.nom_modele}</option>
                        ))}
                    </select>
                </Field>
                <Field label={t('Direction')}>
                    <select value={form.id_direction} onChange={(e) => setForm({ ...form, id_direction: e.target.value })} className={inputClass}>
                        <option value="">—</option>
                        {referentiel?.directions?.map((d) => (
                            <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>
                        ))}
                    </select>
                </Field>
                <Field label={t('Localisation')}>
                    <select value={form.id_localisation} onChange={(e) => setForm({ ...form, id_localisation: e.target.value })} className={inputClass}>
                        <option value="">Stock</option>
                        {referentiel?.localisations?.map((l) => (
                            <option key={l.id_localisation} value={l.id_localisation}>{l.nom_localisation}</option>
                        ))}
                    </select>
                </Field>
                <Field label={t('État')}>
                    <select value={form.id_etat} onChange={(e) => setForm({ ...form, id_etat: e.target.value })} className={inputClass}>
                        <option value="">—</option>
                        {referentiel?.etats?.map((et) => (
                            <option key={et.id_etat} value={et.id_etat}>{et.nom_etat}</option>
                        ))}
                    </select>
                </Field>
                <Field label={t("Date d'acquisition")}>
                    <input type="date" value={form.date_acquisition} onChange={(e) => setForm({ ...form, date_acquisition: e.target.value })} className={inputClass} />
                </Field>
                <Field label={t("Prix d'acquisition (Ar)")}>
                    <input type="number" min="0" value={form.prix_acquisition} onChange={(e) => setForm({ ...form, prix_acquisition: e.target.value })} className={inputClass} />
                </Field>
            </div>
        </>
    );

    return (
        <div>
            <PageHeader
                title={t('Équipements')}
                subtitle={`${data.total} ${t(' équipement(s) au parc')}`}
                actions={
                    <>
                        <button
                            onClick={imprimerPdf}
                            disabled={pdfEnCours}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-300 text-sm font-bold transition-all disabled:opacity-60"
                        >
                            <FileDown size={15} /> {pdfEnCours ? t('Génération…') : t('Imprimer PDF')}
                        </button>
                        {peutEcrire && (
                            <button
                                onClick={ouvrirCreation}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-600/25"
                            >
                                <Plus size={15} /> {t('Nouvel équipement')}
                            </button>
                        )}
                    </>
                }
            />

            {/* Filtres */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-3 mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={filters.q}
                        onChange={setF('q')}
                        placeholder={t('Rechercher par code inventaire, n° série, désignation…')}
                        className={`${inputClass} pl-9`}
                    />
                </div>
                <select value={filters.statut} onChange={setF('statut')} className={`${inputClass} sm:w-44`}>
                    <option value="">{t('Tous les statuts')}</option>
                    {Object.entries(STATUTS_EQUIPEMENT).map(([k, m]) => (
                        <option key={k} value={k}>{m.label}</option>
                    ))}
                </select>
                <select value={filters.id_categorie} onChange={setF('id_categorie')} className={`${inputClass} sm:w-48`}>
                    <option value="">{t('Toutes catégories')}</option>
                    {referentiel?.categories?.map((c) => (
                        <option key={c.id_categorie} value={c.id_categorie}>{c.nom_categorie}</option>
                    ))}
                </select>
            </div>

            {/* Tableau */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-200/50">
                                <th className="px-4 py-3 font-bold">{t('Code')}</th>
                                <th className="px-4 py-3 font-bold">{t('Désignation')}</th>
                                <th className="px-4 py-3 font-bold hidden md:table-cell">{t('Catégorie')}</th>
                                <th className="px-4 py-3 font-bold hidden lg:table-cell">{t('Localisation')}</th>
                                <th className="px-4 py-3 font-bold">{t('Statut')}</th>
                                <th className="px-4 py-3 text-right font-bold">{t('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.data.map((eq) => (
                                <tr key={eq.id_equipement} className="hover:bg-blue-50/30 transition">
                                    <td className="px-4 py-3 font-mono text-xs font-bold text-blue-300">
                                        {eq.code_inventaire}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-slate-800">{eq.designation}</div>
                                        <div className="text-[11px] text-slate-500">{eq.marque?.nom_marque} {eq.modele?.nom_modele}</div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">
                                        {eq.categorie?.nom_categorie ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-slate-600">
                                        {eq.localisation ? `${eq.localisation.batiment?.site?.nom_site ?? ''} · ${eq.localisation.nom_localisation}` : t('Stock')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge color={STATUTS_EQUIPEMENT[eq.statut]?.color}>{STATUTS_EQUIPEMENT[eq.statut]?.label ?? eq.statut}</Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {peutEcrire && (
                                                <button
                                                    onClick={() => setASupprimer(eq)}
                                                    title={t('Supprimer cet équipement')}
                                                    className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-rose-200/60 bg-rose-100 hover:bg-rose-200 active:scale-[.95] text-rose-500 text-xs font-semibold transition-all"
                                                >
                                                    <Trash2 size={13} /> {t('Supprimer')}
                                                </button>
                                            )}
                                            {peutEcrire && (
                                                <button
                                                    onClick={() => ouvrirEdition(eq)}
                                                    title={t('Modifier cet équipement')}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-card-high text-slate-600 hover:text-sky-400 text-xs font-semibold transition-colors"
                                                >
                                                    <Pencil size={13} /> {t('Modifier')}
                                                </button>
                                            )}
                                            <Link
                                                to={`/equipements/${eq.id_equipement}`}
                                                title={t('Voir la fiche détaillée')}
                                                className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-card-high text-slate-600 hover:text-blue-300 text-xs font-semibold transition-colors"
                                            >
                                                {t('Détail')}
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data.data.length === 0 && (
                    <EmptyState icon={Monitor} title={t('Aucun équipement trouvé')} hint={t('Ajustez les filtres ou créez un nouvel équipement.')} />
                )}

                {/* Pagination */}
                {data.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/50 bg-slate-100 text-xs">
                        <span className="text-slate-500">
                            {t('Page ')}{data.current_page} / {data.last_page} — {data.total} {t(' équipements')}
                        </span>
                        <div className="flex gap-1">
                            <button
                                disabled={data.current_page <= 1}
                                onClick={() => load({ ...filters, page: data.current_page - 1 })}
                                className="px-3 py-1.5 rounded-lg border border-slate-200/50 bg-card disabled:opacity-40 hover:bg-card-high font-semibold"
                            >
                                {t('Précédent')}
                            </button>
                            <button
                                disabled={data.current_page >= data.last_page}
                                onClick={() => load({ ...filters, page: data.current_page + 1 })}
                                className="px-3 py-1.5 rounded-lg border border-slate-200/50 bg-card disabled:opacity-40 hover:bg-card-high font-semibold"
                            >
                                {t('Suivant')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modale création / édition */}
            <EditModal
                open={!! modal}
                mode={modal?.mode}
                onClose={() => setModal(null)}
                onSubmit={submit}
                busy={busy}
                title={modal?.mode === 'edit' ? `${t('Modifier — ')}${modal.equipement.code_inventaire}` : t('Nouvel équipement')}
            >
                {champsForm}
            </EditModal>

            {/* Confirmation de suppression */}
            <ConfirmModal
                open={!! aSupprimer}
                message={aSupprimer
                    ? <>{t("Voulez-vous vraiment supprimer l'équipement ")}<strong className="text-slate-700">« {aSupprimer.code_inventaire} — {aSupprimer.designation} »</strong>{t(' ? Cette action est définitive.')}</>
                    : ''}
                busy={busySuppression}
                onConfirm={confirmerSuppression}
                onClose={() => setASupprimer(null)}
            />
        </div>
    );
}
