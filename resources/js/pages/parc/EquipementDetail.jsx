import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft, Monitor, MapPin, CalendarDays, CircleDollarSign, ShieldCheck,
    Wrench, LifeBuoy, ArrowLeftRight, Disc, FileText, User, FileDown,
} from 'lucide-react';
import { api } from '../../api';
import { Spinner, Badge, EmptyState } from '../../components/ui';
import { STATUTS_EQUIPEMENT, STATUTS_MAINTENANCE, STATUTS_TICKET, formatDate, formatAr } from '../../lib/constants';

function Section({ icon: Icon, title, children }) {
    return (
        <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4">
                <Icon size={15} className="text-blue-400" /> {title}
            </h3>
            {children}
        </div>
    );
}

function Row({ label, children }) {
    return (
        <div className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
            <span className="text-xs text-slate-500 shrink-0">{label}</span>
            <span className="text-sm font-medium text-slate-800 text-right">{children}</span>
        </div>
    );
}

export default function EquipementDetail() {
    const { id } = useParams();
    const [eq, setEq] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/equipements/${id}`)
            .then(({ data }) => setEq(data))
            .catch(() => setError('Équipement introuvable.'));
    }, [id]);

    if (error) return <EmptyState icon={Monitor} title={error} hint={<Link to="/equipements" className="text-blue-400 underline">Retour à la liste</Link>} />;
    if (! eq) return <Spinner label="Chargement de la fiche…" />;

    const actives = eq.affectations?.filter((a) => ! a.date_fin) ?? [];
    const affectationActive = actives[0] ?? null;
    // Service effectif : celui de l'affectation active (agent), sinon celui de la fiche.
    const serviceEffectif = affectationActive?.agent?.service?.nom_service
        ?? eq.service?.nom_service
        ?? null;
    const directionEffective = affectationActive?.agent?.direction?.nom_direction
        ?? eq.direction?.nom_direction
        ?? null;

    /* Fiche de vie imprimable (PDF officiel en-tête DGSR) */
    const imprimerFiche = async () => {
        const res = await api.get(`/rapports/pdf/equipement/${eq.id_equipement}`, { responseType: 'blob' });
        const url = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fiche_${eq.code_inventaire}_${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <Link to="/equipements" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-300">
                    <ArrowLeft size={14} /> Retour aux équipements
                </Link>
                <button
                    onClick={imprimerFiche}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/30 transition-all active:scale-[.97]"
                >
                    <FileDown size={13} /> Fiche PDF
                </button>
            </div>

            {/* En-tête fiche */}
            <div className="bg-card rounded-2xl border border-slate-200 shadow-sm p-5 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center shrink-0">
                            <Monitor size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-lg font-extrabold text-slate-800">{eq.designation}</h1>
                                <Badge color={STATUTS_EQUIPEMENT[eq.statut]?.color}>
                                    {STATUTS_EQUIPEMENT[eq.statut]?.label ?? eq.statut}
                                </Badge>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-blue-300">{eq.code_inventaire}</span>
                                <span>·</span>
                                <span>{eq.marque?.nom_marque} {eq.modele?.nom_modele}</span>
                                <span>·</span>
                                <span className="font-mono">{eq.numero_serie ?? 'sans n° série'}</span>
                            </div>
                        </div>
                    </div>
                    {eq.etat && <Badge color="bg-slate-100 text-slate-700 border-slate-200">État : {eq.etat.nom_etat}</Badge>}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Caractéristiques */}
                <Section icon={Monitor} title="Caractéristiques">
                    <Row label="Catégorie">{eq.categorie?.nom_categorie ?? '—'}</Row>
                    <Row label="Modèle">{eq.modele?.nom_modele ?? '—'}</Row>
                    <Row label="Direction">
                        {directionEffective ?? '—'}
                        {affectationActive && eq.direction && eq.direction.nom_direction !== directionEffective && (
                            <span className="text-[11px] text-slate-400"> (fiche : {eq.direction.nom_direction})</span>
                        )}
                    </Row>
                    <Row label="Service">
                        {serviceEffectif
                            ? <span className="inline-flex items-center gap-1"><MapPin size={13} className="text-blue-400" />{serviceEffectif}</span>
                            : '—'}
                    </Row>
                    <Row label="Fournisseur">{eq.fournisseur?.raison_sociale ?? '—'}</Row>
                    <Row label="Localisation">
                        {eq.localisation
                            ? <span className="inline-flex items-center gap-1"><MapPin size={13} className="text-slate-400" />{eq.localisation.nom_localisation}</span>
                            : 'Stock'}
                    </Row>
                </Section>

                {/* Cycle de vie */}
                <Section icon={CalendarDays} title="Cycle de vie">
                    <Row label="Acquisition">{formatDate(eq.date_acquisition)}</Row>
                    <Row label="Mise en service">{formatDate(eq.date_mise_service)}</Row>
                    <Row label="Prix d'acquisition">
                        <span className="inline-flex items-center gap-1"><CircleDollarSign size={13} className="text-blue-400" />{formatAr(eq.prix_acquisition)}</span>
                    </Row>
                    <Row label="Garantie">
                        {eq.garantie_fin
                            ? <span className="inline-flex items-center gap-1">
                                <ShieldCheck size={13} className={new Date(eq.garantie_fin) > new Date() ? 'text-blue-400' : 'text-slate-500'} />
                                jusqu'au {formatDate(eq.garantie_fin)}
                              </span>
                            : '—'}
                    </Row>
                    <Row label="Créée le">{formatDate(eq.created_at)}</Row>
                </Section>

                {/* Affectations */}
                <Section icon={User} title={`Affectations (${eq.affectations?.length ?? 0})`}>
                    {eq.affectations?.length === 0 && <p className="text-xs text-slate-500">Jamais affecté.</p>}
                    <div className="space-y-2">
                        {actives.map((a) => (
                            <div key={a.id_affectation} className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                                <div className="text-sm font-bold text-blue-300">
                                    {a.agent ? `${a.agent.prenom} ${a.agent.nom_naiss}` : '—'}
                                </div>
                                <div className="text-[11px] text-blue-400">
                                    {a.agent?.fonction && <>{a.agent.fonction} · </>}
                                    {a.agent?.service?.nom_service && <>{a.agent.service.nom_service} · </>}
                                    {a.agent?.direction?.nom_direction ?? a.agent?.direction?.code_direction ?? ''}
                                    {' '}· depuis le {formatDate(a.date_affectation)}
                                </div>
                            </div>
                        ))}
                        {eq.affectations?.filter((a) => a.date_fin).slice(0, 4).map((a) => (
                            <div key={a.id_affectation} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                                <span className="text-slate-600">{a.agent ? `${a.agent.prenom} ${a.agent.nom_naiss}` : '—'}</span>
                                <span className="text-slate-400">{formatDate(a.date_affectation)} → {formatDate(a.date_fin)}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Maintenance & tickets */}
                <Section icon={Wrench} title="Maintenance & tickets">
                    {(eq.maintenances?.length ?? 0) === 0 && (eq.tickets?.length ?? 0) === 0 && (
                        <p className="text-xs text-slate-500">Aucune intervention enregistrée.</p>
                    )}
                    <div className="space-y-2">
                        {eq.maintenances?.map((m) => (
                            <div key={`m${m.id_maintenance}`} className="flex items-center justify-between gap-2 text-sm py-2 border-b border-slate-100 last:border-0">
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-800 truncate">{m.type?.nom_type ?? 'Maintenance'}</div>
                                    <div className="text-[11px] text-slate-500 truncate">{m.description_probleme}</div>
                                </div>
                                <Badge color={STATUTS_MAINTENANCE[m.statut]?.color}>{STATUTS_MAINTENANCE[m.statut]?.label ?? m.statut}</Badge>
                            </div>
                        ))}
                        {eq.tickets?.map((t) => (
                            <div key={`t${t.id_ticket}`} className="flex items-center justify-between gap-2 text-sm py-2 border-b border-slate-100 last:border-0">
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-800 truncate flex items-center gap-1.5">
                                        <LifeBuoy size={13} className="text-slate-500" /> {t.titre}
                                    </div>
                                    <div className="text-[11px] text-slate-500">{t.reference_ticket} · priorité {t.priorite}</div>
                                </div>
                                <Badge color={STATUTS_TICKET[t.statut]?.color}>{STATUTS_TICKET[t.statut]?.label ?? t.statut}</Badge>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Logiciels installés */}
                <Section icon={Disc} title={`Logiciels installés (${eq.installations?.length ?? 0})`}>
                    {(eq.installations?.length ?? 0) === 0 && <p className="text-xs text-slate-500">Aucun logiciel enregistré.</p>}
                    <div className="space-y-1.5">
                        {eq.installations?.map((inst) => (
                            <div key={inst.id_installation} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                                <span className="text-slate-700 font-medium">{inst.logiciel?.nom}</span>
                                <span className="text-[11px] text-slate-500">{inst.version_installee ?? ''}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Mouvements */}
                <Section icon={ArrowLeftRight} title={`Mouvements (${eq.mouvements?.length ?? 0})`}>
                    {(eq.mouvements?.length ?? 0) === 0 && <p className="text-xs text-slate-500">Aucun mouvement.</p>}
                    <div className="space-y-1.5">
                        {eq.mouvements?.map((m) => (
                            <div key={m.id_mouvement} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                                <div>
                                    <span className="font-semibold text-slate-700 capitalize">{m.type_mouvement}</span>
                                    <span className="text-[11px] text-slate-500 block">{m.motif}</span>
                                </div>
                                <span className="text-[11px] text-slate-400 whitespace-nowrap">{formatDate(m.date_mouvement)}</span>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            {/* Documents */}
            <div className="mt-4">
                <Section icon={FileText} title={`Documents (${eq.documents?.length ?? 0})`}>
                    {(eq.documents?.length ?? 0) === 0 && <p className="text-xs text-slate-500">Aucun document attaché.</p>}
                </Section>
            </div>
        </div>
    );
}
