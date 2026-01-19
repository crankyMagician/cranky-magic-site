import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    AppBar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { routes, adaptRoutesForSidebar, useRouteContext } from '../../routes';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useLogout } from '../../hooks/useLogout';
import BusinessContextSwitcher from '../business/BusinessContextSwitcher';

/**
 * PillNavBar - App-wide pill-shaped navbar
 *
 * Features:
 * - Pill design with rounded corners (not sticky/fixed)
 * - Strict monochrome palette (black/white) - intentionally overrides theme
 * - Responsive breakpoints: xs, sm, md, lg
 * - Mobile drawer navigation
 * - Auth-aware (shows Login/Register or BusinessSwitcher/Logout)
 */
const PillNavBar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { translate } = useCustomTranslation();
    const { getGlowEffect } = useAppTheme();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const location = useLocation();

    const handleLogout = useLogout();
    const { userRoles } = useRouteContext();

    // Get dynamic navigation items
    const navigationGroups = adaptRoutesForSidebar(routes, isAuthenticated, userRoles);
    // Flatten groups for the top bar, filtering out items that shouldn't appear
    const navItems = navigationGroups.flatMap(group => group.items);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = (open) => () => setDrawerOpen(open);

    const renderLinks = (onClick) => (
        <List sx={{ display: isMobile ? 'block' : 'flex', alignItems: 'center', gap: isMobile ? 0 : 1 }}>
            {navItems.map((item) => (
                <ListItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={onClick}
                    sx={{
                        color: '#ffffff !important',
                        opacity: location.pathname === item.path ? 1 : 0.7,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 700,
                        width: 'auto',
                        padding: isMobile ? '12px 16px' : '8px 16px',
                        borderRadius: '20px',
                        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
                        transition: 'all 0.2s',
                        borderBottom: isMobile ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        '&:hover': {
                            opacity: 1,
                            color: '#ffffff !important',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            textDecoration: 'none'
                        },
                    }}
                >
                    {isMobile && item.icon && (
                        <ListItemIcon sx={{ color: '#ffffff', minWidth: 36 }}>
                            {item.icon}
                        </ListItemIcon>
                    )}
                    <ListItemText
                        primaryTypographyProps={{
                            variant: isMobile ? 'h6' : 'body2',
                            fontWeight: 700,
                            style: { fontSize: isMobile ? '1.1rem' : '0.85rem', color: '#ffffff' }
                        }}
                        primary={translate(item.label)}
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <AppBar
            position="static"
            elevation={8}
            sx={{
                // Pill-shaped navbar with rounded corners (scrolls with page)
                background: '#000000 !important',
                border: '1px solid rgba(255, 255, 255, 0.15) !important',
                // Pill shape with responsive border radius
                borderRadius: {
                    xs: '24px !important',
                    sm: '32px !important',
                    md: '50px !important'
                },
                // Center the pill with margin
                mx: 'auto',
                mt: { xs: 1.5, sm: 2, md: 3 },
                mb: { xs: 1.5, sm: 2, md: 3 },
                width: {
                    xs: '92%',
                    sm: '94%',
                    md: '90%',
                    lg: '1200px'
                },
                maxWidth: '100%',
                boxShadow: '0 10px 40px rgba(0,0,0,0.6) !important',
            }}
        >
            <Container maxWidth={false} sx={{
                px: { xs: 2, md: 4 },
            }}>
                <Toolbar disableGutters sx={{
                    minHeight: { xs: 56, md: 72 },
                    transition: 'all 0.3s',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: { xs: 1, md: 0 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 900,
                                letterSpacing: '0.05em',
                                color: '#ffffff !important',
                                textTransform: 'uppercase',
                                fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
                                fontSize: { xs: '0.9rem', md: '1.25rem' },
                                display: 'block',
                                ...getGlowEffect('#ffffff', 'low')
                            }}
                        >
                            Sam Redpath
                        </Typography>
                    </Box>

                    {isMobile ? (
                        <>
                            <IconButton
                                onClick={toggleDrawer(true)}
                                sx={{
                                    color: '#ffffff !important',
                                    ml: 'auto',
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    p: 0.8,
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                                aria-label={translate('open navigation')}
                            >
                                <MenuIcon fontSize="small" />
                            </IconButton>
                            <Drawer
                                anchor="right"
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                                PaperProps={{
                                    sx: {
                                        width: '100%',
                                        maxWidth: 300,
                                        bgcolor: '#000000 !important',
                                        borderLeft: '1px solid rgba(255,255,255,0.1) !important',
                                        color: '#ffffff !important',
                                        backgroundImage: 'none !important'
                                    }
                                }}
                            >
                                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#000000' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Century Gothic", sans-serif', color: '#ffffff' }}>
                                            {translate('MENU')}
                                        </Typography>
                                        <IconButton onClick={toggleDrawer(false)} sx={{ color: '#ffffff' }} aria-label={translate('close navigation')}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ flexGrow: 1, py: 2, overflowY: 'auto' }}>
                                        {renderLinks(toggleDrawer(false))}
                                    </Box>

                                    <Box sx={{ p: 3, mb: 2, display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                        {isAuthenticated ? (
                                            <>
                                                <BusinessContextSwitcher
                                                    fullWidth
                                                    sx={{
                                                        bgcolor: 'rgba(255,255,255,0.05)',
                                                        color: 'white',
                                                        '& .MuiSelect-select': { color: 'white' },
                                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                                                    }}
                                                />
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="inherit"
                                                    startIcon={<LogoutIcon />}
                                                    onClick={() => {
                                                        handleLogout();
                                                        toggleDrawer(false)();
                                                    }}
                                                    sx={{
                                                        fontWeight: 800,
                                                        color: '#ffffff',
                                                        borderColor: 'rgba(255,255,255,0.3)',
                                                        borderRadius: '25px',
                                                        py: 1.5,
                                                        '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' }
                                                    }}
                                                >
                                                    {translate('Logout')}
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    fullWidth
                                                    variant="text"
                                                    color="inherit"
                                                    startIcon={<LoginIcon />}
                                                    component={RouterLink}
                                                    to="/login"
                                                    onClick={toggleDrawer(false)}
                                                    sx={{ fontWeight: 800, color: '#ffffff', py: 1.5 }}
                                                >
                                                    {translate('Login')}
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={<AppRegistrationIcon />}
                                                    component={RouterLink}
                                                    to="/business-signup"
                                                    onClick={toggleDrawer(false)}
                                                    sx={{
                                                        fontWeight: 800,
                                                        borderRadius: '25px',
                                                        bgcolor: '#ffffff',
                                                        color: '#000000',
                                                        py: 1.5,
                                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                                                        ...getGlowEffect('#ffffff', 'low')
                                                    }}
                                                >
                                                    {translate('Register')}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                            {renderLinks()}

                            <Box sx={{ ml: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                                {isAuthenticated ? (
                                    <>
                                        <BusinessContextSwitcher
                                            sx={{
                                                minWidth: 180,
                                                bgcolor: 'rgba(255,255,255,0.05)',
                                                color: 'white',
                                                '& .MuiSelect-select': { color: 'white' },
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }
                                            }}
                                        />
                                        <Button
                                            variant="text"
                                            color="inherit"
                                            onClick={handleLogout}
                                            startIcon={<LogoutIcon />}
                                            sx={{
                                                fontWeight: 800,
                                                color: '#ffffff',
                                                opacity: 0.8,
                                                '&:hover': { opacity: 1 }
                                            }}
                                        >
                                            {translate('Logout')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="text"
                                            color="inherit"
                                            size="large"
                                            component={RouterLink}
                                            to="/login"
                                            sx={{
                                                fontWeight: 800,
                                                color: '#ffffff',
                                                opacity: 0.8,
                                                '&:hover': { opacity: 1 }
                                            }}
                                        >
                                            {translate('Login')}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            component={RouterLink}
                                            to="/business-signup"
                                            sx={{
                                                fontWeight: 800,
                                                bgcolor: '#ffffff',
                                                color: '#000000',
                                                borderRadius: '25px',
                                                px: 3,
                                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                                                ...getGlowEffect('#ffffff', 'low')
                                            }}
                                        >
                                            {translate('Register')}
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default PillNavBar;
