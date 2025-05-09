import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Tabs,
    Tab,
    TextField,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Alert,
    Grid,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Error as ErrorIcon,
    CheckCircle as CheckCircleIcon,
    Send as SendIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

// Import application hooks and utilities
import { useAuth } from '../../hooks/useAuth';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

// Import API hooks from your existing API files
import {
    useGetBusinessUsersQuery,
    useGetBusinessUsersRolesQuery,
} from '../../api/businessApi';


import {

    useUpdateBusinessRoleMutation,
    useRemoveBusinessRoleMutation,
    useGetInvitationsByBusinessQuery,
    useResendInvitationMutation,
    useDeleteInvitationMutation,
    useSendInvitationMutation
} from '../../api/invitationApi';

// Main component
const BusinessUsersManagement = () => {
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { getGlassMorphismStyle, getGlowEffect, isDark, themePrefs } = useSpatialTheme();
    const { user, isAuthenticated, activeBusiness } = useAuth();

    // State for tabs and dialog
    const [activeTab, setActiveTab] = useState(0);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [invitationsPage, setInvitationsPage] = useState(0);
    const [invitationsRowsPerPage, setInvitationsRowsPerPage] = useState(10);

    // Get the active business ID
    const businessId = activeBusiness?.id;

    // RTK Query hooks from businessApi
    const {
        data: businessUsers = [],
        isLoading: isLoadingUsers,
        refetch: refetchUsers
    } = useGetBusinessUsersQuery(businessId, {
        skip: !businessId
    });

    // RTK Query hooks from businessUsersApi
    const {
        data: businessRolesData,
        isLoading: isLoadingRoles
    } = useGetBusinessUsersRolesQuery(businessId, {
        skip: !businessId
    });

    // RTK Query hooks from invitationApi
    const {
        data: invitationsData,
        isLoading: isLoadingInvitations,
        refetch: refetchInvitations
    } = useGetInvitationsByBusinessQuery({
        businessId,
        page: invitationsPage + 1, // API uses 1-based indexing
        pageSize: invitationsRowsPerPage
    }, {
        skip: !businessId
    });

    // Mutations from businessUsersApi and invitationApi
    const [inviteUser, { isLoading: isInviting }] = useSendInvitationMutation();
    const [removeUser, { isLoading: isRemoving }] = useRemoveBusinessRoleMutation();
    const [changeUserRole, { isLoading: isChangingRole }] = useUpdateBusinessRoleMutation();
    const [resendInvitation, { isLoading: isResending }] = useResendInvitationMutation();
    const [deleteInvitation, { isLoading: isDeleting }] = useDeleteInvitationMutation();

    // Memoize the business roles for better performance
    const businessRoles = useMemo(() => {
        return businessRolesData?.roles || [];
    }, [businessRolesData]);

    // Memoize invitations
    const invitations = useMemo(() => {
        return invitationsData?.invitations || [];
    }, [invitationsData]);

    // Form hook for invite user form
    const {
        control: inviteControl,
        handleSubmit: handleInviteSubmit,
        reset: resetInviteForm,
        formState: { errors: inviteErrors },
        watch: watchInvite
    } = useForm({
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            businessRoleId: '',
            customMessage: ''
        }
    });

    // Form hook for edit role form
    const {
        control: roleControl,
        handleSubmit: handleRoleSubmit,
        setValue: setRoleValue,
        formState: { errors: roleErrors }
    } = useForm({
        defaultValues: {
            currentBusinessRoleId: '',
            newBusinessRoleId: ''
        }
    });

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);

        // Track tab change for analytics
        analytics.trackEvent('tab_change', {
            component: 'BusinessUsersManagement',
            tab: newValue === 0 ? 'users' : 'invitations'
        });
    };

    // Open invite dialog
    const handleOpenInviteDialog = () => {
        setInviteDialogOpen(true);

        // Track dialog open for analytics
        analytics.trackEvent('dialog_open', {
            dialog: 'invite_user',
            businessId
        });
    };

    // Close invite dialog
    const handleCloseInviteDialog = () => {
        setInviteDialogOpen(false);
        resetInviteForm();
    };

    // Handle invite user submission
    const onInviteUser = async (data) => {
        try {
            // Track form submission
            analytics.trackEvent('form_submit', {
                form: 'invite_user',
                businessId
            });

            const payload = {
                ...data,
                businessId
            };

            await inviteUser(payload).unwrap();

            // Close dialog and reset form
            handleCloseInviteDialog();
            refetchUsers();
            refetchInvitations();

            // Show success message
            enqueueSnackbar(translate('UserInvitedSuccessfully'), { variant: 'success' });

            // Track successful invitation
            analytics.trackEvent('user_invited', {
                businessId,
                roleId: data.businessRoleId
            });
        } catch (error) {
            console.error('Error inviting user:', error);

            // Show error message
            enqueueSnackbar(error.data?.message || translate('ErrorInvitingUser'), { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'invite_user',
                error: error.data?.message || 'Unknown error',
                businessId
            });
        }
    };

    // Handle delete user
    const handleConfirmDeleteUser = (user) => {
        setUserToDelete(user);
        setConfirmDeleteDialogOpen(true);

        // Track confirmation dialog
        analytics.trackEvent('dialog_open', {
            dialog: 'confirm_delete_user',
            businessId
        });
    };

    // Handle delete user confirmation
    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await removeUser({
                businessId,
                userId: userToDelete.id
            }).unwrap();

            // Close dialog
            setConfirmDeleteDialogOpen(false);
            setUserToDelete(null);

            // Refetch users
            refetchUsers();

            // Show success message
            enqueueSnackbar(translate('UserRemovedSuccessfully'), { variant: 'success' });

            // Track user removed
            analytics.trackEvent('user_removed', {
                businessId,
                userId: userToDelete.id
            });
        } catch (error) {
            console.error('Error removing user:', error);

            // Show error message
            enqueueSnackbar(error.data?.message || translate('ErrorRemovingUser'), { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'remove_user',
                error: error.data?.message || 'Unknown error',
                businessId
            });
        }
    };

    // Handle edit role dialog
    const handleOpenEditRoleDialog = (user) => {
        setSelectedUser(user);

        // Set default role value if user has a role
        if (user.businessRoles && user.businessRoles.length > 0) {
            setRoleValue('currentBusinessRoleId', user.businessRoles[0].id);
            setRoleValue('newBusinessRoleId', user.businessRoles[0].id);
        }

        setEditRoleDialogOpen(true);

        // Track dialog open
        analytics.trackEvent('dialog_open', {
            dialog: 'edit_user_role',
            businessId
        });
    };

    // Handle edit role submission
    const onEditRole = async (data) => {
        if (!selectedUser) return;

        try {
            await changeUserRole({
                userId: selectedUser.id,
                businessId,
                currentBusinessRoleId: data.currentBusinessRoleId,
                newBusinessRoleId: data.newBusinessRoleId
            }).unwrap();

            // Close dialog
            setEditRoleDialogOpen(false);
            setSelectedUser(null);

            // Refetch users
            refetchUsers();

            // Show success message
            enqueueSnackbar(translate('RoleUpdatedSuccessfully'), { variant: 'success' });

            // Track role updated
            analytics.trackEvent('user_role_updated', {
                businessId,
                userId: selectedUser.id,
                oldRoleId: data.currentBusinessRoleId,
                newRoleId: data.newBusinessRoleId
            });
        } catch (error) {
            console.error('Error changing role:', error);

            // Show error message
            enqueueSnackbar(error.data?.message || translate('ErrorChangingRole'), { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'change_user_role',
                error: error.data?.message || 'Unknown error',
                businessId
            });
        }
    };

    // Handle resend invitation
    const handleResendInvitation = async (invitationId) => {
        try {
            await resendInvitation(invitationId).unwrap();

            // Refetch invitations
            refetchInvitations();

            // Show success message
            enqueueSnackbar(translate('InvitationResentSuccessfully'), { variant: 'success' });

            // Track invitation resent
            analytics.trackEvent('invitation_resent', {
                businessId,
                invitationId
            });
        } catch (error) {
            console.error('Error resending invitation:', error);

            // Show error message
            enqueueSnackbar(error.data?.message || translate('ErrorResendingInvitation'), { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'resend_invitation',
                error: error.data?.message || 'Unknown error',
                businessId
            });
        }
    };

    // Handle delete invitation
    const handleDeleteInvitation = async (invitationId) => {
        try {
            await deleteInvitation(invitationId).unwrap();

            // Refetch invitations
            refetchInvitations();

            // Show success message
            enqueueSnackbar(translate('InvitationDeletedSuccessfully'), { variant: 'success' });

            // Track invitation deleted
            analytics.trackEvent('invitation_deleted', {
                businessId,
                invitationId
            });
        } catch (error) {
            console.error('Error deleting invitation:', error);

            // Show error message
            enqueueSnackbar(error.data?.message || translate('ErrorDeletingInvitation'), { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'delete_invitation',
                error: error.data?.message || 'Unknown error',
                businessId
            });
        }
    };

    // Handle page change for users table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change for users table
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle page change for invitations table
    const handleInvitationsChangePage = (event, newPage) => {
        setInvitationsPage(newPage);
    };

    // Handle rows per page change for invitations table
    const handleInvitationsChangeRowsPerPage = (event) => {
        setInvitationsRowsPerPage(parseInt(event.target.value, 10));
        setInvitationsPage(0);
    };

    // Refresh data
    const handleRefresh = () => {
        refetchUsers();
        refetchInvitations();

        // Track refresh
        analytics.trackEvent('refresh_data', {
            component: 'BusinessUsersManagement',
            businessId
        });
    };

    // Format the date nicely
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Check if can manage users
    const canManageUsers = useMemo(() => {
        return isAuthenticated && activeBusiness;
    }, [isAuthenticated, activeBusiness]);

    // Render No Business Alert if no active business
    if (!businessId) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info">
                    {translate('NoActiveBusinessSelected')}
                </Alert>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/businesses')}
                        startIcon={<BusinessIcon />}
                    >
                        {translate('GoToBusinesses')}
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Paper
                elevation={3}
                sx={{
                    ...getGlassMorphismStyle(0.8),
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    borderRadius: 2,
                    ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                    <Typography variant="h4" component="h1">
                        {translate('BusinessUsersManagement')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
                        <Tooltip title={translate('Refresh')}>
                            <IconButton
                                onClick={handleRefresh}
                                color="primary"
                                disabled={isLoadingUsers || isLoadingInvitations}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleOpenInviteDialog}
                            disabled={!canManageUsers}
                            sx={{
                                ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                            }}
                        >
                            {translate('InviteUser')}
                        </Button>
                    </Box>
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant={isMobile ? "fullWidth" : "standard"}
                    sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label={translate('Users')} id="users-tab" />
                    <Tab label={translate('Invitations')} id="invitations-tab" />
                </Tabs>

                {/* Users Tab */}
                {activeTab === 0 && (
                    <Box role="tabpanel" id="users-tabpanel">
                        {isLoadingUsers ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : businessUsers.length === 0 ? (
                            <Alert severity="info">
                                {translate('NoUsersFound')}
                            </Alert>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table aria-label="business users table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{translate('Name')}</TableCell>
                                                <TableCell>{translate('Email')}</TableCell>
                                                <TableCell>{translate('PhoneNumber')}</TableCell>
                                                <TableCell>{translate('Role')}</TableCell>
                                                <TableCell>{translate('Status')}</TableCell>
                                                <TableCell align="right">{translate('Actions')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {businessUsers
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                                {`${user.firstName || ''} ${user.lastName || ''}`}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.phoneNumber || '-'}</TableCell>
                                                        <TableCell>
                                                            {user.businessRoles && user.businessRoles.length > 0 ? (
                                                                <Chip
                                                                    label={user.businessRoles[0].name}
                                                                    size="small"
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                            ) : '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={user.isActive ? translate('Active') : translate('Inactive')}
                                                                size="small"
                                                                color={user.isActive ? "success" : "default"}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <Tooltip title={translate('ChangeRole')}>
                                                                    <IconButton
                                                                        onClick={() => handleOpenEditRoleDialog(user)}
                                                                        color="primary"
                                                                        size="small"
                                                                        disabled={!canManageUsers}
                                                                    >
                                                                        <EditIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title={translate('RemoveUser')}>
                                                                    <IconButton
                                                                        onClick={() => handleConfirmDeleteUser(user)}
                                                                        color="error"
                                                                        size="small"
                                                                        disabled={!canManageUsers}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={businessUsers.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25]}
                                />
                            </>
                        )}
                    </Box>
                )}

                {/* Invitations Tab */}
                {activeTab === 1 && (
                    <Box role="tabpanel" id="invitations-tabpanel">
                        {isLoadingInvitations ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : invitations.length === 0 ? (
                            <Alert severity="info">
                                {translate('NoInvitationsFound')}
                            </Alert>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table aria-label="invitations table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{translate('Name')}</TableCell>
                                                <TableCell>{translate('Email')}</TableCell>
                                                <TableCell>{translate('Role')}</TableCell>
                                                <TableCell>{translate('ExpiresAt')}</TableCell>
                                                <TableCell>{translate('Status')}</TableCell>
                                                <TableCell align="right">{translate('Actions')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {invitations.map((invitation) => (
                                                <TableRow key={invitation.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                            {`${invitation.firstName || ''} ${invitation.lastName || ''}`}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{invitation.email}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={invitation.businessRoleName}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                                                    <TableCell>
                                                        {invitation.accepted === true ? (
                                                            <Chip
                                                                icon={<CheckCircleIcon />}
                                                                label={translate('Accepted')}
                                                                size="small"
                                                                color="success"
                                                            />
                                                        ) : invitation.accepted === false ? (
                                                            <Chip
                                                                icon={<ErrorIcon />}
                                                                label={translate('Declined')}
                                                                size="small"
                                                                color="error"
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label={translate('Pending')}
                                                                size="small"
                                                                color="warning"
                                                            />
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            {invitation.accepted === null && (
                                                                <Tooltip title={translate('ResendInvitation')}>
                                                                    <IconButton
                                                                        onClick={() => handleResendInvitation(invitation.id)}
                                                                        color="primary"
                                                                        size="small"
                                                                        disabled={isResending || !canManageUsers}
                                                                    >
                                                                        <SendIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            <Tooltip title={translate('DeleteInvitation')}>
                                                                <IconButton
                                                                    onClick={() => handleDeleteInvitation(invitation.id)}
                                                                    color="error"
                                                                    size="small"
                                                                    disabled={isDeleting || !canManageUsers}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    component="div"
                                    count={invitationsData?.totalCount || 0}
                                    page={invitationsPage}
                                    onPageChange={handleInvitationsChangePage}
                                    rowsPerPage={invitationsRowsPerPage}
                                    onRowsPerPageChange={handleInvitationsChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25]}
                                />
                            </>
                        )}
                    </Box>
                )}
            </Paper>

            {/* Invite User Dialog */}
            <Dialog
                open={inviteDialogOpen}
                onClose={handleCloseInviteDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        ...getGlassMorphismStyle(0.9),
                        borderRadius: 2,
                        ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                    }
                }}
            >
                <DialogTitle>{translate('InviteUserToYourBusiness')}</DialogTitle>
                <form onSubmit={handleInviteSubmit(onInviteUser)}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="firstName"
                                    control={inviteControl}
                                    rules={{ required: translate('FirstNameRequired') }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('FirstName')}
                                            fullWidth
                                            margin="normal"
                                            error={!!inviteErrors.firstName}
                                            helperText={inviteErrors.firstName?.message}
                                            InputProps={{
                                                startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="lastName"
                                    control={inviteControl}
                                    rules={{ required: translate('LastNameRequired') }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('LastName')}
                                            fullWidth
                                            margin="normal"
                                            error={!!inviteErrors.lastName}
                                            helperText={inviteErrors.lastName?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="email"
                                    control={inviteControl}
                                    rules={{
                                        required: translate('EmailRequired'),
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: translate('InvalidEmail')
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('Email')}
                                            fullWidth
                                            margin="normal"
                                            error={!!inviteErrors.email}
                                            helperText={inviteErrors.email?.message}
                                            InputProps={{
                                                startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="phoneNumber"
                                    control={inviteControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('PhoneNumber')}
                                            fullWidth
                                            margin="normal"
                                            placeholder="+1234567890"
                                            InputProps={{
                                                startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="businessRoleId"
                                    control={inviteControl}
                                    rules={{ required: translate('RoleRequired') }}
                                    render={({ field }) => (
                                        <FormControl fullWidth margin="normal" error={!!inviteErrors.businessRoleId}>
                                            <InputLabel>{translate('Role')}</InputLabel>
                                            <Select
                                                {...field}
                                                label={translate('Role')}
                                            >
                                                {businessRoles.map(role => (
                                                    <MenuItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {inviteErrors.businessRoleId && (
                                                <Typography color="error" variant="caption">
                                                    {inviteErrors.businessRoleId.message}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="customMessage"
                                    control={inviteControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('CustomMessage')}
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={3}
                                            placeholder={translate('CustomMessagePlaceholder')}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={handleCloseInviteDialog}
                            color="inherit"
                            disabled={isInviting}
                        >
                            {translate('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isInviting}
                            startIcon={isInviting ? <CircularProgress size={20} /> : <SendIcon />}
                            sx={{
                                ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                            }}
                        >
                            {isInviting ? translate('Sending') : translate('SendInvitation')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog
                open={editRoleDialogOpen}
                onClose={() => setEditRoleDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        ...getGlassMorphismStyle(0.9),
                        borderRadius: 2,
                        ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                    }
                }}
            >
                <DialogTitle>{translate('ChangeUserRole')}</DialogTitle>
                <form onSubmit={handleRoleSubmit(onEditRole)}>
                    <DialogContent>
                        {selectedUser && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">
                                    {`${selectedUser.firstName} ${selectedUser.lastName}`}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {selectedUser.email}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2">
                                        {translate('CurrentRole')}:&nbsp;
                                        {selectedUser.businessRoles && selectedUser.businessRoles.length > 0 ? (
                                            <Chip
                                                label={selectedUser.businessRoles[0].name}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ) : translate('NoRole')}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        <Controller
                            name="newBusinessRoleId"
                            control={roleControl}
                            rules={{ required: translate('NewRoleRequired') }}
                            render={({ field }) => (
                                <FormControl fullWidth margin="normal" error={!!roleErrors.newBusinessRoleId}>
                                    <InputLabel>{translate('NewRole')}</InputLabel>
                                    <Select
                                        {...field}
                                        label={translate('NewRole')}
                                    >
                                        {businessRoles.map(role => (
                                            <MenuItem key={role.id} value={role.id}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {roleErrors.newBusinessRoleId && (
                                        <Typography color="error" variant="caption">
                                            {roleErrors.newBusinessRoleId.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            )}
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={() => setEditRoleDialogOpen(false)}
                            color="inherit"
                            disabled={isChangingRole}
                        >
                            {translate('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isChangingRole}
                            startIcon={isChangingRole ? <CircularProgress size={20} /> : <EditIcon />}
                            sx={{
                                ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                            }}
                        >
                            {isChangingRole ? translate('Updating') : translate('UpdateRole')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={() => setConfirmDeleteDialogOpen(false)}
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        ...getGlassMorphismStyle(0.9),
                        borderRadius: 2,
                        ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                    }
                }}
            >
                <DialogTitle>{translate('ConfirmRemoveUser')}</DialogTitle>
                <DialogContent>
                    {userToDelete && (
                        <Typography>
                            {translate('RemoveUserConfirmation', {
                                name: `${userToDelete.firstName} ${userToDelete.lastName}`
                            })}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setConfirmDeleteDialogOpen(false)}
                        color="inherit"
                        disabled={isRemoving}
                    >
                        {translate('Cancel')}
                    </Button>
                    <Button
                        onClick={handleDeleteUser}
                        variant="contained"
                        color="error"
                        disabled={isRemoving}
                        startIcon={isRemoving ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        {isRemoving ? translate('Removing') : translate('Remove')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BusinessUsersManagement;