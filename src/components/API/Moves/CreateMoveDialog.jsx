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
    IconButton,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import {
    useCreateMoveMutation,
    useGetAllTypesQuery,
    useGetAllStatusConditionsQuery,
    useCreateEffectMutation,
    useAssignEffectMutation,
} from '../../../api/apiSlice';

const CreateMoveDialog = ({ open, onClose }) => {
    const [createMove, { isLoading: isMoveSaving }] = useCreateMoveMutation();
    const [createEffect] = useCreateEffectMutation();
    const [assignEffect] = useAssignEffectMutation();
    const { data: munchieTypes = [], isLoading: isTypesLoading } = useGetAllTypesQuery();
    const { data: statusConditions = [], isLoading: isStatusLoading } = useGetAllStatusConditionsQuery();

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

    const [effects, setEffects] = useState([
        {
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
        },
    ]);

    const categoryOptions = ['PHYSICAL', 'SPECIAL', 'STATUS'];
    const effectTypes = ['DAMAGE', 'STATUS', 'HEAL', 'RECOIL', 'OTHER', 'STAT_CHANGE'];
    const statOptions = ['ATTACK', 'DEFENSE', 'SPECIAL_ATTACK', 'SPECIAL_DEFENSE', 'SPEED', 'ACCURACY', 'EVASION'];

    const handleEffectChange = (index, field, value) => {
        const updatedEffects = [...effects];
        updatedEffects[index] = { ...updatedEffects[index], [field]: value };
        setEffects(updatedEffects);
    };

    const addEffect = () => {
        setEffects([...effects, {
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
        }]);
    };

    const removeEffect = (index) => {
        setEffects(effects.filter((_, i) => i !== index));
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
        setEffects([
            {
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
            },
        ]);
    };

    const handleSubmit = async () => {
        try {
            const moveResult = await createMove(moveData).unwrap();
            for (const effect of effects) {
                const effectResult = await createEffect(effect).unwrap();
                await assignEffect({ move_id: moveResult.id, effect_id: effectResult.id });
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
                        {/* Other Fields */}
                    </Grid>

                    {/* Effects */}
                    <Box>
                        <Typography variant="h6">Effects</Typography>
                        <Button startIcon={<AddIcon />} onClick={addEffect}>
                            Add Effect
                        </Button>
                        {effects.map((effect, index) => (
                            <Card key={index} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        {/* Map all effects inputs here */}
                                    </Grid>
                                    <IconButton onClick={() => removeEffect(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        ))}
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
                >
                    Create Move
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateMoveDialog;
