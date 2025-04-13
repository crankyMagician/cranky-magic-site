import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';
import {
    CheckCircle as CompletedIcon,
    Edit as DraftIcon,
    PlayArrow as ActiveIcon
} from '@mui/icons-material';
import useCustomTranslation from '../../hooks/useCustomTranslation';

/**
 * Campaign Status Chip component
 * Displays the status of a campaign with appropriate color and icon
 */
const CampaignStatusChip = ({ status, size = 'small' }) => {
    const { translate } = useCustomTranslation();

    // Define chip properties based on status
    const chipProps = React.useMemo(() => {
        switch (status) {
            case 'active':
                return {
                    label: translate('Active'),
                    color: 'success',
                    icon: <ActiveIcon fontSize="small" />,
                };
            case 'draft':
                return {
                    label: translate('Draft'),
                    color: 'warning',
                    icon: <DraftIcon fontSize="small" />,
                };
            case 'completed':
                return {
                    label: translate('Completed'),
                    color: 'info',
                    icon: <CompletedIcon fontSize="small" />,
                };
            default:
                return {
                    label: translate('Unknown'),
                    color: 'default',
                    icon: null,
                };
        }
    }, [status, translate]);

    return (
        <Chip
            label={chipProps.label}
            color={chipProps.color}
            icon={chipProps.icon}
            size={size}
            variant="outlined"
            sx={{
                fontWeight: 500,
                '& .MuiChip-icon': {
                    marginLeft: '4px'
                }
            }}
        />
    );
};

CampaignStatusChip.propTypes = {
    status: PropTypes.oneOf(['active', 'draft', 'completed', '']).isRequired,
    size: PropTypes.oneOf(['small', 'medium'])
};

export default React.memo(CampaignStatusChip);