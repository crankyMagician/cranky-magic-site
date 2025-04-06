import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Link,
    Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useCustomTranslation from '../../hooks/useCustomTranslation';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: theme.shape.borderRadius * 2,
        padding: theme.spacing(2),
        maxWidth: '500px',
        width: '100%',
    },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.h5.fontSize,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius,
    },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: theme.spacing(2),
    justifyContent: 'space-between',
}));

const ResendLink = styled(Link)(({ theme }) => ({
    cursor: 'pointer',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    '&:hover': {
        color: theme.palette.primary.dark,
    },
}));

const ConfirmationModal = ({
    open,
    onClose,
    onConfirm,
    onResendCode,
    title,
    description,
    confirmationCode,
    setConfirmationCode,
    isLoading,
    error,
    isResending,
    showResendOption = true,
    confirmButtonText,
    cancelButtonText,
    confirmationCodeLabel,
    resendCodeText,
    resendInstructionsText,
}) => {
    const { translate } = useCustomTranslation();

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirmation-dialog-title"
        >
            <StyledDialogTitle id="confirmation-dialog-title">
                {title}
            </StyledDialogTitle>
            <StyledDialogContent>
                <Typography variant="body1" gutterBottom>
                    {description}
                </Typography>
                <StyledTextField
                    fullWidth
                    label={confirmationCodeLabel || translate('ConfirmationCodeLabel')}
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    error={!!error}
                    helperText={error}
                    disabled={isLoading}
                    placeholder={translate('ConfirmationCodePlaceholder')}
                />
                {showResendOption && (
                    <Box textAlign="center" mt={2}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {resendInstructionsText || translate('ConfirmationResendInstructions')}
                        </Typography>
                        <ResendLink
                            onClick={onResendCode}
                            disabled={isResending}
                            underline="hover"
                        >
                            {isResending
                                ? translate('ResendingCode')
                                : resendCodeText || translate('ResendCode')}
                        </ResendLink>
                    </Box>
                )}
            </StyledDialogContent>
            <StyledDialogActions>
                <Button
                    onClick={onClose}
                    color="secondary"
                    disabled={isLoading}
                >
                    {cancelButtonText || translate('Cancel')}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                    disabled={isLoading || !confirmationCode}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        confirmButtonText || translate('Confirm')
                    )}
                </Button>
            </StyledDialogActions>
        </StyledDialog>
    );
};

export default ConfirmationModal; 