import { createSlice } from '@reduxjs/toolkit';
import LanguageService from '../services/LanguageService'; // Import the LanguageService
import { logWarning } from '../utilities/Logger';

// Initialize the language from localStorage or default to 'en'
const initialState = {
    language: LanguageService.getLanguage(),
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage(state, action) {
            const newLanguage = action.payload;
            state.language = newLanguage;
            LanguageService.setLanguage(newLanguage); // Persist the new language in localStorage
            // Logging the current language for visibility
            console.log('Current language:', state.language);
            logWarning(`languageSlice: Language changed to ${state.language}`, 'blue');
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
