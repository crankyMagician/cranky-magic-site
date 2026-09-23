// The theme-system palette keys that live outside ringle's brand.json schema.
//
// These used to be computed with no way to touch them. They are still computed by
// default, but every one of them can now be overridden by hand, which is what these
// tables drive: the editor renders from them and the export walks them.

export const TERTIARY_KEYS = ['main', 'light', 'dark', 'contrastText'];

export const GREY_KEYS = [
    '50', '100', '200', '300', '400', '500', '600', '700', '800', '900',
    'A100', 'A200', 'A400', 'A700',
];

export const ACTION_COLOR_KEYS = [
    'active', 'hover', 'selected', 'disabled', 'disabledBackground', 'focus',
];

export const ACTION_OPACITY_KEYS = [
    'hoverOpacity', 'selectedOpacity', 'disabledOpacity', 'focusOpacity', 'activatedOpacity',
];

// Every custom key a component pack reads. Values are CSS strings rather than plain
// hexes, because most are gradients or shadow stacks, so the editor gives them a text
// field with a preview rather than a colour input.
export const CUSTOM_KEYS = [
    'dataStream', 'glowEffect', 'hologram', 'overlay', 'glassMorphism', 'codeBackground',
    'gridLine', 'digitalPulse', 'matrixRain', 'scanline',
    'magicalGradient', 'purpleGlow', 'aurora', 'cardHoverShadow', 'nebula', 'glowText',
];

export const CUSTOM_LABELS = {
    dataStream: 'Vertical fade used behind data panels',
    glowEffect: 'Standard glow, read by the spatial and matrix packs',
    hologram: 'Diagonal primary to tertiary wash',
    overlay: 'Modal and drawer scrim',
    glassMorphism: 'Frosted surface fill',
    codeBackground: 'Code block fill',
    gridLine: 'Grid and rule lines',
    digitalPulse: 'Pulse accent',
    matrixRain: 'Falling character colour',
    scanline: 'Scanline overlay',
    magicalGradient: 'Wizard pack primary gradient',
    purpleGlow: 'Wizard pack secondary glow',
    aurora: 'Wizard pack banner wash',
    cardHoverShadow: 'Card shadow on hover',
    nebula: 'Wizard pack radial backdrop',
    glowText: 'Text shadow for glowing headings',
};

/** Which palette sections carry hand-overridable values, in editor order. */
export const PALETTE_SECTIONS = [
    { id: 'tertiary', name: 'Tertiary', kind: 'group', keys: TERTIARY_KEYS },
    { id: 'divider', name: 'Divider', kind: 'single' },
    { id: 'grey', name: 'Grey ramp', kind: 'group', keys: GREY_KEYS },
    { id: 'action', name: 'Action states', kind: 'action' },
    { id: 'custom', name: 'Effects', kind: 'css', keys: CUSTOM_KEYS },
];
