import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    AppBar, Toolbar, Typography, Button, Box, Drawer, IconButton,
    Menu, MenuItem, useTheme, useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useLogout } from '../hooks/useLogout';

// Import the useCustomTranslation hook
import useCustomTranslation from "../hooks/useCustomTranslation";

import Branding from './Branding';
import logoImage from '../assets/logo/default_logo.png';


const Hoverbar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;

    const { translate } = useCustomTranslation();

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

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
        >
            <MenuItem onClick={handleMenuClose} component={RouterLink} to="/theme">{translate('Theme')}</MenuItem>
            {isAuthenticated && (
                <>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/grant-search">{translate('Grant Search')}</MenuItem>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/grant-categories">{translate('Grant Categories')}</MenuItem>
                    <MenuItem onClick={handleMenuClose} component={RouterLink} to="/edit-account">{translate('Edit Account')}</MenuItem>
                </>
            )}
        </Menu>
    );

    // Render links for the drawer to ensure they're shown correctly based on authentication status
    const renderDrawerLinks = () => (
        <>
            <MenuItem onClick={toggleDrawer(false)} component={RouterLink} to="/theme">{translate('Theme')}</MenuItem>
            {isAuthenticated ? (
                <>
                    <MenuItem onClick={toggleDrawer(false)} component={RouterLink} to="/grant-search">{translate('Grant Search')}</MenuItem>
                    <MenuItem onClick={toggleDrawer(false)} component={RouterLink} to="/grant-categories">{translate('Grant Categories')}</MenuItem>
                    <MenuItem onClick={toggleDrawer(false)} component={RouterLink} to="/edit-account">{translate('Edit Account')}</MenuItem>
                    <MenuItem onClick={() => { handleLogout(); toggleDrawer(false); }} component={RouterLink} to="/">{translate('Logout')}</MenuItem>
                </>
            ) : (
                <>
                    <MenuItem onClick={toggleDrawer(false)} component={RouterLink} to="/login">{translate('Login')}</MenuItem>
                    <MenuItem onClick={toggleDrawer(false)} component={RouterLink} to="/register">{translate('Register')}</MenuItem>
                </>
            )}
        </>
    );

    // Authentication links
    const renderAuthLinks = () => (
        isAuthenticated ? (
            <MenuItem onClick={() => { handleLogout(); toggleDrawer(false); }} component={RouterLink} to="/">{translate('Logout')}</MenuItem>
        ) : (
            <>
                <MenuItem onClick={toggleDrawer(false)} component={RouterLink} to="/login">{translate('Login')}</MenuItem>
                <MenuItem onClick={toggleDrawer(false)} component={RouterLink} to="/register">{translate('Register')}</MenuItem>
            </>
        )
    );

    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
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
                                sx={{ width: 250 }}
                                role="presentation"
                                onClick={toggleDrawer(false)}
                                onKeyDown={toggleDrawer(false)}
                            >
                                {renderDrawerLinks()}
                            </Box>
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
                            onMouseOver={handleMenuOpen}
                        >
                            {translate('Navigation')}
                        </Button>
                        {renderHoverMenuLinks()}
                        <Box sx={{ flexGrow: 0 }}>
                            {renderAuthLinks()}
                        </Box>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Hoverbar;
