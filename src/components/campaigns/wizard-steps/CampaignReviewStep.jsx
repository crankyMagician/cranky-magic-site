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
    InsertDriveFile as FileIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import useCustomTranslation from '../../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../../hooks/useSpatialTheme';
import CampaignStatusChip from "../CampaignStatusChip";

/**
 * CampaignReviewStep - Final step in the campaign wizard to review all information
 */
const CampaignReviewStep = ({ formData, isEditMode }) => {
    const { translate } = useCustomTranslation();
    const { isDark, getGlassMorphismStyle } = useSpatialTheme();

    // Format dates
    const formatDate = (date) => {
        if (!date) return null;
        try {
            return format(new Date(date), 'PPP');
        } catch (error) {
            return null;
        }
    };

    // Get media icon based on type
    const getMediaIcon = (mimeType) => {
        if (mimeType?.startsWith('image/')) {
            return <ImageIcon />;
        } else if (mimeType?.startsWith('video/')) {
            return <VideoIcon />;
        } else {
            return <FileIcon />;
        }
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
                                    secondary={<Typography variant="body1">{formData.name || '-'}</Typography>}
                                />
                            </ListItem>

                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <NumbersIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2" color="text.secondary">{translate('ExternalId')}</Typography>}
                                    secondary={<Typography variant="body1">{formData.externalId || '-'}</Typography>}
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
                                    secondary={<Typography variant="body1">${formData.budget || '0'}</Typography>}
                                />
                            </ListItem>

                            <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                    <AudienceIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="body2" color="text.secondary">{translate('TargetAudience')}</Typography>}
                                    secondary={<Typography variant="body1">{formData.targetAudience || '-'}</Typography>}
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
                                        secondary={<Typography variant="body1">{formatDate(formData.startDate) || '-'}</Typography>}
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
                                        secondary={<Typography variant="body1">{formatDate(formData.endDate) || '-'}</Typography>}
                                    />
                                </ListItem>
                            </List>
                        </Grid>
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
                    {translate('Media')} ({formData.media.length})
                </Typography>

                {formData.media.length > 0 ? (
                    <Grid container spacing={2}>
                        {formData.media.map((media, index) => (
                            <Grid item xs={12} sm={6} md={4} key={`${media.mediaAssetId}-${index}`}>
                                <Card sx={{ ...getGlassMorphismStyle(0.9) }}>
                                    {media.mimeType?.startsWith('image/') ? (
                                        <CardMedia
                                            component="img"
                                            height="120"
                                            image={media.fileUrl}
                                            alt={media.title}
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
                                            {getMediaIcon(media.mimeType)}
                                        </Box>
                                    )}
                                    <CardContent sx={{ py: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                            <Typography variant="subtitle2" noWrap>
                                                {media.title}
                                            </Typography>
                                            <Chip label={media.campaignMediaType || media.mediaTypeName} size="small" />
                                        </Box>
                                        <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                            {media.mediaTypeName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1">
                        {translate('NoMedia')}
                    </Typography>
                )}
            </Paper>
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
        media: PropTypes.array
    }).isRequired,
    isEditMode: PropTypes.bool
};

export default React.memo(CampaignReviewStep);