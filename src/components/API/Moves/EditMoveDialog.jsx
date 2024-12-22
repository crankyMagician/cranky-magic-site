import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    Card,
    CardContent,
    IconButton,
    Alert,
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import {
    useUpdateMoveMutation,
    useUpdateEffectMutation,
    useCreateMoveEffectMutation,
    useRemoveEffectMutation,
    useGetMoveEffectsQuery,
} from '../../../api/apiSlice';
import EffectTypeSelect from '../Effects/EffectTypeSelect';
import StatusConditionSelect from '../StatusConditions/StatusConditionSelect';
import EditEffectDialog from '../Effects/EditEffectDialog'; // Ensure the path is correct
import CreateEffectDialog from '../Effects/CreateEffectDialog'; // Ensure the path is correct
import MunchieTypeSelect from '../Munchies/MunchieTypeSelect'; // Ensure the path is correct

const EditMoveDialog = ({
                            open,
                            onClose,
                            editForm,
                            setEditForm,
                            handleSave, // This might be redundant now
                            selectedMove,
                        }) => {
    const [updateMove, { isLoading: isMoveSaving }] = useUpdateMoveMutation();
    const [updateEffect, { isLoading: isEffectSaving }] = useUpdateEffectMutation();
    const [createMoveEffect, { isLoading: isCreatingEffect }] = useCreateMoveEffectMutation();
    const [removeEffect, { isLoading: isRemovingEffect }] = useRemoveEffectMutation();

    // Fetch the effect associated with the move
    const { data: effectData, refetch: refetchEffect } = useGetMoveEffectsQuery(selectedMove?.id, {
        skip: !selectedMove,
    });

    const [localEffectData, setLocalEffectData] = useState(null);
    const [isEditEffectDialogOpen, setIsEditEffectDialogOpen] = useState(false);
    const [isCreateEffectDialogOpen, setIsCreateEffectDialogOpen] = useState(false);
    const [backendError, setBackendError] = useState(null);

    useEffect(() => {
        if (effectData && effectData.length > 0) {
            setLocalEffectData(effectData[0]); // Assuming one effect per move
        } else {
            setLocalEffectData(null);
        }
        setBackendError(null);
    }, [effectData]);

    const categoryOptions = ['PHYSICAL', 'SPECIAL', 'STATUS'];
    const statOptions = ['ATTACK', 'DEFENSE', 'SPECIAL_ATTACK', 'SPECIAL_DEFENSE', 'SPEED', 'ACCURACY', 'EVASION'];

    const handleMoveChange = (field, value) => {
        setEditForm({
            ...editForm,
            [field]: value,
        });
    };

    const handleSaveChanges = async () => {
        try {
            // Only update the move itself
            await updateMove({
                id: selectedMove.id,
                ...editForm,
            }).unwrap();

            // Close the dialog after saving
            onClose();
        } catch (error) {
            console.error('Failed to update move:', error);
            setBackendError(error?.data?.error || 'Failed to update move.');
        }
    };

    const handleEditEffect = () => {
        setIsEditEffectDialogOpen(true);
    };

    const handleEditEffectClose = () => {
        setIsEditEffectDialogOpen(false);
    };

    const handleEditEffectSubmit = async (updatedEffect) => {
        try {
            await updateEffect({
                ...updatedEffect,
                chance: Number(updatedEffect.chance) / 100, // Ensure chance is decimal
            }).unwrap();
            setLocalEffectData(updatedEffect);
            setIsEditEffectDialogOpen(false);
            refetchEffect();
        } catch (error) {
            console.error('Failed to update effect:', error);
            setBackendError(error?.data?.error || 'Failed to update effect.');
        }
    };

    const handleCreateEffect = () => {
        setIsCreateEffectDialogOpen(true);
    };

    const handleCreateEffectClose = () => {
        setIsCreateEffectDialogOpen(false);
    };

    const handleCreateEffectSubmit = async (newEffect) => {
        try {
            const createdEffect = await createMoveEffect({
                ...newEffect,
                move_id: selectedMove.id,
                chance: Number(newEffect.chance) / 100, // Convert to decimal
            }).unwrap();
            setLocalEffectData(createdEffect);
            setIsCreateEffectDialogOpen(false);
            refetchEffect();
        } catch (error) {
            console.error('Failed to create effect:', error);
            setBackendError(error?.data?.error || 'Failed to create effect.');
        }
    };

    const handleRemoveEffect = async () => {
        try {
            if (!localEffectData) return;
            await removeEffect({ move_id: selectedMove.id, effect_id: localEffectData.id }).unwrap();
            setLocalEffectData(null);
            refetchEffect();
        } catch (error) {
            console.error('Failed to remove effect:', error);
            setBackendError(error?.data?.error || 'Failed to remove effect.');
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle>Edit {selectedMove?.move_name}</DialogTitle>
                <DialogContent dividers>
                    {backendError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {backendError}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Move Name"
                                    value={editForm.move_name}
                                    onChange={(e) => handleMoveChange('move_name', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MunchieTypeSelect
                                    value={editForm.munchie_type_id}
                                    onChange={(e) => handleMoveChange('munchie_type_id', e.target.value)}
                                    required
                                    label="Type"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={editForm.category}
                                        onChange={(e) => handleMoveChange('category', e.target.value)}
                                    >
                                        {categoryOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Power"
                                    value={editForm.power}
                                    onChange={(e) => handleMoveChange('power', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="Accuracy"
                                    value={editForm.accuracy}
                                    onChange={(e) =>
                                        handleMoveChange(
                                            'accuracy',
                                            Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                                        )
                                    }
                                    inputProps={{ min: 0, max: 100 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="PP"
                                    value={editForm.pp}
                                    onChange={(e) => handleMoveChange('pp', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="Max PP"
                                    value={editForm.max_pp}
                                    onChange={(e) => handleMoveChange('max_pp', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>High Critical Hit Ratio</InputLabel>
                                    <Select
                                        value={editForm.high_critical_hit_ratio ? 'true' : 'false'}
                                        onChange={(e) =>
                                            handleMoveChange(
                                                'high_critical_hit_ratio',
                                                e.target.value === 'true'
                                            )
                                        }
                                    >
                                        <MenuItem value="false">False</MenuItem>
                                        <MenuItem value="true">True</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Object Name"
                                    value={editForm.object_name}
                                    onChange={(e) => handleMoveChange('object_name', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Hide Flags"
                                    value={editForm.hide_flags}
                                    onChange={(e) => handleMoveChange('hide_flags', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                        </Grid>

                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h6">Effect</Typography>
                                {!localEffectData ? (
                                    <Button
                                        startIcon={<AddIcon />}
                                        onClick={handleCreateEffect}
                                        disabled={isCreatingEffect}
                                    >
                                        Add Effect
                                    </Button>
                                ) : (
                                    <Box>
                                        <Button
                                            startIcon={<EditIcon />}
                                            onClick={handleEditEffect}
                                            sx={{ mr: 1 }}
                                            disabled={isEffectSaving || isRemovingEffect}
                                        >
                                            {isEffectSaving ? <CircularProgress size={20} /> : 'Edit Effect'}
                                        </Button>
                                        <Button
                                            startIcon={<DeleteIcon />}
                                            color="error"
                                            onClick={handleRemoveEffect}
                                            disabled={isRemovingEffect || isEffectSaving}
                                        >
                                            {isRemovingEffect ? <CircularProgress size={20} /> : 'Remove Effect'}
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            {localEffectData && (
                                <Card sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle1">
                                                    <strong>Effect Type:</strong> {localEffectData.effect_type}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1">
                                                    <strong>Description:</strong> {localEffectData.description}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle1">
                                                    <strong>Chance:</strong> {localEffectData.chance * 100}%
                                                </Typography>
                                            </Grid>
                                            {localEffectData.effect_type === 'STATUS' && (
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Status Condition:</strong>{' '}
                                                        {localEffectData.status_condition?.condition_name || 'None'}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {(localEffectData.effect_type === 'STATUS' ||
                                                localEffectData.effect_type === 'STAT_CHANGE') && (
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Duration:</strong> {localEffectData.duration} turns
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {localEffectData.effect_type === 'STAT_CHANGE' && (
                                                <>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="subtitle1">
                                                            <strong>Stat:</strong> {localEffectData.stat}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="subtitle1">
                                                            <strong>Stages:</strong> {localEffectData.stages}
                                                        </Typography>
                                                    </Grid>
                                                </>
                                            )}
                                            {localEffectData.effect_type === 'HEAL' && (
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Heal Amount:</strong> {localEffectData.heal_amount}
                                                    </Typography>
                                                </Grid>
                                            )}
                                            {localEffectData.effect_type === 'DAMAGE' && (
                                                <>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="subtitle1">
                                                            <strong>Minimum Hits:</strong> {localEffectData.min_hits}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="subtitle1">
                                                            <strong>Maximum Hits:</strong> {localEffectData.max_hits}
                                                        </Typography>
                                                    </Grid>
                                                </>
                                            )}
                                            {localEffectData.effect_type === 'RECOIL' && (
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Recoil Amount:</strong> {localEffectData.recoil_amount}
                                                    </Typography>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setEditForm({
                                move_name: selectedMove.move_name,
                                munchie_type_id: selectedMove.munchie_type_id,
                                category: selectedMove.category,
                                power: selectedMove.power,
                                accuracy: selectedMove.accuracy,
                                pp: selectedMove.pp,
                                max_pp: selectedMove.max_pp,
                                high_critical_hit_ratio: selectedMove.high_critical_hit_ratio,
                                object_name: selectedMove.object_name,
                                hide_flags: selectedMove.hide_flags,
                            });
                            setLocalEffectData(effectData?.[0] || null);
                            setBackendError(null);
                        }}
                        startIcon={<ClearIcon />}
                        disabled={isMoveSaving || isEffectSaving || isCreatingEffect || isRemovingEffect}
                    >
                        Revert Changes
                    </Button>
                    <Button
                        onClick={onClose}
                        disabled={isMoveSaving || isEffectSaving || isCreatingEffect || isRemovingEffect}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveChanges}
                        variant="contained"
                        color="primary"
                        startIcon={isMoveSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={
                            isMoveSaving ||
                            !editForm.move_name ||
                            !editForm.category ||
                            editForm.accuracy === '' ||
                            editForm.pp === '' ||
                            editForm.max_pp === ''
                        }
                    >
                        {isMoveSaving ? 'Saving...' : 'Save Changes'}
                    </Button>

                </DialogActions>
            </Dialog>

            {/* Edit Effect Dialog */}
            {localEffectData && (
                <EditEffectDialog
                    open={isEditEffectDialogOpen}
                    onClose={handleEditEffectClose}
                    effect={localEffectData}
                    onSubmit={handleEditEffectSubmit}
                    moveId={selectedMove?.id} // Pass moveId if needed
                />
            )}

            {/* Create Effect Dialog */}
            {!localEffectData && (
                <CreateEffectDialog
                    open={isCreateEffectDialogOpen}
                    onClose={handleCreateEffectClose}
                    onSubmit={handleCreateEffectSubmit}
                    moveId={selectedMove?.id} // Pass moveId if available
                />
            )}
        </>
    )};

    export default EditMoveDialog;
