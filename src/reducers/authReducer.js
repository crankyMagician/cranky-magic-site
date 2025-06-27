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

// Helper function to check if two values are deeply equal
const isDeepEqual = (val1, val2) => {
    if (val1 === val2) return true;
    if (val1 == null || val2 == null) return false;
    if (typeof val1 !== 'object' || typeof val2 !== 'object') return false;

    const keys1 = Object.keys(val1);
    const keys2 = Object.keys(val2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) return false;
        if (!isDeepEqual(val1[key], val2[key])) return false;
    }

    return true;
};

// Helper function to check if arrays are equal
const areArraysEqual = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (!isDeepEqual(arr1[i], arr2[i])) return false;
    }

    return true;
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, { payload }) => {
            // Only update if values actually changed
            const hasChanges =
                !isDeepEqual(state.user, payload.user) ||
                state.token !== payload.token ||
                !areArraysEqual(state.roles, payload.roles || []) ||
                !areArraysEqual(state.businesses, payload.businesses || []) ||
                !isDeepEqual(state.activeBusiness, payload.activeBusiness);

            if (hasChanges) {
                state.user = payload.user;
                state.token = payload.token;
                state.roles = payload.roles || [];
                state.businesses = payload.businesses || [];
                state.activeBusiness = payload.activeBusiness || null;
                state.isAuthenticated = true;
                state.error = null;
            }
        },
        setLoading: (state, { payload }) => {
            if (state.loading !== payload) {
                state.loading = payload;
            }
        },
        setError: (state, { payload }) => {
            if (state.error !== payload || state.loading !== false) {
                state.error = payload;
                state.loading = false;
            }
        },
        logout: (state) => {
            // Reset state to initial values
            Object.assign(state, initialState);
        },
        setAuthentication: (state, { payload }) => {
            // Check each field for changes before updating
            const updates = {};
            let hasChanges = false;

            // Check isAuthenticated
            if (payload.isAuthenticated !== undefined && state.isAuthenticated !== payload.isAuthenticated) {
                updates.isAuthenticated = payload.isAuthenticated;
                hasChanges = true;
            }

            // Check user
            if (payload.user !== undefined && !isDeepEqual(state.user, payload.user)) {
                updates.user = payload.user;
                hasChanges = true;
            }

            // Check token
            if (payload.token !== undefined && state.token !== payload.token) {
                updates.token = payload.token;
                hasChanges = true;
            }

            // Check roles
            if (payload.roles !== undefined && !areArraysEqual(state.roles, payload.roles)) {
                updates.roles = payload.roles;
                hasChanges = true;
            }

            // Check businesses
            if (payload.businesses !== undefined && !areArraysEqual(state.businesses, payload.businesses)) {
                updates.businesses = payload.businesses;
                hasChanges = true;
            }

            // Check activeBusiness
            if (payload.activeBusiness !== undefined && !isDeepEqual(state.activeBusiness, payload.activeBusiness)) {
                updates.activeBusiness = payload.activeBusiness;
                hasChanges = true;
            }

            // Only apply updates if there are actual changes
            if (hasChanges) {
                Object.assign(state, updates);
            }
        },
        clearAuthentication: (state) => {
            // Reset state to initial values
            Object.assign(state, initialState);
        },
        updateUser: (state, { payload }) => {
            // Update user data only if it changed
            if (state.user && !isDeepEqual(state.user, payload)) {
                state.user = { ...state.user, ...payload };
            }
        },
        updateRoles: (state, { payload }) => {
            // Update roles only if they changed
            if (!areArraysEqual(state.roles, payload)) {
                state.roles = payload;
            }
        },
        updateBusinesses: (state, { payload }) => {
            // Update businesses only if they changed
            if (!areArraysEqual(state.businesses, payload)) {
                state.businesses = payload;
            }
        },
        setActiveBusiness: (state, { payload }) => {
            // Update active business only if it changed
            if (!isDeepEqual(state.activeBusiness, payload)) {
                state.activeBusiness = payload;

                // Also update in businesses array if present
                if (payload && state.businesses.length > 0) {
                    const index = state.businesses.findIndex(b => b.id === payload.id);
                    if (index !== -1 && !isDeepEqual(state.businesses[index], payload)) {
                        state.businesses[index] = payload;
                    }
                }
            }
        }
    },
});

export const {
    setCredentials,
    setLoading,
    setError,
    logout,
    setAuthentication,
    clearAuthentication,
    updateUser,
    updateRoles,
    updateBusinesses,
    setActiveBusiness
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

// Complex selectors
export const selectUserById = (state, userId) => {
    return state.auth.user?.id === userId ? state.auth.user : null;
};

export const selectBusinessById = (state, businessId) => {
    return state.auth.businesses.find(b => b.id === businessId) || null;
};

export const selectHasRole = (state, roleName) => {
    return state.auth.roles.some(role =>
        (typeof role === 'string' ? role : role.name) === roleName
    );
};

export const selectHasAnyRole = (state, roleNames) => {
    return roleNames.some(roleName => selectHasRole(state, roleName));
};

export const selectHasAllRoles = (state, roleNames) => {
    return roleNames.every(roleName => selectHasRole(state, roleName));
};

export const selectIsBusinessOwner = (state, businessId) => {
    const business = selectBusinessById(state, businessId);
    return business?.ownerId === state.auth.user?.id;
};

export const selectIsActiveBusinessOwner = (state) => {
    return state.auth.activeBusiness?.ownerId === state.auth.user?.id;
};