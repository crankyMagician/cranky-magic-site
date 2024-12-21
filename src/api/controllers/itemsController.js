export const itemsEndpoints = (builder) => ({
    getAllItems: builder.query({
        query: () => ({
            url: '/items',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['Items'],
    }),

    getItemById: builder.query({
        query: (id) => ({
            url: `/items/get-item/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'Items', id }],
    }),

    createItem: builder.mutation({
        query: (itemData) => ({
            url: '/items/create-item',
            method: 'POST',
            data: itemData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['Items'],
    }),

    updateItem: builder.mutation({
        query: ({ id, ...itemData }) => ({
            url: `/items/edit-item/${id}`,
            method: 'PUT',
            data: itemData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: (result, error, { id }) => [{ type: 'Items', id }],
    }),
});