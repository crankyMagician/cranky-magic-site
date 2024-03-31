// src/components/Branding.js
import React from 'react';
import { Box, useTheme } from '@mui/material';
import useCustomTranslation from "../hooks/useCustomTranslation";

const Branding = ({ logoUrl, width = '40px', height = '40px', style }) => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Ensure content is centered
            gap: theme.spacing(1),
            ...style, // Spread additional styles
        }}>
            <img src={logoUrl} alt="Logo" style={{ width, height }} />
        </Box>
    );
};

export default Branding;
