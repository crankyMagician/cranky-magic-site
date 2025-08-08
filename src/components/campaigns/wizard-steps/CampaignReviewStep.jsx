import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Card,
    CardMedia,
    CardContent,
    Alert
} from '@mui/material';
import {
    Title as TitleIcon,
    Description as DescriptionIcon,
    Numbers as NumbersIcon,
    Category as CategoryIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as BudgetIcon,
    PeopleAlt as AudienceIcon,
    Image as ImageIcon,
    Movie as VideoIcon,
    InsertDriveFile as FileIcon,
    ViewInAr as ArIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import useCustomTranslation from '../../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../../hooks/useSpatialTheme';
import CampaignStatusChip from "../CampaignStatusChip";

/**
 * CampaignReviewStep - Final step in the campaign wizard to review all information
 * Fixed to properly display the collected data from previous steps
 */
const CampaignReviewStep = ({ formData, isEditMode }) => {
    const { translate } = useCustomTranslation();
    const { isDark, getGlassMorphismStyle } = useSpatialTheme();

    // Format dates safely
    const formatDate = (date) => {
        if (!date) return translate('NotSet');
        try {
            // Handle both Date objects and date strings
            const dateObj = date instanceof Date ? date : new Date(date);
            if (isNaN(dateObj.getTime())) {
                return translate('InvalidDate');
            }
            return format(dateObj, 'PPP');
        } catch (error) {
            console.error('Error formatting date:', error);
            return translate('InvalidDate');
        }
    };

    // Get media icon based on type
    const getMediaIcon = (mediaType) => {
        const type = mediaType?.toLowerCase() || '';

        if (type.includes('ar') || type.includes('vuforia')) {
            return <ArIcon />;
        } else if (type.includes('image') || type.includes('banner') || type.includes('thumbnail') || type.includes('gallery')) {
            return <ImageIcon />;
        } else if (type.includes('video')) {
            return <VideoIcon />;
        } else if (type.includes('document')) {
            return <FileIcon />;
        } else {
            return <FileIcon />;
        }
    };

    // Format budget display
    const formatBudget = (budget) => {
        if (!budget || budget === '0' || budget === 0) {
            return translate('NoBudgetSet');
        }
        const budgetNum = typeof budget === 'string' ? parseFloat(budget) : budget;
        return `$${budgetNum.toFixed(2)}`;
    };

    return (
        <Box>
            <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                {translate('ReviewCampaign')}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {translate('ReviewDescription')}
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                {isEditMode
                    ? translate('ReviewEditModeMessage')
                    : translate('ReviewCreateModeMessage')
                }
            </Alert>

            {/* Basic Information Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    mb: 3
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
                    {translate('BasicInfo')}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <List disablePadding>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <TitleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2" color="text.secondary">{translate('CampaignName')}</Typography>}
                                    secondary={<Typography variant="body1">{formData.name || translate('NotProvided')}</Typography>}
                                />
                            </ListItem>

                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <NumbersIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2" color="text.secondary">{translate('ExternalId')}</Typography>}
                                    secondary={<Typography variant="body1">{formData.externalId || translate('NotProvided')}</Typography>}
                                />
                            </ListItem>

                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <CategoryIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2" color="text.secondary">{translate('Status')}</Typography>}
                                    secondary={<CampaignStatusChip status={formData.status || 'draft'} />}
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <List disablePadding>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <BudgetIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2" color="text.secondary">{translate('Budget')}</Typography>}
                                    secondary={<Typography variant="body1">{formatBudget(formData.budget)}</Typography>}
                                />
                            </ListItem>

                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <AudienceIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2" color="text.secondary">{translate('TargetAudience')}</Typography>}
                                    secondary={<Typography variant="body1">{formData.targetAudience || translate('NotProvided')}</Typography>}
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <DescriptionIcon color="primary" />
                        <Typography variant="body2" color="text.secondary">
                            {translate('Description')}
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ ml: 4 }}>
                        {formData.description || translate('NoDescription')}
                    </Typography>
                </Box>
            </Paper>

            {/* Schedule Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    mb: 3
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
                    {translate('Schedule')}
                </Typography>

                {formData.isScheduled ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <List disablePadding>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemIcon>
                                        <CalendarIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="body2" color="text.secondary">{translate('StartDate')}</Typography>}
                                        secondary={<Typography variant="body1">{formatDate(formData.startDate)}</Typography>}
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <List disablePadding>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemIcon>
                                        <CalendarIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography variant="body2" color="text.secondary">{translate('EndDate')}</Typography>}
                                        secondary={<Typography variant="body1">{formatDate(formData.endDate)}</Typography>}
                                    />
                                </ListItem>
                            </List>
                        </Grid>

                        {/* Campaign Duration */}
                        {formData.startDate && formData.endDate && (
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    {translate('Duration')}: {(() => {
                                    const start = new Date(formData.startDate);
                                    const end = new Date(formData.endDate);
                                    const diffTime = Math.abs(end - start);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                    if (diffDays === 0) {
                                        return translate('SameDay');
                                    } else if (diffDays === 1) {
                                        return translate('OneDay');
                                    } else if (diffDays < 30) {
                                        return translate('DurationDays', { count: diffDays });
                                    } else {
                                        const months = Math.floor(diffDays / 30);
                                        return translate('DurationMonths', { count: months });
                                    }
                                })()}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                ) : (
                    <Typography variant="body1">
                        {translate('NoSchedule')}
                    </Typography>
                )}
            </Paper>

            {/* Media Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
                    {translate('Media')} ({formData.media?.length || 0})
                </Typography>

                {formData.media && formData.media.length > 0 ? (
                    <Grid container spacing={2}>
                        {formData.media.map((media, index) => (
                            <Grid item xs={12} sm={6} md={4} key={`${media.id || index}-${index}`}>
                                <Card sx={{ ...getGlassMorphismStyle(0.9) }}>
                                    {(media.url || media.thumbnailUrl) && (media.type?.includes('image') || media.type?.includes('ar') || !media.type?.includes('document')) ? (
                                        <CardMedia
                                            component="img"
                                            height="120"
                                            image={media.thumbnailUrl || media.url}
                                            alt={media.name}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                height: 120,
                                                bgcolor: 'action.hover',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {getMediaIcon(media.type)}
                                        </Box>
                                    )}
                                    <CardContent sx={{ py: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                                                {media.name || translate('UntitledMedia')}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                {media.source === 'vuforia' && (
                                                    <Chip
                                                        icon={<ArIcon />}
                                                        label="AR"
                                                        size="small"
                                                        color="secondary"
                                                        variant="outlined"
                                                    />
                                                )}
                                                <Chip
                                                    label={media.type || translate('Unknown')}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                            {media.source === 'vuforia'
                                                ? translate('VuforiaUpload')
                                                : media.source === 'existing'
                                                    ? translate('ExistingMedia')
                                                    : translate('MediaSource')}
                                        </Typography>
                                        {media.vuforiaData?.targetId && (
                                            <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                                Target ID: {media.vuforiaData.targetId}
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                            {translate('NoMedia')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {translate('NoMediaDescription')}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Summary Alert */}
            <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                    {isEditMode
                        ? translate('ReadyToUpdateCampaign')
                        : translate('ReadyToCreateCampaign')
                    }
                </Typography>
            </Alert>
        </Box>
    );
};

CampaignReviewStep.propTypes = {
    formData: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        externalId: PropTypes.string,
        status: PropTypes.string,
        budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        targetAudience: PropTypes.string,
        isScheduled: PropTypes.bool,
        startDate: PropTypes.instanceOf(Date),
        endDate: PropTypes.instanceOf(Date),
        media: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
            type: PropTypes.string,
            url: PropTypes.string,
            thumbnailUrl: PropTypes.string,
            source: PropTypes.string,
            metadata: PropTypes.string,
            vuforiaData: PropTypes.object
        }))
    }).isRequired,
    isEditMode: PropTypes.bool
};

CampaignReviewStep.defaultProps = {
    isEditMode: false
};

export default React.memo(CampaignReviewStep);