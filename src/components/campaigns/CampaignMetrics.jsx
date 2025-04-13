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
                        height: '100%',
                        ...getGlassMorphismStyle(0.8),
                        ...getGlowEffect(theme.palette.primary.main, 'low')
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CampaignIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                            <Typography variant="h6" color="primary">
                                {translate('TotalCampaigns')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" fontWeight="bold">
                            {metrics.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {translate('TotalActiveCampaigns', { count: metrics.active })}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Active campaigns card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        height: '100%',
                        ...getGlassMorphismStyle(0.8),
                        ...getGlowEffect(theme.palette.success.main, 'low')
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <ActiveIcon color="success" sx={{ mr: 1, fontSize: 28 }} />
                            <Typography variant="h6" color="success.main">
                                {translate('ActiveCampaigns')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" fontWeight="bold">
                            {metrics.active}
                        </Typography>
                        <Box sx={{ mt: 1, mb: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {percentages.active}% {translate('OfTotal')}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={percentages.active}
                                color="success"
                                sx={{ height: 6, borderRadius: 3 }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Draft campaigns card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        height: '100%',
                        ...getGlassMorphismStyle(0.8),
                        ...getGlowEffect(theme.palette.warning.main, 'low')
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <DraftIcon color="warning" sx={{ mr: 1, fontSize: 28 }} />
                            <Typography variant="h6" color="warning.main">
                                {translate('DraftCampaigns')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" fontWeight="bold">
                            {metrics.draft}
                        </Typography>
                        <Box sx={{ mt: 1, mb: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {percentages.draft}% {translate('OfTotal')}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={percentages.draft}
                                color="warning"
                                sx={{ height: 6, borderRadius: 3 }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Completed campaigns card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        height: '100%',
                        ...getGlassMorphismStyle(0.8),
                        ...getGlowEffect(theme.palette.info.main, 'low')
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CompletedIcon color="info" sx={{ mr: 1, fontSize: 28 }} />
                            <Typography variant="h6" color="info.main">
                                {translate('CompletedCampaigns')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" fontWeight="bold">
                            {metrics.completed}
                        </Typography>
                        <Box sx={{ mt: 1, mb: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {percentages.completed}% {translate('OfTotal')}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={percentages.completed}
                                color="info"
                                sx={{ height: 6, borderRadius: 3 }}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Total budget card */}
            <Grid item xs={12} sm={6} md={isMobile ? 12 : 2.4}>
                <Card
                    sx={{
                        height: '100%',
                        ...getGlassMorphismStyle(0.8),
                        ...getGlowEffect(theme.palette.secondary.main, 'low')
                    }}
                >
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <BudgetIcon color="secondary" sx={{ mr: 1, fontSize: 28 }} />
                            <Typography variant="h6" color="secondary.main">
                                {translate('TotalBudget')}
                            </Typography>
                        </Box>
                        <Typography variant="h3" component="div" fontWeight="bold">
                            ${metrics.totalBudget.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {translate('AvgCampaignBudget', {
                                avg: metrics.total > 0
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
    businessId: PropTypes.string.isRequired,
    campaignsData: PropTypes.shape({
        campaigns: PropTypes.array
    })
};

export default React.memo(CampaignMetrics);