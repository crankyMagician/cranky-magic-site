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
    useGetBusinessUsersRolesQuery,
    useGetBusinessUsersPermissionsQuery
} from '../../api/businessUsersApi';

import {
    useCreateBusinessRoleMutation,
    useDeleteBusinessRoleMutation
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
    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [expandedPermissionCategory, setExpandedPermissionCategory] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // Get the active business ID
    const businessId = activeBusiness?.id;

    // RTK Query hooks from businessUsersApi
    const {
        data: businessRolesData = {},
        isLoading: isLoadingRoles,
        refetch: refetchRoles
    } = useGetBusinessUsersRolesQuery(businessId, {
        skip: !businessId
    });

    // Get permissions data from businessUsersApi
    const {
        data: permissionsData = {},
        isLoading: isLoadingPermissions
    } = useGetBusinessUsersPermissionsQuery(undefined, {
        skip: !businessId
    });

    // Mutations from businessApi
    const [createBusinessRole, { isLoading: isCreating }] = useCreateBusinessRoleMutation();
    const [deleteBusinessRole, { isLoading: isDeleting }] = useDeleteBusinessRoleMutation();

    // Memoize the business roles for better performance
    const businessRoles = useMemo(() => {
        return businessRolesData?.roles || [];
    }, [businessRolesData]);

    // Memoize the permissions and organize by category
    const permissionsByCategory = useMemo(() => {
        const permissions = permissionsData?.permissions || [];

        // Group permissions by category
        return permissions.reduce((acc, permission) => {
            // Extract category from permission name (e.g., "Campaign.View" -> "Campaign")
            const category = permission.name.split('.')[0];

            if (!acc[category]) {
                acc[category] = [];
            }

            acc[category].push(permission);
            return acc;
        }, {});
    }, [permissionsData]);

    // Form hook for create role form
    const {
        control: roleControl,
        handleSubmit: handleRoleSubmit,
        reset: resetRoleForm,
        formState: { errors: roleErrors },
        setValue: setRoleValue
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
        }
    });

    // Toggle permission category expansion
    const togglePermissionCategory = (category) => {
        if (expandedPermissionCategory === category) {
            setExpandedPermissionCategory(null);
        } else {
            setExpandedPermissionCategory(category);
        }
    };

    // Handle permission selection
    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    // Handle category selection (select/deselect all permissions in a category)
    const handleCategoryToggle = (category) => {
        const categoryPermissions = permissionsByCategory[category] || [];
        const categoryPermissionIds = categoryPermissions.map(p => p.id);

        // Check if all permissions in this category are already selected
        const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));

        if (allSelected) {
            // Remove all from this category
            setSelectedPermissions(prev => prev.filter(id => !categoryPermissionIds.includes(id)));
        } else {
            // Add all from this category
            setSelectedPermissions(prev => {
                const newPermissions = [...prev];
                categoryPermissionIds.forEach(id => {
                    if (!newPermissions.includes(id)) {
                        newPermissions.push(id);
                    }
                });
                return newPermissions;
            });
        }
    };

    // Open create role dialog
    const handleOpenCreateRoleDialog = () => {
        setCreateRoleDialogOpen(true);
        setSelectedPermissions([]);
        resetRoleForm();

        // Track dialog open for analytics
        analytics.trackEvent('dialog_open', {
            dialog: 'create_business_role',
            businessId
        });
    };

    // Close create role dialog
    const handleCloseCreateRoleDialog = () => {
        setCreateRoleDialogOpen(false);
        resetRoleForm();
        setSelectedPermissions([]);
    };

    // Handle create role submission
    const onCreateRole = async (data) => {
        try {
            // Track form submission
            analytics.trackEvent('form_submit', {
                form: 'create_business_role',
                businessId
            });

            if (selectedPermissions.length === 0) {
                enqueueSnackbar(translate('PleaseSelectAtLeastOnePermission'), { variant: 'warning' });
                return;
            }

            const payload = {
                ...data,
                businessId,
                permissionIds: selectedPermissions
            };

            await createBusinessRole(payload).unwrap();

            // Close dialog and reset form
            handleCloseCreateRoleDialog();
            refetchRoles();

            // Show success message
            enqueueSnackbar(translate('RoleCreatedSuccessfully'), { variant: 'success' });

            // Track successful creation
            analytics.trackEvent('business_role_created', {
                businessId,
                permissionCount: selectedPermissions.length
            });
        } catch (error) {
            console.error('Error creating role:', error);

            // Show error message
            enqueueSnackbar(error.data?.message || translate('ErrorCreatingRole'), { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'create_business_role',
                error: error.data?.message || 'Unknown error',
                businessId
            });
        }
    };

    // Handle confirm delete role
    const handleConfirmDeleteRole = (role) => {
        setRoleToDelete(role);
        setConfirmDeleteDialogOpen(true);

        // Track confirmation dialog
        analytics.trackEvent('dialog_open', {
            dialog: 'confirm_delete_role',
            businessId
        });
    };

    // Handle delete role confirmation
    const handleDeleteRole = async () => {
        if (!roleToDelete) return;

        try {
            await deleteBusinessRole({
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

            // Track role deleted
            analytics.trackEvent('business_role_deleted', {
                businessId,
                roleId: roleToDelete.id
            });
        } catch (error) {
            console.error('Error deleting role:', error);

            // Show error message
            enqueueSnackbar(error.data?.message || translate('ErrorDeletingRole'), { variant: 'error' });

            // Track error
            analytics.trackEvent('error', {
                action: 'delete_business_role',
                error: error.data?.message || 'Unknown error',
                businessId
            });
        }
    };

    // Handle page change for roles table
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change for roles table
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
                        {translate('BusinessRolesManagement')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
                        <Tooltip title={translate('Refresh')}>
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
                            onClick={handleOpenCreateRoleDialog}
                            disabled={!canManageRoles || isLoadingPermissions}
                            sx={{
                                ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                            }}
                        >
                            {translate('CreateRole')}
                        </Button>
                    </Box>
                </Box>

                {/* Roles Table */}
                <Box>
                    {isLoadingRoles ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : businessRoles.length === 0 ? (
                        <Alert severity="info">
                            {translate('NoRolesFound')}
                        </Alert>
                    ) : (
                        <>
                            <TableContainer>
                                <Table aria-label="business roles table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{translate('Name')}</TableCell>
                                            <TableCell>{translate('Description')}</TableCell>
                                            <TableCell>{translate('Permissions')}</TableCell>
                                            <TableCell align="right">{translate('Actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {businessRoles
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((role) => (
                                                <TableRow key={role.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                            {role.name}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{role.description}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {role.permissions && role.permissions.length > 0 ? (
                                                                role.permissions.length > 3 ? (
                                                                    <>
                                                                        {role.permissions.slice(0, 3).map(permission => (
                                                                            <Chip
                                                                                key={permission.id}
                                                                                label={permission.name}
                                                                                size="small"
                                                                                color="primary"
                                                                                variant="outlined"
                                                                                sx={{ mr: 0.5, mb: 0.5 }}
                                                                            />
                                                                        ))}
                                                                        <Chip
                                                                            label={`+${role.permissions.length - 3}`}
                                                                            size="small"
                                                                            color="default"
                                                                            sx={{ mr: 0.5, mb: 0.5 }}
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    role.permissions.map(permission => (
                                                                        <Chip
                                                                            key={permission.id}
                                                                            label={permission.name}
                                                                            size="small"
                                                                            color="primary"
                                                                            variant="outlined"
                                                                            sx={{ mr: 0.5, mb: 0.5 }}
                                                                        />
                                                                    ))
                                                                )
                                                            ) : (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {translate('NoPermissions')}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title={translate('DeleteRole')}>
                                                            <IconButton
                                                                onClick={() => handleConfirmDeleteRole(role)}
                                                                color="error"
                                                                size="small"
                                                                disabled={!canManageRoles}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={businessRoles.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                            />
                        </>
                    )}
                </Box>
            </Paper>

            {/* Create Role Dialog */}
            <Dialog
                open={createRoleDialogOpen}
                onClose={handleCloseCreateRoleDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        ...getGlassMorphismStyle(0.9),
                        borderRadius: 2,
                        ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                    }
                }}
            >
                <DialogTitle>{translate('CreateBusinessRole')}</DialogTitle>
                <form onSubmit={handleRoleSubmit(onCreateRole)}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Controller
                                    name="name"
                                    control={roleControl}
                                    rules={{ required: translate('RoleNameRequired') }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('RoleName')}
                                            fullWidth
                                            margin="normal"
                                            error={!!roleErrors.name}
                                            helperText={roleErrors.name?.message}
                                            InputProps={{
                                                startAdornment: <SecurityIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="description"
                                    control={roleControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label={translate('RoleDescription')}
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={2}
                                            InputProps={{
                                                startAdornment: <DescriptionIcon color="action" sx={{ mr: 1 }} />
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    {translate('SelectPermissions')}
                                </Typography>

                                {isLoadingPermissions ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : Object.keys(permissionsByCategory).length === 0 ? (
                                    <Alert severity="warning">
                                        {translate('NoPermissionsAvailable')}
                                    </Alert>
                                ) : (
                                    <Box sx={{ maxHeight: '400px', overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                        <List component="nav" aria-label="permission categories">
                                            {Object.keys(permissionsByCategory).map((category) => {
                                                const permissions = permissionsByCategory[category];
                                                const categoryPermissionIds = permissions.map(p => p.id);
                                                const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));
                                                const someSelected = categoryPermissionIds.some(id => selectedPermissions.includes(id)) && !allSelected;

                                                return (
                                                    <React.Fragment key={category}>
                                                        <ListItem
                                                            button
                                                            onClick={() => togglePermissionCategory(category)}
                                                            sx={{
                                                                bgcolor: expandedPermissionCategory === category ? 'action.selected' : 'transparent'
                                                            }}
                                                        >
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={allSelected}
                                                                    indeterminate={someSelected}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCategoryToggle(category);
                                                                    }}
                                                                    color="primary"
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText primary={category} />
                                                            {expandedPermissionCategory === category ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </ListItem>

                                                        <Collapse in={expandedPermissionCategory === category} timeout="auto" unmountOnExit>
                                                            <List component="div" disablePadding>
                                                                {permissions.map((permission) => (
                                                                    <ListItem
                                                                        key={permission.id}
                                                                        sx={{ pl: 4 }}
                                                                    >
                                                                        <ListItemIcon>
                                                                            <Checkbox
                                                                                edge="start"
                                                                                checked={selectedPermissions.includes(permission.id)}
                                                                                onChange={() => handlePermissionToggle(permission.id)}
                                                                                color="primary"
                                                                            />
                                                                        </ListItemIcon>
                                                                        <ListItemText
                                                                            primary={permission.name}
                                                                            secondary={permission.description}
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </Collapse>
                                                        <Divider />
                                                    </React.Fragment>
                                                );
                                            })}
                                        </List>
                                    </Box>
                                )}

                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {translate('SelectedPermissions')}: {selectedPermissions.length}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button
                            onClick={handleCloseCreateRoleDialog}
                            color="inherit"
                            disabled={isCreating}
                        >
                            {translate('Cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isCreating}
                            startIcon={isCreating ? <CircularProgress size={20} /> : <AddIcon />}
                            sx={{
                                ...(themePrefs.useGlowEffects && getGlowEffect(theme.palette.primary.main, 'low'))
                            }}
                        >
                            {isCreating ? translate('Creating') : translate('CreateRole')}
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
                <DialogTitle>{translate('ConfirmDeleteRole')}</DialogTitle>
                <DialogContent>
                    {roleToDelete && (
                        <Typography>
                            {translate('DeleteRoleConfirmation', {
                                name: roleToDelete.name
                            })}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setConfirmDeleteDialogOpen(false)}
                        color="inherit"
                        disabled={isDeleting}
                    >
                        {translate('Cancel')}
                    </Button>
                    <Button
                        onClick={handleDeleteRole}
                        variant="contained"
                        color="error"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />}
                    >
                        {isDeleting ? translate('Deleting') : translate('Delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BusinessRolesManagement;