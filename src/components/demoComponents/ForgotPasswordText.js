//src/components/ForgotPasswordText.js
import React from 'react';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useCustomTranslation from "../../hooks/useCustomTranslation";

const ForgotPasswordLink = () => {
    const { translate } = useCustomTranslation();

    return (
        <Typography variant="body2" align="center">
            <Link component={RouterLink} to="/forgot-password">
                {translate('Forgot Password?')}
            </Link>
        </Typography>
    );
};

// Export both options
export { ForgotPasswordLink };