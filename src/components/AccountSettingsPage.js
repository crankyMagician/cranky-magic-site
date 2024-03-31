import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import AuthTokenService from '../services/AuthTokenService';
import ThemeToggle from './ThemeToggle';
import PreferenceSelector from './PreferenceSelector';
import LanguageSwitcher from "./LanguageSwitcher";
import useCustomTranslation from "../hooks/useCustomTranslation";

const AccountSettingsPage = () => {
    const { user } = AuthTokenService.getAuthInfo();
    const { translate } = useCustomTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 3, sm: 4 },
                p: { xs: 3, md: 5 },
                pt: 0, // Set paddingTop to 0 to reduce space at the top
                mt: '-20px', // Optionally adjust marginTop to pull the component closer to the top
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, sm: 5 },
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    width: { xs: '100%', sm: '75%', md: '50%' },
                    minWidth: '300px',
                    maxWidth: '600px',
                }}
            >
                <Typography variant="h5"> {translate('Email')}: {user}</Typography>
                <Button
                    variant="contained"
                    component={Link}
                    to="/grant-categories"
                    sx={{
                        alignSelf: 'center',
                        size: 'large',
                        padding: { xs: '6px 12px', sm: '8px 16px' },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                    color="primary"
                >
                    Grant Categories
                </Button>
                <PreferenceSelector />
                <ThemeToggle />
                <LanguageSwitcher/>
            </Paper>
        </Box>
    );
};

export default AccountSettingsPage;
