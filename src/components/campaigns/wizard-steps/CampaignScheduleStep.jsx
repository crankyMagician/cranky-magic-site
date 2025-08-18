import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid,
    Typography,
    Paper,
    FormControlLabel,
    Switch,
    Tooltip,
    FormHelperText,
    TextField
} from '@mui/material';
import {
    DatePicker
} from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Info as InfoIcon } from '@mui/icons-material';
import useCustomTranslation from '../../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../../hooks/useSpatialTheme';
import useAnalytics from '../../../analytics/hooks/useAnalytics';

/**
 * CampaignScheduleStep - Second step in the campaign wizard for scheduling
 * Fixed to work with the wizard's onChange prop and date handling
 */
const CampaignScheduleStep = ({ formData, onChange, errors, businessId, isEditMode }) => {
    const { translate } = useCustomTranslation();
    const { isDark } = useSpatialTheme();
    const analytics = useAnalytics();

    // Handle schedule toggle
    const handleScheduleToggle = (event) => {
        const isChecked = event.target.checked;

        // Update isScheduled field
        onChange('isScheduled', isChecked);

        // If unchecking, clear the dates
        if (!isChecked) {
            onChange('startDate', null);
            onChange('endDate', null);
        }

        analytics.trackEvent('campaign_schedule_toggle', {
            is_scheduled: isChecked,
            campaign_id: isEditMode ? formData.id : null,
            business_id: businessId,
            is_edit: isEditMode
        });
    };

    // Handle date changes
    const handleDateChange = (field) => (newDate) => {
        // Update the date field
        onChange(field, newDate);

        analytics.trackEvent('campaign_date_change', {
            field,
            business_id: businessId,
            is_edit: isEditMode
        });
    };

    // Calculate and format duration between two dates
    const calculateDuration = (startDate, endDate) => {
        if (!startDate || !endDate) return '';

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return translate('SameDay');
        } else if (diffDays === 1) {
            return translate('OneDay');
        } else if (diffDays < 30) {
            return translate('DurationDays', { count: diffDays });
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            const remainingDays = diffDays % 30;
            if (remainingDays === 0) {
                return translate('DurationMonths', { count: months });
            }
            return translate('DurationMonthsDays', { months, days: remainingDays });
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            if (remainingMonths === 0) {
                return translate('DurationYears', { count: years });
            }
            return translate('DurationYearsMonths', { years, months: remainingMonths });
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box>
                <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                    {translate('CampaignSchedule')}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {translate('ScheduleDescription')}
                </Typography>

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
                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isScheduled}
                                onChange={handleScheduleToggle}
                                color="primary"
                            />
                        }
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ mr: 1 }}>
                                    {translate('ScheduleCampaign')}
                                </Typography>
                                <Tooltip title={translate('ScheduleCampaignTooltip')}>
                                    <InfoIcon fontSize="small" color="action" />
                                </Tooltip>
                            </Box>
                        }
                        sx={{ mb: 2 }}
                    />

                    {formData.isScheduled && (
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label={translate('StartDate')}
                                    value={formData.startDate}
                                    onChange={handleDateChange('startDate')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                            error: Boolean(errors.startDate),
                                            helperText: errors.startDate,
                                            InputProps: {
                                                sx: { borderRadius: 1 }
                                            }
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={Boolean(errors.startDate)}
                                            helperText={errors.startDate}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label={translate('EndDate')}
                                    value={formData.endDate}
                                    onChange={handleDateChange('endDate')}
                                    minDate={formData.startDate || undefined}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                            error: Boolean(errors.endDate),
                                            helperText: errors.endDate || translate('EndDateHelperText'),
                                            InputProps: {
                                                sx: { borderRadius: 1 }
                                            }
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={Boolean(errors.endDate)}
                                            helperText={errors.endDate || translate('EndDateHelperText')}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    )}
                </Paper>

                {/* Campaign Duration Info */}
                {formData.isScheduled && formData.startDate && formData.endDate && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            {translate('CampaignDuration')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {calculateDuration(formData.startDate, formData.endDate)}
                        </Typography>

                        {/* Additional schedule information */}
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                {translate('StartDate')}: {new Date(formData.startDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                                {translate('EndDate')}: {new Date(formData.endDate).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Warning for past dates in edit mode */}
                {isEditMode && formData.isScheduled && formData.startDate && (
                    (() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const startDate = new Date(formData.startDate);
                        startDate.setHours(0, 0, 0, 0);

                        if (startDate < today) {
                            return (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" color="warning.main">
                                        {translate('CampaignAlreadyStarted')}
                                    </Typography>
                                </Box>
                            );
                        }
                        return null;
                    })()
                )}

                {/* Tips Section */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 4,
                        p: 2,
                        bgcolor: theme => isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(240, 240, 245, 0.7)',
                        borderRadius: 1,
                        border: '1px dashed',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <InfoIcon color="info" sx={{ mt: 0.5 }} />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                                {translate('SchedulingTips')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {translate('CampaignSchedulingTips')}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};

CampaignScheduleStep.propTypes = {
    formData: PropTypes.shape({
        isScheduled: PropTypes.bool,
        startDate: PropTypes.instanceOf(Date),
        endDate: PropTypes.instanceOf(Date),
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object,
    businessId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isEditMode: PropTypes.bool
};

CampaignScheduleStep.defaultProps = {
    errors: {},
    isEditMode: false
};

export default React.memo(CampaignScheduleStep);