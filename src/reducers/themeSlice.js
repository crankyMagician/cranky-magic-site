// src/reducers/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import ThemeService from '../services/ThemeService';
import AnimationService from '../services/AnimationService';
import { getAvailableThemeIds } from '../themes/themeRegistry';
import { getAvailableComponentOverrideIds } from '../themes/muicomponents';
import { getAvailableTypographyIds } from '../themes/typography';
import { getAvailableAnimationIds } from '../themes/animations';

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

const initialState = {
    mode: themes.includes(initialTheme) ? initialTheme : themes[0],
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
            if (themes.includes(action.payload)) {
                state.mode = action.payload;
                ThemeService.setTheme(action.payload);
            }
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
} = themeSlice.actions;

// Selectors
export const selectCurrentTheme = (state) => state.theme.mode;
export const selectCurrentComponentOverride = (state) => state.theme.componentOverride;
export const selectCurrentTypography = (state) => state.theme.typography;
export const selectCurrentAnimation = (state) => state.theme.animation;
export const selectAnimationSpeed = (state) => state.theme.animationSpeed;
export const selectReducedMotion = (state) => state.theme.reducedMotion;
export const selectIsAnimated = (state) => state.theme.animation !== 'none' && !state.theme.reducedMotion;
export const selectAvailableThemes = () => themes;
export const selectAvailableComponentOverrides = () => componentOverrides;
export const selectAvailableTypographies = () => typographies;
export const selectAvailableAnimations = () => [...animations, 'none'];

export default themeSlice.reducer;