import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Alert,
    Stack,
    CircularProgress,
    Button,
    IconButton,
    Grid,
    TextField,
    Divider,
} from '@mui/material';
import { Save as SaveIcon, Delete as DeleteIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import MunchieSelect from '../Munchies/MunchieSelect';
import ItemSelect from '../Items/ItemSelect';
import {
    useUpdateEvolutionChainMutation,
    useRemoveEvolutionMutation,
    useGetMunchieAllInfoByIdQuery
} from '../../../api/apiSlice';

const MunchieEvolutionManager = ({ munchieId }) => {
    const [updateEvolutionChain, { isLoading: isUpdating }] = useUpdateEvolutionChainMutation();
    const [removeEvolution, { isLoading: isRemoving }] = useRemoveEvolutionMutation();
    const { data: munchieInfo, isLoading: isLoadingMunchie } = useGetMunchieAllInfoByIdQuery(munchieId);

    const [evolutionChain, setEvolutionChain] = useState([]);
    const [editedFields, setEditedFields] = useState({});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (munchieInfo?.evolutions) {
            // Sort evolutions by evolution_step to maintain chain order
            const sortedEvolutions = [...munchieInfo.evolutions].sort((a, b) => a.evolution_step - b.evolution_step);

            // Build evolution chain with source IDs
            const chain = sortedEvolutions.map((evo, index) => {
                const sourceId = index === 0 ? munchieId : sortedEvolutions[index - 1].target_id;
                return {
                    source_munch_id: sourceId,
                    target_munch_id: evo.target_id,
                    required_level: evo.required_level,
                    required_item_id: evo.required_item_id || null,
                    required_friendship: evo.required_friendship || null,
                    from_munchie: evo.from_munchie,
                    to_munchie: evo.to_munchie,
                    evolution_step: evo.evolution_step
                };
            });
            setEvolutionChain(chain);
        }
    }, [munchieInfo, munchieId]);

    const handleAddEvolution = () => {
        const lastEvolution = evolutionChain[evolutionChain.length - 1];
        const fromMunchie = lastEvolution ? lastEvolution.to_munchie : munchieInfo?.munchie?.name;
        const sourceId = lastEvolution ? lastEvolution.target_munch_id : munchieId;
        const newStep = lastEvolution ? lastEvolution.evolution_step + 1 : 1;

        setEvolutionChain([...evolutionChain, {
            source_munch_id: sourceId,
            target_munch_id: '',
            required_level: 1,
            required_item_id: null,
            required_friendship: null,
            from_munchie: fromMunchie,
            to_munchie: '',
            evolution_step: newStep
        }]);
    };

    const handleRemoveEvolution = async (index, sourceId, targetId) => {
        if (targetId && sourceId) {
            try {
                await removeEvolution({
                    munchieId: sourceId,
                    targetId
                }).unwrap();
                // Remove this evolution and any subsequent evolutions in the chain
                const newChain = evolutionChain.slice(0, index);
                setEvolutionChain(newChain);
                setSuccess('Evolution and subsequent chain removed successfully');
            } catch (err) {
                setError(err?.data?.error || 'Failed to remove evolution');
            }
        } else {
            const newChain = evolutionChain.slice(0, index);
            setEvolutionChain(newChain);
        }
    };

    const handleEvolutionChange = (index, field, value) => {
        const newChain = [...evolutionChain];
        newChain[index] = {
            ...newChain[index],
            [field]: value
        };

        // Track edited fields with source munchie ID
        setEditedFields({
            ...editedFields,
            [newChain[index].source_munch_id]: {
                ...editedFields[newChain[index].source_munch_id],
                [field]: true,
                evolutionData: newChain[index]
            }
        });

        setEvolutionChain(newChain);
    };

    const handleSave = async () => {
        try {
            // Group edited evolutions by source munchie
            const editedEvolutions = Object.entries(editedFields).map(([sourceId, data]) => ({
                id: parseInt(sourceId),
                evolutions: [{
                    target_munch_id: data.evolutionData.target_munch_id,
                    required_level: data.evolutionData.required_level,
                    required_item_id: data.evolutionData.required_item_id,
                    required_friendship: data.evolutionData.required_friendship
                }]
            }));

            if (editedEvolutions.length === 0) {
                setError('No changes to save');
                return;
            }

            // Update each evolution relationship separately
            for (const evolution of editedEvolutions) {
                await updateEvolutionChain({
                    id: evolution.id,
                    evolutions: evolution.evolutions
                }).unwrap();
            }

            setSuccess('Evolution chain updated successfully');
            setError(null);
            setEditedFields({});
        } catch (err) {
            setError(err?.data?.error || 'Failed to update evolution chain');
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

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Manage Evolution Chain
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

            <Stack spacing={3}>
                {evolutionChain.map((evolution, index) => (
                    <Box key={index}>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Evolution Step {evolution.evolution_step}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography>{evolution.from_munchie} (ID: {evolution.source_munch_id})</Typography>
                            <ArrowDownwardIcon sx={{ mx: 1 }} />
                            <Typography>{evolution.to_munchie || 'Select Target'}</Typography>
                        </Box>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <MunchieSelect
                                    value={evolution.target_munch_id}
                                    onChange={(e) => handleEvolutionChange(index, 'target_munch_id', e.target.value)}
                                    label="Evolves Into"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    label="Required Level"
                                    type="number"
                                    value={evolution.required_level}
                                    onChange={(e) => handleEvolutionChange(index, 'required_level', parseInt(e.target.value))}
                                    inputProps={{ min: 1 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <ItemSelect
                                    value={evolution.required_item_id || ''}
                                    onChange={(e) => handleEvolutionChange(index, 'required_item_id', e.target.value)}
                                    label="Required Item"
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    fullWidth
                                    label="Required Friendship"
                                    type="number"
                                    value={evolution.required_friendship || ''}
                                    onChange={(e) => handleEvolutionChange(index, 'required_friendship', parseInt(e.target.value))}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <IconButton
                                    onClick={() => handleRemoveEvolution(index, evolution.source_munch_id, evolution.target_munch_id)}
                                    color="error"
                                    disabled={isRemoving}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        {index < evolutionChain.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                ))}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                    variant="outlined"
                    onClick={handleAddEvolution}
                    disabled={isUpdating || isRemoving}
                >
                    Add Evolution Step
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={isUpdating || isRemoving || Object.keys(editedFields).length === 0}
                >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Paper>
    );
};

export default MunchieEvolutionManager;