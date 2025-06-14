import React, { useState, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    useTheme,
    useMediaQuery,
    Fade,
    IconButton,
    Tooltip,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import {
    Send,
    Email,
    Phone,
    LocationOn,
    LinkedIn,
    GitHub,
    Twitter,
    Language
} from '@mui/icons-material';

import useCustomTranslation from '../../hooks/useCustomTranslation';
import {FORM_EVENTS, INTERACTION_EVENTS} from "../../analytics/constants/events";
import useAnalytics from "../../analytics/hooks/useAnalytics";

const ContactSection = React.memo(() => {
    const theme = useTheme();
    const { translate } = useCustomTranslation();
    const { trackEvent } = useAnalytics();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Contact information
    const contactInfo = [
        {
            icon: <Email />,
            title: translate('Email'),
            value: 'hello@crankymagician.dev',
            link: 'mailto:hello@crankymagician.dev'
        },
        {
            icon: <Phone />,
            title: translate('Phone'),
            value: '+1 (555) 123-4567',
            link: 'tel:+15551234567'
        },
        {
            icon: <LocationOn />,
            title: translate('Location'),
            value: 'San Francisco, CA',
            link: null
        }
    ];

    // Social links
    const socialLinks = [
        {
            icon: <LinkedIn />,
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/crankymagician',
            color: '#0077B5'
        },
        {
            icon: <GitHub />,
            name: 'GitHub',
            url: 'https://github.com/crankymagician',
            color: '#333'
        },
        {
            icon: <Twitter />,
            name: 'Twitter',
            url: 'https://twitter.com/crankymagician',
            color: '#1DA1F2'
        },
        {
            icon: <Language />,
            name: 'Website',
            url: 'https://crankymagician.dev',
            color: theme.palette.primary.main
        }
    ];

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        trackEvent(FORM_EVENTS.FIELD_CHANGE, {
            form_id: 'contact_form',
            field_name: name,
            section: 'contact'
        });
    }, [errors, trackEvent]);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = translate('Name is required');
        }

        if (!formData.email.trim()) {
            newErrors.email = translate('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = translate('Invalid email address');
        }

        if (!formData.subject.trim()) {
            newErrors.subject = translate('Subject is required');
        }

        if (!formData.message.trim()) {
            newErrors.message = translate('Message is required');
        } else if (formData.message.trim().length < 10) {
            newErrors.message = translate('Message must be at least 10 characters');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, translate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        trackEvent(FORM_EVENTS.SUBMIT_ATTEMPT, {
            form_id: 'contact_form',
            section: 'contact'
        });

        if (!validateForm()) {
            trackEvent(FORM_EVENTS.VALIDATION_ERROR, {
                form_id: 'contact_form',
                errors: Object.keys(errors),
                section: 'contact'
            });
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            trackEvent(FORM_EVENTS.SUBMIT_SUCCESS, {
                form_id: 'contact_form',
                section: 'contact'
            });

            setSnackbar({
                open: true,
                message: translate('Message sent successfully!'),
                severity: 'success'
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            trackEvent(FORM_EVENTS.SUBMIT_FAILURE, {
                form_id: 'contact_form',
                error: error.message,
                section: 'contact'
            });

            setSnackbar({
                open: true,
                message: translate('Failed to send message. Please try again.'),
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSocialClick = (social) => {
        trackEvent(INTERACTION_EVENTS.CLICK, {
            element_type: 'social_link',
            element_id: social.name,
            section: 'contact'
        });
    };

    return (
        <Box sx={{ position: 'relative' }}>
            <Container maxWidth="lg">
                <Fade in timeout={800}>
                    <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {translate("Let's Connect")}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{
                                maxWidth: '600px',
                                mx: 'auto',
                                fontSize: { xs: '1rem', md: '1.125rem' }
                            }}
                        >
                            {translate('Have a project in mind? Let\'s discuss how we can work together')}
                        </Typography>
                    </Box>
                </Fade>

                <Grid container spacing={4}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <Fade in timeout={1000}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 3, md: 4 },
                                    borderRadius: 3,
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(255,255,255,0.05)'
                                        : 'rgba(0,0,0,0.02)',
                                    border: `1px solid ${theme.palette.divider}`,
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{ mb: 3, fontWeight: 600 }}
                                >
                                    {translate('Send a Message')}
                                </Typography>

                                <Box
                                    component="form"
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                name="name"
                                                label={translate('Your Name')}
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                error={!!errors.name}
                                                helperText={errors.name}
                                                disabled={loading}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                name="email"
                                                label={translate('Your Email')}
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                disabled={loading}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                name="subject"
                                                label={translate('Subject')}
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                error={!!errors.subject}
                                                helperText={errors.subject}
                                                disabled={loading}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                name="message"
                                                label={translate('Message')}
                                                multiline
                                                rows={6}
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                error={!!errors.message}
                                                helperText={errors.message}
                                                disabled={loading}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                disabled={loading}
                                                endIcon={loading ? <CircularProgress size={20} /> : <Send />}
                                                sx={{
                                                    py: 1.5,
                                                    textTransform: 'none',
                                                    fontSize: '1.125rem',
                                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 6px 30px rgba(0,0,0,0.15)'
                                                    }
                                                }}
                                            >
                                                {loading ? translate('Sending...') : translate('Send Message')}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Fade>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12} md={5}>
                        <Fade in timeout={1200}>
                            <Box>
                                {/* Contact Info Cards */}
                                <Box sx={{ mb: 4 }}>
                                    {contactInfo.map((info, index) => (
                                        <Paper
                                            key={index}
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                mb: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: 2,
                                                backgroundColor: theme.palette.mode === 'dark'
                                                    ? 'rgba(255,255,255,0.05)'
                                                    : 'rgba(0,0,0,0.02)',
                                                border: `1px solid ${theme.palette.divider}`,
                                                transition: 'all 0.3s ease',
                                                cursor: info.link ? 'pointer' : 'default',
                                                '&:hover': info.link ? {
                                                    transform: 'translateX(8px)',
                                                    borderColor: theme.palette.primary.main
                                                } : {}
                                            }}
                                            onClick={() => info.link && window.open(info.link, '_blank')}
                                        >
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: theme.palette.primary.main + '22',
                                                    color: theme.palette.primary.main,
                                                    mr: 2
                                                }}
                                            >
                                                {info.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    {info.title}
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500}>
                                                    {info.value}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Box>

                                {/* Social Links */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? 'rgba(255,255,255,0.05)'
                                            : 'rgba(0,0,0,0.02)',
                                        border: `1px solid ${theme.palette.divider}`,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        {translate('Connect on Social')}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        {socialLinks.map((social) => (
                                            <Tooltip key={social.name} title={social.name}>
                                                <IconButton
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => handleSocialClick(social)}
                                                    sx={{
                                                        color: social.color,
                                                        border: `2px solid ${social.color}22`,
                                                        '&:hover': {
                                                            backgroundColor: social.color + '11',
                                                            transform: 'translateY(-4px)',
                                                            borderColor: social.color
                                                        }
                                                    }}
                                                >
                                                    {social.icon}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </Box>
                                </Paper>
                            </Box>
                        </Fade>
                    </Grid>
                </Grid>
            </Container>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;