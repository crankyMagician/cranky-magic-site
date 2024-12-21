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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCreateRecipeMutation } from '../../../api/apiSlice';
import ItemSelect from '../Items/ItemSelect';

const CreateCraftingRecipeDialog = ({ open, onClose }) => {
    const [createRecipe, { isLoading }] = useCreateRecipeMutation();
    const [formData, setFormData] = useState({
        recipe_name: '',
        description: '',
        crafting_time: 0,
        experience_gained: 0,
        required_crafting_level: 1,
        result_item_id: '',
        result_munchie_id: '',
        recipe_type: '',
        ingredients: []
    });

    const recipeTypes = [
        'Crafting',
        'Cooking',
        'Alchemy',
        'Smithing',
        'Engineering',
        'Enchanting'
    ];

    const handleSubmit = async () => {
        try {
            const submissionData = {
                ...formData,
                result_item_id: formData.result_item_id || null,
                result_munchie_id: formData.result_munchie_id || null,
                ingredients: formData.ingredients.map(ing => ({
                    ...ing,
                    item_id: Number(ing.item_id),
                    quantity: Number(ing.quantity)
                }))
            };
            await createRecipe(submissionData);
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
            result_item_id: '',
            result_munchie_id: '',
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

    const isFormValid = () => {
        return (
            formData.recipe_name &&
            formData.recipe_type &&
            (formData.result_item_id || formData.result_munchie_id) &&
            formData.ingredients.length > 0 &&
            formData.ingredients.every(ing => ing.item_id && ing.quantity > 0)
        );
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

                    <FormControl required fullWidth>
                        <InputLabel>Recipe Type</InputLabel>
                        <Select
                            value={formData.recipe_type}
                            label="Recipe Type"
                            onChange={(e) => setFormData({
                                ...formData,
                                recipe_type: e.target.value
                            })}
                        >
                            {recipeTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <ItemSelect
                            value={formData.result_item_id}
                            onChange={(e) => setFormData({
                                ...formData,
                                result_item_id: e.target.value,
                                result_munchie_id: ''
                            })}
                            label="Result Item"
                        />

                        <TextField
                            type="number"
                            label="Result Munchie ID"
                            value={formData.result_munchie_id}
                            onChange={(e) => setFormData({
                                ...formData,
                                result_munchie_id: e.target.value,
                                result_item_id: ''
                            })}
                            inputProps={{ min: 0 }}
                            helperText="Leave empty if using Result Item"
                        />
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">Ingredients</Typography>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddIngredient}
                                variant="contained"
                                color="secondary"
                            >
                                Add Ingredient
                            </Button>
                        </Box>

                        {formData.ingredients.map((ingredient, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <ItemSelect
                                    value={ingredient.item_id}
                                    onChange={(e) => handleIngredientChange(index, 'item_id', e.target.value)}
                                    label={`Ingredient ${index + 1}`}
                                    required
                                />
                                <TextField
                                    required
                                    type="number"
                                    label="Quantity"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, 'quantity', Number(e.target.value))}
                                    inputProps={{ min: 1 }}
                                    sx={{ width: '150px' }}
                                />
                                <IconButton
                                    onClick={() => handleRemoveIngredient(index)}
                                    color="error"
                                    size="large"
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
                    disabled={isLoading || !isFormValid()}
                >
                    Create Recipe
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCraftingRecipeDialog;