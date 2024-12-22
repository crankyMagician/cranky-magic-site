// effectsController.js
export const effectsEndpoints = (builder) => ({
    getAllEffects: builder.query({
        query: () => ({
            url: '/effects',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['Effects'],
    }),

    getEffectById: builder.query({
        query: (id) => ({
            url: `/effects/get-effect/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'Effects', id }],
    }),

    createEffect: builder.mutation({
        query: (effectData) => ({
            url: '/effects/create-effect',
            method: 'POST',
            data: effectData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['Effects'],
    }),

    updateEffect: builder.mutation({
        query: ({ id, ...effectData }) => ({
            url: `/effects/edit-effect/${id}`,
            method: 'PUT',
            data: effectData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: (result, error, { id }) => [{ type: 'Effects', id }],
    }),
    createMoveEffect: builder.mutation({
        query: (effectData) => ({
            url: '/move-effects/create-effect',
            method: 'POST',
            data: effectData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['Effects', 'MoveEffects'],
    }),
});