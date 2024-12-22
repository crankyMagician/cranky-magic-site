import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, Drawer, IconButton, List, ListItem, ListItemIcon,
    ListItemText, AppBar, Toolbar, Typography, Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    GridView,
    Photo,
    Style as StyleIcon,
    ViewList,
    Science,
    Construction,
    Inventory,
    Star
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import Branding from './Branding';
import logoImage from '../../assets/logo/default_logo.png';
import useCustomTranslation from "../../hooks/useCustomTranslation";

const navigationItems = [
    { path: '/theme', label: 'Theme', icon: <StyleIcon /> },
    { path: '/moves-list', label: 'Moves List', icon: <ViewList /> },
    { path: '/moves-grid', label: 'Moves Grid', icon: <GridView /> },
    { path: '/munchie-grid', label: 'Munchie Grid', icon: <GridView /> },
    { path: '/abilities-grid', label: 'Abilities Grid', icon: <Star /> },
    { path: '/recipe-grid', label: 'Recipe Grid', icon: <Construction /> },
    { path: '/items-grid', label: 'Items Grid', icon: <Inventory /> },
    { path: '/effects-grid', label: 'Effects Grid', icon: <Science /> },
    { path: '/munchie-photo', label: 'Munchie Photos', icon: <Photo /> },
    { path: '/item-photo', label: 'Item Photos', icon: <Photo /> }
];

const Sidebar = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { translate } = useCustomTranslation();
    const location = useLocation();

    const toggleDrawer = (open) => (event) => {
        if (event?.type === 'keydown' && (event?.key === 'Tab' || event?.key === 'Shift')) {
            return;
        }
        setIsDrawerOpen(open);
    };

    const NavigationList = () => (
        <List>
            {navigationItems.map((item) => (
                <ListItem
                    button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    selected={location.pathname === item.path}
                    onClick={toggleDrawer(false)}
                    sx={{
                        '&.Mui-selected': {
                            backgroundColor: 'action.selected',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        },
                    }}
                >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={translate(item.label)} />
                </ListItem>
            ))}
        </List>
    );

    const authLinks = isAuthenticated ? (
        <ListItem
            button
            onClick={() => {
                handleLogout();
                toggleDrawer(false)();
            }}
            component={RouterLink}
            to="/"
        >
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

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed">
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
                    <RouterLink
                        to="/"
                        style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Branding logoUrl={logoUrl} />
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            {translate("Dashboard")}
                        </Typography>
                    </RouterLink>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                >
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img src={logoUrl} alt="Logo" style={{ height: 40 }} />
                        <Typography variant="h6">
                            {translate('Dashboard')}
                        </Typography>
                    </Box>
                    <Divider />
                    <NavigationList />
                    <Divider />
                    {authLinks}
                </Box>
            </Drawer>
        </Box>
    );
};

export default Sidebar;