import { createSlice } from '@reduxjs/toolkit';
import AuthTokenService from '../services/AuthTokenService';

const initialState = {
    user: null,
    token: null,
    roles: [],
    businesses: [],
    activeBusiness: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            state.user = payload.user;
            state.token = payload.token;
            state.roles = payload.roles || [];
            state.businesses = payload.businesses || [];
            state.activeBusiness = payload.activeBusiness || null;
            state.isAuthenticated = true;
            state.error = null;
        },
        setLoading: (state, { payload }) => {
            state.loading = payload;
        },
        setError: (state, { payload }) => {
            state.error = payload;
            state.loading = false;
        },
        logout: (state) => {
            // Reset state
            state.user = null;
            state.token = null;
            state.roles = [];
            state.businesses = [];
            state.activeBusiness = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setAuthentication: (state, { payload }) => {
            state.isAuthenticated = payload.isAuthenticated;
            state.user = payload.user || state.user;
            state.token = payload.token || state.token;
            state.roles = payload.roles || state.roles;
            state.businesses = payload.businesses || state.businesses;
            state.activeBusiness = payload.activeBusiness || state.activeBusiness;
        },
        clearAuthentication: (state) => {
            // Reset state
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.roles = [];
            state.businesses = [];
            state.activeBusiness = null;
        }
    },
});

export const {
    setCredentials,
    setLoading,
    setError,
    logout,
    setAuthentication,
    clearAuthentication
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRoles = (state) => state.auth.roles;
export const selectUserBusinesses = (state) => state.auth.businesses;
export const selectActiveBusiness = (state) => state.auth.activeBusiness;