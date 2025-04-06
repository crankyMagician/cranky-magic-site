// src/features/api/extendedApi.js
import baseApi from './baseApi';
import { authEndpoints } from "./controllers/authController";
import { businessEndpoints } from "./controllers/businessController";

export const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        ...authEndpoints(builder),
        ...businessEndpoints(builder),
    }),
    overrideExisting: false,
});