// invitationApi.js
import baseApi, { getApiUrl } from './baseApi';

export const invitationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send invitation
        sendInvitation: builder.mutation({
            query: (invitationData) => ({
                url: getApiUrl('/invitations/send', 'main'),
                method: 'POST',
                body: invitationData,
            }),
        }),

        // Verify invitation token
        verifyInvitation: builder.query({
            query: (token) => ({
                url: getApiUrl(`/invitations/verify?token=${token}`, 'main'),
                method: 'GET',
            }),
        }),

        // Accept invitation
        acceptInvitation: builder.mutation({
            query: (acceptData) => ({
                url: getApiUrl('/invitations/accept', 'main'),
                method: 'POST',
                body: acceptData,
            }),
        }),

        // Get invitations for a business
        getInvitationsByBusiness: builder.query({
            query: ({ businessId, page, pageSize }) => ({
                url: getApiUrl(`/invitations/business/${businessId}?page=${page}&pageSize=${pageSize}`, 'main'),
                method: 'GET',
            }),
        }),

        // Resend invitation
        resendInvitation: builder.mutation({
            query: (invitationId) => ({
                url: getApiUrl(`/invitations/${invitationId}/resend`, 'main'),
                method: 'POST',
            }),
        }),

        // Delete invitation
        deleteInvitation: builder.mutation({
            query: (invitationId) => ({
                url: getApiUrl(`/invitations/${invitationId}`, 'main'),
                method: 'DELETE',
            }),
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
} = invitationApi;