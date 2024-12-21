import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCreateRecipeMutation } from '../../../api/apiSlice';

const CreateCraftingRecipeDialog = ({ open, onClose }) => {
    const [createRecipe, { isLoading }] = useCreateRecipeMutation();
    const [formData, setFormData] = useState({
        recipe_name: '',
        description: '',
        crafting_time: 0,
        experience_gained: 0,
        required_crafting_level: 1,
        result_item_id: null,
        result_munchie_id: null,
        recipe_type: '',
        ingredients: []
    });

    const handleSubmit = async () => {
        try {
            await createRecipe(formData);
            handleClear();
            onClose();
        } catch (err) {
            console.error('Failed to create recipe:', err);
        }
    };

    const handleClear = () => {
        setFormData({
            recipe_name: '',
            description: '',
            crafting_time: 0,
            experience_gained: 0,
            required_crafting_level: 1,
            result_item_id: null,
            result_munchie_id: null,
            recipe_type: '',
            ingredients: []
        });
    };

    const handleAddIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { item_id: '', quantity: 1 }]
        }));
    };

    const handleRemoveIngredient = (index) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
    };

    const handleIngredientChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            ingredients: prev.ingredients.map((ingredient, i) =>
                i === index ? { ...ingredient, [field]: value } : ingredient
            )
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Crafting Recipe</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                    <TextField
                        required
                        fullWidth
                        label="Recipe Name"
                        value={formData.recipe_name}
                        onChange={(e) => setFormData({
                            ...formData,
                            recipe_name: e.target.value
                        })}
                    />

                    <TextField
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
                            type="number"
                            label="Crafting Time (seconds)"
                            value={formData.crafting_time}
                            onChange={(e) => setFormData({
                                ...formData,
                                crafting_time: Number(e.target.value)
                            })}
                            inputProps={{ min: 0 }}
                        />

                        <TextField
                            required
                            type="number"
                            label="Experience Gained"
                            value={formData.experience_gained}
                            onChange={(e) => setFormData({
                                ...formData,
                                experience_gained: Number(e.target.value)
                            })}
                            inputProps={{ min: 0 }}
                        />

                        <TextField
                            required
                            type="number"
                            label="Required Level"
                            value={formData.required_crafting_level}
                            onChange={(e) => setFormData({
                                ...formData,
                                required_crafting_level: Number(e.target.value)
                            })}
                            inputProps={{ min: 1 }}
                        />
                    </Box>

                    <TextField
                        required
                        fullWidth
                        label="Recipe Type"
                        value={formData.recipe_type}
                        onChange={(e) => setFormData({
                            ...formData,
                            recipe_type: e.target.value
                        })}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            type="number"
                            label="Result Item ID"
                            value={formData.result_item_id || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                result_item_id: e.target.value ? Number(e.target.value) : null,
                                result_munchie_id: null
                            })}
                            inputProps={{ min: 0 }}
                        />

                        <TextField
                            type="number"
                            label="Result Munchie ID"
                            value={formData.result_munchie_id || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                result_munchie_id: e.target.value ? Number(e.target.value) : null,
                                result_item_id: null
                            })}
                            inputProps={{ min: 0 }}
                        />
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Ingredients</Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddIngredient}
                            >
                                Add Ingredient
                            </Button>
                        </Box>

                        {formData.ingredients.map((ingredient, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    required
                                    type="number"
                                    label="Item ID"
                                    value={ingredient.item_id}
                                    onChange={(e) => handleIngredientChange(index, 'item_id', Number(e.target.value))}
                                    inputProps={{ min: 0 }}
                                />
                                <TextField
                                    required
                                    type="number"
                                    label="Quantity"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
                                    inputProps={{ min: 1 }}
                                />
                                <IconButton
                                    onClick={() => handleRemoveIngredient(index)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
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
                    Create Recipe
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCraftingRecipeDialog;