import {baseColors} from "../colors";

export const altThemePalette = {
    mode: 'light',
    primary: {
        main: baseColors.orange.base, // A vibrant, attention-grabbing color for primary actions
        light: baseColors.orange.base, // Keeping it consistent for simplicity
        dark: baseColors.orange.base, // Ensuring visibility and focus
        contrastText: baseColors.white, // For clear readability against the vibrant primary color
    },
    secondary: {
        main: baseColors.yellow, // Bright and cheerful for secondary accents
        light: baseColors.yellow, // Consistent color for a harmonious look
        dark: baseColors.yellow, // Maintains the theme's energy
    },
    error: {
        main: baseColors.red.base, // Strong and alerting for error states
    },
    warning: {
        main: baseColors.grey.base, // A softer warning, using grey to differentiate from the usual orange
        light: baseColors.grey.base, // Simplified approach for consistency
        dark: baseColors.grey.base, // Subdued to keep the focus on primary and secondary colors
    },
    info: {
        main: baseColors.blue.base, // Trustworthy and calm for informational cues
        light: baseColors.blue.base, // Consistent for a sleek look
        dark: baseColors.blue.base, // Ensures information stands out
    },
    success: {
        main: baseColors.green.base, // Lively and positive for successful actions
    },
    background: {
        default: baseColors.grey.dark, // A dark, subtle background for content to pop
        paper: baseColors.grey.base, // Lighter than default for layered design
    },
    text: {
        primary: baseColors.white, // Bright on dark backgrounds for readability
        secondary: baseColors.grey.light, // Soft contrast for less critical text
    },
    tertiary: {
        main: baseColors.red.base, // Adds a punchy accent for attention-drawing elements
    },
    action: {
        active: baseColors.orange.dark, // Giving a distinct look for active states
        hover: baseColors.yellow,
        hoverOpacity: 0.08, // Maintaining the standard for hover states
        selected: baseColors.orange.light,
        selectedOpacity: 0.14, // Slightly vibrant for selected states
        disabled: baseColors.orange.base,
        disabledBackground: baseColors.yellow,
        disabledOpacity: 0.38, // Clearly indicating disabled states with a softer color
        focus: baseColors.orange.dark,
        focusOpacity: 0.12, // Ensuring focus is noticeable
        activatedOpacity: 0.12, // Consistent with the focus state for activated elements
    },


};