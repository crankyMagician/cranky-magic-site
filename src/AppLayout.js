import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./components/navigation/Sidebar";
import Hoverbar from "./components/navigation/Hoverbar";
import Footer from "./components/navigation/Footer";
import MegaMenu from "./components/navigation/MegaMenu";
import Navbar from "./components/navigation/NavBar";
import Dashboard from "./components/navigation/Dashboard";

const AppLayout = ({ children }) => {
    // Accessing preferences from the Redux store
    const { preferences } = useSelector(state => state.preferences);
    const theme = useTheme();

    // Define the breakpoint for switching to sidebar on small screens
    const isSidebarBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

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
                    <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                        {children}
                    </Box>
                    <Footer />
                </Box>
            );

        case 'megamenu':
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <MegaMenu />
                    <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                        {children}
                    </Box>
                    <Footer />
                </Box>
            );

        case 'navbar':
        default:
            return (
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
                        {children}
                    </Box>
                    <Footer />
                </Box>
            );
    }
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;