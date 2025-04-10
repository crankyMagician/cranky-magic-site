import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPreference } from '../../reducers/preferenceSlice';
import {
    MenuItem,
    FormControl,
    Select,
    InputLabel,
    Box,
    Typography,
    ListItemIcon,
    ListItemText
} from '@mui/material';

// Icons for navigation styles
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import WebIcon from '@mui/icons-material/Web';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

// Import the useCustomTranslation hook
import useCustomTranslation from "../../hooks/useCustomTranslation";

const PreferenceSelector = () => {
    const dispatch = useDispatch();
    // Retrieve current preferences from the Redux store
    const preferences = useSelector((state) => state.preferences.preferences || {});
    // Local state for the selected preference to allow for the dropdown to show current choice
    const [selectedPreference, setSelectedPreference] = useState(preferences.navbar || 'navbar');

    // Use the translate function from the hook
    const { translate } = useCustomTranslation();

    // Update local state when redux state changes
    useEffect(() => {
        setSelectedPreference(preferences.navbar || 'navbar');
    }, [preferences.navbar]);

    const handleChange = (event) => {
        const newPreference = event.target.value;
        setSelectedPreference(newPreference);
        // Dispatch new preference for navigation
        dispatch(setPreference({...preferences, navbar: newPreference}));
    };

    // Navigation options with icons
    const navigationOptions = [
        { value: 'navbar', label: 'Navbar', icon: <MenuIcon /> },
        { value: 'hoverbar', label: 'HoverBar', icon: <WebIcon /> },
        { value: 'vertical-sidebar', label: 'Sidebar', icon: <ViewSidebarIcon /> },
        { value: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { value: 'megamenu', label: 'MegaMenu', icon: <ViewCompactIcon /> }
    ];

    return (
        <Box sx={{ minWidth: 120, flexGrow: 1 }}>
            <FormControl fullWidth>
                <InputLabel id="preference-selector-label">{translate('Navigation Style')}</InputLabel>
                <Select
                    labelId="preference-selector-label"
                    id="preference-selector"
                    value={selectedPreference}
                    label={translate('Navigation Style')}
                    onChange={handleChange}
                >
                    {navigationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemIcon>
                                    {option.icon}
                                </ListItemIcon>
                                <ListItemText>
                                    {translate(option.label)}
                                </ListItemText>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {translate('Select your preferred navigation style for the application.')}
            </Typography>
        </Box>
    );
};

export default PreferenceSelector;