export const abilitiesEndpoints = (builder) => ({
    getAllAbilities: builder.query({
        query: () => ({
            url: '/abilities',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['Abilities'],
    }),

    getAbilityById: builder.query({
        query: (id) => ({
            url: `/abilities/get-ability/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'Abilities', id }],
    }),

    createAbility: builder.mutation({
        query: (data) => ({
            url: '/abilities/create-ability',
            method: 'POST',
            data,
        }),
        invalidatesTags: ['Abilities'],
    }),

    updateAbility: builder.mutation({
        query: ({ id, ...data }) => ({
            url: `/abilities/edit-ability/${id}`,
            method: 'PUT',
            data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Abilities', id }],
    }),
});