import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Users, Plus, Pencil, FileDown, Trash2, Eye, X } from 'lucide-react';
import { api } from '../../api';
import { Spinner, PageHeader, EmptyState, Badge, Field, inputClass, ErrorText, EditModal, ConfirmModal } from '../../components/ui';
import { formatDate } from '../../lib/constants';
import { telechargerExport, nomExport } from '../../lib/exports';
import { useAuth, aRole, ROLES_ECRITURE } from '../../auth';
import { useT } from '../../lib/i18n';

const VIDE = {
    matricule: '', nom_naiss: '', prenom: '', sexe: 'M', fonction: '',
    telephone: '', email: '', date_embauche: '', statut: 'actif',
    id_direction: '', id_service: '',
};

export default function Agents() {
    const { user } = useAuth();
    const { t } = useT();
    const peutEcrire = aRole(user, ROLES_ECRITURE);
    const [agents, setAgents] = useState(null);
    const [referentiel, setReferentiel] = useState(null);
    const [q, setQ] = useState('');
    const [modal, setModal] = useState(null); // null | { mode, agent? }
    const [form, setForm] = useState(VIDE);
    const [errors, setErrors] = useState(null);
    const [busy, setBusy] = useState(false);
    const [pdfEnCours, setPdfEnCours] = useState(false);
    const [aSupprimer, setASupprimer] = useState(null);
    const [busySuppression, setBusySuppression] = useState(false);
    const [aConsulter, setAConsulter] = useState(null);

    const imprimerPdf = async () => {
        setPdfEnCours(true);
        try {
            await telechargerExport('/rapports/pdf/ressource/agents', q ? { q } : {}, nomExport('registre_agents'));
        } finally {
            setPdfEnCours(false);
        }
    };

    const loadAgents = (query = '') => {
        const params = query ? { q: query } : {};
        return api.get('/agents', { params }).then(({ data }) => setAgents(data));
    };

    useEffect(() => {
        const t = setTimeout(() => { loadAgents(q); }, 250);
        return () => clearTimeout(t);
    }, [q]);

    useEffect(() => {
        api.get('/referentiel').then(({ data }) => setReferentiel(data));
    }, []);

    const servicesFiltres = (form.id_direction && referentiel?.services)
        ? referentiel.services.filter((s) => String(s.id_direction) === String(form.id_direction))
        : referentiel?.services ?? [];

    const confirmerSuppression = async () => {
        if (! aSupprimer) return;
        setBusySuppression(true);
        try {
            await api.delete(`/agents/${aSupprimer.id_agent}`);
            setASupprimer(null);
            await loadAgents(q);
        } catch (err) {
            setASupprimer(null);
            alert(err.response?.data?.message ?? t('Suppression impossible (élément utilisé ailleurs).'));
        } finally {
            setBusySuppression(false);
        }
    };

    const ouvrirCreation = () => {
        setForm(VIDE);
        setErrors(null);
        setModal({ mode: 'create' });
    };

    const libelleService = (ag) => {
        if (ag.service?.nom_service) return ag.service.nom_service;
        const s = referentiel?.services?.find((x) => String(x.id_service) === String(ag.id_service));
        return s?.nom_service ?? null;
    };

    const libelleDirection = (ag) => {
        if (ag.direction?.nom_direction) return `${ag.direction.code_direction ? `${ag.direction.code_direction} — ` : ''}${ag.direction.nom_direction}`;
        const d = referentiel?.directions?.find((x) => String(x.id_direction) === String(ag.id_direction));
        return d ? `${d.code_direction ? `${d.code_direction} — ` : ''}${d.nom_direction}` : null;
    };

    const anciennete = (dateEmbauche) => {
        if (! dateEmbauche) return null;
        const debut = new Date(dateEmbauche);
        const ans = Math.floor((Date.now() - debut) / 31557600000);
        if (ans < 1) return t("Moins d'un an");
        return `${ans}${t(ans > 1 ? ' ans' : ' an')} ${t("d'ancienneté")}`;
    };

    const ouvrirEdition = (ag) => {
        setForm({
            matricule: ag.matricule ?? '',
            nom_naiss: ag.nom_naiss ?? '',
            prenom: ag.prenom ?? '',
            sexe: ag.sexe ?? 'M',
            fonction: ag.fonction ?? '',
            telephone: ag.telephone ?? '',
            email: ag.email ?? '',
            // L'API renvoie un datetime ISO (2011-03-13T00:00:00.000000Z) ; un
            // <input type="date"> exige le format YYYY-MM-DD, sinon le champ reste vide.
            date_embauche: (ag.date_embauche ?? '').slice(0, 10),
            statut: ag.statut ?? 'actif',
            id_direction: ag.id_direction ?? '',
            id_service: ag.id_service ?? '',
        });
        setErrors(null);
        setModal({ mode: 'edit', agent: ag });
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors(null);
        try {
            const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v]));
            if (modal?.mode === 'edit') {
                await api.put(`/agents/${modal.agent.id_agent}`, payload);
            } else {
                await api.post('/agents', payload);
            }
            setModal(null);
            await loadAgents(q);
        } catch (err) {
            setErrors(err.response?.data?.errors ?? { erreur: [t('Enregistrement impossible.')] });
        } finally {
            setBusy(false);
        }
    };

    if (! agents) return <Spinner label={t('Chargement des agents…')} />;

    return (
        <div>
            <PageHeader
                title={t('Agents')}
                subtitle={`${agents.length} ${t(' agent(s) enregistré(s)')}`}
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
                            <button onClick={ouvrirCreation} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-600/25">
                                <Plus size={15} /> {t('Nouvel agent')}
                            </button>
                        )}
                    </>
                }
            />

            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-3 mb-4">
                <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Rechercher par matricule, nom, fonction…')} className={`${inputClass} pl-9`} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {agents.map((ag) => (
                    <div key={ag.id_agent} className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-4 hover:shadow-md transition group">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                                    {ag.prenom[0]}{ag.nom_naiss[0]}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-slate-800 text-sm truncate">{ag.prenom} {ag.nom_naiss}</div>
                                    <div className="text-[11px] text-slate-500 truncate">{ag.fonction ? t(ag.fonction) : '—'}</div>
                                </div>
                            </div>
                            <Badge color={
                                ag.statut === 'actif' ? 'bg-vert-100 text-vert-400 border-vert-200'
                                : ag.statut === 'conge' ? 'bg-jaune-100 text-jaune-400 border-jaune-200'
                                : ag.statut === 'mutation' ? 'bg-blue-100 text-blue-300 border-blue-200' : 'bg-rose-100 text-rose-400 border-rose-200'
                            }>
                                {t(ag.statut)}
                            </Badge>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                            <div className="flex justify-between"><span className="text-slate-400">{t('Matricule')}</span><span className="font-mono font-semibold">{ag.matricule}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">{t('Service')}</span><span className="font-medium truncate max-w-[60%]">{ag.service?.nom_service ?? '—'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">{t('Direction')}</span><span className="font-medium">{ag.direction?.code_direction ?? '—'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-400">{t('Téléphone')}</span><span>{ag.telephone ?? '—'}</span></div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end gap-1.5">
                            <button
                                onClick={() => setAConsulter(ag)}
                                title={t('Voir toutes les informations de cet agent')}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200/60 bg-blue-50 hover:bg-blue-100 active:scale-[.95] text-blue-500 text-xs font-semibold transition-all"
                            >
                                <Eye size={13} /> {t('Voir')}
                            </button>
                            {peutEcrire && (
                                <button
                                    onClick={() => setASupprimer(ag)}
                                    title={t('Supprimer cet agent')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200/60 bg-rose-100 hover:bg-rose-200 active:scale-[.95] text-rose-500 text-xs font-semibold transition-all"
                                >
                                    <Trash2 size={13} /> {t('Supprimer')}
                                </button>
                            )}
                            {peutEcrire && (
                                <button
                                    onClick={() => ouvrirEdition(ag)}
                                    title={t('Modifier cet agent')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-card-high text-slate-600 hover:text-sky-400 text-xs font-semibold transition-colors"
                                >
                                    <Pencil size={13} /> {t('Modifier')}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {agents.length === 0 && <EmptyState icon={Users} title={t('Aucun agent trouvé')} />}

            {/* Modale création / édition */}
            <EditModal
                open={!! modal}
                mode={modal?.mode}
                onClose={() => setModal(null)}
                onSubmit={submit}
                busy={busy}
                title={modal?.mode === 'edit' ? `${t('Modifier — ')}${modal.agent.matricule}` : t('Nouvel agent')}
                width="max-w-xl"
            >
                <ErrorText errors={errors} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label={t('Matricule')} required>
                        <input required value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} className={inputClass} placeholder="AG-2026-001" />
                    </Field>
                    <Field label={t('Statut')} required>
                        <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })} className={inputClass}>
                            <option value="actif">{t('Actif')}</option>
                            <option value="inactif">{t('Inactif')}</option>
                            <option value="conge">{t('Congé')}</option>
                            <option value="mutation">{t('Mutation')}</option>
                        </select>
                    </Field>
                    <Field label={t('Nom de naissance')} required>
                        <input required value={form.nom_naiss} onChange={(e) => setForm({ ...form, nom_naiss: e.target.value })} className={inputClass} />
                    </Field>
                    <Field label={t('Prénom')} required>
                        <input required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className={inputClass} />
                    </Field>
                    <Field label={t('Sexe')} required>
                        <select value={form.sexe} onChange={(e) => setForm({ ...form, sexe: e.target.value })} className={inputClass}>
                            <option value="M">{t('Masculin')}</option>
                            <option value="F">{t('Féminin')}</option>
                        </select>
                    </Field>
                    <Field label={t('Fonction')}>
                        <input value={form.fonction} onChange={(e) => setForm({ ...form, fonction: e.target.value })} className={inputClass} />
                    </Field>
                    <Field label={t('Direction')} required>
                        <select required value={form.id_direction} onChange={(e) => setForm({ ...form, id_direction: e.target.value, id_service: '' })} className={inputClass}>
                            <option value="">—</option>
                            {referentiel?.directions?.map((d) => (
                                <option key={d.id_direction} value={d.id_direction}>{d.code_direction} — {d.nom_direction}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label={t('Service')}>
                        <select value={form.id_service} onChange={(e) => setForm({ ...form, id_service: e.target.value })} className={inputClass}>
                            <option value="">—</option>
                            {servicesFiltres.map((s) => (
                                <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label={t('Téléphone')}>
                        <input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className={inputClass} />
                    </Field>
                    <Field label={t('Email')}>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                    </Field>
                    <Field label={t("Date d'embauche")}>
                        <input type="date" value={form.date_embauche} onChange={(e) => setForm({ ...form, date_embauche: e.target.value })} className={inputClass} />
                    </Field>
                </div>
            </EditModal>

            {/* Modale consultation : toutes les informations de l'agent */}
            {aConsulter && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setAConsulter(null); }}>
                    <div className="anim-pop bg-card rounded-2xl shadow-2xl w-full max-w-md border border-slate-200/50 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                {t("Informations de l'agent")}
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono bg-blue-100 text-blue-400">{aConsulter.matricule}</span>
                            </h2>
                            <button onClick={() => setAConsulter(null)} className="p-1.5 text-slate-400 hover:text-slate-700"><X size={18} /></button>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-lg shrink-0">
                                    {aConsulter.prenom[0]}{aConsulter.nom_naiss[0]}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-slate-800">{aConsulter.prenom} {aConsulter.nom_naiss}</div>
                                    <div className="text-xs text-slate-500">{aConsulter.fonction ? t(aConsulter.fonction) : t('Fonction non renseignée')}</div>
                                    <Badge color={
                                        aConsulter.statut === 'actif' ? 'bg-vert-100 text-vert-400 border-vert-200'
                                        : aConsulter.statut === 'conge' ? 'bg-jaune-100 text-jaune-400 border-jaune-200'
                                        : aConsulter.statut === 'mutation' ? 'bg-blue-100 text-blue-300 border-blue-200' : 'bg-rose-100 text-rose-400 border-rose-200'
                                    }>
                                        {t(aConsulter.statut)}
                                    </Badge>
                                </div>
                            </div>
                            <dl className="divide-y divide-slate-100 text-sm">
                                {[
                                    ['Matricule', <span className="font-mono font-semibold">{aConsulter.matricule}</span>],
                                    ['Sexe', aConsulter.sexe === 'F' ? t('Féminin') : t('Masculin')],
                                    ['Direction', libelleDirection(aConsulter) ?? '—'],
                                    ['Service', libelleService(aConsulter) ?? '—'],
                                    ["Date d'embauche", formatDate(aConsulter.date_embauche)],
                                    ['Ancienneté', anciennete(aConsulter.date_embauche) ?? '—'],
                                    ['Téléphone', aConsulter.telephone ?? '—'],
                                    ['Email', aConsulter.email ?? '—'],
                                ].map(([label, valeur]) => (
                                    <div key={label} className="flex justify-between gap-4 py-2">
                                        <dt className="text-slate-400 shrink-0">{t(label)}</dt>
                                        <dd className="font-medium text-slate-700 text-right truncate">{valeur}</dd>
                                    </div>
                                ))
                                }
                            </dl>
                        </div>
                    </div>
                </div>,
                document.body,
            )}

            {/* Confirmation de suppression */}
            <ConfirmModal
                open={!! aSupprimer}
                message={aSupprimer
                    ? <>{t("Voulez-vous vraiment supprimer l'agent ")}<strong className="text-slate-700">« {aSupprimer.prenom} {aSupprimer.nom_naiss} ({aSupprimer.matricule}) »</strong>{t(' ? Cette action est définitive.')}</>
                    : ''}
                busy={busySuppression}
                onConfirm={confirmerSuppression}
                onClose={() => setASupprimer(null)}
            />
        </div>
    );
}
