import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useCreateMunchieMutation } from '../../../api/apiSlice';

const CreateMunchieDialog = ({ open, onClose, onSubmit }) => {
    const [createMunchie, { isLoading, error }] = useCreateMunchieMutation();

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

    useEffect(() => {
        if (!open) {
            handleClear();
            setFormErrors({});
            setBackendError(null);
        }
    }, [open]);

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

    const handleSubmit = async () => {
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

            const result = await createMunchie(processedData).unwrap();
            handleClear();
            onClose();

            if (onSubmit) {
                onSubmit(result);
            }
        } catch (err) {
            console.error('Failed to create munchie:', err);
            setBackendError(err?.data?.error || 'Failed to create munchie.');
        }
    };

    const handleClear = () => {
        setFormData(initialFormState);
        setFormErrors({});
        setBackendError(null);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Munchie</DialogTitle>
            <DialogContent dividers>
                {backendError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {backendError}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
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
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClear}
                    startIcon={<ClearIcon />}
                    disabled={isLoading}
                >
                    Clear
                </Button>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isLoading || !formData.name || !formData.rarity || Object.keys(formErrors).length > 0}
                >
                    {isLoading ? 'Creating...' : 'Create Munchie'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CreateMunchieDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func
};

export default CreateMunchieDialog;