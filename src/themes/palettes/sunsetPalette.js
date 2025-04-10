export const sunsetPalette = {
    mode: 'light',
    primary: {
        main: '#FF8A65', // Sunset Orange
        light: '#FFBB93', // Light Sunset Orange
        dark: '#C75B39', // Dark Sunset Orange
        contrastText: '#FFFFFF', // White for contrast
    },
    secondary: {
        main: '#FBC02D', // Sunset Yellow
        light: '#FFF263', // Light Sunset Yellow
        dark: '#C49000', // Dark Sunset Yellow
    },
    error: {
        main: '#D32F2F', // Red, similar to light mode for consistency
    },
    warning: {
        main: '#FFA726', // Orange, slightly adjusted for sunset theme
        light: '#FFD95B', // Light Orange
        dark: '#C77800', // Dark Orange
    },
    info: {
        main: '#29B6F6', // Light Blue, to contrast the warm colors
        light: '#73E8FF', // Lighter Blue
        dark: '#0086C3', // Darker Blue
    },
    success: {
        main: '#66BB6A', // Green, similar to light mode for consistency
    },
    background: {
        default: '#FFFDE7', // Light yellow, to mimic a sunset sky
        paper: '#FFECB3', // Lighter yellow, for paper elements
    },
    text: {
        primary: '#4E342E', // Dark Brown, for readability on light backgrounds
        secondary: '#6D4C41', // Medium Brown, for secondary text
    },
    tertiary: {
        main: '#FFD740', // Amber, to complement the sunset theme
    },
    action: {
        active: '#6D4C41', // Medium Brown, adjusted for visibility
        hover: '#FFE082', // Very light yellow, for hover states
        hoverOpacity: 0.08, // Standard opacity for hover states
        selected: '#FFCC80', // Selected state has a soft orange
        selectedOpacity: 0.14, // Slightly higher opacity for selected states
        disabled: '#BCAAA4', // Grey-brown, for disabled state
        disabledBackground: '#EDE7F6', // Very light purple, for disabled background
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: '#8D6E63', // Warm Brown, for focus states
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Similar to focus for consistency
    },
};
