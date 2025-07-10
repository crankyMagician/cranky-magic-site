// invitationApi.js
import baseApi, { getApiUrl, invitationsApi } from './baseApi';

export const invitationApiExtended = invitationsApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send invitation
        sendInvitation: builder.mutation({
            query: (invitationData) => ({
                url: getApiUrl('api/invitations/send', 'main'),
                method: 'POST',
                body: invitationData,
            }),
            invalidatesTags: ['Invitation'],
        }),

        // Verify invitation token
        verifyInvitation: builder.query({
            query: (token) => ({
                url: getApiUrl('api/invitations/verify', 'main'),
                method: 'GET',
                params: { token },
            }),
        }),

        // Accept invitation
        acceptInvitation: builder.mutation({
            query: (acceptData) => ({
                url: getApiUrl('api/invitations/accept', 'main'),
                method: 'POST',
                body: acceptData,
            }),
            invalidatesTags: ['Invitation', 'Business', 'BusinessUsers'],
        }),

        // Get invitations for a business
        getInvitationsByBusiness: builder.query({
            query: ({ businessId, page, pageSize }) => ({
                url: getApiUrl(`api/invitations/business/${businessId}`, 'main'),
                method: 'GET',
                params: { page, pageSize },
            }),
            providesTags: ['Invitation'],
        }),

        // Resend invitation
        resendInvitation: builder.mutation({
            query: (invitationId) => ({
                url: getApiUrl(`api/invitations/${invitationId}/resend`, 'main'),
                method: 'POST',
            }),
        }),

        // Delete invitation
        deleteInvitation: builder.mutation({
            query: (invitationId) => ({
                url: getApiUrl(`api/invitations/${invitationId}`, 'main'),
                method: 'DELETE',
            }),
            invalidatesTags: ['Invitation'],
        }),

        // Update business role
        updateBusinessRole: builder.mutation({
            query: ({ businessId, roleId, ...data }) => ({
                url: getApiUrl(`business/${businessId}/roles/${roleId}`, 'main'),
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['BusinessRoles'],
        }),

        // Remove business role
        removeBusinessRole: builder.mutation({
            query: ({ businessId, roleId }) => ({
                url: getApiUrl(`business/${businessId}/roles/${roleId}`, 'main'),
                method: 'DELETE',
            }),
            invalidatesTags: ['BusinessRoles'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useSendInvitationMutation,
    useVerifyInvitationQuery,
    useAcceptInvitationMutation,
    useGetInvitationsByBusinessQuery,
    useResendInvitationMutation,
    useDeleteInvitationMutation,
    useUpdateBusinessRoleMutation,
    useRemoveBusinessRoleMutation,
} = invitationApiExtended;