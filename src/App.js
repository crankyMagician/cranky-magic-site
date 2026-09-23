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
import { ensureFont } from './themes/brandFonts';
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
    const animation = useSelector(state => state.theme.animation);
    const animationSpeed = useSelector(state => state.theme.animationSpeed);
    const reducedMotion = useSelector(state => state.theme.reducedMotion);
    const componentSettings = useSelector(state => state.theme.componentSettings);

    // Key on the serialized colours: the brand is an object, so using it directly as a
    // dependency would rebuild the whole theme on every render.
    // Both halves matter: the ringle colours and the hand-picked overrides for the theme
    // keys ringle has no slot for. Leaving the overrides out means editing a grey or a
    // gradient changes state and repaints nothing.
    const brandKey = useMemo(
        () => (themeMode === 'custom'
            ? JSON.stringify([customBrand?.colors?.[brandMode] ?? null, customBrand?.palette?.[brandMode] ?? null])
            : ''),
        [themeMode, customBrand, brandMode]
    );

    const fonts = customBrand?.fonts || null;
    const fontKey = useMemo(() => JSON.stringify(fonts ?? null), [fonts]);
    const settingsKey = useMemo(() => JSON.stringify(componentSettings ?? null), [componentSettings]);

    // Fetch a family the app does not bundle. Kept out of render because it touches the
    // document head.
    useEffect(() => {
        ensureFont(fonts?.heading);
        ensureFont(fonts?.body);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fontKey]);

    const customPalette = useMemo(
        () => (themeMode === 'custom' && customBrand ? buildPaletteFromBrand(customBrand, brandMode) : null),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [themeMode, brandKey, brandMode]
    );

    // Create theme with theme mode, component override, and typography - don't recreate it on every render
    const theme = useMemo(() =>
            getTheme(themeMode, componentOverride, typography, currentLanguageDirection, customPalette, {
                fonts,
                animation,
                animationSpeed,
                reducedMotion,
                componentSettings,
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [themeMode, componentOverride, typography, currentLanguageDirection, customPalette,
         fontKey, animation, animationSpeed, reducedMotion, settingsKey]
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