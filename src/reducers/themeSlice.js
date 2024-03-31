import { createSlice } from '@reduxjs/toolkit';
import ThemeService from '../services/ThemeService';
// Define an array of theme modes you want to support
const themes = ['light', 'dark', 'altTheme', 'professional', 'memphis', 'startup', 'sunset', 'mint', 'retro_neon', 'high_contrast'];

const initialState = {
    mode: themes[0],
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

export default themeSlice.reducer;