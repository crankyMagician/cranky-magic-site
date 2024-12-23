import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Typography,
    CircularProgress
} from '@mui/material';
import { Save as SaveIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useCreateMunchieMutation } from '../../../api/apiSlice';

const CreateMunchieForm = () => {
    const [createMunchie, { isLoading }] = useCreateMunchieMutation();

    const initialFormState = {
        name: '',
        height: 0,
        weight: 0,
        rarity: '',
        description: '',
        image_url: '',
        pokemon_url: '',
        object_name: '',
        hide_flags: 0
    };

    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});
    const [backendError, setBackendError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (formData.height < 0) {
            errors.height = 'Height cannot be negative';
        }

        if (formData.weight < 0) {
            errors.weight = 'Weight cannot be negative';
        }

        if (!formData.rarity) {
            errors.rarity = 'Rarity is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        try {
            const processedData = {
                ...formData,
                height: Number(formData.height),
                weight: Number(formData.weight),
                hide_flags: Number(formData.hide_flags)
            };

            await createMunchie(processedData).unwrap();
            setSuccessMessage('Munchie created successfully!');
            setBackendError(null);
            handleClear();
        } catch (err) {
            console.error('Failed to create munchie:', err);
            setBackendError(err?.data?.error || 'Failed to create munchie.');
            setSuccessMessage('');
        }
    };

    const handleClear = () => {
        setFormData(initialFormState);
        setFormErrors({});
        setBackendError(null);
        setSuccessMessage('');
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 'lg', mx: 'auto' }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Create New Munchie
            </Typography>

            {(backendError || successMessage) && (
                <Box sx={{ mb: 2 }}>
                    {backendError && (
                        <Alert severity="error" onClose={() => setBackendError(null)}>
                            {backendError}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert severity="success" onClose={() => setSuccessMessage('')}>
                            {successMessage}
                        </Alert>
                    )}
                </Box>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            label="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({
                                ...formData,
                                name: e.target.value
                            })}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl required fullWidth error={!!formErrors.rarity}>
                            <InputLabel>Rarity</InputLabel>
                            <Select
                                value={formData.rarity}
                                label="Rarity"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    rarity: e.target.value
                                })}
                            >
                                {rarityOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            label="Height"
                            value={formData.height}
                            onChange={(e) => setFormData({
                                ...formData,
                                height: e.target.value
                            })}
                            error={!!formErrors.height}
                            helperText={formErrors.height}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            label="Weight"
                            value={formData.weight}
                            onChange={(e) => setFormData({
                                ...formData,
                                weight: e.target.value
                            })}
                            error={!!formErrors.weight}
                            helperText={formErrors.weight}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({
                                ...formData,
                                description: e.target.value
                            })}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Image URL"
                            value={formData.image_url}
                            onChange={(e) => setFormData({
                                ...formData,
                                image_url: e.target.value
                            })}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Pokemon URL"
                            value={formData.pokemon_url}
                            onChange={(e) => setFormData({
                                ...formData,
                                pokemon_url: e.target.value
                            })}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Object Name"
                            value={formData.object_name}
                            onChange={(e) => setFormData({
                                ...formData,
                                object_name: e.target.value
                            })}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Hide Flags"
                            value={formData.hide_flags}
                            onChange={(e) => setFormData({
                                ...formData,
                                hide_flags: e.target.value
                            })}
                            inputProps={{ min: 0 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                onClick={handleClear}
                                startIcon={<ClearIcon />}
                                disabled={isLoading}
                            >
                                Clear
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                                disabled={isLoading || !formData.name || !formData.rarity || Object.keys(formErrors).length > 0}
                            >
                                {isLoading ? 'Creating...' : 'Create Munchie'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default CreateMunchieForm;