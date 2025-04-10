export const highContrastPalette = {
    mode: 'light',
    primary: {
        main: '#000000', // Black for maximum contrast
        light: '#555555', // Dark Gray for lighter elements
        dark: '#000000', // Black, consistent for dark elements
        contrastText: '#FFFFFF', // White for contrast against dark
    },
    secondary: {
        main: '#FFFFFF', // White for secondary elements
        light: '#CCCCCC', // Light Gray for lighter secondary elements
        dark: '#555555', // Dark Gray for dark secondary elements
    },
    error: {
        main: '#FF0000', // Bright Red for errors
    },
    warning: {
        main: '#FFA500', // Orange for warnings
        light: '#FFC042', // Lighter Orange for lighter warnings
        dark: '#C07800', // Dark Orange for darker warnings
    },
    info: {
        main: '#0000FF', // Blue for information
        light: '#6B82E6', // Light Blue for lighter info
        dark: '#0044CC', // Dark Blue for darker info
    },
    success: {
        main: '#008000', // Green for success
    },
    background: {
        default: '#FFFFFF', // White for default background
        paper: '#F5F5F5', // Off-White for paper elements
    },
    text: {
        primary: '#000000', // Black for primary text for readability
        secondary: '#555555', // Dark Gray for secondary text
    },
    tertiary: {
        main: '#FFFF00', // Yellow for tertiary elements, ensuring visibility
    },
    action: {
        active: '#555555', // Dark Gray for active elements
        hover: '#EEEEEE', // Very light gray for hover states, for visibility
        hoverOpacity: 0.08, // Standard opacity for hover states
        selected: '#DDDDDD', // Light Gray for selected states, ensuring contrast
        selectedOpacity: 0.14, // Slightly higher opacity for selected states
        disabled: '#CCCCCC', // Light Gray for disabled state
        disabledBackground: '#E0E0E0', // Very light gray for disabled background
        disabledOpacity: 0.38, // Higher opacity for disabled state to ensure visibility
        focus: '#CCCCCC', // Light Gray for focus states, ensuring visibility
        focusOpacity: 0.12, // Standard focus opacity
        activatedOpacity: 0.12, // Similar to focus for consistency
    },
};
