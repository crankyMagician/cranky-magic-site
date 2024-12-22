// munchiePhotosController.js
export const munchiePhotosEndpoints = (builder) => ({
    getAllMunchiePhotos: builder.query({
        query: () => ({
            url: '/munchie-photos',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['MunchiePhotos'],
    }),

    getMunchiePhotoById: builder.query({
        query: (id) => ({
            url: `/munchie-photos/by-id/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'MunchiePhotos', id }],
    }),

    getMunchiePhotoByName: builder.query({
        query: (fileName) => ({
            url: `/munchies-photos/by-name/${fileName}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, fileName) => [{ type: 'MunchiePhotos', id: fileName }],
    }),

    uploadMunchiePhoto: builder.mutation({
        query: (photoData) => ({
            url: '/munchies-photos/upload',
            method: 'POST',
            data: photoData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['MunchiePhotos'],
    }),

    getPrimaryPhotoByMunchieName: builder.query({
        query: (munchieName) => ({
            url: `/munchies-photos/by-munchie-name/${munchieName}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, munchieName) => [{ type: 'MunchiePhotos', id: `primary-${munchieName}` }],
    }),

    getPrimaryPhotoByMunchieId: builder.query({
        query: (munchieId) => ({
            url: `/munchies-photos/primary/${munchieId}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, munchieId) => [{ type: 'MunchiePhotos', id: `primary-${munchieId}` }],
    }),
});