import {baseColors} from "../colors";

export const professionalModernPalette = {
    mode: 'light',
    primary: {
        main: baseColors.grey.base, // A neutral, versatile color for primary actions
        light: baseColors.grey.light, // Provides a soft, accessible contrast
        dark: baseColors.grey.dark, // Ensures sufficient contrast and visibility
        contrastText: baseColors.black, // For optimal readability against the neutral primary color
    },
    secondary: {
        main: baseColors.blue.base, // Calm and professional for secondary accents
        light: baseColors.blue.light, // Slightly lighter to enhance usability
        dark: baseColors.blue.dark, // Deep and serious for focused attention
    },
    error: {
        main: baseColors.red.base, // Clear and alerting for critical feedback
    },
    warning: {
        main: baseColors.orange.base, // Warm and cautionary for warnings
        light: baseColors.orange.light, // Softened to be noticeable without alarming
        dark: baseColors.orange.dark, // Strong and serious for emphasis
    },
    info: {
        main: baseColors.blue.dark, // Trusted and stable for informational cues
        light: baseColors.blue.base, // Ensures information is approachable
        dark: baseColors.blue.light, // Stands out against various backgrounds
    },
    success: {
        main: baseColors.green.dark, // Rich and affirmative for successful actions
    },
    background: {
        default: baseColors.white, // Clean and bright for clarity and focus
        paper: baseColors.grey.light, // Slightly off-white for depth and distinction
    },
    text: {
        primary: baseColors.black, // Strong and legible for core text
        secondary: baseColors.grey.dark, // Subdued for secondary information
    },
    tertiary: {
        main: baseColors.orange.dark, // Distinct and vibrant for additional accents
    },
    action: {
        active: baseColors.grey.dark, // Distinguished and clear for active states
        hover: baseColors.grey.light, // Lightly highlighted for interactivity
        hoverOpacity: 0.08, // Maintaining standard opacity for hover states
        selected: baseColors.grey.base, // Neutral for selected items, ensuring focus
        selectedOpacity: 0.14, // Clear but unobtrusive selection state
        disabled: baseColors.grey.light, // Visibly disabled but integrated into the theme
        disabledBackground: baseColors.grey.base, // Consistent with the theme, ensuring accessibility
        disabledOpacity: 0.38, // Clearly indicating disabled states while maintaining design
        focus: baseColors.grey.dark, // Focused elements are highlighted for accessibility
        focusOpacity: 0.12, // Visibility without distraction
        activatedOpacity: 0.12, // Consistency in interaction states
    },
};