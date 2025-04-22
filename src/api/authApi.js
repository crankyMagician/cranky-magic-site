// authApi.js
import baseApi, { getApiUrl } from './baseApi';
import { setCredentials, logout } from '../reducers/authReducer';
import AuthTokenService from '../services/AuthTokenService';

// Auth API endpoints
export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login endpoint
        login: builder.mutation({
            query: (credentials) => ({
                url: getApiUrl('/auth/login', 'auth'),
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    // Save token in localStorage via AuthTokenService
                    if (data.token) {
                        AuthTokenService.setAuthInfo({
                            isAuthenticated: true,
                            user: data.user,
                            authToken: data.token,
                            roles: data.roles || [],
                            businesses: data.businesses || [],
                            activeBusiness: data.activeBusiness || null
                        });
                        // Update Redux state
                        dispatch(setCredentials(data));
                    }
                } catch (error) {
                    // Error handling logic here
                    console.error('Login error:', error);
                }
            },
            invalidatesTags: ['Auth', 'User'],
        }),

        // Register endpoint
        register: builder.mutation({
            query: (userData) => ({
                url: getApiUrl('/auth/register', 'auth'),
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Confirm signup endpoint
        confirmSignup: builder.mutation({
            query: (confirmationData) => ({
                url: getApiUrl('/auth/confirm-signup', 'auth'),
                method: 'POST',
                body: confirmationData,
            }),
        }),

        // Confirm phone endpoint
        confirmPhone: builder.mutation({
            query: (confirmationData) => ({
                url: getApiUrl('/auth/confirm-phone', 'auth'),
                method: 'POST',
                body: confirmationData,
            }),
        }),

        // Forgot password endpoint
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/auth/forgot-password', 'auth'),
                method: 'POST',
                body: data,
            }),
        }),

        // Reset password endpoint
        resetPassword: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/auth/reset-password', 'auth'),
                method: 'POST',
                body: data,
            }),
            // Handle successful password reset with login
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    const { data: responseData } = await queryFulfilled;

                    // If response includes a token, log in the user automatically
                    if (responseData.token) {
                        AuthTokenService.setAuthInfo({
                            isAuthenticated: true,
                            user: responseData.user,
                            authToken: responseData.token,
                            roles: responseData.roles || [],
                            businesses: responseData.businesses || [],
                            activeBusiness: responseData.activeBusiness || null
                        });
                        dispatch(setCredentials(responseData));
                    }
                } catch (error) {
                    console.error('Reset password error:', error);
                }
            },
        }),

        // Change password endpoint
        changePassword: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/auth/change-password', 'auth'),
                method: 'POST',
                body: data,
            }),
        }),

        // Logout endpoint
        logout: builder.mutation({
            query: () => ({
                url: getApiUrl('/auth/logout', 'auth'),
                method: 'POST',
            }),
            // Handle logout in Redux and clear localStorage
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    // Clear auth info regardless of API response
                    AuthTokenService.clearAuthInfo();
                    dispatch(logout());
                } catch (error) {
                    console.error('Logout error:', error);
                    AuthTokenService.clearAuthInfo();
                    dispatch(logout());
                }
            },
            invalidatesTags: ['Auth', 'User'],
        }),

        // Decode token endpoint (remains without /auth/ per spec)
        decodeToken: builder.mutation({
            query: (token) => ({
                url: getApiUrl('/decode-token', 'auth'),
                method: 'POST',
                body: { token },
            }),
        }),

        // Business signup endpoint
        businessSignup: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/auth/business-signup', 'auth'),
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Auth', 'Business'],
        }),

        // Resend confirmation endpoint
        resendConfirmation: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/auth/resend-confirmation', 'auth'),
                method: 'POST',
                body: data,
            }),
        }),

        // Resend phone confirmation endpoint
        resendPhoneConfirmation: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/auth/resend-phone-confirmation', 'auth'),
                method: 'POST',
                body: data,
            }),
        }),

        // Update MFA preference endpoint
        updateMfaPreference: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/auth/update-mfa-preference', 'auth'),
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
    overrideExisting: false,
});

// Export the generated hooks
export const {
    useLoginMutation,
    useRegisterMutation,
    useConfirmSignupMutation,
    useConfirmPhoneMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useLogoutMutation,
    useDecodeTokenMutation,
    useBusinessSignupMutation,
    useResendConfirmationMutation,
    useResendPhoneConfirmationMutation,
    useUpdateMfaPreferenceMutation,
} = authApi;