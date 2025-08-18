import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
    Box,
    IconButton,
    useTheme
} from '@mui/material';
import {
    Warning as WarningIcon,
    Delete as DeleteIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

/**
 * Confirm Dialog component
 * Reusable confirmation dialog with customizable content and actions
 */
const ConfirmDialog = ({
                           open,
                           title,
                           content,
                           confirmText = 'Confirm',
                           cancelText = 'Cancel',
                           confirmColor = 'primary',
                           cancelColor = 'inherit',
                           onConfirm,
                           onCancel,
                           loading = false,
                           icon = null,
                           maxWidth = 'sm'
                       }) => {
    const theme = useTheme();
    const { isDark, getGlassMorphismStyle, getGlowEffect, getAnimationDuration } = useSpatialTheme();

    // Determine icon to display
    const getIconComponent = () => {
        if (icon === 'warning' || confirmColor === 'error') {
            return <WarningIcon color="error" fontSize="large" />;
        }
        if (icon === 'delete') {
            return <DeleteIcon color="error" fontSize="large" />;
        }
        if (icon) {
            return icon;
        }
        return null;
    };

    const displayIcon = getIconComponent();

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth={maxWidth}
            PaperProps={{
                sx: {
                    ...getGlassMorphismStyle(0.95),
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pb: displayIcon ? 1 : 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {displayIcon && (
                        <Box sx={{ mr: 1.5 }}>
                            {displayIcon}
                        </Box>
                    )}
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onCancel}
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: displayIcon ? 1 : 2, pb: 3 }}>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end' }}>
                <Button
                    onClick={onCancel}
                    color={cancelColor}
                    disabled={loading}
                    sx={{
                        minWidth: 100,
                        borderRadius: 1
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    color={confirmColor}
                    variant={confirmColor === 'inherit' ? 'outlined' : 'contained'}
                    disabled={loading}
                    sx={{
                        minWidth: 100,
                        borderRadius: 1,
                        ...getGlowEffect(theme.palette[confirmColor].main, 'low'),
                        transition: getAnimationDuration(300),
                        '&:hover': {
                            transform: 'translateY(-2px)'
                        }
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        confirmText
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    confirmColor: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success', 'inherit']),
    cancelColor: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success', 'inherit']),
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.oneOf(['warning', 'delete', null])]),
    maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};

export default React.memo(ConfirmDialog);