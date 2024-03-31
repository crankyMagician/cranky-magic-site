// src/services/LanguageService.js
class LanguageService {
    static languageKey = 'appLanguage';

    static setLanguage(language) {
        localStorage.setItem(this.languageKey, language);
    }

    static getLanguage() {
        return localStorage.getItem(this.languageKey) || 'en'; // Default to English if no language is set
    }
}

export default LanguageService;
