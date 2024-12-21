// src/features/api/extendedApi.js

import baseApi from './baseApi';
import { movesEndpoints } from './controllers/movesController';

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        ...movesEndpoints(builder), // Inject the moves endpoints
    }),
    overrideExisting: false,
});


export default extendedApi;