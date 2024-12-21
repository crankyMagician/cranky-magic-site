export const munchiesEndpoints = (builder) => ({
    getAllMunchies: builder.query({
        query: () => ({
            url: '/munchies',
            method: 'GET',
        }),
        transformResponse: (response) => response, // Transform the response if needed
        providesTags: ['Munchies'], // Cache-tagging
    }),

    getMunchieByName: builder.query({
        query: (name) => ({
            url: `/munchies/${name}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, name) => [{ type: 'Munchies', id: name }],
    }),

    getLearnableMovesByMunchie: builder.query({
        query: (name) => ({
            url: `/munchies/${name}/moves`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, name) => [{ type: 'Munchies', id: `${name}-moves` }],
    }),

    getMunchieAllInfo: builder.query({
        query: (name) => ({
            url: `/munchies/allinfo/${name}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, name) => [{ type: 'Munchies', id: `${name}-allinfo` }],
    }),
});
