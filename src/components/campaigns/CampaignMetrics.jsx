import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    LinearProgress,
    Skeleton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Campaign as CampaignIcon,
    Edit as DraftIcon,
    CheckCircle as CompletedIcon,
    PlayArrow as ActiveIcon,
    AttachMoney as BudgetIcon
} from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

/**
 * Campaign Metrics component
 * Displays key metrics about campaigns in card format
 */
const CampaignMetrics = ({ businessId, campaignsData }) => {
    const { translate } = useCustomTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { isDark, getGlassMorphismStyle, getGlowEffect } = useSpatialTheme();

    // Calculate metrics from campaigns data
    const metrics = useMemo(() => {
        if (!campaignsData?.campaigns) {
            return {
                total: 0,
                active: 0,
                draft: 0,
                completed: 0,
                totalBudget: 0
            };
        }

        const campaigns = campaignsData.campaigns;
        const total = campaigns.length;
        const active = campaigns.filter(c => c.status === 'active').length;
        const draft = campaigns.filter(c => c.status === 'draft').length;
        const completed = campaigns.filter(c => c.status === 'completed').length;
        const totalBudget = campaigns.reduce((sum, campaign) => sum + (campaign.budget || 0), 0);

        return {
            total,
            active,
            draft,
            completed,
            totalBudget
        };
    }, [campaignsData]);

    // Calculate percentages for each status
    const percentages = useMemo(() => {
        const total = metrics.total || 1; // Avoid division by zero
        return {
            active: Math.round((metrics.active / total) * 100),
            draft: Math.round((metrics.draft / total) * 100),
            completed: Math.round((metrics.completed / total) * 100)
        };
    }, [metrics]);

    // Loading state
    if (!campaignsData) {
        return (
            <Grid container spacing={3}>
                {[1, 2, 3, 4, 5].map(item => (
                    <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4} key={item}>
                        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Grid container spacing={3}>
            {/* Total campaigns card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        ...getGlassMorphismStyle(),
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            ...getGlowEffect(theme.palette.primary.main, 'low')
                        }
                    }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <CampaignIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6" component="div">
                                {translate('TotalCampaigns')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                            {metrics.total}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Active campaigns card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        ...getGlassMorphismStyle(),
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            ...getGlowEffect(theme.palette.success.main, 'low')
                        }
                    }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <ActiveIcon color="success" sx={{ mr: 1 }} />
                            <Typography variant="h6" component="div">
                                {translate('Active')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" color="success.main" sx={{ fontWeight: 'bold' }}>
                            {metrics.active}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={percentages.active}
                            sx={{
                                mt: 2,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'success.light',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: 'success.main'
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            {percentages.active}% {translate('OfTotal')}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Draft campaigns card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        ...getGlassMorphismStyle(),
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            ...getGlowEffect(theme.palette.warning.main, 'low')
                        }
                    }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <DraftIcon color="warning" sx={{ mr: 1 }} />
                            <Typography variant="h6" component="div">
                                {translate('Draft')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" color="warning.main" sx={{ fontWeight: 'bold' }}>
                            {metrics.draft}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={percentages.draft}
                            sx={{
                                mt: 2,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'warning.light',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: 'warning.main'
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            {percentages.draft}% {translate('OfTotal')}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Completed campaigns card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        ...getGlassMorphismStyle(),
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            ...getGlowEffect(theme.palette.info.main, 'low')
                        }
                    }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <CompletedIcon color="info" sx={{ mr: 1 }} />
                            <Typography variant="h6" component="div">
                                {translate('Completed')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" color="info.main" sx={{ fontWeight: 'bold' }}>
                            {metrics.completed}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={percentages.completed}
                            sx={{
                                mt: 2,
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'info.light',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: 'info.main'
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            {percentages.completed}% {translate('OfTotal')}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Total budget card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        ...getGlassMorphismStyle(),
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            ...getGlowEffect(theme.palette.secondary.main, 'low')
                        }
                    }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <BudgetIcon color="secondary" sx={{ mr: 1 }} />
                            <Typography variant="h6" component="div">
                                {translate('TotalBudget')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                            ${metrics.totalBudget.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            {translate('AverageBudget', {
                                amount: metrics.total > 0
                                    ? '$' + (metrics.totalBudget / metrics.total).toFixed(2)
                                    : '$0'
                            })}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

CampaignMetrics.propTypes = {
    businessId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    campaignsData: PropTypes.shape({
        campaigns: PropTypes.array
    })
};

export default React.memo(CampaignMetrics);