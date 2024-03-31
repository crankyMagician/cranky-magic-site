// src/reducers/authReducer.js

import { createSlice } from '@reduxjs/toolkit';
import { logWarning } from '../utilities/Logger'; 

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthentication(state, action) {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.user = action.payload.user;
            state.token = action.payload.token;
            // Logging a shallow copy of the state for readability
            console.log('State after setAuthentication:', {...state});
            logWarning('authReducer: User authentication state changed', 'orange');
        },

        clearAuthentication(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;

            logWarning('authReducer: User authentication cleared', 'orange');
        },
    },
});

export const { setAuthentication, clearAuthentication } = authSlice.actions;
export default authSlice.reducer;

