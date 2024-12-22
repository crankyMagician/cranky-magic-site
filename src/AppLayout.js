import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Navbar from './components/demoComponents/NavBar';
import Footer from './components/demoComponents/Footer';
import { Box } from "@mui/material";
import Dashboard from './components/demoComponents/Dashboard';
import Hoverbar from "./components/demoComponents/Hoverbar";
import Sidebar from "./components/demoComponents/Sidebar";

const AppLayout = ({ children }) => {
    // Accessing preferences from the Redux store
    const { preferences } = useSelector(state => state.preferences);

    // Determine which Navbar to render based on the preference
    const renderNavbar = () => {
        switch (preferences.navbar) {
            case 'vertical-sidebar':
                return <Sidebar />;
            case 'hoverbar':
                return <Hoverbar />;
            case 'dashboard':
                return <Dashboard />;
            case 'navbar':
                return <Navbar />;
            default:
                return <Navbar />;
        }
    };

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
            <Box flexGrow={1} margin="0" padding="0">
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
