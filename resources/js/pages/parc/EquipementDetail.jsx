import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ArrowLeft, Monitor, MapPin, CalendarDays, CircleDollarSign, ShieldCheck,
    Wrench, LifeBuoy, ArrowLeftRight, Disc, FileText, User, FileDown, Cpu, Clock,
} from 'lucide-react';
import { api } from '../../api';
import { Spinner, Badge, EmptyState } from '../../components/ui';
import { STATUTS_EQUIPEMENT, STATUTS_MAINTENANCE, STATUTS_TICKET, formatDate, formatAr } from '../../lib/constants';
import { useT } from '../../lib/i18n';

/* Le nom du modèle contient souvent déjà la marque : on évite « HP HP … ». */
const libelleModele = (modele, marque) => {
    const nom = modele?.nom_modele ?? '';
    const marqueNom = marque?.nom_marque ?? '';
    if (! nom) return marqueNom || '—';
    return marqueNom && ! nom.toLowerCase().startsWith(marqueNom.toLowerCase())
        ? `${marqueNom} ${nom}`
        : nom;
};

/* Style de chaque nature d'événement de la fiche de vie. */
const STYLES_EVENEMENT = {
    acquisition: { icon: CalendarDays, classe: 'bg-blue-100 text-blue-500' },
    mise_service: { icon: Monitor, classe: 'bg-indigo-100 text-indigo-500' },
    affectation: { icon: User, classe: 'bg-vert-100 text-vert-500' },
    restitution: { icon: User, classe: 'bg-slate-100 text-slate-500' },
    mouvement: { icon: ArrowLeftRight, classe: 'bg-orange-100 text-orange-500' },
    maintenance: { icon: Wrench, classe: 'bg-jaune-100 text-jaune-500' },
    ticket: { icon: LifeBuoy, classe: 'bg-rose-100 text-rose-500' },
    logiciel: { icon: Disc, classe: 'bg-sky-100 text-sky-500' },
    document: { icon: FileText, classe: 'bg-slate-100 text-slate-500' },
};

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

const texte = (valeur) => (valeur == null || valeur === '' ? null : String(valeur));

export default function EquipementDetail() {
    const { id } = useParams();
    const { t } = useT();
    const [eq, setEq] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/equipements/${id}`)
            .then(({ data }) => setEq(data))
            .catch(() => setError('Équipement introuvable.'));
    }, [id]);

    if (error) return <EmptyState icon={Monitor} title={t('Équipement introuvable.')} hint={<Link to="/equipements" className="text-blue-400 underline">{t('Retour à la liste')}</Link>} />;
    if (! eq) return <Spinner label={t('Chargement de la fiche…')} />;

    const actives = eq.affectations?.filter((a) => ! a.date_fin) ?? [];
    const affectationActive = actives[0] ?? null;
    const ligneAchat = eq.ligne_achat;
    // Service effectif : celui de l'affectation active (agent), sinon celui de la fiche.
    const serviceEffectif = affectationActive?.agent?.service?.nom_service
        ?? eq.service?.nom_service
        ?? null;
    const directionEffective = affectationActive?.agent?.direction?.nom_direction
        ?? eq.direction?.nom_direction
        ?? null;

    /* ------------------------------------------------------------------
       Fiche de vie : tous les événements connus du matériel, du plus récent
       au plus ancien (emplacements, affectations, pannes, tickets, logiciels).
       ------------------------------------------------------------------ */
    const evenements = [];
    const ajouter = (date, type, titre, detail = null) => {
        if (! date) return;
        const valeur = new Date(date);
        if (Number.isNaN(valeur.getTime())) return;
        evenements.push({ date: valeur, type, titre, detail: texte(detail) });
    };

    ajouter(
        eq.date_acquisition,
        'acquisition',
        'Acquisition et entrée au parc',
        [ligneAchat?.achat?.reference_achat, ligneAchat?.achat?.fournisseur?.raison_sociale ?? eq.fournisseur?.raison_sociale]
            .filter(Boolean).join(' · ')
    );
    ajouter(eq.date_mise_service, 'mise_service', 'Mise en service');

    (eq.affectations ?? []).forEach((a) => {
        const agent = a.agent ? `${a.agent.prenom} ${a.agent.nom_naiss}` : 'Agent non renseigné';
        ajouter(
            a.date_affectation,
            'affectation',
            `Utilisation par ${agent}`
            [a.agent?.fonction, a.agent?.service?.nom_service, a.agent?.direction?.nom_direction]
                .filter(Boolean).join(' · ')
        );
        if (a.date_fin) {
            ajouter(a.date_fin, 'restitution', `Fin d’utilisation par ${agent}`, a.motif);
        }
    });

    (eq.mouvements ?? []).forEach((m) => {
        const ancienne = m.ancienne_localisation ?? m.ancienneLocalisation;
        const nouvelle = m.nouvelle_localisation ?? m.nouvelleLocalisation;
        const trajet = (ancienne || nouvelle)
            ? `${ancienne?.nom_localisation ?? 'Stock'} → ${nouvelle?.nom_localisation ?? 'Stock'}`
            : null;
        ajouter(
            m.date_mouvement,
            'mouvement',
            `Mouvement — ${m.type_mouvement}`,
            [trajet, m.motif, m.utilisateur?.nom_complet].filter(Boolean).join(' · ')
        );
    });

    (eq.maintenances ?? []).forEach((m) => {
        ajouter(
            m.date_demande ?? m.date_debut ?? m.created_at,
            'maintenance',
            `Maintenance — ${m.type?.nom_type ?? 'intervention'}`,
            [
                m.description_probleme,
                m.diagnostic ? `Diagnostic : ${m.diagnostic}` : null,
                m.technicien ? `Technicien : ${m.technicien}` : null,
                m.agent ? `Demandeur : ${m.agent.prenom} ${m.agent.nom_naiss}` : null,
                m.statut ? `Statut : ${STATUTS_MAINTENANCE[m.statut]?.label ?? m.statut}` : null,
            ].filter(Boolean).join(' · ')
        );
    });

    (eq.tickets ?? []).forEach((tk) => {
        ajouter(
            tk.date_creation,
            'ticket',
            `Ticket ${tk.reference_ticket} — ${tk.titre}`,
            [
                tk.motif && tk.motif !== tk.titre ? `Motif : ${tk.motif}` : null,
                tk.service?.nom_service ? `Service : ${tk.service.nom_service}` : null,
                tk.site?.nom_site ? `Centre : ${tk.site.nom_site}` : null,
                tk.agent ? `Demandeur : ${tk.agent.prenom} ${tk.agent.nom_naiss}` : null,
                tk.etat_probleme_avant,
                `Statut : ${STATUTS_TICKET[tk.statut]?.label ?? tk.statut}`,
            ].filter(Boolean).join(' · ')
        );
    });

    (eq.installations ?? []).forEach((inst) => {
        ajouter(
            inst.date_installation,
            'logiciel',
            `Installation — ${inst.logiciel?.nom ?? 'logiciel'}${inst.version_installee ? ` ${inst.version_installee}` : ''}`,
            inst.statut ? `Statut : ${inst.statut}` : null
        );
    });

    (eq.documents ?? []).forEach((doc) => {
        ajouter(
            doc.created_at,
            'document',
            `Document — ${doc.nom_document ?? doc.type_document ?? 'pièce jointe'}`,
            doc.description
        );
    });

    evenements.sort((a, b) => b.date - a.date);

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
                    <ArrowLeft size={14} /> {t('Retour aux équipements')}
                </Link>
                <button
                    onClick={imprimerFiche}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/30 transition-all active:scale-[.97]"
                >
                    <FileDown size={13} /> {t('Fiche PDF')}
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
                                <span>{libelleModele(eq.modele, eq.marque)}</span>
                                <span>·</span>
                                <span className="font-mono">{eq.numero_serie ?? t('sans n° série')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1">
                        {eq.etat && <Badge color="bg-slate-100 text-slate-700 border-slate-200">{t('État : ')}{eq.etat.nom_etat}</Badge>}
                        <span className="text-[11px] text-slate-500 inline-flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            {eq.localisation
                                ? `${eq.localisation.batiment?.site?.nom_site ? `${eq.localisation.batiment.site.nom_site} — ` : ''}${eq.localisation.nom_localisation}`
                                : t('Stock central')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Fiche de vie : historique complet, du plus récent au plus ancien */}
            <div className="mb-4">
                <Section icon={Clock} title={`${t('Fiche de vie — historique complet')} (${evenements.length})`}>
                    {evenements.length === 0 && (
                        <p className="text-xs text-slate-500">{t('Aucun événement enregistré pour ce matériel.')}</p>
                    )}
                    <div className="relative pl-7">
                        {evenements.length > 0 && <div className="absolute left-[13px] top-2 bottom-2 w-px bg-slate-200" />}
                        {evenements.map((ev, index) => {
                            const style = STYLES_EVENEMENT[ev.type] ?? STYLES_EVENEMENT.document;
                            const Icon = style.icon;
                            return (
                                <div key={`${ev.type}-${index}`} className="relative pb-4 last:pb-0">
                                    <span className={`absolute -left-7 top-0 w-7 h-7 rounded-full flex items-center justify-center ${style.classe}`}>
                                        <Icon size={13} />
                                    </span>
                                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                        <span className="text-[11px] font-bold text-slate-400 tabular-nums whitespace-nowrap">
                                            {formatDate(ev.date)}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800">{ev.titre}</span>
                                    </div>
                                    {ev.detail && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{ev.detail}</p>}
                                </div>
                            );
                        })}
                    </div>
                </Section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Caractéristiques */}
                <Section icon={Monitor} title={t('Caractéristiques')}>
                    <Row label={t('Catégorie')}>{eq.categorie?.nom_categorie ?? '—'}</Row>
                    <Row label={t('Modèle')}>{eq.modele?.nom_modele ?? '—'}</Row>
                    <Row label={t('Direction')}>{directionEffective ?? '—'}{affectationActive && eq.direction && eq.direction.nom_direction !== directionEffective && (
                            <span className="text-[11px] text-slate-400">{t(' (fiche : ')}{eq.direction.nom_direction})</span>
                        )}</Row>
                    <Row label={t('Service')}>
                        {serviceEffectif
                            ? <span className="inline-flex items-center gap-1"><MapPin size={13} className="text-blue-400" />{serviceEffectif}</span>
                            : '—'}
                    </Row>
                    <Row label={t('Fournisseur')}>{eq.fournisseur?.raison_sociale ?? '—'}</Row>
                    <Row label={t('Localisation')}>
                        {eq.localisation
                            ? <span className="inline-flex items-center gap-1"><MapPin size={13} className="text-slate-400" />{eq.localisation.nom_localisation}</span>
                            : t('Stock')}
                    </Row>
                </Section>

                {/* Configuration matérielle complète de la machine */}
                <Section icon={Cpu} title={t('Configuration matérielle')}>
                    <Row label={t('Processeur')}>
                        {eq.processeur
                            ? <span className="inline-flex items-center gap-1"><Cpu size={13} className="text-blue-400" />{eq.processeur}</span>
                            : '—'}
                    </Row>
                    <Row label={t('Mémoire (RAM)')}>{eq.ram ?? '—'}</Row>
                    <Row label={t('Disque dur')}>{eq.disque ?? '—'}</Row>
                    {(eq.installations?.length ?? 0) > 0 && (
                        <Row label={t('Logiciels installés')}>
                            <div className="flex flex-col items-end gap-1">
                                {eq.installations.map((inst) => (
                                    <span key={inst.id_installation} className="text-[11px] text-slate-600">
                                        <Disc size={11} className="inline text-slate-400 mr-1" />
                                        {inst.logiciel?.nom}{inst.version_installee ? ` ${inst.version_installee}` : ''}
                                    </span>
                                ))}
                            </div>
                        </Row>
                    )}
                    {(eq.processeur ?? eq.ram ?? eq.disque) == null && (eq.installations?.length ?? 0) === 0 && (
                        <p className="text-xs text-slate-500">{t("Configuration non renseignée pour ce matériel.")}</p>
                    )}
                </Section>

                {/* Cycle de vie */}
                <Section icon={CalendarDays} title={t('Cycle de vie')}>
                    <Row label={t('Acquisition')}>{formatDate(eq.date_acquisition)}</Row>
                    <Row label={t('Mise en service')}>{formatDate(eq.date_mise_service)}</Row>
                    <Row label={t("Prix d'acquisition")}>
                        <span className="inline-flex items-center gap-1"><CircleDollarSign size={13} className="text-blue-400" />{formatAr(eq.prix_acquisition)}</span>
                    </Row>
                    <Row label={t('Garantie')}>
                        {eq.garantie_fin
                            ? <span className="inline-flex items-center gap-1">
                                <ShieldCheck size={13} className={new Date(eq.garantie_fin) > new Date() ? 'text-blue-400' : 'text-slate-500'} />
                                {t("jusqu'au ")}{formatDate(eq.garantie_fin)}
                              </span>
                            : '—'}
                    </Row>
                    {/* Traçabilité de l'achat : marché, facture et prix payé */}
                    <Row label={t("Référence d'achat")}>
                        {ligneAchat?.achat?.reference_achat
                            ? <span className="font-mono text-xs text-blue-300">{ligneAchat.achat.reference_achat}</span>
                            : '—'}
                    </Row>
                    <Row label={t('Facture')}>
                        {ligneAchat?.achat?.numero_facture
                            ? <span className="font-mono text-xs">{ligneAchat.achat.numero_facture}</span>
                            : '—'}
                    </Row>
                    <Row label={t("Date d'achat")}>{formatDate(ligneAchat?.achat?.date_achat)}</Row>
                    <Row label={t("Prix d'achat (fiche marché)")}>
                        {ligneAchat?.prix_unitaire
                            ? <span className="inline-flex items-center gap-1"><CircleDollarSign size={13} className="text-vert-400" />{formatAr(ligneAchat.prix_unitaire)}</span>
                            : '—'}
                    </Row>
                    <Row label={t('Fournisseur d\'achat')}>
                        {ligneAchat?.achat?.fournisseur?.raison_sociale ?? eq.fournisseur?.raison_sociale ?? '—'}
                    </Row>
                    <Row label={t('Créée le')}>{formatDate(eq.created_at)}</Row>
                </Section>

                {/* Utilisation : l'agent qui se sert du matériel (vocabulaire distinct de l'affectation) */}
                <Section icon={User} title={`${t('Utilisateurs de l’équipement (')}${eq.affectations?.length ?? 0})`}>
                    {eq.affectations?.length === 0 && <p className="text-xs text-slate-500">{t('Aucun utilisateur enregistré pour ce matériel.')}</p>}
                    {eq.affectations?.length > 0 && actives.length === 0 && (
                        <p className="mb-2 text-xs text-slate-500">{t('Aucun utilisateur actuellement.')}</p>
                    )}
                    <div className="space-y-2">
                        {actives.map((a) => (
                            <div key={a.id_affectation} className="rounded-xl bg-blue-50 border border-blue-200 p-3">
                                <div className="text-[10px] font-bold uppercase tracking-wide text-blue-400">{t('Utilisé par')}</div>
                                <div className="text-sm font-bold text-blue-300">
                                    {a.agent ? `${a.agent.prenom} ${a.agent.nom_naiss}` : '—'}
                                </div>
                                <div className="text-[11px] text-blue-400">
                                    {a.agent?.fonction && <>{a.agent.fonction} · </>}
                                    {a.agent?.service?.nom_service && <>{a.agent.service.nom_service} · </>}
                                    {a.agent?.direction?.nom_direction ?? a.agent?.direction?.code_direction ?? ''}
                                    {' '}{t(' · depuis le ')}{formatDate(a.date_affectation)}
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
                <Section icon={Wrench} title={t('Maintenance & tickets')}>
                    {(eq.maintenances?.length ?? 0) === 0 && (eq.tickets?.length ?? 0) === 0 && (
                        <p className="text-xs text-slate-500">{t('Aucune intervention enregistrée.')}</p>
                    )}
                    <div className="space-y-2">
                        {eq.maintenances?.map((m) => (
                            <div key={`m${m.id_maintenance}`} className="py-2 border-b border-slate-100 last:border-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="font-semibold text-slate-800 text-sm truncate">{m.type?.nom_type ?? 'Maintenance'}</div>
                                        <div className="text-[11px] text-slate-500">{m.description_probleme}</div>
                                    </div>
                                    <Badge color={STATUTS_MAINTENANCE[m.statut]?.color}>{STATUTS_MAINTENANCE[m.statut]?.label ?? m.statut}</Badge>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                    {formatDate(m.date_demande)}
                                    {m.technicien ? ` · ${m.technicien}` : ''}
                                    {m.agent ? ` · demandé par ${m.agent.prenom} ${m.agent.nom_naiss}` : ''}
                                </div>
                                {m.diagnostic && <div className="text-[11px] text-slate-600 mt-0.5">{t('Diagnostic : ')}{m.diagnostic}</div>}
                            </div>
                        ))}
                        {eq.tickets?.map((tk) => (
                            <div key={`t${tk.id_ticket}`} className="py-2 border-b border-slate-100 last:border-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="font-semibold text-slate-800 text-sm truncate flex items-center gap-1.5">
                                            <LifeBuoy size={13} className="text-slate-500 shrink-0" /> {tk.titre}
                                        </div>
                                        <div className="text-[11px] text-slate-500">
                                            {tk.reference_ticket}
                                            {tk.motif && tk.motif !== tk.titre ? ` · ${tk.motif}` : ''}
                                            {' · '}{t('priorité ')}{tk.priorite}
                                        </div>
                                    </div>
                                    <Badge color={STATUTS_TICKET[tk.statut]?.color}>{STATUTS_TICKET[tk.statut]?.label ?? tk.statut}</Badge>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                    {formatDate(tk.date_creation)}
                                    {tk.service?.nom_service ? ` · ${tk.service.nom_service}` : ''}
                                    {tk.site?.nom_site ? ` · ${tk.site.nom_site}` : ''}
                                    {tk.agent ? ` · ${tk.agent.prenom} ${tk.agent.nom_naiss}` : ''}
                                </div>
                                {tk.etat_probleme_avant && (
                                    <div className="text-[11px] text-slate-600 mt-0.5">{t('Problème avant intervention : ')}{tk.etat_probleme_avant}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Logiciels installés */}
                <Section icon={Disc} title={`${t('Logiciels installés (')}${eq.installations?.length ?? 0})`}>
                    {(eq.installations?.length ?? 0) === 0 && <p className="text-xs text-slate-500">{t('Aucun logiciel enregistré.')}</p>}
                    <div className="space-y-1.5">
                        {eq.installations?.map((inst) => (
                            <div key={inst.id_installation} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                                <span className="text-slate-700 font-medium">{inst.logiciel?.nom}</span>
                                <span className="text-[11px] text-slate-500">{inst.version_installee ?? '—'} · {t('installé le ')}{formatDate(inst.date_installation)}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Mouvements : d'où vient l'appareil et où il a été transféré */}
                <Section icon={ArrowLeftRight} title={`${t('Mouvements (')}${eq.mouvements?.length ?? 0})`}>
                    {(eq.mouvements?.length ?? 0) === 0 && <p className="text-xs text-slate-500">{t('Aucun mouvement.')}</p>}
                    <div className="space-y-2">
                        {eq.mouvements?.map((m) => {
                            const ancienne = m.ancienne_localisation ?? m.ancienneLocalisation;
                            const nouvelle = m.nouvelle_localisation ?? m.nouvelleLocalisation;
                            return (
                                <div key={m.id_mouvement} className="py-1.5 border-b border-slate-100 last:border-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold text-slate-700 capitalize text-sm">{t(m.type_mouvement)}</span>
                                        <span className="text-[11px] text-slate-400 whitespace-nowrap">{formatDate(m.date_mouvement)}</span>
                                    </div>
                                    {(ancienne || nouvelle) && (
                                        <div className="text-[11px] text-slate-600">
                                            {ancienne?.nom_localisation ?? t('Stock')} → {nouvelle?.nom_localisation ?? t('Stock')}
                                        </div>
                                    )}
                                    {m.motif && <div className="text-[11px] text-slate-500">{m.motif}</div>}
                                </div>
                            );
                        })}
                    </div>
                </Section>
            </div>

            {/* Documents */}
            <div className="mt-4">
                <Section icon={FileText} title={`${t('Documents (')}${eq.documents?.length ?? 0})`}>
                    {(eq.documents?.length ?? 0) === 0 && <p className="text-xs text-slate-500">{t('Aucun document attaché.')}</p>}
                    <div className="space-y-1.5">
                        {eq.documents?.map((doc) => (
                            <div key={doc.id_document} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100 last:border-0">
                                <span className="text-slate-700">{doc.nom_document ?? doc.type_document}</span>
                                <span className="text-[11px] text-slate-500">{formatDate(doc.created_at)}</span>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
    );
}
