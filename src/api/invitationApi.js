// invitationApi.js
import baseApi from './baseApi';

const isDevelopment = process.env.NODE_ENV === 'development';

export const invitationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send invitation
        sendInvitation: builder.mutation({
            query: (invitationData) => ({
                url: '/https://dev.net-api.spatialmods.com/api/invitations/send',
                method: 'POST',
                body: invitationData,
            }),
        }),

        // Verify invitation token
        verifyInvitation: builder.query({
            query: (token) => ({
                url:`/https://dev.net-api.spatialmods.com/api/invitations/verify?token=${token}`,
                method: 'GET',
            }),
        }),

        // Accept invitation
        acceptInvitation: builder.mutation({
            query: (acceptData) => ({
                url: '/https://dev.net-api.spatialmods.com/api/invitations/accept',
                method: 'POST',
                body: acceptData,
            }),
        }),

        // Get invitations for a business
        getInvitationsByBusiness: builder.query({
            query: ({ businessId, page, pageSize }) => ({
                url: `/https://dev.net-api.spatialmods.com/api/invitations/business/${businessId}?page=${page}&pageSize=${pageSize}`,
                method: 'GET',
            }),
        }),

        // Resend invitation
        resendInvitation: builder.mutation({
            query: (invitationId) => ({
                url:  `/https://dev.net-api.spatialmods.com/api/invitations/${invitationId}/resend`,
                method: 'POST',
            }),
        }),

        // Delete invitation
        deleteInvitation: builder.mutation({
            query: (invitationId) => ({
                url: `/https://dev.net-api.spatialmods.com/api/invitations/${invitationId}`,
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
