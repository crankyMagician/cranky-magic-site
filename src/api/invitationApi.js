/**
 * Main API slice that re-exports all API hooks
 */
import { authApi } from './authApi';
import { businessApi } from './businessApi';
import { invitationApi } from './invitationApi';
import baseApi from './baseApi';

// Re-export the combined API slice
export const apiSlice = baseApi;

// Re-export all the hooks from auth and business APIs
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