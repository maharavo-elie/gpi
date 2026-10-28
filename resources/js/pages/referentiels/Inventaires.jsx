import { useEffect, useState } from 'react';
import { Boxes, CheckCircle2, AlertTriangle, FileDown } from 'lucide-react';
import { api } from '../../api';
import { Spinner, PageHeader, Badge } from '../../components/ui';
import { formatDate } from '../../lib/constants';
import { telechargerExport, nomExport } from '../../lib/exports';
import { useT } from '../../lib/i18n';

export default function Inventaires() {
    const { t } = useT();
    const [rows, setRows] = useState(null);
    const [pdfEnCours, setPdfEnCours] = useState(false);

    useEffect(() => {
        api.get('/inventaire-details').then(({ data }) => setRows(data));
    }, []);

    const imprimerPdf = async () => {
        setPdfEnCours(true);
        try {
            await telechargerExport('/rapports/pdf/ressource/inventaires', {}, nomExport('pv_inventaire'));
        } finally {
            setPdfEnCours(false);
        }
    };

    if (! rows) return <Spinner label={t('Chargement des inventaires…')} />;

    const grouped = rows.reduce((acc, d) => {
        (acc[d.inventaire?.reference ?? '—'] ??= { inventaire: d.inventaire, details: [] }).details.push(d);
        return acc;
    }, {});

    return (
        <div>
            <PageHeader
                title={t('Inventaires')}
                subtitle={t('Campagnes de vérification du parc')}
                actions={
                    <button
                        onClick={imprimerPdf}
                        disabled={pdfEnCours}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-300 text-sm font-bold transition-all disabled:opacity-60"
                    >
                        <FileDown size={15} /> {pdfEnCours ? t('Génération…') : t('Imprimer PDF')}
                    </button>
                }
            />

            {Object.entries(grouped).map(([ref, { inventaire, details }]) => {
                const ecarts = details.filter((d) => d.statut === 'ecart').length;
                const verifies = details.filter((d) => d.statut === 'verifie').length;
                return (
                    <div key={ref} className="bg-card rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Boxes size={16} className="text-blue-400" />
                                <span className="font-bold text-slate-800 text-sm">{ref}</span>
                                <Badge color={
                                    inventaire?.statut === 'en_cours' ? 'bg-sky-100 text-sky-400 border-sky-200'
                                    : 'bg-jaune-100 text-jaune-400 border-jaune-200'
                                }>
                                    {t(inventaire?.statut?.replace('_', ' '))}
                                </Badge>
                            </div>
                            <div className="text-[11px] text-slate-500">
                                {formatDate(inventaire?.date_debut)} · {verifies}{t(' vérifié(s) · ')}{' '}
                                <span className={ecarts ? 'text-slate-600 font-bold' : ''}>{ecarts}{t(' écart(s)')}</span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {details.map((d) => (
                                <div key={d.id_detail} className="px-4 py-2.5 flex items-center justify-between gap-3 text-sm">
                                    <div className="min-w-0">
                                        <span className="font-mono text-xs font-bold text-blue-300">{d.equipement?.code_inventaire}</span>
                                        <span className="text-slate-600"> · {d.equipement?.designation}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[11px] text-slate-400 hidden sm:inline">{d.observation}</span>
                                        {d.statut === 'ecart'
                                            ? <Badge color="bg-slate-100 text-slate-800 border-slate-200"><AlertTriangle size={11} className="mr-1" />{t('Écart')}</Badge>
                                            : <Badge color="bg-vert-100 text-vert-400 border-vert-200"><CheckCircle2 size={11} className="mr-1" />{d.statut === 'verifie' ? t('Vérifié') : t('À vérifier')}</Badge>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
