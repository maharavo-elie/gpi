/*
 * Sons d'interface synthétisés (Web Audio API) — aucun fichier audio requis.
 * Un pack de sons peut être choisi dans Paramètres (préférence `packSons`).
 * L'AudioContext est créé au premier geste utilisateur (politique autoplay).
 */

let ctx = null;

const reglages = () => {
    try {
        return JSON.parse(localStorage.getItem('gpi_settings') ?? '{}');
    } catch {
        return {};
    }
};

const actif = () => reglages().sons !== false;

/* Thème → pack par défaut (mode « Auto » : chaque thème a SON ambiance sonore) */
const PACK_PAR_THEME = {
    jjk: 'jjk',
    clover: 'clover',
    slayer: 'slayer',
    hunter: 'hunter',
    naruto: 'naruto',
    onepiece: 'onepiece',
};
const packActif = () => {
    const r = reglages();
    if (r.packSons && r.packSons !== 'auto') return r.packSons;
    return PACK_PAR_THEME[r.theme] ?? 'classique';
};

/* Volume général (0..1) — réglé par le curseur de Paramètres (volumeSon en %). */
const volumeGlobal = () => {
    const v = reglages().volumeSon;
    return typeof v === 'number' ? Math.min(1, Math.max(0.05, v / 100)) : 0.8;
};

/* Indicateur visuel : preuve qu'un son vient de partir (🔊 animé en bas à droite). */
let pastille = null;
let pastilleTimer = null;
const flashSonore = () => {
    if (typeof document === 'undefined') return;
    if (! pastille) {
        pastille = document.createElement('div');
        pastille.style.cssText = 'position:fixed;bottom:14px;right:14px;z-index:9999;background:rgba(16,16,28,.92);color:#8fdcff;border:1px solid rgba(129,140,248,.5);padding:5px 10px;border-radius:9999px;font:600 12px/1 ui-sans-serif,system-ui;display:flex;align-items:center;gap:6px;pointer-events:none;transition:opacity .3s;opacity:0';
        document.body.appendChild(pastille);
    }
    const icone = packActif() === 'classique' ? '🔊' : '⚡🔊';
    const noms = { jjk: 'Occulte', clover: 'Royaume', slayer: 'Souffle', hunter: 'Système', naruto: 'Ninja', onepiece: 'Équipage', classique: 'Classique' };
    pastille.textContent = `${icone} ${noms[packActif()] ?? ''}`;
    pastille.style.opacity = '1';
    clearTimeout(pastilleTimer);
    pastilleTimer = setTimeout(() => { pastille.style.opacity = '0'; }, 900);
};

const contexte = () => {
    if (! ctx) {
        const AC = window.AudioContext ?? window.webkitAudioContext;
        if (! AC) return null;
        ctx = new AC();
        window.__gpiAudioDebug = ctx; // diagnostic possible en console
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
};

/**
 * Note avec enveloppe douce.
 * freq en Hz, duree en s, type d'onde, volume 0..1, delai en s.
 */
const note = (freq, duree = 0.12, type = 'sine', volumeBase = 0.08, delai = 0) => {
    if (! actif()) return;
    const audio = contexte();
    if (! audio) return;
    if (delai === 0) flashSonore();

    const vol = volumeBase * 3.2 * volumeGlobal();
    const t0 = audio.currentTime + delai;
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);

    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + duree + 0.05);
};

/** Glissando : la fréquence glisse de `de` vers `vers` (sensations « énergie »). */
const gliss = (de, vers, duree = 0.18, type = 'sawtooth', volumeBase = 0.05, delai = 0) => {
    if (! actif()) return;
    const audio = contexte();
    if (! audio) return;
    if (delai === 0) flashSonore();

    const vol = volumeBase * 3.2 * volumeGlobal();
    const t0 = audio.currentTime + delai;
    const osc = audio.createOscillator();
    const gain = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(de, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(vers, 1), t0 + duree);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duree + 0.05);

    osc.connect(gain).connect(audio.destination);
    osc.start(t0);
    osc.stop(t0 + duree + 0.1);
};

/* ==================================================================
 * PACK CLASSIQUE — UI sobre (sonneries de plateforme)
 * ================================================================== */
const classique = {
    clic: () => note(520, 0.07, 'triangle', 0.05),
    succes: () => {
        note(523.25, 0.14, 'sine', 0.07, 0);
        note(659.25, 0.14, 'sine', 0.07, 0.09);
        note(783.99, 0.2, 'sine', 0.08, 0.18);
    },
    alerte: () => {
        note(392, 0.16, 'square', 0.045, 0);
        note(311.13, 0.22, 'square', 0.045, 0.12);
    },
    ouvrir: () => {
        note(440, 0.09, 'sine', 0.05, 0);
        note(554.37, 0.12, 'sine', 0.05, 0.06);
    },
    fermer: () => {
        note(554.37, 0.09, 'sine', 0.045, 0);
        note(440, 0.12, 'sine', 0.045, 0.06);
    },
    tintement: () => {
        note(880, 0.18, 'sine', 0.05, 0);
        note(1760, 0.25, 'sine', 0.025, 0.02);
    },
};

/* ==================================================================
 * PACK « OCCULTE » — Jujutsu Kaisen : énergie électrico-violette
 * ================================================================== */
const jjk = {
    clic: () => gliss(760, 980, 0.06, 'sawtooth', 0.035),
    succes: () => {
        // Extension du domaine : accord de puissance + montée d'énergie
        note(392, 0.3, 'sawtooth', 0.035, 0);
        note(493.88, 0.3, 'sawtooth', 0.035, 0.02);
        note(587.33, 0.38, 'sawtooth', 0.04, 0.04);
        gliss(300, 1200, 0.35, 'sine', 0.04, 0.05);
    },
    alerte: () => {
        // Malédiction : nappe descendante dissonante
        note(233.08, 0.28, 'sawtooth', 0.04, 0);
        note(220, 0.34, 'sawtooth', 0.04, 0.14);
    },
    ouvrir: () => gliss(420, 900, 0.14, 'sawtooth', 0.04),
    fermer: () => gliss(900, 420, 0.14, 'sawtooth', 0.035),
    tintement: () => {
        note(739.99, 0.16, 'sine', 0.05, 0);
        note(1108.73, 0.22, 'sine', 0.03, 0.03);
    },
};

/* ==================================================================
 * PACK « ROYAUME » — Black Clover : fanfare héroïque, anti-magie
 * ================================================================== */
const clover = {
    clic: () => note(587.33, 0.06, 'triangle', 0.05),
    succes: () => {
        // Fanfare du roi des mages : do-sol-do' + tierce
        note(523.25, 0.12, 'triangle', 0.06, 0);
        note(783.99, 0.12, 'triangle', 0.06, 0.1);
        note(1046.5, 0.26, 'triangle', 0.07, 0.2);
        note(659.25, 0.3, 'sine', 0.035, 0.2);
    },
    alerte: () => {
        // Anti-magie : seconde mineure tendue
        note(466.16, 0.18, 'square', 0.04, 0);
        note(415.3, 0.26, 'square', 0.04, 0.13);
    },
    ouvrir: () => {
        note(523.25, 0.08, 'triangle', 0.045, 0);
        note(783.99, 0.12, 'triangle', 0.05, 0.07);
    },
    fermer: () => {
        note(783.99, 0.08, 'triangle', 0.04, 0);
        note(523.25, 0.12, 'triangle', 0.045, 0.07);
    },
    tintement: () => {
        // Arpège de grimoire
        note(659.25, 0.12, 'sine', 0.045, 0);
        note(830.61, 0.12, 'sine', 0.045, 0.07);
        note(987.77, 0.2, 'sine', 0.05, 0.14);
    },
};

/* ==================================================================
 * PACK « SOUFFLE » — Demon Slayer : souffle de l'eau, taiko
 * ================================================================== */
const slayer = {
    clic: () => note(493.88, 0.06, 'sine', 0.045),
    succes: () => {
        // Run pentatonique fluide (souffle de l'eau)
        [523.25, 587.33, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, 0.1, 'sine', 0.05, i * 0.06));
    },
    alerte: () => {
        // Taiko + corne : frappe grave
        note(98, 0.22, 'sine', 0.09, 0);
        note(87.31, 0.3, 'sine', 0.08, 0.16);
    },
    ouvrir: () => gliss(500, 1000, 0.16, 'sine', 0.04),
    fermer: () => gliss(1000, 500, 0.16, 'sine', 0.035),
    tintement: () => {
        // Koto : pincement bref
        note(880, 0.1, 'triangle', 0.05, 0);
        note(1174.66, 0.18, 'triangle', 0.03, 0.05);
    },
};

/* ==================================================================
 * PACK « SYSTEME » — Solo Leveling : fenêtre système, niveau up !
 * ================================================================== */
const hunter = {
    clic: () => note(880, 0.05, 'square', 0.03),
    succes: () => {
        // « LEVEL UP » : double ding cristallin
        note(987.77, 0.12, 'sine', 0.06, 0);
        note(1318.51, 0.24, 'sine', 0.06, 0.11);
        note(1567.98, 0.3, 'sine', 0.035, 0.22);
    },
    alerte: () => {
        // Alerte système : bourdon grave x2
        note(110, 0.16, 'square', 0.05, 0);
        note(110, 0.2, 'square', 0.05, 0.2);
    },
    ouvrir: () => {
        // Fenêtre de notification qui s'ouvre
        gliss(600, 1200, 0.1, 'square', 0.03);
        note(1567.98, 0.12, 'sine', 0.03, 0.1);
    },
    fermer: () => {
        gliss(1200, 600, 0.1, 'square', 0.025);
        note(784, 0.1, 'sine', 0.025, 0.1);
    },
    tintement: () => {
        note(1318.51, 0.14, 'sine', 0.05, 0);
        note(1975.53, 0.22, 'sine', 0.025, 0.05);
    },
};

/* ==================================================================
 * PACK « NINJA » — Naruto : chakra, kunai, taiko de la Vallée
 * ================================================================== */
const naruto = {
    clic: () => note(660, 0.05, 'square', 0.035),
    succes: () => {
        // Rasengan réussi : montée de chakra pentatonique
        [523.25, 622.25, 783.99, 932.33, 1244.51].forEach((f, i) => note(f, 0.09, 'triangle', 0.05, i * 0.055));
        gliss(200, 900, 0.3, 'sine', 0.03, 0.05);
    },
    alerte: () => {
        //双 taiko de la Vallée de la Fin
        note(110, 0.2, 'sine', 0.1, 0);
        note(98, 0.26, 'sine', 0.09, 0.14);
    },
    ouvrir: () => gliss(350, 800, 0.12, 'triangle', 0.04),
    fermer: () => gliss(800, 350, 0.12, 'triangle', 0.035),
    tintement: () => {
        // shamisen : pincement bref
        note(740, 0.09, 'triangle', 0.05, 0);
        note(1108.73, 0.16, 'triangle', 0.03, 0.05);
    },
};

/* ==================================================================
 * PACK « ÉQUIPAGE » — One Piece : corne du Sunny, den den mushi
 * ================================================================== */
const onepiece = {
    clic: () => note(587.33, 0.05, 'sine', 0.04),
    succes: () => {
        // Corne d'aventure : do-fa-sol-do'
        note(523.25, 0.13, 'triangle', 0.06, 0);
        note(698.46, 0.13, 'triangle', 0.06, 0.11);
        note(783.99, 0.13, 'triangle', 0.065, 0.22);
        note(1046.5, 0.3, 'triangle', 0.07, 0.33);
    },
    alerte: () => {
        // Corne de marine grave
        note(146.83, 0.3, 'sawtooth', 0.05, 0);
        note(138.59, 0.36, 'sawtooth', 0.05, 0.18);
    },
    ouvrir: () => gliss(500, 900, 0.14, 'sine', 0.04),
    fermer: () => gliss(900, 500, 0.14, 'sine', 0.035),
    tintement: () => {
        // Den den mushi : sonnerie deux tons
        note(830.61, 0.12, 'square', 0.035, 0);
        note(987.77, 0.18, 'square', 0.035, 0.14);
    },
};

export const PACKS_SONS = [
    { id: 'auto', nom: 'Auto', univers: 'Selon le thème actif', exemple: 'Chaque thème a son ambiance' },
    { id: 'classique', nom: 'Classique', univers: 'UI sobre', exemple: 'Ding-UI' },
    { id: 'jjk', nom: 'Occulte', univers: 'Jujutsu Kaisen', exemple: 'Extension du domaine' },
    { id: 'clover', nom: 'Royaume', univers: 'Black Clover', exemple: 'Fanfare du grimoire' },
    { id: 'slayer', nom: 'Souffle', univers: 'Demon Slayer', exemple: 'Souffle de l\u2019eau' },
    { id: 'hunter', nom: 'Système', univers: 'Solo Leveling', exemple: 'Level up !' },
    { id: 'naruto', nom: 'Ninja', univers: 'Naruto', exemple: 'Montée de chakra' },
    { id: 'onepiece', nom: 'Équipage', univers: 'One Piece', exemple: 'Corne du Sunny' },
];

const packs = { classique, jjk, clover, slayer, hunter, naruto, onepiece };

/* Proxy : `sons.xxx` utilise toujours le pack choisi dans Paramètres. */
export const sons = new Proxy({}, {
    get(_cible, prop) {
        const pack = packs[packActif()] ?? classique;
        return pack[prop] ?? classique[prop];
    },
});
