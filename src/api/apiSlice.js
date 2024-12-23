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
        'StatusConditions',
        'MunchiePhotos',
        'ItemPhotos',
        'LearnableMoves',
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

    //learnableMoves endpoints
    useGetLearnableMovesByMunchieNameQuery,
    useAddLearnableMovesMutation,
    useRemoveLearnableMovesMutation,

    // Munchie Updates Controller endpoints
    useUpdateBaseInfoMutation,
    useUpdateAbilitiesMutation,
    useUpdateEvolutionChainMutation,
    useRemoveEvolutionMutation,
    useCreateMunchieMutation,


    // Effects endpoints
    useGetAllEffectsQuery,
    useGetEffectByIdQuery,
    useCreateEffectMutation,
    useUpdateEffectMutation,

    // Add to the export destructuring:
    useGetAllItemPhotosQuery,
    useGetItemPhotoByIdQuery,
    useGetItemPhotoByNameQuery,
    useUploadItemPhotoMutation,
    useGetPrimaryPhotoByItemNameQuery,
    useGetPrimaryPhotoByItemIdQuery,

    // Move Effects endpoints
    useAssignEffectMutation,
    useCreateMoveEffectMutation,
    useRemoveEffectMutation,
    useGetMoveEffectsQuery,

    //munchie photos endpoints
    useGetAllMunchiePhotosQuery,
    useGetMunchiePhotoByIdQuery,
    useGetMunchiePhotoByNameQuery,
    useUploadMunchiePhotoMutation,
    useGetPrimaryPhotoByMunchieNameQuery,
    useGetPrimaryPhotoByMunchieIdQuery,

    // Munchie Types endpoints
    useGetAllTypesQuery,


    // Status Conditions endpoints
    useGetAllStatusConditionsQuery,
    useGetStatusConditionByIdQuery,
    useCreateStatusConditionMutation,
    useUpdateStatusConditionMutation,

    // Munchies endpoints
    useGetAllMunchiesQuery,
    useGetMunchieAllInfoByIdQuery,
    useGetMunchieByNameQuery,
    useGetLearnableMovesByMunchieQuery,
    useGetMunchieAllInfoQuery,
    useGetPaginatedMunchiesQuery,
    useGetAllMunchieIdsQuery,

    //munchie stats
    useUpsertStatsMutation,

    // Crafting Recipes endpoints
    useGetAllRecipesQuery,
    useGetRecipeByIdQuery,
    useCreateRecipeMutation,
    useEditRecipeMutation,
} = apiSlice;