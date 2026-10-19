import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { api } from '../api';
import { sons } from '../lib/sons';
import { formatDate } from '../lib/constants';

const COULEURS = {
    info: 'bg-blue-100 text-blue-400 border-blue-200',
    alerte: 'bg-rose-100 text-rose-400 border-rose-200',
    succes: 'bg-vert-100 text-vert-400 border-vert-200',
    warning: 'bg-jaune-100 text-jaune-400 border-jaune-200',
};

const LIBELLES = { info: 'Info', alerte: 'Alerte', succes: 'Réglé', warning: 'Attention' };

/**
 * Le centre de notifications de la barre supérieure : badge = nombre non lu,
 * panneau = fil des 30 dernières alertes (nouveaux tickets, interventions…).
 * Le compteur est rafraîchi toutes les 30 s tant que la session est ouverte.
 */
export default function Notifications() {
    const [ouvert, setOuvert] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [nonLues, setNonLues] = useState(0);

    const chargerCompteur = useCallback(async () => {
        try {
            const { data } = await api.get('/notifications');
            setNonLues(data.non_lues);
        } catch {
            // Session expirée, page en cours de déconnexion : rien à afficher.
        }
    }, []);

    const chargerListe = useCallback(async () => {
        const { data } = await api.get('/notifications');
        setNotifications(data.notifications);
        setNonLues(data.non_lues);
    }, []);

    useEffect(() => {
        chargerCompteur();
        const t = setInterval(chargerCompteur, 30000);
        return () => clearInterval(t);
    }, [chargerCompteur]);

    const ouvrirPanneau = async () => {
        sons.clic();
        setOuvert(true);
        await chargerListe();
    };

    const marquerLue = async (id) => {
        try {
            await api.patch(`/notifications/${id}/lire`);
            setNotifications((n) => n.map((x) => (x.id_notification === id ? { ...x, lu: true } : x)));
            setNonLues((n) => Math.max(0, n - 1));
        } catch {
            // Déjà lue côté serveur ou session expirée : on ignore.
        }
    };

    const toutMarquer = async () => {
        try {
            await api.patch('/notifications/tout-lire');
            setNotifications((n) => n.map((x) => ({ ...x, lu: true })));
            setNonLues(0);
        } catch {
            // Idem.
        }
    };

    return (
        <div className="relative">
            <button
                onClick={ouvrirPanneau}
                title="Notifications"
                className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
                <Bell size={18} />
                {nonLues > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {nonLues > 9 ? '9+' : nonLues}
                    </span>
                )}
            </button>

            {ouvert && (
                <>
                    {/* Clic extérieur : ferme le panneau */}
                    <div className="fixed inset-0 z-40" onClick={() => setOuvert(false)} />
                    <div className="absolute right-0 z-50 mt-1 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                            <span className="text-sm font-bold text-slate-800">Notifications</span>
                            <button
                                onClick={() => setOuvert(false)}
                                title="Fermer"
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {notifications.length === 0 ? (
                            <p className="px-4 py-6 text-center text-xs text-slate-500">
                                Aucune notification — tout est au vert.
                            </p>
                        ) : (
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                {notifications.map((n) => (
                                    <button
                                        key={n.id_notification}
                                        onClick={() => marquerLue(n.id_notification)}
                                        className={`w-full text-left px-4 py-2.5 hover:bg-blue-50/30 transition-colors ${n.lu ? '' : 'bg-blue-50/60'}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className={`text-xs font-bold ${n.lu ? 'text-slate-500' : 'text-slate-800'}`}>
                                                {n.titre}
                                            </span>
                                            {!n.lu && <span className="mt-0.5 w-2 h-2 rounded-full bg-blue-400 shrink-0" />}
                                        </div>
                                        {n.message && (
                                            <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{n.message}</p>
                                        )}
                                        <div className="mt-1 flex items-center gap-2">
                                            <span
                                                className={`inline-flex px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${COULEURS[n.type] ?? COULEURS.info}`}
                                            >
                                                {LIBELLES[n.type] ?? 'Info'}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{formatDate(n.date_creation)}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {nonLues > 0 && (
                            <div className="px-4 py-2.5 border-t border-slate-100">
                                <button
                                    onClick={toutMarquer}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold text-blue-400 hover:bg-blue-50 transition-colors"
                                >
                                    <CheckCheck size={13} /> Tout marquer comme lu
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
