import { useEffect, useRef, useState } from 'react';

/**
 * Compteur animé : compte de 0 vers la valeur avec un easing doux.
 * Reduction du mouvement respectée via la media query CSS (les valeurs s'affichent alors directement).
 */
export function useCompteur(valeur, duree = 900) {
    const [affiche, setAffiche] = useState(0);
    const refAnim = useRef(null);

    useEffect(() => {
        const cible = Number(valeur) || 0;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setAffiche(cible);
            return;
        }

        const depart = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

        const tick = (maintenant) => {
            const progres = Math.min((maintenant - depart) / duree, 1);
            setAffiche(Math.round(cible * ease(progres)));
            if (progres < 1) refAnim.current = requestAnimationFrame(tick);
        };

        refAnim.current = requestAnimationFrame(tick);

        // Filet de sécurité : certains navigateurs suspendent requestAnimationFrame
        // quand l'onglet passe en arrière-plan ; la valeur finale doit tout de même
        // s'afficher (sinon le KPI reste bloqué à 0).
        const secours = setTimeout(() => setAffiche(cible), duree + 150);

        return () => {
            cancelAnimationFrame(refAnim.current);
            clearTimeout(secours);
        };
    }, [valeur, duree]);

    return affiche;
}
