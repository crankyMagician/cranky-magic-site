import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    AppBar,
    Box,
    Button,
    Container,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useRouteContext } from '../../routes';
import useCustomTranslation from '../../hooks/useCustomTranslation';
import { useSpatialTheme } from '../../hooks/useSpatialTheme';

const LandingNavBar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { translate } = useCustomTranslation();
    const { getGlowEffect } = useSpatialTheme();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/services', label: 'Services' },
        { path: '/price', label: 'Price' },
        { path: '/about', label: 'About' },
        { path: '/community', label: 'Community' },
        { path: '/login', label: 'Login' },
    ];

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = (open) => () => setDrawerOpen(open);

    const renderLinks = (onClick) => (
        <List sx={{ display: isMobile ? 'block' : 'flex', alignItems: 'center', gap: isMobile ? 0 : 2 }}>
            {navItems.map((item) => (
                <ListItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={onClick}
                    sx={{
                        color: 'common.white',
                        opacity: location.pathname === item.path ? 1 : 0.82,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        fontWeight: 700,
                        fontFamily: '"Century Gothic", "Apple SD Gothic Neo", "Segoe UI", sans-serif',
                        '&:hover': { opacity: 1, textDecoration: 'underline' },
                    }}
                >
                    <ListItemText primaryTypographyProps={{ variant: 'body2' }} primary={translate(item.label)} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <AppBar
            position="absolute"
            elevation={0}
            sx={{
                background: '#2b2235',
                borderBottom: `1px solid ${theme.palette.primary.main}66`,
                boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ minHeight: 68, gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: { xs: 1, md: 0 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '-0.02em',
                                color: 'common.white',
                            }}
                        >
                            Sam Redpath
                        </Typography>
                    </Box>

                    {isMobile ? (
                        <>
                            <IconButton onClick={toggleDrawer(true)} sx={{ color: 'common.white' }} aria-label={translate('open navigation')}>
                                <MenuIcon />
                            </IconButton>
                            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                                <Box sx={{ width: 280, bgcolor: '#141019', height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                                        <Typography variant="subtitle1" sx={{ color: 'common.white', fontWeight: 700 }}>
                                            Menu
                                        </Typography>
                                        <IconButton onClick={toggleDrawer(false)} sx={{ color: 'common.white' }}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                                    {renderLinks(toggleDrawer(false))}
                                    <Box sx={{ p: 2 }}>
                                        {!isAuthenticated && (
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="info"
                                                startIcon={<LoginIcon />}
                                                component={RouterLink}
                                                to="/login"
                                                onClick={toggleDrawer(false)}
                                                sx={{ 
                                                    fontWeight: 800, 
                                                    color: '#0f0f0f',
                                                    ...getGlowEffect(theme.palette.info.main, 'low')
                                                }}
                                            >
                                                {translate('Login')}
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Drawer>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, ml: 'auto' }}>
                            {renderLinks()}
                            {!isAuthenticated && (
                                <Button
                                    variant="contained"
                                    color="info"
                                    startIcon={<LoginIcon />}
                                    component={RouterLink}
                                    to="/login"
                                    sx={{
                                        fontWeight: 800,
                                        color: '#0f0f0f',
                                        boxShadow: '0 10px 28px rgba(69,147,255,0.4)',
                                        ...getGlowEffect(theme.palette.info.main, 'medium')
                                    }}
                                >
                                    {translate('Login')}
                                </Button>
                            )}
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default LandingNavBar;