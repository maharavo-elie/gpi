import { useSettings } from '../settings';

/*
 * Fond d'écran façon « thème anime Windows / smartphone » :
 *  - chaque thème anime a sa SCÈNE dessinée en CSS pur (lieu iconique,
 *    silhouettes symboliques, lumières) — aucune image à télécharger ;
 *  - l'utilisateur peut aussi importer SA PROPRE image (personnage, affiche…)
 *    depuis Paramètres, avec un voile de lisibilité réglable.
 */

/* ---------- Scènes CSS par univers ---------- */

/* Bannière du lieu : identifie clairement l'endroit représenté */
const BanniereLieu = ({ nom, kanji, couleur = '#8fdcff' }) => (
    <div className="absolute bottom-5 left-6 z-10 flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-sm anim-fade-in"
        style={{ borderColor: `${couleur}55`, background: 'rgba(5,5,12,.55)' }}>
        <span className="text-lg" style={{ color: couleur, textShadow: `0 0 10px ${couleur}` }}>{kanji}</span>
        <span className="text-[11px] font-bold uppercase tracking-[.14em] text-white/90">{nom}</span>
    </div>
);

/* Jujutsu Kaisen — Shibuya la nuit : néons violets, skyline, pluie d'énergie */
const SceneShibuya = () => (
    <div className="absolute inset-0 overflow-hidden">
        <BanniereLieu nom="Shibuya — Nuit occulte" kanji="渋谷" couleur="#c084fc" />
        {/* ciel de nuit dégradé */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0b0618 0%, #1b0f38 45%, #2d1450 100%)' }} />
        {/* lune brumeuse */}
        <div className="absolute top-[8%] left-[70%] w-40 h-40 rounded-full anim-float" style={{ background: 'radial-gradient(circle, rgba(216,180,254,.55), rgba(216,180,254,.06) 65%)', filter: 'blur(2px)' }} />
        {/* skyline lointaine */}
        <div className="absolute bottom-[30%] left-0 right-0 h-40 flex items-end justify-around opacity-80">
            {[52, 84, 38, 96, 62, 110, 74, 46, 90, 58].map((h, i) => (
                <div key={i} className="w-10 md:w-14 rounded-t-sm" style={{ height: `${h}%`, background: '#150a2e', boxShadow: 'inset 0 0 12px rgba(124,58,237,.25)' }}>
                    <div className="grid grid-cols-2 gap-1 p-1.5 opacity-80">
                        {Array.from({ length: Math.floor(h / 14) }).map((_, j) => (
                            <span key={j} className="h-1 rounded-sm anim-pulse-dot" style={{ background: j % 3 ? '#7c3aed' : '#f0abfc', animationDelay: `${(i * 7 + j * 3) % 16}00ms` }} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
        {/* immeubles premiers plans sombres */}
        <div className="absolute bottom-[18%] left-[6%] w-24 h-56 bg-[#0d0716] rounded-t-lg" />
        <div className="absolute bottom-[18%] right-[10%] w-32 h-72 bg-[#0d0716] rounded-t-lg" />
        {/* néons */}
        <div className="absolute bottom-[42%] left-[18%] px-2 py-0.5 rounded font-mono text-[10px] font-bold anim-pulse-dot" style={{ color: '#f0abfc', background: 'rgba(124,58,237,.18)', textShadow: '0 0 8px #a855f7', animationDelay: '.6s' }}>渋谷</div>
        <div className="absolute bottom-[36%] right-[22%] px-2 py-0.5 rounded font-mono text-[10px] font-bold anim-pulse-dot" style={{ color: '#67e8f9', background: 'rgba(34,211,238,.12)', textShadow: '0 0 8px #22d3ee' }}>呪術</div>
        {/* silhouettes Gojo/Sukuna abstraites : deux auras d'énergie */}
        <div className="absolute bottom-[20%] left-[30%] w-24 h-40 anim-float" style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,.5), transparent 70%)', filter: 'blur(6px)' }} />
        <div className="absolute bottom-[20%] right-[34%] w-20 h-32 anim-float" style={{ background: 'radial-gradient(ellipse at center, rgba(220,38,38,.4), transparent 70%)', filter: 'blur(6px)', animationDelay: '-3s' }} />
        {/* rue */}
        <div className="absolute bottom-0 left-0 right-0 h-[18%]" style={{ background: 'linear-gradient(180deg, #05030b, #0d0716)' }} />
    </div>
);

/* Demon Slayer — Allée des glycines : montagne, wisteria rose, lanternes */
const SceneWisteria = () => (
    <div className="absolute inset-0 overflow-hidden">
        <BanniereLieu nom="Mont Fujikasane — Glycines" kanji="藤" couleur="#fb923c" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #04101c 0%, #0a1a2e 50%, #10263e 100%)' }} />
        {/* montagne Fuji */}
        <div className="absolute bottom-[24%] left-1/2 -translate-x-1/2 w-[70%] h-64" style={{ background: 'linear-gradient(180deg, #0e2436 0%, #0a1c2c 100%)', clipPath: 'polygon(50% 0%, 78% 100%, 22% 100%)' }} />
        <div className="absolute bottom-[46%] left-1/2 -translate-x-1/2 w-[24%] h-8" style={{ background: '#e5f4fc', clipPath: 'polygon(50% 0%, 82% 100%, 18% 100%)', opacity: .85, filter: 'blur(1px)' }} />
        {/* glycines suspendues */}
        {[10, 22, 34, 66, 78, 90].map((x, i) => (
            <div key={x} className="absolute top-0 anim-float" style={{ left: `${x}%`, animationDelay: `${-i * 2}s`, animationDuration: '7s' }}>
                <div className="w-0.5 h-10 bg-[#1f506e] mx-auto" />
                <div className="w-6 h-16 rounded-b-full" style={{ background: 'linear-gradient(180deg, rgba(251,146,60,.85), rgba(251,146,60,.15))', filter: 'blur(.5px)' }} />
            </div>
        ))}
        {/* lanternes flottantes */}
        {[16, 48, 84].map((x, i) => (
            <div key={x} className="absolute anim-float" style={{ top: `${34 + i * 9}%`, left: `${x}%`, animationDelay: `${-i * 2.6}s`, animationDuration: '6s' }}>
                <div className="w-6 h-8 rounded-[50%]" style={{ background: 'radial-gradient(circle at 50% 40%, #fbbf24, #b45309)', boxShadow: '0 0 18px rgba(251,191,36,.55)' }} />
            </div>
        ))}
        {/* Tanjiro/Nezuko : deux silhouettes sous la lumière */}
        <div className="absolute bottom-[24%] left-[38%] flex items-end gap-3">
            <div className="w-5 h-16 rounded-t-full bg-[#061018] relative"><div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#7bd0ff] opacity-70" /></div>
            <div className="w-4 h-12 rounded-t-full bg-[#061018] relative"><div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-rose-500 opacity-80" /></div>
        </div>
        {/* chemin */}
        <div className="absolute bottom-0 left-0 right-0 h-[24%]" style={{ background: 'linear-gradient(180deg, #061018, #04080e)' }} />
    </div>
);

/* Black Clover — Royaume de Clover : château doré au petit matin */
const SceneRoyaume = () => (
    <div className="absolute inset-0 overflow-hidden">
        <BanniereLieu nom="Royaume de Clover" kanji="✦" couleur="#facc15" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0c1208 0%, #1a2a10 55%, #2c4018 100%)' }} />
        {/* soleil levant */}
        <div className="absolute top-[12%] right-[16%] w-44 h-44 rounded-full anim-float" style={{ background: 'radial-gradient(circle, rgba(250,204,21,.5), transparent 68%)', filter: 'blur(3px)' }} />
        {/* château Clover */}
        <div className="absolute bottom-[26%] left-1/2 -translate-x-1/2 flex items-end">
            <div className="w-8 h-28 bg-[#131c0d] relative rounded-t-md"><div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '24px solid #131c0d' }} /><div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-4 bg-[#facc15]" /></div>
            <div className="w-16 h-44 bg-[#182410] relative rounded-t-md ml-1"><div className="absolute -top-7 left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '36px solid transparent', borderRight: '36px solid transparent', borderBottom: '32px solid #182410' }} /><div className="absolute -top-10 left-1/2 -translate-x-1/2 w-1 h-5 bg-[#facc15]" /><div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#facc15] anim-pulse-dot" /></div>
            <div className="w-8 h-32 bg-[#131c0d] relative rounded-t-md ml-1"><div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '16px solid transparent', borderRight: '16px solid transparent', borderBottom: '24px solid #131c0d' }} /><div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-4 bg-[#facc15]" /></div>
        </div>
        {/* collines vertes */}
        <div className="absolute bottom-[16%] left-0 right-0 h-40 rounded-[100%] scale-150" style={{ background: 'linear-gradient(180deg, #223318, #17250f)' }} />
        {/* Asta/Yuno : silhouettes de grimoires flottants */}
        <div className="absolute top-[30%] left-[22%] w-9 h-12 rounded-sm anim-float" style={{ background: '#0f1809', boxShadow: '0 0 16px rgba(250,204,21,.5)', animationDuration: '5s' }} />
        <div className="absolute top-[24%] right-[24%] w-9 h-12 rounded-sm anim-float" style={{ background: '#0f1809', boxShadow: '0 0 16px rgba(163,230,53,.5)', animationDelay: '-2.5s', animationDuration: '6s' }} />
        {/* petit trèfle à 5 feuilles */}
        <div className="absolute top-[18%] left-[48%] anim-pulse-dot text-[#4ade80] text-lg">✦</div>
        {/* plaine */}
        <div className="absolute bottom-0 left-0 right-0 h-[16%]" style={{ background: 'linear-gradient(180deg, #0c1208, #080d05)' }} />
    </div>
);

/* Solo Leveling — Portail Système : faille holographique bleue */
const ScenePortail = () => (
    <div className="absolute inset-0 overflow-hidden">
        <BanniereLieu nom="Portail de la Double Donjon" kanji="⚡" couleur="#818cf8" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #050508 0%, #0a0a14 60%, #0d0d1c 100%)' }} />
        {/* grille Système en fond */}
        <div className="absolute inset-0 opacity-[.13]" style={{ backgroundImage: 'linear-gradient(rgba(129,140,248,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,.5) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
        {/* portail (faille) */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-52 h-72 anim-float" style={{ borderRadius: '48% 52% 55% 45% / 60% 55% 45% 40%', background: 'radial-gradient(ellipse at center, rgba(165,180,252,.9) 0%, rgba(109,40,217,.55) 40%, rgba(30,27,75,.15) 72%, transparent 100%)', filter: 'blur(2px)', animationDuration: '8s' }}>
            <div className="absolute inset-4 anim-spin-glow" style={{ borderRadius: '46% 54% 48% 52% / 55% 48% 52% 45%', border: '2px dashed rgba(199,210,254,.6)' }} />
        </div>
        {/* arêtes de notification Système */}
        <div className="absolute top-[10%] left-[12%] px-2.5 py-1 rounded-md border font-mono text-[10px] font-bold anim-pulse-dot" style={{ borderColor: 'rgba(129,140,248,.5)', color: '#a5b4fc', background: 'rgba(20,20,40,.8)', textShadow: '0 0 10px rgba(129,140,248,.8)' }}>[ ALERTE ]</div>
        <div className="absolute top-[16%] right-[10%] px-2.5 py-1 rounded-md border font-mono text-[10px] font-bold anim-pulse-dot" style={{ borderColor: 'rgba(103,232,249,.5)', color: '#67e8f9', background: 'rgba(20,20,40,.8)', animationDelay: '.8s' }}>[ QUÊTE ]</div>
        {/* Jinwoo : silhouette de monarque de l'ombre */}
        <div className="absolute bottom-[18%] right-[26%] w-6 h-20 rounded-t-full bg-[#050508] relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-2 rounded-full anim-pulse-dot" style={{ background: '#818cf8', boxShadow: '0 0 12px #6366f1' }} />
        </div>
        {/* soldats de l'ombre : yeux lumineux au sol */}
        {[20, 34, 46, 60].map((x, i) => (
            <div key={x} className="absolute bottom-[20%] flex gap-1.5" style={{ left: `${x}%`, opacity: .9 }}>
                <span className="w-1.5 h-1 rounded-full anim-pulse-dot" style={{ background: '#a5b4fc', boxShadow: '0 0 8px #818cf8', animationDelay: `${i * .4}s` }} />
                <span className="w-1.5 h-1 rounded-full anim-pulse-dot" style={{ background: '#a5b4fc', boxShadow: '0 0 8px #818cf8', animationDelay: `${i * .4 + .15}s` }} />
            </div>
        ))}
        {/* sol */}
        <div className="absolute bottom-0 left-0 right-0 h-[14%]" style={{ background: 'linear-gradient(180deg, #050508, #030306)' }} />
    </div>
);

/* Naruto — Vallée de la Fin : falaises, statues, cascades vertes */
const SceneKonoha = () => (
    <div className="absolute inset-0 overflow-hidden">
        <BanniereLieu nom="Vallée de la Fin" kanji="忍" couleur="#fb923c" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0a1408 0%, #14300f 55%, #1d4514 100%)' }} />
        {/* soleil couchant orange */}
        <div className="absolute top-[10%] left-[18%] w-40 h-40 rounded-full anim-float" style={{ background: 'radial-gradient(circle, rgba(251,146,60,.45), transparent 65%)', filter: 'blur(4px)' }} />
        {/* Mont Hokage : visages sculptés */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[60%] h-56" style={{ background: 'linear-gradient(180deg, #1d4514, #12290d)', clipPath: 'polygon(0% 100%, 8% 30%, 22% 32%, 30% 8%, 44% 10%, 52% 34%, 66% 6%, 80% 10%, 86% 38%, 100% 34%, 100% 100%)' }}>
            <div className="absolute inset-x-0 bottom-6 flex justify-around opacity-70">{[0,1,2,3].map(i => <div key={i} className="w-5 h-8 rounded-t-full bg-[#2c5a1e]" />)}</div>
        </div>
        {/* deux falaises + cascade entre les deux */}
        <div className="absolute bottom-[18%] left-[8%] w-24 h-64 bg-[#0a1408] rounded-t-3xl" />
        <div className="absolute bottom-[18%] right-[8%] w-24 h-64 bg-[#0a1408] rounded-t-3xl" />
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-14 h-64 anim-float" style={{ background: 'linear-gradient(180deg, rgba(134,239,172,.5), rgba(134,239,172,.08))', filter: 'blur(3px)', animationDuration: '6s' }} />
        {/* Naruto/Sasuke : deux silhouettes face à face */}
        <div className="absolute bottom-[19%] left-[26%] w-5 h-14 rounded-t-full bg-[#050a04] relative"><div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-2 rounded-full bg-orange-400 opacity-80" /></div>
        <div className="absolute bottom-[19%] right-[26%] w-5 h-14 rounded-t-full bg-[#050a04] relative"><div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-2 rounded-full bg-sky-300 opacity-80" /></div>
        {/* rivière */}
        <div className="absolute bottom-0 left-0 right-0 h-[18%]" style={{ background: 'linear-gradient(180deg, #071006, #050a04)' }} />
    </div>
);

/* One Piece — Grand Line : Thousand Sunny sur océan de crépuscule */
const SceneGrandLine = () => (
    <div className="absolute inset-0 overflow-hidden">
        <BanniereLieu nom="Grand Line — Crépuscule" kanji="⚓" couleur="#67e8f9" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #10182e 0%, #1e3a5c 45%, #2d6488 100%)' }} />
        {/* lune sur l'horizon marin */}
        <div className="absolute top-[12%] right-[20%] w-36 h-36 rounded-full anim-float" style={{ background: 'radial-gradient(circle, rgba(254,240,138,.5), transparent 65%)', filter: 'blur(2px)' }} />
        {/* océan : vagues stylisées */}
        {[0, 1, 2, 3].map((i) => (
            <div key={i} className="absolute left-0 right-0 h-16 anim-float" style={{ bottom: `${4 + i * 5}%`, background: i % 2 ? 'rgba(34,211,238,.10)' : 'rgba(103,232,249,.07)', borderRadius: '100% 90% 100% 85%', filter: 'blur(2px)', animationDuration: `${7 + i * 2}s`, animationDelay: `${-i * 1.7}s` }} />
        ))}
        {/* Thousand Sunny : silhouette de navire + lion */}
        <div className="absolute bottom-[26%] left-1/2 -translate-x-1/2 anim-float" style={{ animationDuration: '6s' }}>
            <div className="w-40 h-3 bg-[#0a0f20] rounded-full" />
            <div className="w-28 h-8 bg-[#0d1428] mx-auto rounded-t-xl relative"><div className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-6 rounded-full bg-[#0d1428]" style={{ boxShadow: '0 0 14px rgba(250,204,21,.4)' }} /></div>
            <div className="absolute -top-16 left-1/2 w-0 h-0 -translate-x-1/2" style={{ borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '34px solid #0a0f20' }} />
        </div>
        {/* mouettes lointaines */}
        {[30, 55, 75].map((x, i) => <div key={x} className="absolute text-[#dbeafe] opacity-60 anim-float text-xs" style={{ top: `${18 + i * 6}%`, left: `${x}%`, animationDelay: `${-i}s`, animationDuration: '9s' }}>⌒</div>)}
        {/* mer sombre */}
        <div className="absolute bottom-0 left-0 right-0 h-[16%]" style={{ background: 'linear-gradient(180deg, #0a1224, #060b18)' }} />
    </div>
);

export const SCENES = {
    jjk: { composant: SceneShibuya, nom: 'Shibuya — Nuit occulte', univers: 'Jujutsu Kaisen' },
    slayer: { composant: SceneWisteria, nom: 'Allée des glycines', univers: 'Demon Slayer' },
    clover: { composant: SceneRoyaume, nom: 'Château du Royaume de Clover', univers: 'Black Clover' },
    hunter: { composant: ScenePortail, nom: 'Portail du Système', univers: 'Solo Leveling' },
    naruto: { composant: SceneKonoha, nom: 'Vallée de la Fin', univers: 'Naruto' },
    onepiece: { composant: SceneGrandLine, nom: 'Grand Line — Crépuscule', univers: 'One Piece' },
};

export default function FondEcran() {
    const { settings } = useSettings();
    const theme = settings.theme;

    const scene = SCENES[theme];
    const imagePerso = settings.wallpaperPerso;
    const actif = settings.wallpaper !== false; // activé par défaut sur les thèmes anime

    if (! actif) return null;

    return (
        <div aria-hidden className="fixed inset-0 z-0 pointer-events-none anim-fade-in overflow-hidden">
            {/* Scène CSS du thème (ou image perso prioritaire) */}
            {! imagePerso && scene?.composant && <scene.composant />}
            {imagePerso && (
                <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${imagePerso})` }} />
            )}
            {/* Voile de lisibilité : atténue le fond pour que le contenu reste lisible */}
            <div className="absolute inset-0" style={{ background: 'var(--color-slate-950, #0a1228)', opacity: ((settings.wallpaperVoile ?? 45) / 100) * 0.92 }} />
        </div>
    );
}
