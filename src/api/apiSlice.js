import extendedApi from './extendedApi';

export const apiSlice = extendedApi.enhanceEndpoints({
    addTagTypes: ['Moves', 'Munchies', 'Abilities'],
    endpoints: () => ({}),
});

export const {
    useGetAllMovesQuery,
    useGetAllMunchiesQuery,
    useGetMunchieByNameQuery,
    useGetLearnableMovesByMunchieQuery,
    useGetMunchieAllInfoQuery,
    useGetAllAbilitiesQuery,
    useGetAbilityByIdQuery,
    useCreateAbilityMutation,
    useUpdateAbilityMutation,
} = apiSlice;