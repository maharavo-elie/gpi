import { api } from '../api';

/**
 * Télécharge un export PDF/CSV depuis l'API (réponse blob authentifiée).
 * Le navigateur enregistre le fichier sous `nomFichier`.
 */
export async function telechargerExport(chemin, params = {}, nomFichier = 'export.pdf') {
    const res = await api.get(chemin, {
        params,
        responseType: 'blob',
        timeout: 120000,
    });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomFichier;
    a.click();
    URL.revokeObjectURL(url);
}

/** Nom de fichier daté du jour, ex. registre_agents_2026-09-28.pdf */
export function nomExport(base, ext = 'pdf') {
    return `${base}_${new Date().toISOString().slice(0, 10)}.${ext}`;
}
