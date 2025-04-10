import {baseColors} from "../colors";

export const corporateMemphisPalette = {
    mode: 'light',
    primary: {
        main: baseColors.blue.dark, // A confident, deep blue for primary actions
        light: baseColors.blue.base, // Brighter for a touch of Memphis vibrancy
        dark: baseColors.blue.dark, // Solid and dependable for corporate trust
        contrastText: baseColors.white, // Crisp and clear against the primary blue
    },
    secondary: {
        main: baseColors.orange.light, // Warm and inviting, yet vibrant for secondary accents
        light: baseColors.orange.base, // Cheerful for a lighter, engaging feel
        dark: baseColors.orange.dark, // Depth and warmth for emphasis
    },
    error: {
        main: baseColors.red.base, // Bold and alerting, in line with Memphis intensity
    },
    warning: {
        main: baseColors.yellow, // Bright and cautionary, with a playful edge
        light: baseColors.orange.light, // A softer approach to warnings
        dark: baseColors.orange.base, // A deeper shade for serious alerts
    },
    info: {
        main: baseColors.grey.dark, // Trustworthy yet subdued for information
        light: baseColors.grey.base, // A lighter shade for informational contrast
        dark: baseColors.grey.dark, // Ensures key info stands out in a corporate setting
    },
    success: {
        main: baseColors.green.light, // A lively, optimistic green for success
    },
    background: {
        default: baseColors.white, // A clean, neutral backdrop for clarity and focus
        paper: baseColors.grey.light, // Soft and subtle for differentiation without distraction
    },
    text: {
        primary: baseColors.black, // Strong and legible, anchoring the design in professionalism
        secondary: baseColors.grey.base, // A soft contrast for less dominant text, adds depth
    },
    tertiary: {
        main: baseColors.red.dark, // An assertive, dynamic color for standout elements
    },
    action: {
        active: baseColors.blue.base, // Clear and engaging for interactive elements
        hover: baseColors.grey.light, // Understated for hover, allowing color to signal action
        hoverOpacity: 0.08, // Subtle interaction cue, keeping with Memphis's playful spirit
        selected: baseColors.grey.base, // Neutral yet distinct for selected states
        selectedOpacity: 0.14, // Visibility without overwhelming the vibrant Memphis style
        disabled: baseColors.grey.light, // Blends into the corporate aesthetic while indicating non-interactivity
        disabledBackground: baseColors.grey.base, // Consistent, subdued for disabled states
        disabledOpacity: 0.38, // Clearly marked, maintaining usability
        focus: baseColors.blue.dark, // Focused elements stand out with deep blue for accessibility
        focusOpacity: 0.12, // Ensures focus is noticeable without dominating the design
        activatedOpacity: 0.12, // Consistent with focus for an integrated interactive experience
    },
};