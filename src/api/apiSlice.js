import extendedApi from './extendedApi';

export const apiSlice = extendedApi.enhanceEndpoints({
    addTagTypes: [
        'Moves',
        'Munchies',
        'CraftingRecipes',
        'Items',
        'Abilities',
        'Effects',
        'MoveEffects',
        'MunchieTypes',
        'StatusConditions'
    ],
    endpoints: () => ({}),
});

export const {
    // Ability endpoints
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
    useGetMoveByIdQuery,
    useCreateMoveMutation,
    useUpdateMoveMutation,

    // Effects endpoints
    useGetAllEffectsQuery,
    useGetEffectByIdQuery,
    useCreateEffectMutation,
    useUpdateEffectMutation,

    // Move Effects endpoints
    useAssignEffectMutation,
    useCreateMoveEffectMutation,
    useRemoveEffectMutation,
    useGetMoveEffectsQuery,

    // Munchie Types endpoints
    useGetAllTypesQuery,

    // Status Conditions endpoints
    useGetAllStatusConditionsQuery,
    useGetStatusConditionByIdQuery,
    useCreateStatusConditionMutation,
    useUpdateStatusConditionMutation,

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