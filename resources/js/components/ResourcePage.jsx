import { useCallback, useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, FileDown } from 'lucide-react';
import { api } from '../api';
import { useAuth, aRole, ROLES_ECRITURE } from '../auth';
import { Spinner, PageHeader, EmptyState, Badge, Field, inputClass, ErrorText, EditModal, ConfirmModal } from './ui';
import { formatDate } from '../lib/constants';
import { sons } from '../lib/sons';
import { telechargerExport, nomExport } from '../lib/exports';

/**
 * Page de gestion générique : table + recherche + filtre optionnel,
 * création et modification en modale, suppression avec confirmation.
 *
 * colonnes : [{ key, label, width?, mono?, badge?, date?, render? }]
 * champs   : [{ key, label, required?, type?: text|date|number|textarea|select|ref, options?, source?, get? }]
 */
export default function ResourcePage({
    titre,
    sousTitre,
    endpoint,
    idKey,
    colonnes,
    champs,
    valeursDefaut = {},
    filtreStatut = null,
    labelElement,
    nomRessource, // slug backend pour l'export PDF (ex. 'maintenances')
    rolesEcriture = ROLES_ECRITURE, // rôles autorisés à créer/modifier/supprimer
}) {
    const { user } = useAuth();
    const peutEcrire = aRole(user, rolesEcriture);
    const [items, setItems] = useState(null);
    const [ref, setRef] = useState(null);
    const [q, setQ] = useState('');
    const [statutFiltre, setStatutFiltre] = useState('');
    const [modal, setModal] = useState(null); // null | { mode, item? }
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState(null);
    const [busy, setBusy] = useState(false);
    const [pdfEnCours, setPdfEnCours] = useState(false);
    const [message, setMessage] = useState(null);
    const [aSupprimer, setASupprimer] = useState(null); // élément en attente de confirmation
    const [busySuppression, setBusySuppression] = useState(false);

    const nomSuppression = aSupprimer
        ? (aSupprimer[colonnes.find((c) => ! c.render && ! c.badge && ! c.date)?.key] ?? aSupprimer[idKey])
        : '';

    /* Export PDF du registre de la section (respecte recherche + filtre statut). */
    const imprimerPdf = async () => {
        if (! nomRessource) return;
        setPdfEnCours(true);
        try {
            const params = Object.fromEntries(Object.entries({ q, statut: statutFiltre }).filter(([, v]) => v !== ''));
            await telechargerExport(`/rapports/pdf/ressource/${nomRessource}`, params, nomExport(`registre_${nomRessource}`));
        } catch {
            setMessage({ text: 'Génération du PDF impossible.', type: 'error' });
            setTimeout(() => setMessage(null), 4000);
        } finally {
            setPdfEnCours(false);
        }
    };

    const chargeRef = () => api.get('/referentiel').then(({ data }) => setRef(data));

    const load = useCallback(async () => {
        const params = Object.fromEntries(Object.entries({ q, statut: statutFiltre }).filter(([, v]) => v !== ''));
        const { data } = await api.get(endpoint, { params });
        setItems(Array.isArray(data) ? data : data.data ?? []);
    }, [endpoint, q, statutFiltre]);

    useEffect(() => {
        const t = setTimeout(() => { load(); }, 250);
        return () => clearTimeout(t);
    }, [load]);

    useEffect(() => { chargeRef(); }, []);

    const notifier = (text, type = 'info') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    const ouvrirCreation = () => {
        const vide = {};
        champs.forEach((c) => {
            vide[c.key] = c.type === 'select' && c.options ? (c.options.find(([v]) => v !== '')?.[0] ?? '') : '';
        });
        setForm({ ...vide, ...valeursDefaut });
        setErrors(null);
        setModal({ mode: 'create' });
        sons.ouvrir();
    };

    const ouvrirEdition = (item) => {
        const data = {};
        champs.forEach((c) => {
            let v = item[c.key] ?? '';
            if (c.type === 'date' && v) v = String(v).slice(0, 10);
            data[c.key] = v;
        });
        setForm(data);
        setErrors(null);
        setModal({ mode: 'edit', item });
        sons.ouvrir();
    };

    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErrors(null);
        try {
            const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v]));
            if (modal?.mode === 'edit') {
                await api.put(`${endpoint}/${modal.item[idKey]}`, payload);
                notifier('Modifications enregistrées.');
            } else {
                await api.post(endpoint, payload);
                notifier(`${labelElement ?? 'Élément'} créé(e).`);
            }
            setModal(null);
            sons.succes();
            await load();
        } catch (err) {
            setErrors(err.response?.data?.errors ?? { erreur: [err.response?.data?.message ?? 'Enregistrement impossible.'] });
        } finally {
            setBusy(false);
        }
    };

    const supprimer = (item) => {
        const col = colonnes.find((c) => ! c.render && ! c.badge && ! c.date);
        const nom = col ? (item[col.key] ?? '') : '';
        setASupprimer(item);
        sons.ouvrir();
    };

    const confirmerSuppression = async () => {
        if (! aSupprimer) return;
        setBusySuppression(true);
        try {
            await api.delete(`${endpoint}/${aSupprimer[idKey]}`);
            notifier('Élément supprimé.');
            sons.succes();
            setASupprimer(null);
            await load();
        } catch (err) {
            notifier(err.response?.data?.message ?? 'Suppression impossible (élément utilisé ailleurs).', 'error');
            sons.alerte();
        } finally {
            setBusySuppression(false);
        }
    };

    if (! items) return <Spinner label={`Chargement ${titre.toLowerCase()}…`} />;

    return (
        <div className="anim-fade-up">
            <PageHeader
                title={titre}
                subtitle={sousTitre ?? `${items.length} élément(s)`}
                actions={
                    <>
                        {nomRessource && (
                            <button
                                onClick={imprimerPdf}
                                disabled={pdfEnCours}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 active:scale-[.97] text-blue-300 text-sm font-bold transition-all disabled:opacity-60"
                            >
                                <FileDown size={15} /> {pdfEnCours ? 'Génération…' : 'Imprimer PDF'}
                            </button>
                        )}
                        {peutEcrire && (
                            <button onClick={ouvrirCreation} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-vert-600 hover:bg-vert-700 active:scale-[.97] text-white text-sm font-bold shadow-sm shadow-vert-600/30 transition-all">
                                <Plus size={15} /> Ajouter
                            </button>
                        )}
                    </>
                }
            />

            {message && (
                <div className={`mb-4 rounded-lg border p-3 text-sm ${
                    message.type === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-500'
                        : 'bg-vert-100 border-vert-400 text-vert-600'
                }`}>{message.text}</div>
            )}

            {/* Recherche + filtre statut optionnel */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm p-3 mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className={`${inputClass} pl-9`} />
                </div>
                {filtreStatut && (
                    <select value={statutFiltre} onChange={(e) => setStatutFiltre(e.target.value)} className={`${inputClass} sm:w-48`}>
                        <option value="">Tous les statuts</option>
                        {filtreStatut.map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden anim-fade-up anim-d2">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-100 text-left text-[11px] uppercase tracking-wide text-slate-500 border-b border-slate-200/50">
                                {colonnes.map((c) => (
                                    <th key={c.key} className={`px-4 py-2.5 font-bold ${c.width ?? ''}`}>{c.label}</th>
                                ))}
                                <th className="px-4 py-2.5 text-right font-bold w-44">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item, i) => (
                                <tr
                                    key={item[idKey]}
                                    className="anim-fade-in hover:bg-blue-50/40 transition-colors duration-150 hover:shadow-[inset_3px_0_0_var(--color-blue-500)]"
                                    style={{ animationDelay: `${Math.min(i * 35, 420)}ms` }}
                                >
                                    {colonnes.map((c) => (
                                        <td key={c.key} className="px-4 py-2.5 text-slate-700">
                                            {c.render
                                                ? c.render(item)
                                                : c.badge
                                                    ? <Badge color={c.badge(item[c.key])}>{c.badgeLabel?.(item[c.key]) ?? item[c.key] ?? '—'}</Badge>
                                                    : c.date
                                                        ? formatDate(item[c.key])
                                                        : c.mono
                                                            ? <span className="font-mono text-xs font-semibold text-blue-300">{item[c.key] ?? '—'}</span>
                                                            : (item[c.key] ?? '—')}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {peutEcrire && (
                                                <button
                                                    onMouseEnter={() => sons.clic()}
                                                    onClick={() => ouvrirEdition(item)}
                                                    title="Modifier"
                                                    className="anim-wiggle inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-orange-200/60 bg-orange-100 hover:bg-orange-200 active:scale-[.95] text-orange-400 text-xs font-semibold transition-all"
                                                >
                                                    <Pencil size={13} /> Modifier
                                                </button>
                                            )}
                                            {peutEcrire && (
                                                <button
                                                    onClick={() => supprimer(item)}
                                                    title="Supprimer"
                                                    className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-rose-200/60 bg-rose-100 hover:bg-rose-200 active:scale-[.95] text-rose-400 text-xs font-semibold transition-all"
                                                >
                                                    <Trash2 size={13} /> Supprimer
                                                </button>
                                            )}
                                            {!peutEcrire && (
                                                <span className="text-xs text-slate-400 italic">Lecture seule</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={colonnes.length + 1}>
                                        <EmptyState title="Aucun élément" hint="Ajoutez le premier ou ajustez la recherche." />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modale de confirmation de suppression */}
            <ConfirmModal
                open={!! aSupprimer}
                message={aSupprimer ? <>Voulez-vous vraiment supprimer <strong className="text-slate-700">« {nomSuppression} »</strong> ? Cette action est définitive.</> : ''}
                busy={busySuppression}
                onConfirm={confirmerSuppression}
                onClose={() => setASupprimer(null)}
            />

            {/* Modale création / édition */}
            <EditModal
                open={!! modal}
                mode={modal?.mode}
                onClose={() => setModal(null)}
                onSubmit={submit}
                busy={busy}
                title={modal?.mode === 'edit'
                    ? `Modifier — ${colonnes.find((c) => c.mono)?.render?.(modal.item) ?? modal.item[idKey]}`
                    : `Nouvel élément — ${titre}`}
                width="max-w-xl"
            >
                <ErrorText key={errors ? JSON.stringify(errors) : 'aucune'} errors={errors} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {champs.map((c) => (
                        <Field key={c.key} label={c.label} required={c.required}>
                            {c.type === 'select' ? (
                                <select value={form[c.key] ?? ''} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })} className={inputClass}>
                                    {(c.options ?? []).map(([v, l]) => (
                                        <option key={v} value={v}>{l}</option>
                                    ))}
                                </select>
                            ) : c.type === 'ref' ? (
                                <select value={form[c.key] ?? ''} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })} className={inputClass}>
                                    <option value="">—</option>
                                    {(ref?.[c.source] ?? []).map((o) => (
                                        <option key={o[c.idSource ?? Object.keys(o)[0]]} value={o[c.idSource ?? Object.keys(o)[0]]}>{c.get(o)}</option>
                                    ))}
                                </select>
                            ) : c.type === 'textarea' ? (
                                <textarea rows={2} value={form[c.key] ?? ''} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })} className={inputClass} />
                            ) : (
                                <input
                                    type={c.type ?? 'text'}
                                    required={c.required}
                                    value={form[c.key] ?? ''}
                                    onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                                    className={inputClass}
                                />
                            )}
                        </Field>
                    ))}
                </div>
            </EditModal>
        </div>
    );
}
