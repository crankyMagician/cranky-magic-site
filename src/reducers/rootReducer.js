import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import themeReducer from './themeSlice';
import languageReducer from './languageSlice';
import preferenceReducer from './preferenceSlice';
import { apiSlice } from '../api/apiSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
    language: languageReducer,
    preferences: preferenceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export default rootReducer;