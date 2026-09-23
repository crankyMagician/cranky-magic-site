import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./components/navigation/Sidebar";
import Hoverbar from "./components/navigation/Hoverbar";
import Footer from "./components/navigation/Footer";
import MegaMenu from "./components/navigation/MegaMenu";
import Navbar from "./components/navigation/NavBar";
import Dashboard from "./components/navigation/Dashboard";
import PageHeader from './components/layout/PageHeader';
import { useRouteContext } from './routes';

const AppLayout = ({ children }) => {
    // Accessing preferences from the Redux store
    const { preferences } = useSelector(state => state.preferences);
    const theme = useTheme();

    // Get route context for determining page headers
    const { currentRoute } = useRouteContext();

    // Check if current route should display a header
    // By default, show header for all routes except home route
    const showPageHeader = currentRoute?.path !== '/';

    // Check if we're on the portfolio/home page (full-width layout)
    const isFullWidthPage = currentRoute?.path === '/';

    // Define the breakpoint for switching to sidebar on small screens
    const isSidebarBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

    // A plain element, not a component declared in render. Declaring a component here
    // gives it a new identity every render, which makes React unmount and remount the
    // whole subtree and destroy any state the page below is holding.
    const mainContent = (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                p: isFullWidthPage ? 0 : 2,
                backgroundColor: theme.palette.background.default,
            }}
        >
            {isFullWidthPage ? (
                // Full-width layout for portfolio page
                <>
                    {showPageHeader && <PageHeader />}
                    {children}
                </>
            ) : (
                // Constrained layout for other pages
                <Container maxWidth="xl">
                    {showPageHeader && <PageHeader />}
                    {children}
                </Container>
            )}
        </Box>
    );

    // If we're at a small screen size, always use Sidebar for consistency
    if (isSidebarBreakpoint) {
        return <Sidebar>{children}</Sidebar>;
    }

    // Otherwise, determine which layout to render based on the preference
    switch (preferences?.navbar) {
        case 'vertical-sidebar':
            return <Sidebar>{children}</Sidebar>;

        case 'dashboard':
            return <Dashboard>{children}</Dashboard>;

        case 'hoverbar':
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Hoverbar />
                    {mainContent}
                    <Footer />
                </Box>
            );

        case 'megamenu':
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <MegaMenu />
                    {mainContent}
                    <Footer />
                </Box>
            );

        case 'navbar':
        default:
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', margin: 0, padding: 0 }}>
                    <Navbar />
                    {mainContent}
                    <Footer />
                </Box>
            );
    }
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;