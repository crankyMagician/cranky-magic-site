import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPreference } from '../reducers/preferenceSlice'; // Adjust the import path as necessary
import { MenuItem, FormControl, Select, InputLabel, Box } from '@mui/material';

// Import the useCustomTranslation hook
import useCustomTranslation from "../hooks/useCustomTranslation";

const PreferenceSelector = () => {
    const dispatch = useDispatch();
    // Retrieve current preferences from the Redux store
    const preferences = useSelector((state) => state.preferences.preferences);
    // Local state for the selected preference to allow for the dropdown to show current choice
    const [selectedPreference, setSelectedPreference] = useState(preferences.navbar || 'default');

    // Use the translate function from the hook
    const { translate } = useCustomTranslation();

    const handleChange = (event) => {
        const newPreference = event.target.value;
        setSelectedPreference(newPreference);
        // Dispatch new preference for navbar or dashboard
        dispatch(setPreference({...preferences, navbar: newPreference}));
    };

    return (
        <Box sx={{ minWidth: 120, flexGrow: 1 }}>
            <FormControl fullWidth>
                <InputLabel id="preference-selector-label">{translate('Navbar Style')}</InputLabel>
                <Select
                    labelId="preference-selector-label"
                    id="preference-selector"
                    value={selectedPreference}
                    label={translate('Navbar Style')}
                    onChange={handleChange}
                >
                    <MenuItem value="navbar">{translate('Navbar')}</MenuItem>
                    <MenuItem value="hoverbar">{translate('HoverBar')}</MenuItem>
                    <MenuItem value="vertical-sidebar">{translate('Sidebar')}</MenuItem>
                    <MenuItem value="dashboard">{translate('Dashboard')}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default PreferenceSelector;
