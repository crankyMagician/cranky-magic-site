
import React, { useState } from 'react';
import CreateItemDialog from './CreateItemDialog';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Add,
    Search as SearchIcon,
    Edit as EditIcon,
    MonetizationOn as ValueIcon,
    Scale as WeightIcon,
    Category as TypeIcon,
    Star as RarityIcon
} from '@mui/icons-material';
import {
    useGetAllItemsQuery,
    useUpdateItemMutation
} from '../../../api/apiSlice';

const ItemsDataGrid = () => {
    const { data, error, isLoading } = useGetAllItemsQuery();
    const [updateItem] = useUpdateItemMutation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        value: 0,
        weight: 0,
        rarity: '',
        item_type: '',
        image_url: '',
        object_name: '',
        hide_flags: 0
    });

    const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    const itemTypeOptions = ['Consumable', 'Equipment', 'Key Item', 'Material', 'Quest Item'];

    const handleEditClick = (params) => {
        setSelectedItem(params);
        setEditForm({
            name: params.name,
            description: params.description,
            value: params.value,
            weight: params.weight,
            rarity: params.rarity,
            item_type: params.item_type,
            image_url: params.image_url,
            object_name: params.object_name,
            hide_flags: params.hide_flags
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            await updateItem({
                id: selectedItem.id,
                ...editForm
            });
            setOpenDialog(false);
        } catch (err) {
            console.error('Failed to update item:', err);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'name', headerName: 'Item Name', flex: 1, minWidth: 150 },
        {
            field: 'value',
            headerName: 'Value',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ValueIcon color="primary" />
                    <span>Value</span>
                </Box>
            ),
        },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WeightIcon color="secondary" />
                    <span>Weight</span>
                </Box>
            ),
        },
        {
            field: 'rarity',
            headerName: 'Rarity',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RarityIcon color="warning" />
                    <span>Rarity</span>
                </Box>
            ),
        },
        {
            field: 'item_type',
            headerName: 'Type',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TypeIcon color="info" />
                    <span>Type</span>
                </Box>
            ),
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            minWidth: 200,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleEditClick(params.row)}
                    aria-label={`Edit ${params.row.name}`}
                >
                    <EditIcon />
                </IconButton>
            )
        }
    ];

    const items = Array.isArray(data) ? data : [];
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return (
            <Container>
                <Alert severity="error" role="alert">
                    Failed to load items: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Item List
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCreateDialog(true)}
                    startIcon={<Add />}
                >
                    Create Item
                </Button>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search items..."
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
                    rows={filteredItems}
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
                    Edit {selectedItem?.name}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Item Name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                name: e.target.value
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
                                fullWidth
                                type="number"
                                label="Value"
                                value={editForm.value}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    value: parseInt(e.target.value)
                                })}
                                inputProps={{ min: 0 }}
                            />

                            <TextField
                                fullWidth
                                type="number"
                                label="Weight"
                                value={editForm.weight}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    weight: parseFloat(e.target.value)
                                })}
                                inputProps={{ min: 0, step: 0.1 }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Rarity</InputLabel>
                                <Select
                                    value={editForm.rarity}
                                    label="Rarity"
                                    onChange={(e) => setEditForm({
                                        ...editForm,
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

                            <FormControl fullWidth>
                                <InputLabel>Item Type</InputLabel>
                                <Select
                                    value={editForm.item_type}
                                    label="Item Type"
                                    onChange={(e) => setEditForm({
                                        ...editForm,
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
                            value={editForm.image_url}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                image_url: e.target.value
                            })}
                        />

                      {/*  <TextField
                            fullWidth
                            label="Object Name"
                            value={editForm.object_name}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                object_name: e.target.value
                            })}
                        />*/}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <CreateItemDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
            />
        </Container>
    );
};

export default ItemsDataGrid;