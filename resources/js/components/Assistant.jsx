import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Bot, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';
import { useLangue } from '../lib/i18n';

const TEXTES = {
    fr: {
        titre: 'Assistant GPI',
        sousTitre: 'Aide à l’utilisation de l’application',
        badge: 'IA',
        badgeLocal: 'AIDE',
        ouvrir: 'Ouvrir l’assistant GPI',
        fermer: 'Fermer l’assistant',
        bienvenue:
            'Bonjour ! Je peux vous expliquer les écrans, les champs, les statuts et les procédures de GPI. Que souhaitez-vous savoir ?',
        suggestions: [
            'Comment créer un ticket ?',
            'Comment affecter un équipement ?',
            'Où voir l’historique d’un appareil ?',
            'Comment exporter un rapport PDF ?',
        ],
        placeholder: 'Posez votre question…',
        envoyer: 'Envoyer',
        chargement: 'L’assistant rédige…',
        note: 'Réponses indicatives — vérifiez toujours les données dans l’application.',
        noteLocale: 'Mode aide intégrée — réponses basées sur les fonctions de l’application.',
        erreur: 'L’assistant est momentanément indisponible. Réessayez dans un instant.',
    },
    en: {
        titre: 'GPI Assistant',
        sousTitre: 'Help with the application',
        badge: 'AI',
        badgeLocal: 'HELP',
        ouvrir: 'Open the GPI assistant',
        fermer: 'Close the assistant',
        bienvenue:
            'Hello! I can explain GPI screens, fields, statuses and procedures. What would you like to know?',
        suggestions: [
            'How do I create a ticket?',
            'How do I assign equipment?',
            'Where can I see an asset’s history?',
            'How do I export a PDF report?',
        ],
        placeholder: 'Ask your question…',
        envoyer: 'Send',
        chargement: 'The assistant is writing…',
        note: 'Indicative answers — always check the data in the application.',
        noteLocale: 'Built-in help mode — answers based on the application features.',
        erreur: 'The assistant is temporarily unavailable. Please try again shortly.',
    },
};

function Bulle({ role, children }) {
    const utilisateur = role === 'user';

    return (
        <div className={`flex gap-2 ${utilisateur ? 'justify-end' : 'justify-start'}`}>
            {! utilisateur && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
                    <Bot size={13} />
                </div>
            )}
            <div
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    utilisateur
                        ? 'rounded-br-md bg-blue-600 text-white'
                        : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                }`}
            >
                {children}
            </div>
        </div>
    );
}

/**
 * Assistant d'aide flottant, présent sur toutes les pages protégées.
 * La question et un historique court sont envoyés à /api/assistant ;
 * la clé du fournisseur reste exclusivement côté serveur.
 */
export default function Assistant() {
    const { langue } = useLangue();
    const txt = TEXTES[langue] ?? TEXTES.fr;
    const location = useLocation();

    const [ouvert, setOuvert] = useState(false);
    const [messages, setMessages] = useState([]);
    const [saisie, setSaisie] = useState('');
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState(null);
    const [mode, setMode] = useState(null);

    const finRef = useRef(null);
    const inputRef = useRef(null);
    const badge = mode === 'local' ? txt.badgeLocal : txt.badge;
    const note = mode === 'local' ? txt.noteLocale : txt.note;

    useEffect(() => {
        if (! ouvert) return;
        const id = setTimeout(() => inputRef.current?.focus(), 120);
        return () => clearTimeout(id);
    }, [ouvert]);

    useEffect(() => {
        if (! ouvert) return;
        const surEchap = (e) => {
            if (e.key === 'Escape') setOuvert(false);
        };
        window.addEventListener('keydown', surEchap);
        return () => window.removeEventListener('keydown', surEchap);
    }, [ouvert]);

    useEffect(() => {
        if (! ouvert) return;
        finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [messages, chargement, erreur, ouvert]);

    const basculer = () => setOuvert((o) => !o);

    const envoyer = async (texte = saisie) => {
        const question = String(texte ?? '').trim();
        if (! question || chargement) return;

        const historique = messages.slice(-8).map(({ role, content }) => ({ role, content }));

        setMessages((prev) => [...prev, { role: 'user', content: question }]);
        setSaisie('');
        setErreur(null);
        setChargement(true);

        try {
            const { data } = await api.post('/assistant', {
                message: question,
                historique,
                page: location.pathname,
            });
            setMode(data.mode ?? 'ia');
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reponse }]);
        } catch (e) {
            setErreur(
                e.response?.data?.message
                ?? e.response?.data?.errors?.message?.[0]
                ?? txt.erreur,
            );
        } finally {
            setChargement(false);
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <>
            {ouvert && (
                <section
                    id="assistant-gpi-panel"
                    role="dialog"
                    aria-label={txt.titre}
                    className="anim-pop fixed bottom-24 right-4 z-[70] flex h-[540px] max-h-[calc(100vh-8rem)] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-card shadow-2xl sm:right-6"
                >
                    <header className="flex items-center gap-3 bg-slate-900 px-4 py-3 text-white">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <Bot size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                {txt.titre}
                                <span className="rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-blue-300">
                                    {badge}
                                </span>
                            </div>
                            <p className="truncate text-[10px] text-slate-400">{txt.sousTitre}</p>
                        </div>
                        <button
                            type="button"
                            onClick={basculer}
                            aria-label={txt.fermer}
                            title={txt.fermer}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                        >
                            <X size={17} />
                        </button>
                    </header>

                    <div
                        className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3"
                        role="log"
                        aria-live="polite"
                    >
                        <Bulle role="assistant">{txt.bienvenue}</Bulle>

                        {messages.length === 0 && ! chargement && (
                            <div className="space-y-1.5 pl-8">
                                {txt.suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => envoyer(suggestion)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-[12px] font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        {messages.map((m, i) => (
                            <Bulle key={`${m.role}-${i}`} role={m.role}>{m.content}</Bulle>
                        ))}

                        {chargement && (
                            <Bulle role="assistant">
                                <span className="inline-flex items-center gap-2 text-slate-500">
                                    <Loader2 size={13} className="animate-spin" />
                                    {txt.chargement}
                                </span>
                            </Bulle>
                        )}

                        {erreur && (
                            <div className="flex justify-start gap-2">
                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-500">
                                    <AlertCircle size={13} />
                                </div>
                                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] leading-relaxed text-rose-600">
                                    {erreur}
                                </div>
                            </div>
                        )}

                        <div ref={finRef} />
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            envoyer();
                        }}
                        className="border-t border-slate-200 bg-card p-3"
                    >
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={saisie}
                                onChange={(e) => setSaisie(e.target.value)}
                                maxLength={1200}
                                placeholder={txt.placeholder}
                                aria-label={txt.placeholder}
                                autoComplete="off"
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                            />
                            <button
                                type="submit"
                                disabled={! saisie.trim() || chargement}
                                aria-label={txt.envoyer}
                                title={txt.envoyer}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {chargement ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                        <p className="mt-1.5 text-[9px] leading-snug text-slate-400">{note}</p>
                    </form>
                </section>
            )}

            <button
                type="button"
                onClick={basculer}
                aria-label={ouvert ? txt.fermer : txt.ouvrir}
                aria-expanded={ouvert}
                aria-controls="assistant-gpi-panel"
                title={ouvert ? txt.fermer : txt.ouvrir}
                className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95 sm:right-6"
            >
                {ouvert ? <X size={22} /> : <MessageCircle size={22} />}
                {! ouvert && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-amber-400 text-amber-950">
                        <Sparkles size={10} />
                    </span>
                )}
            </button>
        </>,
        document.body,
    );
}
