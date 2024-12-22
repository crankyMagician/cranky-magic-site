import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Button,
} from '@mui/material';

const EditMoveDialog = ({
                            open,
                            onClose,
                            editForm,
                            setEditForm,
                            handleSave,
                            selectedMove,
                        }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit {selectedMove?.move_name}</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        fullWidth
                        label="Move Name"
                        value={editForm.move_name}
                        onChange={(e) =>
                            setEditForm({
                                ...editForm,
                                move_name: e.target.value,
                            })
                        }
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Power"
                        value={editForm.power}
                        onChange={(e) =>
                            setEditForm({
                                ...editForm,
                                power: parseInt(e.target.value) || 0,
                            })
                        }
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Accuracy"
                        value={editForm.accuracy}
                        onChange={(e) =>
                            setEditForm({
                                ...editForm,
                                accuracy: parseInt(e.target.value) || 0,
                            })
                        }
                        inputProps={{ min: 0, max: 100 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="PP"
                        value={editForm.pp}
                        onChange={(e) =>
                            setEditForm({
                                ...editForm,
                                pp: parseInt(e.target.value) || 0,
                            })
                        }
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Max PP"
                        value={editForm.max_pp}
                        onChange={(e) =>
                            setEditForm({
                                ...editForm,
                                max_pp: parseInt(e.target.value) || 0,
                            })
                        }
                        inputProps={{ min: 0 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMoveDialog;
