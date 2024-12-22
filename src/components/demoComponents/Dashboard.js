// src/components/Dashboard.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, IconButton, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useLogout } from '../../hooks/useLogout';
import useCustomTranslation from "../../hooks/useCustomTranslation"; // Import custom translation hook
import Branding from './Branding';
import logoImage from '../../assets/logo/default_logo.png';


const Dashboard = () => {
    const { translate } = useCustomTranslation(); // Use the translation hook
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                {translate('Company Name')}
            </Typography>
            <MenuItem component={RouterLink} to="/theme" onClick={handleDrawerToggle}>{translate('Theme')}</MenuItem>
            {isAuthenticated && (
                <>
                    <MenuItem component={RouterLink} to="/grant-search" onClick={handleDrawerToggle}>{translate('Grant Search')}</MenuItem>
                    <MenuItem component={RouterLink} to="/grant-categories" onClick={handleDrawerToggle}>{translate('Grant Categories')}</MenuItem>
                    <MenuItem component={RouterLink} to="/edit-account" onClick={handleDrawerToggle}>{translate('Edit Account')}</MenuItem>
                    <MenuItem component={RouterLink} to="/" onClick={() => { handleLogout(); handleDrawerToggle(); }}>{translate('Logout')}</MenuItem>
                </>
            )}
            {!isAuthenticated && (
                <>
                    <MenuItem component={RouterLink} to="/login" onClick={handleDrawerToggle}>{translate('Login')}</MenuItem>
                    <MenuItem component={RouterLink} to="/register" onClick={handleDrawerToggle}>{translate('Register')}</MenuItem>
                </>
            )}
        </Box>
    );

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label={translate("open drawer")}
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                            <Branding logoUrl={logoUrl} />
                            <Typography variant="h6" component="div">
                                {translate('Company Name')}
                            </Typography>
                        </RouterLink>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
                        <Button color="inherit" component={RouterLink} to="/theme">{translate('Theme')}</Button>
                        {isAuthenticated && (
                            <>
                                <Button color="inherit" component={RouterLink} to="/grant-search">{translate('Grant Search')}</Button>
                                <Button color="inherit" component={RouterLink} to="/grant-categories">{translate('Grant Categories')}</Button>
                                <Button color="inherit" component={RouterLink} to="/edit-account">{translate('Edit Account')}</Button>
                            </>
                        )}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {isAuthenticated ? (
                            <Button color="inherit" component={RouterLink} to="/" onClick={handleLogout}>{translate('Logout')}</Button>
                        ) : (
                            <>
                                <Button color="inherit" component={RouterLink} to="/login">{translate('Login')}</Button>
                                <Button color="inherit" component={RouterLink} to="/register">{translate('Register')}</Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            )}
        </Box>
    );
};

export default Dashboard;
