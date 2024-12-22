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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useUpdateEffectMutation } from '../../../api/apiSlice';
import StatusConditionSelect from '../StatusConditions/StatusConditionSelect';
import EffectTypeSelect from './EffectTypeSelect';

const EditEffectDialog = ({ open, onClose, effect }) => {
    const [updateEffect, { isLoading }] = useUpdateEffectMutation();

    const initialFormState = {
        description: '',
        effect_type: 'DAMAGE',
        chance: 100,
        status_condition: null,
        duration: 0,
        stat: '',
        stages: 0,
        heal_amount: 0,
        min_hits: 1,
        max_hits: 1,
        recoil_amount: 0,
        name: '',
        hide_flags: 0
    };

    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});
    const [backendError, setBackendError] = useState(null);

    // Initialize form data when effect prop changes
    useEffect(() => {
        if (effect) {
            setFormData({
                ...effect,
                chance: (effect.chance * 100), // Convert from decimal to percentage
                status_condition: effect.status_condition?.id || null, // Handle nested status condition
                // Ensure all numeric fields are numbers
                duration: Number(effect.duration || 0),
                stages: Number(effect.stages || 0),
                heal_amount: Number(effect.heal_amount || 0),
                min_hits: Number(effect.min_hits || 1),
                max_hits: Number(effect.max_hits || 1),
                recoil_amount: Number(effect.recoil_amount || 0),
                hide_flags: Number(effect.hide_flags || 0)
            });
            setFormErrors({});
            setBackendError(null);
        }
    }, [effect]);

    const statOptions = ['ATTACK', 'DEFENSE', 'SPECIAL_ATTACK', 'SPECIAL_DEFENSE', 'SPEED', 'ACCURACY', 'EVASION'];

    const validateForm = () => {
        const errors = {};

        // Validate Chance
        if (formData.chance < 0 || formData.chance > 100) {
            errors.chance = 'Chance must be between 0 and 100.';
        }

        // Validate Heal Amount (numeric(4,3) -> max 9.999)
        if (formData.heal_amount < 0 || formData.heal_amount > 9.999) {
            errors.heal_amount = 'Heal Amount must be between 0 and 9.999.';
        }

        // Validate Recoil Amount (numeric(4,3) -> max 9.999)
        if (formData.recoil_amount < 0 || formData.recoil_amount > 9.999) {
            errors.recoil_amount = 'Recoil Amount must be between 0 and 9.999.';
        }

        // Validate Duration
        if (formData.duration < 0) {
            errors.duration = 'Duration cannot be negative.';
        }

        // Validate Stages
        if (formData.stages < -6 || formData.stages > 6) {
            errors.stages = 'Stages must be between -6 and 6.';
        }

        // Validate Hits
        if (formData.min_hits < 1) {
            errors.min_hits = 'Minimum Hits must be at least 1.';
        }
        if (formData.max_hits < formData.min_hits) {
            errors.max_hits = 'Maximum Hits cannot be less than Minimum Hits.';
        }

        // Additional Validations (Optional)
        if (!formData.name.trim()) {
            errors.name = 'Effect Name is required.';
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // Convert numeric strings to numbers and percentage to decimal
            const processedData = {
                id: effect.id, // Include the effect ID for update
                ...formData,
                chance: Number(formData.chance) / 100, // Convert to decimal
                duration: Number(formData.duration),
                stages: Number(formData.stages),
                heal_amount: Number(formData.heal_amount),
                min_hits: Number(formData.min_hits),
                max_hits: Number(formData.max_hits),
                recoil_amount: Number(formData.recoil_amount)
            };

            await updateEffect(processedData).unwrap();
            onClose();
        } catch (err) {
            console.error('Failed to update effect:', err);
            if (err?.data?.error) {
                setBackendError(err.data.error);
            } else {
                setBackendError('An unexpected error occurred.');
            }
        }
    };

    const handleRevert = () => {
        if (effect) {
            setFormData({
                ...effect,
                chance: (effect.chance * 100),
                status_condition: effect.status_condition?.id || null,
                duration: Number(effect.duration || 0),
                stages: Number(effect.stages || 0),
                heal_amount: Number(effect.heal_amount || 0),
                min_hits: Number(effect.min_hits || 1),
                max_hits: Number(effect.max_hits || 1),
                recoil_amount: Number(effect.recoil_amount || 0),
                hide_flags: Number(effect.hide_flags || 0)
            });
            setFormErrors({});
            setBackendError(null);
        }
    };

    // Don't render if no effect is provided
    if (!effect) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Effect: {effect.name || 'Unnamed Effect'}</DialogTitle>
            <DialogContent dividers>
                {backendError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {backendError}
                    </Alert>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    description: e.target.value
                                })}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <EffectTypeSelect
                                value={formData.effect_type}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    effect_type: e.target.value,
                                    // Reset dependent fields when effect_type changes
                                    status_condition: e.target.value === 'STATUS' ? formData.status_condition : null,
                                    duration: (e.target.value === 'STATUS' || e.target.value === 'STAT_CHANGE') ? formData.duration : 0,
                                    stat: e.target.value === 'STAT_CHANGE' ? formData.stat : '',
                                    stages: e.target.value === 'STAT_CHANGE' ? formData.stages : 0,
                                    heal_amount: e.target.value === 'HEAL' ? formData.heal_amount : 0,
                                    min_hits: e.target.value === 'DAMAGE' ? formData.min_hits : 1,
                                    max_hits: e.target.value === 'DAMAGE' ? formData.max_hits : 1,
                                    recoil_amount: e.target.value === 'RECOIL' ? formData.recoil_amount : 0,
                                })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Chance (%)"
                                value={formData.chance}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    chance: Math.min(100, Math.max(0, Number(e.target.value)))
                                })}
                                inputProps={{ min: 0, max: 100, step: 0.1 }}
                                error={!!formErrors.chance}
                                helperText={formErrors.chance}
                            />
                        </Grid>

                        {formData.effect_type === 'STATUS' && (
                            <Grid item xs={12} md={6}>
                                <StatusConditionSelect
                                    value={formData.status_condition}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        status_condition: e.target.value
                                    })}
                                    error={!!formErrors.status_condition}
                                    helperText={formErrors.status_condition}
                                />
                            </Grid>
                        )}

                        {(formData.effect_type === 'STATUS' || formData.effect_type === 'STAT_CHANGE') && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Duration (turns)"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        duration: parseInt(e.target.value) || 0
                                    })}
                                    inputProps={{ min: 0 }}
                                    error={!!formErrors.duration}
                                    helperText={formErrors.duration}
                                />
                            </Grid>
                        )}

                        {formData.effect_type === 'STAT_CHANGE' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Stat</InputLabel>
                                        <Select
                                            value={formData.stat}
                                            label="Stat"
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                stat: e.target.value
                                            })}
                                        >
                                            {statOptions.map((stat) => (
                                                <MenuItem key={stat} value={stat}>
                                                    {stat}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Stages"
                                        value={formData.stages}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            stages: parseInt(e.target.value) || 0
                                        })}
                                        inputProps={{ min: -6, max: 6 }}
                                        error={!!formErrors.stages}
                                        helperText={formErrors.stages}
                                    />
                                </Grid>
                            </>
                        )}

                        {formData.effect_type === 'HEAL' && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Heal Amount"
                                    value={formData.heal_amount}
                                    onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (isNaN(value)) value = 0;
                                        // Clamp the value between 0 and 9.999
                                        value = Math.min(9.999, Math.max(0, value));
                                        setFormData({
                                            ...formData,
                                            heal_amount: value
                                        });
                                    }}
                                    inputProps={{ min: 0, max: 9.999, step: 0.001 }}
                                    error={!!formErrors.heal_amount}
                                    helperText={formErrors.heal_amount}
                                />
                            </Grid>
                        )}

                        {formData.effect_type === 'DAMAGE' && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Minimum Hits"
                                        value={formData.min_hits}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || 1;
                                            setFormData({
                                                ...formData,
                                                min_hits: value,
                                                max_hits: Math.max(value, formData.max_hits)
                                            });
                                        }}
                                        inputProps={{ min: 1 }}
                                        error={!!formErrors.min_hits}
                                        helperText={formErrors.min_hits}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Maximum Hits"
                                        value={formData.max_hits}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value) || formData.min_hits;
                                            setFormData({
                                                ...formData,
                                                max_hits: Math.max(formData.min_hits, value)
                                            });
                                        }}
                                        inputProps={{ min: formData.min_hits }}
                                        error={!!formErrors.max_hits}
                                        helperText={formErrors.max_hits}
                                    />
                                </Grid>
                            </>
                        )}

                        {formData.effect_type === 'RECOIL' && (
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Recoil Amount"
                                    value={formData.recoil_amount}
                                    onChange={(e) => {
                                        let value = parseFloat(e.target.value);
                                        if (isNaN(value)) value = 0;
                                        // Clamp the value between 0 and 9.999
                                        value = Math.min(9.999, Math.max(0, value));
                                        setFormData({
                                            ...formData,
                                            recoil_amount: value
                                        });
                                    }}
                                    inputProps={{ min: 0, max: 9.999, step: 0.001 }}
                                    error={!!formErrors.recoil_amount}
                                    helperText={formErrors.recoil_amount}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Effect Name"
                                value={formData.name}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    name: e.target.value
                                })}
                                required
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleRevert}
                    startIcon={<ClearIcon />}
                    disabled={isLoading}
                >
                    Revert Changes
                </Button>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isLoading || !formData.description || !formData.effect_type}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );

};

export default EditEffectDialog;
