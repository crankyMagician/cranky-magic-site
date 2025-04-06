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

function App() {
    const dispatch = useDispatch();
    const { changeLanguage, currentLanguageDirection } = useCustomTranslation(); // Assuming useCustomTranslation hook can provide current language direction

    // Authentication, theme, and preferences hooks
    useAppInitialization();
    // Fetch the current theme mode and language direction from Redux state
    const themeMode = useSelector(state => state.theme.mode);

    // Get the theme object based on the current theme mode and language direction
    const theme = getTheme(themeMode, currentLanguageDirection);

    // Only show debug panel in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                                closeOnClick rtl={currentLanguageDirection === 'rtl'} pauseOnFocusLoss draggable pauseOnHover />
                <AppLayout>
                    <MainContent />
                </AppLayout>
                {isDevelopment && <DebugPanel />}
            </Router>
        </ThemeProvider>
    );
}

export default App;