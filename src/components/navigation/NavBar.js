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
    MenuItem,
    useTheme,
    useMediaQuery,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
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

// Import the translation hook
import useCustomTranslation from "../../hooks/useCustomTranslation";

import Branding from '../demoComponents/Branding';
import logoImage from '../../assets/logo/default_logo.png';

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

const Navbar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const location = useLocation();

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Use the translate function from the hook
    const { translate } = useCustomTranslation();

    // Toggle drawer
    const toggleDrawer = (open) => (event) => {
        if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    // Filter navigation items based on authentication status
    const filteredNavItems = navigationItems.filter(item =>
        !item.requiresAuth || (item.requiresAuth && isAuthenticated)
    );

    // Render navigation list for both drawer and desktop view
    const renderNavItems = (onClick) => (
        <List sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {filteredNavItems.map((item) => (
                <ListItem
                    button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    selected={location.pathname === item.path}
                    onClick={onClick}
                    sx={{
                        borderRadius: 1,
                        mx: isMobile ? 0 : 0.5,
                        '&.Mui-selected': {
                            backgroundColor: 'action.selected',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: isMobile ? 40 : 0, mr: isMobile ? 1 : 0.5, color: 'inherit' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={translate(item.label)}
                        primaryTypographyProps={{
                            variant: 'body2',
                            sx: { display: isMobile ? 'block' : { xs: 'none', sm: 'block' } }
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );

    // Render authentication buttons
    const renderAuthButtons = (onClick) => (
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 1, ml: isMobile ? 0 : 2 }}>
            {isAuthenticated ? (
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Logout />}
                    onClick={() => {
                        handleLogout();
                        if (onClick) onClick();
                    }}
                    fullWidth={isMobile}
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
                        onClick={onClick}
                        fullWidth={isMobile}
                    >
                        {translate('Login')}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AppRegistration />}
                        component={RouterLink}
                        to="/register"
                        onClick={onClick}
                        fullWidth={isMobile}
                    >
                        {translate('Register')}
                    </Button>
                </>
            )}
        </Box>
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: isMobile ? 1 : 0 }}>
                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <Branding logoUrl={logoUrl} />
                        <Typography variant="h6" component="div">
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
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={isDrawerOpen}
                            onClose={toggleDrawer(false)}
                        >
                            <Box
                                sx={{ width: 280, p: 2 }}
                                role="presentation"
                            >
                                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <img src={logoUrl} alt="Logo" style={{ height: 40, marginRight: 8 }} />
                                    <Typography variant="h6">
                                        {translate('Company Name')}
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                {renderNavItems(toggleDrawer(false))}
                                <Divider sx={{ my: 2 }} />
                                {renderAuthButtons(toggleDrawer(false))}
                            </Box>
                        </Drawer>
                    </>
                ) : (
                    <>
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            {renderNavItems()}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            {renderAuthButtons()}
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;