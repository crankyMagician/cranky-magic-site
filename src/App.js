// src/App.js - Updated with override style support
import React, { useEffect } from 'react';
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
import usePageTracking from './analytics/hooks/usePageTracking';
import useSessionTracking from './analytics/hooks/useSessionTracking';
import { setOverrideStyle } from './reducers/themeSlice';

// Create an analytics-aware MainContent component
const AnalyticsMainContent = () => {
    // Use analytics hooks
    usePageTracking();
    useSessionTracking();

    return <MainContent />;
};

function App() {
    const dispatch = useDispatch();
    const { changeLanguage, currentLanguageDirection } = useCustomTranslation();

    // Authentication, theme, and preferences hooks
    useAppInitialization();

    // Fetch the current theme mode and override style from Redux state
    const themeMode = useSelector(state => state.theme.mode);
    const overrideStyle = useSelector(state => state.theme.overrideStyle);

    // Load saved override style from localStorage on mount
    useEffect(() => {
        const savedOverrideStyle = localStorage.getItem('themeOverrideStyle');
        if (savedOverrideStyle && ['cranky', 'spatial'].includes(savedOverrideStyle)) {
            dispatch(setOverrideStyle(savedOverrideStyle));
        }
    }, [dispatch]);

    // Get the theme object based on the current theme mode, language direction, and override style
    const theme = getTheme(themeMode, currentLanguageDirection, overrideStyle);

    // Only show debug panel in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <AnalyticsProvider>
            <ThemeProvider theme={theme}>
                <Router>
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
                </Router>
            </ThemeProvider>
        </AnalyticsProvider>
    );
}

export default App;