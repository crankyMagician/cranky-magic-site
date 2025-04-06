import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import themeReducer from './themeSlice';
import languageReducer from './languageSlice';
import preferenceReducer from './preferenceSlice';
import { extendedApi } from "../api/extendedApi";

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
    language: languageReducer,
    preferences: preferenceReducer,
    [extendedApi.reducerPath]: extendedApi.reducer,
    // other reducers go here
});

export default rootReducer;
