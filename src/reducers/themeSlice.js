// src/reducers/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import ThemeService from '../services/ThemeService';
import AnimationService from '../services/AnimationService';
import { getAvailableThemeIds } from '../themes/themeRegistry';
import { getAvailableComponentOverrideIds } from '../themes/muicomponents';
import { getAvailableTypographyIds } from '../themes/typography';
import { getAvailableAnimationIds } from '../themes/animations';
import { normalizeComponentSettings, DEFAULT_COMPONENT_SETTINGS } from '../themes/generatedOverrides';

// Get available options from registries
const themes = getAvailableThemeIds();
const componentOverrides = getAvailableComponentOverrideIds();
const typographies = getAvailableTypographyIds();
const animations = getAvailableAnimationIds();

// Get initial values from services
const initialTheme = ThemeService.getTheme();
const initialComponentOverride = ThemeService.getComponentOverride();
const initialTypography = ThemeService.getTypography();
const initialAnimation = AnimationService.getAnimation();

const CUSTOM = ThemeService.CUSTOM_THEME_ID;
const storedBrand = ThemeService.getCustomBrand();

const initialState = {
    customBrand: storedBrand,
    brandMode: ThemeService.getBrandMode(),
    componentSettings: normalizeComponentSettings(ThemeService.getComponentSettings()),
    mode: initialTheme === CUSTOM && storedBrand
        ? CUSTOM
        : themes.includes(initialTheme) ? initialTheme : themes[0],
    componentOverride: componentOverrides.includes(initialComponentOverride) ? initialComponentOverride : componentOverrides[0],
    typography: typographies.includes(initialTypography) ? initialTypography : typographies[0],
    animation: animations.includes(initialAnimation) || initialAnimation === 'none' ? initialAnimation : 'magical',
    animationSpeed: AnimationService.getAnimationSpeed() || 1,
    reducedMotion: AnimationService.getReducedMotion() || false,
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            const currentThemeIndex = themes.indexOf(state.mode);
            const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
            state.mode = themes[nextThemeIndex];
            ThemeService.setTheme(state.mode);
        },

        setTheme: (state, action) => {
            const isCustom = action.payload === CUSTOM && state.customBrand;
            if (themes.includes(action.payload) || isCustom) {
                state.mode = action.payload;
                ThemeService.setTheme(action.payload);
            }
        },

        // Custom brand editing
        setCustomBrand: (state, action) => {
            state.customBrand = action.payload;
            ThemeService.setCustomBrand(action.payload);
            if (action.payload) {
                state.mode = CUSTOM;
                ThemeService.setTheme(CUSTOM);
            }
        },

        updateBrandField: (state, action) => {
            const { path, value } = action.payload;
            if (!state.customBrand || !Array.isArray(path) || !path.length) return;

            let node = state.customBrand;
            for (let i = 0; i < path.length - 1; i += 1) {
                if (!node[path[i]] || typeof node[path[i]] !== 'object') node[path[i]] = {};
                node = node[path[i]];
            }
            node[path[path.length - 1]] = value;
            ThemeService.setCustomBrand(state.customBrand);
        },

        setBrandMode: (state, action) => {
            const next = action.payload === 'dark' ? 'dark' : 'light';
            state.brandMode = next;
            ThemeService.setBrandMode(next);
        },

        resetCustomBrand: (state) => {
            state.customBrand = null;
            ThemeService.setCustomBrand(null);
            if (state.mode === CUSTOM) {
                state.mode = themes[0];
                ThemeService.setTheme(themes[0]);
            }
        },

        // Component knobs. The path form matches updateBrandField so the editor can drive
        // both with one helper.
        updateComponentSetting: (state, action) => {
            const { path, value } = action.payload;
            if (!Array.isArray(path) || !path.length) return;

            let node = state.componentSettings;
            for (let i = 0; i < path.length - 1; i += 1) {
                if (!node[path[i]] || typeof node[path[i]] !== 'object') node[path[i]] = {};
                node = node[path[i]];
            }
            node[path[path.length - 1]] = value;
            ThemeService.setComponentSettings(state.componentSettings);
        },

        setComponentSettings: (state, action) => {
            state.componentSettings = normalizeComponentSettings(action.payload);
            ThemeService.setComponentSettings(state.componentSettings);
        },

        resetComponentSettings: (state) => {
            state.componentSettings = normalizeComponentSettings(DEFAULT_COMPONENT_SETTINGS);
            ThemeService.setComponentSettings(state.componentSettings);
        },

        toggleComponentOverride: (state) => {
            const currentOverrideIndex = componentOverrides.indexOf(state.componentOverride);
            const nextOverrideIndex = (currentOverrideIndex + 1) % componentOverrides.length;
            state.componentOverride = componentOverrides[nextOverrideIndex];
            ThemeService.setComponentOverride(state.componentOverride);
        },

        setComponentOverride: (state, action) => {
            if (componentOverrides.includes(action.payload)) {
                state.componentOverride = action.payload;
                ThemeService.setComponentOverride(action.payload);
            }
        },

        toggleTypography: (state) => {
            const currentTypographyIndex = typographies.indexOf(state.typography);
            const nextTypographyIndex = (currentTypographyIndex + 1) % typographies.length;
            state.typography = typographies[nextTypographyIndex];
            ThemeService.setTypography(state.typography);
        },

        setTypography: (state, action) => {
            if (typographies.includes(action.payload)) {
                state.typography = action.payload;
                ThemeService.setTypography(action.payload);
            }
        },

        // Animation actions
        setAnimation: (state, action) => {
            if (animations.includes(action.payload) || action.payload === 'none') {
                state.animation = action.payload;
                AnimationService.setAnimation(action.payload);
            }
        },

        toggleAnimation: (state) => {
            if (state.animation === 'none') {
                state.animation = animations[0];
            } else {
                const currentIndex = animations.indexOf(state.animation);
                const nextIndex = (currentIndex + 1) % animations.length;
                state.animation = animations[nextIndex];
            }
            AnimationService.setAnimation(state.animation);
        },

        disableAnimations: (state) => {
            state.animation = 'none';
            AnimationService.setAnimation('none');
        },

        enableAnimations: (state) => {
            state.animation = 'magical';
            AnimationService.setAnimation('magical');
        },

        setAnimationSpeed: (state, action) => {
            const speed = Math.max(0.1, Math.min(3, action.payload));
            state.animationSpeed = speed;
            AnimationService.setAnimationSpeed(speed);
        },

        toggleReducedMotion: (state) => {
            state.reducedMotion = !state.reducedMotion;
            AnimationService.setReducedMotion(state.reducedMotion);
        },

        // Reset all theme settings
        resetThemeSettings: (state) => {
            state.mode = themes[0];
            state.componentOverride = componentOverrides[0];
            state.typography = typographies[0];
            state.animation = 'magical';
            state.animationSpeed = 1;
            state.reducedMotion = false;
            state.componentSettings = normalizeComponentSettings(DEFAULT_COMPONENT_SETTINGS);

            ThemeService.setComponentSettings(state.componentSettings);
            ThemeService.setTheme(state.mode);
            ThemeService.setComponentOverride(state.componentOverride);
            ThemeService.setTypography(state.typography);
            AnimationService.setAnimation(state.animation);
            AnimationService.setAnimationSpeed(1);
            AnimationService.setReducedMotion(false);
        },
    },
});

export const {
    toggleTheme,
    setTheme,
    toggleComponentOverride,
    setComponentOverride,
    toggleTypography,
    setTypography,
    setAnimation,
    toggleAnimation,
    disableAnimations,
    enableAnimations,
    setAnimationSpeed,
    toggleReducedMotion,
    resetThemeSettings,
    setCustomBrand,
    updateBrandField,
    setBrandMode,
    resetCustomBrand,
    updateComponentSetting,
    setComponentSettings,
    resetComponentSettings,
} = themeSlice.actions;

// Selectors
export const selectCurrentTheme = (state) => state.theme.mode;
export const selectCurrentComponentOverride = (state) => state.theme.componentOverride;
export const selectCurrentTypography = (state) => state.theme.typography;
export const selectCurrentAnimation = (state) => state.theme.animation;
export const selectAnimationSpeed = (state) => state.theme.animationSpeed;
export const selectReducedMotion = (state) => state.theme.reducedMotion;
export const selectIsAnimated = (state) => state.theme.animation !== 'none' && !state.theme.reducedMotion;
export const selectComponentSettings = (state) => state.theme.componentSettings;
export const selectCustomBrand = (state) => state.theme.customBrand;
export const selectBrandMode = (state) => state.theme.brandMode;
export const selectAvailableThemes = () => themes;
export const selectAvailableComponentOverrides = () => componentOverrides;
export const selectAvailableTypographies = () => typographies;
export const selectAvailableAnimations = () => [...animations, 'none'];

export default themeSlice.reducer;