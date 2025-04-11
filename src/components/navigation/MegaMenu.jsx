import React, { useState, useEffect } from 'react';
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
    Avatar
} from '@mui/material';
import {
    Menu as MenuIcon,
    GridView,
    ChevronRight,
    Home,
    CalendarMonth,
    Info,
    ContactMail,
    Email,
    Login,
    AppRegistration,
    VideoLibrary,
    Style as StyleIcon,
    AccountCircle,
    Logout,
} from '@mui/icons-material';

import Branding from '../demoComponents/Branding';
import logoImage from '../../assets/logo/default_logo.png';
import { useLogout } from '../../hooks/useLogout';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import Sidebar from './Sidebar';

// Define a consistent maximum width for navigation components
const MAX_NAV_WIDTH = 'lg';

// Define the breakpoint for switching to sidebar
const SIDEBAR_BREAKPOINT = 'md';

// Define the navigation items based on the routes in MainContent.js
const navigationGroups = [
    {
        title: 'Main',
        items: [
            { path: '/', label: 'Home', icon: <Home /> },
            { path: '/theme', label: 'Theme', icon: <StyleIcon /> },
            { path: '/about-us', label: 'About Us', icon: <Info /> },
            { path: '/contact-us', label: 'Contact Us', icon: <ContactMail /> },
        ]
    },
    {
        title: 'Media',
        items: [
            { path: '/video-stream', label: 'Video Stream', icon: <VideoLibrary /> },
            { path: '/calendar', label: 'Calendar', icon: <CalendarMonth /> },
        ]
    },
    {
        title: 'Community',
        items: [
            { path: '/newsletter-signup', label: 'Newsletter', icon: <Email /> },
        ]
    },
    {
        title: 'Account',
        requiresAuth: true,
        items: [
            { path: '/edit-account', label: 'Account Settings', icon: <AccountCircle /> },
        ]
    }
];

const MegaMenu = () => {
    const theme = useTheme();
    // Use the breakpoint to determine when to switch to Sidebar
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSidebarMode = useMediaQuery(theme.breakpoints.down(SIDEBAR_BREAKPOINT));
    const { translate } = useCustomTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const location = useLocation();

    // State for managing menu popovers
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

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

    // Mobile drawer content
    const drawer = (
        <Box sx={{ width: 300, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <img src={logoUrl} alt="Logo" style={{ height: 40 }} />
            </Box>
            <Divider />

            {navigationGroups.map((group) => (
                (!group.requiresAuth || (group.requiresAuth && isAuthenticated)) && (
                    <Box key={group.title}>
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
                            {translate(group.title)}
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
                )
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
                                to="/register"
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
                        <Branding logoUrl={logoUrl} />
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
                                <Button
                                    component={RouterLink}
                                    to="/"
                                    color="inherit"
                                    sx={{
                                        ml: 2,
                                        color: location.pathname === '/' ?
                                            theme.palette.primary.main :
                                            theme.palette.text.primary,
                                        fontFamily: theme.typography.button.fontFamily,
                                    }}
                                >
                                    {translate('Home')}
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/about-us"
                                    color="inherit"
                                    sx={{
                                        ml: 2,
                                        color: location.pathname === '/about-us' ?
                                            theme.palette.primary.main :
                                            theme.palette.text.primary,
                                        fontFamily: theme.typography.button.fontFamily,
                                    }}
                                >
                                    {translate('About Us')}
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/contact-us"
                                    color="inherit"
                                    sx={{
                                        ml: 2,
                                        color: location.pathname === '/contact-us' ?
                                            theme.palette.primary.main :
                                            theme.palette.text.primary,
                                        fontFamily: theme.typography.button.fontFamily,
                                    }}
                                >
                                    {translate('Contact Us')}
                                </Button>
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
                                            to="/register"
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
                            (!group.requiresAuth || (group.requiresAuth && isAuthenticated)) && (
                                <Grid item xs={12} sm={3} key={group.title}>
                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        sx={{
                                            mb: 1,
                                            fontWeight: 'bold',
                                            fontFamily: theme.typography.h6.fontFamily,
                                        }}
                                    >
                                        {translate(group.title)}
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
                            )
                        ))}
                    </Grid>
                </Paper>
            </Popover>
        </AppBar>
    );
};

export default MegaMenu;