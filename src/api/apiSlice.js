import extendedApi from './extendedApi';

export const apiSlice = extendedApi.enhanceEndpoints({
    addTagTypes: ['Moves', 'Munchies'], // Add the new tag types for caching
    endpoints: () => ({}), // Extend with custom endpoints if needed
});

// Export the hooks for the new API
export const {
    useGetAllMovesQuery, // Hook for getting all moves
    useGetAllMunchiesQuery, // Hook for getting all munchies
    useGetMunchieByNameQuery, // Hook for getting a munchie by name
    useGetLearnableMovesByMunchieQuery, // Hook for getting learnable moves by munchie name
    useGetMunchieAllInfoQuery, // Hook for getting all munchie info
} = apiSlice;
