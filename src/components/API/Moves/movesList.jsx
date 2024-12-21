import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Divider,
    Grid,
    CircularProgress,
    Alert,
    Container,
    useTheme,
    useMediaQuery,
    Skeleton,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    ElectricBolt as PowerIcon,
    GpsFixed as AccuracyIcon,
    Category as CategoryIcon,
    LocalFireDepartment as TypeIcon,
    Timer as TimerIcon,
    Error as ErrorIcon,
    Star as CriticalIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useGetAllMovesQuery } from '../../../api/apiSlice';

const LoadingSkeleton = () => (
    <Container>
        {[1, 2, 3].map((i) => (
            <Paper key={i} elevation={3} sx={{ mb: 3, p: 3 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                        <Grid item xs={12} sm={6} md={4} key={j}>
                            <Skeleton variant="text" width="80%" />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        ))}
    </Container>
);

const MovesList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { data, error, isLoading } = useGetAllMovesQuery();
    const [searchQuery, setSearchQuery] = useState('');

    const moves = Array.isArray(data) ? data : data?.moves || [];
    const filteredMoves = moves.filter(move =>
        move.move_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <LoadingSkeleton aria-label="Loading moves data" />;

    if (error) {
        return (
            <Container>
                <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    role="alert"
                    sx={{ mt: 2 }}
                >
                    Failed to load moves: {error.message}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Please try refreshing the page or contact support if the issue persists.
                    </Typography>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontSize: isMobile ? '1.75rem' : '2.125rem',
                    mb: 3
                }}
            >
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

            {filteredMoves.length === 0 ? (
                <Alert severity="info">
                    No moves found matching "{searchQuery}"
                </Alert>
            ) : (
                filteredMoves.map((move) => (
                    <Paper
                        key={move.id}
                        elevation={3}
                        sx={{
                            mb: 3,
                            p: 3,
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[6]
                            }
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{ color: theme.palette.primary.main }}
                        >
                            {move.move_name}
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PowerIcon color="error" />
                                    <Typography>
                                        Power: <strong>{move.power}</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccuracyIcon color="primary" />
                                    <Typography>
                                        Accuracy: <strong>{move.accuracy}</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TimerIcon color="action" />
                                    <Typography>
                                        PP: <strong>{move.pp} / {move.max_pp}</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CategoryIcon color="secondary" />
                                    <Typography>
                                        Category: <strong>{move.category}</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TypeIcon color="warning" />
                                    <Typography>
                                        Type: <strong>{move.type?.type_name}</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CriticalIcon color={move.high_critical_hit_ratio ? "error" : "disabled"} />
                                    <Typography>
                                        Critical: <strong>{move.high_critical_hit_ratio ? 'High' : 'Normal'}</strong>
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {move.effects?.length > 0 && (
                            <Box sx={{ mt: 3, p: 2, bgcolor: theme.palette.background.default, borderRadius: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Effects
                                </Typography>
                                {move.effects.map((effect, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            mb: index !== move.effects.length - 1 ? 2 : 0,
                                            p: 2,
                                            bgcolor: theme.palette.background.paper,
                                            borderRadius: 1
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <strong>Description:</strong> {effect.description}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography>
                                                    <strong>Chance:</strong> {effect.chance * 100}%
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography>
                                                    <strong>Duration:</strong> {effect.duration} turns
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <strong>Effect Type:</strong> {effect.effect_type}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Paper>
                ))
            )}
        </Container>
    );
};

export default MovesList;