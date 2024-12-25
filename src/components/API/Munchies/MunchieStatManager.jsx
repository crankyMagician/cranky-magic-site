import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Slider,
    Alert,
    Stack,
    CircularProgress,
    Button,
    Grid
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useUpsertMunchieStatsMutation, useGetMunchieStatsQuery } from '../../../api/apiSlice';

const MunchieStatManager = ({ munchieId }) => {
    const [upsertStats, { isLoading }] = useUpsertMunchieStatsMutation();
    const { data: currentStats, isLoading: isLoadingStats, isError: isStatsError, error: statsError } = useGetMunchieStatsQuery(munchieId);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const [stats, setStats] = useState({
        HP: 1,
        Attack: 1,
        Defense: 1,
        SpecialAttack: 1,
        SpecialDefense: 1,
        Speed: 1
    });

    useEffect(() => {
        console.log('Fetching current stats for Munchie ID:', munchieId);
        if (currentStats) {
            console.log('Received stats:', currentStats);
            const formattedStats = currentStats.reduce((acc, stat) => ({
                ...acc,
                [stat.stat_type]: stat.value
            }), {});
            setStats(formattedStats);
        } else if (isStatsError) {
            console.error('Error fetching stats:', statsError);
            setError('Failed to load stats');
        }
    }, [currentStats, isStatsError, statsError, munchieId]);

    const handleStatChange = (statType) => (event, value) => {
        console.log(`Changing stat [${statType}] to value:`, value);
        setStats(prev => ({
            ...prev,
            [statType]: value
        }));
    };

    const handleSave = async () => {
        console.log('Saving stats:', stats);
        try {
            const statsArray = Object.entries(stats).map(([stat_type, value]) => ({
                stat_type,
                value
            }));

            console.log('Formatted stats for API:', statsArray);

            await upsertStats({
                munchieId, // Ensure munchieId is passed correctly
                stats: statsArray
            }).unwrap();

            console.log('Stats successfully saved');
            setSuccess('Stats updated successfully');
            setError(null);
        } catch (err) {
            console.error('Error saving stats:', err);
            setError(err?.data?.error || 'Failed to update stats');
            setSuccess('');
        }
    };

    const statColors = {
        HP: '#FF0000',
        Attack: '#F08030',
        Defense: '#F8D030',
        SpecialAttack: '#6890F0',
        SpecialDefense: '#78C850',
        Speed: '#F85888'
    };

    if (isLoadingStats) {
        console.log('Stats are loading...');
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={2} sx={{ p: 3, maxWidth: '800px', margin: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Manage Stats
            </Typography>

            {(error || success) && (
                <Box sx={{ mb: 2 }}>
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess('')}>
                            {success}
                        </Alert>
                    )}
                </Box>
            )}

            <Stack spacing={3}>
                <Grid container spacing={2}>
                    {Object.entries(stats).map(([statType, value]) => (
                        <Grid item xs={12} key={statType}>
                            <Box sx={{ width: '100%' }}>
                                <Typography
                                    id={`${statType}-slider`}
                                    gutterBottom
                                    sx={{ color: statColors[statType] }}
                                >
                                    {statType}: {value}
                                </Typography>
                                <Slider
                                    value={value}
                                    onChange={handleStatChange(statType)}
                                    min={1}
                                    max={255}
                                    aria-labelledby={`${statType}-slider`}
                                    sx={{
                                        color: statColors[statType],
                                        '& .MuiSlider-thumb': {
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: `0px 0px 0px 8px ${statColors[statType]}20`
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </Box>
        </Paper>
    );
};

export default MunchieStatManager;
