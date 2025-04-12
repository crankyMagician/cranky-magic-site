// src/App.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './translations/translationManager';
import { getTheme } from './themes/theme';
import AppLayout from './AppLayout';
import MainContent from './MainContent';
import useAppInitialization from './hooks/useAppInitialization';
import useCustomTranslation from "./hooks/useCustomTranslation";
import DebugPanel from './components/common/DebugPanel';
import AnalyticsProvider from './AnalyticsProvider';
import useSessionTracking from './analytics/hooks/useSessionTracking';
import { RouteProvider } from './routes'; // Import the RouteProvider

// Create an analytics-aware MainContent component
const AnalyticsMainContent = () => {
    // Use session tracking
    useSessionTracking();

    return <MainContent />;
};

function App() {
    const dispatch = useDispatch();
    const { changeLanguage, currentLanguageDirection } = useCustomTranslation();

    // Authentication, theme, and preferences hooks
    useAppInitialization();

    // Fetch the current theme mode and language direction from Redux state
    const themeMode = useSelector(state => state.theme.mode);

    // Get the theme object based on the current theme mode and language direction
    const theme = getTheme(themeMode, currentLanguageDirection);

    // Only show debug panel in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <AnalyticsProvider>
            <ThemeProvider theme={theme}>
                <Router>
                    {/* Wrap the app with RouteProvider for routing context */}
                    <RouteProvider>
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={currentLanguageDirection === 'rtl'}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                        <AppLayout>
                            <AnalyticsMainContent />
                        </AppLayout>
                        {isDevelopment && <DebugPanel />}
                    </RouteProvider>
                </Router>
            </ThemeProvider>
        </AnalyticsProvider>
    );
}

export default App;