import { useTranslation } from 'react-i18next';
import { logInfo, logError } from '../utilities/Logger';



const useCustomTranslation = () => {
    const { t, i18n } = useTranslation();

    const translate = (key, options) => {
        logInfo(`Translating key: "${key}"`, 'purple');
        return t(key, options);
    };

    const changeLanguage = (lang) => {
        logInfo(`Attempting to change language to "${lang}"`, 'blue');
        return i18n.changeLanguage(lang).then(() => {
            logInfo(`Successfully changed language to "${lang}"`, 'blue');
        }).catch(error => {
            logError(`Failed to change language to "${lang}": ${error}`, 'red');
            throw error; // Ensure to re-throw the error to handle it in the calling code
        });
    };

    return { translate, changeLanguage, currentLanguage: i18n.language };
};

export default useCustomTranslation;
