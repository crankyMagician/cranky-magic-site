import extendedApi from './extendedApi';

export const apiSlice = extendedApi.enhanceEndpoints({
    addTagTypes: ['Moves', 'Munchies', 'CraftingRecipes', 'Items', 'Abilities'],
    endpoints: () => ({}),
});

export const {
    //ability endpoints
    useGetAllAbilitiesQuery,
    useGetAbilityByIdQuery,
    useCreateAbilityMutation,
    useUpdateAbilityMutation,
    
    // Items endpoints
    useGetAllItemsQuery,
    useGetItemByIdQuery,
    useCreateItemMutation,
    useUpdateItemMutation,


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