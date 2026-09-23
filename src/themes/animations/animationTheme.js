// The bridge between the animation packs and anything that renders.
//
// Before this existed there was no path at all from the store to the theme: theme.js
// never imported the animations directory and `theme.animations` did not exist. This
// builds the object that App.js hangs on the theme as `theme.animation`.

import { getAnimationsById, validateAnimationId } from './index';

export const EASINGS = {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

// Names worth reaching for when something just needs to arrive on screen. The packs do
// not agree on a vocabulary, so the first one present wins.
const ENTRANCE_CANDIDATES = [
    'fadeIn', 'entrance', 'magicalEntrance', 'fadeInSparkle', 'elegantFadeIn',
    'reveal', 'bounceIn', 'scaleIn', 'slideIn', 'tada',
];

const HOVER_CANDIDATES = ['hover', 'pulse', 'magicalGlow', 'levitate', 'wiggle', 'shimmer'];

const firstPresent = (candidates, keyframes, names) => {
    const hit = candidates.find((name) => keyframes[name]);
    return hit || names[0] || null;
};

const clampSpeed = (speed) => {
    const n = Number(speed);
    return Number.isFinite(n) && n > 0 ? Math.max(0.1, Math.min(3, n)) : 1;
};

/**
 * Build the animation slice of the theme.
 *
 * `sx(name, options)` returns a style object ready to spread into an sx prop or a
 * styleOverrides slot. It always carries a reduced-motion guard, so a visitor whose OS
 * asks for less motion gets none even if the in-page toggle is off.
 */
export const buildAnimationTheme = (packId, speed, reducedMotion) => {
    const id = validateAnimationId(packId) ? packId : 'magical';
    const resolvedSpeed = clampSpeed(speed);
    const quiet = Boolean(reducedMotion) || id === 'none';

    let keyframes = {};
    try {
        keyframes = getAnimationsById(id) || {};
    } catch (e) {
        keyframes = {};
    }

    const names = Object.keys(keyframes).sort();

    const sx = (name, options = {}) => {
        if (quiet) return {};
        const frames = keyframes[name];
        if (!frames) return {};

        const {
            duration = 1,
            delay = 0,
            easing = EASINGS.easeOut,
            iterations = 1,
            fill = 'both',
        } = options;

        const seconds = Math.max(0.05, Number(duration) || 1) / resolvedSpeed;
        const count = iterations === 'infinite' ? 'infinite' : Math.max(1, Number(iterations) || 1);

        return {
            animation: `${frames} ${seconds.toFixed(3)}s ${easing} ${Number(delay) || 0}s ${count} ${fill}`,
            willChange: 'transform, opacity',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        };
    };

    return {
        id,
        speed: resolvedSpeed,
        reducedMotion: Boolean(reducedMotion),
        enabled: !quiet,
        keyframes,
        names,
        entrance: firstPresent(ENTRANCE_CANDIDATES, keyframes, names),
        hover: firstPresent(HOVER_CANDIDATES, keyframes, names),
        easings: EASINGS,
        sx,
    };
};

export default buildAnimationTheme;
