// invitationApi.js
import baseApi, { getApiUrl, invitationsApi } from './baseApi';
import { transformServiceResponse, transformServiceErrorResponse, transformPaginatedResponse } from './baseApiHelpers';

export const invitationApiExtended = invitationsApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send invitation (now scoped under business)
        sendInvitation: builder.mutation({
            query: ({ businessId, ...invitationData }) => ({
                url: getApiUrl(`api/business/${businessId}/invitations`, 'main'),
                method: 'POST',
                body: invitationData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to send invitation'),
            invalidatesTags: (result, error, { businessId }) => [
                'Invitation',
                { type: 'BusinessInvitations', id: businessId }
            ],
        }),

        // Verify invitation token
        verifyInvitation: builder.query({
            query: (token) => ({
                url: getApiUrl('api/invitations/verify', 'main'),
                method: 'GET',
                params: { token },
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to verify invitation'),
            providesTags: (result, error, token) => [{ type: 'InvitationVerification', id: token }],
        }),

        // Accept invitation
        acceptInvitation: builder.mutation({
            query: (acceptData) => ({
                url: getApiUrl('api/invitations/accept', 'main'),
                method: 'POST',
                body: acceptData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to accept invitation'),
            invalidatesTags: ['Invitation', 'Business', 'BusinessUsers', 'Auth'],
        }),

        // Get invitations for a business
        getInvitationsByBusiness: builder.query({
            query: ({ businessId, page = 1, pageSize = 10 }) => ({
                url: getApiUrl(`api/business/${businessId}/invitations`, 'main'),
                method: 'GET',
                params: { page, pageSize },
            }),
            transformResponse: (response) => transformPaginatedResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get invitations'),
            providesTags: (result, error, { businessId }) => [
                { type: 'BusinessInvitations', id: businessId },
                'Invitation'
            ],
        }),

        // Resend invitation
        resendInvitation: builder.mutation({
            query: ({ businessId, invitationId }) => ({
                url: getApiUrl(`api/business/${businessId}/invitations/${invitationId}/resend`, 'main'),
                method: 'POST',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to resend invitation'),
            invalidatesTags: (result, error, { businessId, invitationId }) => [
                { type: 'Invitation', id: invitationId },
                { type: 'BusinessInvitations', id: businessId }
            ],
        }),

        // Delete invitation
        deleteInvitation: builder.mutation({
            query: ({ businessId, invitationId }) => ({
                url: getApiUrl(`api/business/${businessId}/invitations/${invitationId}`, 'main'),
                method: 'DELETE',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to delete invitation'),
            invalidatesTags: (result, error, { businessId, invitationId }) => [
                { type: 'Invitation', id: invitationId },
                { type: 'BusinessInvitations', id: businessId }
            ],
        }),

        // Update business role (from invitation management)
        updateBusinessRole: builder.mutation({
            query: ({ businessId, userId, currentBusinessRoleId, newBusinessRoleId }) => ({
                url: getApiUrl(`api/business/${businessId}/users/${userId}/role`, 'main'),
                method: 'PUT',
                body: {
                    currentBusinessRoleId,
                    newBusinessRoleId
                },
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to update user role'),
            invalidatesTags: (result, error, { businessId, userId }) => [
                { type: 'BusinessUsers', id: businessId },
                { type: 'BusinessRoles', id: businessId }
            ],
        }),

        // Remove business role from user
        removeBusinessRole: builder.mutation({
            query: ({ businessId, userId }) => ({
                url: getApiUrl(`api/business/${businessId}/users/${userId}`, 'main'),
                method: 'DELETE',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to remove user from business'),
            invalidatesTags: (result, error, { businessId }) => [
                { type: 'BusinessUsers', id: businessId },
                'BusinessUsers'
            ],
        }),
    }),
    overrideExisting: false,
});

// Export hooks
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

// Export utility functions for invitation management
export const invitationUtils = {
    /**
     * Format invitation data for sending
     * @param {Object} data - Invitation data
     * @returns {Object} - Formatted invitation data
     */
    formatInvitationData: (data) => {
        return {
            email: data.email.trim().toLowerCase(),
            firstName: data.firstName?.trim() || null,
            lastName: data.lastName?.trim() || null,
            phoneNumber: data.phoneNumber?.trim() || null,
            businessRoleId: parseInt(data.businessRoleId, 10),
            customMessage: data.customMessage?.trim() || null
        };
    },

    /**
     * Parse invitation status
     * @param {Object} invitation - Invitation object
     * @returns {Object} - Status info
     */
    parseInvitationStatus: (invitation) => {
        const status = invitation.status?.toLowerCase() || 'pending';

        const statusMap = {
            'pending': {
                label: 'Pending',
                color: 'warning',
                icon: 'Schedule'
            },
            'accepted': {
                label: 'Accepted',
                color: 'success',
                icon: 'CheckCircle'
            },
            'expired': {
                label: 'Expired',
                color: 'error',
                icon: 'Cancel'
            },
            'revoked': {
                label: 'Revoked',
                color: 'default',
                icon: 'Block'
            }
        };

        return statusMap[status] || statusMap.pending;
    },

    /**
     * Check if invitation can be resent
     * @param {Object} invitation - Invitation object
     * @returns {boolean} - True if can be resent
     */
    canResendInvitation: (invitation) => {
        const status = invitation.status?.toLowerCase();
        return status === 'pending' && !invitation.isExpired;
    },

    /**
     * Check if invitation can be deleted
     * @param {Object} invitation - Invitation object
     * @returns {boolean} - True if can be deleted
     */
    canDeleteInvitation: (invitation) => {
        const status = invitation.status?.toLowerCase();
        return status === 'pending' || status === 'expired';
    },

    /**
     * Format invitation acceptance data
     * @param {Object} data - Acceptance data
     * @returns {Object} - Formatted acceptance data
     */
    formatAcceptanceData: (data) => {
        return {
            token: data.token,
            password: data.password,
            confirmPassword: data.confirmPassword || data.password,
            firstName: data.firstName?.trim() || null,
            lastName: data.lastName?.trim() || null
        };
    },

    /**
     * Calculate invitation expiry status
     * @param {Object} invitation - Invitation object
     * @returns {Object} - Expiry info
     */
    calculateExpiryStatus: (invitation) => {
        if (!invitation.expiresAt) {
            return { isExpired: false, daysRemaining: null };
        }

        const now = new Date();
        const expiryDate = new Date(invitation.expiresAt);
        const isExpired = now > expiryDate;

        if (isExpired) {
            return { isExpired: true, daysRemaining: 0 };
        }

        const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        return {
            isExpired: false,
            daysRemaining,
            expiryDate,
            isExpiringSoon: daysRemaining <= 2
        };
    },

    /**
     * Group invitations by status
     * @param {Array} invitations - Array of invitations
     * @returns {Object} - Invitations grouped by status
     */
    groupInvitationsByStatus: (invitations) => {
        if (!Array.isArray(invitations)) return {};

        return invitations.reduce((groups, invitation) => {
            const status = invitation.status?.toLowerCase() || 'pending';
            if (!groups[status]) {
                groups[status] = [];
            }
            groups[status].push(invitation);
            return groups;
        }, {});
    },
};