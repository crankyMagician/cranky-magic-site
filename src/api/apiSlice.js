/**
 * Main API slice that re-exports all API hooks
 */
import baseApi, {
    authApi,
    businessApi,
    mediaApi,
    campaignsApi,
    commoApi,
    invitationsApi,
    apiReducers,
    apiMiddleware
} from './baseApi';

// Export the base API as apiSlice (this is what your app is looking for)
export const apiSlice = baseApi;

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
    useGetBusinessUsersRolesQuery,
    useGetBusinessUsersPermissionsQuery,
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
    // New Vuforia-enhanced campaign hooks
    useGetCampaignVuforiaStatsQuery,
    useBulkUpdateVuforiaMediaMutation,
    campaignMediaUtils,
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
    useUpdateBusinessRoleMutation,
    useRemoveBusinessRoleMutation,
} from './invitationApi';

// Export Vuforia API hooks - NEW!
export {
    useUploadImageToVuforiaMutation,
    useBatchUploadToVuforiaMutation,
    useGetVuforiaUploadStatusQuery,
    vuforiaUploadUtils,
} from './vuforiaApi';

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