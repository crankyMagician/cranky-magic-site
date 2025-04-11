import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Drawer,
    IconButton,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    ListItemIcon,
    ListItemText,
    Divider,
    Container
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Menu as MenuIcon,
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
import { useLogout } from '../../hooks/useLogout';

// Import the useCustomTranslation hook
import useCustomTranslation from "../../hooks/useCustomTranslation";

import Branding from '../demoComponents/Branding';
import logoImage from '../../assets/logo/default_logo.png';
import Sidebar from './Sidebar';

// Define the breakpoint for switching to sidebar
const SIDEBAR_BREAKPOINT = 'md';

// Maximum width for the navigation container
const MAX_NAV_WIDTH = 'lg';

// Navigation items aligned with MainContent.js routes
const navigationItems = [
    { path: '/', label: 'Home', icon: <Home />, requiresAuth: false },
    { path: '/theme', label: 'Theme', icon: <StyleIcon />, requiresAuth: false },
    { path: '/about-us', label: 'About Us', icon: <Info />, requiresAuth: false },
    { path: '/contact-us', label: 'Contact Us', icon: <ContactMail />, requiresAuth: false },
    { path: '/video-stream', label: 'Video Stream', icon: <VideoLibrary />, requiresAuth: false },
    { path: '/calendar', label: 'Calendar', icon: <CalendarMonth />, requiresAuth: false },
    { path: '/newsletter-signup', label: 'Newsletter', icon: <Email />, requiresAuth: false },
    { path: '/edit-account', label: 'Account Settings', icon: <AccountCircle />, requiresAuth: true },
];

const Hoverbar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const location = useLocation();

    const { translate } = useCustomTranslation();

    // Drawer state for mobile
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSidebarMode = useMediaQuery(theme.breakpoints.down(SIDEBAR_BREAKPOINT));

    // Menu state for hover interactions
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Toggle drawer
    const toggleDrawer = (open) => (event) => {
        if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    // If we're in sidebar mode, render the Sidebar component instead
    if (isSidebarMode) {
        return <Sidebar />;
    }

    // Filter navigation items based on authentication status
    const filteredNavItems = navigationItems.filter(item =>
        !item.requiresAuth || (item.requiresAuth && isAuthenticated)
    );

    // Hover Menu Links
    const renderHoverMenuLinks = () => (
        <Menu
            id="nav-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
                'aria-labelledby': 'nav-button',
                onMouseLeave: handleMenuClose,
            }}
            PaperProps={{
                sx: {
                    mt: 1,
                    backgroundColor: theme.palette.background.paper,
                }
            }}
        >
            {filteredNavItems.map((item) => (
                <MenuItem
                    key={item.path}
                    onClick={handleMenuClose}
                    component={RouterLink}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                        minWidth: 200,
                        '&.Mui-selected': {
                            backgroundColor: theme.palette.action.selected,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                        },
                        py: 1,
                        px: 2,
                    }}
                >
                    <ListItemIcon sx={{
                        color: location.pathname === item.path ?
                            theme.palette.primary.main :
                            theme.palette.text.secondary
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
                </MenuItem>
            ))}
        </Menu>
    );

    // Mobile drawer content
    const renderDrawerContent = () => (
        <Box sx={{ width: { xs: '80%', sm: 280 }, p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <img src={logoUrl} alt="Logo" style={{ height: 40, marginRight: 8 }} />
                <Typography
                    variant="h6"
                    sx={{
                        fontFamily: theme.typography.h6.fontFamily,
                        color: theme.palette.text.primary,
                    }}
                >
                    {translate('Company Name')}
                </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {filteredNavItems.map((item) => (
                <MenuItem
                    key={item.path}
                    onClick={toggleDrawer(false)}
                    component={RouterLink}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                        borderRadius: 1,
                        mb: 0.5,
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
                </MenuItem>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Authentication buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {isAuthenticated ? (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Logout />}
                        onClick={() => {
                            handleLogout();
                            toggleDrawer(false)();
                        }}
                        fullWidth
                        sx={{
                            fontFamily: theme.typography.button.fontFamily,
                            fontWeight: theme.typography.button.fontWeight,
                        }}
                    >
                        {translate('Logout')}
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Login />}
                            component={RouterLink}
                            to="/login"
                            onClick={toggleDrawer(false)}
                            fullWidth
                            sx={{
                                fontFamily: theme.typography.button.fontFamily,
                                fontWeight: theme.typography.button.fontWeight,
                            }}
                        >
                            {translate('Login')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AppRegistration />}
                            component={RouterLink}
                            to="/register"
                            onClick={toggleDrawer(false)}
                            fullWidth
                            sx={{
                                fontFamily: theme.typography.button.fontFamily,
                                fontWeight: theme.typography.button.fontWeight,
                            }}
                        >
                            {translate('Register')}
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );

    // Authentication buttons for desktop view
    const renderAuthButtons = () => (
        <Box sx={{ display: 'flex', gap: 1 }}>
            {isAuthenticated ? (
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    sx={{
                        fontFamily: theme.typography.button.fontFamily,
                        color: theme.palette.text.primary,
                    }}
                >
                    {translate('Logout')}
                </Button>
            ) : (
                <>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Login />}
                        component={RouterLink}
                        to="/login"
                        sx={{
                            fontFamily: theme.typography.button.fontFamily,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {translate('Login')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AppRegistration />}
                        component={RouterLink}
                        to="/register"
                        sx={{
                            fontFamily: theme.typography.button.fontFamily,
                        }}
                    >
                        {translate('Register')}
                    </Button>
                </>
            )}
        </Box>
    );

    return (
        <AppBar
            position="static"
            elevation={1}
            sx={{
                zIndex: theme.zIndex.drawer + 1,
            }}
        >
            <Container maxWidth={MAX_NAV_WIDTH}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                            <Branding logoUrl={logoUrl} />
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontFamily: theme.typography.h6.fontFamily,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {translate('Company Name')}
                            </Typography>
                        </RouterLink>
                    </Box>

                    {isMobile ? (
                        <>
                            <IconButton
                                color="inherit"
                                aria-label={translate("open drawer")}
                                edge="end"
                                onClick={toggleDrawer(true)}
                                sx={{ color: theme.palette.text.primary }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Drawer
                                anchor="right"
                                open={isDrawerOpen}
                                onClose={toggleDrawer(false)}
                                PaperProps={{
                                    sx: {
                                        backgroundColor: theme.palette.background.paper,
                                    }
                                }}
                            >
                                {renderDrawerContent()}
                            </Drawer>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                id="nav-button"
                                aria-controls={isMenuOpen ? 'nav-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={isMenuOpen ? 'true' : undefined}
                                onMouseEnter={handleMenuOpen}
                                endIcon={<MenuIcon />}
                                sx={{
                                    mx: 2,
                                    fontFamily: theme.typography.button.fontFamily,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {translate('Navigation')}
                            </Button>
                            {renderHoverMenuLinks()}

                            <Box sx={{ flexGrow: 0 }}>
                                {renderAuthButtons()}
                            </Box>
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Hoverbar;