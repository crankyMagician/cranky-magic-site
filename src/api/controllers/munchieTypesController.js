
// munchieTypesController.js
export const munchieTypesEndpoints = (builder) => ({
    getAllTypes: builder.query({
        query: () => ({
            url: '/munchie-types',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['MunchieTypes'],
    }),
});
