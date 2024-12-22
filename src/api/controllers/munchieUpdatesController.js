export const munchieUpdatesEndpoints = (builder) => ({
    updateBaseInfo: builder.mutation({
        query: ({ id, ...data }) => ({
            url: `/munchie/update/${id}`,
            method: 'PUT',
            data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Munchies', id }],
    }),

    updateAbilities: builder.mutation({
        query: ({ id, ...data }) => ({
            url: `/munchie/${id}/abilities`,
            method: 'POST',
            data,
        }),
        invalidatesTags: (result, error, { id }) => [
            { type: 'Munchies', id },
            'MunchieAbilities'
        ],
    }),

    updateEvolutionChain: builder.mutation({
        query: ({ id, ...data }) => ({
            url: `/munchie/${id}/evolution`,
            method: 'PUT',
            data,
        }),
        invalidatesTags: (result, error, { id }) => [
            { type: 'Munchies', id },
            'Evolution'
        ],
    }),

    removeEvolution: builder.mutation({
        query: ({ munchieId, targetId }) => ({
            url: `/munchie/${munchieId}/evolution/${targetId}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, { munchieId }) => [
            { type: 'Munchies', id: munchieId },
            'Evolution'
        ],
    }),

    createMunchie: builder.mutation({
        query: (data) => ({
            url: '/munchie/create',
            method: 'POST',
            data,
        }),
        invalidatesTags: ['Munchies'],
    }),
});