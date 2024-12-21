import extendedApi from './extendedApi';

export const apiSlice = extendedApi.enhanceEndpoints({
    addTagTypes: ['Moves'], // Add the new tag type for caching
    endpoints: () => ({}), // Extend with custom endpoints if needed
});

// Export the hooks for the new API
export const {
    useGetAllMovesQuery, // Example hook for getting all moves from the movesController
} = apiSlice;
