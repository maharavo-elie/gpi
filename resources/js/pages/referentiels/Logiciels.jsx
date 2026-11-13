import { CalendarDays, FileText, Monitor, ScrollText, Store, Users } from 'lucide-react';
import ResourcePage from '../../components/ResourcePage';
import { formatDate } from '../../lib/constants';

/** Installations actives (le logiciel est réellement présent sur le poste). */
const postesEquipes = (logiciel) => (logiciel.installations ?? []).filter((i) => i.statut === 'installe');

/** Date d'acquisition de la licence : champ dédié, sinon la plus récente des licences. */
const dateLicence = (logiciel) => logiciel.date_acquisition_licence
    ?? (logiciel.licences ?? []).map((l) => l.date_acquisition).filter(Boolean).sort().pop()
    ?? null;

function Bloc({ icon: Icon, title, children }) {
    return (
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
                <Icon size={14} className="text-blue-400" /> {title}
            </h3>
            {children}
        </section>
    );
}

function Ligne({ label, children }) {
    return (
        <div className="flex items-start justify-between gap-4 py-1.5 border-b border-slate-200/60 last:border-0">
            <span className="text-xs text-slate-500 shrink-0">{label}</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{children ?? '—'}</span>
        </div>
    );
}

function LogicielDetail({ logiciel }) {
    const installations = postesEquipes(logiciel);
    const max = logiciel.nb_utilisateurs_max;
    const enCours = logiciel.utilisateurs_actuels ?? installations.length;
    const restants = max != null ? Math.max(0, max - enCours) : null;
    const taux = max > 0 ? Math.min(100, Math.round((enCours / max) * 100)) : null;
    const fournisseur = logiciel.fournisseur;

    return (
        <div className="space-y-4">
            <Bloc icon={Users} title="Exploitation">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="rounded-lg border border-slate-200 bg-card p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Utilisateurs en cours</div>
                        <div className="mt-0.5 text-xl font-extrabold text-slate-800 tabular-nums">
                            {enCours}
                            {max != null && <span className="text-sm font-semibold text-slate-500"> / {max}</span>}
                        </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-card p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Places restantes</div>
                        <div className="mt-0.5 text-xl font-extrabold text-slate-800 tabular-nums">{restants ?? '—'}</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-card p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Appareils équipés</div>
                        <div className="mt-0.5 text-xl font-extrabold text-slate-800 tabular-nums">{installations.length}</div>
                    </div>
                </div>
                {taux !== null && (
                    <div className="mt-3">
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                                className={`h-full rounded-full transition-all ${taux >= 90 ? 'bg-rose-500' : taux >= 70 ? 'bg-orange-400' : 'bg-vert-400'}`}
                                style={{ width: `${taux}%` }}
                            />
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">{taux}% de la capacité utilisée</p>
                    </div>
                )}
            </Bloc>

            <Bloc icon={Monitor} title={`Appareils qui utilisent le logiciel (${installations.length})`}>
                {installations.length === 0 && (
                    <p className="text-xs text-slate-500">Aucun appareil n’utilise actuellement ce logiciel.</p>
                )}
                <div className="space-y-1.5">
                    {installations.map((inst) => (
                        <div key={inst.id_installation} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-card px-3 py-2">
                            <div className="min-w-0">
                                <div className="font-mono text-xs font-bold text-blue-300">
                                    {inst.equipement?.code_inventaire ?? '—'}
                                </div>
                                <div className="truncate text-xs text-slate-600">
                                    {inst.equipement?.designation ?? 'Équipement non renseigné'}
                                </div>
                            </div>
                            <div className="text-right text-[11px] text-slate-500">
                                {inst.version_installee ? `Version ${inst.version_installee}` : 'Version non précisée'}
                                {inst.date_installation ? ` · ${formatDate(inst.date_installation)}` : ''}
                            </div>
                        </div>
                    ))}
                </div>
            </Bloc>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Bloc icon={CalendarDays} title="Acquisition">
                    <Ligne label="Date d’acquisition du logiciel">{formatDate(logiciel.date_acquisition)}</Ligne>
                    <Ligne label="Date d’acquisition de la licence">{formatDate(dateLicence(logiciel))}</Ligne>
                    <Ligne label="Version">{logiciel.version ?? '—'}</Ligne>
                    <Ligne label="Éditeur">{logiciel.editeur ?? '—'}</Ligne>
                </Bloc>

                <Bloc icon={Store} title="Vendeur / fournisseur">
                    <Ligne label="Raison sociale">{fournisseur?.raison_sociale ?? '—'}</Ligne>
                    <Ligne label="Contact">{fournisseur?.contact ?? '—'}</Ligne>
                    <Ligne label="Téléphone">{fournisseur?.telephone ?? '—'}</Ligne>
                    <Ligne label="Email">{fournisseur?.email ?? '—'}</Ligne>
                    <Ligne label="Adresse">{fournisseur?.adresse ?? '—'}</Ligne>
                </Bloc>
            </div>

            <Bloc icon={ScrollText} title="Conditions générales">
                <div className="space-y-2">
                    <div className="rounded-lg border border-slate-200 bg-card p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            CGU — conditions générales d’utilisation
                        </div>
                        <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                            {logiciel.cgu || 'Non renseignées.'}
                        </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-card p-3">
                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            CGV — conditions générales de vente
                        </div>
                        <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                            {logiciel.cgv || 'Non renseignées.'}
                        </p>
                    </div>
                </div>
            </Bloc>

            {(logiciel.licences?.length ?? 0) > 0 && (
                <Bloc icon={FileText} title={`Licences (${logiciel.licences.length})`}>
                    <div className="space-y-1.5">
                        {logiciel.licences.map((l) => (
                            <div key={l.id_licence} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-card px-3 py-2">
                                <span className="font-mono text-xs font-bold text-blue-300">{l.reference_licence}</span>
                                <span className="text-[11px] text-slate-500">
                                    {l.type_licence ?? 'Licence'} · {l.nb_licences ?? 1} poste(s)
                                </span>
                                <span className="text-[11px] text-slate-500">
                                    {formatDate(l.date_acquisition)} → {formatDate(l.date_expiration)}
                                </span>
                            </div>
                        ))}
                    </div>
                </Bloc>
            )}

            {logiciel.description && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</div>
                    <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-slate-600">{logiciel.description}</p>
                </div>
            )}
        </div>
    );
}

export default function Logiciels() {
    return (
        <ResourcePage
            titre="Logiciels"
            endpoint="/logiciels"
            nomRessource="logiciels"
            idKey="id_logiciel"
            labelElement="Logiciel"
            detail={(logiciel) => <LogicielDetail logiciel={logiciel} />}
            colonnes={[
                { key: 'nom', label: 'Nom' },
                { key: 'version', label: 'Version', mono: true },
                { key: 'editeur', label: 'Éditeur' },
                {
                    key: 'utilisateurs',
                    label: 'Utilisateurs',
                    render: (l) => {
                        const enCours = l.utilisateurs_actuels ?? postesEquipes(l).length;
                        return (
                            <span className="text-xs">
                                <strong className="text-sm font-bold text-slate-800">{enCours}</strong>
                                {l.nb_utilisateurs_max != null && (
                                    <span className="text-slate-500"> / {l.nb_utilisateurs_max}</span>
                                )}
                            </span>
                        );
                    },
                },
                {
                    key: 'appareils',
                    label: 'Appareils',
                    render: (l) => {
                        const codes = postesEquipes(l).map((i) => i.equipement?.code_inventaire).filter(Boolean);
                        if (! codes.length) return '—';
                        return (
                            <span className="text-xs text-slate-600" title={codes.join(', ')}>
                                {codes.length} poste(s)
                            </span>
                        );
                    },
                },
                { key: 'date_acquisition', label: 'Acquisition logiciel', date: true },
                { key: 'date_acquisition_licence', label: 'Acquisition licence', render: (l) => formatDate(dateLicence(l)) },
                { key: 'fournisseur', label: 'Vendeur', render: (l) => l.fournisseur?.raison_sociale ?? '—' },
            ]}
            champs={[
                { key: 'nom', label: 'Nom du logiciel', required: true },
                { key: 'version', label: 'Version' },
                { key: 'editeur', label: 'Éditeur' },
                { key: 'nb_utilisateurs_max', label: 'Nombre maximal d’utilisateurs', type: 'number' },
                { key: 'date_acquisition', label: 'Date d’acquisition du logiciel', type: 'date' },
                { key: 'date_acquisition_licence', label: 'Date d’acquisition de la licence', type: 'date' },
                { key: 'id_fournisseur', label: 'Vendeur / fournisseur', type: 'ref', source: 'fournisseurs', idSource: 'id_fournisseur', get: (f) => f.raison_sociale },
                { key: 'cgu', label: 'CGU — conditions générales d’utilisation', type: 'textarea' },
                { key: 'cgv', label: 'CGV — conditions générales de vente', type: 'textarea' },
                { key: 'description', label: 'Description', type: 'textarea' },
            ]}
        />
    );
}
