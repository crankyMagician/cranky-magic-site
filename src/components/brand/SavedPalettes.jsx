import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Button,
    TextField,
    IconButton,
    Tooltip,
    Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import {
    savePalette,
    updateSavedPalette,
    loadPalette,
    renamePalette,
    duplicatePalette,
    deletePalette,
} from '../../reducers/themeSlice';

const stripeFor = (brand, mode) => {
    const c = brand?.colors?.[mode] || {};
    return [c.primary?.main, c.secondary?.main, c.background?.default, c.text?.primary];
};

const SavedPalettes = () => {
    const dispatch = useDispatch();
    const saved = useSelector((state) => state.theme.savedPalettes);
    const activeId = useSelector((state) => state.theme.activePaletteId);
    const customBrand = useSelector((state) => state.theme.customBrand);
    const brandMode = useSelector((state) => state.theme.brandMode);

    const [name, setName] = useState('');

    const onSave = useCallback(() => {
        dispatch(savePalette({ name }));
        setName('');
    }, [dispatch, name]);

    if (!customBrand) return null;

    return (
        <Box sx={{ mb: 5 }} data-testid="saved-palettes">
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                Your palettes
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, maxWidth: 760 }}>
                Save the palette you are editing under a name and come back to it. Saving takes a
                copy, so carrying on editing does not rewrite what you kept.
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                        size="small"
                        label="Name this palette"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') onSave(); }}
                        inputProps={{ 'data-testid': 'palette-name-input' }}
                        sx={{ minWidth: 240 }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={onSave}
                        data-testid="palette-save"
                    >
                        Save as new
                    </Button>
                    {activeId && (
                        <Button
                            variant="outlined"
                            onClick={() => dispatch(updateSavedPalette(activeId))}
                            data-testid="palette-overwrite"
                        >
                            Update the one loaded
                        </Button>
                    )}
                </Box>
            </Paper>

            {saved.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Nothing saved yet.
                </Typography>
            )}

            <Grid container spacing={2}>
                {saved.map((entry) => {
                    const active = entry.id === activeId;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={entry.id}>
                            <Paper
                                variant="outlined"
                                data-testid={`palette-card-${entry.id}`}
                                sx={{
                                    p: 1.5,
                                    outline: active ? '2px solid' : 'none',
                                    outlineColor: 'primary.main',
                                }}
                            >
                                <Box sx={{ display: 'flex', height: 30, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                                    {stripeFor(entry.brand, brandMode).map((colour, i) => (
                                        <Box key={i} sx={{ flex: i === 0 ? 2 : 1, bgcolor: colour || 'transparent' }} />
                                    ))}
                                </Box>

                                <TextField
                                    fullWidth
                                    variant="standard"
                                    value={entry.name}
                                    onChange={(e) => dispatch(renamePalette({ id: entry.id, name: e.target.value }))}
                                    inputProps={{ 'data-testid': `palette-rename-${entry.id}`, style: { fontWeight: 600 } }}
                                />

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                                    <Button
                                        size="small"
                                        variant={active ? 'contained' : 'outlined'}
                                        startIcon={active ? <CheckIcon /> : null}
                                        onClick={() => dispatch(loadPalette(entry.id))}
                                        data-testid={`palette-load-${entry.id}`}
                                    >
                                        {active ? 'Loaded' : 'Load'}
                                    </Button>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Tooltip title="Duplicate">
                                        <IconButton
                                            size="small"
                                            onClick={() => dispatch(duplicatePalette(entry.id))}
                                            data-testid={`palette-duplicate-${entry.id}`}
                                        >
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton
                                            size="small"
                                            onClick={() => dispatch(deletePalette(entry.id))}
                                            data-testid={`palette-delete-${entry.id}`}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                {entry.brand?.palette && (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label="has theme overrides"
                                        sx={{ mt: 1, height: 20, fontSize: 10 }}
                                    />
                                )}
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default SavedPalettes;
