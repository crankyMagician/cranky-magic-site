//src/components/LoginUser.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosServices from '../utilities/axios';
import { Button, TextField, Container, CssBaseline } from '@mui/material/';
import { logInfo, logDebug } from '../utilities/Logger';
import { SuccessToast } from "./SuccessToast";
import AuthTokenService from "../services/AuthTokenService"; // Update import to use AuthTokenService
import { setAuthentication } from '../reducers/authReducer'; // Ensure this is the correct path
import { SignUpTextHere} from './SignUpText';
import {ForgotPasswordLink} from "./ForgotPasswordText";
import {Box} from "@mui/material";
import Branding from "./Branding";
import logoImage from '../assets/logo/default_logo.png';

import useCustomTranslation from "../hooks/useCustomTranslation";

function LoginUser() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { translate } = useCustomTranslation();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        logDebug('Login process started', 'green');

        try {
            const response = await axiosServices.post(`api/CognitoService/authenticate`, {
                username,
                password,
            });

            if (response.data) {
                logInfo('User authenticated successfully', 'blue');
                SuccessToast("User authenticated successfully!");
                logInfo('Setting token:', response.data.accessToken);

                // Use AuthTokenService to set authentication info
                AuthTokenService.setAuthInfo({
                    isAuthenticated: 'true', // Use a string to match your storage format
                    user: response.data.username,
                    authToken: response.data.accessToken,
                });

                logInfo(`Username: ${response.data.username}`);

                // Use AuthTokenService to retrieve and log token for verification
                const { authToken } = AuthTokenService.getAuthInfo();
                logInfo('Token set. Retrieving to verify...');
                logInfo('Retrieved token:', authToken);

                dispatch(setAuthentication({
                    isAuthenticated: true,
                    user: response.data.username,
                    token: response.data.accessToken,
                }));

            }
        } catch (error) {
            // Handle error
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

            <Box sx={{
                width: '100%', // Take up the full width
                display: 'flex',
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                height: '30vh', // Allocate 30% of the viewport height to the Branding area
                marginBottom: 2, // Add some space below the branding area
            }}>
                <Branding logoUrl={logoImage} width="50%" height="auto" /> {/* Adjust width as per requirement */}
            </Box>            <CssBaseline />
            <div>
                <form onSubmit={handleLoginSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label={translate('Username')}
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={translate('Password')}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        {translate('Log In')}
                    </Button>
                </form>

                <ForgotPasswordLink />

                {/* Use either option: */}
                <SignUpTextHere />
                {/* OR
                <SignUpTextSignUp />*/}
            </div>
        </Container>
    );
}

export default LoginUser;
