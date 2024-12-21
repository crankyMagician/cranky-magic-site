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
    MenuItem
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useCreateItemMutation } from '../../../api/apiSlice';

const CreateItemDialog = ({ open, onClose }) => {
    const [createItem, { isLoading }] = useCreateItemMutation();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        value: 0,
        weight: 0,
        rarity: 'Common',
        item_type: 'Consumable',
        image_url: '',
        object_name: '',
        hide_flags: 0
    });

    const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    const itemTypeOptions = ['Consumable', 'Equipment', 'Key Item', 'Material', 'Quest Item'];

    const handleSubmit = async () => {
        try {
            await createItem(formData);
            handleClear();
            onClose();
        } catch (err) {
            console.error('Failed to create item:', err);
        }
    };

    const handleClear = () => {
        setFormData({
            name: '',
            description: '',
            value: 0,
            weight: 0,
            rarity: 'Common',
            item_type: 'Consumable',
            image_url: '',
            object_name: '',
            hide_flags: 0
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Item</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                    <TextField
                        required
                        fullWidth
                        label="Item Name"
                        value={formData.name}
                        onChange={(e) => setFormData({
                            ...formData,
                            name: e.target.value
                        })}
                    />

                    <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({
                            ...formData,
                            description: e.target.value
                        })}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            required
                            fullWidth
                            type="number"
                            label="Value"
                            value={formData.value}
                            onChange={(e) => setFormData({
                                ...formData,
                                value: parseInt(e.target.value)
                            })}
                            inputProps={{ min: 0 }}
                        />

                        <TextField
                            required
                            fullWidth
                            type="number"
                            label="Weight"
                            value={formData.weight}
                            onChange={(e) => setFormData({
                                ...formData,
                                weight: parseFloat(e.target.value)
                            })}
                            inputProps={{ min: 0, step: 0.1 }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Rarity</InputLabel>
                            <Select
                                value={formData.rarity}
                                label="Rarity"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    rarity: e.target.value
                                })}
                            >
                                {rarityOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel>Item Type</InputLabel>
                            <Select
                                value={formData.item_type}
                                label="Item Type"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    item_type: e.target.value
                                })}
                            >
                                {itemTypeOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <TextField
                        fullWidth
                        label="Image URL"
                        value={formData.image_url}
                        onChange={(e) => setFormData({
                            ...formData,
                            image_url: e.target.value
                        })}
                    />

                   {/* <TextField
                        fullWidth
                        label="Object Name"
                        value={formData.object_name}
                        onChange={(e) => setFormData({
                            ...formData,
                            object_name: e.target.value
                        })}
                        helperText="Internal reference name"
                    />*/}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClear}
                    startIcon={<ClearIcon />}
                    disabled={isLoading}
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
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isLoading}
                >
                    Create Item
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateItemDialog;