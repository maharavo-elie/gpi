import { useCallback, useEffect, useState } from 'react';
import { Trash2, RotateCcw, Archive, Monitor, Users } from 'lucide-react';
import { api } from '../api';
import { Spinner, PageHeader, EmptyState, Badge, ConfirmModal } from '../components/ui';
import { useAuth, ROLES_ECRITURE, aRole } from '../auth';
import { sons } from '../lib/sons';

/* Onglets : un par section de la corbeille (style identique à Rapports). */
const SECTIONS = [
    { key: 'equipements', label: 'Équipements', icon: Monitor },
    { key: 'agents', label: 'Agents', icon: Users },
];

const sectionDe = (item) => item.code_inventaire !== undefined ? 'equipements' : 'agents';

const formatDateTime = (iso) => {
    if (! iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
        + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

function Ligne({ item, peutEffacer, onRestaurer, onSupprimer }) {
    const equipement = item.code_inventaire !== undefined;
    return (
        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-100/60">
            <td className="py-2.5 pr-3 text-xs font-mono text-slate-500">{formatDateTime(item.deleted_at)}</td>
            {equipement ? (
                <>
                    <td className="py-2.5 pr-3">
                        <span className="font-mono text-xs font-bold text-blue-300">{item.code_inventaire}</span>
                        <span className="block text-xs text-slate-600 truncate max-w-56">{item.designation}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-xs text-slate-600">{item.marque ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-600">{item.categorie ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-600">{item.localisation ?? '—'}</td>
                </>
            ) : (
                <>
                    <td className="py-2.5 pr-3 text-xs font-semibold text-slate-700">{item.nom_complet}</td>
                    <td className="py-2.5 pr-3 text-xs font-mono text-slate-500">{item.matricule}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-600">{item.fonction ?? '—'}</td>
                    <td className="py-2.5 pr-3 text-xs text-slate-600">{item.direction ?? '—'}</td>
                </>
            )}
            {peutEffacer && (
                <td className="py-2.5 text-right whitespace-nowrap">
                    <button
                        onClick={() => { sons.clic(); onRestaurer(item); }}
                        title="Restaurer cet élément"
                        className="p-1.5 rounded-lg text-vert-600 hover:text-vert-700 hover:bg-vert-100 transition-colors mr-1"
                    >
                        <RotateCcw size={14} />
                    </button>
                    <button
                        onClick={() => { sons.clic(); onSupprimer(item); }}
                        title="Supprimer définitivement"
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </td>
            )}
        </tr>
    );
}

function OngletSection({ section, items, loading, peutEffacer, onRestaurer, onSupprimer, onVider }) {
    const { label, icon: Icon } = SECTIONS.find((s) => s.key === section);

    const colonnes = section === 'equipements'
        ? ['Supprimé le', 'Équipement', 'Marque', 'Catégorie', 'Localisation']
        : ['Supprimé le', 'Nom', 'Matricule', 'Fonction', 'Direction'];

    return (
        <div className="bg-card rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Icon size={16} className={items?.length ? 'text-rose-600' : 'text-slate-400'} />
                    Corbeille des {label.toLowerCase()}
                    <Badge color={items?.length ? 'bg-vert-100 text-vert-400 border-vert-200' : 'bg-slate-200 text-slate-500 border-slate-300'}>
                        {items?.length ?? 0}
                    </Badge>
                </h3>
                {peutEffacer && items?.length > 0 && (
                    <button
                        onClick={() => { sons.clic(); onVider(section); }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors"
                    >
                        <Trash2 size={13} />
                        Vider
                    </button>
                )}
            </div>

            {loading ? <Spinner label="Chargement de la corbeille…" /> : (
                items?.length ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                    {colonnes.map((c) => <th key={c} className="py-2 pr-3">{c}</th>)}
                                    {peutEffacer && <th className="py-2 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <Ligne
                                        key={item.id}
                                        item={item}
                                        peutEffacer={peutEffacer}
                                        onRestaurer={onRestaurer}
                                        onSupprimer={onSupprimer}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState icon={Archive} title={`Corbeille des ${label.toLowerCase()} : vide`} hint="Aucun élément supprimé pour le moment." />
                )
            )}
        </div>
    );
}

export default function Corbeille() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [onglet, setOnglet] = useState('equipements');
    const [aRestaurer, setARestaurer] = useState(null);
    const [aSupprimer, setASupprimer] = useState(null);
    const [sectionAVider, setSectionAVider] = useState(null);

    const { user } = useAuth();
    const peutEffacer = aRole(user, ROLES_ECRITURE);

    const charger = useCallback(async () => {
        setLoading(true);
        try {
            const { data: d } = await api.get('/corbeille');
            setData(d);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { charger(); }, [charger]);

    const restaurer = async (item) => {
        setBusy(true);
        try {
            await api.put(`/corbeille/${sectionDe(item)}/${item.id}/restaurer`);
            sons.succes();
            setARestaurer(null);
            await charger();
        } catch {
            sons.alerte?.();
            setBusy(false);
        }
    };

    const supprimerDefinitivement = async (item) => {
        setBusy(true);
        try {
            await api.delete(`/corbeille/${sectionDe(item)}/${item.id}`);
            sons.succes();
            setASupprimer(null);
            await charger();
        } catch {
            sons.alerte?.();
            setBusy(false);
        }
    };

    const viderSection = async (section) => {
        setBusy(true);
        try {
            await api.delete(`/corbeille/${section}`);
            sons.succes();
            setSectionAVider(null);
            await charger();
        } catch {
            sons.alerte?.();
            setBusy(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Corbeille"
                subtitle="Équipements et agents supprimés — restaurez-les ou effacez-les définitivement"
            />

            {/* Onglets : choisir la section (style identique à Rapports) */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 self-start mb-4">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => { setOnglet(key); sons.clic(); }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                            onglet === key
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        <Icon size={14} /> {label}
                        <Badge
                            color={data?.[key]?.length
                                ? 'bg-vert-100 text-vert-400 border-vert-200'
                                : 'bg-slate-200 text-slate-500 border-slate-300'}
                        >
                            {data?.[key]?.length ?? 0}
                        </Badge>
                    </button>
                ))}
            </div>

            {loading && ! data ? <Spinner label="Chargement de la corbeille…" /> : (
                <OngletSection
                    section={onglet}
                    items={data?.[onglet]}
                    loading={loading}
                    peutEffacer={peutEffacer}
                    onRestaurer={setARestaurer}
                    onSupprimer={setASupprimer}
                    onVider={setSectionAVider}
                />
            )}

            {/* Restaurer */}
            <ConfirmModal
                open={!! aRestaurer}
                title="Restaurer cet élément ?"
                message={<>L'élément redeviendra visible normalement dans l'application.</>}
                confirmLabel="Restaurer"
                cancelLabel="Annuler"
                busyLabel="Restauration…"
                busy={busy}
                danger={false}
                icone={<RotateCcw size={15} />}
                onConfirm={() => restaurer(aRestaurer)}
                onClose={() => setARestaurer(null)}
            />

            {/* Supprimer définitivement */}
            <ConfirmModal
                open={!! aSupprimer}
                title="Supprimer définitivement ?"
                message={<>L'élément sera effacé de la base de données. Cette action est <strong className="text-slate-700">irréversible</strong>.</>}
                confirmLabel="Supprimer définitivement"
                cancelLabel="Annuler"
                busyLabel="Suppression…"
                busy={busy}
                onConfirm={() => supprimerDefinitivement(aSupprimer)}
                onClose={() => setASupprimer(null)}
            />

            {/* Vider une section */}
            <ConfirmModal
                open={!! sectionAVider}
                title="Vider cette corbeille ?"
                message={<>Tous les éléments supprimés de cette section seront effacés définitivement. Action <strong className="text-slate-700">irréversible</strong>.</>}
                confirmLabel="Vider"
                cancelLabel="Annuler"
                busyLabel="Purge…"
                busy={busy}
                onConfirm={() => viderSection(sectionAVider)}
                onClose={() => setSectionAVider(null)}
            />
        </div>
    );
}
