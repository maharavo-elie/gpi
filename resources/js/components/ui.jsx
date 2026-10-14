import { X, TriangleAlert, Trash2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { sons } from '../lib/sons';

function Badge({ children, color = 'bg-slate-100 text-slate-500 border-slate-200' }) {
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${color}`}>
            {children}
        </span>
    );
}

export { Badge };
export default Badge;

/* Bouton « Modifier » : orange (action d'édition) */
export function EditButton({ onClick, label = 'Modifier', icon: Icon }) {
    return (
        <button
            onClick={onClick}
            title={label}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-orange-200/60 bg-orange-100 hover:bg-orange-200 text-orange-400 text-xs font-semibold transition-colors"
        >
            {Icon && <Icon size={13} />}
            {label}
        </button>
    );
}

/* Modale d'édition réutilisable (création + modification) — backdrop en fondu, contenu en pop.
   Rendue via un portail dans <body> : un ancêtre animé (transform) capterait sinon le position: fixed. */
export function EditModal({ open, onClose, title, mode = 'create', children, onSubmit, busy, submitLabel, width = 'max-w-2xl' }) {
    if (! open) return null;
    const fermer = () => { sons.fermer(); onClose(); };
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm anim-fade-in" onMouseDown={(e) => { if (e.target === e.currentTarget) fermer(); }}>
            <div className={`anim-pop bg-card rounded-2xl shadow-2xl w-full ${width} max-h-[92vh] sm:max-h-[90vh] flex flex-col border border-slate-200/50`}>
                <div className="flex items-start sm:items-center justify-between gap-2 px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200/50 shrink-0">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        {title}
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                            mode === 'edit'
                                ? 'bg-orange-100 text-orange-400'
                                : 'bg-vert-100 text-vert-400'
                        }`}>
                            {mode === 'edit' ? 'EDITION' : 'NOUVEAU'}
                        </span>
                    </h2>
                    <button onClick={fermer} className="p-1.5 text-slate-400 hover:text-slate-800 transition hover:rotate-90"><X size={18} /></button>
                </div>
                <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0">
                    <div className="p-4 sm:p-5 overflow-y-auto flex-1">{children}</div>
                    <div className="flex justify-end gap-2 px-4 sm:px-5 py-3 sm:py-4 border-t border-slate-200/50 shrink-0">
                        <button type="button" onClick={fermer} className="px-3 sm:px-4 py-2 rounded-lg border border-slate-200/50 text-xs sm:text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition">
                            Annuler
                        </button>
                        <button
                            disabled={busy}
                            className="px-3 sm:px-4 py-2 rounded-lg bg-vert-600 hover:bg-vert-700 disabled:opacity-60 text-white text-xs sm:text-sm font-bold shadow-sm shadow-vert-600/30 inline-flex items-center gap-1.5"
                        >
                            {busy ? 'Enregistrement…' : (submitLabel ?? (mode === 'edit' ? 'Enregistrer les modifications' : 'Créer'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
}

/* Modale de confirmation centrée (remplace window.confirm natif).
   Usage : <ConfirmModal open message="…" onConfirm={…} onClose={…} /> */
export function ConfirmModal({
    open,
    title = 'Confirmer la suppression',
    message,
    confirmLabel = 'Supprimer',
    cancelLabel = 'Annuler',
    busyLabel = 'Suppression…',
    danger = true,
    icone = null, // icône du bouton de confirmation (poubelle par défaut en mode danger)
    busy = false,
    onConfirm,
    onClose,
}) {
    if (! open) return null;
    const fermer = () => { sons.fermer(); onClose(); };
    return createPortal(
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm anim-fade-in"
            onMouseDown={(e) => { if (e.target === e.currentTarget && ! busy) fermer(); }}
        >
            <div className="anim-pop bg-card rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200/50 overflow-hidden">
                <div className="p-4 sm:p-5 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                        danger ? 'bg-rose-100 text-rose-400' : 'bg-blue-100 text-blue-400'
                    }`}>
                        <TriangleAlert size={24} />
                    </div>
                    <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{message}</p>
                </div>
                <div className="flex gap-2 px-5 pb-5">
                    <button
                        type="button"
                        onClick={fermer}
                        disabled={busy}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200/50 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition disabled:opacity-60"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-extrabold uppercase tracking-wide shadow-md transition-all active:scale-[.97] disabled:opacity-60 inline-flex items-center justify-center gap-1.5 ${
                            danger
                                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/40 ring-1 ring-rose-700/50'
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/40 ring-1 ring-blue-700/50'
                        }`}
                    >
                        {! busy && (danger && icone === null ? <Trash2 size={15} /> : icone)}
                        {busy ? busyLabel : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

/* Bouton principal vert avec micro-interaction press */
export function PrimaryButton({ children, onClick, disabled, type = 'button', className = '' }) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-vert-600 hover:bg-vert-700 active:scale-[.97] disabled:opacity-60 text-white text-sm font-bold shadow-sm shadow-vert-600/30 transition-all ${className}`}
        >
            {children}
        </button>
    );
}

export function Spinner({ label = 'Chargement…' }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="w-8 h-8 border-3 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            <p className="mt-3 text-sm">{label}</p>
        </div>
    );
}

export function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}

export function EmptyState({ icon: Icon, title, hint }) {
    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
            {Icon && (
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <Icon size={22} />
                </div>
            )}
            <p className="text-sm font-semibold text-slate-700">{title}</p>
            {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
        </div>
    );
}

export function Field({ label, children, required }) {
    return (
        <label className="block">
            <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                {label} {required && <span className="text-rose-400">*</span>}
            </span>
            {children}
        </label>
    );
}

export const inputClass =
    'block w-full px-3 py-2 bg-card-high border border-slate-200/50 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-blue-400 transition';

export function ErrorText({ errors }) {
    if (! errors || Object.keys(errors).length === 0) return null;
    return (
        <div className="anim-shake rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-400 space-y-1 mb-3">
            {Object.entries(errors).map(([field, messages]) => (
                <p key={field}>{messages.join(' ')}</p>
            ))}
        </div>
    );
}
