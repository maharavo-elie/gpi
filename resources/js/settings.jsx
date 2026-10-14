import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext(null);

export const DEFAUTS = {
    densite: 'confortable',
    sidebarElargie: true,
    sidebarRepliee: false,
    theme: 'navy',
    sons: true,
    packSons: 'auto', // chaque thème anime apporte son propre pack
    volumeSon: 80,
    wallpaper: true,
    wallpaperVoile: 45,
    wallpaperPerso: null,
};

/* Catalogue des thèmes — reflète app.css (id => nom + type d'aperçu) */
export const THEMES = [
    { id: 'navy', nom: 'Navy DGSR', mode: 'sombre', apercu: ['#0a1228', '#131b31', '#2563eb'] },
    { id: 'ocean', nom: 'Océan profond', mode: 'sombre', apercu: ['#061a24', '#0e2c3b', '#0284c7'] },
    { id: 'foret', nom: 'Forêt', mode: 'sombre', apercu: ['#07160f', '#102e21', '#16a34a'] },
    { id: 'aubergine', nom: 'Aubergine', mode: 'sombre', apercu: ['#150a24', '#2b1645', '#9333ea'] },
    { id: 'graphite', nom: 'Graphite', mode: 'sombre', apercu: ['#0d0f12', '#1c2026', '#3b82f6'] },
    { id: 'bordeaux', nom: 'Bordeaux', mode: 'sombre', apercu: ['#1c0a0e', '#39161e', '#e11d48'] },
    { id: 'cafe', nom: 'Café', mode: 'sombre', apercu: ['#170f08', '#2e2214', '#d97706'] },
    { id: 'minuit', nom: 'Minuit', mode: 'sombre', apercu: ['#02040a', '#0a1120', '#6366f1'] },
    { id: 'clair-bleu', nom: 'Clair bleu', mode: 'clair', apercu: ['#ffffff', '#f1f5f9', '#2563eb'] },
    { id: 'clair-ciel', nom: 'Clair ciel', mode: 'clair', apercu: ['#ffffff', '#ecfeff', '#0891b2'] },
    { id: 'clair-foret', nom: 'Clair forêt', mode: 'clair', apercu: ['#ffffff', '#f0fdf4', '#16a34a'] },
    { id: 'clair-sable', nom: 'Clair sable', mode: 'clair', apercu: ['#fffef7', '#fef9c3', '#d97706'] },
    { id: 'clair-rose', nom: 'Clair rose', mode: 'clair', apercu: ['#ffffff', '#fce7f3', '#db2777'] },
    { id: 'clair-ardoise', nom: 'Clair ardoise', mode: 'clair', apercu: ['#ffffff', '#f4f4f5', '#4f46e5'] },
    { id: 'clair-contraste', nom: 'Clair contraste', mode: 'clair', apercu: ['#ffffff', '#f5f5f5', '#1d4ed8'] },
    /* Thèmes animés */
    { id: 'jjk', nom: 'Jujutsu Kaisen', mode: 'anime', apercu: ['#0d0716', '#1b1133', '#7c3aed'] },
    { id: 'clover', nom: 'Black Clover', mode: 'anime', apercu: ['#0c1208', '#1a2612', '#facc15'] },
    { id: 'slayer', nom: 'Demon Slayer', mode: 'anime', apercu: ['#061018', '#0e2434', '#22d3ee'] },
    { id: 'hunter', nom: 'Solo Leveling', mode: 'anime', apercu: ['#050508', '#10101c', '#818cf8'] },
    { id: 'naruto', nom: 'Naruto', mode: 'anime', apercu: ['#0a1408', '#14300f', '#fb923c'] },
    { id: 'onepiece', nom: 'One Piece', mode: 'anime', apercu: ['#10182e', '#1e3a5c', '#67e8f9'] },
];

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        try {
            const lues = { ...DEFAUTS, ...JSON.parse(localStorage.getItem('gpi_settings') ?? '{}') };
            // Migration : passer en pack Auto + voile léger pour les réglages antérieurs
            if (! localStorage.getItem('gpi_settings_v2')) {
                lues.packSons = 'auto';
                lues.volumeSon = Math.max(lues.volumeSon ?? 0, 75);
                lues.wallpaperVoile = 45;
                localStorage.setItem('gpi_settings_v2', '1');
            }
            return lues;
        } catch {
            return DEFAUTS;
        }
    });

    useEffect(() => {
        localStorage.setItem('gpi_settings', JSON.stringify(settings));
        // Thème appliqué sur <html> : les variables CSS [data-theme] prennent le relais
        const themeValide = THEMES.some((t) => t.id === settings.theme) ? settings.theme : 'navy';
        document.documentElement.setAttribute('data-theme', themeValide);
    }, [settings]);

    const update = (patch) => setSettings((s) => ({ ...s, ...patch }));
    const reset = () => setSettings(DEFAUTS);

    return (
        <SettingsContext.Provider value={{ settings, update, reset }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
