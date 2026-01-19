import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Grid,
    Popover,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    IconButton,
    Drawer,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronRight,
    Home,
    Login,
    AppRegistration,
    Logout,
} from '@mui/icons-material';

import { useLogout } from '../../hooks/useLogout';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import Sidebar from './Sidebar';
import { routes, adaptRoutesForMegaMenu, useRouteContext } from '../../routes';

// Define a consistent maximum width for navigation components
const MAX_NAV_WIDTH = 'lg';

// Define the breakpoint for switching to sidebar
const SIDEBAR_BREAKPOINT = 'md';

const MegaMenu = () => {
    const theme = useTheme();
    // Use the breakpoint to determine when to switch to Sidebar
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSidebarMode = useMediaQuery(theme.breakpoints.down(SIDEBAR_BREAKPOINT));
    const { translate } = useCustomTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const location = useLocation();
    const { userRoles } = useRouteContext();

    // State for managing menu popovers
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Get navigation items using our new adapter
    const navigationGroups = adaptRoutesForMegaMenu(routes, isAuthenticated, userRoles);

    // Handle menu open/close
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // If we're in sidebar mode, render the Sidebar component instead
    if (isSidebarMode) {
        return <Sidebar />;
    }

    // Find key navigation items to show directly in the top bar
    const homeRoute = routes.find(route => route.path === '/');
    const aboutRoute = routes.find(route => route.path === '/about-us');
    const contactRoute = routes.find(route => route.path === '/contact-us');

    // Mobile drawer content
    const drawer = (
        <Box sx={{ width: 300, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {translate('Company Name')}
                </Typography>
            </Box>
            <Divider />

            {navigationGroups.map((group) => (
                <Box key={group.label}>
                    <Typography
                        variant="h6"
                        sx={{
                            px: 2,
                            py: 1,
                            fontWeight: 'bold',
                            color: theme.palette.text.primary,
                            fontFamily: theme.typography.h6.fontFamily,
                        }}
                    >
                        {translate(group.label)}
                    </Typography>
                    <List>
                        {group.items.map((item) => (
                            <ListItem
                                button
                                component={RouterLink}
                                to={item.path}
                                key={item.path}
                                onClick={handleDrawerToggle}
                                selected={location.pathname === item.path}
                                sx={{
                                    borderRadius: 1,
                                    my: 0.5,
                                    mx: 1,
                                    '&.Mui-selected': {
                                        backgroundColor: theme.palette.action.selected,
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: location.pathname === item.path ?
                                        theme.palette.primary.main :
                                        theme.palette.text.secondary,
                                    minWidth: 40,
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={translate(item.label)}
                                    primaryTypographyProps={{
                                        variant: 'body1',
                                        fontFamily: theme.typography.body1.fontFamily,
                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                        color: theme.palette.text.primary,
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            ))}

            <Box sx={{ px: 2, py: 2 }}>
                {isAuthenticated ? (
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<Logout />}
                        onClick={() => {
                            handleLogout();
                            handleDrawerToggle();
                        }}
                        sx={{
                            fontFamily: theme.typography.button.fontFamily,
                            fontWeight: theme.typography.button.fontWeight,
                        }}
                    >
                        {translate('Logout')}
                    </Button>
                ) : (
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                startIcon={<Login />}
                                component={RouterLink}
                                to="/login"
                                onClick={handleDrawerToggle}
                                sx={{
                                    fontFamily: theme.typography.button.fontFamily,
                                    fontWeight: theme.typography.button.fontWeight,
                                }}
                            >
                                {translate('Login')}
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<AppRegistration />}
                                component={RouterLink}
                                to="/business-signup"
                                onClick={handleDrawerToggle}
                                sx={{
                                    fontFamily: theme.typography.button.fontFamily,
                                    fontWeight: theme.typography.button.fontWeight,
                                }}
                            >
                                {translate('Register')}
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Box>
        </Box>
    );

    // Check if menu is open
    const open = Boolean(anchorEl);
    const id = open ? 'mega-menu-popover' : undefined;

    return (
        <AppBar
            position="static"
            elevation={1}
            sx={{
                zIndex: theme.zIndex.drawer + 1,
            }}
        >
            <Container maxWidth={MAX_NAV_WIDTH}>
                <Toolbar disableGutters>
                    {/* Logo and branding */}
                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                textDecoration: 'none',
                                fontFamily: theme.typography.h6.fontFamily,
                            }}
                        >
                            {translate('Company Name')}
                        </Typography>
                    </RouterLink>

                    {/* Mobile menu icon */}
                    {isMobile ? (
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton
                                size="large"
                                aria-label={translate('open menu')}
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleDrawerToggle}
                                color="inherit"
                                sx={{ color: theme.palette.text.primary }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <>
                            {/* Desktop navigation */}
                            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                                <Button
                                    aria-describedby={id}
                                    onClick={handleMenuOpen}
                                    onMouseEnter={handleMenuOpen}
                                    color="inherit"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: theme.palette.text.primary,
                                        fontFamily: theme.typography.button.fontFamily,
                                    }}
                                >
                                    {translate('Menu')}
                                </Button>

                                {/* Direct navigation buttons for key pages */}
                                {homeRoute && (
                                    <Button
                                        component={RouterLink}
                                        to={homeRoute.path}
                                        color="inherit"
                                        sx={{
                                            ml: 2,
                                            color: location.pathname === homeRoute.path ?
                                                theme.palette.primary.main :
                                                theme.palette.text.primary,
                                            fontFamily: theme.typography.button.fontFamily,
                                        }}
                                    >
                                        {translate(homeRoute.meta.title)}
                                    </Button>
                                )}

                                {aboutRoute && (
                                    <Button
                                        component={RouterLink}
                                        to={aboutRoute.path}
                                        color="inherit"
                                        sx={{
                                            ml: 2,
                                            color: location.pathname === aboutRoute.path ?
                                                theme.palette.primary.main :
                                                theme.palette.text.primary,
                                            fontFamily: theme.typography.button.fontFamily,
                                        }}
                                    >
                                        {translate(aboutRoute.meta.title)}
                                    </Button>
                                )}

                                {contactRoute && (
                                    <Button
                                        component={RouterLink}
                                        to={contactRoute.path}
                                        color="inherit"
                                        sx={{
                                            ml: 2,
                                            color: location.pathname === contactRoute.path ?
                                                theme.palette.primary.main :
                                                theme.palette.text.primary,
                                            fontFamily: theme.typography.button.fontFamily,
                                        }}
                                    >
                                        {translate(contactRoute.meta.title)}
                                    </Button>
                                )}
                            </Box>

                            {/* Authentication buttons */}
                            <Box sx={{ flexGrow: 0 }}>
                                {isAuthenticated ? (
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={handleLogout}
                                        startIcon={<Logout />}
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontFamily: theme.typography.button.fontFamily,
                                        }}
                                    >
                                        {translate('Logout')}
                                    </Button>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            component={RouterLink}
                                            to="/login"
                                            startIcon={<Login />}
                                            sx={{
                                                color: theme.palette.text.primary,
                                                fontFamily: theme.typography.button.fontFamily,
                                            }}
                                        >
                                            {translate('Login')}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            component={RouterLink}
                                            to="/business-signup"
                                            startIcon={<AppRegistration />}
                                            sx={{
                                                fontFamily: theme.typography.button.fontFamily,
                                            }}
                                        >
                                            {translate('Register')}
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </Toolbar>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={isMobile && mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
                PaperProps={{
                    sx: {
                        width: { xs: '80%', sm: 300 },
                        backgroundColor: theme.palette.background.paper,
                    }
                }}
            >
                {drawer}
            </Drawer>

            {/* Mega Menu Popover (desktop) */}
            <Popover
                id={id}
                open={open && !isMobile}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    onMouseLeave: handleMenuClose,
                    sx: {
                        width: '80%',
                        maxWidth: 1000,
                        mt: 1,
                        backgroundColor: theme.palette.background.paper,
                    }
                }}
            >
                <Paper
                    sx={{
                        p: 2,
                        backgroundColor: theme.palette.background.paper,
                    }}
                    elevation={0}
                >
                    <Grid container spacing={3}>
                        {navigationGroups.map((group) => (
                            <Grid item xs={12} sm={3} key={group.label}>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 'bold',
                                        fontFamily: theme.typography.h6.fontFamily,
                                    }}
                                >
                                    {translate(group.label)}
                                </Typography>
                                <List dense>
                                    {group.items.map((item) => (
                                        <ListItem
                                            button
                                            component={RouterLink}
                                            to={item.path}
                                            key={item.path}
                                            onClick={handleMenuClose}
                                            sx={{
                                                borderRadius: 1,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.action.hover,
                                                },
                                            }}
                                        >
                                            <ListItemIcon sx={{
                                                minWidth: 36,
                                                color: theme.palette.text.secondary,
                                            }}>
                                                {item.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={translate(item.label)}
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontFamily: theme.typography.body2.fontFamily,
                                                    color: theme.palette.text.primary,
                                                }}
                                            />
                                            <ChevronRight fontSize="small" color="action" />
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Popover>
        </AppBar>
    );
};

export default MegaMenu;