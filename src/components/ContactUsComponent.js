import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Grid } from '@mui/material';
import AuthTokenService from '../services/AuthTokenService';
import Branding from './Branding';
import logoImage from '../assets/logo/default_logo.png';

import { logDebug } from '../utilities/Logger';
import useCustomTranslation from "../hooks/useCustomTranslation"; // Import the custom hook

const ContactUs = () => {
    const { translate } = useCustomTranslation(); // Use the custom hook

    // State for form fields
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    // On component mount, check if user is signed in and set email
    useEffect(() => {
        const { user } = AuthTokenService.getAuthInfo();
        if (user) {
            setEmail(user);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Log form data
        logDebug('Submitting contact us form:', 'blue');
        console.log(JSON.stringify({ email, subject, message }));
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Branding logoUrl={logoImage} width="30%" height="auto" />
                            <Typography component="h1" variant="h5">
                                {translate('Contact Us')}
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label={translate('Email Address')}
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={!!email}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="subject"
                                    label={translate('Subject')}
                                    name="subject"
                                    autoComplete="subject"
                                    autoFocus
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="message"
                                    label={translate('Message')}
                                    type="text"
                                    id="message"
                                    autoComplete="current-message"
                                    multiline
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {translate('Send Message')}
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default ContactUs;
