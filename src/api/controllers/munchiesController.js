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
    getMunchieAllInfoById: builder.query({
        query: (id) => ({
            url: `/munchies/allinfo/id/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'Munchies', id: `${id}-allinfo` }],
    }),
    getPaginatedMunchies: builder.query({
        query: (page = 0) => ({
            url: `/munchies/paginated?page=${page}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['Munchies'],
    }),
    getAllMunchieIds: builder.query({
    query: () => ({
        url: '/munchies/ids',
        method: 'GET',
    }),
    transformResponse: (response) => response,
    providesTags: ['Munchies'],
}),

});
