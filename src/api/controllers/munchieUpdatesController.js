export const munchieUpdatesEndpoints = (builder) => ({
    updateBaseInfo: builder.mutation({
        query: ({ id, ...data }) => ({
            url: `/munchie-updates/update/${id}`,
            method: 'PUT',
            data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Munchies', id }],
    }),

    updateAbilities: builder.mutation({
        query: ({ id, ...data }) => ({
            url: `/munchie-updates/${id}/abilities`,
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
            url: `/munchie-updates/${id}/evolution`,
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
            url: `/munchie-updates/${munchieId}/evolution/${targetId}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, { munchieId }) => [
            { type: 'Munchies', id: munchieId },
            'Evolution'
        ],
    }),

    createMunchie: builder.mutation({
        query: (data) => ({
            url: '/munchie-updates/create',
            method: 'POST',
            data,
        }),
        invalidatesTags: ['Munchies'],
    }),
    updateMunchieType: builder.mutation({
        query: ({ munchieId, typeId }) => ({
            url: `/munchie-updates/${munchieId}/type`,
            method: 'PUT',
            data: { type_id: typeId },
        }),
        invalidatesTags: (result, error, { munchieId }) => [
            { type: 'Munchies', id: munchieId },
            'MunchieTypes',
        ],
    }),

});