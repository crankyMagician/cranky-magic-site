// useSyncLanguage.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import LanguageService from "../services/LanguageService";
import { setLanguage as setReduxLanguage } from '../reducers/languageSlice';
import i18n from "i18next";
import useCustomTranslation from './useCustomTranslation';

const useSyncLanguage = () => {
    const dispatch = useDispatch();
    const { changeLanguage } = useCustomTranslation();

    useEffect(() => {
        const storedLanguage = LanguageService.getLanguage();
        if (storedLanguage !== i18n.language) {
            changeLanguage(storedLanguage).then(() => {
                dispatch(setReduxLanguage(storedLanguage));
            }).catch(console.error);
        }
    }, [dispatch, changeLanguage]);
};

export default useSyncLanguage;
