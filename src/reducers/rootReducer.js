import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import themeReducer from './themeSlice';
import languageReducer from './languageSlice';
import preferenceReducer from './preferenceSlice';
import {apiSlice} from "../api/apiSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
    language: languageReducer,
    preferences: preferenceReducer, // Add the preference reducer here
    api: apiSlice.reducer, // Add this line to include the RTK Query reducer
    // other reducers go here
});
export default rootReducer;
