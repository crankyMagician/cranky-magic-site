import React, { useState } from 'react';
import axiosServices from '../utilities/axios';
import { Button, TextField, Container, CssBaseline } from '@mui/material/';
import { SuccessToast } from "./SuccessToast";
import { ErrorToast } from "./ErrorToast";
import { logInfo, logError, logDebug } from '../utilities/Logger';
import Branding from './Branding';
import logoImage from '../assets/logo/default_logo.png';

import {Box} from "@mui/material";
import useCustomTranslation from "../hooks/useCustomTranslation";

function RegisterUser() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const { translate } = useCustomTranslation();

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        logDebug(`Registration process started with email: ${email}`, 'green');

        try {
            const response = await axiosServices.post(`api/CognitoService/register`, {
                email,
                password,
            });

            if (response.data) {
                SuccessToast("User registered successfully!");
                setIsRegistered(true); // Move to the confirmation phase
                logInfo('User registered successfully', 'blue');
            }
        } catch (error) {
            logError(`Registration error details: ${JSON.stringify(error, null, 2)}`, 'red');
            ErrorToast(`Registration failed: ${error.message}`); // Improved error message display
        }
    };

    const handleConfirmationSubmit = async (e) => {
        e.preventDefault();
        logDebug('Confirmation process started', 'green');

        try {
            const response = await axiosServices.post(`api/CognitoService/confirm-sign-up`, {
                email,
                confirmationCode,
            });

            if (response.data) {
                SuccessToast("User confirmed successfully!");
                logInfo('User confirmed successfully', 'blue');
            }
        } catch (error) {
            ErrorToast("Confirmation failed: " + error.message); // More user-friendly error message
            logError('Confirmation failed: ' + error.message, 'red');

            // Log the error JSON in the console
            console.error("Confirmation error details:", JSON.stringify(error, null, 2));
        }
    };


    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <CssBaseline />
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '30vh',
                marginBottom: 2,
            }}>
                <Branding logoUrl={logoImage} width="50%" height="auto" />
            </Box>
                <div>
                {!isRegistered ? (
                    // Registration Form
                    <form onSubmit={handleRegistrationSubmit} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={translate ('Email Address')}
                            name="email"
                            autoComplete="email"
                            autoFocus
                            placeholder={translate ('Enter your email to register')}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={translate ('Password')}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            placeholder={translate ('Create a password')}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            {translate ('Register')}
                        </Button>
                    </form>
                ) : (
                    // Confirmation Form
                    <form onSubmit={handleConfirmationSubmit} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="confirmationCode"
                            label={translate ('Confirmation Code')}
                            name="confirmationCode"
                            autoFocus
                            placeholder={translate ('Enter confirmation code here')}
                            onChange={(e) => setConfirmationCode(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            {translate ('Confirm')}
                        </Button>
                    </form>
                )}
            </div>

        </Container>
    );

}

export default RegisterUser;
