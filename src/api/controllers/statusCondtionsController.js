

// statusConditionsController.js
export const statusConditionsEndpoints = (builder) => ({
    getAllStatusConditions: builder.query({
        query: () => ({
            url: '/status-conditions',
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: ['StatusConditions'],
    }),

    getStatusConditionById: builder.query({
        query: (id) => ({
            url: `/status-conditions/get-condition/${id}`,
            method: 'GET',
        }),
        transformResponse: (response) => response,
        providesTags: (result, error, id) => [{ type: 'StatusConditions', id }],
    }),

    createStatusCondition: builder.mutation({
        query: (conditionData) => ({
            url: '/status-conditions/create-condition',
            method: 'POST',
            data: conditionData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: ['StatusConditions'],
    }),

    updateStatusCondition: builder.mutation({
        query: ({ id, ...conditionData }) => ({
            url: `/status-conditions/edit-condition/${id}`,
            method: 'PUT',
            data: conditionData,
        }),
        transformResponse: (response) => response,
        invalidatesTags: (result, error, { id }) => [{ type: 'StatusConditions', id }],
    }),
});