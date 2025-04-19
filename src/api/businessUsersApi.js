// businessUsersApi.js
import baseApi from './baseApi';

const isDevelopment = process.env.NODE_ENV === 'development';

export const businessUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get business users
        getBusinessUsers: builder.query({
            query: (businessId) => ({
                url: `/https://dev.net-api.spatialmods.com/api/business-users/business/${businessId}`,
                method: 'GET',
            }),
        }),

        // Get business roles for a business
        getBusinessRoles: builder.query({
            query: (businessId) => ({
                url:  `/https://dev.net-api.spatialmods.com/api/business-users/roles/business/${businessId}`,
                method: 'GET',
            }),
        }),

        // Get business users permissions
        getBusinessUsersPermissions: builder.query({
            query: () => ({
                url: '/https://dev.net-api.spatialmods.com/api/business-users/permissions',
                method: 'GET',
            }),
        }),

        // Assign business role to a user
        assignBusinessRole: builder.mutation({
            query: (data) => ({
                url:'/https://dev.net-api.spatialmods.com/api/business-users/roles/assign',
                method: 'POST',
                body: data,
            }),
        }),

        // Update business role for a user
        updateBusinessRole: builder.mutation({
            query: (data) => ({
                url: '/https://dev.net-api.spatialmods.com/api/business-users/roles/update',
                method: 'PUT',
                body: data,
            }),
        }),

        // Remove business role from a user
        removeBusinessRole: builder.mutation({
            query: (data) => ({
                url: '/https://dev.net-api.spatialmods.com/api/business-users/roles/remove',
                method: 'POST',
                body: data,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetBusinessUsersQuery,
    useGetBusinessRolesQuery: useGetBusinessUsersRolesQuery,
    useGetBusinessUsersPermissionsQuery,
    useAssignBusinessRoleMutation,
    useUpdateBusinessRoleMutation,
    useRemoveBusinessRoleMutation,
} = businessUsersApi;
