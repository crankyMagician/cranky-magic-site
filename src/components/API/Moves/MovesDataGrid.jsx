import React, { useState } from 'react';
import CreateMoveDialog from './CreateMoveDialog';
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
    ElectricBolt as PowerIcon,
    GpsFixed as AccuracyIcon,
    Category as CategoryIcon,
    LocalFireDepartment as TypeIcon,
    Timer as TimerIcon,
    Star as CriticalIcon,
    Search as SearchIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { useGetAllMovesQuery, useUpdateMoveMutation } from '../../../api/apiSlice';
import EditMoveDialog from "./EditMoveDialog";

const MovesDataGrid = () => {
    const { data, error, isLoading } = useGetAllMovesQuery();
    const [updateMove] = useUpdateMoveMutation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMove, setSelectedMove] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [editForm, setEditForm] = useState({
        move_name: '',
        munchie_type_id: '',
        category: '',
        power: 0,
        accuracy: 100,
        pp: 20,
        max_pp: 20,
        high_critical_hit_ratio: false,
        object_name: '',
        hide_flags: 0
    });

    const categoryOptions = ['PHYSICAL', 'SPECIAL', 'STATUS'];

    const handleEditClick = (params) => {
        if (!params.row) return;
        setSelectedMove(params.row);
        setEditForm({
            move_name: params.row.move_name || '',
            munchie_type_id: params.row.munchie_type_id || '',
            category: params.row.category || '',
            power: params.row.power || 0,
            accuracy: params.row.accuracy || 100,
            pp: params.row.pp || 20,
            max_pp: params.row.max_pp || 20,
            high_critical_hit_ratio: params.row.high_critical_hit_ratio || false,
            object_name: params.row.object_name || '',
            hide_flags: params.row.hide_flags || 0
        });
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            if (!selectedMove?.id) return;
            await updateMove({
                id: selectedMove.id,
                ...editForm
            });
            setOpenDialog(false);
        } catch (err) {
            console.error('Failed to update move:', err);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        {
            field: 'move_name',
            headerName: 'Move Name',
            flex: 1,
            minWidth: 150,
            valueGetter: (params) => params.row?.move_name || '',
            renderCell: (params) => <Typography>{params.row.move_name || 'N/A'}</Typography>
        },
        {
            field: 'power',
            headerName: 'Power',
            width: 120,
            valueGetter: (params) => params.row?.power || 0,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PowerIcon color="error" />
                    <span>Power</span>
                </Box>
            ),
            renderCell: (params) => <Typography>{params.row.power || 'N/A'}</Typography>
        },
        {
            field: 'accuracy',
            headerName: 'Accuracy',
            width: 120,
            valueGetter: (params) => params.row?.accuracy || 0,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccuracyIcon color="primary" />
                    <span>Accuracy</span>
                </Box>
            ),
            renderCell: (params) => <Typography>{params.row.accuracy || 'N/A'}</Typography>
        },
        {
            field: 'pp',
            headerName: 'PP',
            width: 120,
            valueGetter: (params) => {
                const pp = params.row?.pp || 0;
                const maxPp = params.row?.max_pp || 0;
                return `${pp} / ${maxPp}`;
            },
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimerIcon color="action" />
                    <span>PP</span>
                </Box>
            ),
            renderCell: (params) => {
                const pp = params.row?.pp || 0;
                const maxPp = params.row?.max_pp || 0;
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography><strong>{pp} / {maxPp}</strong></Typography>
                    </Box>
                );
            }
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 130,
            valueGetter: (params) => params.row?.category || 'N/A',
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="secondary" />
                    <span>Category</span>
                </Box>
            ),
            renderCell: (params) => <Typography>{params.row.category || 'N/A'}</Typography>
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 130,
            valueGetter: (params) => params.row?.type?.type_name || '',
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TypeIcon color="warning" />
                    <span>Type</span>
                </Box>
            ),
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography><strong>{params.row.type?.type_name || 'N/A'}</strong></Typography>
                </Box>
            )
        },
        {
            field: 'high_critical_hit_ratio',
            headerName: 'Critical',
            width: 130,
            valueGetter: (params) => params.row?.high_critical_hit_ratio || false,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CriticalIcon />
                    <span>Critical</span>
                </Box>
            ),
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CriticalIcon color={params.row.high_critical_hit_ratio ? "error" : "disabled"} />
                    <span>{params.row.high_critical_hit_ratio ? 'High' : 'Normal'}</span>
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleEditClick(params)}
                    aria-label={`Edit ${params.row.move_name}`}
                >
                    <EditIcon />
                </IconButton>
            )
        }
    ];

    const moves = Array.isArray(data) ? data : [];
    const filteredMoves = moves.filter(move =>
        move?.move_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Move List
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCreateDialog(true)}
                    startIcon={<Add />}
                >
                    Create Move
                </Button>
            </Box>

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
                    getRowId={(row) => row?.id}
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                    }}
                />
            </Paper>

            <EditMoveDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                editForm={editForm}
                setEditForm={setEditForm}
                handleSave={handleSave}
                selectedMove={selectedMove}
            />

            <CreateMoveDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
            />
        </Container>
    );
};

export default MovesDataGrid;
