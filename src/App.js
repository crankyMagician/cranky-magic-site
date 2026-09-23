import React, { useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './translations/translationManager';
import { getTheme } from './themes/theme';
import { buildPaletteFromBrand } from './themes/customPalette';
import AppLayout from './AppLayout';
import MainContent from './MainContent';
import useAppInitialization from './hooks/useAppInitialization';
import useCustomTranslation from "./hooks/useCustomTranslation";
import DebugPanel from './debug-panel/DebugPanel';
import AnalyticsProvider from './AnalyticsProvider';
import { RouteProvider } from './routes';

// Memoize the analytics-aware MainContent component to prevent unnecessary re-renders
const AnalyticsMainContent = React.memo(() => {
    useEffect(() => {
        console.log("AnalyticsMainContent mounted");
        return () => console.log("AnalyticsMainContent unmounted");
    }, []);

    if (process.env.NODE_ENV === 'development') {
        console.log("AnalyticsMainContent rendering");
    }

    return <MainContent />;
});

// Main App component
const App = () => {
    useEffect(() => {
        console.log("App component mounted");
        return () => console.log("App component unmounted");
    }, []);

    if (process.env.NODE_ENV === 'development') {
        console.log("App component rendering");
    }

    const { currentLanguageDirection } = useCustomTranslation();

    // Authentication, theme, and preferences hooks
    useAppInitialization();

    // Fetch the current theme mode, component override, and typography from Redux state
    const themeMode = useSelector(state => state.theme.mode);
    const componentOverride = useSelector(state => state.theme.componentOverride);
    const typography = useSelector(state => state.theme.typography);
    const customBrand = useSelector(state => state.theme.customBrand);
    const brandMode = useSelector(state => state.theme.brandMode);

    // Key on the serialized colours: the brand is an object, so using it directly as a
    // dependency would rebuild the whole theme on every render.
    const brandKey = useMemo(
        () => (themeMode === 'custom' ? JSON.stringify(customBrand?.colors?.[brandMode] ?? null) : ''),
        [themeMode, customBrand, brandMode]
    );

    const customPalette = useMemo(
        () => (themeMode === 'custom' && customBrand ? buildPaletteFromBrand(customBrand, brandMode) : null),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [themeMode, brandKey, brandMode]
    );

    // Create theme with theme mode, component override, and typography - don't recreate it on every render
    const theme = useMemo(() =>
            getTheme(themeMode, componentOverride, typography, currentLanguageDirection, customPalette),
        [themeMode, componentOverride, typography, currentLanguageDirection, customPalette]
    );

    // Only show debug panel in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <AnalyticsProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
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
};

export default React.memo(App);