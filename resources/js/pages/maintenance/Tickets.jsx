import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, LifeBuoy, X, Send, Pencil, FileDown, Trash2, MapPin, Building2, CalendarDays } from 'lucide-react';
import { api } from '../../api';
import { Spinner, PageHeader, EmptyState, Badge, Field, inputClass, ErrorText, EditModal, ConfirmModal } from '../../components/ui';
import { PRIORITES, STATUTS_TICKET, formatDate } from '../../lib/constants';
import { telechargerExport, nomExport } from '../../lib/exports';
import { useAuth, aRole, ROLES_INTERVENTION } from '../../auth';
import { useT } from '../../lib/i18n';

const VIDE = {
    titre: '', motif: '', description: '',
    etat_probleme_avant: '', id_etat_appareil_avant: '',
    priorite: 'moyenne', statut: 'ouvert',
    id_equipement: '', id_agent: '',
    id_direction: '', id_service: '', id_site: '',
};

function Info({ label, children }) {
    return (
        <div className="py-1.5 border-b border-slate-100 last:border-0">
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
            <div className="text-sm text-slate-700">{children || '—'}</div>
        </div>
    );
}

export default function Tickets() {
    const { user } = useAuth();
    const { t } = useT();
    const peutGerer = aRole(user, ROLES_INTERVENTION);
    const peutCreer = Boolean(user);
    const [tickets, setTickets] = useState(null);
    const [equipements, setEquipements] = useState([]);
    const [agents, setAgents] = useState([]);
    const [referentiel, setReferentiel] = useState({ directions: [], services: [], sites: [], etats: [] });
    const [q, setQ] = useState('');
    const [statut, setStatut] = useState('');
    const [directionFiltre, setDirectionFiltre] = useState('');
    const [serviceFiltre, setServiceFiltre] = useState('');
    const [modal, setModal] = useState(null); // null | { mode, ticket? }
    const [selected, setSelected] = useState(null);
    const [commentaire, setCommentaire] = useState('');
    const [form, setForm] = useState(VIDE);
    const [errors, setErrors] = useState(null);
    const [busy, setBusy] = useState(false);
    const [pdfEnCours, setPdfEnCours] = useState(false);
    const [aSupprimer, setASupprimer] = useState(null);
    const [busySuppression, setBusySuppression] = useState(false);

    const confirmerSuppression = async () => {
        if (! aSupprimer) return;
        setBusySuppression(true);
        try {
            await api.delete(`/tickets/${aSupprimer.id_ticket}`);
            setASupprimer(null);
            await load();
        } catch (err) {
            setASupprimer(null);
            alert(err.response?.data?.message ?? t('Suppression impossible (élément utilisé ailleurs).'));
        } finally {
            setBusySuppression(false);
        }
    };

    const imprimerPdf = async () => {
        setPdfEnCours(true);
        try {
            const params = Object.fromEntries(Object.entries({ q, statut }).filter(([, v]) => v !== ''));
            await telechargerExport('/rapports/pdf/ressource/tickets', params, nomExport('registre_tickets'));
        } finally {
            setPdfEnCours(false);
        }
    };

    const load = useCallback(async () => {
        const params = Object.fromEntries(Object.entries({
            q, statut, id_direction: directionFiltre, id_service: serviceFiltre,
        }).filter(([, v]) => v !== ''));
        const { data } = await api.get('/tickets', { params });
        setTickets(data);
    }, [q, statut, directionFiltre, serviceFiltre]);

    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        api.get('/equipements', { params: { per_page: 100 } }).then(({ data }) => setEquipements(data.data));
        api.get('/agents').then(({ data }) => setAgents(data));
        api.get('/referentiel').then(({ data }) => setReferentiel({
            directions: data.directions ?? [],
            services: data.services ?? [],
            sites: data.sites ?? [],
            etats: data.etats ?? [],
        }));
    }, []);

    const ouvrirCreation = () => {
        setForm({ ...VIDE, id_agent: peutGerer ? '' : user?.agent?.id_agent ?? '' });
        setErrors(null);
        setModal({ mode: 'create' });
    };

    const ouvrirEdition = (ticket) => {
        setForm({
            titre: ticket.titre ?? '',
            motif: ticket.motif ?? '',
            description: ticket.description ?? '',
            etat_probleme_avant: ticket.etat_probleme_avant ?? '',
            id_etat_appareil_avant: ticket.id_etat_appareil_avant ?? '',
            priorite: ticket.priorite ?? 'moyenne',
            statut: ticket.statut ?? 'ouvert',
            id_equipement: ticket.id_equipement ?? '',
            id_agent: ticket.id_agent ?? '',
            id_direction: ticket.id_direction ?? '',
            id_service: ticket.id_service ?? '',
            id_site: ticket.id_site ?? '',
        });
        setErrors(null);
        setModal({ mode: 'edit', ticket });
    };

    /* Le matériel détermine le périmètre par défaut : service et direction
       réellement affectés, centre (site) et état avant l'intervention. */
    const choisirEquipement = (id) => {
        const eq = equipements.find((e) => String(e.id_equipement) === String(id));
        setForm((f) => ({
            ...f,
            id_equipement: id,
            id_direction: eq?.id_direction ?? '',
            id_service: eq?.id_service ?? '',
            id_site: eq?.localisation?.batiment?.site?.id_site ?? '',
            id_etat_appareil_avant: eq?.id_etat ?? f.id_etat_appareil_avant,
        }));
    };

    const choisirDirection = (valeur) => {
        setForm((f) => ({
            ...f,
            id_direction: valeur,
            id_service: f.id_direction && String(f.id_direction) !== String(valeur) ? '' : f.id_service,
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors(null);
        try {
            const payload = {
                ...form,
                id_equipement: form.id_equipement || null,
                id_agent: form.id_agent || null,
                id_direction: form.id_direction || null,
                id_service: form.id_service || null,
                id_site: form.id_site || null,
                id_etat_appareil_avant: form.id_etat_appareil_avant || null,
            };
            if (modal?.mode === 'edit') {
                await api.put(`/tickets/${modal.ticket.id_ticket}`, payload);
            } else {
                await api.post('/tickets', payload);
            }
            setModal(null);
            await load();
        } catch (err) {
            setErrors(err.response?.data?.errors ?? { erreur: [t('Enregistrement impossible.')] });
        } finally {
            setBusy(false);
        }
    };

    const changeStatut = async (id, newStatut) => {
        await api.put(`/tickets/${id}`, { statut: newStatut });
        await load();
        if (selected?.id_ticket === id) setSelected({ ...selected, statut: newStatut });
    };

    const addCommentaire = async (e) => {
        e.preventDefault();
        if (! commentaire.trim()) return;
        const { data } = await api.post(`/tickets/${selected.id_ticket}/commentaires`, { contenu: commentaire });
        setSelected({ ...selected, commentaires: [...(selected.commentaires ?? []), data] });
        setCommentaire('');
    };

    if (! tickets) return <Spinner label={t('Chargement des tickets…')} />;

    const servicesDisponibles = (referentiel.services ?? []).filter(
        (s) => ! form.id_direction || String(s.id_direction) === String(form.id_direction)
    );

    /* Services proposés dans la barre de tri, restreints à la direction choisie. */
    const servicesPourFiltre = (referentiel.services ?? []).filter(
        (s) => ! directionFiltre || String(s.id_direction) === String(directionFiltre)
    );

    return (
        <div>
            <PageHeader
                title={t("Tickets d'assistance")}
                subtitle={`${tickets.length} ${t(' ticket(s)')}`}
                actions={
                    <>
                        <button
                            onClick={imprimerPdf}
                            disabled={pdfEnCours}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-300 text-sm font-bold transition-all disabled:opacity-60"
                        >
                            <FileDown size={15} /> {pdfEnCours ? t('Génération…') : t('Imprimer PDF')}
                        </button>
                        {peutCreer && (
                            <button onClick={ouvrirCreation} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-600/25">
                                <Plus size={15} /> {t('Nouveau ticket')}
                            </button>
                        )}
                    </>
                }
            />

            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-3 mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Rechercher (référence, motif, titre)…')} className={`${inputClass} pl-9`} />
                </div>
                <select value={statut} onChange={(e) => setStatut(e.target.value)} className={`${inputClass} sm:w-44`}>
                    <option value="">{t('Tous les statuts')}</option>
                    {Object.entries(STATUTS_TICKET).map(([k, m]) => (
                        <option key={k} value={k}>{m.label}</option>
                    ))}
                </select>
                <select
                    value={directionFiltre}
                    onChange={(e) => { setDirectionFiltre(e.target.value); setServiceFiltre(''); }}
                    className={`${inputClass} sm:w-52`}
                    title={t('Trier par direction')}
                >
                    <option value="">{t('Toutes les directions')}</option>
                    {(referentiel.directions ?? []).map((d) => (
                        <option key={d.id_direction} value={d.id_direction}>
                            {d.code_direction ? `${d.code_direction} — ` : ''}{d.nom_direction}
                        </option>
                    ))}
                </select>
                <select
                    value={serviceFiltre}
                    onChange={(e) => setServiceFiltre(e.target.value)}
                    className={`${inputClass} sm:w-52`}
                    title={t('Trier par service')}
                >
                    <option value="">{t('Tous les services')}</option>
                    {servicesPourFiltre.map((s) => (
                        <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>
                    ))}
                </select>
            </div>

            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {tickets.map((tk) => (
                        <div key={tk.id_ticket} className="p-4 hover:bg-blue-50/30 transition flex items-start justify-between gap-3">
                            <div className="min-w-0 cursor-pointer flex-1" onClick={() => setSelected(tk)}>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-xs font-bold text-blue-300">{tk.reference_ticket}</span>
                                    <Badge color={PRIORITES[tk.priorite]?.color}>{PRIORITES[tk.priorite]?.label}</Badge>
                                    <Badge color={STATUTS_TICKET[tk.statut]?.color}>{STATUTS_TICKET[tk.statut]?.label}</Badge>
                                </div>
                                <div className="font-semibold text-slate-800 mt-1">{tk.titre}</div>
                                {tk.motif && tk.motif !== tk.titre && (
                                    <div className="text-xs text-slate-600 mt-0.5">{tk.motif}</div>
                                )}
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                    {tk.equipement ? `${tk.equipement.code_inventaire} · ` : ''}
                                    {tk.service?.nom_service ? `${tk.service.nom_service} · ` : ''}
                                    {tk.site?.nom_site ? `${tk.site.nom_site} · ` : ''}
                                    {tk.agent ? `${tk.agent.prenom} ${tk.agent.nom_naiss} · ` : ''}
                                    {t('créé le ')}{formatDate(tk.date_creation)}
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {peutGerer && (
                                    <button
                                        onClick={() => setASupprimer(tk)}
                                        title={t('Supprimer ce ticket')}
                                        className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-rose-200/60 bg-rose-100 hover:bg-rose-200 active:scale-[.95] text-rose-500 text-xs font-semibold transition-all"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                )}
                                {peutGerer && (
                                    <button
                                        onClick={() => ouvrirEdition(tk)}
                                        title={t('Modifier ce ticket')}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-card-high text-slate-600 hover:text-sky-400 text-xs font-semibold transition-colors"
                                    >
                                        <Pencil size={13} /> {t('Modifier')}
                                    </button>
                                )}
                                {peutGerer ? (
                                    <select
                                        value={tk.statut}
                                        onChange={(e) => changeStatut(tk.id_ticket, e.target.value)}
                                        title={t('Changer le statut')}
                                        className="text-xs border border-slate-200/50 rounded-lg px-2 py-1.5 bg-card-high text-slate-700"
                                    >
                                        {Object.entries(STATUTS_TICKET).map(([k, m]) => (
                                            <option key={k} value={k}>{m.label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <Badge color={STATUTS_TICKET[tk.statut]?.color}>{STATUTS_TICKET[tk.statut]?.label ?? tk.statut}</Badge>
                                )}
                            </div>
                        </div>
                    ))}
                    {tickets.length === 0 && <EmptyState icon={LifeBuoy} title={t('Aucun ticket')} hint={t("Créez le premier ticket d'assistance.")} />}
                </div>
            </div>

            {/* Modale création / édition */}
            <EditModal
                open={!! modal}
                mode={modal?.mode}
                onClose={() => setModal(null)}
                onSubmit={submit}
                busy={busy}
                title={modal?.mode === 'edit' ? `${t('Modifier — ')}${modal.ticket.reference_ticket}` : t('Nouveau ticket')}
                width="max-w-2xl"
            >
                <ErrorText errors={errors} />
                <div className="space-y-3">
                    {modal?.mode === 'create' && (
                        <p className="text-[11px] text-slate-500 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
                            {t('Le numéro de ticket est attribué automatiquement à l’enregistrement (TCK-année-n°).')}
                        </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label={t('Titre')} required>
                            <input required value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} className={inputClass} />
                        </Field>
                        <Field label={t('Motif')}>
                            <input value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} className={inputClass} placeholder={t('Ex. : panne d’alimentation')} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label={t('Équipement concerné')}>
                            <select value={form.id_equipement} onChange={(e) => choisirEquipement(e.target.value)} className={inputClass}>
                                <option value="">—</option>
                                {equipements.map((eq) => (
                                    <option key={eq.id_equipement} value={eq.id_equipement}>{eq.code_inventaire} — {eq.designation}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label={t('Agent demandeur')}>
                            {peutGerer ? (
                                <select value={form.id_agent} onChange={(e) => setForm({ ...form, id_agent: e.target.value })} className={inputClass}>
                                    <option value="">{t('— (moi par défaut)')}</option>
                                    {agents.map((ag) => (
                                        <option key={ag.id_agent} value={ag.id_agent}>{ag.prenom} {ag.nom_naiss}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    readOnly
                                    value={user?.agent ? `${user.agent.prenom} ${user.agent.nom_naiss}` : user?.username ?? ''}
                                    className={`${inputClass} opacity-80`}
                                />
                            )}
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Field label={t('Direction concernée')}>
                            <select value={form.id_direction} onChange={(e) => choisirDirection(e.target.value)} className={inputClass}>
                                <option value="">—</option>
                                {(referentiel.directions ?? []).map((d) => (
                                    <option key={d.id_direction} value={d.id_direction}>{d.nom_direction}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label={t('Service concerné')}>
                            <select value={form.id_service} onChange={(e) => setForm({ ...form, id_service: e.target.value })} className={inputClass}>
                                <option value="">—</option>
                                {servicesDisponibles.map((s) => (
                                    <option key={s.id_service} value={s.id_service}>{s.nom_service}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label={t('Centre (site)')}>
                            <select value={form.id_site} onChange={(e) => setForm({ ...form, id_site: e.target.value })} className={inputClass}>
                                <option value="">—</option>
                                {(referentiel.sites ?? []).map((s) => (
                                    <option key={s.id_site} value={s.id_site}>{s.nom_site}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <Field label={t("État de l'appareil avant")}>
                            <select value={form.id_etat_appareil_avant} onChange={(e) => setForm({ ...form, id_etat_appareil_avant: e.target.value })} className={inputClass}>
                                <option value="">—</option>
                                {(referentiel.etats ?? []).map((et) => (
                                    <option key={et.id_etat} value={et.id_etat}>{et.nom_etat}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label={t('Priorité')} required>
                            <select value={form.priorite} onChange={(e) => setForm({ ...form, priorite: e.target.value })} className={inputClass}>
                                {Object.entries(PRIORITES).map(([k, m]) => (
                                    <option key={k} value={k}>{m.label}</option>
                                ))}
                            </select>
                        </Field>
                        {peutGerer && (
                            <Field label={t('Statut')}>
                                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })} className={inputClass}>
                                    {Object.entries(STATUTS_TICKET).map(([k, m]) => (
                                        <option key={k} value={k}>{m.label}</option>
                                    ))}
                                </select>
                            </Field>
                        )}
                    </div>

                    <Field label={t('Description')}>
                        <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
                    </Field>
                    <Field label={t('État du problème avant intervention')}>
                        <textarea rows={3} value={form.etat_probleme_avant} onChange={(e) => setForm({ ...form, etat_probleme_avant: e.target.value })} className={inputClass} placeholder={t('Symptômes constatés, message d’erreur, contexte…')} />
                    </Field>
                </div>
            </EditModal>

            {/* Confirmation de suppression */}
            <ConfirmModal
                open={!! aSupprimer}
                message={aSupprimer
                    ? <>{t('Voulez-vous vraiment supprimer le ticket ')}<strong className="text-slate-700">« {aSupprimer.reference_ticket} — {aSupprimer.titre} »</strong>{t(' ? Cette action est définitive.')}</>
                    : ''}
                busy={busySuppression}
                onConfirm={confirmerSuppression}
                onClose={() => setASupprimer(null)}
            />

            {/* Modale détail (portail : position fixed fiable) */}
            {selected && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col border border-slate-200/50">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50">
                            <div>
                                <div className="font-mono text-xs font-bold text-blue-300">{selected.reference_ticket}</div>
                                <h2 className="font-bold text-slate-800">{selected.titre}</h2>
                                {selected.motif && selected.motif !== selected.titre && (
                                    <p className="text-xs text-slate-500">{selected.motif}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5">
                                {peutGerer && (
                                    <button
                                        onClick={() => { ouvrirEdition(selected); setSelected(null); }}
                                        title={t('Modifier ce ticket')}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200/50 bg-slate-100 hover:bg-card-high text-slate-600 hover:text-sky-400 text-xs font-semibold transition-colors"
                                    >
                                        <Pencil size={13} /> {t('Modifier')}
                                    </button>
                                )}
                                <button onClick={() => setSelected(null)} className="p-1.5 text-slate-400 hover:text-slate-800"><X size={18} /></button>
                            </div>
                        </div>
                        <div className="p-5 overflow-y-auto space-y-4 flex-1">
                            <div className="flex gap-2 flex-wrap">
                                <Badge color={PRIORITES[selected.priorite]?.color}>{t('Priorité ')}{PRIORITES[selected.priorite]?.label}</Badge>
                                <Badge color={STATUTS_TICKET[selected.statut]?.color}>{STATUTS_TICKET[selected.statut]?.label}</Badge>
                                <Badge>{formatDate(selected.date_creation)}</Badge>
                                {selected.date_cloture && <Badge>{t('Clôturé le ')}{formatDate(selected.date_cloture)}</Badge>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                                <Info label={t('Direction concernée')}>{selected.direction?.nom_direction}</Info>
                                <Info label={t('Service concerné')}>{selected.service?.nom_service}</Info>
                                <Info label={t('Centre (site)')}>
                                    <span className="inline-flex items-center gap-1"><Building2 size={12} className="text-slate-400" />{selected.site?.nom_site ?? '—'}</span>
                                </Info>
                                <Info label={t('Équipement concerné')}>
                                    {selected.equipement
                                        ? <span>{selected.equipement.code_inventaire} — {selected.equipement.designation}</span>
                                        : '—'}
                                </Info>
                                <Info label={t('Agent demandeur')}>{selected.agent ? `${selected.agent.prenom} ${selected.agent.nom_naiss}` : '—'}</Info>
                                <Info label={t("État de l'appareil avant")}>
                                    {selected.etat_appareil_avant?.nom_etat ?? '—'}
                                </Info>
                            </div>

                            {selected.description && (
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">{t('Description')}</h4>
                                    <p className="text-sm text-slate-600 whitespace-pre-line">{selected.description}</p>
                                </div>
                            )}
                            {selected.etat_probleme_avant && (
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">{t('État du problème avant intervention')}</h4>
                                    <p className="text-sm text-slate-600 whitespace-pre-line">{selected.etat_probleme_avant}</p>
                                </div>
                            )}

                            <div className="border-t border-slate-100 pt-3">
                                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">{t('Commentaires (')}{selected.commentaires?.length ?? 0})</h4>
                                <div className="space-y-2">
                                    {selected.commentaires?.map((c) => (
                                        <div key={c.id_commentaire} className="rounded-xl bg-slate-50 border border-slate-200/50 p-3">
                                            <div className="text-xs font-bold text-slate-700">{c.utilisateur?.username ?? 'Système'}</div>
                                            <p className="text-sm text-slate-600">{c.contenu}</p>
                                        </div>
                                    ))}
                                    {(selected.commentaires?.length ?? 0) === 0 && <p className="text-xs text-slate-500">{t('Aucun commentaire.')}</p>}
                                </div>
                            </div>
                        </div>
                        <form onSubmit={addCommentaire} className="p-4 border-t border-slate-200/50 flex gap-2">
                            <input
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                                placeholder={t('Ajouter un commentaire…')}
                                className={inputClass}
                            />
                            <button className="shrink-0 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">
                                <Send size={15} />
                            </button>
                        </form>
                    </div>
                </div>,
                document.body,
            )}
        </div>
    );
}
