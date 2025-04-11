import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Paper, IconButton, Collapse, TextField, Badge, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { 
  Close as CloseIcon, 
  ExpandLess as ExpandLessIcon, 
  ExpandMore as ExpandMoreIcon,
  Login as LoginIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  LockReset as LockResetIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useResetPasswordMutation, useForgotPasswordMutation, useChangePasswordMutation } from '../../api/apiSlice';
import TokenDecoder from '../../utilities/TokenDecoder';
import AuthTokenService from '../../services/AuthTokenService';
import { setCredentials } from '../../reducers/authReducer';
import validatePassword from '../../utilities/PasswordValidator';

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
  const [login] = useLoginMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [changePassword] = useChangePasswordMutation();
  const matrixTick = useMatrixEffect();
  
  // Panel state
  const [position, setPosition] = useState(initialPosition);
  const [expanded, setExpanded] = useState(true);
  const [opacity, setOpacity] = useState(0.9);
  const [tab, setTab] = useState('token'); // token, test, settings
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
      
      setTestStatus({ 
        success: true, 
        message: `Login successful! Token received for ${result.user?.email || 'user'}.`
      });
    } catch (error) {
      console.error('Login error:', error);
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
    } catch (error) {
      console.error('Password reset error:', error);
    }
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
        <span style={{ color: '#00ff00', textShadow: '0 0 5px #00ff00' }}>
          {getRandomChar()}
        </span>
        {text.substring(randomIndex + 1)}
      </span>
    );
  };

  return (
    <Paper
      ref={panelRef}
      elevation={3}
      sx={{
        position: 'fixed',
        zIndex: 9998,
        width: 300,
        maxHeight: expanded ? 500 : 40,
        overflow: 'hidden',
        opacity: opacity,
        transition: 'opacity 0.2s, max-height 0.3s',
        cursor: isDragging ? 'grabbing' : 'grab',
        bgcolor: 'black',
        border: '1px solid #00ff00',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
        '&:hover': {
          opacity: 1,
          boxShadow: '0 0 15px rgba(0, 255, 0, 0.7)',
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
          bgcolor: tokenInfo.hasToken ? 'rgba(0, 128, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)',
          color: 'white',
          px: 2,
          py: 1,
          borderBottom: '1px solid #00ff00',
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" sx={{ 
          fontFamily: 'monospace',
          letterSpacing: '1px',
          textShadow: '0 0 5px #00ff00'
        }}>
          <MatrixText>{`< DEBUG // ${matrixTick % 2 === 0 ? '_' : ''} >`}</MatrixText>
        </Typography>
        <Box>
          <IconButton 
            size="small" 
            onClick={() => setExpanded(!expanded)}
            sx={{ color: '#00ff00', '&:hover': { color: '#00ff00', textShadow: '0 0 10px #00ff00' } }}
          >
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => setOpacity(opacity === 0.3 ? 0.9 : 0.3)}
            sx={{ color: '#00ff00', '&:hover': { color: '#00ff00', textShadow: '0 0 10px #00ff00' } }}
          >
            {opacity === 0.3 ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      {/* Tabs */}
      <Collapse in={expanded} timeout="auto">
        <Box sx={{ display: 'flex', borderBottom: '1px solid #333' }}>
          <Button 
            startIcon={<InfoIcon />}
            size="small" 
            variant={tab === 'token' ? 'contained' : 'text'}
            onClick={() => setTab('token')}
            sx={{ 
              flexGrow: 1, 
              borderRadius: 0, 
              color: '#00ff00',
              bgcolor: tab === 'token' ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(0, 255, 0, 0.1)' }
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
              color: '#00ff00',
              bgcolor: tab === 'test' ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(0, 255, 0, 0.1)' }
            }}
          >
            Test
          </Button>
          <Button 
            startIcon={<SettingsIcon />}
            size="small" 
            variant={tab === 'settings' ? 'contained' : 'text'}
            onClick={() => setTab('settings')}
            sx={{ 
              flexGrow: 1, 
              borderRadius: 0,
              color: '#00ff00',
              bgcolor: tab === 'settings' ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(0, 255, 0, 0.1)' }
            }}
          >
            Settings
          </Button>
        </Box>

        {/* Token Info Tab */}
        {tab === 'token' && (
          <Box sx={{ p: 2, overflow: 'auto', maxHeight: 410, fontFamily: 'monospace', color: '#00ff00' }}>
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Badge 
                color={tokenInfo.hasToken ? "success" : "error"} 
                variant="dot" 
                sx={{ mr: 1 }}
              />
              <Typography variant="subtitle2" sx={{ color: '#00ff00', fontFamily: 'monospace' }}>
                <MatrixText>{tokenInfo.hasToken ? '[TOKEN:ACTIVE]' : '[TOKEN:NONE]'}</MatrixText>
              </Typography>
            </Box>

            {tokenInfo.hasToken && tokenInfo.tokenData && (
              <>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: '#00ff00', fontFamily: 'monospace' }}>
                  $ USER_DATA:
                </Typography>
                <Box sx={{ pl: 1, borderLeft: '1px solid #333' }}>
                  <Typography variant="caption" sx={{ display: 'block', color: '#00ff00', fontFamily: 'monospace' }}>
                    ID: {tokenInfo.tokenData.id}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#00ff00', fontFamily: 'monospace' }}>
                    EMAIL: {tokenInfo.tokenData.email}
                  </Typography>
                </Box>

                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: '#00ff00', fontFamily: 'monospace' }}>
                  $ USER_ROLES:
                </Typography>
                <Box sx={{ pl: 1, borderLeft: '1px solid #333' }}>
                  {tokenInfo.tokenData.roles?.length > 0 ? (
                    tokenInfo.tokenData.roles.map((role, index) => (
                      <Typography key={index} variant="caption" sx={{ display: 'block', color: '#00ff00', fontFamily: 'monospace' }}>
                        {`[${index}] => ${role}`}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="caption" sx={{ display: 'block', color: '#00ff00', fontFamily: 'monospace' }}>
                      [EMPTY_ARRAY]
                    </Typography>
                  )}
                </Box>

                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: '#00ff00', fontFamily: 'monospace' }}>
                  $ BUSINESS_DATA:
                </Typography>
                <Box sx={{ pl: 1, borderLeft: '1px solid #333' }}>
                  {tokenInfo.tokenData.businesses?.length > 0 ? (
                    tokenInfo.tokenData.businesses.map((business, index) => (
                      <Typography key={index} variant="caption" sx={{ display: 'block', color: '#00ff00', fontFamily: 'monospace' }}>
                        {`[${index}] => { id: ${business.id}, name: "${business.name}", role: "${business.role}" }`}
                        {tokenInfo.tokenData.activeBusiness?.id === business.id && 
                          ' [ACTIVE]'}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="caption" sx={{ display: 'block', color: '#00ff00', fontFamily: 'monospace' }}>
                      [EMPTY_ARRAY]
                    </Typography>
                  )}
                </Box>
                
                <Typography variant="caption" sx={{ display: 'block', mt: 1, fontWeight: 'bold', color: '#00ff00', fontFamily: 'monospace' }}>
                  $ TOKEN_EXPIRY:
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', pl: 1, color: '#00ff00', fontFamily: 'monospace', borderLeft: '1px solid #333' }}>
                  {tokenInfo.tokenExpiry ? new Date(tokenInfo.tokenExpiry).toLocaleString() : 'UNKNOWN'}
                </Typography>
              </>
            )}
            
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#007700', fontFamily: 'monospace', fontSize: '10px' }}>
              // Last check: {tokenInfo.lastCheck ? new Date(tokenInfo.lastCheck).toLocaleString() : 'NEVER'}
            </Typography>

            <Button
              variant="outlined"
              size="small"
              color="error"
              fullWidth
              sx={{ 
                mt: 2, 
                color: '#ff0000', 
                borderColor: '#ff0000',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  borderColor: '#ff0000'
                }
              }}
              onClick={() => AuthTokenService.clearAuthInfo()}
              disabled={!tokenInfo.hasToken}
            >
              CLEAR_TOKEN()
            </Button>
          </Box>
        )}

        {/* Test Tab */}
        {tab === 'test' && (
          <Box sx={{ p: 2, bgcolor: 'black', color: '#00ff00', fontFamily: 'monospace' }}>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#007700' }}>Test Type</InputLabel>
              <Select
                value={testType}
                onChange={(e) => {
                  setTestType(e.target.value);
                  setResetCodeSent(false);
                  setTestStatus({ success: false, message: '' });
                }}
                label="Test Type"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'black',
                      color: '#00ff00',
                      border: '1px solid #00ff00',
                      borderRadius: 1,
                      '& .MuiMenuItem-root': {
                        fontFamily: 'monospace',
                        '&:hover': {
                          bgcolor: 'rgba(0, 255, 0, 0.1)',
                        },
                        '&.Mui-selected': {
                          bgcolor: 'rgba(0, 255, 0, 0.2)',
                          '&:hover': {
                            bgcolor: 'rgba(0, 255, 0, 0.3)',
                          }
                        }
                      }
                    }
                  },
                  sx: { zIndex: 10000 }
                }}
                sx={{
                  color: '#00ff00',
                  fontFamily: 'monospace',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#007700',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ff00',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ff00',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#00ff00',
                  },
                  '& .MuiSelect-select': {
                    fontFamily: 'monospace',
                  }
                }}
              >
                <MenuItem value="login">Login Test</MenuItem>
                <MenuItem value="forgotPassword">Forgot Password</MenuItem>
                <MenuItem value="changePassword">Change Password</MenuItem>
              </Select>
            </FormControl>

            {testType === 'login' && (
              <>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#00ff00', fontFamily: 'monospace' }}>
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
                        borderColor: '#007700',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00ff00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff00',
                      },
                      color: '#00ff00',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#007700',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff00',
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
                        sx={{ color: '#00ff00' }}
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#007700',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00ff00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff00',
                      },
                      color: '#00ff00',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#007700',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff00',
                    },
                  }}
                />

                <Button 
                  variant="contained"
                  fullWidth
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(0, 128, 0, 0.7)',
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor: 'rgba(0, 200, 0, 0.7)',
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
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#00ff00', fontFamily: 'monospace' }}>
                  $ FORGOT_PASSWORD_TEST
                </Typography>

                <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                  <InputLabel sx={{ color: '#007700' }}>Auth Method</InputLabel>
                  <Select
                    value={authMethod}
                    onChange={(e) => setAuthMethod(e.target.value)}
                    label="Auth Method"
                    disabled={resetCodeSent}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: 'black',
                          color: '#00ff00',
                          border: '1px solid #00ff00',
                          borderRadius: 1,
                          '& .MuiMenuItem-root': {
                            fontFamily: 'monospace',
                            '&:hover': {
                              bgcolor: 'rgba(0, 255, 0, 0.1)',
                            },
                            '&.Mui-selected': {
                              bgcolor: 'rgba(0, 255, 0, 0.2)',
                              '&:hover': {
                                bgcolor: 'rgba(0, 255, 0, 0.3)',
                              }
                            }
                          }
                        }
                      },
                      sx: { zIndex: 10000 }
                    }}
                    sx={{
                      color: '#00ff00',
                      fontFamily: 'monospace',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#007700',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ff00',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00ff00',
                      },
                      '& .MuiSvgIcon-root': {
                        color: '#00ff00',
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
                              borderColor: '#007700',
                            },
                            '&:hover fieldset': {
                              borderColor: '#00ff00',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff00',
                            },
                            color: '#00ff00',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#007700',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#00ff00',
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
                              borderColor: '#007700',
                            },
                            '&:hover fieldset': {
                              borderColor: '#00ff00',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00ff00',
                            },
                            color: '#00ff00',
                          },
                          '& .MuiInputLabel-root': {
                            color: '#007700',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#00ff00',
                          },
                        }}
                      />
                    )}

                    <Button 
                      variant="contained"
                      fullWidth
                      sx={{ 
                        mt: 2, 
                        bgcolor: 'rgba(0, 128, 0, 0.7)',
                        color: '#ffffff',
                        '&:hover': {
                          bgcolor: 'rgba(0, 200, 0, 0.7)',
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
                            borderColor: '#007700',
                          },
                          '&:hover fieldset': {
                            borderColor: '#00ff00',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#00ff00',
                          },
                          color: '#00ff00',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#007700',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#00ff00',
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
                            sx={{ color: '#00ff00' }}
                          >
                            {showNewPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#007700',
                          },
                          '&:hover fieldset': {
                            borderColor: '#00ff00',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#00ff00',
                          },
                          color: '#00ff00',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#007700',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#00ff00',
                        },
                      }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button 
                        variant="contained"
                        fullWidth
                        sx={{ 
                          bgcolor: 'rgba(0, 128, 0, 0.7)',
                          color: '#ffffff',
                          '&:hover': {
                            bgcolor: 'rgba(0, 200, 0, 0.7)',
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
                          color: '#00ff00',
                          borderColor: '#00ff00',
                          '&:hover': {
                            borderColor: '#00ff00',
                            bgcolor: 'rgba(0, 255, 0, 0.1)'
                          },
                          fontFamily: 'monospace'
                        }}
                        onClick={() => {
                          setResetCodeSent(false);
                          setTestStatus({ success: false, message: '' });
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
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#00ff00', fontFamily: 'monospace' }}>
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
                        sx={{ color: '#00ff00' }}
                      >
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#007700',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00ff00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff00',
                      },
                      color: '#00ff00',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#007700',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff00',
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
                        sx={{ color: '#00ff00' }}
                      >
                        {showNewPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#007700',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00ff00',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00ff00',
                      },
                      color: '#00ff00',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#007700',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#00ff00',
                    },
                  }}
                />

                <Button 
                  variant="contained"
                  fullWidth
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(0, 128, 0, 0.7)',
                    color: '#ffffff',
                    '&:hover': {
                      bgcolor: 'rgba(0, 200, 0, 0.7)',
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
                      color: '#ff0000',
                      fontFamily: 'monospace',
                      mt: 1
                    }}
                  >
                    [ERROR] User must be logged in to change password
                  </Typography>
                )}
              </>
            )}

            {testStatus.message && (
              <Box
                sx={{
                  mt: 2,
                  p: 1,
                  border: `1px solid ${testStatus.success ? '#00ff00' : '#ff0000'}`,
                  bgcolor: testStatus.success ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                  borderRadius: 1,
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    color: testStatus.success ? '#00ff00' : '#ff0000',
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
          <Box sx={{ p: 2, bgcolor: 'black', color: '#00ff00', fontFamily: 'monospace' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ color: '#00ff00', fontFamily: 'monospace' }}>
              $ PANEL_CONFIG
            </Typography>
            
            <Button 
              variant="outlined"
              size="small"
              fullWidth
              sx={{ 
                mb: 1,
                color: '#00ff00',
                borderColor: '#00ff00',
                '&:hover': {
                  borderColor: '#00ff00',
                  bgcolor: 'rgba(0, 255, 0, 0.1)'
                },
                fontFamily: 'monospace'
              }}
              onClick={() => setPosition({ right: 20, bottom: 20, left: 'auto', top: 'auto' })}
            >
              RESET_POSITION()
            </Button>
            
            <Button 
              variant="outlined"
              size="small"
              fullWidth
              sx={{ 
                color: '#00ff00',
                borderColor: '#00ff00',
                '&:hover': {
                  borderColor: '#00ff00',
                  bgcolor: 'rgba(0, 255, 0, 0.1)'
                },
                fontFamily: 'monospace'
              }}
              onClick={() => setOpacity(opacity === 0.9 ? 0.3 : 0.9)}
            >
              {opacity === 0.9 ? 'SET_OPACITY(0.3)' : 'SET_OPACITY(0.9)'}
            </Button>
            
            <Button 
              variant="outlined"
              size="small"
              fullWidth
              sx={{ 
                color: '#00ff00',
                borderColor: '#00ff00',
                '&:hover': {
                  borderColor: '#00ff00',
                  bgcolor: 'rgba(0, 255, 0, 0.1)'
                },
                fontFamily: 'monospace'
              }}
              onClick={handleResetPassword}
            >
              RESET_PASSWORD()
            </Button>
            
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#007700', fontFamily: 'monospace' }}>
              // Drag header to reposition panel
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: '#007700', fontFamily: 'monospace' }}>
              // Panel version: 1.0.1
            </Typography>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
};

export default DebugPanel; 