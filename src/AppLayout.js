import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Box } from "@mui/material";
import Sidebar from "./components/navigation/Sidebar";
import Hoverbar from "./components/navigation/Hoverbar";
import {Dashboard} from "@mui/icons-material";
import MegaMenu from "./components/navigation/MegaMenu";
import Navbar from "./components/navigation/NavBar";
import Footer from "./components/demoComponents/Footer";


const AppLayout = ({ children }) => {
    // Accessing preferences from the Redux store
    const { preferences } = useSelector(state => state.preferences);

    // Determine which Navbar to render based on the preference
    const renderNavbar = () => {
        switch (preferences?.navbar) {
            case 'vertical-sidebar':
                return <Sidebar />;
            case 'hoverbar':
                return <Hoverbar />;
            case 'dashboard':
                return <Dashboard />;
            case 'megamenu':
                return <MegaMenu />;
            case 'navbar':
                return <Navbar />;
            default:
                return <Navbar />;
        }
    };

    // Check if the current navigation is a layout manager
    const isLayoutManager = preferences?.navbar === 'vertical-sidebar' || preferences?.navbar === 'dashboard';

    // If using a layout manager, the component manages its own content layout
    if (isLayoutManager) {
        return (
            <>
                {renderNavbar()}
                {/* For sidebar and dashboard, content positioning is managed internally */}
            </>
        );
    }

    // Standard layout for other navigation types
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            minHeight="100vh"
            margin="0" // Ensure no margin
            padding="0" // Ensure no padding
        >
            {renderNavbar()}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    margin: 0,
                    padding: 0,
                    marginTop: '64px', // Ensures content starts below the fixed AppBar
                }}
            >
                {children}
            </Box>

            <Footer />
        </Box>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;