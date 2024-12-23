import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Alert,
    Chip,
    Stack,
    CircularProgress,
    Button
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import AbilitySelect from '../Abilities/AbilitySelect';
import {
    useUpdateAbilitiesMutation,
    useGetMunchieAllInfoByIdQuery
} from '../../../api/apiSlice';

const MunchieAbilitiesManager = ({ munchieId }) => {
    const [selectedAbilityId, setSelectedAbilityId] = useState('');
    const [currentAbilities, setCurrentAbilities] = useState([]);
    const [pendingAbilities, setPendingAbilities] = useState([]);
    const [updateAbilities, { isLoading: isUpdating }] = useUpdateAbilitiesMutation();
    const { data: munchieInfo, isLoading: isLoadingMunchie } = useGetMunchieAllInfoByIdQuery(munchieId);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (munchieInfo?.abilities) {
            setCurrentAbilities(munchieInfo.abilities);
            setPendingAbilities(munchieInfo.abilities);
        }
    }, [munchieInfo]);

    const handleAbilityChange = (event) => {
        const newAbilityId = Number(event.target.value);
        if (!newAbilityId) return;

        // Check if ability is already in pending list
        if (!pendingAbilities.some(ability => ability.id === newAbilityId)) {
            const newAbility = munchieInfo?.abilities?.find(a => a.id === newAbilityId) || {
                id: newAbilityId,
                ability_name: event.target.options[event.target.selectedIndex].text,
                is_hidden: false // Default value, will be updated when saved
            };

            setPendingAbilities([...pendingAbilities, newAbility]);
        }
        setSelectedAbilityId('');
    };

    const handleRemoveAbility = (abilityId) => {
        setPendingAbilities(pendingAbilities.filter(ability => ability.id !== abilityId));
    };

    const handleSave = async () => {
        try {
            const currentIds = currentAbilities.map(ability => ability.id);
            const pendingIds = pendingAbilities.map(ability => ability.id);

            const addAbilities = pendingIds.filter(id => !currentIds.includes(id));
            const removeAbilities = currentIds.filter(id => !pendingIds.includes(id));

            const payload = {
                add_abilities: addAbilities,
                remove_abilities: removeAbilities
            };

            const result = await updateAbilities({ id: munchieId, ...payload }).unwrap();
            setCurrentAbilities(result.abilities);
            setPendingAbilities(result.abilities);
            setSuccess('Abilities updated successfully');
            setError(null);
        } catch (err) {
            setError(err?.data?.error || 'Failed to update abilities');
            setSuccess('');
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccess('');
            setError(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [success, error]);

    if (isLoadingMunchie) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
            </Box>
        );
    }

    const hasChanges = JSON.stringify(currentAbilities) !== JSON.stringify(pendingAbilities);

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Manage Abilities
            </Typography>

            {(error || success) && (
                <Box sx={{ mb: 2 }}>
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess('')}>
                            {success}
                        </Alert>
                    )}
                </Box>
            )}

            <Box sx={{ mb: 3 }}>
                <AbilitySelect
                    value={selectedAbilityId}
                    onChange={handleAbilityChange}
                    label="Add Ability"
                    disabled={isUpdating}
                />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
                Current Abilities:
            </Typography>

            {isUpdating ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    {pendingAbilities.map((ability) => (
                        <Chip
                            key={ability.id}
                            label={ability.ability_name}
                            onDelete={() => handleRemoveAbility(ability.id)}
                            color={ability.is_hidden ? "secondary" : "primary"}
                            sx={{ m: 0.5 }}
                        />
                    ))}
                    {pendingAbilities.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                            No abilities assigned
                        </Typography>
                    )}
                </Stack>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={isUpdating || !hasChanges}
                >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Paper>
    );
};

export default MunchieAbilitiesManager;