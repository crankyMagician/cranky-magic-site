// src/services/ThemeService.js
class ThemeService {
    static themeKey = 'appTheme';
    static themePrefsKey = 'themePreferences';

    // Available themes
    static availableThemes = [
        'light', 'dark', 'munchie', 'munchie_dark', 'professional',
        'startup', 'memphis', 'altTheme', 'sunset', 'mint',
        'retro_neon', 'high_contrast'
    ];

    // Set the main theme
    static setTheme(theme) {
        if (this.availableThemes.includes(theme)) {
            localStorage.setItem(this.themeKey, theme);
            console.log(`Theme set to: ${theme}`);
        } else {
            console.warn(`Invalid theme: ${theme}. Using default light theme.`);
            localStorage.setItem(this.themeKey, 'light');
        }
    }

    // Get the current theme
    static getTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        // Verify the saved theme is valid
        if (savedTheme && this.availableThemes.includes(savedTheme)) {
            return savedTheme;
        }
        return 'light'; // Default to light theme
    }

    // Check if theme is dark mode
    static isDarkMode() {
        const theme = this.getTheme();
        return theme === 'dark' || theme === 'munchie_dark' || theme === 'retro_neon';
    }

    // Toggle between light and dark modes (only for same theme family)
    static toggleDarkMode() {
        const currentTheme = this.getTheme();
        let newTheme;

        // Match themes with their dark counterparts
        switch(currentTheme) {
            case 'light':
                newTheme = 'dark';
                break;
            case 'dark':
                newTheme = 'light';
                break;
            case 'munchie':
                newTheme = 'munchie_dark';
                break;
            case 'munchie_dark':
                newTheme = 'munchie';
                break;
            default:
                // For other themes, just toggle to light/dark spatial theme
                newTheme = this.isDarkMode() ? 'light' : 'dark';
        }

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

    // Get theme icon based on theme name
    static getThemeIcon(themeName) {
        // This would be implemented if we were using theme icons outside of the ThemeToggle component
        return null;
    }

    // Get theme display name
    static getThemeDisplayName(themeName) {
        const names = {
            'light': 'Light',
            'dark': 'Dark',
            'munchie': 'Munchie',
            'munchie_dark': 'Munchie Dark',
            'professional': 'Professional',
            'startup': 'Startup',
            'memphis': 'Corporate Memphis',
            'altTheme': 'Alternative',
            'sunset': 'Sunset',
            'mint': 'Mint',
            'retro_neon': 'Retro Neon',
            'high_contrast': 'High Contrast'
        };

        return names[themeName] || 'Unknown Theme';
    }
}

export default ThemeService;