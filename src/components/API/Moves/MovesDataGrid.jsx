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
    ElectricBolt as PowerIcon,
    GpsFixed as AccuracyIcon,
    Category as CategoryIcon,
    LocalFireDepartment as TypeIcon,
    Timer as TimerIcon,
    Star as CriticalIcon,
    Search as SearchIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { useGetAllMovesQuery } from '../../../api/apiSlice';

const MovesDataGrid = () => {
    const { data, error, isLoading } = useGetAllMovesQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMove, setSelectedMove] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleEditClick = (params) => {
        setSelectedMove(params);
        setOpenDialog(true);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        { field: 'move_name', headerName: 'Move Name', flex: 1, minWidth: 150 },
        {
            field: 'power',
            headerName: 'Power',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PowerIcon color="error" />
                    <span>Power</span>
                </Box>
            )
        },
        {
            field: 'accuracy',
            headerName: 'Accuracy',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccuracyIcon color="primary" />
                    <span>Accuracy</span>
                </Box>
            )
        },
        {
            field: 'pp',
            headerName: 'PP',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimerIcon color="action" />
                    <span>PP</span>
                </Box>
            ),
            renderCell: (params) => params?.row ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimerIcon color="action" />
                    <Typography><strong>{params.row.pp} / {params.row.max_pp}</strong></Typography>
                </Box>
            ) : null,
            valueGetter: (params) => (params?.row ? `${params.row.pp} / ${params.row.max_pp}` : '')
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="secondary" />
                    <span>Category</span>
                </Box>
            )
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TypeIcon color="warning" />
                    <span>Type</span>
                </Box>
            ),
            renderCell: (params) => params?.row ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TypeIcon color="warning" />
                    <Typography><strong>{params.row.type?.type_name}</strong></Typography>
                </Box>
            ) : null,
            valueGetter: (params) => params?.row?.type?.type_name || ''
        },
        {
            field: 'critical',
            headerName: 'Critical',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CriticalIcon />
                    <span>Critical</span>
                </Box>
            ),
            renderCell: (params) => params?.row ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CriticalIcon color={params.row.high_critical_hit_ratio ? "error" : "disabled"} />
                    <span>{params.row.high_critical_hit_ratio ? 'High' : 'Normal'}</span>
                </Box>
            ) : null
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => params?.row ? (
                <IconButton
                    onClick={() => handleEditClick(params.row)}
                    aria-label={`Edit ${params.row.move_name}`}
                >
                    <EditIcon />
                </IconButton>
            ) : null
        }
    ];

    const moves = Array.isArray(data) ? data : data?.moves || [];
    const filteredMoves = moves.filter(move =>
        move.move_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (error) {
        return (
            <Container>
                <Alert severity="error" role="alert">
                    Failed to load moves: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Move List
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search moves..."
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
                    rows={filteredMoves}
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
                    {selectedMove?.move_name} Details
                </DialogTitle>
                <DialogContent dividers>
                    {selectedMove?.effects?.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Effects
                            </Typography>
                            {selectedMove.effects.map((effect, index) => (
                                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography><strong>Description:</strong> {effect.description}</Typography>
                                    <Typography><strong>Chance:</strong> {effect.chance * 100}%</Typography>
                                    <Typography><strong>Duration:</strong> {effect.duration} turns</Typography>
                                    <Typography><strong>Effect Type:</strong> {effect.effect_type}</Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MovesDataGrid;