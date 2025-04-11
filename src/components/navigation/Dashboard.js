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
    useMediaQuery,
    Container
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
    Home,
    CalendarMonth,
    Info,
    ContactMail,
    Email,
    Login,
    AppRegistration,
    VideoLibrary,
    AccountCircle,
    Logout,
    Dashboard as DashboardIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import Branding from '../demoComponents/Branding';
import logoImage from '../../assets/logo/default_logo.png';
import Sidebar from './Sidebar';

// Define the breakpoint for switching to sidebar
const SIDEBAR_BREAKPOINT = 'md';

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
    const isSidebarMode = useMediaQuery(theme.breakpoints.down(SIDEBAR_BREAKPOINT));
    const location = useLocation();
    const navigate = useNavigate();

    // If we're in sidebar mode, render the Sidebar component instead
    if (isSidebarMode) {
        return <Sidebar>{children}</Sidebar>;
    }

    // Drawer width calculations
    const drawerWidth = 240;
    const closedDrawerWidth = 65;
    const actualDrawerWidth = open ? drawerWidth : closedDrawerWidth;

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    // Filter navigation items based on authentication status
    const filteredNavItems = navigationItems.filter(item =>
        !item.requiresAuth || (item.requiresAuth && isAuthenticated)
    );

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
                            backgroundColor: theme.palette.action.selected,
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            color: location.pathname === item.path ?
                                theme.palette.primary.main :
                                theme.palette.text.secondary,
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={translate(item.label)}
                        primaryTypographyProps={{
                            variant: 'body2',
                            sx: {
                                opacity: open ? 1 : 0,
                                fontFamily: theme.typography.body2.fontFamily,
                                fontWeight: location.pathname === item.path ? 600 : 400,
                                color: theme.palette.text.primary,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                            }
                        }}
                    />
                </ListItem>
            ))}
        </List>
    );

    const authLinks = isAuthenticated ? (
        <ListItem
            button
            onClick={handleLogout}
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
                    color: theme.palette.text.secondary,
                }}
            >
                <Logout />
            </ListItemIcon>
            <ListItemText
                primary={translate("Logout")}
                primaryTypographyProps={{
                    variant: 'body2',
                    sx: {
                        opacity: open ? 1 : 0,
                        fontFamily: theme.typography.body2.fontFamily,
                        color: theme.palette.text.primary,
                        whiteSpace: 'nowrap',
                    }
                }}
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
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: theme.palette.text.secondary,
                    }}
                >
                    <Login />
                </ListItemIcon>
                <ListItemText
                    primary={translate("Login")}
                    primaryTypographyProps={{
                        variant: 'body2',
                        sx: {
                            opacity: open ? 1 : 0,
                            fontFamily: theme.typography.body2.fontFamily,
                            color: theme.palette.text.primary,
                            whiteSpace: 'nowrap',
                        }
                    }}
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
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: theme.palette.text.secondary,
                    }}
                >
                    <AppRegistration />
                </ListItemIcon>
                <ListItemText
                    primary={translate("Register")}
                    primaryTypographyProps={{
                        variant: 'body2',
                        sx: {
                            opacity: open ? 1 : 0,
                            fontFamily: theme.typography.body2.fontFamily,
                            color: theme.palette.text.primary,
                            whiteSpace: 'nowrap',
                        }
                    }}
                />
            </ListItem>
        </>
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
                    backgroundColor: theme.palette.background.paper,
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
                    <Typography
                        variant="h6"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{
                            fontFamily: theme.typography.h6.fontFamily,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {translate(title)}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{
                            fontFamily: theme.typography.body2.fontFamily,
                        }}
                    >
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
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: { md: `calc(100% - ${actualDrawerWidth}px)` },
                    ml: { md: `${actualDrawerWidth}px` },
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
                            color: theme.palette.text.primary,
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
                                display: { xs: 'none', sm: 'block' },
                                fontFamily: theme.typography.h6.fontFamily,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {translate("Company Name")}
                        </Typography>
                    </RouterLink>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                        {isAuthenticated ? (
                            <Button
                                color="inherit"
                                startIcon={<Logout />}
                                onClick={handleLogout}
                                sx={{
                                    whiteSpace: 'nowrap',
                                    fontFamily: theme.typography.button.fontFamily,
                                    color: theme.palette.text.primary,
                                }}
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
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        fontFamily: theme.typography.button.fontFamily,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {translate('Login')}
                                </Button>
                                <Button
                                    color="inherit"
                                    variant="outlined"
                                    component={RouterLink}
                                    to="/register"
                                    startIcon={<AppRegistration />}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        fontFamily: theme.typography.button.fontFamily,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {translate('Register')}
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={isMobile && open}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        backgroundColor: theme.palette.background.paper,
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <NavigationList onClick={handleDrawerToggle} />
                    <Divider />
                    {authLinks}
                </Box>
            </Drawer>

            {/* Desktop drawer - collapsible */}
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: actualDrawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: actualDrawerWidth,
                        boxSizing: 'border-box',
                        overflowX: 'hidden',
                        transition: theme => theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        backgroundColor: theme.palette.background.paper,
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
                    <IconButton
                        onClick={handleDrawerToggle}
                        sx={{ color: theme.palette.text.secondary }}
                    >
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
                    width: { md: `calc(100% - ${actualDrawerWidth}px)` },
                    ml: { md: `${actualDrawerWidth}px` },
                    transition: theme => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    mt: { xs: '56px', sm: '64px' }, // AppBar height
                }}
            >
                {/* Conditionally render welcome section if we're not showing any specific content */}
                {location.pathname === '/' ? (
                    <Container maxWidth="xl">
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: 2,
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <DashboardIcon
                                    color="primary"
                                    sx={{ fontSize: 40, mr: 2 }}
                                />
                                <Typography
                                    variant="h4"
                                    component="h1"
                                    sx={{
                                        fontFamily: theme.typography.h4.fontFamily,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {translate('Welcome to Dashboard')}
                                </Typography>
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: theme.typography.body1.fontFamily,
                                    color: theme.palette.text.primary,
                                }}
                            >
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
                    </Container>
                ) : (
                    // Render children components from the router
                    children
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;