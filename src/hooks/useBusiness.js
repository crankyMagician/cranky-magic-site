import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import {
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
    useBusinessSignupMutation,
} from '../api/controllers/businessApi';

export const useBusiness = (businessId) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // Business queries
    const { data: activeBusiness, isLoading: isLoadingActiveBusiness } = useGetActiveBusinessQuery(undefined, {
        skip: !isAuthenticated,
    });

    const { data: businessById, isLoading: isLoadingBusinessById } = useGetBusinessByIdQuery(businessId, {
        skip: !isAuthenticated || !businessId,
    });

    const { data: businessUsers, isLoading: isLoadingBusinessUsers } = useGetBusinessUsersQuery(businessId, {
        skip: !isAuthenticated || !businessId,
    });

    const { data: businessRoles, isLoading: isLoadingBusinessRoles } = useGetBusinessRolesQuery(businessId, {
        skip: !isAuthenticated || !businessId,
    });

    // Business mutations
    const [updateBusiness] = useUpdateBusinessMutation();
    const [setActiveBusiness] = useSetActiveBusinessMutation();
    const [inviteUserToBusiness] = useInviteUserToBusinessMutation();
    const [changeUserRole] = useChangeUserRoleMutation();
    const [removeUserFromBusiness] = useRemoveUserFromBusinessMutation();
    const [createBusinessRole] = useCreateBusinessRoleMutation();
    const [deleteBusinessRole] = useDeleteBusinessRoleMutation();
    const [businessSignup] = useBusinessSignupMutation();

    const handleBusinessSignup = async (data) => {
        try {
            const response = await businessSignup(data).unwrap();
            if (response.token) {
                // Handle successful signup (e.g., redirect to dashboard)
                navigate('/dashboard');
                return response;
            }
            return null;
        } catch (error) {
            console.error('Business signup error:', error);
            throw error;
        }
    };

    const handleSetActiveBusiness = async (businessId) => {
        try {
            const response = await setActiveBusiness(businessId).unwrap();
            // Handle successful active business change
            return response;
        } catch (error) {
            console.error('Set active business error:', error);
            throw error;
        }
    };

    return {
        // Queries
        activeBusiness,
        isLoadingActiveBusiness,
        businessById,
        isLoadingBusinessById,
        businessUsers,
        isLoadingBusinessUsers,
        businessRoles,
        isLoadingBusinessRoles,

        // Mutations
        updateBusiness,
        setActiveBusiness: handleSetActiveBusiness,
        inviteUserToBusiness,
        changeUserRole,
        removeUserFromBusiness,
        createBusinessRole,
        deleteBusinessRole,
        businessSignup: handleBusinessSignup,
    };
}; 