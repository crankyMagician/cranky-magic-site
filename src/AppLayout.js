import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box } from "@mui/material";
import Sidebar from "./components/navigation/Sidebar";
import {Dashboard} from "@mui/icons-material";
import Hoverbar from "./components/navigation/Hoverbar";
import Footer from "./components/navigation/Footer";
import MegaMenu from "./components/navigation/MegaMenu";
import Navbar from "./components/navigation/NavBar";


const AppLayout = ({ children }) => {
    // Accessing preferences from the Redux store
    const { preferences } = useSelector(state => state.preferences);

    // Determine which layout to render based on the preference
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