import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    CircularProgress,
    Alert,
    LinearProgress,
    Tabs,
    Tab,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useGetMunchieAllInfoByIdQuery } from '../../../api/apiSlice';
import ReadOnlyMunchiePhotoDisplay from '../MunchiePhotos/ReadOnlyMunchiePhotoDisplay';

const StyledChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& .MuiCardContent-root': {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
}));

const TabPanel = ({ children, value, index, ...other }) => (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
    >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
);

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
        borderRadius: 5,
    },
}));

const MunchieDisplay = ({ munchieId }) => {
    const [tabValue, setTabValue] = React.useState(0);
    const { data, isLoading, error } = useGetMunchieAllInfoByIdQuery(munchieId);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
                role="status"
                aria-busy="true"
                aria-live="polite"
            >
                <CircularProgress aria-label="Loading Munchie information" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Failed to load Munchie information. Please try again.
            </Alert>
        );
    }

    const { munchie, stats, types, abilities, learnable_moves, evolutions } = data;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <StyledCard elevation={3}>
                        <CardContent>
                            <Box sx={{ mb: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h4" component="h1">
                                        {munchie.name}
                                    </Typography>
                                    <StyledChip
                                        label={munchie.rarity}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                    {types && types.length > 0 ? (
                                        types.map((type) => (
                                            <StyledChip
                                                key={type.id}
                                                label={String(type.type_name || 'Unknown')}
                                                color="secondary"
                                                variant="outlined"
                                                sx={{
                                                    fontSize: '0.875rem',
                                                    backgroundColor: 'inherit',
                                                    borderColor: 'currentColor',
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No types available
                                        </Typography>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ mt: 1, mb: 2 }}>
                                <ReadOnlyMunchiePhotoDisplay
                                    munchieId={munchieId}
                                    altText={`${munchie.name} photo`}
                                />
                            </Box>

                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {munchie.description}
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        Height: {munchie.height}cm
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2">
                                        Weight: {munchie.weight}kg
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </StyledCard>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper elevation={3}>
                        <Box sx={{ width: '100%' }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                aria-label="Munchie Information Tabs"
                            >
                                <Tab label="Stats" id="tab-0" aria-controls="tabpanel-0" />
                                <Tab label="Abilities" id="tab-1" aria-controls="tabpanel-1" />
                                <Tab label="Moves" id="tab-2" aria-controls="tabpanel-2" />
                                <Tab label="Evolution" id="tab-3" aria-controls="tabpanel-3" />
                            </Tabs>

                            <TabPanel value={tabValue} index={0}>
                                <Box sx={{ width: '100%' }}>
                                    {stats.map((stat) => (
                                        <Box key={stat.stat_type} sx={{ my: 2 }}>
                                            <Box display="flex" justifyContent="space-between" mb={1}>
                                                <Typography variant="body2">
                                                    {stat.stat_type}
                                                </Typography>
                                                <Typography variant="body2">
                                                    {stat.value}/255
                                                </Typography>
                                            </Box>
                                            <StyledLinearProgress
                                                variant="determinate"
                                                value={(stat.value / 255) * 100}
                                            />
                                        </Box>
                                    ))}
                                </Box>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <List>
                                    {abilities.map((ability) => (
                                        <React.Fragment key={ability.id}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" alignItems="center">
                                                            <Typography variant="subtitle1">
                                                                {ability.ability_name}
                                                            </Typography>
                                                            {ability.is_hidden && (
                                                                <StyledChip
                                                                    size="small"
                                                                    label="Hidden"
                                                                    color="info"
                                                                    sx={{ ml: 1 }}
                                                                />
                                                            )}
                                                        </Box>
                                                    }
                                                    secondary={ability.description}
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                                    {learnable_moves.map((move) => (
                                        <React.Fragment key={move.id}>
                                            <ListItem>
                                                <ListItemText primary={move.move_name} />
                                                <ListItemSecondaryAction>
                                                    <StyledChip
                                                        size="small"
                                                        label={`Level ${move.level_learned}`}
                                                        color="primary"
                                                    />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </TabPanel>

                            <TabPanel value={tabValue} index={3}>
                                <List>
                                    {evolutions.map((evolution, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem>
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" alignItems="center">
                                                            <Typography>
                                                                {evolution.from_munchie} → {evolution.to_munchie}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" component="span">
                                                                Level: {evolution.required_level}
                                                            </Typography>
                                                            {evolution.required_item_name && (
                                                                <>
                                                                    <Typography variant="body2" component="span"> | </Typography>
                                                                    <Typography variant="body2" component="span">
                                                                        Item: {evolution.required_item_name}
                                                                    </Typography>
                                                                </>
                                                            )}
                                                            {evolution.required_friendship && (
                                                                <>
                                                                    <Typography variant="body2" component="span"> | </Typography>
                                                                    <Typography variant="body2" component="span">
                                                                        Friendship: {evolution.required_friendship}
                                                                    </Typography>
                                                                </>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            </TabPanel>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Last updated: {formatDate(munchie.updated_at)}
            </Typography>
        </Box>
    );
};

export default MunchieDisplay;