import { Star } from 'lucide-react';
import ResourcePage from '../../components/ResourcePage';
import { formatAr, formatDate } from '../../lib/constants';

const BADGES = {
    commande: 'bg-sky-100 text-sky-400 border-sky-200',
    livre_partiel: 'bg-orange-100 text-orange-400 border-orange-200',
    livre: 'bg-vert-100 text-vert-400 border-vert-200',
    annule: 'bg-rose-100 text-rose-400 border-rose-200',
};
const LABELS = { commande: 'Commandé', livre_partiel: 'Livré partiel', livre: 'Livré', annule: 'Annulé' };

function Etoiles({ note }) {
    return (
        <span className="inline-flex items-center gap-0.5" title={note ? `${note}/5` : undefined}>
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={12}
                    className={Number(note) >= n ? 'fill-jaune-400 text-jaune-400' : 'text-slate-400'}
                />
            ))}
        </span>
    );
}

function Ligne({ label, children }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
            <span className="text-xs text-slate-500 shrink-0">{label}</span>
            <span className="text-sm font-medium text-slate-800 text-right">{children ?? '—'}</span>
        </div>
    );
}

/* Fiche d'un achat : met en avant l'appréciation, puis la traçabilité. */
function AchatDetail({ achat }) {
    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Appréciation de l’achat
                </div>
                <div className="mt-1 flex items-center gap-2">
                    <Etoiles note={achat.appreciation} />
                    <span className="text-sm font-bold text-slate-800">
                        {achat.appreciation ? `${achat.appreciation}/5` : 'Non renseignée'}
                    </span>
                </div>
                {achat.appreciation_commentaire && (
                    <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                        {achat.appreciation_commentaire}
                    </p>
                )}
            </div>

            <div>
                <Ligne label="Référence">
                    <span className="font-mono text-xs font-bold text-blue-300">{achat.reference_achat ?? '—'}</span>
                </Ligne>
                <Ligne label="Date de l’achat">{formatDate(achat.date_achat)}</Ligne>
                <Ligne label="Fournisseur">{achat.fournisseur?.raison_sociale ?? '—'}</Ligne>
                <Ligne label="N° de facture">{achat.numero_facture ?? '—'}</Ligne>
                <Ligne label="Bon de commande">{achat.bon_commande ?? '—'}</Ligne>
                <Ligne label="Montant total">{achat.montant_total != null ? formatAr(achat.montant_total) : '—'}</Ligne>
                <Ligne label="Statut">{LABELS[achat.statut] ?? achat.statut ?? '—'}</Ligne>
            </div>

            {achat.description && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</div>
                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">{achat.description}</p>
                </div>
            )}

            {(achat.details?.length ?? 0) > 0 && (
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Matériels reçus ({achat.details.length})
                    </div>
                    <div className="space-y-1.5">
                        {achat.details.map((d) => (
                            <div key={d.id_detail_achat} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                <span className="text-xs font-semibold text-slate-700">
                                    {d.equipement
                                        ? `${d.equipement.code_inventaire} — ${d.equipement.designation}`
                                        : d.description ?? '—'}
                                </span>
                                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                                    × {d.quantite ?? 1}{d.prix_unitaire != null ? ` · ${formatAr(d.prix_unitaire)}` : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Achats() {
    return (
        <ResourcePage
            titre="Achats"
            endpoint="/achats"
            nomRessource="achats"
            idKey="id_achat"
            labelElement="Achat"
            filtreStatut={Object.entries(LABELS).map(([v, l]) => [v, l])}
            detail={(achat) => <AchatDetail achat={achat} />}
            colonnes={[
                { key: 'reference_achat', label: 'Référence', mono: true },
                { key: 'date_achat', label: 'Date', date: true },
                { key: 'numero_facture', label: 'Facture', mono: true },
                { key: 'fournisseur', label: 'Fournisseur', render: (a) => a.fournisseur?.raison_sociale ?? '—' },
                { key: 'montant_total', label: 'Montant', render: (a) => (a.montant_total != null ? formatAr(a.montant_total) : '—') },
                {
                    key: 'appreciation',
                    label: 'Appréciation',
                    render: (a) => (a.appreciation
                        ? <span className="inline-flex items-center gap-1.5"><Etoiles note={a.appreciation} /><span className="text-[11px] font-semibold text-slate-500">{a.appreciation}/5</span></span>
                        : <span className="text-xs text-slate-400">—</span>),
                },
                { key: 'statut', label: 'Statut', badge: (v) => BADGES[v] ?? 'bg-slate-100 text-slate-700 border-slate-200', badgeLabel: (v) => LABELS[v] ?? v },
            ]}
            champs={[
                { key: 'reference_achat', label: 'Référence (ACH-2026-001)' },
                { key: 'date_achat', label: 'Date de l\u2019achat', type: 'date' },
                { key: 'id_fournisseur', label: 'Fournisseur', type: 'ref', source: 'fournisseurs', idSource: 'id_fournisseur', get: (f) => f.raison_sociale },
                { key: 'numero_facture', label: 'N° de facture' },
                { key: 'bon_commande', label: 'Bon de commande' },
                { key: 'montant_total', label: 'Montant total (Ar)', type: 'number' },
                { key: 'appreciation', label: 'Appréciation de l’achat', type: 'rating' },
                { key: 'appreciation_commentaire', label: 'Commentaire de l’appréciation', type: 'textarea' },
                { key: 'statut', label: 'Statut', type: 'select', options: Object.entries(LABELS) },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
    );
}
