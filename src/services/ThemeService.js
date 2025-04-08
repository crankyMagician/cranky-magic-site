// src/services/ThemeService.js
class ThemeService {
    static themeKey = 'appTheme';
    static themePrefsKey = 'themePreferences';

    // Set the main theme
    static setTheme(theme) {
        localStorage.setItem(this.themeKey, theme);
        console.log(`Theme set to: ${theme}`);
    }

    // Get the current theme
    static getTheme() {
        return localStorage.getItem(this.themeKey) || 'light'; // Default to light theme
    }

    // Check if theme is dark mode
    static isDarkMode() {
        const theme = this.getTheme();
        return theme === 'dark';
    }

    // Toggle between light and dark modes
    static toggleDarkMode() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        return newTheme;
    }

    // Save additional theme preferences (animation level, contrast settings, etc.)
    static setThemePreferences(preferences) {
        localStorage.setItem(this.themePrefsKey, JSON.stringify(preferences));
    }

    // Get saved theme preferences
    static getThemePreferences() {
        const prefsString = localStorage.getItem(this.themePrefsKey);
        return prefsString ? JSON.parse(prefsString) : {
            // Default preferences
            animationLevel: 'medium', // Options: 'none', 'low', 'medium', 'high'
            highContrast: false,
            reducedMotion: false,
            fontScale: 1.0, // Default font scale factor
            useScanlines: true, // Matrix-style scanline effect
            useGlowEffects: true, // Glow effects around elements
        };
    }

    // Update a single theme preference without changing others
    static updateThemePreference(key, value) {
        const currentPrefs = this.getThemePreferences();
        currentPrefs[key] = value;
        this.setThemePreferences(currentPrefs);
    }
}

export default ThemeService;