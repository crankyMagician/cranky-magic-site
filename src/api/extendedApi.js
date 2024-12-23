// src/features/api/extendedApi.js
import baseApi from './baseApi';
import { movesEndpoints } from './controllers/movesController';
import {munchiesEndpoints} from "./controllers/munchiesController";
import {abilitiesEndpoints} from "./controllers/abilitiesController";
import {craftingRecipesEndpoints} from "./controllers/craftingRecipeController";
import {itemsEndpoints} from "./controllers/itemsController";
import {moveEffectsEndpoints} from "./controllers/moveEffectsController";
import {munchieTypesEndpoints} from "./controllers/munchieTypesController";
import {statusConditionsEndpoints} from "./controllers/statusCondtionsController";
import {effectsEndpoints} from "./controllers/effectsController";
import {munchiePhotosEndpoints} from "./controllers/munchiePhotosController";
import {itemPhotosEndpoints} from "./controllers/itemPhotosController";
import {munchieUpdatesEndpoints} from "./controllers/munchieUpdatesController";
import {learnableMovesEndpoints} from "./controllers/learnableMovesController";
import {munchieStatsEndpoints} from "./controllers/munchieStatsController";
const extendedApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        ...movesEndpoints(builder), // Inject the moves endpoints
        ...munchiesEndpoints(builder), // Inject the munchies endpoints
        ...abilitiesEndpoints(builder), // Inject the abilities endpoints
        ...craftingRecipesEndpoints(builder), // Inject the crafting recipes endpoints
        ...itemsEndpoints(builder), // Inject the items endpoints
        ...moveEffectsEndpoints(builder), // Inject the move effects endpoints
        ...munchieTypesEndpoints(builder), // Inject the munchie types endpoints
        ...statusConditionsEndpoints(builder), // Inject the status conditions endpoints
        ...effectsEndpoints(builder), // Inject the effects endpoints
        ...munchiePhotosEndpoints(builder), // Inject the munchie photos endpoints
        ...itemPhotosEndpoints(builder), // Inject the items photos endpoints
        ...munchieUpdatesEndpoints(builder), // Inject the munchie updates endpoints
        ...learnableMovesEndpoints(builder), // Inject the learnable moves endpoints
        ...munchieStatsEndpoints(builder), // Inject the munchie stats endpoints
    }),
    overrideExisting: false,
});


export default extendedApi;