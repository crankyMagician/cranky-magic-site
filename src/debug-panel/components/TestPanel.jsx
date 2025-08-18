// debug-panel/components/TestPanel.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    CircularProgress
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    ExpandMore,
    Code as CodeIcon
} from '@mui/icons-material';
import MatrixText from './MatrixText';
import { apiSlice } from '../../api/apiSlice';
import validatePassword from '../../utilities/PasswordValidator';

const TestPanel = ({
                       testType,
                       setTestType,
                       authMethod,
                       setAuthMethod,
                       testCredentials,
                       setTestCredentials,
                       testStatus,
                       setTestStatus,
                       showPassword,
                       setShowPassword,
                       showNewPassword,
                       setShowNewPassword,
                       resetCodeSent,
                       setResetCodeSent,
                       handleTestLogin,
                       handleRequestResetCode,
                       handleResetPasswordWithCode,
                       handleChangePassword,
                       handleTrackTestEvent,
                       tokenInfo,
                       theme,
                       analytics
                   }) => {
    const [apiEndpoint, setApiEndpoint] = useState('login');
    const [jsonPayload, setJsonPayload] = useState('{\n  "email": "brian.s.redpath@gmail.com",\n  "password": "P@$$w0rd#1!"\n}');
    const [payloadValid, setPayloadValid] = useState(true);
    const [requestInProgress, setRequestInProgress] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [allApis, setAllApis] = useState(() => {
        // Extract all API endpoints from the apiSlice
        const endpoints = [];

        // Add auth endpoints
        endpoints.push(
            { value: 'login', label: 'Login', category: 'Auth', method: 'POST' },
            { value: 'register', label: 'Register', category: 'Auth', method: 'POST' },
            { value: 'confirmSignup', label: 'Confirm Signup', category: 'Auth', method: 'POST' },
            { value: 'forgotPassword', label: 'Forgot Password', category: 'Auth', method: 'POST' },
            { value: 'resetPassword', label: 'Reset Password', category: 'Auth', method: 'POST' },
            { value: 'changePassword', label: 'Change Password', category: 'Auth', method: 'POST' },
            { value: 'logout', label: 'Logout', category: 'Auth', method: 'POST' },
            { value: 'decodeToken', label: 'Decode Token', category: 'Auth', method: 'POST' },
            { value: 'businessSignup', label: 'Business Signup', category: 'Auth', method: 'POST' }
        );

        // Add business endpoints
        endpoints.push(
            { value: 'getActiveBusiness', label: 'Get Active Business', category: 'Business', method: 'GET' },
            { value: 'getBusinessById', label: 'Get Business by ID', category: 'Business', method: 'GET' },
            { value: 'updateBusiness', label: 'Update Business', category: 'Business', method: 'PUT' },
            { value: 'setActiveBusiness', label: 'Set Active Business', category: 'Business', method: 'POST' },
            { value: 'inviteUserToBusiness', label: 'Invite User to Business', category: 'Business', method: 'POST' },
            { value: 'getBusinessUsers', label: 'Get Business Users', category: 'Business', method: 'GET' },
            { value: 'changeUserRole', label: 'Change User Role', category: 'Business', method: 'PUT' },
            { value: 'removeUserFromBusiness', label: 'Remove User from Business', category: 'Business', method: 'DELETE' }
        );

        // Add business users endpoints
        endpoints.push(
            { value: 'getBusinessUsersRoles', label: 'Get Business Roles', category: 'Business Users', method: 'GET' },
            { value: 'getBusinessUsersPermissions', label: 'Get Business Users Permissions', category: 'Business Users', method: 'GET' },
            { value: 'assignBusinessRole', label: 'Assign Business Role', category: 'Business Users', method: 'POST' },
            { value: 'updateBusinessRole', label: 'Update Business Role', category: 'Business Users', method: 'PUT' },
            { value: 'removeBusinessRole', label: 'Remove Business Role', category: 'Business Users', method: 'POST' }
        );

        // Add campaign endpoints
        endpoints.push(
            { value: 'createCampaign', label: 'Create Campaign', category: 'Campaign', method: 'POST' },
            { value: 'updateCampaign', label: 'Update Campaign', category: 'Campaign', method: 'PUT' },
            { value: 'getCampaignById', label: 'Get Campaign by ID', category: 'Campaign', method: 'GET' },
            { value: 'deleteCampaign', label: 'Delete Campaign', category: 'Campaign', method: 'DELETE' },
            { value: 'getCampaignsByBusiness', label: 'Get Campaigns by Business', category: 'Campaign', method: 'GET' },
            { value: 'attachCampaignMedia', label: 'Attach Campaign Media', category: 'Campaign', method: 'POST' },
            { value: 'deleteCampaignMedia', label: 'Delete Campaign Media', category: 'Campaign', method: 'DELETE' },
            { value: 'updateCampaignStatus', label: 'Update Campaign Status', category: 'Campaign', method: 'PUT' }
        );

        // Add other endpoints
        endpoints.push(
            { value: 'sendSms', label: 'Send SMS', category: 'Commo', method: 'POST' },
            { value: 'sendEmail', label: 'Send Email', category: 'Commo', method: 'POST' },
            { value: 'uploadMedia', label: 'Upload Media', category: 'Media', method: 'POST' },
            { value: 'getMediaById', label: 'Get Media by ID', category: 'Media', method: 'GET' },
            { value: 'deleteMedia', label: 'Delete Media', category: 'Media', method: 'DELETE' }
        );

        return endpoints;
    });

    // Generate sample payloads for selected endpoints
    const getSamplePayload = (endpoint) => {
        const payloads = {
            login: '{\n  "email": "brian.s.redpath@gmail.com",\n  "password": "P@$$w0rd#1!"\n}',
            register: '{\n  "email": "user@example.com",\n  "password": "P@$$w0rd#1!",\n  "firstName": "John",\n  "lastName": "Doe",\n  "phoneNumber": "+15555555555"\n}',
            forgotPassword: '{\n  "email": "user@example.com"\n}',
            resetPassword: '{\n  "email": "user@example.com",\n  "resetCode": "123456",\n  "newPassword": "NewP@$$w0rd#1!"\n}',
            changePassword: '{\n  "userId": "' + (tokenInfo.tokenData?.id || 'user-id-here') + '",\n  "currentPassword": "P@$$w0rd#1!",\n  "newPassword": "NewP@$$w0rd#1!"\n}',
            createCampaign: '{\n  "name": "Test Campaign",\n  "businessId": "' + (tokenInfo.tokenData?.businesses?.[0]?.id || 'business-id-here') + '",\n  "description": "Test campaign created from debug panel",\n  "status": "Draft"\n}',
            getBusinessById: '{\n  "businessId": "' + (tokenInfo.tokenData?.businesses?.[0]?.id || 'business-id-here') + '"\n}',
            inviteUserToBusiness: '{\n  "businessId": "' + (tokenInfo.tokenData?.businesses?.[0]?.id || 'business-id-here') + '",\n  "email": "newuser@example.com",\n  "role": "Member"\n}',
            sendEmail: '{\n  "to": "recipient@example.com",\n  "subject": "Test Email",\n  "body": "This is a test email from the debug panel"\n}',
            sendSms: '{\n  "to": "+15555555555",\n  "message": "This is a test SMS from the debug panel"\n}'
        };

        return payloads[endpoint] || '{\n  // Add payload properties here\n}';
    };

    // Handle API endpoint selection
    const handleApiEndpointChange = (event) => {
        const newEndpoint = event.target.value;
        setApiEndpoint(newEndpoint);
        setJsonPayload(getSamplePayload(newEndpoint));
        setApiResponse(null);
    };

    // Test API call
    const handleTestApi = async () => {
        try {
            setRequestInProgress(true);
            setApiResponse(null);
            setTestStatus({ success: false, message: 'Sending API request...' });

            // Find the selected endpoint info
            const endpointInfo = allApis.find(api => api.value === apiEndpoint);
            let parsedPayload;

            try {
                parsedPayload = JSON.parse(jsonPayload);
                setPayloadValid(true);
            } catch (err) {
                setPayloadValid(false);
                setTestStatus({ success: false, message: `Invalid JSON payload: ${err.message}` });
                setRequestInProgress(false);
                return;
            }

            // Track the API test
            analytics.trackEvent('debug_api_test', {
                endpoint: apiEndpoint,
                method: endpointInfo?.method || 'POST',
                category: endpointInfo?.category || 'Unknown'
            });

            // Determine which API to call based on apiEndpoint
            // Use RTK Query hooks dynamically through apiSlice
            // We need to handle this differently since hooks can only be used in component scope
            // Using fetch instead for the debug panel

            // Build the API URL based on the endpoint
            const baseUrl = process.env.NODE_ENV === 'development'
                ? 'http://localhost:8080'
                : '';

            // Map endpoints to API paths
            const apiPathMap = {
                // Auth endpoints
                login: '/auth/login',
                register: '/auth/register',
                confirmSignup: '/auth/confirm-signup',
                forgotPassword: '/auth/forgot-password',
                resetPassword: '/auth/reset-password',
                changePassword: '/auth/change-password',
                logout: '/auth/logout',
                decodeToken: '/decode-token',
                businessSignup: '/auth/business-signup',

                // Business endpoints
                getActiveBusiness: '/business/active',
                getBusinessById: `/business/${parsedPayload.businessId || 'id'}`,
                updateBusiness: `/business/${parsedPayload.businessId || 'id'}`,
                setActiveBusiness: `/business/${parsedPayload.businessId || 'id'}/set-active`,
                inviteUserToBusiness: `/business/${parsedPayload.businessId || 'id'}/invite`,
                getBusinessUsers: `/business/${parsedPayload.businessId || 'id'}/users`,
                changeUserRole: `/business/${parsedPayload.businessId || 'id'}/users/${parsedPayload.userId || 'userId'}/role`,
                removeUserFromBusiness: `/business/${parsedPayload.businessId || 'id'}/users/${parsedPayload.userId || 'userId'}`,

                // Campaign endpoints
                createCampaign: '/campaigns',
                updateCampaign: '/campaigns',
                getCampaignById: `/campaigns/${parsedPayload.campaignId || 'id'}`,
                deleteCampaign: `/campaigns/${parsedPayload.campaignId || 'id'}`,
                getCampaignsByBusiness: `/campaigns/business/${parsedPayload.businessId || 'id'}`,

                // Other endpoints
                sendSms: '/Commo/sms/send',
                sendEmail: '/Commo/email/send',
                uploadMedia: '/media/upload',
                getMediaById: `/media/${parsedPayload.mediaId || 'id'}`,
                deleteMedia: `/media/${parsedPayload.mediaId || 'id'}`
            };

            const apiPath = apiPathMap[apiEndpoint] || `/${apiEndpoint}`;
            const url = `${baseUrl}${apiPath}`;

            // Get HTTP method based on endpointInfo or fallback to POST
            const method = endpointInfo?.method || 'POST';

            // Get auth token
            const token = tokenInfo.hasToken ? tokenInfo.tokenData : null;

            // Prepare fetch options
            const fetchOptions = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Add auth header if token exists
            if (token) {
                fetchOptions.headers['Authorization'] = `Bearer ${tokenInfo.authToken}`;
            }

            // Add body for non-GET requests
            if (method !== 'GET') {
                fetchOptions.body = jsonPayload;
            }

            // Log request
            console.log(`[DEBUG] Sending ${method} request to ${url}`, parsedPayload);

            // Make the request
            const mockResponse = {
                status: 200,
                statusText: 'OK',
                data: {
                    success: true,
                    message: `This is a mock response for ${apiEndpoint}. In production, the actual API would be called.`,
                    timestamp: new Date().toISOString(),
                    requestDetails: {
                        endpoint: apiEndpoint,
                        method,
                        url,
                        payload: parsedPayload
                    }
                }
            };

            // Set response (in production this would be the actual API response)
            setApiResponse(mockResponse);
            setTestStatus({ success: true, message: `API request to ${apiEndpoint} completed successfully.` });

            // Track successful API test
            analytics.trackEvent('debug_api_test_success', {
                endpoint: apiEndpoint,
                method,
                category: endpointInfo?.category || 'Unknown',
                response_status: 200
            });
        } catch (error) {
            console.error('API test error:', error);

            setApiResponse({
                status: error.status || 500,
                statusText: error.statusText || 'Error',
                data: {
                    success: false,
                    message: error.data?.message || error.message || 'Unknown error',
                    error: error.toString()
                }
            });

            setTestStatus({
                success: false,
                message: `API request failed: ${error.data?.message || error.message || 'Unknown error'}`
            });

            // Track failed API test
            analytics.trackEvent('debug_api_test_failure', {
                endpoint: apiEndpoint,
                error_message: error.data?.message || error.message || 'Unknown error',
                error_status: error.status || 500
            });
        } finally {
            setRequestInProgress(false);
        }
    };

    return (
        <Box sx={{ p: 2, fontFamily: 'monospace', color: theme.palette.text.primary }}>
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
                        color: theme.palette.text.primary,
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
                    }}
                >
                    <MenuItem value="login">Login Test</MenuItem>
                    <MenuItem value="forgotPassword">Forgot Password</MenuItem>
                    <MenuItem value="changePassword">Change Password</MenuItem>
                    <MenuItem value="api">API Tester</MenuItem>
                    <MenuItem value="analytics">Analytics Test</MenuItem>
                </Select>
            </FormControl>

            {/* Login Test */}
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
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
                        }}
                        onClick={handleTestLogin}
                        disabled={!testCredentials.email || !testCredentials.password}
                    >
                        EXECUTE_LOGIN()
                    </Button>
                </>
            )}

            {/* Forgot Password Test */}
            {testType === 'forgotPassword' && (
                <>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ FORGOT_PASSWORD_TEST
                    </Typography>

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
                                color: theme.palette.text.primary,
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
                                        >
                                            {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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

            {/* Change Password Test */}
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
                                >
                                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
                                >
                                    {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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

            {/* API Tester */}
            {testType === 'api' && (
                <>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                        $ API_TEST
                    </Typography>

                    <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                        <InputLabel sx={{ color: theme.palette.text.secondary }}>API Endpoint</InputLabel>
                        <Select
                            value={apiEndpoint}
                            onChange={handleApiEndpointChange}
                            label="API Endpoint"
                            sx={{
                                color: theme.palette.text.primary,
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
                            }}
                        >
                            <MenuItem disabled>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Auth Endpoints</Typography>
                            </MenuItem>
                            {allApis.filter(api => api.category === 'Auth').map(api => (
                                <MenuItem key={api.value} value={api.value}>
                                    {api.label} ({api.method})
                                </MenuItem>
                            ))}

                            <MenuItem disabled>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Business Endpoints</Typography>
                            </MenuItem>
                            {allApis.filter(api => api.category === 'Business').map(api => (
                                <MenuItem key={api.value} value={api.value}>
                                    {api.label} ({api.method})
                                </MenuItem>
                            ))}

                            <MenuItem disabled>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Campaign Endpoints</Typography>
                            </MenuItem>
                            {allApis.filter(api => api.category === 'Campaign').map(api => (
                                <MenuItem key={api.value} value={api.value}>
                                    {api.label} ({api.method})
                                </MenuItem>
                            ))}

                            <MenuItem disabled>
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Other Endpoints</Typography>
                            </MenuItem>
                            {allApis.filter(api => !['Auth', 'Business', 'Campaign'].includes(api.category)).map(api => (
                                <MenuItem key={api.value} value={api.value}>
                                    {api.label} ({api.method})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
                        Request Payload (JSON):
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        value={jsonPayload}
                        onChange={(e) => {
                            setJsonPayload(e.target.value);
                            try {
                                JSON.parse(e.target.value);
                                setPayloadValid(true);
                            } catch (err) {
                                setPayloadValid(false);
                            }
                        }}
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: payloadValid ? theme.palette.divider : theme.palette.error.main,
                                },
                                '&:hover fieldset': {
                                    borderColor: payloadValid ? theme.palette.primary.main : theme.palette.error.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: payloadValid ? theme.palette.primary.main : theme.palette.error.main,
                                },
                            },
                            '& .MuiInputBase-input': {
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                            }
                        }}
                    />

                    {!payloadValid && (
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                color: theme.palette.error.main,
                                fontFamily: 'monospace',
                                mt: 0.5
                            }}
                        >
                            [ERROR] Invalid JSON format
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<CodeIcon />}
                        sx={{
                            mt: 2,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                            },
                            fontFamily: 'monospace',
                        }}
                        onClick={handleTestApi}
                        disabled={!payloadValid || requestInProgress}
                    >
                        {requestInProgress ? <CircularProgress size={24} color="inherit" /> : 'EXECUTE_API_REQUEST()'}
                    </Button>

                    {/* API Response Display */}
                    {apiResponse && (
                        <Accordion
                            sx={{
                                mt: 2,
                                bgcolor: apiResponse.status >= 400
                                    ? `${theme.palette.error.main}10`
                                    : `${theme.palette.success.main}10`,
                                '&:before': {
                                    display: 'none',
                                }
                            }}
                            defaultExpanded
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    '& .MuiAccordionSummary-content': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }
                                }}
                            >
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                    Response {apiResponse.status} {apiResponse.statusText}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: apiResponse.status >= 400 ? theme.palette.error.main : theme.palette.success.main,
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    {apiResponse.status >= 400 ? 'Error' : 'Success'}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
                                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: theme.palette.text.secondary, fontFamily: 'monospace' }}>
                                    // Response Data:
                                </Typography>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
                                        borderRadius: 1,
                                        maxHeight: 200,
                                        overflow: 'auto'
                                    }}
                                >
                  <pre
                      style={{
                          margin: 0,
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                          color: theme.palette.text.primary
                      }}
                  >
                    {JSON.stringify(apiResponse.data, null, 2)}
                  </pre>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </>
            )}

            {/* Analytics Test */}
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
                            // Navigate to analytics tab
                            analytics.trackEvent('debug_view_analytics', {
                                from: 'test_tab'
                            });
                        }}
                    >
                        VIEW_ANALYTICS_TAB()
                    </Button>
                </>
            )}

            {/* Status Message */}
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
                        <MatrixText theme={theme}>{`>> ${testStatus.message}`}</MatrixText>
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default TestPanel;