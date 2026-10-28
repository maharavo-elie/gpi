import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, ArrowLeftRight, Undo2, X, FileDown } from 'lucide-react';
import { api } from '../../api';
import { Spinner, PageHeader, EmptyState, Field, inputClass, ErrorText, ConfirmModal } from '../../components/ui';
import { formatDate, STATUTS_EQUIPEMENT } from '../../lib/constants';
import { telechargerExport, nomExport } from '../../lib/exports';
import { useAuth, aRole, ROLES_ECRITURE } from '../../auth';
import { useT } from '../../lib/i18n';

export default function Affectations() {
    const { user } = useAuth();
    const { t } = useT();
    const peutEcrire = aRole(user, ROLES_ECRITURE);
    const [items, setItems] = useState(null);
    const [equipements, setEquipements] = useState([]);
    const [agents, setAgents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ id_equipement: '', id_agent: '', date_affectation: new Date().toISOString().slice(0, 10), motif: '', commentaire: '' });
    const [errors, setErrors] = useState(null);
    const [busy, setBusy] = useState(false);
    const [pdfEnCours, setPdfEnCours] = useState(false);
    const [aRestituer, setARestituer] = useState(null);
    const [busyRestitution, setBusyRestitution] = useState(false);

    const imprimerPdf = async () => {
        setPdfEnCours(true);
        try {
            await telechargerExport('/rapports/pdf/ressource/affectations', {}, nomExport('registre_affectations'));
        } finally {
            setPdfEnCours(false);
        }
    };

    const load = useCallback(async () => {
        const { data } = await api.get('/affectations');
        setItems(data);
    }, []);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        api.get('/equipements', { params: { per_page: 100 } }).then(({ data }) => setEquipements(data.data));
        api.get('/agents').then(({ data }) => setAgents(data));
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors(null);
        try {
            await api.post('/affectations', {
                ...form,
                id_equipement: Number(form.id_equipement),
                id_agent: Number(form.id_agent),
            });
            setShowForm(false);
            setForm({ id_equipement: '', id_agent: '', date_affectation: new Date().toISOString().slice(0, 10), motif: '', commentaire: '' });
            await load();
        } catch (err) {
            setErrors(err.response?.data?.errors ?? { erreur: [t('Affectation impossible.')] });
        } finally {
            setBusy(false);
        }
    };

    const restituer = (a) => {
        setARestituer(a);
    };

    const confirmerRestitution = async () => {
        if (! aRestituer) return;
        setBusyRestitution(true);
        try {
            await api.post(`/affectations/${aRestituer.id_affectation}/restitution`, {});
            await load();
            setARestituer(null);
        } finally {
            setBusyRestitution(false);
        }
    };

    if (! items) return <Spinner label={t('Chargement des affectations…')} />;

    const actives = items.filter((a) => ! a.date_fin);
    const passees = items.filter((a) => a.date_fin);

    return (
        <div>
            <PageHeader
                title={t('Affectations')}
                subtitle={`${actives.length} ${t(' en cours · ')}${passees.length} ${t(' terminée(s)')}`}
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
                            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-sm">
                                <Plus size={15} /> {t('Affecter un équipement')}
                            </button>
                        )}
                    </>
                }
            />

            <div className="bg-card rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                    {t('Affectations en cours')}
                </div>
                <div className="divide-y divide-slate-100">
                    {actives.map((a) => (
                        <div key={a.id_affectation} className="p-4 flex items-center justify-between gap-3 hover:bg-blue-50/40 transition">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-400 flex items-center justify-center shrink-0">
                                    <ArrowLeftRight size={16} />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-800 text-sm truncate">
                                        {a.agent ? `${a.agent.prenom} ${a.agent.nom_naiss}` : '—'}
                                        <span className="text-slate-400 font-normal"> · {a.agent?.fonction}</span>
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        {a.equipement?.code_inventaire} — {a.equipement?.designation}{t(' · depuis le ')}{formatDate(a.date_affectation)}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => restituer(a)}
                                disabled={! peutEcrire}
                                title={peutEcrire ? t('Restituer au stock') : t('Restitution réservée aux gestionnaires')}
                                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Undo2 size={13} /> {t('Restituer')}
                            </button>
                        </div>
                    ))}
                    {actives.length === 0 && <EmptyState icon={ArrowLeftRight} title={t('Aucune affectation active')} />}
                </div>
            </div>

            {passees.length > 0 && (
                <div className="bg-card rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {t('Historique')}
                    </div>
                    <div className="divide-y divide-slate-100">
                        {passees.map((a) => (
                            <div key={a.id_affectation} className="p-3.5 flex items-center justify-between text-sm">
                                <div className="min-w-0">
                                    <span className="font-medium text-slate-700">{a.agent ? `${a.agent.prenom} ${a.agent.nom_naiss}` : '—'}</span>
                                    <span className="text-slate-500"> · {a.equipement?.code_inventaire}</span>
                                </div>
                                <span className="text-xs text-slate-400 whitespace-nowrap">
                                    {formatDate(a.date_affectation)} → {formatDate(a.date_fin)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Confirmation de restitution */}
            <ConfirmModal
                open={!! aRestituer}
                title={t('Confirmer la restitution')}
                message={aRestituer
                    ? <>{t("L'équipement ")}<strong className="text-slate-700">{aRestituer.equipement?.code_inventaire} — {aRestituer.equipement?.designation}</strong>{t(" sera rendu au stock et l'affectation de ")}<strong className="text-slate-700">{aRestituer.agent ? `${aRestituer.agent.prenom} ${aRestituer.agent.nom_naiss}` : '—'}</strong>{t(' sera clôturée.')}</>
                    : ''}
                confirmLabel={t('Restituer')}
                danger={false}
                busy={busyRestitution}
                onConfirm={confirmerRestitution}
                onClose={() => setARestituer(null)}
            />

            {/* Modale création (portail : position fixed fiable) */}
            {showForm && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
                            <h2 className="font-bold text-slate-800">{t('Affecter un équipement')}</h2>
                            <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-slate-700"><X size={18} /></button>
                        </div>
                        <form onSubmit={submit} className="p-5 space-y-3">
                            <ErrorText errors={errors} />
                            <Field label={t('Équipement')} required>
                                <select required value={form.id_equipement} onChange={(e) => setForm({ ...form, id_equipement: e.target.value })} className={inputClass}>
                                    <option value="">{t('Choisir un équipement…')}</option>
                                    {equipements.map((eq) => (
                                        <option key={eq.id_equipement} value={eq.id_equipement}>
                                            {eq.code_inventaire} — {eq.designation} ({STATUTS_EQUIPEMENT[eq.statut]?.label ?? eq.statut})
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label={t('Agent')} required>
                                <select required value={form.id_agent} onChange={(e) => setForm({ ...form, id_agent: e.target.value })} className={inputClass}>
                                    <option value="">{t('Choisir un agent…')}</option>
                                    {agents.map((ag) => (
                                        <option key={ag.id_agent} value={ag.id_agent}>
                                            {ag.prenom} {ag.nom_naiss} — {ag.matricule}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label={t("Date d'affectation")} required>
                                <input type="date" required value={form.date_affectation} onChange={(e) => setForm({ ...form, date_affectation: e.target.value })} className={inputClass} />
                            </Field>
                            <Field label={t('Motif')}>
                                <input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} className={inputClass} placeholder={t('Besoin de service…')} />
                            </Field>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50">{t('Annuler')}</button>
                                <button disabled={busy} className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-bold">
                                    {busy ? t('Affectation…') : t('Affecter')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}
