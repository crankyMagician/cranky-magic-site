// src/features/api/extendedApi.js
import baseApi from './baseApi';
import { movesEndpoints } from './controllers/movesController';
import {munchiesEndpoints} from "./controllers/munchiesController";
import {abilitiesEndpoints} from "./controllers/abilitiesController";
import {craftingRecipesEndpoints} from "./controllers/craftingRecipeController";
import {itemsEndpoints} from "./controllers/itemsController";

const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        ...movesEndpoints(builder), // Inject the moves endpoints
        ...munchiesEndpoints(builder), // Inject the munchies endpoints
        ...abilitiesEndpoints(builder), // Inject the abilities endpoints
        ...craftingRecipesEndpoints(builder), // Inject the crafting recipes endpoints
        ...itemsEndpoints(builder), // Inject the items endpoints
    }),
    overrideExisting: false,
});


export default extendedApi;