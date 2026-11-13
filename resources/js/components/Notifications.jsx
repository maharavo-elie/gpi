import { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { api } from '../api';
import { sons } from '../lib/sons';
import { formatDate } from '../lib/constants';
import { useT } from '../lib/i18n';

const COULEURS = {
    info: 'bg-blue-100 text-blue-300 border-blue-200',
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
    const { t } = useT();
    const [ouvert, setOuvert] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [nonLues, setNonLues] = useState(0);
    const [chargement, setChargement] = useState(false);

    const chargerCompteur = useCallback(async () => {
        try {
            const { data } = await api.get('/notifications');
            setNonLues(Number(data.non_lues) || 0);
        } catch {
            // Session expirée, page en cours de déconnexion : rien à afficher.
        }
    }, []);

    const chargerListe = useCallback(async () => {
        setChargement(true);
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data.notifications ?? []);
            setNonLues(Number(data.non_lues) || 0);
        } catch {
            setNotifications([]);
        } finally {
            setChargement(false);
        }
    }, []);

    useEffect(() => {
        chargerCompteur();

        // Rafraîchissement régulier + au retour sur l'onglet : une alerte créée
        // depuis un autre poste (côté demandeur) apparaît sans rechargement.
        const rafraichir = () => {
            if (document.visibilityState !== 'hidden') chargerCompteur();
        };
        const minuteur = setInterval(rafraichir, 15000);
        window.addEventListener('focus', rafraichir);
        document.addEventListener('visibilitychange', rafraichir);

        return () => {
            clearInterval(minuteur);
            window.removeEventListener('focus', rafraichir);
            document.removeEventListener('visibilitychange', rafraichir);
        };
    }, [chargerCompteur]);

    // Échap ferme le panneau comme une vraie fenêtre de notification.
    useEffect(() => {
        if (! ouvert) return undefined;
        const surEchap = (event) => {
            if (event.key === 'Escape') setOuvert(false);
        };
        window.addEventListener('keydown', surEchap);
        return () => window.removeEventListener('keydown', surEchap);
    }, [ouvert]);

    const ouvrirPanneau = async () => {
        sons.clic();
        if (ouvert) {
            setOuvert(false);
            return;
        }
        setOuvert(true);
        await chargerListe();
    };

    const marquerLue = async (notification) => {
        if (notification.lu) return;
        try {
            await api.patch(`/notifications/${notification.id_notification}/lire`);
            setNotifications((liste) => liste.map((item) => (
                item.id_notification === notification.id_notification ? { ...item, lu: true } : item
            )));
            setNonLues((compteur) => Math.max(0, compteur - 1));
        } catch {
            // Déjà lue côté serveur ou session expirée : on ignore.
        }
    };

    const toutMarquer = async () => {
        try {
            await api.patch('/notifications/tout-lire');
            setNotifications((liste) => liste.map((item) => ({ ...item, lu: true })));
            setNonLues(0);
        } catch {
            // Idem.
        }
    };

    const libelleNonLues = nonLues === 1 ? t('non lue') : t('non lues');

    return (
        <div className="relative">
            <button
                onClick={ouvrirPanneau}
                title={t('Notifications')}
                aria-label={nonLues > 0 ? `${t('Notifications')} — ${nonLues} ${libelleNonLues}` : t('Notifications')}
                aria-expanded={ouvert}
                className={`relative p-2 rounded-lg transition-colors ${
                    ouvert
                        ? 'bg-slate-100 text-slate-800'
                        : `text-slate-500 hover:bg-slate-100 hover:text-slate-800 ${nonLues > 0 ? 'text-blue-400' : ''}`
                }`}
            >
                <Bell size={18} />
                {nonLues > 0 && (
                    <span
                        className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-slate-900 shadow-sm"
                        aria-hidden
                    >
                        {nonLues > 9 ? '9+' : nonLues}
                    </span>
                )}
            </button>

            {ouvert && (
                <>
                    {/* Clic extérieur : ferme le panneau */}
                    <div className="fixed inset-0 z-40" onClick={() => setOuvert(false)} />
                    <div className="fixed sm:absolute top-16 sm:top-full right-3 sm:right-0 z-50 mt-1 w-[calc(100vw-1.5rem)] max-w-sm sm:w-80 rounded-xl border border-slate-200 bg-card shadow-2xl overflow-hidden anim-pop">
                        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-200/70">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm font-bold text-slate-800">{t('Notifications')}</span>
                                {nonLues > 0 ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-400 border border-rose-200 px-1.5 py-0.5 text-[9px] font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 anim-pulse-dot" />
                                        {nonLues} {libelleNonLues}
                                    </span>
                                ) : (
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{t('À jour')}</span>
                                )}
                            </div>
                            <button
                                onClick={() => setOuvert(false)}
                                title={t('Fermer')}
                                aria-label={t('Fermer')}
                                className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {chargement ? (
                            <p className="px-4 py-6 text-center text-xs text-slate-500">
                                {t('Chargement…')}
                            </p>
                        ) : notifications.length === 0 ? (
                            <p className="px-4 py-6 text-center text-xs text-slate-500">
                                {t('Aucune notification — tout est au vert.')}
                            </p>
                        ) : (
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                                {notifications.map((notification) => (
                                    <button
                                        key={notification.id_notification}
                                        onClick={() => marquerLue(notification)}
                                        title={notification.lu ? undefined : t('Marquer comme lu')}
                                        className={`w-full text-left px-4 py-3 transition-colors ${
                                            notification.lu
                                                ? 'hover:bg-slate-100/60'
                                                : 'bg-blue-50/40 hover:bg-blue-50/70'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className={`text-xs font-bold leading-snug ${notification.lu ? 'text-slate-600' : 'text-slate-800'}`}>
                                                {notification.titre}
                                            </span>
                                            {! notification.lu && (
                                                <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-blue-300">
                                                    <Bell size={10} />
                                                    {t('Nouveau')}
                                                </span>
                                            )}
                                        </div>
                                        {notification.message && (
                                            <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{notification.message}</p>
                                        )}
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <span
                                                className={`inline-flex px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${COULEURS[notification.type] ?? COULEURS.info}`}
                                            >
                                                {LIBELLES[notification.type] ? t(LIBELLES[notification.type]) : 'Info'}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{formatDate(notification.date_creation)}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {nonLues > 0 && (
                            <div className="px-4 py-2.5 border-t border-slate-200/70">
                                <button
                                    onClick={toutMarquer}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold text-blue-400 hover:bg-blue-50 transition-colors"
                                >
                                    <CheckCheck size={13} /> {t('Tout marquer comme lu')}
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
