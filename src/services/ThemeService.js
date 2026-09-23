// src/services/ThemeService.js
import { getAvailableThemeIds, validateThemeId, isDarkTheme, getThemeById } from '../themes/themeRegistry';
import { getAvailableComponentOverrideIds, validateComponentOverrideId, getComponentOverrideById } from '../themes/muicomponents';
import { getAvailableTypographyIds, validateTypographyId, getTypographyById } from '../themes/typography';

class ThemeService {
    static themeKey = 'appTheme';
    static componentOverrideKey = 'componentOverride';
    static typographyKey = 'typography';
    static themePrefsKey = 'themePreferences';
    static customBrandKey = 'customBrand';
    static brandModeKey = 'brandMode';
    static componentSettingsKey = 'componentSettings';
    static savedPalettesKey = 'savedPalettes';

    // Sentinel theme id meaning "render the user's custom brand, not a registry preset"
    static CUSTOM_THEME_ID = 'custom';

    // Available options from registries
    static get availableThemes() {
        return getAvailableThemeIds();
    }

    static get availableComponentOverrides() {
        return getAvailableComponentOverrideIds();
    }

    static get availableTypographies() {
        return getAvailableTypographyIds();
    }

    // Theme management
    static setTheme(theme) {
        if (theme === this.CUSTOM_THEME_ID || validateThemeId(theme)) {
            localStorage.setItem(this.themeKey, theme);
            return;
        }
        // Decline the write rather than clobbering whatever is already stored.
        console.warn(`Invalid theme: ${theme}. Keeping the existing stored theme.`);
    }

    static getTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme === this.CUSTOM_THEME_ID || (savedTheme && validateThemeId(savedTheme))) {
            return savedTheme;
        }
        return 'professional_dark'; // Default to professional dark theme
    }

    // Custom brand (full ringle-shaped object). Reads never throw on corrupt storage.
    static setCustomBrand(brand) {
        try {
            if (brand === null) {
                localStorage.removeItem(this.customBrandKey);
            } else {
                localStorage.setItem(this.customBrandKey, JSON.stringify(brand));
            }
        } catch (e) {
            console.warn('Could not persist custom brand:', e.message);
        }
    }

    static getCustomBrand() {
        try {
            const raw = localStorage.getItem(this.customBrandKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : null;
        } catch (e) {
            return null;
        }
    }

    // Named palettes the visitor has saved. Always an array, even if storage is corrupt.
    static setSavedPalettes(list) {
        try {
            localStorage.setItem(this.savedPalettesKey, JSON.stringify(Array.isArray(list) ? list : []));
        } catch (e) {
            console.warn('Could not persist saved palettes:', e.message);
        }
    }

    static getSavedPalettes() {
        try {
            const raw = localStorage.getItem(this.savedPalettesKey);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter((p) => p && typeof p === 'object' && p.id && p.brand);
        } catch (e) {
            return [];
        }
    }

    // Component knobs (radius, density, elevation, transitions) edited in the studio.
    static setComponentSettings(settings) {
        try {
            if (settings === null) {
                localStorage.removeItem(this.componentSettingsKey);
            } else {
                localStorage.setItem(this.componentSettingsKey, JSON.stringify(settings));
            }
        } catch (e) {
            console.warn('Could not persist component settings:', e.message);
        }
    }

    static getComponentSettings() {
        try {
            const raw = localStorage.getItem(this.componentSettingsKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : null;
        } catch (e) {
            return null;
        }
    }

    static setBrandMode(mode) {
        localStorage.setItem(this.brandModeKey, mode === 'dark' ? 'dark' : 'light');
    }

    static getBrandMode() {
        return localStorage.getItem(this.brandModeKey) === 'dark' ? 'dark' : 'light';
    }

    static getAvailableThemes() {
        return this.availableThemes;
    }

    static validateTheme(themeId) {
        return validateThemeId(themeId);
    }

    // Component override management
    static setComponentOverride(overrideId) {
        console.log(`ThemeService.setComponentOverride called with: ${overrideId}`);
        if (validateComponentOverrideId(overrideId)) {
            localStorage.setItem(this.componentOverrideKey, overrideId);
            console.log(`Component override set to: ${overrideId}`);
        } else {
            console.warn(`Invalid component override: ${overrideId}. Available overrides:`, this.availableComponentOverrides);
            console.warn(`Using default clean override.`);
            localStorage.setItem(this.componentOverrideKey, 'clean');
        }
    }

    static getComponentOverride() {
        const savedOverride = localStorage.getItem(this.componentOverrideKey);
        console.log(`ThemeService.getComponentOverride - savedOverride: ${savedOverride}`);
        if (savedOverride && validateComponentOverrideId(savedOverride)) {
            return savedOverride;
        }
        console.log(`ThemeService.getComponentOverride - returning default: clean`);
        return 'clean'; // Default to clean component override
    }

    static getAvailableComponentOverrides() {
        return this.availableComponentOverrides;
    }

    static validateComponentOverride(overrideId) {
        return validateComponentOverrideId(overrideId);
    }

    // Typography management
    static setTypography(typographyId) {
        console.log(`ThemeService.setTypography called with: ${typographyId}`);
        if (validateTypographyId(typographyId)) {
            localStorage.setItem(this.typographyKey, typographyId);
            console.log(`Typography set to: ${typographyId}`);
        } else {
            console.warn(`Invalid typography: ${typographyId}. Available typographies:`, this.availableTypographies);
            console.warn(`Using default professional typography.`);
            localStorage.setItem(this.typographyKey, 'professional');
        }
    }

    static getTypography() {
        const savedTypography = localStorage.getItem(this.typographyKey);
        console.log(`ThemeService.getTypography - savedTypography: ${savedTypography}`);
        if (savedTypography && validateTypographyId(savedTypography)) {
            return savedTypography;
        }
        console.log(`ThemeService.getTypography - returning default: professional`);
        return 'professional'; // Default to professional typography
    }

    static getAvailableTypographies() {
        return this.availableTypographies;
    }

    static validateTypography(typographyId) {
        return validateTypographyId(typographyId);
    }

    // Utility methods for checking theme properties
    static isDarkMode() {
        const currentTheme = this.getTheme();
        return isDarkTheme(currentTheme);
    }

    static isLightMode() {
        return !this.isDarkMode();
    }

    // Toggle between light and dark themes
    static toggleThemeMode() {
        const currentTheme = this.getTheme();
        let newTheme;

        if (this.isDarkMode()) {
            // Switch to a light theme
            if (currentTheme === 'cranky_dark') {
                newTheme = 'cranky_light';
            } else if (currentTheme === 'munchie_dark') {
                newTheme = 'munchie';
            } else if (currentTheme === 'professional_dark') {
                newTheme = 'professional';
            } else {
                newTheme = 'light';
            }
        } else {
            // Switch to a dark theme
            if (currentTheme === 'cranky_light') {
                newTheme = 'cranky_dark';
            } else if (currentTheme === 'munchie') {
                newTheme = 'munchie_dark';
            } else if (currentTheme === 'professional') {
                newTheme = 'professional_dark';
            } else {
                newTheme = 'dark';
            }
        }

        this.setTheme(newTheme);
        return newTheme;
    }

    // Theme preferences (existing + new)
    static setThemePreferences(preferences) {
        localStorage.setItem(this.themePrefsKey, JSON.stringify(preferences));
    }

    static getThemePreferences() {
        const prefsString = localStorage.getItem(this.themePrefsKey);
        return prefsString ? JSON.parse(prefsString) : {
            // Default preferences
            animationLevel: 'medium', // Options: 'none', 'low', 'medium', 'high'
            highContrast: false,
            reducedMotion: false,
            fontScale: 1.0, // Default font scale factor
            useScanlines: true,
            useGlowEffects: true,
        };
    }

    static updateThemePreference(key, value) {
        const currentPrefs = this.getThemePreferences();
        currentPrefs[key] = value;
        this.setThemePreferences(currentPrefs);
    }

    // Utility methods
    static getThemeInfo(themeId) {
        return getThemeById(themeId);
    }

    static getComponentOverrideInfo(overrideId) {
        return getComponentOverrideById(overrideId);
    }

    static getTypographyInfo(typographyId) {
        return getTypographyById(typographyId);
    }

    static getThemeIcon(themeName) {
        const themeInfo = this.getThemeInfo(themeName);
        return themeInfo ? themeInfo.icon : null;
    }

    static getThemeDisplayName(themeName) {
        const themeInfo = this.getThemeInfo(themeName);
        return themeInfo ? themeInfo.name : 'Unknown Theme';
    }

    // Debug method to check current state
    static getDebugInfo() {
        return {
            currentTheme: this.getTheme(),
            currentComponentOverride: this.getComponentOverride(),
            currentTypography: this.getTypography(),
            isDarkMode: this.isDarkMode(),
            availableThemes: this.availableThemes,
            availableComponentOverrides: this.availableComponentOverrides,
            availableTypographies: this.availableTypographies,
            preferences: this.getThemePreferences(),
            localStorageTheme: localStorage.getItem(this.themeKey),
            localStorageComponentOverride: localStorage.getItem(this.componentOverrideKey),
            localStorageTypography: localStorage.getItem(this.typographyKey),
            localStoragePrefs: localStorage.getItem(this.themePrefsKey)
        };
    }
}

export default ThemeService;