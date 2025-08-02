// businessApi.js
import baseApi, { getApiUrl, businessApi } from './baseApi';
import { transformServiceResponse, transformServiceErrorResponse, transformPaginatedResponse } from './baseApiHelpers';
import {setActiveBusiness} from "../reducers/authReducer";


export const businessApiExtended = businessApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get active business for current user
        getActiveBusiness: builder.query({
            query: () => ({
                url: getApiUrl('api/business/active', 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get active business'),
            providesTags: ['Business'],
        }),

        // Get business by ID
        getBusinessById: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`api/business/${businessId}`, 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get business details'),
            providesTags: (result, error, id) => [{ type: 'Business', id }],
        }),

        // Update business
        updateBusiness: builder.mutation({
            query: ({ businessId, ...updateData }) => ({
                url: getApiUrl(`api/business/${businessId}`, 'main'),
                method: 'PUT',
                body: updateData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to update business'),
            invalidatesTags: (result, error, { businessId }) => [
                { type: 'Business', id: businessId },
                'Business'
            ],
        }),

        // Set active business
        setActiveBusiness: builder.mutation({
            query: (businessId) => ({
                url: getApiUrl(`api/business/${businessId}/activate`, 'main'),
                method: 'POST',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to set active business'),
            async onQueryStarted(businessId, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Update Redux state with new active business
                    if (data) {
                        dispatch(setActiveBusiness(data));
                    }
                } catch (error) {
                    console.error('Failed to set active business:', error);
                }
            },
            invalidatesTags: ['Business', 'Auth'],
        }),

        // Invite user to business
        inviteUserToBusiness: builder.mutation({
            query: ({ businessId, ...inviteData }) => ({
                url: getApiUrl(`api/business/${businessId}/invite`, 'main'),
                method: 'POST',
                body: inviteData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to send invitation'),
            invalidatesTags: ['Invitation', 'BusinessUsers'],
        }),

        // Get business users with pagination
        getBusinessUsers: builder.query({
            query: ({ businessId, page = 1, pageSize = 10 }) => ({
                url: getApiUrl(`api/business/${businessId}/users`, 'main'),
                method: 'GET',
                params: { page, pageSize },
            }),
            transformResponse: (response) => transformPaginatedResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get business users'),
            providesTags: ['BusinessUsers'],
        }),

        // Get business users with roles
        getBusinessUsersRoles: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`api/business/${businessId}/users/roles`, 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get user roles'),
            providesTags: ['BusinessUsers', 'BusinessRoles'],
        }),

        // Get business users permissions
        getBusinessUsersPermissions: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`api/business/${businessId}/users/permissions`, 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get user permissions'),
            providesTags: ['BusinessUsers'],
        }),

        // Change user role
        changeUserRole: builder.mutation({
            query: ({ businessId, userId, roleId }) => ({
                url: getApiUrl(`api/business/${businessId}/users/${userId}/role`, 'main'),
                method: 'PUT',
                body: { roleId },
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to change user role'),
            invalidatesTags: ['BusinessUsers', 'BusinessRoles'],
        }),

        // Remove user from business
        removeUserFromBusiness: builder.mutation({
            query: ({ businessId, userId }) => ({
                url: getApiUrl(`api/business/${businessId}/users/${userId}`, 'main'),
                method: 'DELETE',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to remove user'),
            invalidatesTags: ['BusinessUsers'],
        }),

        // Get business roles
        getBusinessRoles: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`api/business/${businessId}/roles`, 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get business roles'),
            providesTags: ['BusinessRoles'],
        }),

        // Create business role
        createBusinessRole: builder.mutation({
            query: ({ businessId, ...roleData }) => ({
                url: getApiUrl(`api/business/${businessId}/roles`, 'main'),
                method: 'POST',
                body: roleData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to create role'),
            invalidatesTags: ['BusinessRoles'],
        }),

        // Update business role
        updateBusinessRole: builder.mutation({
            query: ({ businessId, roleId, ...updateData }) => ({
                url: getApiUrl(`api/business/${businessId}/roles/${roleId}`, 'main'),
                method: 'PUT',
                body: updateData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to update role'),
            invalidatesTags: (result, error, { businessId, roleId }) => [
                { type: 'BusinessRoles', id: roleId },
                'BusinessRoles'
            ],
        }),

        // Delete business role
        deleteBusinessRole: builder.mutation({
            query: ({ businessId, roleId }) => ({
                url: getApiUrl(`api/business/${businessId}/roles/${roleId}`, 'main'),
                method: 'DELETE',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to delete role'),
            invalidatesTags: ['BusinessRoles'],
        }),

        // Remove business role from user
        removeBusinessRole: builder.mutation({
            query: ({ businessId, userId, roleId }) => ({
                url: getApiUrl(`api/business/${businessId}/users/${userId}/roles/${roleId}`, 'main'),
                method: 'DELETE',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to remove role from user'),
            invalidatesTags: ['BusinessUsers', 'BusinessRoles'],
        }),

        // Get all permissions (for role management)
        getAllPermissions: builder.query({
            query: () => ({
                url: getApiUrl('api/permissions', 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get permissions'),
            providesTags: ['Permissions'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetActiveBusinessQuery,
    useGetBusinessByIdQuery,
    useUpdateBusinessMutation,
    useSetActiveBusinessMutation,
    useInviteUserToBusinessMutation,
    useGetBusinessUsersQuery,
    useGetBusinessUsersRolesQuery,
    useGetBusinessUsersPermissionsQuery,
    useChangeUserRoleMutation,
    useRemoveUserFromBusinessMutation,
    useGetBusinessRolesQuery,
    useCreateBusinessRoleMutation,
    useUpdateBusinessRoleMutation,
    useDeleteBusinessRoleMutation,
    useRemoveBusinessRoleMutation,
    useGetAllPermissionsQuery,
} = businessApiExtended;