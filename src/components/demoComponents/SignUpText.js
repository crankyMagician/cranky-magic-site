import React from 'react';
import { Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useCustomTranslation from "../../hooks/useCustomTranslation";

const SignUpTextHere = () => {
    const { translate } = useCustomTranslation();
    return (
        <Typography variant="body2" align="center">
            {translate ('No account? Sign up')}{' '}
            <Link component={RouterLink} to="/business-signup">
                {translate('Here')}
            </Link>
        </Typography>
    );
};

const SignUpTextSignUp = () => {
    const { translate } = useCustomTranslation();

    return (
        <Typography variant="body2" align="center">
            {translate('No account? Click here to')}{' '}
            <Link component={RouterLink} to="/business-signup">
                {translate('Sign Up')}
            </Link>
        </Typography>
    );
};

// Export both options
export { SignUpTextHere, SignUpTextSignUp };
