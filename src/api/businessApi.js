// businessApi.js
import baseApi from './baseApi';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Business API endpoints
export const businessApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get active business
        getActiveBusiness: builder.query({
            query: () => ({
                url:'/https://dev.net-api.spatialmods.com/business/active',
                method: 'GET',
            }),
            providesTags: ['Business'],
        }),

        // Get business by ID
        getBusinessById: builder.query({
            query: (businessId) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}`,
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'Business', id: businessId }],
        }),

        // Update business
        updateBusiness: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'Business', id: businessId }],
        }),

        // Set active business
        setActiveBusiness: builder.mutation({
            query: (businessId) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}/set-active`,
                    method: 'POST',
            }),
            invalidatesTags: ['Business'],
        }),

        // Invite user to business
        inviteUserToBusiness: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}/invite`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'Business', id: businessId }, 'BusinessUsers'],
        }),

        // Get business users
        getBusinessUsers: builder.query({
            query: (businessId) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}/users`,
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Change user role
        changeUserRole: builder.mutation({
            query: ({ businessId, userId, ...data }) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}/users/${userId}/role`,
                    method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Remove user from business
        removeUserFromBusiness: builder.mutation({
            query: ({ businessId, userId }) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessUsers', id: businessId }],
        }),

        // Get business roles
        getBusinessRoles: builder.query({
            query: (businessId) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}/roles`,
                method: 'GET',
            }),
            providesTags: (result, error, businessId) => [{ type: 'BusinessRoles', id: businessId }],
        }),

        // Create business role
        createBusinessRole: builder.mutation({
            query: ({ businessId, ...data }) => ({
                url:`/https://dev.net-api.spatialmods.com/business/${businessId}/roles`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { businessId }) => [{ type: 'BusinessRoles', id: businessId }],
        }),

        // Delete business role
        deleteBusinessRole: builder.mutation({
            query: ({ businessId, roleId }) => ({
                url: `/https://dev.net-api.spatialmods.com/business/${businessId}/roles/${roleId}`,
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
