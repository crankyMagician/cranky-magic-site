// src/translationManager.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // For detecting the user's language
import HttpApi from 'i18next-http-backend';
import en from './languages/en.json';
import es from './languages/es.json';
import ko from './languages/ko.json';
import fr from './languages/fr.json';
import it from './languages/it.json';
import de from './languages/de.json';
import ru from './languages/ru.json';
import ja from './languages/ja.json';
import ar from './languages/ar.json';
import he from './languages/he.json';

const resources = {
    en: { translation: en },
    es: { translation: es },
    ko: { translation: ko },
    fr: { translation: fr },
    it: { translation: it },
    de: { translation: de },
    ru: { translation: ru },
    ja: { translation: ja },
    ar: { translation: ar, dir: 'rtl' }, // Include directionality for Arabic
    he: { translation: he, dir: 'rtl' },// Include directionality for Hebrew
};

i18n
    .use(HttpApi) // Optional, remove if not using HTTP API for translations
    .use(LanguageDetector) // Automatically detect language settings
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources,
        lng: "en", // If language detection fails, default to English
        fallbackLng: "en", // Fallback language
        keySeparator: false,
        interpolation: {
            escapeValue: false, // React already safes from XSS
        },
        detection: { // Options for language detection
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage', 'cookie'],
        },
    });

export default i18n;
