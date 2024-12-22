import React, { useState } from 'react';
import axiosServices from '../../utilities/axios';
import { Button, TextField, Container, CssBaseline } from '@mui/material/';
import { SuccessToast } from "./SuccessToast";
import { logInfo, logDebug } from '../../utilities/Logger';
import useCustomTranslation from "../../hooks/useCustomTranslation";


function AccountSignUp() {
    const [email, setEmail] = useState('');
    const authProviderId = 1; // Set auth provider id as required
    const { translate } = useCustomTranslation();

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        const createdAt = new Date().toISOString(); // Dynamically generate the current timestamp
        logDebug('Sign up process started', 'green');

        try {
            const response = await axiosServices.post(`api/UserAccountService/signup`, {
                email,
                authProviderId,
                createdAt,
            });

            if (response.data) {
                SuccessToast(translate("Account created successfully!")); // Use translation for toast message
                logInfo('Account created successfully', 'blue');
            }
        } catch (error) {
            // Consider adding error handling logic here
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <CssBaseline />
            <div>
                <form onSubmit={handleSignUpSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={translate("Email Address")} // Translate label
                        name="email"
                        autoComplete="email"
                        autoFocus
                        placeholder={translate("Enter your email to sign up")} // Translate placeholder
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        {translate("Sign Up")} // Translate button text
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default AccountSignUp;
