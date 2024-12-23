import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Alert,
    Stack,
    CircularProgress,
    Button,
    IconButton,
    Grid,
    TextField,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Save as SaveIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import MoveSelect from '../Moves/MoveSelect';
import {
    useGetLearnableMovesByMunchieNameQuery,
    useAddLearnableMovesMutation,
    useRemoveLearnableMovesMutation,
} from '../../../api/apiSlice';

const MunchieLearnableMovesManager = ({ munchieId, munchieName }) => {
    const [moves, setMoves] = useState([]);
    const [pendingMoves, setPendingMoves] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');

    // API hooks
    const { data: learnableMoves, isLoading: isLoadingMoves } = useGetLearnableMovesByMunchieNameQuery(munchieName);
    const [addMoves, { isLoading: isAdding }] = useAddLearnableMovesMutation();
    const [removeMoves, { isLoading: isRemoving }] = useRemoveLearnableMovesMutation();

    useEffect(() => {
        if (learnableMoves) {
            const sortedMoves = [...learnableMoves].sort((a, b) => a.level_learned - b.level_learned);
            setMoves(sortedMoves);
            setPendingMoves(sortedMoves);
        }
    }, [learnableMoves]);

    const handleAddMove = () => {
        setPendingMoves([...pendingMoves, {
            move_id: '',
            level_learned: 1,
            move_name: '',
            munchie_id: munchieId
        }]);
    };

    const handleRemoveMove = async (index, moveId) => {
        try {
            if (moveId) {
                await removeMoves({
                    name: munchieName,
                    move_ids: [moveId]
                }).unwrap();
                setSuccess('Move removed successfully');
            }
            const newMoves = pendingMoves.filter((_, idx) => idx !== index);
            setPendingMoves(newMoves);
        } catch (err) {
            setError(err?.data?.error || 'Failed to remove move');
        }
    };

    const handleMoveChange = (index, field, value) => {
        const newMoves = [...pendingMoves];
        newMoves[index] = {
            ...newMoves[index],
            [field]: value
        };
        setPendingMoves(newMoves);
    };

    const hasDuplicateMoves = () => {
        const moveIds = pendingMoves.map(move => move.move_id).filter(id => id !== '');
        return new Set(moveIds).size !== moveIds.length;
    };

    const hasValidChanges = () => {
        if (hasDuplicateMoves()) return false;
        if (pendingMoves.some(move => !move.move_id || !move.level_learned)) return false;
        return JSON.stringify(moves) !== JSON.stringify(pendingMoves);
    };

    const handleSave = async () => {
        try {
            const movesToAdd = pendingMoves
                .filter(move => !moves.find(m => m.move_id === move.move_id))
                .map(({ move_id, level_learned }) => ({
                    move_id: parseInt(move_id),
                    level_learned: parseInt(level_learned)
                }));

            const movesToRemove = moves
                .filter(move => !pendingMoves.find(m => m.move_id === move.move_id))
                .map(move => move.move_id);

            if (movesToAdd.length > 0) {
                await addMoves({
                    name: munchieName,
                    moves: movesToAdd
                }).unwrap();
            }

            if (movesToRemove.length > 0) {
                await removeMoves({
                    name: munchieName,
                    move_ids: movesToRemove
                }).unwrap();
            }

            setSuccess('Moves updated successfully');
            setError(null);
        } catch (err) {
            setError(err?.data?.error || 'Failed to update moves');
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

    if (isLoadingMoves) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ pb: 8, position: 'relative' }}>
            <AppBar
                position="sticky"
                color="default"
                sx={{
                    top: 0,
                    mb: 2,
                    boxShadow: 2,
                    backgroundColor: 'background.paper'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6">
                        Manage Learnable Moves
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Tooltip title="Add new move">
                            <Button
                                variant="outlined"
                                onClick={handleAddMove}
                                startIcon={<AddIcon />}
                                disabled={isAdding || isRemoving}
                            >
                                Add Move
                            </Button>
                        </Tooltip>
                        <Tooltip title={
                            hasDuplicateMoves()
                                ? "Remove duplicate moves before saving"
                                : "Save all changes"
                        }>
                            <span>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={isAdding ? <CircularProgress size={20} /> : <SaveIcon />}
                                    onClick={handleSave}
                                    disabled={isAdding || isRemoving || !hasValidChanges()}
                                >
                                    {isAdding ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </span>
                        </Tooltip>
                    </Box>
                </Toolbar>
                {(error || success) && (
                    <Box sx={{ px: 2, pb: 2 }}>
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
            </AppBar>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="learnable-moves-content"
                    id="learnable-moves-header"
                >
                    <Typography>Learnable Moves</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack spacing={2} sx={{ px: 2 }}>
                        {pendingMoves.map((move, index) => (
                            <Card key={index} elevation={1}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} md={6}>
                                            <MoveSelect
                                                value={move.move_id}
                                                onChange={(e) => handleMoveChange(index, 'move_id', e.target.value)}
                                                label="Move"
                                                required
                                                error={hasDuplicateMoves() && pendingMoves.filter(m => m.move_id === move.move_id).length > 1}
                                                helperText={hasDuplicateMoves() && pendingMoves.filter(m => m.move_id === move.move_id).length > 1
                                                    ? "This move is already assigned"
                                                    : ""}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Level Learned"
                                                type="number"
                                                value={move.level_learned}
                                                onChange={(e) => handleMoveChange(index, 'level_learned', parseInt(e.target.value))}
                                                inputProps={{ min: 1 }}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                            <Tooltip title="Remove move">
                                                <IconButton
                                                    onClick={() => handleRemoveMove(index, move.move_id)}
                                                    color="error"
                                                    disabled={isRemoving}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                        {pendingMoves.length === 0 && (
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" align="center">
                                        No moves added yet. Click 'Add Move' to begin.
                                    </Typography>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default MunchieLearnableMovesManager;
