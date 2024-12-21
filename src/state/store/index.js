// src/state/store/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../reducers/rootReducer';
import {apiSlice} from "../../api/apiSlice";



const store = configureStore({
    reducer: rootReducer,
    // Manages the RTK Query Cache
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            apiSlice.middleware,
        )
});

export default store;
