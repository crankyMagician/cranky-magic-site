// src/services/ThemeService.js
import { getAvailableThemeIds, validateThemeId, isDarkTheme, getThemeById } from '../themes/themeRegistry';
import { getAvailableComponentOverrideIds, validateComponentOverrideId, getComponentOverrideById } from '../themes/muicomponents';
import { getAvailableTypographyIds, validateTypographyId, getTypographyById } from '../themes/typography';

class ThemeService {
    static themeKey = 'appTheme';
    static componentOverrideKey = 'componentOverride';
    static typographyKey = 'typography';
    static themePrefsKey = 'themePreferences';

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
        console.log(`ThemeService.setTheme called with: ${theme}`);
        if (validateThemeId(theme)) {
            localStorage.setItem(this.themeKey, theme);
            console.log(`Theme set to: ${theme}`);
        } else {
            console.warn(`Invalid theme: ${theme}. Available themes:`, this.availableThemes);
            console.warn(`Using default cranky_dark theme.`);
            localStorage.setItem(this.themeKey, 'cranky_dark');
        }
    }

    static getTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        console.log(`ThemeService.getTheme - savedTheme: ${savedTheme}`);
        if (savedTheme && validateThemeId(savedTheme)) {
            return savedTheme;
        }
        console.log(`ThemeService.getTheme - returning default: cranky_dark`);
        return 'cranky_dark'; // Default to cranky_dark theme
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
            console.warn(`Using default wizard override.`);
            localStorage.setItem(this.componentOverrideKey, 'wizard');
        }
    }

    static getComponentOverride() {
        const savedOverride = localStorage.getItem(this.componentOverrideKey);
        console.log(`ThemeService.getComponentOverride - savedOverride: ${savedOverride}`);
        if (savedOverride && validateComponentOverrideId(savedOverride)) {
            return savedOverride;
        }
        console.log(`ThemeService.getComponentOverride - returning default: wizard`);
        return 'wizard'; // Default to wizard component override
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
            console.warn(`Using default cranky typography.`);
            localStorage.setItem(this.typographyKey, 'cranky');
        }
    }

    static getTypography() {
        const savedTypography = localStorage.getItem(this.typographyKey);
        console.log(`ThemeService.getTypography - savedTypography: ${savedTypography}`);
        if (savedTypography && validateTypographyId(savedTypography)) {
            return savedTypography;
        }
        console.log(`ThemeService.getTypography - returning default: cranky`);
        return 'cranky'; // Default to cranky typography
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
            } else {
                newTheme = 'light';
            }
        } else {
            // Switch to a dark theme
            if (currentTheme === 'cranky_light') {
                newTheme = 'cranky_dark';
            } else if (currentTheme === 'munchie') {
                newTheme = 'munchie_dark';
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