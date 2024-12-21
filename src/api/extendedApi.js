// src/features/api/extendedApi.js

import baseApi from './baseApi';
import { movesEndpoints } from './controllers/movesController';
import {munchiesEndpoints} from "./controllers/munchiesController";
import {abilitiesEndpoints} from "./controllers/abilitiesController";
const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        ...movesEndpoints(builder), // Inject the moves endpoints
        ...munchiesEndpoints(builder), // Inject the munchies endpoints
        ...abilitiesEndpoints(builder), // Inject the abilities endpoints
    }),
    overrideExisting: false,
});


export default extendedApi;