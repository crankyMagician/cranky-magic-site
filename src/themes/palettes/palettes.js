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


export const paletteDarkMode = {
    mode: 'dark',
    primary: {
        main: baseColors.blue.base,
        light: baseColors.blue.base,
        dark: baseColors.blue.base,
        contrastText: baseColors.white,
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
        default: baseColors.black,
        paper: baseColors.black,
    },
    text: {
        primary: baseColors.white,
        secondary: baseColors.grey.base,
    },
    tertiary: {
        main: baseColors.yellow,
    },
    action: {
        active: baseColors.grey.base, // Adjusted to be more visible against dark backgrounds
        hover: baseColors.grey.dark,
        hoverOpacity: 0.08, // Keeping standard opacity
        selected: baseColors.grey.light,
        selectedOpacity: 0.14, // Consistent with light mode for selected state
        disabled: baseColors.grey.dark,
        disabledBackground: baseColors.grey.base,
        disabledOpacity: 0.38, // Ensuring disabled state is clearly indicated
        focus: baseColors.grey.light,
        focusOpacity: 0.12, // Focus should be clearly distinguishable
        activatedOpacity: 0.12, // Keeping consistency with focus state
    },


};

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
export const techStartupInnovationPalette = {
    mode: 'light',
    primary: {
        main: '#6200EA', // A vibrant purple for innovation and creativity
        light: '#9C47FF', // Lighter purple for a playful, yet techy vibe
        dark: '#3700B3', // Dark purple for depth and seriousness
        contrastText: '#FFFFFF', // White text for clarity and contrast
    },
    secondary: {
        main: '#03DAC6', // A tech-inspired teal for secondary accents
        light: '#70EFDE', // Light teal for a fresh, modern look
        dark: '#018786', // Dark teal for contrast and visibility
    },
    error: {
        main: '#B00020', // A strong red for alerts and warnings
    },
    warning: {
        main: '#FFC107', // Amber for warnings, maintaining an energetic theme
        light: '#FFD54F', // Light amber for a softer warning
        dark: '#FFA000', // Dark amber for a more serious tone
    },
    info: {
        main: '#2196F3', // Bright blue for information and trust
        light: '#64B5F6', // Light blue for clarity and calmness
        dark: '#1976D2', // Dark blue for strength and reliability
    },
    success: {
        main: '#4CAF50', // A confident green for success messages
        light: '#81C784', // Light green for a more gentle indication of success
        dark: '#388E3C', // Dark green for more subdued success alerts
    },
    background: {
        default: '#FFFFFF', // Clean white for a fresh, open canvas
        paper: '#F5F5F5', // Off-white for subtle contrast and depth
    },
    text: {
        primary: '#212121', // Deep gray for primary text, ensuring readability
        secondary: '#757575', // Lighter gray for secondary text or less important information
    },
    tertiary: {
        main: '#FF9800', // A bold orange for standout features or calls to action
    },
    action: {
        active: '#6200EA', // Vibrant purple for active states
        hover: '#3700B3', // Dark purple for hover states, adding depth
        hoverOpacity: 0.08, // Opacity for hover states
        selected: '#9C47FF', // Lighter purple for selected items, adding visibility
        selectedOpacity: 0.14, // Opacity for selected states
        disabled: '#757575', // Gray for disabled states, ensuring readability
        disabledBackground: '#E0E0E0', // Light gray for disabled backgrounds, maintaining UI consistency
        disabledOpacity: 0.38, // Opacity for disabled states, clearly indicating non-interactive elements
        focus: '#3700B3', // Dark purple for focus states, ensuring accessibility
        focusOpacity: 0.12, // Opacity for focus states
        activatedOpacity: 0.12, // Opacity for activated states
    },
};
