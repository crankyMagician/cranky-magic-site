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
    Divider,
    Container
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Menu as MenuIcon,
    Login,
    AppRegistration,
    Logout,
} from '@mui/icons-material';
import { useLogout } from '../../hooks/useLogout';

// Import the translation hook
import useCustomTranslation from "../../hooks/useCustomTranslation";

import Branding from '../demoComponents/Branding';
import logoImage from '../../assets/logo/default_logo.png';
import Sidebar from './Sidebar';
import { routes, adaptRoutesForSidebar, useRouteContext } from '../../routes';

// Define the breakpoint for switching to sidebar
const SIDEBAR_BREAKPOINT = 'md';

// Maximum width for the navigation container
const MAX_NAV_WIDTH = 'lg';

const Navbar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const location = useLocation();
    const { userRoles } = useRouteContext();

    // Use the adapter to get navigation items
    const navigationGroups = adaptRoutesForSidebar(routes, isAuthenticated, userRoles);
    // Flatten the groups to get all navigation items
    const navItems = navigationGroups.flatMap(group => group.items);

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSidebarMode = useMediaQuery(theme.breakpoints.down(SIDEBAR_BREAKPOINT));

    // Use the translate function from the hook
    const { translate } = useCustomTranslation();

    // If we're in sidebar mode, render the Sidebar component instead
    if (isSidebarMode) {
        return <Sidebar />;
    }

    // Toggle drawer
    const toggleDrawer = (open) => (event) => {
        if (event?.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    // Render navigation list for both drawer and desktop view
    const renderNavItems = (onClick) => (
        <List sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {navItems.map((item) => (
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
                            backgroundColor: theme.palette.action.selected,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                        },
                    }}
                >
                    <ListItemIcon sx={{
                        minWidth: isMobile ? 40 : 0,
                        mr: isMobile ? 1 : 0.5,
                        color: location.pathname === item.path ?
                            theme.palette.primary.main :
                            theme.palette.text.secondary
                    }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={translate(item.label)}
                        primaryTypographyProps={{
                            variant: 'body2',
                            sx: {
                                display: isMobile ? 'block' : { xs: 'none', sm: 'block' },
                                fontFamily: theme.typography.body2.fontFamily,
                                fontWeight: location.pathname === item.path ? 600 : 400,
                                color: theme.palette.text.primary,
                            }
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
                        onClick={onClick}
                        fullWidth={isMobile}
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
                        onClick={onClick}
                        fullWidth={isMobile}
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

    // Mobile drawer content
    const renderDrawerContent = () => (
        <Box sx={{ width: { xs: '80%', sm: 280 }, p: 2 }} role="presentation">
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

            {navigationGroups.map((group) => (
                <Box key={group.label}>
                    <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        sx={{
                            mt: 2,
                            mb: 1,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                        }}
                    >
                        {translate(group.label)}
                    </Typography>
                    <List>
                        {group.items.map((item) => (
                            <ListItem
                                button
                                key={item.path}
                                component={RouterLink}
                                to={item.path}
                                onClick={toggleDrawer(false)}
                                selected={location.pathname === item.path}
                                sx={{
                                    borderRadius: 1,
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
                </Box>
            ))}

            <Divider sx={{ my: 2 }} />
            {renderAuthButtons(toggleDrawer(false))}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: isMobile ? 1 : 0 }}>
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
                                        width: { xs: '80%', sm: 280 },
                                        backgroundColor: theme.palette.background.paper,
                                    }
                                }}
                            >
                                {renderDrawerContent()}
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
            </Container>
        </AppBar>
    );
};

export default Navbar;