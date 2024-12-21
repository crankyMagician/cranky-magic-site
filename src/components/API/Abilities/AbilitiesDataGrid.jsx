import React, { useState } from 'react';
import CreateAbilityDialog from './CreateAbilityDialog';
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
    Switch,
    FormControlLabel,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Add,
    Visibility as HiddenIcon,
    Category as ObjectIcon,
    Description as DescriptionIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Flag as FlagIcon,
} from '@mui/icons-material';
import {
    useGetAllAbilitiesQuery,
    useUpdateAbilityMutation
} from '../../../api/apiSlice';

const AbilitiesDataGrid = () => {
    const { data, error, isLoading } = useGetAllAbilitiesQuery();
    const [updateAbility] = useUpdateAbilityMutation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAbility, setSelectedAbility] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [editForm, setEditForm] = useState({
        ability_name: '',
        is_hidden: false,
        description: '',
        object_name: '',
        hide_flags: 0
    });

    const handleEditClick = (params) => {
        setSelectedAbility(params);
        setEditForm({
            ability_name: params.ability_name,
            is_hidden: params.is_hidden,
            description: params.description,
            object_name: params.object_name,
            hide_flags: params.hide_flags
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            await updateAbility({
                id: selectedAbility.id,
                ...editForm
            });
            setOpenDialog(false);
        } catch (err) {
            console.error('Failed to update ability:', err);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'ability_name', headerName: 'Ability Name', flex: 1, minWidth: 150 },
    /*    {
            field: 'is_hidden',
            headerName: 'Hidden',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HiddenIcon color="primary" />
                    <span>Hidden</span>
                </Box>
            ),
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HiddenIcon color={params.row.is_hidden ? "primary" : "disabled"} />
                    <span>{params.row.is_hidden ? 'Yes' : 'No'}</span>
                </Box>
            )
        },*/
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            minWidth: 200,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="secondary" />
                    <span>Description</span>
                </Box>
            )
        },
     /*   {
            field: 'object_name',
            headerName: 'Object Name',
            width: 150,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ObjectIcon color="warning" />
                    <span>Object Name</span>
                </Box>
            )
        },
        {
            field: 'hide_flags',
            headerName: 'Hide Flags',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlagIcon color="error" />
                    <span>Hide Flags</span>
                </Box>
            )
        },*/
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleEditClick(params.row)}
                    aria-label={`Edit ${params.row.ability_name}`}
                >
                    <EditIcon />
                </IconButton>
            )
        }
    ];

    const abilities = Array.isArray(data) ? data : [];
    const filteredAbilities = abilities.filter(ability =>
        ability.ability_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return (
            <Container>
                <Alert severity="error" role="alert">
                    Failed to load abilities: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Ability List
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCreateDialog(true)}
                    startIcon={<Add />}
                >
                    Create Ability
                </Button>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search abilities..."
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
                    rows={filteredAbilities}
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
                    Edit {selectedAbility?.ability_name}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Ability Name"
                            value={editForm.ability_name}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                ability_name: e.target.value
                            })}
                        />
                        {/*<FormControlLabel
                            control={
                                <Switch
                                    checked={editForm.is_hidden}
                                    onChange={(e) => setEditForm({
                                        ...editForm,
                                        is_hidden: e.target.checked
                                    })}
                                />
                            }
                            label="Hidden Ability"
                        />*/}
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
                        <TextField
                            fullWidth
                            label="Object Name"
                            value={editForm.object_name}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                object_name: e.target.value
                            })}
                        />
                       {/* <TextField
                            fullWidth
                            type="number"
                            label="Hide Flags"
                            value={editForm.hide_flags}
                            onChange={(e) => setEditForm({
                                ...editForm,
                                hide_flags: parseInt(e.target.value)
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

            <CreateAbilityDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
            />
        </Container>
    );
};

export default AbilitiesDataGrid;