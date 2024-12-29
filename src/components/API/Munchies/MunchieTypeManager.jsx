import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    Paper,
    Chip,
    Stack,
    Alert,
    Fade,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
    useGetAllTypesQuery,
    useUpdateMunchieTypeMutation,
    useGetMunchieAllInfoByIdQuery
} from '../../../api/apiSlice';

const MunchieTypeManager = ({ munchieId }) => {
    const {
        data: munchieInfo,
        isLoading: isMunchieLoading,
        isError: isMunchieError
    } = useGetMunchieAllInfoByIdQuery(munchieId);

    const {
        data: types,
        isLoading: isTypesLoading,
        isError: isTypesError
    } = useGetAllTypesQuery();

    const [updateMunchieType, { isLoading: isUpdating }] = useUpdateMunchieTypeMutation();

    // Track both type slots separately
    const [typeSlot1, setTypeSlot1] = useState('');
    const [typeSlot2, setTypeSlot2] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (munchieInfo?.types) {
            setTypeSlot1(munchieInfo.types[0]?.id || '');
            setTypeSlot2(munchieInfo.types[1]?.id || '');
        }
    }, [munchieInfo]);

    // Clear messages after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [success, error]);

    const handleSave = async () => {
        const typeIds = [typeSlot1, typeSlot2].filter(Boolean); // Include only non-empty slots

        if (typeIds.length === 0) {
            setError('At least one type must be selected');
            return;
        }

        if (typeIds.length > 2) {
            setError('Only up to two types are allowed');
            return;
        }

        try {
            await updateMunchieType({ munchieId, typeIds }).unwrap(); // Pass the array directly
            setSuccess('Types updated successfully');
        } catch (err) {
            setError(err?.data?.error || 'Failed to update types');
        }
    };


    const getTypeName = (typeId) => {
        return types?.find(t => t.id === typeId)?.type_name || '';
    };

    if (!munchieId) {
        return (
            <Alert severity="error">
                Invalid munchie ID. Please check the configuration.
            </Alert>
        );
    }

    if (isMunchieLoading || isTypesLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isMunchieError || isTypesError) {
        return (
            <Alert severity="error">
                Failed to load data. Please try again later.
            </Alert>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Manage Types
            </Typography>

            {(error || success) && (
                <Box sx={{ mb: 2 }}>
                    {error && (
                        <Fade in={!!error}>
                            <Alert severity="error" onClose={() => setError('')}>
                                {error}
                            </Alert>
                        </Fade>
                    )}
                    {success && (
                        <Fade in={!!success}>
                            <Alert severity="success" onClose={() => setSuccess('')}>
                                {success}
                            </Alert>
                        </Fade>
                    )}
                </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Primary Type</InputLabel>
                    <Select
                        value={typeSlot1}
                        onChange={(e) => setTypeSlot1(e.target.value)}
                        label="Primary Type"
                        disabled={isUpdating}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {types?.map((type) => (
                            <MenuItem
                                key={type.id}
                                value={type.id}
                                disabled={type.id === typeSlot2} // Prevent duplicate selection
                            >
                                {type.type_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel>Secondary Type</InputLabel>
                    <Select
                        value={typeSlot2}
                        onChange={(e) => setTypeSlot2(e.target.value)}
                        label="Secondary Type"
                        disabled={isUpdating || !typeSlot1} // Require primary type first
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {types?.map((type) => (
                            <MenuItem
                                key={type.id}
                                value={type.id}
                                disabled={type.id === typeSlot1} // Prevent duplicate selection
                            >
                                {type.type_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Typography variant="subtitle2">
                    Current Types:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {typeSlot1 && (
                        <Chip
                            label={`${getTypeName(typeSlot1)} (Primary)`}
                            color="primary"
                            onDelete={() => setTypeSlot1('')}
                            deleteIcon={<DeleteIcon />}
                        />
                    )}
                    {typeSlot2 && (
                        <Chip
                            label={`${getTypeName(typeSlot2)} (Secondary)`}
                            color="secondary"
                            onDelete={() => setTypeSlot2('')}
                            deleteIcon={<DeleteIcon />}
                        />
                    )}
                    {!typeSlot1 && !typeSlot2 && (
                        <Typography variant="body2" color="text.secondary">
                            No types assigned
                        </Typography>
                    )}
                </Stack>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={isUpdating || (!typeSlot1 && !typeSlot2)}
                    startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Paper>
    );
};

export default MunchieTypeManager;
