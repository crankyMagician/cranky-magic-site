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

    // Define the breakpoint for switching to sidebar on small screens
    const isSidebarBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

    // Common main content area with page header
    const MainContent = () => (
        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
            <Container maxWidth="xl">
                {showPageHeader && <PageHeader />}
                {children}
            </Container>
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
                    <MainContent />
                    <Footer />
                </Box>
            );

        case 'megamenu':
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <MegaMenu />
                    <MainContent />
                    <Footer />
                </Box>
            );

        case 'navbar':
        default:
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <MainContent />
                    <Footer />
                </Box>
            );
    }
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;