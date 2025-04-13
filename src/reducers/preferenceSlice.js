import { createSlice } from '@reduxjs/toolkit';
import PreferenceService from '../services/PreferenceService'; // Import the PreferenceService

// Initialize the preferences from localStorage or default to an empty object
const initialState = {
    preferences: PreferenceService.getPreference() || {},
};

const preferenceSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setPreference(state, action) {
            const newPreferences = action.payload;
            state.preferences = newPreferences;
            PreferenceService.setPreference(newPreferences); // Persist the new preferences in localStorage
            // Logging the current preferences for visibility
            console.log('Current preferences:', state.preferences);
            console.log(`preferenceSlice: Preferences updated`, 'blue');
        },
        // You can add more reducers here for specific preference updates
    },
});

export const { setPreference } = preferenceSlice.actions;
export default preferenceSlice.reducer;
