import React, { useState, useEffect, useMemo } from 'react';
import CreateEffectDialog from './CreateEffectDialog';
import EditEffectDialog from './EditEffectDialog';
import {
    Box,
    Paper,
    Typography,
    Alert,
    Container,
    TextField,
    InputAdornment,
    IconButton,
    Button
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Bolt as ChanceIcon,
    Timer as DurationIcon,
    Healing as HealIcon,
    LocalFireDepartment as DamageIcon,
    Sync as RecoilIcon,
    Psychology as StatusIcon,
    Timeline as StagesIcon,
    ChangeHistory as TypeIcon,
    Numbers as HitsIcon
} from '@mui/icons-material';
import { useGetAllEffectsQuery } from '../../../api/apiSlice';

// Enhanced Error Boundary Component with Detailed Logging
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state to display fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service or console
        console.error('Error Boundary Caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container>
                    <Alert severity="error" role="alert">
                        Something went wrong while rendering the grid.
                        <br />
                        {this.state.error && this.state.error.toString()}
                    </Alert>
                </Container>
            );
        }

        return this.props.children;
    }
}

const EffectsDataGrid = () => {
    const { data: effects = [], error, isLoading } = useGetAllEffectsQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEffect, setSelectedEffect] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);

    // Debugging: Log the fetched effects data
    useEffect(() => {
        console.log('Fetched Effects:', effects);
    }, [effects]);

    const handleEditClick = (effect) => {
        if (effect) {
            setSelectedEffect(effect);
            setOpenEditDialog(true);
        } else {
            console.warn('Edit clicked with undefined effect:', effect);
        }
    };

    // Memoize formattedEffects to optimize performance
    const formattedEffects = useMemo(() => {
        if (!Array.isArray(effects)) {
            console.error('Fetched effects data is not an array:', effects);
            return [];
        }

        return effects
            .filter(effect => effect && typeof effect === 'object') // Ensure each effect is an object
            .map((effect, index) => {
                // Validate and assign unique ID
                const id = effect.id !== undefined && effect.id !== null ? effect.id : `temp-id-${index}`;
                if (effect.id === undefined || effect.id === null) {
                    console.warn(`Effect at index ${index} is missing 'id'. Assigned temporary id: ${id}`);
                }

                // Safely access nested properties
                const statusConditionName = effect.status_condition?.condition_name || '-';
                const stat = effect.stat || '';
                const stages = effect.stages !== undefined && effect.stages !== null ? effect.stages : 0;
                const statChanges = stat ? `${stat} (${stages > 0 ? '+' : ''}${stages})` : '-';

                const chance = effect.chance !== undefined && effect.chance !== null ? `${(effect.chance * 100).toFixed(0)}%` : '-';
                const duration = effect.duration !== undefined && effect.duration !== null ? `${effect.duration} turns` : '-';
                const healAmount = effect.heal_amount !== undefined && effect.heal_amount !== null ? `${(effect.heal_amount * 100).toFixed(0)}%` : '-';
                const recoilAmount = effect.recoil_amount !== undefined && effect.recoil_amount !== null ? `${(effect.recoil_amount * 100).toFixed(0)}%` : '-';

                // Handle hits
                let hits = '-';
                if (effect.min_hits !== undefined && effect.max_hits !== undefined && effect.min_hits !== null && effect.max_hits !== null) {
                    if (effect.min_hits === effect.max_hits) {
                        hits = effect.min_hits;
                    } else {
                        hits = `${effect.min_hits}-${effect.max_hits}`;
                    }
                }

                return {
                    id,
                    name: effect.name || 'Unnamed Effect',
                    effect_type: effect.effect_type || '-',
                    chance,
                    duration,
                    status_condition: statusConditionName,
                    stat_changes: statChanges,
                    heal_amount: healAmount,
                    hits,
                    recoil_amount: recoilAmount,
                    description: effect.description || 'No description available',
                };
            });
    }, [effects]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90, hide: true },
        {
            field: 'name',
            headerName: 'Effect Name',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'effect_type',
            headerName: 'Type',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TypeIcon color="primary" />
                    <span>Type</span>
                </Box>
            ),
        },
        {
            field: 'chance',
            headerName: 'Chance',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ChanceIcon color="warning" />
                    <span>Chance</span>
                </Box>
            ),
        },
        {
            field: 'duration',
            headerName: 'Duration',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DurationIcon color="info" />
                    <span>Duration</span>
                </Box>
            ),
        },
        {
            field: 'status_condition',
            headerName: 'Status',
            width: 130,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StatusIcon color="secondary" />
                    <span>Status</span>
                </Box>
            ),
        },
        {
            field: 'stat_changes',
            headerName: 'Stat Changes',
            width: 140,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StagesIcon color="error" />
                    <span>Stat Changes</span>
                </Box>
            ),
        },
        {
            field: 'heal_amount',
            headerName: 'Healing',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HealIcon color="success" />
                    <span>Healing</span>
                </Box>
            ),
        },
        {
            field: 'hits',
            headerName: 'Hits',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HitsIcon color="primary" />
                    <span>Hits</span>
                </Box>
            ),
        },
        {
            field: 'recoil_amount',
            headerName: 'Recoil',
            width: 120,
            renderHeader: () => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RecoilIcon color="error" />
                    <span>Recoil</span>
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
            renderCell: (params) => {
                const effect = params.row;
                if (!effect) {
                    console.warn('RenderCell called with undefined effect:', params);
                    return null;
                }
                return (
                    <IconButton
                        onClick={() => handleEditClick(effect)}
                        aria-label={`Edit ${effect.name || 'effect'}`}
                    >
                        <EditIcon />
                    </IconButton>
                );
            }
        }
    ];

    // Filtered and Validated Effects
    const filteredEffects = useMemo(() => {
        return formattedEffects.filter(effect =>
            effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            effect.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [formattedEffects, searchQuery]);

    if (error) {
        return (
            <Container>
                <Alert severity="error" role="alert">
                    Failed to load effects: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Effect List
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenCreateDialog(true)}
                    startIcon={<AddIcon />}
                >
                    Create Effect
                </Button>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search effects..."
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
                <ErrorBoundary>
                    <DataGrid
                        rows={filteredEffects}
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
                </ErrorBoundary>
            </Paper>

            <CreateEffectDialog
                open={openCreateDialog}
                onClose={() => setOpenCreateDialog(false)}
            />

            <EditEffectDialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                effect={selectedEffect}
            />
        </Container>
    );
};

export default EffectsDataGrid;
