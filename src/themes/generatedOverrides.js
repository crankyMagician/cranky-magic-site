// Component overrides generated from values the user edits, layered on top of whichever
// component pack is selected.
//
// Two layers are built here. The status layer turns ringle's `text` and `icon` keys into
// real Alert styling, which is what makes those fields change the page instead of only
// reaching the export. The settings layer applies the radius, weight, density and
// transition knobs from the Components section of the editor.

import { isHex, withAlpha } from './colorMath';
import { STATUS_GROUPS } from './siteBrandInfo';

export const DEFAULT_COMPONENT_SETTINGS = {
    shape: { borderRadius: 4 },
    button: {
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '0.02em',
        paddingX: 16,
        paddingY: 8,
    },
    surface: { cardRadius: 8, elevation: 'soft', borderWidth: 0 },
    transitions: { duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
};

export const ELEVATION_STYLES = ['none', 'soft', 'strong', 'glow'];
export const TEXT_TRANSFORMS = ['none', 'capitalize', 'uppercase'];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const num = (value, fallback) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

/** Fill in anything a stored or imported settings object is missing. */
export const normalizeComponentSettings = (settings) => {
    const d = DEFAULT_COMPONENT_SETTINGS;
    const s = settings && typeof settings === 'object' ? settings : {};
    return {
        shape: { borderRadius: num(s.shape?.borderRadius, d.shape.borderRadius) },
        button: {
            textTransform: TEXT_TRANSFORMS.includes(s.button?.textTransform)
                ? s.button.textTransform
                : d.button.textTransform,
            fontWeight: num(s.button?.fontWeight, d.button.fontWeight),
            letterSpacing: typeof s.button?.letterSpacing === 'string'
                ? s.button.letterSpacing
                : d.button.letterSpacing,
            paddingX: num(s.button?.paddingX, d.button.paddingX),
            paddingY: num(s.button?.paddingY, d.button.paddingY),
        },
        surface: {
            cardRadius: num(s.surface?.cardRadius, d.surface.cardRadius),
            elevation: ELEVATION_STYLES.includes(s.surface?.elevation)
                ? s.surface.elevation
                : d.surface.elevation,
            borderWidth: num(s.surface?.borderWidth, d.surface.borderWidth),
        },
        transitions: {
            duration: num(s.transitions?.duration, d.transitions.duration),
            easing: typeof s.transitions?.easing === 'string'
                ? s.transitions.easing
                : d.transitions.easing,
        },
    };
};

/**
 * Alert styling from the status groups' `text` and `icon`.
 *
 * The descendant selector is deliberate. Two packs (default and developer) already colour
 * the icon through `& .MuiAlert-icon`, which outranks the `icon` slot, so matching their
 * selector shape is what lets this layer win when it is appended after them.
 *
 * Filled alerts are left alone. They paint `main` as the background and `contrastText` as
 * the foreground, and forcing ringle's `text` on top of that produces unreadable blocks.
 */
export const buildStatusOverrides = (palette) => {
    try {
        const slots = {};

        STATUS_GROUPS.forEach((severity) => {
            const group = palette?.[severity];
            if (!group) return;

            const style = {};
            if (isHex(group.text)) style.color = group.text;
            if (isHex(group.icon)) style['& .MuiAlert-icon'] = { color: group.icon };
            if (!Object.keys(style).length) return;

            slots[`standard${cap(severity)}`] = style;
            slots[`outlined${cap(severity)}`] = style;
        });

        if (!Object.keys(slots).length) return {};

        const helper = {};
        if (isHex(palette?.error?.text)) {
            helper.MuiFormHelperText = {
                styleOverrides: { root: { '&.Mui-error': { color: palette.error.text } } },
            };
        }

        return { MuiAlert: { styleOverrides: slots }, ...helper };
    } catch (e) {
        return {};
    }
};

const shadowFor = (elevation, primary, textPrimary, isDark) => {
    switch (elevation) {
        case 'none':
            return 'none';
        case 'strong':
            return isDark
                ? '0 10px 28px rgba(0, 0, 0, 0.55)'
                : `0 10px 28px ${withAlpha(textPrimary, 0.22)}`;
        case 'glow':
            return `0 4px 14px ${withAlpha(primary, 0.35)}, 0 0 22px ${withAlpha(primary, 0.22)}`;
        case 'soft':
        default:
            return isDark
                ? '0 2px 8px rgba(0, 0, 0, 0.4)'
                : `0 2px 8px ${withAlpha(textPrimary, 0.12)}`;
    }
};

/** The editable component knobs, as a components object. */
export const buildSettingsOverrides = (settings, palette) => {
    try {
        const s = normalizeComponentSettings(settings);
        const primary = palette?.primary?.main || '#000000';
        const textPrimary = palette?.text?.primary || '#000000';
        const isDark = palette?.mode === 'dark';

        const transition = `all ${s.transitions.duration}ms ${s.transitions.easing}`;
        const shadow = shadowFor(s.surface.elevation, primary, textPrimary, isDark);
        const border = s.surface.borderWidth > 0
            ? `${s.surface.borderWidth}px solid ${withAlpha(textPrimary, isDark ? 0.24 : 0.16)}`
            : undefined;

        const surface = {
            borderRadius: `${s.surface.cardRadius}px`,
            ...(border ? { border } : {}),
        };

        return {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: `${s.shape.borderRadius}px`,
                        textTransform: s.button.textTransform,
                        fontWeight: s.button.fontWeight,
                        letterSpacing: s.button.letterSpacing,
                        padding: `${s.button.paddingY}px ${s.button.paddingX}px`,
                        transition,
                    },
                },
            },
            MuiCard: { styleOverrides: { root: { ...surface, boxShadow: shadow, transition } } },
            MuiPaper: { styleOverrides: { rounded: { borderRadius: `${s.surface.cardRadius}px` } } },
            MuiChip: { styleOverrides: { root: { borderRadius: `${s.shape.borderRadius}px` } } },
            MuiOutlinedInput: { styleOverrides: { root: { borderRadius: `${s.shape.borderRadius}px` } } },
            MuiToggleButton: { styleOverrides: { root: { borderRadius: `${s.shape.borderRadius}px`, textTransform: s.button.textTransform } } },
        };
    } catch (e) {
        return {};
    }
};

/**
 * Append a generated layer after a pack's layer.
 *
 * Slots compose as arrays because MUI's processStyleArg flat-maps them and resolves each
 * entry in order, so a pack slot that is a function still runs and the generated object
 * lands after it. A deep merge cannot do this: it only recurses into plain objects, so a
 * function slot would be dropped or would swallow the generated styles depending on
 * argument order.
 */
export const mergeComponentLayers = (packLayer, ...generatedLayers) => {
    const out = { ...(packLayer || {}) };

    generatedLayers.forEach((layer) => {
        Object.entries(layer || {}).forEach(([component, definition]) => {
            const previous = out[component];
            if (!previous) {
                out[component] = definition;
                return;
            }
            const slots = { ...(previous.styleOverrides || {}) };
            Object.entries(definition.styleOverrides || {}).forEach(([slot, style]) => {
                slots[slot] = slots[slot] === undefined ? style : [].concat(slots[slot], style);
            });
            out[component] = { ...previous, ...definition, styleOverrides: slots };
        });
    });

    return out;
};
