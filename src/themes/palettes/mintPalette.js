export const mintPalette = {
    mode: 'light',
    primary: {
        main: '#4DB6AC', // Mint Green
        light: '#82E9DE', // Light Mint Green
        dark: '#00867D', // Dark Mint Green
        contrastText: '#FFFFFF', // White for contrast
    },
    secondary: {
        main: '#80CBC4', // Soft Teal
        light: '#B2FEF7', // Light Teal
        dark: '#4F9A94', // Dark Teal
    },
    error: {
        main: '#EF5350', // Red, for consistency with light themes
    },
    warning: {
        main: '#FFB74D', // Light Orange, to add warmth
        light: '#FFD180', // Very Light Orange
        dark: '#FFA726', // Dark Orange
    },
    info: {
        main: '#4FC3F7', // Light Blue, for a refreshing contrast
        light: '#81D4FA', // Lighter Blue
        dark: '#039BE5', // Darker Blue
    },
    success: {
        main: '#81C784', // Soft Green, akin to light mode for consistency
    },
    background: {
        default: '#E0F2F1', // Very light mint, emulating a serene sky
        paper: '#B2DFDB', // Light Mint, for paper elements
    },
    text: {
        primary: '#37474F', // Dark Slate, for readability on light backgrounds
        secondary: '#607D8B', // Blue Grey, for secondary text
    },
    tertiary: {
        main: '#FFD740', // Amber, to complement the mint theme
    },
    action: {
        active: '#607D8B', // Blue Grey, adjusted for visibility
        hover: '#E0F7FA', // Very light blue, for hover states
        hoverOpacity: 0.08, // Standard opacity for hover states
        selected: '#B2EBF2', // Selected state has a soft blue
        selectedOpacity: 0.14, // Slightly higher opacity for selected states
        disabled: '#CFCFCF', // Grey, for disabled state
        disabledBackground: '#ECEFF1', // Very light grey, for disabled background
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: '#B0BEC5', // Cool Grey, for focus states
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Similar to focus for consistency
    },
};
