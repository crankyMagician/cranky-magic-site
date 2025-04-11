import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import useFormTracking from '../../analytics/hooks/useFormTracking';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import useScrollTracking from '../../analytics/hooks/useScrollTracking';
import { EVENTS } from '../../analytics/constants/events';
import axiosServices from '../../utilities/axios';

const ContactUs = () => {
    // Component state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Use the analytics hooks
    const analytics = useAnalytics();

    // Track scrolling on this page
    useScrollTracking();

    // Track form interactions with our form tracking hook
    const formTracking = useFormTracking({
        formId: 'contact_us_form',
        formName: 'Contact Us Form',
        fields: [
            { name: 'name', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'subject', type: 'text' },
            { name: 'message', type: 'text' }
        ],
        trackFocus: true,
        trackBlur: true,
        trackChange: true
    });

    // Track feature view on component mount
    useEffect(() => {
        // Track that the user viewed this feature
        analytics.trackFeatureView('contact_us_page');
    }, [analytics]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form state
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Track field change with the form tracking hook
        formTracking.handleFieldChange(name, name === 'email' ? 'email' : 'text', value);

        // Clear error for this field if any
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Handle field focus
    const handleFocus = (e) => {
        const { name } = e.target;
        formTracking.handleFieldFocus(name, name === 'email' ? 'email' : 'text');
    };

    // Handle field blur
    const handleBlur = (e) => {
        const { name, value } = e.target;
        formTracking.handleFieldBlur(name, name === 'email' ? 'email' : 'text', value);
    };

    // Validate the form
    const validateForm = () => {
        const newErrors = {};

        // Validate name field
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Validate email field
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Validate subject field
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        // Validate message field
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        // Update state with any errors
        setErrors(newErrors);

        // Track validation errors if any
        if (Object.keys(newErrors).length > 0) {
            formTracking.handleValidationErrors(newErrors);
        }

        // Return whether the form is valid
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        const isValid = validateForm();

        // Track submission attempt with form tracking hook
        formTracking.handleSubmitAttempt(isValid, errors);

        // Exit if form is invalid
        if (!isValid) return;

        // Set submitting state to show loading indicator
        setIsSubmitting(true);

        try {
            // Make the API call to submit the form
            const response = await axiosServices.post('/contact', formData);

            // Track successful submission with form tracking hook
            formTracking.handleSubmitSuccess(formData);

            // Also track as a feature completion
            analytics.trackEvent(EVENTS.FEATURE.FEATURE_COMPLETE, {
                feature_name: 'contact_form_submission',
                form_length: formData.message.length,
                response_time_ms: response.data.time || 0
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            // Show success message
            setSubmitted(true);
            setSnackbar({
                open: true,
                message: 'Your message has been sent successfully!',
                severity: 'success'
            });

        } catch (error) {
            // Track submission failure
            formTracking.handleSubmitFailure(error);

            // Also track as an error
            analytics.trackError(error, {
                context: 'contact_form_submission',
                form_data: {
                    has_name: !!formData.name,
                    has_email: !!formData.email,
                    has_subject: !!formData.subject,
                    message_length: formData.message.length
                }
            });

            // Show error message
            setSnackbar({
                open: true,
                message: 'Failed to send your message. Please try again later.',
                severity: 'error'
            });
        } finally {
            // Reset submitting state
            setIsSubmitting(false);
        }
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbar(prev => ({
            ...prev,
            open: false
        }));
    };

    // Reset the form to submit another message
    const handleSendAnother = () => {
        setSubmitted(false);

        // Track user starting another form
        analytics.trackEvent(EVENTS.FORM.START, {
            form_id: 'contact_us_form',
            form_name: 'Contact Us Form',
            is_repeat: true
        });
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h2" gutterBottom>Contact Us</Typography>

            <Typography paragraph>
                We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
            </Typography>

            {submitted ? (
                <Paper sx={{ p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="h6">Thank you for your message!</Typography>
                    <Typography paragraph>
                        We have received your inquiry and will get back to you shortly.
                        Our team typically responds within 24-48 business hours.
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleSendAnother}
                    >
                        Send another message
                    </Button>
                </Paper>
            ) : (
                <Paper sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Your Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    disabled={isSubmitting}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Your Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    disabled={isSubmitting}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    error={!!errors.subject}
                                    helperText={errors.subject}
                                    disabled={isSubmitting}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Your Message"
                                    name="message"
                                    multiline
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    error={!!errors.message}
                                    helperText={errors.message}
                                    disabled={isSubmitting}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={isSubmitting}
                                    sx={{ mt: 2 }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <CircularProgress size={24} sx={{ mr: 1 }} />
                                            Sending...
                                        </>
                                    ) : 'Send Message'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            )}

            {/* Additional contact information */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>Other ways to reach us</Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6">Email</Typography>
                            <Typography>support@spatialmods.com</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6">Phone</Typography>
                            <Typography>+1 (555) 123-4567</Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6">Address</Typography>
                            <Typography>123 Tech Avenue, Suite 100</Typography>
                            <Typography>San Francisco, CA 94107</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ContactUs;