// debug-panel/DebugPanel.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Paper, Box, Button, IconButton, Typography, Collapse } from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Header from './components/Header';
import TokenPanel from './components/TokenPanel';
import TestPanel from './components/TestPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import SettingsPanel from './components/SettingsPanel';
import useMatrixEffect from './hooks/useMatrixEffect';
import useDraggable from './hooks/useDraggable';
import useAnalytics from "../analytics/hooks/useAnalytics";
import {
  useLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} from "../api/apiSlice";
import { setCredentials } from "../reducers/authReducer";
import validatePassword from "../utilities/PasswordValidator";
import AuthTokenService from "../services/AuthTokenService";
import TokenDecoder from "../utilities/TokenDecoder";
import { getEventTypeColor } from './utils/eventTypes';
import ThemeToggle from "../components/demoComponents/ThemeToggle";
import LanguageSelector from "../components/demoComponents/LanguageSwitcher";

const DebugPanel = ({ initialPosition = { right: 20, bottom: 20 } }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const analytics = useAnalytics();
  const matrixTick = useMatrixEffect();
  const themeMode = useSelector(state => state.theme.mode);

  const [login] = useLoginMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [changePassword] = useChangePasswordMutation();

  // Panel state
  const [position, setPosition] = useState(initialPosition);
  const [expanded, setExpanded] = useState(true);
  const [opacity, setOpacity] = useState(0.9);
  const [tab, setTab] = useState('token'); // token, test, analytics, settings
  const [analyticsSubTab, setAnalyticsSubTab] = useState('events');
  const [isCapturing, setIsCapturing] = useState(true);
  const [eventCount, setEventCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Token debug state
  const [tokenInfo, setTokenInfo] = useState({
    hasToken: false,
    tokenExpiry: null,
    tokenData: null,
    lastCheck: null
  });

  // Test state
  const [testType, setTestType] = useState('login'); // 'login', 'forgotPassword', 'changePassword', 'analytics'
  const [authMethod, setAuthMethod] = useState('email');
  const [testCredentials, setTestCredentials] = useState({
    email: 'brian.s.redpath@gmail.com',
    phoneNumber: '+15555555555',
    password: 'P@$$w0rd#1!',
    newPassword: 'Astroboy#1!',
    confirmationCode: ''
  });
  const [testStatus, setTestStatus] = useState({ success: false, message: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);

  // Analytics state
  const [analyticsEvents, setAnalyticsEvents] = useState([]);
  const [analyticsConfig, setAnalyticsConfig] = useState({
    consentEnabled: true,
    trackPageViews: true,
    trackClicks: true,
    trackForms: true,
    trackAPI: true,
    trackErrors: true,
    performanceMonitoring: true,
    sampleRate: 1.0
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const eventLogRef = useRef([]);
  const sessionId = useRef(`debug_${Date.now()}_${Math.random().toString(36).substring(2,9)}`).current;

  // Paper ref for the main container
  const panelRef = useRef(null);
  // Header ref for dragging
  const headerRef = useRef(null);

  // Initialize panel with fixed positioning
  useEffect(() => {
    if (panelRef.current) {
      const panel = panelRef.current;
      panel.style.position = 'fixed';
      panel.style.left = `${position.left || (window.innerWidth - 370)}px`;
      panel.style.top = `${position.top || 20}px`;
      panel.style.right = position.right ? `${position.right}px` : 'auto';
      panel.style.bottom = position.bottom ? `${position.bottom}px` : 'auto';
    }
  }, []);

  // Use the draggable hook with the headerRef
  useDraggable(headerRef, (newPos) => {
    setPosition(newPos);
    // Also update the panel style directly for smoother movement
    if (panelRef.current) {
      panelRef.current.style.left = `${newPos.left}px`;
      panelRef.current.style.top = `${newPos.top}px`;
      panelRef.current.style.right = 'auto';
      panelRef.current.style.bottom = 'auto';
    }
  }, setIsDragging);

  // Check token info on mount and every 5 seconds
  useEffect(() => {
    const checkToken = () => {
      const token = AuthTokenService.getAuthInfo().authToken;
      const debugInfo = {
        hasToken: !!token,
        tokenExpiry: null,
        tokenData: null,
        lastCheck: new Date().toISOString()
      };
      if (token) {
        try {
          const decodedToken = TokenDecoder.decode(token);
          if (decodedToken && !TokenDecoder.isExpired(token)) {
            debugInfo.tokenExpiry = new Date(decodedToken.exp * 1000).toISOString();
            debugInfo.tokenData = {
              id: decodedToken.id,
              email: decodedToken.email,
              roles: decodedToken.roles || [],
              businesses: decodedToken.businesses || [],
              activeBusiness: decodedToken.activeBusiness
            };
          }
        } catch (error) {
          console.error('Error decoding token in debug panel:', error);
        }
      }
      setTokenInfo(debugInfo);
    };
    checkToken();
    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, []);

  // Track analytics events
  useEffect(() => {
    const handleAnalyticsEvent = (event) => {
      if (!isCapturing) return;
      const eventData = {
        id: Math.random().toString(36).substring(2,9),
        timestamp: new Date().toISOString(),
        name: event.detail?.name || 'unknown_event',
        properties: event.detail?.properties || {},
        type: getEventType(event.detail?.name)
      };
      eventLogRef.current = [eventData, ...eventLogRef.current].slice(0, 100);
      setEventCount(prev => prev + 1);
      if (eventCount % 5 === 0) {
        setAnalyticsEvents([...eventLogRef.current]);
      }
    };

    const originalTrackEvent = analytics.trackEvent;
    analytics.trackEvent = (name, properties) => {
      originalTrackEvent(name, properties);
      window.dispatchEvent(new CustomEvent('analytics_event', { detail: { name, properties } }));
    };

    window.addEventListener('analytics_event', handleAnalyticsEvent);
    return () => {
      window.removeEventListener('analytics_event', handleAnalyticsEvent);
      analytics.trackEvent = originalTrackEvent;
    };
  }, [analytics, isCapturing, eventCount]);

  const getEventType = (eventName) => {
    if (!eventName) return 'unknown';
    if (eventName.includes('page_') || eventName === 'page_view') return 'page';
    if (eventName.includes('click') || eventName.includes('button')) return 'interaction';
    if (eventName.includes('form_')) return 'form';
    if (eventName.includes('api_')) return 'api';
    if (eventName.includes('error') || eventName.includes('exception')) return 'error';
    if (eventName.includes('performance') || eventName.includes('_vital')) return 'performance';
    if (eventName.includes('scroll')) return 'scroll';
    if (eventName.includes('session')) return 'session';
    return 'other';
  };

  // Test login function
  const handleTestLogin = async () => {
    try {
      setTestStatus({ success: false, message: 'Logging in...' });
      analytics.trackEvent('auth_login_start', { method: 'email', from: 'debug_panel' });
      const result = await login(testCredentials).unwrap();
      console.log('Login result:', result);
      AuthTokenService.setAuthInfo({
        isAuthenticated: true,
        user: result.user,
        authToken: result.token,
        roles: result.roles || [],
        businesses: result.businesses || [],
        activeBusiness: result.activeBusiness || null
      });
      dispatch(setCredentials({
        user: result.user,
        token: result.token,
        roles: result.roles || [],
        businesses: result.businesses || [],
        activeBusiness: result.activeBusiness || null
      }));
      analytics.trackEvent('auth_login_success', { user_id: result.user?.id, method: 'email', from: 'debug_panel' });
      setTestStatus({ success: true, message: `Login successful! Token received for ${result.user?.email || 'user'}.` });
    } catch (error) {
      console.error('Login error:', error);
      analytics.trackEvent('auth_login_failure', { error_message: error.data?.message || error.message || 'Unknown error', method: 'email', from: 'debug_panel' });
      setTestStatus({ success: false, message: `Login failed: ${error.data?.message || error.message || 'Unknown error'}` });
    }
  };

  // Request password reset code
  const handleRequestResetCode = async () => {
    try {
      setTestStatus({ success: false, message: 'Requesting reset code...' });
      analytics.trackEvent('auth_password_reset_request', { method: authMethod, from: 'debug_panel' });
      const payload = authMethod === 'email'
          ? { email: testCredentials.email }
          : { phoneNumber: testCredentials.phoneNumber };
      await forgotPassword(payload).unwrap();
      setResetCodeSent(true);
      setTestStatus({ success: true, message: `Reset code sent to ${authMethod === 'email' ? testCredentials.email : testCredentials.phoneNumber}. Please check your ${authMethod === 'email' ? 'email' : 'phone'}.` });
    } catch (error) {
      console.error('Reset code request error:', error);
      analytics.trackEvent('error_validation', { context: 'password_reset_request', error_message: error.data?.message || error.message || 'Unknown error', method: authMethod, from: 'debug_panel' });
      setTestStatus({ success: false, message: `Failed to send reset code: ${error.data?.message || error.message || 'Unknown error'}` });
    }
  };

  // Reset password using a code
  const handleResetPasswordWithCode = async () => {
    try {
      const passwordValidation = validatePassword(testCredentials.newPassword);
      if (!passwordValidation.success) {
        setTestStatus({ success: false, message: passwordValidation.message });
        return;
      }
      setTestStatus({ success: false, message: 'Resetting password...' });
      const payload = {
        resetCode: testCredentials.confirmationCode,
        newPassword: testCredentials.newPassword
      };
      if (authMethod === 'email') {
        payload.email = testCredentials.email;
      } else {
        payload.phoneNumber = testCredentials.phoneNumber;
      }
      const response = await resetPassword(payload).unwrap();
      analytics.trackEvent('auth_password_reset_complete', { method: authMethod, from: 'debug_panel', received_token: !!response.token });
      if (response.token) {
        console.log('Reset password successful with token!', response);
        AuthTokenService.setAuthInfo({
          isAuthenticated: true,
          user: response.user || {},
          authToken: response.token,
          roles: response.roles || [],
          businesses: response.businesses || [],
          activeBusiness: response.activeBusiness || null
        });
        dispatch(setCredentials(response));
        setTestStatus({ success: true, message: 'Password reset successful. Auth token received and stored. You can now access protected routes.' });
      } else {
        setTestStatus({ success: true, message: 'Password reset successful. You can now login with your new password.' });
      }
      setResetCodeSent(false);
      setTestCredentials({ ...testCredentials, confirmationCode: '', newPassword: '' });
    } catch (error) {
      console.error('Password reset error:', error);
      analytics.trackEvent('error_validation', { context: 'password_reset', error_message: error.data?.message || error.message || 'Unknown error', method: authMethod, from: 'debug_panel' });
      setTestStatus({ success: false, message: `Failed to reset password: ${error.data?.message || error.message || 'Unknown error'}` });
    }
  };

  // Change password while logged in
  const handleChangePassword = async () => {
    if (!tokenInfo.hasToken || !tokenInfo.tokenData) {
      setTestStatus({ success: false, message: `You must be logged in to change your password.` });
      return;
    }
    const passwordValidation = validatePassword(testCredentials.newPassword);
    if (!passwordValidation.success) {
      setTestStatus({ success: false, message: passwordValidation.message });
      return;
    }
    try {
      setTestStatus({ success: false, message: 'Changing password...' });
      analytics.trackEvent('auth_password_change', { user_id: tokenInfo.tokenData.id, from: 'debug_panel' });
      await changePassword({
        userId: tokenInfo.tokenData.id,
        currentPassword: testCredentials.password,
        newPassword: testCredentials.newPassword
      }).unwrap();
      setTestStatus({ success: true, message: `Password changed successfully!` });
    } catch (error) {
      console.error('Change password error:', error);
      analytics.trackEvent('error_validation', { context: 'password_change', error_message: error.data?.message || error.message || 'Unknown error', user_id: tokenInfo.tokenData?.id, from: 'debug_panel' });
      setTestStatus({ success: false, message: `Password change failed: ${error.data?.message || error.message || 'Unknown error'}` });
    }
  };

  // Function to reset password to a hardcoded value (for Settings panel)
  const handleResetPassword = async () => {
    if (!tokenInfo.hasToken || !tokenInfo.tokenData) {
      console.error('Password reset error: User not logged in');
      return;
    }
    const passwordValidation = validatePassword('Astroboy#1!');
    if (!passwordValidation.success) {
      console.error('Password reset error:', passwordValidation.message);
      return;
    }
    try {
      await changePassword({
        userId: tokenInfo.tokenData.id,
        currentPassword: testCredentials.password,
        newPassword: 'Astroboy#1!'
      });
      console.log('Password reset to Astroboy#1!');
      analytics.trackEvent('auth_password_change', { user_id: tokenInfo.tokenData.id, from: 'debug_panel', reset_to_default: true });
    } catch (error) {
      console.error('Password reset error:', error);
    }
  };

  // Track custom test event
  const handleTrackTestEvent = () => {
    analytics.trackEvent('debug_test_event', {
      timestamp: new Date().toISOString(),
      panel_position: position,
      current_tab: tab,
      panel_state: expanded ? 'expanded' : 'collapsed',
      theme_mode: themeMode,
      debug_session_id: sessionId
    });
    setTestStatus({ success: true, message: 'Test event tracked successfully! Check the Analytics tab.' });
  };

  const handleConfigChange = (key, value) => {
    setAnalyticsConfig({ ...analyticsConfig, [key]: value });
    analytics.trackEvent('debug_config_change', { config_key: key, config_value: value, panel_position: position, current_tab: tab });
  };

  const handleClearEvents = () => {
    setAnalyticsEvents([]);
    eventLogRef.current = [];
    setEventCount(0);
    analytics.trackEvent('debug_clear_events', { timestamp: new Date().toISOString(), previous_event_count: eventCount });
  };

  // Reset panel position handler - now directly manipulates DOM for immediate effect
  const handleResetPosition = () => {
    const newPosition = { right: 20, bottom: 20, left: 'auto', top: 'auto' };
    setPosition(newPosition);

    // Direct DOM manipulation for immediate effect
    if (panelRef.current) {
      const panel = panelRef.current;
      panel.style.left = 'auto';
      panel.style.top = 'auto';
      panel.style.right = '20px';
      panel.style.bottom = '20px';
    }

    analytics.trackEvent('debug_panel_position_reset', {});
  };

  // Dynamic panel colors based on theme and token state
  const getPanelColor = () => {
    const isDark = theme.palette.mode === 'dark';
    return {
      background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      border: `1px solid ${theme.palette.primary.main}`,
      text: theme.palette.text.primary,
      header: isDark
          ? tokenInfo.hasToken ? 'rgba(0, 128, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)'
          : tokenInfo.hasToken ? 'rgba(0, 150, 0, 0.8)' : 'rgba(255, 50, 50, 0.8)',
      boxShadow: `0 0 10px ${theme.palette.primary.main}`
    };
  };
  const panelColors = getPanelColor();

  return (
      <Paper
          ref={panelRef}
          elevation={3}
          sx={{
            position: 'fixed', // Ensure fixed positioning
            zIndex: 9998,
            width: 350,
            maxHeight: expanded ? 600 : 40,
            overflow: 'hidden',
            opacity: opacity,
            transition: theme.transitions.create(['opacity', 'max-height']),
            cursor: isDragging ? 'grabbing' : 'default',
            bgcolor: panelColors.background,
            border: panelColors.border,
            boxShadow: panelColors.boxShadow,
            '&:hover': {
              opacity: 1,
              boxShadow: `0 0 15px ${theme.palette.primary.main}`
            }
            // Position is handled via direct style manipulation for smoother dragging
          }}
      >
        <Header
            ref={headerRef}
            expanded={expanded}
            toggleExpand={() => setExpanded(!expanded)}
            opacity={opacity}
            toggleOpacity={() => setOpacity(opacity === 0.9 ? 0.3 : 0.9)}
            matrixTick={matrixTick}
            theme={theme}
        />
        <Collapse in={expanded} timeout="auto">
          <Box sx={{ display: 'flex', borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Button
                startIcon={<InfoIcon />}
                size="small"
                variant={tab === 'token' ? 'contained' : 'text'}
                onClick={() => setTab('token')}
                sx={{
                  flexGrow: 1,
                  borderRadius: 0,
                  color: tab === 'token' ? theme.palette.primary.contrastText : theme.palette.primary.main,
                  bgcolor: tab === 'token' ? theme.palette.primary.main : 'transparent'
                }}
            >
              Token
            </Button>
            <Button
                startIcon={<LoginIcon />}
                size="small"
                variant={tab === 'test' ? 'contained' : 'text'}
                onClick={() => setTab('test')}
                sx={{
                  flexGrow: 1,
                  borderRadius: 0,
                  color: tab === 'test' ? theme.palette.primary.contrastText : theme.palette.primary.main,
                  bgcolor: tab === 'test' ? theme.palette.primary.main : 'transparent'
                }}
            >
              Test
            </Button>
            <Button
                startIcon={<AnalyticsIcon />}
                size="small"
                variant={tab === 'analytics' ? 'contained' : 'text'}
                onClick={() => setTab('analytics')}
                sx={{
                  flexGrow: 1,
                  borderRadius: 0,
                  color: tab === 'analytics' ? theme.palette.primary.contrastText : theme.palette.primary.main,
                  bgcolor: tab === 'analytics' ? theme.palette.primary.main : 'transparent'
                }}
            >
              Analytics
            </Button>
            <Button
                startIcon={<SettingsIcon />}
                size="small"
                variant={tab === 'settings' ? 'contained' : 'text'}
                onClick={() => setTab('settings')}
                sx={{
                  flexGrow: 1,
                  borderRadius: 0,
                  color: tab === 'settings' ? theme.palette.primary.contrastText : theme.palette.primary.main,
                  bgcolor: tab === 'settings' ? theme.palette.primary.main : 'transparent'
                }}
            >
              Settings
            </Button>
          </Box>
          {tab === 'token' &&
              <TokenPanel
                  tokenInfo={tokenInfo}
                  theme={theme}
                  panelColors={panelColors}
                  handleClearToken={() => {
                    AuthTokenService.clearAuthInfo();
                    analytics.trackEvent('auth_logout', { from: 'debug_panel' });
                  }}
              />
          }
          {tab === 'test' &&
              <TestPanel
                  testType={testType}
                  setTestType={setTestType}
                  authMethod={authMethod}
                  setAuthMethod={setAuthMethod}
                  testCredentials={testCredentials}
                  setTestCredentials={setTestCredentials}
                  testStatus={testStatus}
                  setTestStatus={setTestStatus}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showNewPassword={showNewPassword}
                  setShowNewPassword={setShowNewPassword}
                  resetCodeSent={resetCodeSent}
                  setResetCodeSent={setResetCodeSent}
                  handleTestLogin={handleTestLogin}
                  handleRequestResetCode={handleRequestResetCode}
                  handleResetPasswordWithCode={handleResetPasswordWithCode}
                  handleChangePassword={handleChangePassword}
                  handleTrackTestEvent={handleTrackTestEvent}
                  tokenInfo={tokenInfo}
                  theme={theme}
                  analytics={analytics}
              />
          }
          {tab === 'analytics' &&
              <AnalyticsPanel
                  analytics={analytics}
                  analyticsSubTab={analyticsSubTab}
                  setAnalyticsSubTab={setAnalyticsSubTab}
                  analyticsEvents={analyticsEvents}
                  eventCount={eventCount}
                  isCapturing={isCapturing}
                  setIsCapturing={setIsCapturing}
                  handleClearEvents={handleClearEvents}
                  analyticsConfig={analyticsConfig}
                  handleConfigChange={handleConfigChange}
                  performanceMetrics={performanceMetrics}
                  setPerformanceMetrics={setPerformanceMetrics}
                  theme={theme}
              />
          }
          {tab === 'settings' &&
              <SettingsPanel
                  resetPosition={handleResetPosition}
                  toggleOpacity={() => {
                    setOpacity(opacity === 0.9 ? 0.3 : 0.9);
                    analytics.trackEvent('debug_panel_opacity_toggle', { new_opacity: opacity === 0.9 ? 0.3 : 0.9 });
                  }}
                  handleResetPassword={handleResetPassword}
                  opacity={opacity}
                  sessionId={sessionId}
                  themeMode={themeMode}
                  eventCount={eventCount}
                  theme={theme}
                  themeToggle={<ThemeToggle />}
                  languageSelector={<LanguageSelector />}
              />
          }
        </Collapse>
      </Paper>
  );
};

export default DebugPanel;