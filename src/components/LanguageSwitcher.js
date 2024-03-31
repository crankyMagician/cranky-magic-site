import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Select, MenuItem } from '@mui/material';
import LanguageService from '../services/LanguageService';
import { setLanguage } from '../reducers/languageSlice';
import i18n from "i18next";

const LanguageSelector = () => {
    const dispatch = useDispatch();
    // State to manage the selected language, defaulting to English ('en')
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    useEffect(() => {
        // Fetch the current language from local storage on component mount
        const currentLanguage = LanguageService.getLanguage();
        setSelectedLanguage(currentLanguage);
        // Also update the Redux store with the fetched language
        dispatch(setLanguage(currentLanguage));
    }, [dispatch]);

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        // Update state with new language
        setSelectedLanguage(newLanguage);
        // Persist the new language preference in local storage
        LanguageService.setLanguage(newLanguage);
        // Dispatch the language change to the Redux store
        dispatch(setLanguage(newLanguage));
        // Update the global translation context/library to the new language
        i18n.changeLanguage(newLanguage).then(() => {
            console.log(`Language changed to ${newLanguage}`);
        });
    };


    // Define your language options
    const languageOptions = [
        { code: 'en', label: 'English' }, // English
        { code: 'es', label: 'Español' }, // Spanish
        { code: 'fr', label: 'Français' }, // French
        { code: 'ko', label: '한국어' }, // Korean
        { code: 'it', label: 'Italiano' }, // Italian
        { code: 'ru', label: 'Русский' }, // Russian
        { code: 'de', label: 'Deutsch' }, // German
        { code: 'ja', label: '日本語' }, // Japanese
        { code: 'ar', label: 'العربية' },  // Arabic
        { code: 'he', label: 'עברית' }, // Hebrew
    ];


    return (
        <Select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            displayEmpty
            variant="outlined"
            sx={{ minWidth: 120 }} // Adjust styling as needed
        >
            {languageOptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                    {option.label}
                </MenuItem>
            ))}
        </Select>
    );
};

export default LanguageSelector;
