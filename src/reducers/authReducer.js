// src/reducers/authReducer.js

import { createSlice } from '@reduxjs/toolkit';
import { logWarning } from '../utilities/Logger'; 

const initialState = {
    user: null,
    token: null,
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
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setAuthentication: (state, { payload }) => {
            state.isAuthenticated = payload;
        },
        clearAuthentication: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
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

