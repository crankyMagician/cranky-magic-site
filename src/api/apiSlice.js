/**
 * Main API slice that re-exports all API hooks
 */
import {
    apiReducers,
    apiMiddleware,
    authApi,
    businessApi,
    mediaApi,
    campaignsApi,
    commoApi,
    invitationsApi
} from './baseApi';

// Re-export all the hooks from the various APIs
export {
    // Auth hooks
    useLoginMutation,
    useRegisterMutation,
    useConfirmSignupMutation,
    useConfirmPhoneMutation,
    useResendConfirmationMutation,
    useResendPhoneConfirmationMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useLogoutMutation,
    useDecodeTokenMutation,
    useBusinessSignupMutation,
    useUpdateMfaPreferenceMutation,
} from './authApi';

export {
    // Business hooks
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
} from './businessApi';

export {
    // Media hooks
    useUploadMediaMutation,
    useUpdateBusinessLogoMutation,
    useGetMediaByIdQuery,
    useDeleteMediaMutation,
    useGetBusinessMediaQuery,
    useGetMediaTypesQuery,
    useDownloadMediaQuery,
} from './mediaApi';

export {
    // Campaign hooks
    useCreateCampaignMutation,
    useUpdateCampaignMutation,
    useGetCampaignByIdQuery,
    useDeleteCampaignMutation,
    useGetCampaignsByBusinessQuery,
    useAttachCampaignMediaMutation,
    useDeleteCampaignMediaMutation,
    useUpdateCampaignStatusMutation,
} from './campaignApi';

export {
    // Commo hooks
    useSendSmsMutation,
    useSendEmailMutation,
} from './commoApi';

export {
    // Invitation hooks
    useSendInvitationMutation,
    useVerifyInvitationQuery,
    useAcceptInvitationMutation,
    useGetInvitationsByBusinessQuery,
    useResendInvitationMutation,
    useDeleteInvitationMutation,
} from './invitationApi';

// Export reducers and middleware for store configuration
export const apiSliceReducers = apiReducers;
export const apiSliceMiddleware = apiMiddleware;

// Export the API slices themselves
export {
    authApi,
    businessApi,
    mediaApi,
    campaignsApi,
    commoApi,
    invitationsApi
};