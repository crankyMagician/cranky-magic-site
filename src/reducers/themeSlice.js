import { createSlice } from '@reduxjs/toolkit';
import ThemeService from '../services/ThemeService';

// Define an array of theme modes you want to support
const themes = [
    'light',
    'dark',
    'munchie',
    'munchie_dark',
    'professional',
    'startup',
    'memphis',
    'altTheme',
    'sunset',
    'mint',
    'retro_neon',
    'high_contrast',
    //added for christopher
    'cs_color_27_v1',
    'cs_color_30_v2',
    'cs_color_23_v3',
    'cs_color_29_v4',
    'cs_color_31_v5'
];

// Get initial theme from service or default to first theme
const initialTheme = ThemeService.getTheme();
const initialState = {
    mode: themes.includes(initialTheme) ? initialTheme : themes[0],
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
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

// New selector to get the list of available themes
export const selectAvailableThemes = () => themes;

export default themeSlice.reducer;