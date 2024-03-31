// src/services/PreferenceService.js
class PreferenceService {
    static preferenceKey = 'userPreferences';

    static setPreference(preference) {
        // Assuming preference is an object, we need to stringify it to save in localStorage
        const preferenceString = JSON.stringify(preference);
        localStorage.setItem(this.preferenceKey, preferenceString);
    }

    static getPreference() {
        // Parse the string back to an object when retrieving
        const preferenceString = localStorage.getItem(this.preferenceKey);
        return preferenceString ? JSON.parse(preferenceString) : null;
    }
}

export default PreferenceService;
