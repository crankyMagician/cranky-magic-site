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
import CreateEffectDialog from '../Effects/CreateEffectDialog'; // Make sure the path is correct

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

    const [effectData, setEffectData] = useState(null);
    const [isEffectDialogOpen, setIsEffectDialogOpen] = useState(false);

    const categoryOptions = ['PHYSICAL', 'SPECIAL', 'STATUS'];
    const statOptions = ['ATTACK', 'DEFENSE', 'SPECIAL_ATTACK', 'SPECIAL_DEFENSE', 'SPEED', 'ACCURACY', 'EVASION'];

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
        setEffectData(null);
    };

    const handleSubmit = async () => {
        try {
            // Create the move first
            const moveResult = await createMove(moveData).unwrap();

            // Create the effect if it exists
            if (effectData) {
                await createMoveEffect({
                    ...effectData,
                    move_id: moveResult.id,
                    // Ensure chance is a decimal between 0 and 1
                    chance: Number(effectData.chance) / 100,
                }).unwrap();
            }

            handleClear();
            onClose();
        } catch (error) {
            console.error('Failed to create move:', error);
        }
    };

    const handleAddEffect = () => {
        setIsEffectDialogOpen(true);
    };

    const handleEffectClose = () => {
        setIsEffectDialogOpen(false);
    };

    const handleEffectSubmit = (newEffectData) => {
        setEffectData(newEffectData);
        setIsEffectDialogOpen(false);
    };

    return (
        <>
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
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="Accuracy"
                                    value={moveData.accuracy}
                                    onChange={(e) => setMoveData({ ...moveData, accuracy: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                                    inputProps={{ min: 0, max: 100 }}
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
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    label="Max PP"
                                    value={moveData.max_pp}
                                    onChange={(e) => setMoveData({ ...moveData, max_pp: parseInt(e.target.value) || 0 })}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>High Critical Hit Ratio</InputLabel>
                                    <Select
                                        value={moveData.high_critical_hit_ratio ? 'true' : 'false'}
                                        onChange={(e) => setMoveData({ ...moveData, high_critical_hit_ratio: e.target.value === 'true' })}
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
                                    value={moveData.object_name}
                                    onChange={(e) => setMoveData({ ...moveData, object_name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Hide Flags"
                                    value={moveData.hide_flags}
                                    onChange={(e) => setMoveData({ ...moveData, hide_flags: parseInt(e.target.value) || 0 })}
                                    inputProps={{ min: 0 }}
                                />
                            </Grid>
                        </Grid>

                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Effect</Typography>
                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={handleAddEffect}
                                    disabled={!!effectData} // Disable if an effect exists
                                >
                                    Add Effect
                                </Button>
                            </Box>

                            {effectData && (
                                <Card sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle1"><strong>Effect Type:</strong> {effectData.effect_type}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle1"><strong>Description:</strong> {effectData.description}</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle1"><strong>Chance:</strong> {effectData.chance}%</Typography>
                                            </Grid>
                                            {effectData.effect_type === 'STATUS' && (
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle1"><strong>Status Condition:</strong> {effectData.status_condition}</Typography>
                                                </Grid>
                                            )}
                                            {(effectData.effect_type === 'STATUS' || effectData.effect_type === 'STAT_CHANGE') && (
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle1"><strong>Duration:</strong> {effectData.duration} turns</Typography>
                                                </Grid>
                                            )}
                                            {effectData.effect_type === 'STAT_CHANGE' && (
                                                <>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="subtitle1"><strong>Stat:</strong> {effectData.stat}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="subtitle1"><strong>Stages:</strong> {effectData.stages}</Typography>
                                                    </Grid>
                                                </>
                                            )}
                                            {effectData.effect_type === 'HEAL' && (
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle1"><strong>Heal Amount:</strong> {effectData.heal_amount}</Typography>
                                                </Grid>
                                            )}
                                            {effectData.effect_type === 'DAMAGE' && (
                                                <>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="subtitle1"><strong>Minimum Hits:</strong> {effectData.min_hits}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography variant="subtitle1"><strong>Maximum Hits:</strong> {effectData.max_hits}</Typography>
                                                    </Grid>
                                                </>
                                            )}
                                            {effectData.effect_type === 'RECOIL' && (
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle1"><strong>Recoil Amount:</strong> {effectData.recoil_amount}</Typography>
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <Button
                                                    startIcon={<DeleteIcon />}
                                                    color="error"
                                                    onClick={() => setEffectData(null)}
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
                    <Button
                        onClick={handleClear}
                        startIcon={<ClearIcon />}
                        disabled={isMoveSaving}
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
                        startIcon={isMoveSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                        disabled={isMoveSaving || !moveData.move_name || !moveData.category || moveData.accuracy === '' || moveData.pp === '' || moveData.max_pp === ''}
                    >
                        Create Move
                    </Button>
                </DialogActions>
            </Dialog>

            <CreateEffectDialog
                open={isEffectDialogOpen}
                onClose={handleEffectClose}
                onSubmit={handleEffectSubmit}
            />
        </>
    )};


    export default CreateMoveDialog;