export const munchieStatsEndpoints = (builder) => ({
    getMunchieStats: builder.query({
        query: (munchieId) => ({
            url: `/munchie-stats/${munchieId}/stats`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, munchieId) => [{ type: 'MunchieStats', id: munchieId }],
    }),

    upsertMunchieStats: builder.mutation({
        query: ({ munchieId, stats }) => ({
            url: `/munchie-stats/${munchieId}/stats`,
            method: 'POST',
            data: { stats },
        }),
        invalidatesTags: (result, error, { munchieId }) => [{ type: 'MunchieStats', id: munchieId }],
    }),
});
