export const itemPhotosEndpoints = (builder) => ({
    getAllItemPhotos: builder.query({
        query: () => ({
            url: '/item-photos',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['ItemPhotos'],
    }),

    getItemPhotoById: builder.query({
        query: (id) => ({
            url: `/item-photos/by-id/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'ItemPhotos', id }],
    }),

    getItemPhotoByName: builder.query({
        query: (fileName) => ({
            url: `/item-photos/by-name/${fileName}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, fileName) => [{ type: 'ItemPhotos', fileName }],
    }),

    uploadItemPhoto: builder.mutation({
        query: (photoData) => ({
            url: '/item-photos/upload',
            method: 'POST',
            data: photoData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['ItemPhotos'],
    }),

    getPrimaryPhotoByItemName: builder.query({
        query: (itemName) => ({
            url: `/item-photos/by-item-name/${itemName}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, itemName) => [{ type: 'ItemPhotos', itemName }],
    }),

    getPrimaryPhotoByItemId: builder.query({
        query: (itemId) => ({
            url: `/item-photos/primary/${itemId}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, itemId) => [{ type: 'ItemPhotos', itemId }],
    }),
});