// src/reducers/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import ThemeService from '../services/ThemeService';
import { getAvailableThemeIds } from '../themes/themeRegistry';
import { getAvailableComponentOverrideIds } from '../themes/muicomponents';
import { getAvailableTypographyIds } from '../themes/typography';

// Get available themes, overrides, and typographies from registries
const themes = getAvailableThemeIds();
const componentOverrides = getAvailableComponentOverrideIds();
const typographies = getAvailableTypographyIds();

// Get initial values from service
const initialTheme = ThemeService.getTheme();
const initialComponentOverride = ThemeService.getComponentOverride();
const initialTypography = ThemeService.getTypography();

const initialState = {
    mode: themes.includes(initialTheme) ? initialTheme : themes[0],
    componentOverride: componentOverrides.includes(initialComponentOverride) ? initialComponentOverride : componentOverrides[0],
    typography: typographies.includes(initialTypography) ? initialTypography : typographies[0],
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            // Find the current theme's index
            const currentThemeIndex = themes.indexOf(state.mode);
            // Calculate the index of the next theme
            const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
            // Set the mode to the next theme
            state.mode = themes[nextThemeIndex];
            ThemeService.setTheme(state.mode); // Save the theme when toggled
        },

        setTheme: (state, action) => {
            if (themes.includes(action.payload)) {
                state.mode = action.payload;
                ThemeService.setTheme(action.payload); // Save the theme when it's set
            }
        },

        toggleComponentOverride: (state) => {
            // Find the current component override's index
            const currentOverrideIndex = componentOverrides.indexOf(state.componentOverride);
            // Calculate the index of the next override
            const nextOverrideIndex = (currentOverrideIndex + 1) % componentOverrides.length;
            // Set the override to the next one
            state.componentOverride = componentOverrides[nextOverrideIndex];
            ThemeService.setComponentOverride(state.componentOverride); // Save the override when toggled
        },

        setComponentOverride: (state, action) => {
            if (componentOverrides.includes(action.payload)) {
                state.componentOverride = action.payload;
                ThemeService.setComponentOverride(action.payload); // Save the override when it's set
            }
        },

        toggleTypography: (state) => {
            // Find the current typography's index
            const currentTypographyIndex = typographies.indexOf(state.typography);
            // Calculate the index of the next typography
            const nextTypographyIndex = (currentTypographyIndex + 1) % typographies.length;
            // Set the typography to the next one
            state.typography = typographies[nextTypographyIndex];
            ThemeService.setTypography(state.typography); // Save the typography when toggled
        },

        setTypography: (state, action) => {
            if (typographies.includes(action.payload)) {
                state.typography = action.payload;
                ThemeService.setTypography(action.payload); // Save the typography when it's set
            }
        },
    },
});

export const {
    toggleTheme,
    setTheme,
    toggleComponentOverride,
    setComponentOverride,
    toggleTypography,
    setTypography
} = themeSlice.actions;

// Selectors to get available options
export const selectAvailableThemes = () => themes;
export const selectAvailableComponentOverrides = () => componentOverrides;
export const selectAvailableTypographies = () => typographies;

// Selectors for current values
export const selectCurrentTheme = (state) => state.theme.mode;
export const selectCurrentComponentOverride = (state) => state.theme.componentOverride;
export const selectCurrentTypography = (state) => state.theme.typography;

export default themeSlice.reducer;