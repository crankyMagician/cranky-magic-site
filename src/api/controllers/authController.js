import { api } from '../api';

export const authEndpoints = (builder) => ({
    login: builder.mutation({
        query: (credentials) => ({
            url: '/auth/login',
            method: 'POST',
            data: credentials,
        }),
    }),

    register: builder.mutation({
        query: (userData) => ({
            url: '/auth/register',
            method: 'POST',
            data: userData,
        }),
    }),

    confirmSignup: builder.mutation({
        query: (confirmationData) => ({
            url: '/auth/confirm-signup',
            method: 'POST',
            data: confirmationData,
        }),
    }),

    forgotPassword: builder.mutation({
        query: (data) => ({
            url: '/auth/forgot-password',
            method: 'POST',
            data: data,
        }),
    }),

    resetPassword: builder.mutation({
        query: (data) => ({
            url: '/auth/reset-password',
            method: 'POST',
            data: data,
        }),
    }),

    changePassword: builder.mutation({
        query: (data) => ({
            url: '/auth/change-password',
            method: 'POST',
            data: data,
        }),
    }),

    logout: builder.mutation({
        query: (token) => ({
            url: '/auth/logout',
            method: 'POST',
            data: { token },
        }),
    }),

    decodeToken: builder.mutation({
        query: (token) => ({
            url: '/decode-token',
            method: 'POST',
            data: { token },
        }),
    }),

    businessSignup: builder.mutation({
        query: (data) => ({
            url: '/auth/business-signup',
            method: 'POST',
            data: data,
        }),
    }),

    resendConfirmation: builder.mutation({
        query: (data) => ({
            url: '/auth/resend-confirmation',
            method: 'POST',
            data,
        }),
    }),
});

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
}; 