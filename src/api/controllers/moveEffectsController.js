// moveEffectsController.js
export const moveEffectsEndpoints = (builder) => ({
    assignEffect: builder.mutation({
        query: (data) => ({
            url: '/move-effects/assign-effect',
            method: 'POST',
            data: data,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['MoveEffects', 'Moves'],
    }),

    removeEffect: builder.mutation({
        query: ({ moveId, effectId }) => ({
            url: `/move-effects/remove-effect/${moveId}/${effectId}`,
            method: 'DELETE',
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['MoveEffects', 'Moves'],
    }),

    getMoveEffects: builder.query({
        query: (moveId) => ({
            url: `/move-effects/move/${moveId}/effects`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, moveId) => [{ type: 'MoveEffects', id: moveId }],
    }),
});