import {extendedApi} from "./extendedApi";

export const apiSlice = extendedApi.enhanceEndpoints({
    addTagTypes: [
        'Moves',
        'Munchies',
        'CraftingRecipes',
        'Items',
        'Abilities',
        'Effects',
        'MoveEffects',
        'MunchieTypes',
        'StatusConditions',
        'MunchiePhotos',
        'ItemPhotos',
        'LearnableMoves',
        'MunchieStats',
        'Business',
        'BusinessUsers',
        'BusinessRoles',
    ],
    endpoints: () => ({}),
});

export const {

    // Auth endpoints
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

    // Business endpoints
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
} = apiSlice;