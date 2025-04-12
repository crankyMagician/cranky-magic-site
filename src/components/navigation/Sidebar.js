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
    useMediaQuery,
    Button,
    Container
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Logout,
    Login,
    AppRegistration
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';
import Branding from '../demoComponents/Branding';
import logoImage from '../../assets/logo/default_logo.png';
import useCustomTranslation from "../../hooks/useCustomTranslation";
import useAnalytics from '../../analytics/hooks/useAnalytics';
import { routes, adaptRoutesForSidebar, useRouteContext } from '../../routes';

const Sidebar = ({ children }) => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const handleLogout = useLogout();
    const logoUrl = logoImage;
    const [open, setOpen] = useState(false); // Start collapsed
    const { translate } = useCustomTranslation();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { userRoles } = useRouteContext();

    const drawerWidth = 240;

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    // Get sidebar navigation items using the new adapter
    const sidebarGroups = adaptRoutesForSidebar(routes, isAuthenticated, userRoles);

    const NavigationList = ({ onClick }) => (
        <>
            {sidebarGroups.map((group) => (
                <div key={group.label}>
                    {open && (
                        <Typography
                            variant="subtitle2"
                            color="textSecondary"
                            sx={{
                                px: 3,
                                mt: 2,
                                mb: 1,
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                opacity: open ? 1 : 0,
                            }}
                        >
                            {translate(group.label)}
                        </Typography>
                    )}
                    <List>
                        {group.items.map((item) => (
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
                </div>
            ))}
        </>
    );

    // Authentication links
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

                    {/* Authentication for mobile */}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        {isAuthenticated ? (
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<Logout />}
                                onClick={handleLogout}
                                size="small"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontFamily: theme.typography.button.fontFamily,
                                }}
                            >
                                {translate('Logout')}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                component={RouterLink}
                                to="/login"
                                startIcon={<Login />}
                                size="small"
                                sx={{
                                    fontFamily: theme.typography.button.fontFamily,
                                }}
                            >
                                {translate('Login')}
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={open}
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
                    width: { md: `calc(100% - ${open ? drawerWidth : 73}px)` },
                    ml: { md: `${open ? drawerWidth : 73}px` },
                    transition: theme => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    mt: '64px', // Offset for AppBar
                }}
            >
                <Container maxWidth="xl">
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default Sidebar;