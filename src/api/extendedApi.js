// src/features/api/extendedApi.js

import baseApi from './baseApi';
import { movesEndpoints } from './controllers/movesController';
import {munchiesEndpoints} from "./controllers/munchiesController";

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        ...movesEndpoints(builder), // Inject the moves endpoints
        ...munchiesEndpoints(builder), // Inject the munchies endpoints
    }),
    overrideExisting: false,
});


export default extendedApi;