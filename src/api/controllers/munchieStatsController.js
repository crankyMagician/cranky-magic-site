export const munchieStatsEndpoints = (builder) => ({
    upsertStats: builder.mutation({
        query: ({ munchie_id, stats }) => ({
            url: `/munchie-stats/${munchie_id}/stats`,
            method: 'POST',
            data: { stats }
        }),
        invalidatesTags: (result, error, { munchie_id }) => [{ type: 'Munchies', id: munchie_id }]
    }),
    getMunchieStats: builder.query({
        query: (munchie_id) => `/munchie-stats/${munchie_id}/stats`,
        providesTags: (result, error, munchie_id) => [{ type: 'Munchies', id: munchie_id }]
    })
});