import React, { useState } from 'react';
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
    Grid
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useCreateEffectMutation } from '../../../api/apiSlice';
import StatusConditionSelect from '../StatusConditions/StatusConditionSelect';
import EffectTypeSelect from './EffectTypeSelect';

const CreateEffectDialog = ({ open, onClose }) => {
    const [createEffect, { isLoading }] = useCreateEffectMutation();

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

    const statOptions = ['ATTACK', 'DEFENSE', 'SPECIAL_ATTACK', 'SPECIAL_DEFENSE', 'SPEED', 'ACCURACY', 'EVASION'];

    const handleSubmit = async () => {
        try {
            // Convert numeric strings to numbers
            const processedData = {
                ...formData,
                chance: Number(formData.chance) / 100, // Convert to decimal
                duration: Number(formData.duration),
                stages: Number(formData.stages),
                heal_amount: Number(formData.heal_amount),
                min_hits: Number(formData.min_hits),
                max_hits: Number(formData.max_hits),
                recoil_amount: Number(formData.recoil_amount)
            };

            await createEffect(processedData);
            handleClear();
            onClose();
        } catch (err) {
            console.error('Failed to create effect:', err);
        }
    };

    const handleClear = () => {
        setFormData(initialFormState);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Effect</DialogTitle>
            <DialogContent dividers>
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
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <EffectTypeSelect
                                value={formData.effect_type}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    effect_type: e.target.value
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
                                inputProps={{ min: 0, max: 100 }}
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
                                        duration: parseInt(e.target.value)
                                    })}
                                    inputProps={{ min: 0 }}
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
                                            stages: parseInt(e.target.value)
                                        })}
                                        inputProps={{ min: -6, max: 6 }}
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
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        heal_amount: parseFloat(e.target.value)
                                    })}
                                    inputProps={{ min: 0, step: 0.1 }}
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
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            min_hits: parseInt(e.target.value)
                                        })}
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Maximum Hits"
                                        value={formData.max_hits}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            max_hits: Math.max(formData.min_hits, parseInt(e.target.value))
                                        })}
                                        inputProps={{ min: formData.min_hits }}
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
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        recoil_amount: parseFloat(e.target.value)
                                    })}
                                    inputProps={{ min: 0, step: 0.1 }}
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
                <Button onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isLoading || !formData.description || !formData.effect_type}
                >
                    Create Effect
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateEffectDialog;