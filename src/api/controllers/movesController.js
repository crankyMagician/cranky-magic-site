// src/features/api/controllers/movesEndpoints.js
// movesController.js
export const movesEndpoints = (builder) => ({
    getAllMoves: builder.query({
        query: () => ({
            url: '/moves',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['Moves'],
    }),

    getMoveById: builder.query({
        query: (id) => ({
            url: `/moves/get-move/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'Moves', id }],
    }),

    createMove: builder.mutation({
        query: (moveData) => ({
            url: '/moves/create-move',
            method: 'POST',
            data: moveData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['Moves'],
    }),

    updateMove: builder.mutation({
        query: ({ id, ...moveData }) => ({
            url: `/moves/edit-move/${id}`,
            method: 'PUT',
            data: moveData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: (result, error, { id }) => [{ type: 'Moves', id }],
    }),
});





