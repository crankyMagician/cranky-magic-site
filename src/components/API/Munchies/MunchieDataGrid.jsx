import React, { useState } from 'react';
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
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Image as ImageIcon,
    Height as HeightIcon,
    Scale as WeightIcon,
    Star as RarityIcon,
    Description as DescriptionIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Category as CategoryIcon, // MUI Icon for Munchie Type
    ArrowForward as EvolutionIcon,
} from '@mui/icons-material';
import { useGetAllMunchiesQuery } from '../../../api/apiSlice';

const MunchiesDataGrid = () => {
    const { data, error, isLoading } = useGetAllMunchiesQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMunchie, setSelectedMunchie] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleEditClick = (params) => {
        setSelectedMunchie(params);
        setOpenDialog(true);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        {
            field: 'image_url',
            headerName: 'Image',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon color="primary" />
                    <span>Image</span>
                </Box>
            ),
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt={params.row.name}
                    style={{ width: 50, height: 50, borderRadius: '50%' }}
                />
            ),
        },
        {
            field: 'height',
            headerName: 'Height',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HeightIcon color="secondary" />
                    <span>Height</span>
                </Box>
            ),
        },
        {
            field: 'weight',
            headerName: 'Weight',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WeightIcon color="action" />
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
            field: 'munchie_types',
            headerName: 'Type',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="info" />
                    <span>Type</span>
                </Box>
            ),
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1.5,
            minWidth: 250,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon color="info" />
                    <span>Description</span>
                </Box>
            ),
        },
        {
            field: 'evolution_1',
            headerName: 'Evolution 1',
            width: 180,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EvolutionIcon color="success" />
                    <span>Evolution 1</span>
                </Box>
            ),
            renderCell: (params) => {
                const evolution = params.row.evolutions?.[0];
                return evolution ? (
                    <Typography>{evolution.to_munchie}</Typography>
                ) : (
                    'None'
                );
            },
        },
        {
            field: 'evolution_2',
            headerName: 'Evolution 2',
            width: 180,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EvolutionIcon color="secondary" />
                    <span>Evolution 2</span>
                </Box>
            ),
            renderCell: (params) => {
                const evolution = params.row.evolutions?.[1];
                return evolution ? (
                    <Typography>{evolution.to_munchie}</Typography>
                ) : (
                    'None'
                );
            },
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
            ),
        },
    ];

    const munchies = Array.isArray(data) ? data : [];
    const filteredMunchies = munchies.filter((munchie) =>
        munchie.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return (
            <Container>
                <Alert severity="error" role="alert">
                    Failed to load munchies: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Munchie List
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search munchies..."
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
                    rows={filteredMunchies}
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
                    {selectedMunchie?.name} Details
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1">
                        <strong>Description:</strong> {selectedMunchie?.description}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Height:</strong> {selectedMunchie?.height} cm
                    </Typography>
                    <Typography variant="body1">
                        <strong>Weight:</strong> {selectedMunchie?.weight} kg
                    </Typography>
                    <Typography variant="body1">
                        <strong>Rarity:</strong> {selectedMunchie?.rarity}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Type:</strong> {selectedMunchie?.munchie_types}
                    </Typography>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <img
                            src={selectedMunchie?.image_url}
                            alt={selectedMunchie?.name}
                            style={{ maxWidth: '100%', borderRadius: '8px' }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MunchiesDataGrid;
