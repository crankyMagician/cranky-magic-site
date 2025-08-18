import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
    useMediaQuery,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Collapse
} from '@mui/material';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Security as SecurityIcon,
    Description as DescriptionIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Check as CheckIcon,
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
    useGetBusinessRolesQuery,
    useGetAllPermissionsQuery,
    useCreateBusinessRoleMutation,
    useDeleteBusinessRoleMutation,
    useUpdateBusinessRoleMutation
} from '../../api/businessApi';

// Main component
const BusinessRolesManagement = () => {
    const { translate } = useCustomTranslation();
    const analytics = useAnalytics();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { getGlassMorphismStyle, getGlowEffect, isDark, themePrefs } = useSpatialTheme();
    const { user, isAuthenticated, activeBusiness } = useAuth();

    // State for dialog and role management
    const [createRoleDialogOpen, setCreateRoleDialogOpen] = useState(false);
    const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [roleToEdit, setRoleToEdit] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [expandedPermissionCategory, setExpandedPermissionCategory] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // Get the active business ID
    const businessId = activeBusiness?.id;

    // RTK Query hooks - Updated to handle ServiceResponse
    const {
        data: businessRolesResponse,
        isLoading: isLoadingRoles,
        refetch: refetchRoles
    } = useGetBusinessRolesQuery({
        businessId,
        page: page + 1, // API uses 1-based indexing
        pageSize: rowsPerPage
    }, {
        skip: !businessId
    });

    const {
        data: allPermissionsData,
        isLoading: isLoadingPermissions
    } = useGetAllPermissionsQuery(undefined, {
        skip: !businessId
    });

    // Extract roles and pagination info from ServiceResponse
    const businessRoles = useMemo(() => {
        if (businessRolesResponse?.items) {
            return businessRolesResponse.items;
        }
        // Handle non-paginated response format
        if (Array.isArray(businessRolesResponse)) {
            return businessRolesResponse;
        }
        // Handle direct roles array
        if (businessRolesResponse?.roles) {
            return businessRolesResponse.roles;
        }
        return [];
    }, [businessRolesResponse]);

    const totalRoles = useMemo(() => {
        if (businessRolesResponse?.totalCount !== undefined) {
            return businessRolesResponse.totalCount;
        }
        if (Array.isArray(businessRolesResponse)) {
            return businessRolesResponse.length;
        }
        if (businessRolesResponse?.roles) {
            return businessRolesResponse.roles.length;
        }
        return 0;
    }, [businessRolesResponse]);

    // Extract permissions from ServiceResponse
    const allPermissions = useMemo(() => {
        // Handle array response
        if (Array.isArray(allPermissionsData)) {
            return allPermissionsData;
        }
        // Handle object with permissions property
        if (allPermissionsData?.permissions) {
            return allPermissionsData.permissions;
        }
        return [];
    }, [allPermissionsData]);

    // Mutations
    const [createRole, { isLoading: isCreating }] = useCreateBusinessRoleMutation();
    const [updateRole, { isLoading: isUpdating }] = useUpdateBusinessRoleMutation();
    const [deleteRole, { isLoading: isDeleting }] = useDeleteBusinessRoleMutation();

    // Form hook for create/edit role form
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            permissions: []
        }
    });

    const watchedPermissions = watch('permissions');

    // Group permissions by category
    const groupedPermissions = useMemo(() => {
        const grouped = {};
        allPermissions.forEach(permission => {
            const category = permission.category || 'General';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(permission);
        });
        return grouped;
    }, [allPermissions]);

    // Handle permission toggle
    const handlePermissionToggle = (permissionId) => {
        const currentPermissions = watchedPermissions || [];
        const newPermissions = currentPermissions.includes(permissionId)
            ? currentPermissions.filter(id => id !== permissionId)
            : [...currentPermissions, permissionId];

        setValue('permissions', newPermissions);
        setSelectedPermissions(newPermissions);
    };

    // Handle category expand/collapse
    const handleCategoryToggle = (category) => {
        setExpandedPermissionCategory(
            expandedPermissionCategory === category ? null : category
        );
    };

    // Handle create role submission
    const onCreateRole = async (data) => {
        try {
            const roleData = {
                businessId,
                name: data.name,
                description: data.description,
                permissionIds: data.permissions
            };

            await createRole(roleData).unwrap();

            // Close dialog and reset form
            setCreateRoleDialogOpen(false);
            reset();
            setSelectedPermissions([]);

            // Refetch roles
            refetchRoles();

            // Show success message
            enqueueSnackbar(translate('RoleCreatedSuccessfully'), { variant: 'success' });

            // Track role creation
            analytics.trackEvent('business_role_created', {
                businessId,
                roleName: data.name,
                permissionCount: data.permissions.length
            });
        } catch (error) {
            console.error('Error creating role:', error);

            // Show error message - Updated error handling
            const errorMessage = error?.message || error?.data?.message || translate('ErrorCreatingRole');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'create_business_role',
                error: errorMessage,
                businessId
            });
        }
    };

    // Handle edit role dialog open
    const handleOpenEditDialog = (role) => {
        setRoleToEdit(role);

        // Set form values
        setValue('name', role.name || '');
        setValue('description', role.description || '');

        // Extract permission IDs from role
        const permissionIds = role.permissions?.map(p => p.id) || [];
        setValue('permissions', permissionIds);
        setSelectedPermissions(permissionIds);

        setEditRoleDialogOpen(true);

        // Track dialog open
        analytics.trackEvent('dialog_open', {
            dialog: 'edit_business_role',
            roleId: role.id,
            businessId
        });
    };

    // Handle edit role submission
    const onEditRole = async (data) => {
        if (!roleToEdit) return;

        try {
            const roleData = {
                businessId,
                roleId: roleToEdit.id,
                name: data.name,
                description: data.description,
                permissionIds: data.permissions
            };

            await updateRole(roleData).unwrap();

            // Close dialog and reset
            setEditRoleDialogOpen(false);
            setRoleToEdit(null);
            reset();
            setSelectedPermissions([]);

            // Refetch roles
            refetchRoles();

            // Show success message
            enqueueSnackbar(translate('RoleUpdatedSuccessfully'), { variant: 'success' });

            // Track role update
            analytics.trackEvent('business_role_updated', {
                businessId,
                roleId: roleToEdit.id,
                roleName: data.name
            });
        } catch (error) {
            console.error('Error updating role:', error);

            // Show error message - Updated error handling
            const errorMessage = error?.message || error?.data?.message || translate('ErrorUpdatingRole');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'update_business_role',
                error: errorMessage,
                businessId
            });
        }
    };

    // Handle delete role confirmation
    const handleDeleteRoleConfirm = async () => {
        if (!roleToDelete) return;

        try {
            await deleteRole({
                businessId,
                roleId: roleToDelete.id
            }).unwrap();

            // Close dialog
            setConfirmDeleteDialogOpen(false);
            setRoleToDelete(null);

            // Refetch roles
            refetchRoles();

            // Show success message
            enqueueSnackbar(translate('RoleDeletedSuccessfully'), { variant: 'success' });

            // Track role deletion
            analytics.trackEvent('business_role_deleted', {
                businessId,
                roleId: roleToDelete.id,
                roleName: roleToDelete.name
            });
        } catch (error) {
            console.error('Error deleting role:', error);

            // Show error message - Updated error handling
            const errorMessage = error?.message || error?.data?.message || translate('ErrorDeletingRole');
            enqueueSnackbar(errorMessage, { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'delete_business_role',
                error: errorMessage,
                businessId
            });
        }
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Refresh data
    const handleRefresh = () => {
        refetchRoles();

        // Track refresh
        analytics.trackEvent('refresh_data', {
            component: 'BusinessRolesManagement',
            businessId
        });
    };

    // Check if can manage roles
    const canManageRoles = useMemo(() => {
        return isAuthenticated && activeBusiness;
    }, [isAuthenticated, activeBusiness]);

    // Count permissions for a role
    const getPermissionCount = (role) => {
        return role.permissions?.length || 0;
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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
                        {translate('BusinessRolesManagement')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={translate('RefreshData')}>
                            <IconButton
                                onClick={handleRefresh}
                                color="primary"
                                disabled={isLoadingRoles}
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => setCreateRoleDialogOpen(true)}
                            disabled={!canManageRoles || isLoadingPermissions}
                        >
                            {translate('CreateRole')}
                        </Button>
                    </Box>
                </Box>

                {/* Roles Table */}
                {isLoadingRoles ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : businessRoles.length === 0 ? (
                    <Alert severity="info">
                        {translate('NoRolesFound')}
                    </Alert>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{translate('RoleName')}</TableCell>
                                        <TableCell>{translate('Description')}</TableCell>
                                        <TableCell>{translate('Permissions')}</TableCell>
                                        <TableCell>{translate('UsersCount')}</TableCell>
                                        <TableCell>{translate('CreatedOn')}</TableCell>
                                        <TableCell align="right">{translate('Actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {businessRoles.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <SecurityIcon fontSize="small" color="action" />
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {role.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {role.description || (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {translate('NoDescription')}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${getPermissionCount(role)} ${translate('Permissions')}`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    icon={<CheckIcon />}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={role.usersCount || 0}
                                                    size="small"
                                                    color={role.usersCount > 0 ? 'success' : 'default'}
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(role.createdAt)}</TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Tooltip title={translate('EditRole')}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenEditDialog(role)}
                                                            disabled={!canManageRoles}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title={translate('DeleteRole')}>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => {
                                                                setRoleToDelete(role);
                                                                setConfirmDeleteDialogOpen(true);
                                                            }}
                                                            disabled={!canManageRoles || role.isSystemRole}
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
                            count={totalRoles}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </>
                )}
            </Paper>

            {/* Create Role Dialog */}
            <Dialog
                open={createRoleDialogOpen}
                onClose={() => {
                    setCreateRoleDialogOpen(false);
                    reset();
                    setSelectedPermissions([]);
                }}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                <form onSubmit={handleSubmit(onCreateRole)}>
                    <DialogTitle>
                        {translate('CreateNewRole')}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{
                                        required: translate('RoleNameRequired'),
                                        minLength: {
                                            value: 3,
                                            message: translate('RoleNameMinLength')
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={translate('RoleName')}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={translate('RoleDescription')}
                                            multiline
                                            rows={3}
                                            placeholder={translate('OptionalRoleDescription')}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    {translate('SelectPermissions')}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {isLoadingPermissions ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : (
                                    <List>
                                        {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                            <Box key={category} sx={{ mb: 1 }}>
                                                <ListItem
                                                    button
                                                    onClick={() => handleCategoryToggle(category)}
                                                    sx={{
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 1,
                                                        mb: 0.5
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <DescriptionIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={category}
                                                        secondary={`${permissions.length} ${translate('permissions')}`}
                                                    />
                                                    {expandedPermissionCategory === category ? (
                                                        <ExpandLessIcon />
                                                    ) : (
                                                        <ExpandMoreIcon />
                                                    )}
                                                </ListItem>
                                                <Collapse in={expandedPermissionCategory === category}>
                                                    <Box sx={{ pl: 4, pr: 2 }}>
                                                        <FormGroup>
                                                            {permissions.map((permission) => (
                                                                <FormControlLabel
                                                                    key={permission.id}
                                                                    control={
                                                                        <Checkbox
                                                                            checked={watchedPermissions.includes(permission.id)}
                                                                            onChange={() => handlePermissionToggle(permission.id)}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Box>
                                                                            <Typography variant="body2">
                                                                                {permission.name}
                                                                            </Typography>
                                                                            {permission.description && (
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {permission.description}
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    }
                                                                />
                                                            ))}
                                                        </FormGroup>
                                                    </Box>
                                                </Collapse>
                                            </Box>
                                        ))}
                                    </List>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setCreateRoleDialogOpen(false);
                                reset();
                                setSelectedPermissions([]);
                            }}
                        >
                            {translate('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isCreating}
                            startIcon={isCreating ? <CircularProgress size={16} /> : <AddIcon />}
                        >
                            {translate('CreateRole')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog
                open={editRoleDialogOpen}
                onClose={() => {
                    setEditRoleDialogOpen(false);
                    setRoleToEdit(null);
                    reset();
                    setSelectedPermissions([]);
                }}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                <form onSubmit={handleSubmit(onEditRole)}>
                    <DialogTitle>
                        {translate('EditRole')}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{
                                        required: translate('RoleNameRequired'),
                                        minLength: {
                                            value: 3,
                                            message: translate('RoleNameMinLength')
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={translate('RoleName')}
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label={translate('RoleDescription')}
                                            multiline
                                            rows={3}
                                            placeholder={translate('OptionalRoleDescription')}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    {translate('SelectPermissions')}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {isLoadingPermissions ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : (
                                    <List>
                                        {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                            <Box key={category} sx={{ mb: 1 }}>
                                                <ListItem
                                                    button
                                                    onClick={() => handleCategoryToggle(category)}
                                                    sx={{
                                                        bgcolor: 'background.paper',
                                                        borderRadius: 1,
                                                        mb: 0.5
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        <DescriptionIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={category}
                                                        secondary={`${permissions.length} ${translate('permissions')}`}
                                                    />
                                                    {expandedPermissionCategory === category ? (
                                                        <ExpandLessIcon />
                                                    ) : (
                                                        <ExpandMoreIcon />
                                                    )}
                                                </ListItem>
                                                <Collapse in={expandedPermissionCategory === category}>
                                                    <Box sx={{ pl: 4, pr: 2 }}>
                                                        <FormGroup>
                                                            {permissions.map((permission) => (
                                                                <FormControlLabel
                                                                    key={permission.id}
                                                                    control={
                                                                        <Checkbox
                                                                            checked={watchedPermissions.includes(permission.id)}
                                                                            onChange={() => handlePermissionToggle(permission.id)}
                                                                        />
                                                                    }
                                                                    label={
                                                                        <Box>
                                                                            <Typography variant="body2">
                                                                                {permission.name}
                                                                            </Typography>
                                                                            {permission.description && (
                                                                                <Typography variant="caption" color="text.secondary">
                                                                                    {permission.description}
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    }
                                                                />
                                                            ))}
                                                        </FormGroup>
                                                    </Box>
                                                </Collapse>
                                            </Box>
                                        ))}
                                    </List>
                                )}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setEditRoleDialogOpen(false);
                                setRoleToEdit(null);
                                reset();
                                setSelectedPermissions([]);
                            }}
                        >
                            {translate('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isUpdating}
                            startIcon={isUpdating ? <CircularProgress size={16} /> : <EditIcon />}
                        >
                            {translate('UpdateRole')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Confirm Delete Role Dialog */}
            <Dialog
                open={confirmDeleteDialogOpen}
                onClose={() => setConfirmDeleteDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {translate('ConfirmDeleteRole')}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {translate('AreYouSureDeleteRole', {
                            name: roleToDelete?.name || ''
                        })}
                    </Typography>
                    {roleToDelete?.usersCount > 0 && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            {translate('RoleHasUsersWarning', { count: roleToDelete.usersCount })}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteDialogOpen(false)}>
                        {translate('Cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteRoleConfirm}
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
                    >
                        {translate('DeleteRole')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BusinessRolesManagement;