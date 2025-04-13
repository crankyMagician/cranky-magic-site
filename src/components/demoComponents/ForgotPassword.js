//src/components/ForgotPassword.js
import React, { useState } from 'react';
import axiosServices from '../../utilities/axios';
import { Button, TextField, Container, CssBaseline, Box } from '@mui/material/';
import { SuccessToast } from "./SuccessToast";
import { ErrorToast } from "./ErrorToast";
import Branding from "./Branding";
import logoImage from '../../assets/logo/default_logo.png';

import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        logDebug('Forgot password process started', 'green'); // Log the start of forgot password process

        try {
            const response = await axiosServices.post(`api/CognitoService/forgot-password`, {
                username,
            });


            if (response.data) {
                SuccessToast("Password reset code sent successfully!");
                setIsCodeSent(true); // Move to the confirmation phase
                console.log('Password reset code sent successfully', 'blue'); // Log successful code sending
            }
        } catch (error) {
            ErrorToast("Failed to send password reset code: " + error.response.data.message);
            logError('Failed to send password reset code: ' + error.response.data.message, 'red'); // Log error in sending code
        }
    };

    const handleConfirmForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        logDebug('Password reset confirmation process started', 'green'); // Log the start of password reset confirmation

        try {
            const response = await axiosServices.post(`api/CognitoService/confirm-forgot-password`, {
                username,
                confirmationCode,
                password,
            });


            if (response.data) {
                SuccessToast("Password reset successfully!");
                // Here you might redirect the user or update UI to show successful reset
                console.log('Password reset successfully', 'blue'); // Log successful password reset
                navigate('/login');
            }
        } catch (error) {
            ErrorToast("Password reset failed: " + error.response.data.message);
            logError('Password reset failed: ' + error.response.data.message, 'red'); // Log password reset error
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <CssBaseline />
            <Box sx={{
                width: '100%', // Take up the full width
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                height: '30vh', // Allocate 30% of the viewport height to the Branding area
                marginBottom: 2, // Add some space below the branding area
            }}>
                <Branding logoUrl={logoImage} width="50%" height="auto" /> {/* Adjust width as per requirement */}
            </Box>
            <div>
                {!isCodeSent ? (
                    // Forgot Password Form
                    <form onSubmit={handleForgotPasswordSubmit} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label={t('Username')}
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            {t('Send Reset Code')}
                        </Button>
                    </form>
                ) : (
                    // Confirm Forgot Password Form
                    <form onSubmit={handleConfirmForgotPasswordSubmit} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmationCode"
                            label={t('Confirmation Code')}
                            type="text"
                            id="confirmationCode"
                            autoComplete="confirmation-code"
                            onChange={(e) => setConfirmationCode(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={t('New Password')}
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            {t('Reset Password')}
                        </Button>
                    </form>
                )}
            </div>
        </Container>
    );
}

export default ForgotPassword;
