// src/features/api/controllers/movesEndpoints.js

export const movesEndpoints = (builder) => ({
    getAllMoves: builder.query({
        query: () => ({
            url: '/moves',
            method: 'GET',
        }),
        transformResponse: (response) => response, // Transform the response if needed
        providesTags: ['Moves'], // Cache-tagging (optional, improves cache handling)
    }),
});