import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    InputAdornment,
    Typography,
    Paper
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import useCustomTranslation from '../../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../../hooks/useSpatialTheme';

/**
 * CampaignBasicInfoStep - First step in the campaign wizard for basic information
 */
const CampaignBasicInfoStep = ({ formData, onChange, errors }) => {
    const { translate } = useCustomTranslation();
    const { isDark, getGlassMorphismStyle } = useSpatialTheme();

    // Handle field changes
    const handleChange = (field) => (event) => {
        onChange(field, event.target.value);
    };

    return (
        <Box>
            <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                {translate('CampaignBasicInfo')}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {translate('BasicInfoDescription')}
            </Typography>

            <Grid container spacing={3}>
                {/* Campaign Name */}
                <Grid item xs={12}>
                    <TextField
                        label={translate('CampaignName')}
                        value={formData.name}
                        onChange={handleChange('name')}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        fullWidth
                        required
                        variant="outlined"
                        placeholder={translate('CampaignNamePlaceholder')}
                        InputProps={{
                            sx: { borderRadius: 1 }
                        }}
                    />
                </Grid>

                {/* External ID (optional) */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label={translate('ExternalId')}
                        value={formData.externalId}
                        onChange={handleChange('externalId')}
                        fullWidth
                        variant="outlined"
                        placeholder={translate('ExternalIdPlaceholder')}
                        InputProps={{
                            sx: { borderRadius: 1 }
                        }}
                        helperText={translate('ExternalIdHelp')}
                    />
                </Grid>

                {/* Status */}
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={Boolean(errors.status)}>
                        <InputLabel id="status-label">{translate('Status')}</InputLabel>
                        <Select
                            labelId="status-label"
                            value={formData.status}
                            label={translate('Status')}
                            onChange={handleChange('status')}
                            variant="outlined"
                            sx={{ borderRadius: 1 }}
                        >
                            <MenuItem value="draft">{translate('Draft')}</MenuItem>
                            <MenuItem value="active">{translate('Active')}</MenuItem>
                            <MenuItem value="completed">{translate('Completed')}</MenuItem>
                        </Select>
                        {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* Budget */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label={translate('Budget')}
                        value={formData.budget}
                        onChange={handleChange('budget')}
                        error={Boolean(errors.budget)}
                        helperText={errors.budget || translate('BudgetHelp')}
                        fullWidth
                        variant="outlined"
                        placeholder="0.00"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            sx: { borderRadius: 1 }
                        }}
                    />
                </Grid>

                {/* Target Audience */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label={translate('TargetAudience')}
                        value={formData.targetAudience}
                        onChange={handleChange('targetAudience')}
                        fullWidth
                        variant="outlined"
                        placeholder={translate('TargetAudiencePlaceholder')}
                        InputProps={{
                            sx: { borderRadius: 1 }
                        }}
                    />
                </Grid>

                {/* Campaign Description */}
                <Grid item xs={12}>
                    <TextField
                        label={translate('Description')}
                        value={formData.description}
                        onChange={handleChange('description')}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder={translate('CampaignDescriptionPlaceholder')}
                        InputProps={{
                            sx: { borderRadius: 1 }
                        }}
                    />
                </Grid>
            </Grid>

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
                            {translate('CampaignTips')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {translate('CampaignBasicInfoTips')}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

CampaignBasicInfoStep.propTypes = {
    formData: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
        externalId: PropTypes.string,
        status: PropTypes.string,
        budget: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        targetAudience: PropTypes.string
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object
};

export default React.memo(CampaignBasicInfoStep);