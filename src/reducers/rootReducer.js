import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import themeReducer from './themeSlice';
import languageReducer from './languageSlice';
import preferenceReducer from './preferenceSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
    language: languageReducer,
    preferences: preferenceReducer, // Add the preference reducer here
    // other reducers go here
});
export default rootReducer;
