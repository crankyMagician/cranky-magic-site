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
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Card,
    CardContent,
    Grid,
    Paper,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
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
    Dashboard as DashboardIcon,
    Close as CloseIcon,
    ChevronLeft,
    ChevronRight
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { useLogout } from '../../hooks/useLogout';
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

const Dashboard = ({ children }) => {
    const { translate } = useCustomTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const [open, setOpen] = useState(false); // Start collapsed
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();

    // Filter navigation items based on authentication status
    const filteredNavItems = navigationItems.filter(item =>
        !item.requiresAuth || (item.requiresAuth && isAuthenticated)
    );

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    // Drawer width calculations
    const drawerWidth = 240;
    const closedDrawerWidth = 65;
    const actualDrawerWidth = open ? drawerWidth : closedDrawerWidth;

    // Navigation list component
    const NavigationList = ({ onClick }) => (
        <List>
            {filteredNavItems.map((item) => (
                <ListItem
                    button
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={onClick}
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
                            color: location.pathname === item.path ? 'primary.main' : 'inherit'
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={translate(item.label)}
                        sx={{
                            opacity: open ? 1 : 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden'
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );

    // Authentication section
    const AuthSection = ({ onClick }) => (
        <Box sx={{ p: 2 }}>
            {isAuthenticated ? (
                <ListItem
                    button
                    onClick={() => {
                        handleLogout();
                        if (onClick) onClick();
                    }}
                    sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}
                    >
                        <Logout />
                    </ListItemIcon>
                    <ListItemText
                        primary={translate("Logout")}
                        sx={{
                            opacity: open ? 1 : 0,
                            whiteSpace: 'nowrap'
                        }}
                    />
                </ListItem>
            ) : (
                <>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/login"
                        onClick={onClick}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <Login />
                        </ListItemIcon>
                        <ListItemText
                            primary={translate("Login")}
                            sx={{
                                opacity: open ? 1 : 0,
                                whiteSpace: 'nowrap'
                            }}
                        />
                    </ListItem>
                    <ListItem
                        button
                        component={RouterLink}
                        to="/register"
                        onClick={onClick}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <AppRegistration />
                        </ListItemIcon>
                        <ListItemText
                            primary={translate("Register")}
                            sx={{
                                opacity: open ? 1 : 0,
                                whiteSpace: 'nowrap'
                            }}
                        />
                    </ListItem>
                </>
            )}
        </Box>
    );

    // Drawer content
    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: open ? 'space-between' : 'center',
                    width: '100%'
                }}>
                    {open && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                            <img src={logoUrl} alt="Logo" style={{ height: 30 }} />
                            <Typography variant="subtitle1" noWrap>
                                {translate('Company Name')}
                            </Typography>
                        </Box>
                    )}
                    <IconButton onClick={handleDrawerToggle}>
                        {open ? <ChevronLeft /> : <ChevronRight />}
                    </IconButton>
                </Box>
            </Toolbar>
            <Divider />

            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <NavigationList onClick={isMobile ? handleDrawerToggle : undefined} />
            </Box>

            <Divider />
            <AuthSection onClick={isMobile ? handleDrawerToggle : undefined} />
        </Box>
    );

    // Dashboard card component
    const DashboardCard = ({ title, icon, description, to }) => (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
                component={RouterLink}
                to={to}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    textDecoration: 'none',
                    color: 'text.primary',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                    }
                }}
            >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                    }}>
                        {icon}
                    </Box>
                    <Typography variant="h6" component="h2" align="center" gutterBottom>
                        {translate(title)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {translate(description)}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${actualDrawerWidth}px)` },
                    ml: { sm: `${actualDrawerWidth}px` },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label={translate("open menu")}
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <Branding logoUrl={logoUrl} />
                        <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {translate('Company Name')}
                        </Typography>
                    </RouterLink>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {isAuthenticated ? (
                            <Button
                                color="inherit"
                                startIcon={<Logout />}
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
                                    startIcon={<Login />}
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {translate('Login')}
                                </Button>
                                <Button
                                    color="inherit"
                                    variant="outlined"
                                    component={RouterLink}
                                    to="/register"
                                    startIcon={<AppRegistration />}
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    {translate('Register')}
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer - Mobile (temporary) */}
            <Drawer
                variant="temporary"
                open={isMobile && open}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Navigation Drawer - Desktop (permanent) */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    width: actualDrawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: actualDrawerWidth,
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    },
                }}
                open={open}
            >
                {drawerContent}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${actualDrawerWidth}px)` },
                    ml: { sm: `${actualDrawerWidth}px` },
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    mt: { xs: '56px', sm: '64px' }, // AppBar height
                }}
            >
                {/* Conditionally render welcome section if we're not showing any specific content */}
                {location.pathname === '/' ? (
                    <>
                        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <DashboardIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                                <Typography variant="h4" component="h1">
                                    {translate('Welcome to Dashboard')}
                                </Typography>
                            </Box>
                            <Typography variant="body1">
                                {translate('This is your application dashboard. Navigate through the available options using the sidebar or the cards below.')}
                            </Typography>
                        </Paper>

                        {/* Dashboard cards */}
                        <Grid container spacing={3}>
                            {filteredNavItems.map(item => (
                                <DashboardCard
                                    key={item.path}
                                    title={item.label}
                                    icon={React.cloneElement(item.icon, { sx: { fontSize: 30 } })}
                                    description={`Access ${item.label} section`}
                                    to={item.path}
                                />
                            ))}
                        </Grid>
                    </>
                ) : (
                    // Render children components from the router
                    children
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;