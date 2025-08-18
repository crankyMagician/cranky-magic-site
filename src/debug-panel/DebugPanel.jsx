// debug-panel/DebugPanel.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { EVENTS } from "../analytics/constants/events";
import ThemeToggle from "../components/demoComponents/ThemeToggle";
import LanguageSelector from "../components/demoComponents/LanguageSwitcher";
import analyticsDebugger from './utils/AnalyticsDebugger';
import { getEventTypeColor } from './utils/eventTypes';

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

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Token debug state
  const [tokenInfo, setTokenInfo] = useState({
    hasToken: false,
    tokenExpiry: null,
    tokenData: null,
    lastCheck: null,
    authToken: null
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
  const [performanceMetrics, setPerformanceMetrics] = useState({
    FCP: '450ms',
    LCP: '1.2s',
    CLS: '0.05',
    FID: '28ms',
    TTFB: '210ms',
    jsCount: 7,
    jsTime: 320,
    cssCount: 3,
    cssTime: 120,
    imgCount: 8,
    imgTime: 450,
    apiCount: 4,
    apiTime: 180
  });

  const sessionId = useRef(`debug_${Date.now()}_${Math.random().toString(36).substring(2,9)}`).current;

  // Paper ref for the main container
  const panelRef = useRef(null);
  // Header ref for dragging
  const headerRef = useRef(null);

  // Initialize analytics debugger on mount
  useEffect(() => {
    // Initialize the analytics debugger
    if (analytics) {
      analyticsDebugger.initialize(analytics);
      analyticsDebugger.setCapturing(isCapturing);

      // Load initial events if any
      const initialEvents = analyticsDebugger.getEvents();
      if (initialEvents.length > 0) {
        setAnalyticsEvents(initialEvents);
        setEventCount(analyticsDebugger.getEventCount());
      }

      console.log('[DebugPanel] Analytics debugger initialized');
    }

    return () => {
      // Clean up on unmount
      if (analytics) {
        analyticsDebugger.cleanup(analytics);
      }
    };
  }, [analytics]);

  // Check token info on mount and every 5 seconds
  useEffect(() => {
    const checkToken = () => {
      const { authToken, isAuthenticated } = AuthTokenService.getAuthInfo();
      const debugInfo = {
        hasToken: isAuthenticated && !!authToken,
        tokenExpiry: null,
        tokenData: null,
        authToken,
        lastCheck: new Date().toISOString()
      };

      if (authToken) {
        try {
          const decodedToken = TokenDecoder.decode(authToken);
          if (decodedToken && !TokenDecoder.isExpired(authToken)) {
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

  // Set up analytics event listener
  useEffect(() => {
    // Handler for analytics events
    const handleAnalyticsEvent = (event) => {
      // Skip if not capturing
      if (!isCapturing) return;

      // Update the events list state
      setAnalyticsEvents(prev => {
        const eventData = event.detail;
        // Ensure we have an ID
        if (!eventData.id) {
          eventData.id = `evt_${Date.now()}_${Math.random().toString(36).substring(2,9)}`;
        }
        // Ensure we have a timestamp
        if (!eventData.timestamp) {
          eventData.timestamp = Date.now();
        }
        // Return new array with this event at the beginning, limited to 100 items
        return [eventData, ...prev].slice(0, 100);
      });

      // Update the event counter
      setEventCount(prev => prev + 1);
    };

    // Set up event listener for analytics debugging events
    window.addEventListener('analytics_event_captured', handleAnalyticsEvent);

    // Legacy event listener for backward compatibility
    window.addEventListener('analytics_event', handleAnalyticsEvent);

    // Clean up when unmounting
    return () => {
      window.removeEventListener('analytics_event_captured', handleAnalyticsEvent);
      window.removeEventListener('analytics_event', handleAnalyticsEvent);
    };
  }, [isCapturing]);

  // Update analytics debugger when capturing state changes
  useEffect(() => {
    analyticsDebugger.setCapturing(isCapturing);
  }, [isCapturing]);

  // DRAG FUNCTIONALITY
  // Handle start of dragging on header
  const handleHeaderMouseDown = (e) => {
    // Ignore if the click is on a button or SVG (icons)
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') ||
        e.target.tagName === 'svg' || e.target.closest('svg')) {
      return;
    }

    // Start dragging
    setIsDragging(true);

    // Calculate the drag offset (where in the header the user clicked)
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle dragging movement
  const handleMouseMove = (e) => {
    if (!isDragging || !panelRef.current) return;

    // Calculate new position based on mouse position and initial drag offset
    const newLeft = e.clientX - dragOffset.x;
    const newTop = e.clientY - dragOffset.y;

    // Apply new position directly to the element
    panelRef.current.style.left = `${newLeft}px`;
    panelRef.current.style.top = `${newTop}px`;
    panelRef.current.style.right = 'auto';
    panelRef.current.style.bottom = 'auto';
  };

  // Handle end of dragging
  const handleMouseUp = () => {
    if (!isDragging) return;

    // End dragging
    setIsDragging(false);

    // Update position state with final position
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left,
        top: rect.top,
        right: 'auto',
        bottom: 'auto'
      });
    }
  };

  // Add and remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Test login function
  const handleTestLogin = async () => {
    try {
      setTestStatus({ success: false, message: 'Logging in...' });
      analytics.trackEvent('auth_login_start', { method: 'email', from: 'debug_panel' });
      const result = await login(testCredentials).unwrap();

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

      analytics.trackEvent('auth_login_success', {
        user_id: result.user?.id,
        method: 'email',
        from: 'debug_panel'
      });

      setTestStatus({
        success: true,
        message: `Login successful! Token received for ${result.user?.email || 'user'}.`
      });
    } catch (error) {
      console.error('Login error:', error);
      analytics.trackEvent('auth_login_failure', {
        error_message: error.data?.message || error.message || 'Unknown error',
        method: 'email',
        from: 'debug_panel'
      });
      setTestStatus({
        success: false,
        message: `Login failed: ${error.data?.message || error.message || 'Unknown error'}`
      });
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
      setTestStatus({
        success: true,
        message: `Reset code sent to ${authMethod === 'email' ? testCredentials.email : testCredentials.phoneNumber}. Please check your ${authMethod === 'email' ? 'email' : 'phone'}.`
      });
    } catch (error) {
      console.error('Reset code request error:', error);
      analytics.trackEvent('error_validation', {
        context: 'password_reset_request',
        error_message: error.data?.message || error.message || 'Unknown error',
        method: authMethod,
        from: 'debug_panel'
      });
      setTestStatus({
        success: false,
        message: `Failed to send reset code: ${error.data?.message || error.message || 'Unknown error'}`
      });
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
      analytics.trackEvent('auth_password_reset_complete', {
        method: authMethod,
        from: 'debug_panel',
        received_token: !!response.token
      });

      if (response.token) {
        AuthTokenService.setAuthInfo({
          isAuthenticated: true,
          user: response.user || {},
          authToken: response.token,
          roles: response.roles || [],
          businesses: response.businesses || [],
          activeBusiness: response.activeBusiness || null
        });

        dispatch(setCredentials(response));
        setTestStatus({
          success: true,
          message: 'Password reset successful. Auth token received and stored. You can now access protected routes.'
        });
      } else {
        setTestStatus({
          success: true,
          message: 'Password reset successful. You can now login with your new password.'
        });
      }

      setResetCodeSent(false);
      setTestCredentials({ ...testCredentials, confirmationCode: '', newPassword: '' });
    } catch (error) {
      console.error('Password reset error:', error);
      analytics.trackEvent('error_validation', {
        context: 'password_reset',
        error_message: error.data?.message || error.message || 'Unknown error',
        method: authMethod,
        from: 'debug_panel'
      });
      setTestStatus({
        success: false,
        message: `Failed to reset password: ${error.data?.message || error.message || 'Unknown error'}`
      });
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
      analytics.trackEvent('error_validation', {
        context: 'password_change',
        error_message: error.data?.message || error.message || 'Unknown error',
        user_id: tokenInfo.tokenData?.id,
        from: 'debug_panel'
      });
      setTestStatus({
        success: false,
        message: `Password change failed: ${error.data?.message || error.message || 'Unknown error'}`
      });
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
      analytics.trackEvent('auth_password_change', {
        user_id: tokenInfo.tokenData.id,
        from: 'debug_panel',
        reset_to_default: true
      });

      setTestStatus({
        success: true,
        message: 'Password reset to default: Astroboy#1!'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      setTestStatus({
        success: false,
        message: `Password reset failed: ${error.data?.message || error.message || 'Unknown error'}`
      });
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

    setTestStatus({
      success: true,
      message: 'Test event tracked successfully! Check the Analytics tab.'
    });
  };

  // Handle analytics config changes
  const handleConfigChange = (key, value) => {
    setAnalyticsConfig({ ...analyticsConfig, [key]: value });
    analytics.trackEvent('debug_config_change', {
      config_key: key,
      config_value: value,
      panel_position: position,
      current_tab: tab
    });
  };

  // Clear analytics events
  const handleClearEvents = useCallback(() => {
    setAnalyticsEvents([]);
    analyticsDebugger.clearEvents();
    setEventCount(0);

    analytics.trackEvent('debug_clear_events', {
      timestamp: new Date().toISOString()
    });
  }, [analytics]);

  // Reset panel position handler
  const handleResetPosition = () => {
    if (panelRef.current) {
      // Apply reset position directly to DOM element
      panelRef.current.style.left = 'auto';
      panelRef.current.style.top = 'auto';
      panelRef.current.style.right = '20px';
      panelRef.current.style.bottom = '20px';

      // Update position state
      setPosition({ right: 20, bottom: 20, left: 'auto', top: 'auto' });

      // Track reset event
      analytics.trackEvent('debug_panel_position_reset', {});
    }
  };

  // Toggle capturing state
  const toggleCapturing = useCallback(() => {
    setIsCapturing(prev => {
      const newState = !prev;
      analyticsDebugger.setCapturing(newState);
      return newState;
    });
  }, []);

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
            position: 'fixed',
            zIndex: 9998,
            width: 350,
            maxHeight: expanded ? 600 : 40,
            overflow: 'hidden',
            opacity: opacity,
            transition: theme.transitions.create(['opacity', 'max-height']),
            bgcolor: panelColors.background,
            border: panelColors.border,
            boxShadow: panelColors.boxShadow,
            cursor: isDragging ? 'grabbing' : 'default',
            '&:hover': {
              opacity: 1,
              boxShadow: `0 0 15px ${theme.palette.primary.main}`
            },
            ...(position.left !== undefined && { left: position.left }),
            ...(position.top !== undefined && { top: position.top }),
            ...(position.right !== undefined && { right: position.right }),
            ...(position.bottom !== undefined && { bottom: position.bottom }),
          }}
      >
        {/* Panel Header - Handle dragging on this element */}
        <Box
            onMouseDown={handleHeaderMouseDown}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: panelColors.header,
              color: theme.palette.getContrastText(panelColors.header),
              px: 2,
              py: 1,
              borderBottom: `1px solid ${theme.palette.primary.main}`,
              userSelect: 'none',
              touchAction: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
        >
          <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                fontFamily: 'monospace',
                letterSpacing: '1px',
                textShadow: `0 0 5px ${theme.palette.primary.main}`,
                pointerEvents: 'none', // Prevent text from interfering with drag
              }}
          >
            {`< DEBUG:ANALYTICS // ${matrixTick % 2 === 0 ? '_' : ''} >`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
                size="small"
                onClick={(e) => {
                  // Stop propagation to prevent drag start
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                sx={{
                  color: theme.palette.primary.main,
                  padding: '4px',
                  zIndex: 10, // Ensure above the draggable area
                }}
            >
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>

            <IconButton
                size="small"
                onClick={(e) => {
                  // Stop propagation to prevent drag start
                  e.stopPropagation();
                  setOpacity(opacity === 0.9 ? 0.3 : 0.9);
                }}
                sx={{
                  color: theme.palette.primary.main,
                  padding: '4px',
                  zIndex: 10, // Ensure above the draggable area
                }}
            >
              {opacity === 0.3 ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>
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
                  setIsCapturing={toggleCapturing}
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