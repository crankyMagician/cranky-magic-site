import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Alert,
    Container,
    TextField,
    Button,
    Switch,
    FormControlLabel,
    CircularProgress
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useCreateAbilityMutation } from '../../../api/apiSlice';

const CreateAbility = () => {
    const [createAbility, { isLoading, error }] = useCreateAbilityMutation();
    const [formData, setFormData] = useState({
        ability_name: '',
        is_hidden: false,
        description: '',
        object_name: '',
        hide_flags: 0
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAbility(formData);
            setSuccessMessage('Ability created successfully!');
            handleClear();
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
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create New Ability
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} role="alert">
                        Failed to create ability: {error.message}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }} role="alert">
                        {successMessage}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

                    <FormControlLabel
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

                    <TextField
                        fullWidth
                        type="number"
                        label="Hide Flags"
                        value={formData.hide_flags}
                        onChange={(e) => setFormData({
                            ...formData,
                            hide_flags: parseInt(e.target.value)
                        })}
                        inputProps={{ min: 0 }}
                    />

                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
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
                            disabled={isLoading}
                        >
                            Create Ability
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateAbility;