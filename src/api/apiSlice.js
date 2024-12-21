import extendedApi from './extendedApi';

export const apiSlice = extendedApi.enhanceEndpoints({
    addTagTypes: ['Moves', 'Munchies', 'CraftingRecipes'],
    endpoints: () => ({}),
});

export const {
    //ability endpoints
    useGetAllAbilitiesQuery,
    useGetAbilityByIdQuery,
    useCreateAbilityMutation,
    useUpdateAbilityMutation,

    // Moves endpoints
    useGetAllMovesQuery,

    // Munchies endpoints
    useGetAllMunchiesQuery,
    useGetMunchieByNameQuery,
    useGetLearnableMovesByMunchieQuery,
    useGetMunchieAllInfoQuery,

    // Crafting Recipes endpoints
    useGetAllRecipesQuery,
    useGetRecipeByIdQuery,
    useCreateRecipeMutation,
    useEditRecipeMutation,


} = apiSlice;