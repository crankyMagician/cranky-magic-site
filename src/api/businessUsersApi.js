// businessApi.js
import baseApi, { getApiUrl } from './baseApi';

// Business API endpoints
export const businessApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get active business
        getActiveBusiness: builder.query({
            query: () => ({
                url: getApiUrl('/business/active', 'main'),
                method: 'GET',
            }),
            providesTags: ['Business'],
        }),

        // Get business by ID
        getBusinessById: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`/business/${businessId}`, 'main'),
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'Business', id: businessId }],
        }),

        // Update business
        updateBusiness: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url: getApiUrl(`/business/${businessId}`, 'main'),
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'Business', id: businessId }],
        }),

        // Set active business
        setActiveBusiness: builder.mutation({
            query: (businessId) => ({
                url: getApiUrl(`/business/${businessId}/set-active`, 'main'),
                method: 'POST',
            }),
            invalidatesTags: ['Business'],
        }),

        // Invite user to business
        inviteUserToBusiness: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url: getApiUrl(`/business/${businessId}/invite`, 'main'),
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'Business', id: businessId }, 'BusinessUsers'],
        }),

        // Get business users
        getBusinessUsers: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`/business/${businessId}/users`, 'main'),
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Change user role
        changeUserRole: builder.mutation({
            query: ({ businessId, userId, ...data }) => ({
                url: getApiUrl(`/business/${businessId}/users/${userId}/role`, 'main'),
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Remove user from business
        removeUserFromBusiness: builder.mutation({
            query: ({ businessId, userId }) => ({
                url: getApiUrl(`/business/${businessId}/users/${userId}`, 'main'),
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Get business roles
        getBusinessRoles: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`/business/${businessId}/roles`, 'main'),
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'BusinessRoles', id: businessId }],
        }),

        // Create business role
        createBusinessRole: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url: getApiUrl(`/business/${businessId}/roles`, 'main'),
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessRoles', id: businessId }],
        }),

        // Delete business role
        deleteBusinessRole: builder.mutation({
            query: ({ businessId, roleId }) => ({
                url: getApiUrl(`/business/${businessId}/roles/${roleId}`, 'main'),
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