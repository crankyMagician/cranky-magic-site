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
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useLogout } from '../../hooks/useLogout';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import Branding from './Branding';
import logoImage from '../../assets/logo/default_logo.png';

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

const Dashboard = () => {
    const { translate } = useCustomTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const NavigationList = ({ onClick }) => (
        <List>
            {navigationItems.map((item) => (
                <ListItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={onClick}
                    selected={location.pathname === item.path}
                    sx={{
                        color: 'text.primary',
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

    const drawer = (
        <Box sx={{ width: 250 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <img src={logoUrl} alt="Logo" style={{ height: 40 }} />
                <Typography variant="h6">
                    {translate('Dashboard')}
                </Typography>
            </Box>
            <Divider />
            <NavigationList onClick={handleDrawerToggle} />
            <Divider />
            {isAuthenticated ? (
                <MenuItem onClick={() => { handleLogout(); handleDrawerToggle(); }}>
                    {translate('Logout')}
                </MenuItem>
            ) : (
                <Box>
                    <MenuItem component={RouterLink} to="/login" onClick={handleDrawerToggle}>
                        {translate('Login')}
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/register" onClick={handleDrawerToggle}>
                        {translate('Register')}
                    </MenuItem>
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label={translate("open menu")}
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <Branding logoUrl={logoUrl} />
                        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {translate('Dashboard')}
                        </Typography>
                    </RouterLink>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {isAuthenticated ? (
                            <Button
                                color="inherit"
                                onClick={handleLogout}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                {translate('Logout')}
                            </Button>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/login"
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {translate('Login')}
                                </Button>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/register"
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {translate('Register')}
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 250,
                            boxSizing: 'border-box',
                            top: ['56px', '64px'],
                            height: 'auto',
                            bottom: 0,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - 250px)` },
                    mt: ['56px', '64px'],
                }}
            >
                {/* Main content will be rendered here by React Router */}
            </Box>
        </Box>
    );
};

export default Dashboard;