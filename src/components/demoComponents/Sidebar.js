import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, Drawer, IconButton, List, ListItem, ListItemIcon,
    ListItemText, AppBar, Toolbar, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';

import { useLogout } from '../../hooks/useLogout';
import Branding from './Branding';
import logoImage from '../../assets/logo/default_logo.png';

// Import the useCustomTranslation hook
import useCustomTranslation from "../../hooks/useCustomTranslation";

const Sidebar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Use the translate function from the hook
    const { translate } = useCustomTranslation();

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    // Authentication links
    const authLinks = isAuthenticated ? (
        <ListItem button onClick={() => { handleLogout(); toggleDrawer(false); }} component={RouterLink} to="/">
            <ListItemText primary={translate("Logout")} />
        </ListItem>
    ) : (
        <>
            <ListItem button onClick={toggleDrawer(false)} component={RouterLink} to="/login">
                <ListItemText primary={translate("Login")} />
            </ListItem>
            <ListItem button onClick={toggleDrawer(false)} component={RouterLink} to="/register">
                <ListItemText primary={translate("Register")} />
            </ListItem>
        </>
    );

    // Conditional Links based on Authentication
    const conditionalLinks = isAuthenticated ? (
        <>
            <ListItem button onClick={toggleDrawer(false)} component={RouterLink} to="/grant-search">
                <ListItemText primary={translate("Grant Search")} />
            </ListItem>
            <ListItem button onClick={toggleDrawer(false)} component={RouterLink} to="/grant-categories">
                <ListItemText primary={translate("Grant Categories")} />
            </ListItem>
            <ListItem button onClick={toggleDrawer(false)} component={RouterLink} to="/edit-account">
                <ListItemText primary={translate("Edit Account")} />
            </ListItem>
        </>
    ) : null;

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label={translate("open drawer")}
                        edge="start"
                        onClick={toggleDrawer(true)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <Branding logoUrl={logoUrl} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {translate("Company Name")}
                        </Typography>
                    </RouterLink>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        <ListItem button component={RouterLink} to="/theme">
                            <ListItemText primary={translate("Theme")} />
                        </ListItem>
                        {conditionalLinks}
                        {authLinks}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Sidebar;
