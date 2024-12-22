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
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {
    useCreateMoveMutation,
    useCreateMoveEffectMutation,
    useGetAllTypesQuery,
} from '../../../api/apiSlice';
import EffectTypeSelect from '../Effects/EffectTypeSelect';
import StatusConditionSelect from '../StatusConditions/StatusConditionSelect';

const CreateMoveDialog = ({ open, onClose }) => {
    const [createMove, { isLoading: isMoveSaving }] = useCreateMoveMutation();
    const [createMoveEffect] = useCreateMoveEffectMutation();
    const { data: munchieTypes = [], isLoading: isTypesLoading } = useGetAllTypesQuery();

    const [moveData, setMoveData] = useState({
        move_name: '',
        munchie_type_id: '',
        category: 'PHYSICAL',
        power: 0,
        accuracy: 100,
        pp: 20,
        max_pp: 20,
        high_critical_hit_ratio: false,
        object_name: '',
        hide_flags: 0,
    });

    const [effect, setEffect] = useState(null); // Single effect

    const categoryOptions = ['PHYSICAL', 'SPECIAL', 'STATUS'];
    const statOptions = ['ATTACK', 'DEFENSE', 'SPECIAL_ATTACK', 'SPECIAL_DEFENSE', 'SPEED', 'ACCURACY', 'EVASION'];

    const handleEffectChange = (field, value) => {
        setEffect((prev) => ({ ...prev, [field]: value }));
    };

    const addEffect = () => {
        setEffect({
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
            hide_flags: 0,
        });
    };

    const removeEffect = () => {
        setEffect(null);
    };

    const handleClear = () => {
        setMoveData({
            move_name: '',
            munchie_type_id: '',
            category: 'PHYSICAL',
            power: 0,
            accuracy: 100,
            pp: 20,
            max_pp: 20,
            high_critical_hit_ratio: false,
            object_name: '',
            hide_flags: 0,
        });
        setEffect(null);
    };

    const handleSubmit = async () => {
        try {
            // Create the move first
            const moveResult = await createMove(moveData).unwrap();

            // Create the effect if it exists
            if (effect) {
                await createMoveEffect({
                    ...effect,
                    move_id: moveResult.id,
                    // Convert chance from percentage to decimal
                    chance: effect.chance / 100,
                }).unwrap();
            }

            handleClear();
            onClose();
        } catch (error) {
            console.error('Failed to create move:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Create New Move</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                label="Move Name"
                                value={moveData.move_name}
                                onChange={(e) => setMoveData({ ...moveData, move_name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={moveData.munchie_type_id}
                                    onChange={(e) => setMoveData({ ...moveData, munchie_type_id: e.target.value })}
                                >
                                    {munchieTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.type_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={moveData.category}
                                    onChange={(e) => setMoveData({ ...moveData, category: e.target.value })}
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
                                value={moveData.power}
                                onChange={(e) => setMoveData({ ...moveData, power: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Accuracy"
                                value={moveData.accuracy}
                                onChange={(e) => setMoveData({ ...moveData, accuracy: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="PP"
                                value={moveData.pp}
                                onChange={(e) => setMoveData({ ...moveData, pp: parseInt(e.target.value) || 0 })}
                            />
                        </Grid>
                    </Grid>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Effect</Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addEffect}
                                disabled={!!effect} // Disable if an effect exists
                            >
                                Add Effect
                            </Button>
                        </Box>

                        {effect && (
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <EffectTypeSelect
                                                value={effect.effect_type}
                                                onChange={(e) => handleEffectChange('effect_type', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Effect Description"
                                                value={effect.description}
                                                onChange={(e) => handleEffectChange('description', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Effect Chance (%)"
                                                value={effect.chance}
                                                onChange={(e) => handleEffectChange('chance', parseInt(e.target.value) || 0)}
                                            />
                                        </Grid>
                                        {effect.effect_type === 'STATUS' && (
                                            <Grid item xs={12} md={6}>
                                                <StatusConditionSelect
                                                    value={effect.status_condition}
                                                    onChange={(e) => handleEffectChange('status_condition', e.target.value)}
                                                />
                                            </Grid>
                                        )}
                                        {effect.effect_type === 'STAT_CHANGE' && (
                                            <>
                                                <Grid item xs={12} md={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Stat</InputLabel>
                                                        <Select
                                                            value={effect.stat}
                                                            onChange={(e) => handleEffectChange('stat', e.target.value)}
                                                        >
                                                            {statOptions.map((option) => (
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
                                                        label="Stages"
                                                        value={effect.stages}
                                                        onChange={(e) => handleEffectChange('stages', parseInt(e.target.value) || 0)}
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                        <Grid item xs={12}>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                color="error"
                                                onClick={removeEffect}
                                            >
                                                Remove Effect
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClear} startIcon={<ClearIcon />}>
                    Clear
                </Button>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    startIcon={isMoveSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isMoveSaving}
                >
                    Create Move
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateMoveDialog;
