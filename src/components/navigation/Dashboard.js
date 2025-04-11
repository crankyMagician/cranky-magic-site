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
    ListItemIcon,
    Card,
    CardContent,
    Grid,
    Paper,
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
    Close as CloseIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

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

const Dashboard = () => {
    const { translate } = useCustomTranslation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    // Filter navigation items based on authentication status
    const filteredNavItems = navigationItems.filter(item =>
        !item.requiresAuth || (item.requiresAuth && isAuthenticated)
    );

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const NavigationList = ({ onClick }) => (
        <List>
            {filteredNavItems.map((item) => (
                <ListItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={onClick}
                    selected={location.pathname === item.path}
                    sx={{
                        borderRadius: 1,
                        my: 0.5,
                        mx: 1,
                        color: 'text.primary',
                        '&.Mui-selected': {
                            backgroundColor: 'action.selected',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        },
                    }}
                >
                    <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={translate(item.label)} />
                </ListItem>
            ))}
        </List>
    );

    // Authentication section
    const AuthSection = ({ onClick }) => (
        <Box sx={{ p: 2 }}>
            {isAuthenticated ? (
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<Logout />}
                    onClick={() => {
                        handleLogout();
                        if (onClick) onClick();
                    }}
                >
                    {translate("Logout")}
                </Button>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        startIcon={<Login />}
                        component={RouterLink}
                        to="/login"
                        onClick={onClick}
                    >
                        {translate("Login")}
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<AppRegistration />}
                        component={RouterLink}
                        to="/register"
                        onClick={onClick}
                    >
                        {translate("Register")}
                    </Button>
                </Box>
            )}
        </Box>
    );

    const drawer = (
        <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {isMobile && (
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <img src={logoUrl} alt="Logo" style={{ height: 40 }} />
                        <Typography variant="h6">
                            {translate('Dashboard')}
                        </Typography>
                    </Box>
                    <IconButton onClick={handleDrawerToggle}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            )}

            {!isMobile && (
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img src={logoUrl} alt="Logo" style={{ height: 40 }} />
                    <Typography variant="h6">
                        {translate('Dashboard')}
                    </Typography>
                </Box>
            )}

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

            <Box
                component="nav"
                sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better mobile performance
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: 250,
                            boxSizing: 'border-box',
                            top: ['56px', '64px'], // AppBar height
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
                    mt: ['56px', '64px'], // AppBar height
                }}
            >
                {/* Dashboard welcome section */}
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
            </Box>
        </Box>
    );
};

export default Dashboard;