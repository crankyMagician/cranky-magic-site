import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useCreateAbilityMutation } from '../../../api/apiSlice';

const CreateAbilityDialog = ({ open, onClose }) => {
    const [createAbility, { isLoading }] = useCreateAbilityMutation();
    const [formData, setFormData] = useState({
        ability_name: '',
        is_hidden: false,
        description: '',
        object_name: '',
        hide_flags: 0
    });

    const handleSubmit = async () => {
        try {
            await createAbility(formData);
            handleClear();
            onClose();
        } catch (err) {
            console.error('Failed to create ability:', err);
        }
    };

    const handleClear = () => {
        setFormData({
            ability_name: '',
            is_hidden: false,
            description: '',
            object_name: '',
            hide_flags: 0
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Ability</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                    <TextField
                        required
                        fullWidth
                        label="Ability Name"
                        value={formData.ability_name}
                        onChange={(e) => setFormData({
                            ...formData,
                            ability_name: e.target.value
                        })}
                    />

                  {/*  <FormControlLabel
                        control={
                            <Switch
                                checked={formData.is_hidden}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    is_hidden: e.target.checked
                                })}
                            />
                        }
                        label="Hidden Ability"
                    />
*/}
                    <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({
                            ...formData,
                            description: e.target.value
                        })}
                    />

                    <TextField
                        fullWidth
                        label="Object Name"
                        value={formData.object_name}
                        onChange={(e) => setFormData({
                            ...formData,
                            object_name: e.target.value
                        })}
                        helperText="Internal reference name"
                    />

               {/*     <TextField
                        fullWidth
                        type="number"
                        label="Hide Flags"
                        value={formData.hide_flags}
                        onChange={(e) => setFormData({
                            ...formData,
                            hide_flags: parseInt(e.target.value)
                        })}
                        inputProps={{ min: 0 }}
                    />*/}
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
                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isLoading}
                >
                    Create Ability
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateAbilityDialog;