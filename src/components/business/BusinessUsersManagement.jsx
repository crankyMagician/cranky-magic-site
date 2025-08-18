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
    useMediaQuery, FormHelperText
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

    // RTK Query hooks from businessApi - Updated to handle pagination
    const {
        data: businessUsersResponse,
        isLoading: isLoadingUsers,
        refetch: refetchUsers
    } = useGetBusinessUsersQuery({
        businessId,
        page: page + 1, // API uses 1-based indexing
        pageSize: rowsPerPage
    }, {
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
        data: invitationsResponse,
        isLoading: isLoadingInvitations,
        refetch: refetchInvitations
    } = useGetInvitationsByBusinessQuery({
        businessId,
        page: invitationsPage + 1, // API uses 1-based indexing
        pageSize: invitationsRowsPerPage
    }, {
        skip: !businessId
    });

    // Extract users and pagination info from response
    const businessUsers = useMemo(() => {
        return businessUsersResponse?.items || [];
    }, [businessUsersResponse]);

    const totalUsers = useMemo(() => {
        return businessUsersResponse?.totalCount || 0;
    }, [businessUsersResponse]);

    // Extract invitations and pagination info from response
    const invitations = useMemo(() => {
        return invitationsResponse?.items || [];
    }, [invitationsResponse]);

    const totalInvitations = useMemo(() => {
        return invitationsResponse?.totalCount || 0;
    }, [invitationsResponse]);

    // Mutations from businessUsersApi and invitationApi
    const [inviteUser, { isLoading: isInviting }] = useSendInvitationMutation();
    const [removeUser, { isLoading: isRemoving }] = useRemoveBusinessRoleMutation();
    const [changeUserRole, { isLoading: isChangingRole }] = useUpdateBusinessRoleMutation();
    const [resendInvitation, { isLoading: isResending }] = useResendInvitationMutation();
    const [deleteInvitation, { isLoading: isDeleting }] = useDeleteInvitationMutation();

    // Memoize the business roles for better performance
    const businessRoles = useMemo(() => {
        return businessRolesData || [];
    }, [businessRolesData]);

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
            tab: newValue === 0 ? 'users' : 'invitations',
            businessId
        });
    };

    // Handle invite user submission
    const onInviteUser = async (data) => {
        try {
            await inviteUser({
                businessId,
                ...data
            }).unwrap();

            // Close dialog and reset form
            setInviteDialogOpen(false);
            resetInviteForm();

            // Refetch invitations
            refetchInvitations();

            // Show success message
            enqueueSnackbar(translate('InvitationSentSuccessfully'), { variant: 'success' });

            // Track invitation sent
            analytics.trackEvent('invitation_sent', {
                businessId,
                email: data.email,
                roleId: data.businessRoleId
            });
        } catch (error) {
            console.error('Error sending invitation:', error);

            // Show error message - Updated error handling
            const errorMessage = error?.message || error?.data?.message || translate('ErrorSendingInvitation');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'send_invitation',
                error: errorMessage,
                businessId
            });
        }
    };

    // Handle remove user confirmation
    const handleRemoveUserConfirm = async () => {
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

            // Show error message - Updated error handling
            const errorMessage = error?.message || error?.data?.message || translate('ErrorRemovingUser');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'remove_user',
                error: errorMessage,
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
            console.error('Error updating role:', error);

            // Show error message - Updated error handling
            const errorMessage = error?.message || error?.data?.message || translate('ErrorUpdatingRole');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'update_user_role',
                error: errorMessage,
                businessId
            });
        }
    };

    // Handle resend invitation
    const handleResendInvitation = async (invitation) => {
        try {
            await resendInvitation({
                businessId,
                invitationId: invitation.id
            }).unwrap();

            // Show success message
            enqueueSnackbar(translate('InvitationResentSuccessfully'), { variant: 'success' });

            // Track invitation resent
            analytics.trackEvent('invitation_resent', {
                businessId,
                invitationId: invitation.id,
                email: invitation.email
            });
        } catch (error) {
            console.error('Error resending invitation:', error);

            // Show error message - Updated error handling
            const errorMessage = error?.message || error?.data?.message || translate('ErrorResendingInvitation');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'resend_invitation',
                error: errorMessage,
                businessId
            });
        }
    };

    // Handle delete invitation
    const handleDeleteInvitation = async (invitation) => {
        try {
            await deleteInvitation({
                businessId,
                invitationId: invitation.id
            }).unwrap();

            // Refetch invitations
            refetchInvitations();

            // Show success message
            enqueueSnackbar(translate('InvitationDeletedSuccessfully'), { variant: 'success' });

            // Track invitation deleted
            analytics.trackEvent('invitation_deleted', {
                businessId,
                invitationId: invitation.id,
                email: invitation.email
            });
        } catch (error) {
            console.error('Error deleting invitation:', error);

            // Show error message - Updated error handling
            const errorMessage = error?.message || error?.data?.message || translate('ErrorDeletingInvitation');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'delete_invitation',
                error: errorMessage,
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
                        {translate('SelectBusiness')}
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    ...getGlassMorphismStyle(),
                    ...(isDark && getGlowEffect())
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {translate('BusinessUsersManagement')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={translate('RefreshData')}>
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
                            onClick={() => setInviteDialogOpen(true)}
                            disabled={!canManageUsers}
                        >
                            {translate('InviteUser')}
                        </Button>
                    </Box>
                </Box>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ mb: 3 }}
                >
                    <Tab
                        label={`${translate('Users')} (${totalUsers})`}
                        icon={<PersonIcon />}
                        iconPosition="start"
                    />
                    <Tab
                        label={`${translate('Invitations')} (${totalInvitations})`}
                        icon={<EmailIcon />}
                        iconPosition="start"
                    />
                </Tabs>

                {/* Users Tab Content */}
                {activeTab === 0 && (
                    <Box>
                        {isLoadingUsers ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : businessUsers.length === 0 ? (
                            <Alert severity="info">
                                {translate('NoUsersFound')}
                            </Alert>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{translate('Name')}</TableCell>
                                                <TableCell>{translate('Email')}</TableCell>
                                                <TableCell>{translate('PhoneNumber')}</TableCell>
                                                <TableCell>{translate('Roles')}</TableCell>
                                                <TableCell>{translate('Status')}</TableCell>
                                                <TableCell>{translate('JoinedOn')}</TableCell>
                                                <TableCell align="right">{translate('Actions')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {businessUsers.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <PersonIcon fontSize="small" color="action" />
                                                            {user.firstName} {user.lastName}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        {user.phoneNumber || (
                                                            <Typography variant="body2" color="text.secondary">
                                                                {translate('NotProvided')}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.businessRoles && user.businessRoles.length > 0 ? (
                                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                                {user.businessRoles.map((role) => (
                                                                    <Chip
                                                                        key={role.id}
                                                                        label={role.name}
                                                                        size="small"
                                                                        color="primary"
                                                                        variant="outlined"
                                                                    />
                                                                ))}
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                {translate('NoRoles')}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={user.isActive ? translate('Active') : translate('Inactive')}
                                                            color={user.isActive ? 'success' : 'default'}
                                                            size="small"
                                                            icon={user.isActive ? <CheckCircleIcon /> : <ErrorIcon />}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                            <Tooltip title={translate('EditRole')}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleOpenEditRoleDialog(user)}
                                                                    disabled={!canManageUsers}
                                                                >
                                                                    <EditIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title={translate('RemoveUser')}>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => {
                                                                        setUserToDelete(user);
                                                                        setConfirmDeleteDialogOpen(true);
                                                                    }}
                                                                    disabled={!canManageUsers || user.id === user?.id}
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
                                    count={totalUsers}
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

                {/* Invitations Tab Content */}
                {activeTab === 1 && (
                    <Box>
                        {isLoadingInvitations ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : invitations.length === 0 ? (
                            <Alert severity="info">
                                {translate('NoInvitationsFound')}
                            </Alert>
                        ) : (
                            <>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>{translate('Email')}</TableCell>
                                                <TableCell>{translate('Name')}</TableCell>
                                                <TableCell>{translate('Role')}</TableCell>
                                                <TableCell>{translate('Status')}</TableCell>
                                                <TableCell>{translate('SentOn')}</TableCell>
                                                <TableCell>{translate('ExpiresOn')}</TableCell>
                                                <TableCell align="right">{translate('Actions')}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {invitations.map((invitation) => (
                                                <TableRow key={invitation.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <EmailIcon fontSize="small" color="action" />
                                                            {invitation.email}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {invitation.firstName || invitation.lastName ? (
                                                            `${invitation.firstName || ''} ${invitation.lastName || ''}`.trim()
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                {translate('NotProvided')}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {invitation.businessRoleName || (
                                                            <Typography variant="body2" color="text.secondary">
                                                                {translate('NoRole')}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={invitation.accepted ? translate('Accepted') : translate('Pending')}
                                                            color={invitation.accepted ? 'success' : 'warning'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>{formatDate(invitation.createdAt)}</TableCell>
                                                    <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                            {!invitation.accepted && (
                                                                <Tooltip title={translate('ResendInvitation')}>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() => handleResendInvitation(invitation)}
                                                                        disabled={!canManageUsers || isResending}
                                                                    >
                                                                        <SendIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            <Tooltip title={translate('DeleteInvitation')}>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteInvitation(invitation)}
                                                                    disabled={!canManageUsers || isDeleting}
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
                                    count={totalInvitations}
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
                onClose={() => setInviteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                fullScreen={isMobile}
            >
                <form onSubmit={handleInviteSubmit(onInviteUser)}>
                    <DialogTitle>
                        {translate('InviteNewUser')}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Controller
                                    name="email"
                                    control={inviteControl}
                                    rules={{
                                        required: translate('EmailRequired'),
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: translate('InvalidEmailFormat')
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={translate('Email')}
                                            type="email"
                                            error={!!inviteErrors.email}
                                            helperText={inviteErrors.email?.message}
                                            InputProps={{
                                                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="firstName"
                                    control={inviteControl}
                                    rules={{
                                        required: translate('FirstNameRequired')
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={translate('FirstName')}
                                            error={!!inviteErrors.firstName}
                                            helperText={inviteErrors.firstName?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="lastName"
                                    control={inviteControl}
                                    rules={{
                                        required: translate('LastNameRequired')
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={translate('LastName')}
                                            error={!!inviteErrors.lastName}
                                            helperText={inviteErrors.lastName?.message}
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
                                            fullWidth
                                            label={translate('PhoneNumber')}
                                            InputProps={{
                                                startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="businessRoleId"
                                    control={inviteControl}
                                    rules={{
                                        required: translate('RoleRequired')
                                    }}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!inviteErrors.businessRoleId}>
                                            <InputLabel>{translate('SelectRole')}</InputLabel>
                                            <Select {...field} label={translate('SelectRole')}>
                                                <MenuItem value="">
                                                    <em>{translate('None')}</em>
                                                </MenuItem>
                                                {businessRoles.map((role) => (
                                                    <MenuItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {inviteErrors.businessRoleId && (
                                                <FormHelperText>{inviteErrors.businessRoleId.message}</FormHelperText>
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
                                            fullWidth
                                            label={translate('CustomMessage')}
                                            multiline
                                            rows={3}
                                            placeholder={translate('OptionalCustomMessagePlaceholder')}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setInviteDialogOpen(false)}>
                            {translate('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isInviting}
                            startIcon={isInviting ? <CircularProgress size={16} /> : <SendIcon />}
                        >
                            {translate('SendInvitation')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog
                open={editRoleDialogOpen}
                onClose={() => setEditRoleDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <form onSubmit={handleRoleSubmit(onEditRole)}>
                    <DialogTitle>
                        {translate('EditUserRole')}
                    </DialogTitle>
                    <DialogContent>
                        {selectedUser && (
                            <Box sx={{ mb: 3, mt: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {translate('EditingRoleFor')}:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})
                                </Typography>
                            </Box>
                        )}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Controller
                                    name="newBusinessRoleId"
                                    control={roleControl}
                                    rules={{
                                        required: translate('RoleRequired')
                                    }}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!roleErrors.newBusinessRoleId}>
                                            <InputLabel>{translate('SelectNewRole')}</InputLabel>
                                            <Select {...field} label={translate('SelectNewRole')}>
                                                {businessRoles.map((role) => (
                                                    <MenuItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {roleErrors.newBusinessRoleId && (
                                                <FormHelperText>{roleErrors.newBusinessRoleId.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditRoleDialogOpen(false)}>
                            {translate('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isChangingRole}
                            startIcon={isChangingRole ? <CircularProgress size={16} /> : <EditIcon />}
                        >
                            {translate('UpdateRole')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Confirm Delete User Dialog */}
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={() => setConfirmDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {translate('ConfirmRemoveUser')}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {translate('AreYouSureRemoveUser', {
                            name: userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''
                        })}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteDialogOpen(false)}>
                        {translate('Cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleRemoveUserConfirm}
                        disabled={isRemoving}
                        startIcon={isRemoving ? <CircularProgress size={16} /> : <DeleteIcon />}
                    >
                        {translate('RemoveUser')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BusinessUsersManagement;