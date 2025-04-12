import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import Branding from './Branding';
import { logDebug } from '../../utilities/Logger';
import useCustomTranslation from "../../hooks/useCustomTranslation"; // Import custom translation hook
import logoImage from '../../assets/logo/default_logo.png';


const NewsletterSignup = () => {
    const [email, setEmail] = useState('');
    const { translate } = useCustomTranslation(); // Use the translation hook

    const handleSubmit = (e) => {
        e.preventDefault();
        logDebug('Submitting newsletter signup form:', 'blue');
        console.log(JSON.stringify({ email }));
        // Here, you would typically send the email to your backend or a third-party service handling newsletter subscriptions.
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Branding logoUrl={logoImage} width="20%" height="auto" />
                <Typography component="h1" variant="h6">
                    {translate('Sign Up for Our Newsletter')}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {/* <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={translate("Email Address")}
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={translate("Enter your email")}
                    />*/}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {translate('Subscribe')}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NewsletterSignup;
