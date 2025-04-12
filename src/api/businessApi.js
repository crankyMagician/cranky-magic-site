/**
 * RTK Query slice for business-related endpoints
 */
import baseApi from './baseApi';

// Business API endpoints
export const businessApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get active business
        getActiveBusiness: builder.query({
            query: () => ({
                url: '/business/active',
                method: 'GET',
            }),
            providesTags: ['Business'],
        }),

        // Get business by ID
        getBusinessById: builder.query({
            query: (businessId) => ({
                url: `/business/${businessId}`,
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'Business', id: businessId }],
        }),

        // Update business
        updateBusiness: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url: `/business/${businessId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'Business', id: businessId }],
        }),

        // Set active business
        setActiveBusiness: builder.mutation({
            query: (businessId) => ({
                url: `/business/${businessId}/set-active`,
                method: 'POST',
            }),
            invalidatesTags: ['Business'],
        }),

        // Invite user to business
        inviteUserToBusiness: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url: `/business/${businessId}/invite`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'Business', id: businessId }, 'BusinessUsers'],
        }),

        // Get business users
        getBusinessUsers: builder.query({
            query: (businessId) => ({
                url: `/business/${businessId}/users`,
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Change user role
        changeUserRole: builder.mutation({
            query: ({ businessId, userId, ...data }) => ({
                url: `/business/${businessId}/users/${userId}/role`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Remove user from business
        removeUserFromBusiness: builder.mutation({
            query: ({ businessId, userId }) => ({
                url: `/business/${businessId}/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Get business roles
        getBusinessRoles: builder.query({
            query: (businessId) => ({
                url: `/business/${businessId}/roles`,
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'BusinessRoles', id: businessId }],
        }),

        // Create business role
        createBusinessRole: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url: `/business/${businessId}/roles`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessRoles', id: businessId }],
        }),

        // Delete business role
        deleteBusinessRole: builder.mutation({
            query: ({ businessId, roleId }) => ({
                url: `/business/${businessId}/roles/${roleId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessRoles', id: businessId }],
        }),
    }),
    overrideExisting: false,
});

// Export the generated hooks
export const {
    useGetActiveBusinessQuery,
    useGetBusinessByIdQuery,
    useUpdateBusinessMutation,
    useSetActiveBusinessMutation,
    useInviteUserToBusinessMutation,
    useGetBusinessUsersQuery,
    useChangeUserRoleMutation,
    useRemoveUserFromBusinessMutation,
    useGetBusinessRolesQuery,
    useCreateBusinessRoleMutation,
    useDeleteBusinessRoleMutation,
} = businessApi;