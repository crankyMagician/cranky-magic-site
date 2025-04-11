import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Paper, IconButton, Collapse, TextField, Badge, Select, MenuItem, FormControl, InputLabel, Tabs, Tab, List, ListItem, ListItemText, Chip, CircularProgress, Switch, FormControlLabel } from '@mui/material';
import {
  Close as CloseIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Login as LoginIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockReset as LockResetIcon,
  Analytics as AnalyticsIcon,
  Memory as MemoryIcon,
  Refresh as RefreshIcon,
  BugReport as BugReportIcon,
  ShowChart as ShowChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useLoginMutation, useResetPasswordMutation, useForgotPasswordMutation, useChangePasswordMutation } from '../../api/apiSlice';
import TokenDecoder from '../../utilities/TokenDecoder';
import AuthTokenService from '../../services/AuthTokenService';
import { setCredentials } from '../../reducers/authReducer';
import validatePassword from '../../utilities/PasswordValidator';
import EVENTS from "../../analytics/constants/events";
import useAnalytics from "../../analytics/hooks/useAnalytics";


// Matrix-style font animation
const useMatrixEffect = () => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return tick;
};

const DebugPanel = ({ initialPosition = { right: 20, bottom: 20 } }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const analytics = useAnalytics();
  const [login] = useLoginMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [changePassword] = useChangePasswordMutation();
  const matrixTick = useMatrixEffect();
  const themeMode = useSelector(state => state.theme.mode);

  // Panel state
  const [position, setPosition] = useState(initialPosition);
  const [expanded, setExpanded] = useState(true);
  const [opacity, setOpacity] = useState(0.9);
  const [tab, setTab] = useState('token'); // token, test, analytics, settings
  const [analyticsSubTab, setAnalyticsSubTab] = useState('events');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // Token debug state
  const [tokenInfo, setTokenInfo] = useState({
    hasToken: false,
    tokenExpiry: null,
    tokenData: null,
    lastCheck: null
  });

  // Test state
  const [testType, setTestType] = useState('login'); // 'login', 'forgotPassword', 'changePassword'
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
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
  const [eventCount, setEventCount] = useState(0);
  const [isCapturing, setIsCapturing] = useState(true);
  const eventLogRef = useRef([]);

  // Matrix-style random character for animation effect
  const getRandomChar = () => {
    const chars = '01_$[]{}|<>/\\=#*~^`';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

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
    // Create a custom event listener for analytics events
    const handleAnalyticsEvent = (event) => {
      if (!isCapturing) return;

      const eventData = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        name: event.detail?.name || 'unknown_event',
        properties: event.detail?.properties || {},
        type: getEventType(event.detail?.name)
      };

      // Add to ref first for quick access
      eventLogRef.current = [eventData, ...eventLogRef.current].slice(0, 100);

      // Update state (less frequently to prevent rerenders)
      setEventCount(prev => prev + 1);
      if (eventCount % 5 === 0) {
        setAnalyticsEvents([...eventLogRef.current]);
      }
    };

    // Monkey patch analytics.trackEvent to capture all events
    const originalTrackEvent = analytics.trackEvent;
    analytics.trackEvent = (name, properties) => {
      // Call the original method
      originalTrackEvent(name, properties);

      // Dispatch custom event for our debugger
      window.dispatchEvent(new CustomEvent('analytics_event', {
        detail: { name, properties }
      }));
    };

    // Listen for analytics events
    window.addEventListener('analytics_event', handleAnalyticsEvent);

    // Clean up
    return () => {
      window.removeEventListener('analytics_event', handleAnalyticsEvent);
      analytics.trackEvent = originalTrackEvent;
    };
  }, [analytics, isCapturing, eventCount]);

  // Categorize event types
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

  // Handle dragging
  const handleMouseDown = (e) => {
    if (panelRef.current) {
      setIsDragging(true);
      const rect = panelRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && panelRef.current) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const panelWidth = panelRef.current.offsetWidth;
      const panelHeight = panelRef.current.offsetHeight;

      // Calculate new position while keeping panel within viewport
      const newLeft = Math.max(0, Math.min(e.clientX - dragOffset.x, viewportWidth - panelWidth));
      const newTop = Math.max(0, Math.min(e.clientY - dragOffset.y, viewportHeight - panelHeight));

      // Convert to right/bottom positioning
      setPosition({
        left: newLeft,
        top: newTop,
        right: 'auto',
        bottom: 'auto'
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
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

      // Track login start
      analytics.trackEvent(EVENTS.AUTH.LOGIN_START, {
        method: 'email',
        from: 'debug_panel'
      });

      const result = await login(testCredentials).unwrap();
      console.log('Login result:', result);

      // Manually call AuthTokenService to ensure token is stored
      AuthTokenService.setAuthInfo({
        isAuthenticated: true,
        user: result.user,
        authToken: result.token,
        roles: result.roles || [],
        businesses: result.businesses || [],
        activeBusiness: result.activeBusiness || null
      });

      // Update Redux state
      dispatch(setCredentials({
        user: result.user,
        token: result.token,
        roles: result.roles || [],
        businesses: result.businesses || [],
        activeBusiness: result.activeBusiness || null
      }));

      // Track login success
      analytics.trackEvent(EVENTS.AUTH.LOGIN_SUCCESS, {
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

      // Track login failure
      analytics.trackEvent(EVENTS.AUTH.LOGIN_FAILURE, {
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

      // Track password reset request
      analytics.trackEvent(EVENTS.AUTH.PASSWORD_RESET_REQUEST, {
        method: authMethod,
        from: 'debug_panel'
      });

      // Create the request payload based on auth method
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

      // Track reset code failure
      analytics.trackEvent(EVENTS.ERROR.VALIDATION_ERROR, {
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
      // Validate the new password first
      const passwordValidation = validatePassword(testCredentials.newPassword);
      if (!passwordValidation.success) {
        setTestStatus({
          success: false,
          message: passwordValidation.message
        });
        return;
      }

      setTestStatus({ success: false, message: 'Resetting password...' });

      // Create the payload based on auth method
      const payload = {
        resetCode: testCredentials.confirmationCode,
        newPassword: testCredentials.newPassword
      };

      // Add the identifier based on auth method
      if (authMethod === 'email') {
        payload.email = testCredentials.email;
      } else {
        payload.phoneNumber = testCredentials.phoneNumber;
      }

      // Reset the password
      const response = await resetPassword(payload).unwrap();

      // Track password reset completion
      analytics.trackEvent(EVENTS.AUTH.PASSWORD_RESET_COMPLETE, {
        method: authMethod,
        from: 'debug_panel',
        received_token: !!response.token
      });

      // Check if we received a token in the response
      if (response.token) {
        console.log('Reset password successful with token!', response);

        // Save auth info to localStorage
        AuthTokenService.setAuthInfo({
          isAuthenticated: true,
          user: response.user || {},
          authToken: response.token,
          roles: response.roles || [],
          businesses: response.businesses || [],
          activeBusiness: response.activeBusiness || null
        });

        // Update Redux state
        dispatch(setCredentials(response));

        setTestStatus({
          success: true,
          message: 'Password reset successful. Auth token received and stored. You can now access protected routes.'
        });
      } else {
        // Handle legacy response without token
        setTestStatus({
          success: true,
          message: 'Password reset successful. You can now login with your new password.'
        });
      }

      // Reset the form
      setResetCodeSent(false);
      setTestCredentials({
        ...testCredentials,
        confirmationCode: '',
        newPassword: ''
      });
    } catch (error) {
      console.error('Password reset error:', error);

      // Track reset failure
      analytics.trackEvent(EVENTS.ERROR.VALIDATION_ERROR, {
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
      setTestStatus({
        success: false,
        message: `You must be logged in to change your password.`
      });
      return;
    }

    // Validate the new password first
    const passwordValidation = validatePassword(testCredentials.newPassword);
    if (!passwordValidation.success) {
      setTestStatus({
        success: false,
        message: passwordValidation.message
      });
      return;
    }

    try {
      setTestStatus({ success: false, message: 'Changing password...' });

      // Track password change
      analytics.trackEvent(EVENTS.AUTH.PASSWORD_CHANGE, {
        user_id: tokenInfo.tokenData.id,
        from: 'debug_panel'
      });

      await changePassword({
        userId: tokenInfo.tokenData.id,
        currentPassword: testCredentials.password,
        newPassword: testCredentials.newPassword
      }).unwrap();

      setTestStatus({
        success: true,
        message: `Password changed successfully!`
      });
    } catch (error) {
      console.error('Change password error:', error);

      // Track change password failure
      analytics.trackEvent(EVENTS.ERROR.VALIDATION_ERROR, {
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

    // Validate the hardcoded password
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

      // Track password reset
      analytics.trackEvent(EVENTS.AUTH.PASSWORD_CHANGE, {
        user_id: tokenInfo.tokenData.id,
        from: 'debug_panel',
        reset_to_default: true
      });
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

    setTestStatus({
      success: true,
      message: 'Test event tracked successfully! Check the Analytics tab.'
    });
  };

  // Generate a pseudo-random session ID
  const sessionId = useRef(`debug_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`).current;

  // Update analytics configuration
  const handleConfigChange = (key, value) => {
    setAnalyticsConfig({
      ...analyticsConfig,
      [key]: value
    });

    // Track config change
    analytics.trackEvent('debug_config_change', {
      config_key: key,
      config_value: value,
      panel_position: position,
      current_tab: tab
    });
  };

  // Clear analytics events
  const handleClearEvents = () => {
    setAnalyticsEvents([]);
    eventLogRef.current = [];
    setEventCount(0);

    // Track clear events
    analytics.trackEvent('debug_clear_events', {
      timestamp: new Date().toISOString(),
      previous_event_count: eventCount
    });
  };

  // Matrix-style text effect
  const MatrixText = ({ children, glitchChance = 0.1 }) => {
    const shouldGlitch = Math.random() < glitchChance;
    if (!shouldGlitch || !children) return <span>{children}</span>;

    const text = children.toString();
    const randomIndex = Math.floor(Math.random() * text.length);
    const char = text[randomIndex];

    return (
        <span>
        {text.substring(0, randomIndex)}
          <span style={{ color: theme.palette.primary.main, textShadow: `0 0 5px ${theme.palette.primary.main}` }}>
          {getRandomChar()}
        </span>
          {text.substring(randomIndex + 1)}
      </span>
    );
  };

  // Get panel theme colors based on current theme
  const getPanelColor = () => {
    const isDark = theme.palette.mode === 'dark';

    return {
      background: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      border: `1px solid ${theme.palette.primary.main}`,
      text: theme.palette.text.primary,
      highlight: theme.palette.primary.main,
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
            cursor: isDragging ? 'grabbing' : 'grab',
            bgcolor: panelColors.background,
            border: panelColors.border,
            boxShadow: panelColors.boxShadow,
            '&:hover': {
              opacity: 1,
              boxShadow: `0 0 15px ${theme.palette.primary.main}`,
            },
            ...position
          }}
          onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: panelColors.header,
              color: theme.palette.getContrastText(panelColors.header),
              px: 2,
              py: 1,
              borderBottom: panelColors.border,
            }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{
            fontFamily: 'monospace',
            letterSpacing: '1px',
            textShadow: `0 0 5px ${theme.palette.primary.main}`
          }}>
            <MatrixText>{`< DEBUG:ANALYTICS // ${matrixTick % 2 === 0 ? '_' : ''} >`}</MatrixText>
          </Typography>
          <Box>
            <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: theme.palette.primary.light
                  }
                }}
            >
              {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
            <IconButton
                size="small"
                onClick={() => setOpacity(opacity === 0.3 ? 0.9 : 0.3)}
                sx={{
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color: theme.palette.primary.light
                  }
                }}
            >
              {opacity === 0.3 ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        {/* Tabs */}
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
                  bgcolor: tab === 'token' ? theme.palette.primary.main : 'transparent',
                  '&:hover': { bgcolor: tab === 'token' ? theme.palette.primary.dark : 'rgba(0, 255, 0, 0.1)' }
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
                  bgcolor: tab === 'test' ? theme.palette.primary.main : 'transparent',
                  '&:hover': { bgcolor: tab === 'test' ? theme.palette.primary.dark : 'rgba(0, 255, 0, 0.1)' }
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
                  bgcolor: tab === 'analytics' ? theme.palette.primary.main : 'transparent',
                  '&:hover': { bgcolor: tab === 'analytics' ? theme.palette.primary.dark : 'rgba(0, 255, 0, 0.1)' }
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
                  bgcolor: tab === 'settings' ? theme.palette.primary.main : 'transparent',
                  '&:hover': { bgcolor: tab === 'settings' ? theme.palette.primary.dark : 'rgba(0, 255, 0, 0.1)' }
                }}
            >
              Settings
            </Button>
          </Box>

          {/* Token Info Tab */}
          {tab === 'token' && (
              <Box sx={{ p: 2, overflow: 'auto', maxHeight: 510, fontFamily: 'monospace', color: panelColors.text }}>
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <Badge
                      color={tokenInfo.hasToken ? "success" : "error"}
                      variant="dot"
                      sx={{ mr: 1 }}
                  />
                  <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                    <MatrixText>{tokenInfo.hasToken ? '[TOKEN:ACTIVE]' : '[TOKEN:NONE]'}</MatrixText>
                  </Typography>
                </Box>

                {tokenInfo.hasToken && tokenInfo.tokenData && (
                    <>
                      <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ USER_DATA:
                      </Typography>
                      <Box sx={{ pl: 1, borderLeft: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                          ID: {tokenInfo.tokenData.id}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                          EMAIL: {tokenInfo.tokenData.email}
                        </Typography>
                      </Box>

                      <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ USER_ROLES:
                      </Typography>
                      <Box sx={{ pl: 1, borderLeft: `1px solid ${theme.palette.divider}` }}>
                        {tokenInfo.tokenData.roles?.length > 0 ? (
                            tokenInfo.tokenData.roles.map((role, index) => (
                                <Typography key={index} variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                                  {`[${index}] => ${role}`}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                              [EMPTY_ARRAY]
                            </Typography>
                        )}
                      </Box>

                      <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ BUSINESS_DATA:
                      </Typography>
                      <Box sx={{ pl: 1, borderLeft: `1px solid ${theme.palette.divider}` }}>
                        {tokenInfo.tokenData.businesses?.length > 0 ? (
                            tokenInfo.tokenData.businesses.map((business, index) => (
                                <Typography key={index} variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                                  {`[${index}] => { id: ${business.id}, name: "${business.name}", role: "${business.role}" }`}
                                  {tokenInfo.tokenData.activeBusiness?.id === business.id &&
                                      ' [ACTIVE]'}
                                </Typography>
                            ))
                        ) : (
                            <Typography variant="caption" sx={{ display: 'block', color: panelColors.text, fontFamily: 'monospace' }}>
                              [EMPTY_ARRAY]
                            </Typography>
                        )}
                      </Box>

                      <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ TOKEN_EXPIRY:
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', pl: 1, color: panelColors.text, fontFamily: 'monospace', borderLeft: `1px solid ${theme.palette.divider}` }}>
                        {tokenInfo.tokenExpiry ? new Date(tokenInfo.tokenExpiry).toLocaleString() : 'UNKNOWN'}
                      </Typography>
                    </>
                )}

                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: theme.palette.text.secondary, fontFamily: 'monospace', fontSize: '10px' }}>
                  // Last check: {tokenInfo.lastCheck ? new Date(tokenInfo.lastCheck).toLocaleString() : 'NEVER'}
                </Typography>

                <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    fullWidth
                    sx={{
                      mt: 2,
                      color: theme.palette.error.main,
                      borderColor: theme.palette.error.main,
                      '&:hover': {
                        backgroundColor: `${theme.palette.error.main}20`,
                        borderColor: theme.palette.error.main
                      }
                    }}
                    onClick={() => {
                      AuthTokenService.clearAuthInfo();
                      analytics.trackEvent(EVENTS.AUTH.LOGOUT, {
                        from: 'debug_panel'
                      });
                    }}
                    disabled={!tokenInfo.hasToken}
                >
                  CLEAR_TOKEN()
                </Button>
              </Box>
          )}

          {/* Test Tab */}
          {tab === 'test' && (
              <Box sx={{ p: 2, bgcolor: panelColors.background, color: panelColors.text, fontFamily: 'monospace' }}>
                <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: theme.palette.text.secondary }}>Test Type</InputLabel>
                  <Select
                      value={testType}
                      onChange={(e) => {
                        setTestType(e.target.value);
                        setResetCodeSent(false);
                        setTestStatus({ success: false, message: '' });
                        analytics.trackEvent('debug_test_type_change', { new_type: e.target.value });
                      }}
                      label="Test Type"
                      sx={{
                        color: panelColors.text,
                        fontFamily: 'monospace',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.divider,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.primary.main,
                        },
                        '& .MuiSvgIcon-root': {
                          color: theme.palette.primary.main,
                        },
                        '& .MuiSelect-select': {
                          fontFamily: 'monospace',
                        }
                      }}
                  >
                    <MenuItem value="login">Login Test</MenuItem>
                    <MenuItem value="forgotPassword">Forgot Password</MenuItem>
                    <MenuItem value="changePassword">Change Password</MenuItem>
                    <MenuItem value="analytics">Analytics Test</MenuItem>
                  </Select>
                </FormControl>

                {testType === 'login' && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ LOGIN_TEST
                      </Typography>

                      <TextField
                          label="Email"
                          fullWidth
                          margin="dense"
                          size="small"
                          value={testCredentials.email}
                          onChange={(e) => setTestCredentials({...testCredentials, email: e.target.value})}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: theme.palette.divider,
                              },
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              color: panelColors.text,
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.text.secondary,
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: theme.palette.primary.main,
                            },
                          }}
                      />

                      <TextField
                          label="Password"
                          fullWidth
                          margin="dense"
                          size="small"
                          type={showPassword ? 'text' : 'password'}
                          value={testCredentials.password}
                          onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
                          InputProps={{
                            endAdornment: (
                                <IconButton
                                    size="small"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{ color: theme.palette.primary.main }}
                                >
                                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                </IconButton>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: theme.palette.divider,
                              },
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              color: panelColors.text,
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.text.secondary,
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: theme.palette.primary.main,
                            },
                          }}
                      />

                      <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            mt: 2,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                              bgcolor: theme.palette.primary.dark,
                            },
                            fontFamily: 'monospace',
                            fontWeight: 'bold'
                          }}
                          onClick={handleTestLogin}
                      >
                        EXECUTE_LOGIN()
                      </Button>
                    </>
                )}

                {testType === 'forgotPassword' && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ FORGOT_PASSWORD_TEST
                      </Typography>

                      {/* Implementation continued from previous part... */}
                      <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                        <InputLabel sx={{ color: theme.palette.text.secondary }}>Auth Method</InputLabel>
                        <Select
                            value={authMethod}
                            onChange={(e) => {
                              setAuthMethod(e.target.value);
                              analytics.trackEvent('debug_auth_method_change', { new_method: e.target.value });
                            }}
                            label="Auth Method"
                            disabled={resetCodeSent}
                            sx={{
                              color: panelColors.text,
                              fontFamily: 'monospace',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.divider,
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: theme.palette.primary.main,
                              },
                              '& .MuiSvgIcon-root': {
                                color: theme.palette.primary.main,
                              },
                              '& .MuiSelect-select': {
                                fontFamily: 'monospace',
                              }
                            }}
                        >
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="phone">Phone</MenuItem>
                        </Select>
                      </FormControl>

                      {!resetCodeSent ? (
                          // Request reset code form
                          <>
                            {authMethod === 'email' ? (
                                <TextField
                                    label="Email"
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    value={testCredentials.email}
                                    onChange={(e) => setTestCredentials({...testCredentials, email: e.target.value.trim().toLowerCase()})}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                          borderColor: theme.palette.divider,
                                        },
                                        '&:hover fieldset': {
                                          borderColor: theme.palette.primary.main,
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: theme.palette.primary.main,
                                        },
                                        color: panelColors.text,
                                      },
                                      '& .MuiInputLabel-root': {
                                        color: theme.palette.text.secondary,
                                      },
                                      '& .MuiInputLabel-root.Mui-focused': {
                                        color: theme.palette.primary.main,
                                      },
                                    }}
                                />
                            ) : (
                                <TextField
                                    label="Phone Number"
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    value={testCredentials.phoneNumber}
                                    onChange={(e) => setTestCredentials({...testCredentials, phoneNumber: e.target.value.replace(/[^\d+]/g, '')})}
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                          borderColor: theme.palette.divider,
                                        },
                                        '&:hover fieldset': {
                                          borderColor: theme.palette.primary.main,
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: theme.palette.primary.main,
                                        },
                                        color: panelColors.text,
                                      },
                                      '& .MuiInputLabel-root': {
                                        color: theme.palette.text.secondary,
                                      },
                                      '& .MuiInputLabel-root.Mui-focused': {
                                        color: theme.palette.primary.main,
                                      },
                                    }}
                                />
                            )}

                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                  mt: 2,
                                  bgcolor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
                                  '&:hover': {
                                    bgcolor: theme.palette.primary.dark,
                                  },
                                  fontFamily: 'monospace',
                                  fontWeight: 'bold'
                                }}
                                onClick={handleRequestResetCode}
                                disabled={
                                  authMethod === 'email'
                                      ? !testCredentials.email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(testCredentials.email)
                                      : !testCredentials.phoneNumber || testCredentials.phoneNumber.length < 10
                                }
                            >
                              REQUEST_RESET_CODE()
                            </Button>
                          </>
                      ) : (
                          // Reset password with code form
                          <>
                            <TextField
                                label="Reset Code"
                                fullWidth
                                margin="dense"
                                size="small"
                                value={testCredentials.confirmationCode}
                                onChange={(e) => setTestCredentials({...testCredentials, confirmationCode: e.target.value})}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: theme.palette.divider,
                                    },
                                    '&:hover fieldset': {
                                      borderColor: theme.palette.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: theme.palette.primary.main,
                                    },
                                    color: panelColors.text,
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: theme.palette.text.secondary,
                                  },
                                  '& .MuiInputLabel-root.Mui-focused': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                            />

                            <TextField
                                label="New Password"
                                fullWidth
                                margin="dense"
                                size="small"
                                type={showNewPassword ? 'text' : 'password'}
                                value={testCredentials.newPassword}
                                onChange={(e) => setTestCredentials({...testCredentials, newPassword: e.target.value})}
                                InputProps={{
                                  endAdornment: (
                                      <IconButton
                                          size="small"
                                          onClick={() => setShowNewPassword(!showNewPassword)}
                                          edge="end"
                                          sx={{ color: theme.palette.primary.main }}
                                      >
                                        {showNewPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                      </IconButton>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                      borderColor: theme.palette.divider,
                                    },
                                    '&:hover fieldset': {
                                      borderColor: theme.palette.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: theme.palette.primary.main,
                                    },
                                    color: panelColors.text,
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: theme.palette.text.secondary,
                                  },
                                  '& .MuiInputLabel-root.Mui-focused': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button
                                  variant="contained"
                                  fullWidth
                                  sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    '&:hover': {
                                      bgcolor: theme.palette.primary.dark,
                                    },
                                    fontFamily: 'monospace',
                                    fontWeight: 'bold'
                                  }}
                                  onClick={handleResetPasswordWithCode}
                                  disabled={
                                      !testCredentials.confirmationCode ||
                                      !testCredentials.newPassword ||
                                      !validatePassword(testCredentials.newPassword).success
                                  }
                              >
                                RESET_PASSWORD()
                              </Button>

                              <Button
                                  variant="outlined"
                                  fullWidth
                                  sx={{
                                    color: theme.palette.primary.main,
                                    borderColor: theme.palette.primary.main,
                                    '&:hover': {
                                      borderColor: theme.palette.primary.main,
                                      bgcolor: `${theme.palette.primary.main}20`
                                    },
                                    fontFamily: 'monospace'
                                  }}
                                  onClick={() => {
                                    setResetCodeSent(false);
                                    setTestStatus({ success: false, message: '' });
                                    analytics.trackEvent('debug_reset_form', {});
                                  }}
                              >
                                BACK()
                              </Button>
                            </Box>
                          </>
                      )}
                    </>
                )}

                {testType === 'changePassword' && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ CHANGE_PASSWORD_TEST
                      </Typography>

                      <TextField
                          label="Current Password"
                          fullWidth
                          margin="dense"
                          size="small"
                          type={showPassword ? 'text' : 'password'}
                          value={testCredentials.password}
                          onChange={(e) => setTestCredentials({...testCredentials, password: e.target.value})}
                          InputProps={{
                            endAdornment: (
                                <IconButton
                                    size="small"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    sx={{ color: theme.palette.primary.main }}
                                >
                                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                </IconButton>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: theme.palette.divider,
                              },
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              color: panelColors.text,
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.text.secondary,
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: theme.palette.primary.main,
                            },
                          }}
                      />

                      <TextField
                          label="New Password"
                          fullWidth
                          margin="dense"
                          size="small"
                          type={showNewPassword ? 'text' : 'password'}
                          value={testCredentials.newPassword}
                          onChange={(e) => setTestCredentials({...testCredentials, newPassword: e.target.value})}
                          InputProps={{
                            endAdornment: (
                                <IconButton
                                    size="small"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                    sx={{ color: theme.palette.primary.main }}
                                >
                                  {showNewPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                </IconButton>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: theme.palette.divider,
                              },
                              '&:hover fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: theme.palette.primary.main,
                              },
                              color: panelColors.text,
                            },
                            '& .MuiInputLabel-root': {
                              color: theme.palette.text.secondary,
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: theme.palette.primary.main,
                            },
                          }}
                      />

                      <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            mt: 2,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                              bgcolor: theme.palette.primary.dark,
                            },
                            fontFamily: 'monospace',
                            fontWeight: 'bold'
                          }}
                          onClick={handleChangePassword}
                          disabled={
                              !tokenInfo.hasToken ||
                              !testCredentials.password ||
                              !testCredentials.newPassword ||
                              !validatePassword(testCredentials.newPassword).success
                          }
                      >
                        CHANGE_PASSWORD()
                      </Button>

                      {!tokenInfo.hasToken && (
                          <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                color: theme.palette.error.main,
                                fontFamily: 'monospace',
                                mt: 1
                              }}
                          >
                            [ERROR] User must be logged in to change password
                          </Typography>
                      )}
                    </>
                )}

                {testType === 'analytics' && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ ANALYTICS_TEST
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace' }}>
                        Send a test event to verify analytics tracking is working.
                      </Typography>

                      <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            mb: 2,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                              bgcolor: theme.palette.primary.dark,
                            },
                            fontFamily: 'monospace',
                            fontWeight: 'bold'
                          }}
                          onClick={handleTrackTestEvent}
                      >
                        TRACK_TEST_EVENT()
                      </Button>

                      <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            color: theme.palette.primary.main,
                            borderColor: theme.palette.primary.main,
                            '&:hover': {
                              borderColor: theme.palette.primary.main,
                              bgcolor: `${theme.palette.primary.main}20`
                            },
                            fontFamily: 'monospace'
                          }}
                          onClick={() => {
                            setTab('analytics');
                            setTimeout(() => {
                              analytics.trackEvent('debug_view_analytics', {
                                from: 'test_tab'
                              });
                            }, 100);
                          }}
                      >
                        VIEW_ANALYTICS_TAB()
                      </Button>
                    </>
                )}

                {testStatus.message && (
                    <Box
                        sx={{
                          mt: 2,
                          p: 1,
                          border: `1px solid ${testStatus.success ? theme.palette.success.main : theme.palette.error.main}`,
                          bgcolor: testStatus.success ? `${theme.palette.success.main}20` : `${theme.palette.error.main}20`,
                          borderRadius: 1,
                        }}
                    >
                      <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: testStatus.success ? theme.palette.success.main : theme.palette.error.main,
                            fontFamily: 'monospace',
                            textAlign: 'left'
                          }}
                      >
                        <MatrixText>{`>> ${testStatus.message}`}</MatrixText>
                      </Typography>
                    </Box>
                )}
              </Box>
          )}

          {/* Analytics Tab */}
          {tab === 'analytics' && (
              <Box sx={{ p: 2, bgcolor: panelColors.background, color: panelColors.text, fontFamily: 'monospace' }}>
                {/* Analytics subtabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs
                      value={analyticsSubTab}
                      onChange={(e, newValue) => {
                        setAnalyticsSubTab(newValue);
                        analytics.trackEvent('debug_analytics_tab_change', {
                          new_tab: newValue
                        });
                      }}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        minHeight: '36px',
                        '& .MuiTab-root': {
                          minHeight: '36px',
                          p: 1,
                          minWidth: '80px',
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                        }
                      }}
                  >
                    <Tab
                        icon={<BarChartIcon fontSize="small" />}
                        iconPosition="start"
                        label="Events"
                        value="events"
                        sx={{
                          color: theme.palette.text.secondary,
                          '&.Mui-selected': {
                            color: theme.palette.primary.main
                          }
                        }}
                    />
                    <Tab
                        icon={<MemoryIcon fontSize="small" />}
                        iconPosition="start"
                        label="Config"
                        value="config"
                        sx={{
                          color: theme.palette.text.secondary,
                          '&.Mui-selected': {
                            color: theme.palette.primary.main
                          }
                        }}
                    />
                    <Tab
                        icon={<ShowChartIcon fontSize="small" />}
                        iconPosition="start"
                        label="Performance"
                        value="performance"
                        sx={{
                          color: theme.palette.text.secondary,
                          '&.Mui-selected': {
                            color: theme.palette.primary.main
                          }
                        }}
                    />
                    <Tab
                        icon={<BugReportIcon fontSize="small" />}
                        iconPosition="start"
                        label="Errors"
                        value="errors"
                        sx={{
                          color: theme.palette.text.secondary,
                          '&.Mui-selected': {
                            color: theme.palette.primary.main
                          }
                        }}
                    />
                  </Tabs>
                </Box>

                {/* Events subtab */}
                {analyticsSubTab === 'events' && (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                          $ EVENTS_LOG [{analyticsEvents.length}]
                        </Typography>
                        <Box>
                          <IconButton
                              size="small"
                              onClick={() => {
                                setIsCapturing(!isCapturing);
                                analytics.trackEvent('debug_toggle_capture', {
                                  new_state: !isCapturing ? 'capturing' : 'paused'
                                });
                              }}
                              sx={{
                                mr: 1,
                                color: isCapturing ? theme.palette.success.main : theme.palette.error.main
                              }}
                          >
                            {isCapturing ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
                          </IconButton>
                          <IconButton
                              size="small"
                              onClick={handleClearEvents}
                              sx={{ color: theme.palette.primary.main }}
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {analyticsEvents.length === 0 ? (
                          <Box
                              sx={{
                                p: 3,
                                textAlign: 'center',
                                border: `1px dashed ${theme.palette.divider}`,
                                borderRadius: 1
                              }}
                          >
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              No events captured yet
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: theme.palette.text.secondary }}>
                              {isCapturing ? 'Waiting for events...' : 'Event capturing is paused'}
                            </Typography>
                          </Box>
                      ) : (
                          <List
                              sx={{
                                maxHeight: 380,
                                overflow: 'auto',
                                p: 0,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 1,
                                '& .MuiListItem-root': {
                                  borderBottom: `1px solid ${theme.palette.divider}`,
                                  py: 1
                                }
                              }}
                          >
                            {analyticsEvents.map((event) => (
                                <ListItem
                                    key={event.id}
                                    sx={{
                                      flexDirection: 'column',
                                      alignItems: 'flex-start',
                                      p: 1,
                                      '&:hover': {
                                        bgcolor: `${theme.palette.primary.main}10`
                                      }
                                    }}
                                >
                                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: 'bold',
                                          fontFamily: 'monospace',
                                          color: theme.palette.primary.main
                                        }}
                                    >
                                      {event.name}
                                    </Typography>
                                    <Chip
                                        label={event.type}
                                        size="small"
                                        sx={{
                                          height: 20,
                                          fontSize: '0.6rem',
                                          backgroundColor: getEventTypeColor(event.type),
                                          fontFamily: 'monospace'
                                        }}
                                    />
                                  </Box>
                                  <Typography
                                      variant="caption"
                                      sx={{
                                        color: theme.palette.text.secondary,
                                        fontFamily: 'monospace',
                                        wordBreak: 'break-all',
                                        width: '100%'
                                      }}
                                  >
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                  </Typography>
                                  <Box sx={{
                                    fontSize: '0.7rem',
                                    mt: 0.5,
                                    p: 1,
                                    bgcolor: `${theme.palette.background.paper}80`,
                                    borderRadius: 1,
                                    width: '100%',
                                    fontFamily: 'monospace',
                                    maxHeight: '100px',
                                    overflow: 'auto'
                                  }}>
                                    {Object.entries(event.properties)
                                        .filter(([key]) => !['timestamp'].includes(key))
                                        .map(([key, value]) => (
                                            <Box key={key} sx={{ display: 'flex', mb: 0.5 }}>
                                              <Typography variant="caption" sx={{ color: theme.palette.info.main, minWidth: '80px', fontFamily: 'monospace' }}>
                                                {key}:
                                              </Typography>
                                              <Typography variant="caption" sx={{ color: panelColors.text, ml: 1, fontFamily: 'monospace' }}>
                                                {typeof value === 'object'
                                                    ? JSON.stringify(value).substring(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '')
                                                    : value?.toString().substring(0, 100) + (value?.toString().length > 100 ? '...' : '')}
                                              </Typography>
                                            </Box>
                                        ))
                                    }
                                  </Box>
                                </ListItem>
                            ))}
                          </List>
                      )}
                    </>
                )}

                {/* Config subtab */}
                {analyticsSubTab === 'config' && (
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ ANALYTICS_CONFIG
                      </Typography>

                      <Box sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        p: 1.5
                      }}>
                        <FormControlLabel
                            control={
                              <Switch
                                  checked={analyticsConfig.consentEnabled}
                                  onChange={(e) => handleConfigChange('consentEnabled', e.target.checked)}
                                  size="small"
                                  color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                User Consent
                              </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                              <Switch
                                  checked={analyticsConfig.trackPageViews}
                                  onChange={(e) => handleConfigChange('trackPageViews', e.target.checked)}
                                  size="small"
                                  color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                Page Views
                              </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                              <Switch
                                  checked={analyticsConfig.trackClicks}
                                  onChange={(e) => handleConfigChange('trackClicks', e.target.checked)}
                                  size="small"
                                  color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                Click Tracking
                              </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                              <Switch
                                  checked={analyticsConfig.trackForms}
                                  onChange={(e) => handleConfigChange('trackForms', e.target.checked)}
                                  size="small"
                                  color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                Form Tracking
                              </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                              <Switch
                                  checked={analyticsConfig.trackAPI}
                                  onChange={(e) => handleConfigChange('trackAPI', e.target.checked)}
                                  size="small"
                                  color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                API Call Tracking
                              </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                              <Switch
                                  checked={analyticsConfig.trackErrors}
                                  onChange={(e) => handleConfigChange('trackErrors', e.target.checked)}
                                  size="small"
                                  color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                Error Tracking
                              </Typography>
                            }
                            sx={{ mb: 1, width: '100%' }}
                        />

                        <FormControlLabel
                            control={
                              <Switch
                                  checked={analyticsConfig.performanceMonitoring}
                                  onChange={(e) => handleConfigChange('performanceMonitoring', e.target.checked)}
                                  size="small"
                                  color="primary"
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                Performance Monitoring
                              </Typography>
                            }
                            sx={{ mb: 2, width: '100%' }}
                        />

                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                            Sample Rate: {analyticsConfig.sampleRate * 100}%
                          </Typography>
                          <Box
                              sx={{
                                width: '100%',
                                mt: 0.5,
                                bgcolor: `${theme.palette.primary.main}20`,
                                borderRadius: 0.5,
                                height: 8,
                                position: 'relative'
                              }}
                          >
                            <Box
                                sx={{
                                  position: 'absolute',
                                  left: 0,
                                  top: 0,
                                  height: '100%',
                                  width: `${analyticsConfig.sampleRate * 100}%`,
                                  bgcolor: theme.palette.primary.main,
                                  borderRadius: 0.5
                                }}
                            />
                          </Box>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            onClick={() => {
                              // Apply analytics config change
                              analytics.trackEvent('debug_apply_config', {
                                config: analyticsConfig
                              });

                              // Apply to analytics consent
                              analytics.setConsent(analyticsConfig.consentEnabled);

                              setTestStatus({
                                success: true,
                                message: 'Configuration applied successfully'
                              });
                            }}
                            sx={{
                              mt: 1,
                              bgcolor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                              fontFamily: 'monospace',
                              '&:hover': {
                                bgcolor: theme.palette.primary.dark
                              }
                            }}
                        >
                          APPLY_CONFIG()
                        </Button>
                      </Box>

                      <Typography variant="caption" sx={{ display: 'block', mt: 2, color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                        // Note: Some settings require app reload to fully apply
                      </Typography>
                    </>
                )}

                {/* Performance subtab */}
                {analyticsSubTab === 'performance' && (
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ PERFORMANCE_METRICS
                      </Typography>

                      <Box sx={{
                        mb: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        p: 1.5
                      }}>
                        <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                          Web Vitals:
                        </Typography>

                        {/* Core Web Vitals display would go here */}
                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: 1.5
                        }}>
                          {['FCP', 'LCP', 'CLS', 'FID', 'TTFB'].map(metric => (
                              <Box
                                  key={metric}
                                  sx={{
                                    p: 1.5,
                                    bgcolor: `${theme.palette.primary.main}10`,
                                    borderRadius: 1,
                                    textAlign: 'center'
                                  }}
                              >
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                  {metric}
                                </Typography>
                                <Typography variant="body1" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace', fontWeight: 'bold' }}>
                                  {performanceMetrics[metric] || '—'}
                                </Typography>
                              </Box>
                          ))}
                        </Box>
                      </Box>

                      <Box sx={{
                        mb: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        p: 1.5
                      }}>
                        <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                          Resource Loading:
                        </Typography>

                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: 1.5
                        }}>
                          {['js', 'css', 'img', 'api'].map(resource => (
                              <Box
                                  key={resource}
                                  sx={{
                                    p: 1,
                                    bgcolor: `${theme.palette.primary.main}10`,
                                    borderRadius: 1,
                                    textAlign: 'center'
                                  }}
                              >
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                  {resource.toUpperCase()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                                  {performanceMetrics[`${resource}Count`] || '0'} items
                                </Typography>
                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                  {performanceMetrics[`${resource}Time`] || '0'}ms
                                </Typography>
                              </Box>
                          ))}
                        </Box>
                      </Box>

                      <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          onClick={() => {
                            // Simulate gathering performance data
                            analytics.trackEvent('debug_refresh_performance', {
                              timestamp: Date.now()
                            });

                            // Here we'd normally gather real performance data
                            // For demo purposes, we'll just set some fake metrics
                            setPerformanceMetrics({
                              FCP: '450ms',
                              LCP: '1.2s',
                              CLS: '0.05',
                              FID: '28ms',
                              TTFB: '210ms',
                              jsCount: Math.floor(Math.random() * 20) + 5,
                              jsTime: Math.floor(Math.random() * 500) + 100,
                              cssCount: Math.floor(Math.random() * 5) + 2,
                              cssTime: Math.floor(Math.random() * 200) + 50,
                              imgCount: Math.floor(Math.random() * 15) + 3,
                              imgTime: Math.floor(Math.random() * 800) + 200,
                              apiCount: Math.floor(Math.random() * 10) + 1,
                              apiTime: Math.floor(Math.random() * 300) + 100
                            });

                            setTestStatus({
                              success: true,
                              message: 'Performance metrics refreshed'
                            });
                          }}
                          sx={{
                            color: theme.palette.primary.main,
                            borderColor: theme.palette.primary.main,
                            fontFamily: 'monospace',
                            '&:hover': {
                              bgcolor: `${theme.palette.primary.main}10`,
                              borderColor: theme.palette.primary.main
                            }
                          }}
                      >
                        REFRESH_METRICS()
                      </Button>
                    </>
                )}

                {/* Errors subtab */}
                {analyticsSubTab === 'errors' && (
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ ERROR_TRACKING
                      </Typography>

                      <Box sx={{
                        mb: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        p: 1.5
                      }}>
                        <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                          Tracked Errors:
                        </Typography>

                        {/* Filter events to only show errors */}
                        {analyticsEvents.filter(e => e.type === 'error').length === 0 ? (
                            <Box
                                sx={{
                                  p: 3,
                                  textAlign: 'center',
                                  border: `1px dashed ${theme.palette.divider}`,
                                  borderRadius: 1
                                }}
                            >
                              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                No errors tracked yet
                              </Typography>
                            </Box>
                        ) : (
                            <List
                                sx={{
                                  maxHeight: 240,
                                  overflow: 'auto',
                                  p: 0,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 1,
                                  '& .MuiListItem-root': {
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    py: 1
                                  }
                                }}
                            >
                              {analyticsEvents
                                  .filter(e => e.type === 'error')
                                  .map((event) => (
                                      <ListItem
                                          key={event.id}
                                          sx={{
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            p: 1,
                                            '&:hover': {
                                              bgcolor: `${theme.palette.error.main}10`
                                            }
                                          }}
                                      >
                                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Typography
                                              variant="body2"
                                              sx={{
                                                fontWeight: 'bold',
                                                fontFamily: 'monospace',
                                                color: theme.palette.error.main
                                              }}
                                          >
                                            {event.name}
                                          </Typography>
                                          <Typography
                                              variant="caption"
                                              sx={{
                                                color: theme.palette.text.secondary,
                                                fontFamily: 'monospace'
                                              }}
                                          >
                                            {new Date(event.timestamp).toLocaleTimeString()}
                                          </Typography>
                                        </Box>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                              color: theme.palette.error.main,
                                              fontFamily: 'monospace'
                                            }}
                                        >
                                          {event.properties.error_message || event.properties.message || 'Unknown error'}
                                        </Typography>
                                      </ListItem>
                                  ))
                              }
                            </List>
                        )}
                      </Box>

                      <Button
                          variant="outlined"
                          fullWidth
                          size="small"
                          onClick={() => {
                            // Generate a test error
                            try {
                              // Deliberately throw an error for testing
                              throw new Error('Test error from debug panel');
                            } catch (error) {
                              // Track the error
                              analytics.trackError(error, {
                                context: 'debug_panel',
                                location: 'error_testing',
                                timestamp: Date.now()
                              });

                              setTestStatus({
                                success: true,
                                message: 'Test error tracked successfully'
                              });
                            }
                          }}
                          sx={{
                            color: theme.palette.error.main,
                            borderColor: theme.palette.error.main,
                            fontFamily: 'monospace',
                            '&:hover': {
                              bgcolor: `${theme.palette.error.main}10`,
                              borderColor: theme.palette.error.main
                            }
                          }}
                      >
                        GENERATE_TEST_ERROR()
                      </Button>
                    </>
                )}

                {testStatus.message && (
                    <Box
                        sx={{
                          mt: 2,
                          p: 1,
                          border: `1px solid ${testStatus.success ? theme.palette.success.main : theme.palette.error.main}`,
                          bgcolor: testStatus.success ? `${theme.palette.success.main}20` : `${theme.palette.error.main}20`,
                          borderRadius: 1,
                        }}
                    >
                      <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: testStatus.success ? theme.palette.success.main : theme.palette.error.main,
                            fontFamily: 'monospace',
                            textAlign: 'left'
                          }}
                      >
                        <MatrixText>{`>> ${testStatus.message}`}</MatrixText>
                      </Typography>
                    </Box>
                )}
              </Box>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
              <Box sx={{ p: 2, bgcolor: panelColors.background, color: panelColors.text, fontFamily: 'monospace' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                  $ PANEL_CONFIG
                </Typography>

                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      mb: 1,
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: `${theme.palette.primary.main}20`
                      },
                      fontFamily: 'monospace'
                    }}
                    onClick={() => {
                      setPosition({ right: 20, bottom: 20, left: 'auto', top: 'auto' });
                      analytics.trackEvent('debug_panel_position_reset', {});
                    }}
                >
                  RESET_POSITION()
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      mb: 1,
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: `${theme.palette.primary.main}20`
                      },
                      fontFamily: 'monospace'
                    }}
                    onClick={() => {
                      setOpacity(opacity === 0.9 ? 0.3 : 0.9);
                      analytics.trackEvent('debug_panel_opacity_toggle', {
                        new_opacity: opacity === 0.9 ? 0.3 : 0.9
                      });
                    }}
                >
                  {opacity === 0.9 ? 'SET_OPACITY(0.3)' : 'SET_OPACITY(0.9)'}
                </Button>

                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: `${theme.palette.primary.main}20`
                      },
                      fontFamily: 'monospace'
                    }}
                    onClick={() => {
                      handleResetPassword();
                      analytics.trackEvent('debug_password_reset', {});
                    }}
                >
                  RESET_PASSWORD()
                </Button>

                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                  // Session ID: {sessionId}
                </Typography>

                <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                  // Theme: {themeMode}
                </Typography>

                <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                  //Analytics Events: {eventCount}
                </Typography>

                <Typography variant="caption" sx={{ display: 'block', color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                 Panel version: 2.0.0 (Analytics Edition)
                </Typography>
              </Box>
          )}
        </Collapse>
      </Paper>
  );
};

// Helper function to get color for event type chips
const getEventTypeColor = (type) => {
  switch (type) {
    case 'page':
      return '#2196f3'; // blue
    case 'interaction':
      return '#4caf50'; // green
    case 'form':
      return '#9c27b0'; // purple
    case 'api':
      return '#ff9800'; // orange
    case 'error':
      return '#f44336'; // red
    case 'performance':
      return '#00bcd4'; // cyan
    case 'scroll':
      return '#8bc34a'; // light green
    case 'session':
      return '#3f51b5'; // indigo
    default:
      return '#757575'; // grey
  }
};

export default DebugPanel;