import {baseColors} from "../colors";

export const paletteLightMode = {
    mode: 'light',
    primary: {
        main: baseColors.blue.base,
        light: baseColors.blue.base,
        dark: baseColors.blue.base,
        contrastText: '#ffffff',
    },
    secondary: {
        main: baseColors.green.base,
        light: baseColors.green.base,
        dark: baseColors.green.base,
    },
    error: {
        main: baseColors.red.base,
    },
    warning: {
        main: baseColors.orange.base,
        light: baseColors.orange.base,
        dark: baseColors.orange.base,
    },
    info: {
        main: baseColors.grey.base,
        light: baseColors.grey.base,
        dark: baseColors.grey.base,
    },
    success: {
        main: baseColors.green.base,
    },
    background: {
        default: baseColors.white,
        paper: baseColors.grey.base,
    },
    text: {
        primary: baseColors.black,
        secondary: baseColors.grey.base,
    },
    tertiary: {
        main: baseColors.yellow,
    },
    action: {
        active: baseColors.grey.dark, // More visible in light mode
        hover: baseColors.grey.light,
        hoverOpacity: 0.08, // Standard opacity for hover states
        selected: baseColors.grey.base,
        selectedOpacity: 0.14, // Slightly higher opacity for selected states
        disabled: baseColors.grey.base,
        disabledBackground: baseColors.grey.light,
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: baseColors.grey.dark,
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Similar to focus for consistency
    },

};