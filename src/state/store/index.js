// src/state/store/store.jsx
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../reducers/rootReducer';
import { extendedApi } from "../../api/extendedApi";

const store = configureStore({
    reducer: rootReducer,
    // Manages the RTK Query Cache
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            extendedApi.middleware,
        )
});

export default store;
