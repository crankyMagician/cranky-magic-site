import React, { useState } from 'react';
import CreateCraftingRecipeDialog from './CreateCraftingRecipeDialog';
import {
    Box,
    Paper,
    Typography,
    Alert,
    Container,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Add,
    AccessTime as TimeIcon,
    EmojiEvents as ExperienceIcon,
    Grade as LevelIcon,
    Category as TypeIcon,
    Search as SearchIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import {
    useGetAllRecipesQuery,
    useEditRecipeMutation
} from '../../../api/apiSlice';

const CraftingRecipesDataGrid = () => {
    const { data, error, isLoading } = useGetAllRecipesQuery();
    const [updateRecipe] = useEditRecipeMutation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [editForm, setEditForm] = useState({
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

    const handleEditClick = (params) => {
        setSelectedRecipe(params);
        setEditForm({
            recipe_name: params.recipe_name,
            description: params.description,
            crafting_time: params.crafting_time,
            experience_gained: params.experience_gained,
            required_crafting_level: params.required_crafting_level,
            result_item_id: params.result_item_id,
            result_munchie_id: params.result_munchie_id,
            recipe_type: params.recipe_type,
            ingredients: params.ingredients || []
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            await updateRecipe({
                id: selectedRecipe.id,
                ...editForm
            });
            setOpenDialog(false);
        } catch (err) {
            console.error('Failed to update recipe:', err);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'recipe_name', headerName: 'Recipe Name', flex: 1, minWidth: 150 },
        {
            field: 'crafting_time',
            headerName: 'Time',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon color="primary" />
                    <span>Time (s)</span>
                </Box>
            )
        },
        {
            field: 'experience_gained',
            headerName: 'XP',
            width: 100,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ExperienceIcon color="secondary" />
                    <span>XP</span>
                </Box>
            )
        },
        {
            field: 'required_crafting_level',
            headerName: 'Level',
            width: 100,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LevelIcon color="warning" />
                    <span>Level</span>
                </Box>
            )
        },
        {
            field: 'recipe_type',
            headerName: 'Type',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TypeIcon color="info" />
                    <span>Type</span>
                </Box>
            )
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            minWidth: 200
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleEditClick(params.row)}
                    aria-label={`Edit ${params.row.recipe_name}`}
                >
                    <EditIcon />
                </IconButton>
            )
        }
    ];

    const recipes = Array.isArray(data) ? data : [];
    const filteredRecipes = recipes.filter(recipe =>
        recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return (
            <Container>
                <Alert severity="error" role="alert">
                    Failed to load recipes: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Crafting Recipes
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCreateDialog(true)}
                    startIcon={<Add />}
                >
                    Create Recipe
                </Button>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ mb: 4 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <DataGrid
                    rows={filteredRecipes}
                    columns={columns}
                    loading={isLoading}
                    autoHeight
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    disableSelectionOnClick
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    getRowId={(row) => row.id}
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                    }}
                />
            </Paper>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Edit {selectedRecipe?.recipe_name}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Recipe Name"
                            value={editForm.recipe_name}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                recipe_name: e.target.value
                            })}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            value={editForm.description}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                description: e.target.value
                            })}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                type="number"
                                label="Crafting Time"
                                value={editForm.crafting_time}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    crafting_time: Number(e.target.value)
                                })}
                                inputProps={{ min: 0 }}
                            />

                            <TextField
                                type="number"
                                label="Experience"
                                value={editForm.experience_gained}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    experience_gained: Number(e.target.value)
                                })}
                                inputProps={{ min: 0 }}
                            />

                            <TextField
                                type="number"
                                label="Required Level"
                                value={editForm.required_crafting_level}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    required_crafting_level: Number(e.target.value)
                                })}
                                inputProps={{ min: 1 }}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            label="Recipe Type"
                            value={editForm.recipe_type}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                recipe_type: e.target.value
                            })}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                type="number"
                                label="Result Item ID"
                                value={editForm.result_item_id || ''}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    result_item_id: e.target.value ? Number(e.target.value) : null,
                                    result_munchie_id: null
                                })}
                            />

                            <TextField
                                type="number"
                                label="Result Munchie ID"
                                value={editForm.result_munchie_id || ''}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    result_munchie_id: e.target.value ? Number(e.target.value) : null,
                                    result_item_id: null
                                })}
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <CreateCraftingRecipeDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
            />
        </Container>
    );
};

export default CraftingRecipesDataGrid;