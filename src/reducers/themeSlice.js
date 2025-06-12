// src/reducers/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: 'light', // Default theme mode
    overrideStyle: 'cranky', // Default override style ('cranky' or 'spatial')
    themes: [
        'light', 'dark', 'munchie', 'munchie_dark', 'professional',
        'startup', 'memphis', 'altTheme', 'sunset', 'mint',
        'retro_neon', 'high_contrast', 'cranky_light', 'cranky_dark'
    ],
    preferences: {
        animationLevel: 'medium',
        highContrast: false,
        reducedMotion: false,
        fontScale: 1.0,
        useScanlines: true,
        useGlowEffects: true,
    }
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            if (state.themes.includes(action.payload)) {
                state.mode = action.payload;
            }
        },
        setOverrideStyle: (state, action) => {
            if (['cranky', 'spatial'].includes(action.payload)) {
                state.overrideStyle = action.payload;
            }
        },
        toggleOverrideStyle: (state) => {
            state.overrideStyle = state.overrideStyle === 'cranky' ? 'spatial' : 'cranky';
        },
        toggleDarkMode: (state) => {
            // Toggle between light and dark versions of themes
            const darkModeMap = {
                'light': 'dark',
                'dark': 'light',
                'munchie': 'munchie_dark',
                'munchie_dark': 'munchie',
                'cranky_light': 'cranky_dark',
                'cranky_dark': 'cranky_light'
            };

            if (darkModeMap[state.mode]) {
                state.mode = darkModeMap[state.mode];
            } else {
                // For themes without a dark counterpart, switch to default dark
                state.mode = state.mode.includes('dark') ? 'light' : 'dark';
            }
        },
        setThemePreference: (state, action) => {
            const { key, value } = action.payload;
            if (state.preferences.hasOwnProperty(key)) {
                state.preferences[key] = value;
            }
        },
        setThemePreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload };
        }
    }
});

export const {
    setTheme,
    setOverrideStyle,
    toggleOverrideStyle,
    toggleDarkMode,
    setThemePreference,
    setThemePreferences
} = themeSlice.actions;

export default themeSlice.reducer;