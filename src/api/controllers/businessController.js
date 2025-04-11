export const businessEndpoints = (builder) => ({
    getActiveBusiness: builder.query({
        query: () => ({
            url: '/business/active',
            method: 'GET',
        }),
        providesTags: ['Business'],
    }),

    getBusinessById: builder.query({
        query: (businessId) => ({
            url: `/business/${businessId}`,
            method: 'GET',
        }),
        providesTags: (result, error, businessId) => [{ type: 'Business', id: businessId }],
    }),

    updateBusiness: builder.mutation({
        query: ({ businessId, ...data }) => ({
            url: `/business/${businessId}`,
            method: 'PUT',
            data,
        }),
        invalidatesTags: (result, error, { businessId }) => [{ type: 'Business', id: businessId }],
    }),

    setActiveBusiness: builder.mutation({
        query: (businessId) => ({
            url: `/business/${businessId}/set-active`,
            method: 'POST',
        }),
        invalidatesTags: ['Business'],
    }),

    inviteUserToBusiness: builder.mutation({
        query: ({ businessId, ...data }) => ({
            url: `/business/${businessId}/invite`,
            method: 'POST',
            data,
        }),
        invalidatesTags: (result, error, { businessId }) => [{ type: 'Business', id: businessId }],
    }),

    getBusinessUsers: builder.query({
        query: (businessId) => ({
            url: `/business/${businessId}/users`,
            method: 'GET',
        }),
        providesTags: (result, error, businessId) => [{ type: 'BusinessUsers', id: businessId }],
    }),

    changeUserRole: builder.mutation({
        query: ({ businessId, userId, ...data }) => ({
            url: `/business/${businessId}/users/${userId}/role`,
            method: 'PUT',
            data,
        }),
        invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessUsers', id: businessId }],
    }),

    removeUserFromBusiness: builder.mutation({
        query: ({ businessId, userId }) => ({
            url: `/business/${businessId}/users/${userId}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessUsers', id: businessId }],
    }),

    getBusinessRoles: builder.query({
        query: (businessId) => ({
            url: `/business/${businessId}/roles`,
            method: 'GET',
        }),
        providesTags: (result, error, businessId) => [{ type: 'BusinessRoles', id: businessId }],
    }),

    createBusinessRole: builder.mutation({
        query: ({ businessId, ...data }) => ({
            url: `/business/${businessId}/roles`,
            method: 'POST',
            data,
        }),
        invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessRoles', id: businessId }],
    }),

    deleteBusinessRole: builder.mutation({
        query: ({ businessId, roleId }) => ({
            url: `/business/${businessId}/roles/${roleId}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessRoles', id: businessId }],
    }),
}); 