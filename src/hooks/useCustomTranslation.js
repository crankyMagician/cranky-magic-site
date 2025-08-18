import { useTranslation } from 'react-i18next';
import { useRef } from 'react'; // Add this

const useCustomTranslation = () => {
    const { t, i18n } = useTranslation();
    const translatedKeys = useRef(new Set()); // Track which keys we've already logged

    const translate = (key, options) => {
        // Only log in development and only log each key once per session
        if (process.env.NODE_ENV === 'development' && !translatedKeys.current.has(key)) {
            console.log(`Translating key: "${key}"`, 'purple');
            translatedKeys.current.add(key);
        }
        return t(key, options);
    };

    const changeLanguage = (lang) => {
        console.log(`Attempting to change language to "${lang}"`, 'blue');
        return i18n.changeLanguage(lang).then(() => {
            console.log(`Successfully changed language to "${lang}"`, 'blue');
            // Reset translated keys when language changes
            translatedKeys.current.clear();
        }).catch(error => {
            console.error(`Failed to change language to "${lang}": ${error}`, 'red');
            throw error; // Ensure to re-throw the error to handle it in the calling code
        });
    };

    return {
        translate,
        changeLanguage,
        currentLanguage: i18n.language,
        currentLanguageDirection: i18n.dir() // Added to ensure proper RTL support
    };
};

export default useCustomTranslation;