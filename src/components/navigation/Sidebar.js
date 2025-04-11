import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    Divider,
    CssBaseline,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    GridView,
    Photo,
    Style as StyleIcon,
    ViewList,
    Science,
    Construction,
    Inventory,
    Star,
    Home
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import Branding from '../demoComponents/Branding';
import logoImage from '../../assets/logo/default_logo.png';
import useCustomTranslation from "../../hooks/useCustomTranslation";

const navigationItems = [
    { path: '/', label: 'Home', icon: <Home /> },
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

const Sidebar = ({ children }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const [open, setOpen] = useState(false); // Start collapsed
    const { translate } = useCustomTranslation();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const drawerWidth = 240;

    const handleDrawerToggle = () => {
        setOpen(!open);
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
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        '&.Mui-selected': {
                            backgroundColor: 'action.selected',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={translate(item.label)}
                        sx={{ opacity: open ? 1 : 0 }}
                    />
                </ListItem>
            ))}
        </List>
    );

    const authLinks = isAuthenticated ? (
        <ListItem
            button
            onClick={handleLogout}
            component={RouterLink}
            to="/"
            sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
            }}
        >
            <ListItemText
                primary={translate("Logout")}
                sx={{ opacity: open ? 1 : 0 }}
            />
        </ListItem>
    ) : (
        <>
            <ListItem
                button
                component={RouterLink}
                to="/login"
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemText
                    primary={translate("Login")}
                    sx={{ opacity: open ? 1 : 0 }}
                />
            </ListItem>
            <ListItem
                button
                component={RouterLink}
                to="/register"
                sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemText
                    primary={translate("Register")}
                    sx={{ opacity: open ? 1 : 0 }}
                />
            </ListItem>
        </>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: { md: `calc(100% - ${open ? drawerWidth : 73}px)` },
                    ml: { md: `${open ? drawerWidth : 73}px` },
                    transition: theme => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label={translate("toggle drawer")}
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                        }}
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
                            {translate("Company Name")}
                        </Typography>
                    </RouterLink>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={handleDrawerToggle}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <NavigationList />
                        <Divider />
                        {authLinks}
                    </Box>
                </Drawer>
            )}

            {/* Desktop drawer - collapsible */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: open ? drawerWidth : 73,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: open ? drawerWidth : 73,
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                        transition: theme => theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={handleDrawerToggle}>
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Toolbar>
                <Divider />
                <NavigationList />
                <Divider />
                {authLinks}
            </Drawer>

            {/* Main content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${open ? drawerWidth : 73}px)` },
                    ml: { md: `${open ? drawerWidth : 73}px` },
                    transition: theme => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    mt: '64px', // Offset for AppBar
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar;