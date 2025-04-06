//src/services/AuthTokenService.js
class AuthTokenService {
    // Define storage keys
    static isAuthenticatedKey = 'isAuthenticated';
    static userKey = 'user';
    static authTokenKey = 'authToken';
    static userRolesKey = 'userRoles';
    static userBusinessesKey = 'userBusinesses';
    static activeBusinessKey = 'activeBusiness';

    // Set authentication information in localStorage
    static setAuthInfo({ isAuthenticated, user, authToken, roles, businesses, activeBusiness }) {
        localStorage.setItem(this.isAuthenticatedKey, isAuthenticated);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        localStorage.setItem(this.authTokenKey, authToken);
        localStorage.setItem(this.userRolesKey, JSON.stringify(roles || []));
        localStorage.setItem(this.userBusinessesKey, JSON.stringify(businesses || []));
        localStorage.setItem(this.activeBusinessKey, JSON.stringify(activeBusiness || null));
    }

    // Get authentication information from localStorage
    static getAuthInfo() {
        const isAuthenticated = localStorage.getItem(this.isAuthenticatedKey) === 'true';
        const user = JSON.parse(localStorage.getItem(this.userKey) || '{}');
        const authToken = localStorage.getItem(this.authTokenKey);
        const roles = JSON.parse(localStorage.getItem(this.userRolesKey) || '[]');
        const businesses = JSON.parse(localStorage.getItem(this.userBusinessesKey) || '[]');
        const activeBusiness = JSON.parse(localStorage.getItem(this.activeBusinessKey) || 'null');

        return { 
            isAuthenticated, 
            user, 
            authToken,
            roles,
            businesses,
            activeBusiness
        };
    }

    // Clear authentication information from localStorage
    static clearAuthInfo() {
        localStorage.removeItem(this.isAuthenticatedKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.authTokenKey);
        localStorage.removeItem(this.userRolesKey);
        localStorage.removeItem(this.userBusinessesKey);
        localStorage.removeItem(this.activeBusinessKey);
    }

    // Parse and decode JWT token
    static parseToken() {
        const token = localStorage.getItem(this.authTokenKey);
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const decodedToken = JSON.parse(jsonPayload);
            
            // Update stored information with decoded token data
            this.setAuthInfo({
                isAuthenticated: true,
                user: {
                    id: decodedToken.id,
                    email: decodedToken.email,
                    phoneNumber: decodedToken.phoneNumber,
                    username: decodedToken.username
                },
                authToken: token,
                roles: decodedToken.roles || [],
                businesses: decodedToken.businesses || [],
                activeBusiness: decodedToken.activeBusiness || null
            });

            return decodedToken;
        } catch (e) {
            console.error("Error parsing token", e);
            return null;
        }
    }

    // Check if user has a specific role
    static hasRole(role) {
        const { roles } = this.getAuthInfo();
        return roles.includes(role);
    }

    // Check if user has any of the specified roles
    static hasAnyRole(roles) {
        const { roles: userRoles } = this.getAuthInfo();
        return roles.some(role => userRoles.includes(role));
    }

    // Get user's business role for a specific business
    static getBusinessRole(businessId) {
        const { businesses } = this.getAuthInfo();
        const business = businesses.find(b => b.id === businessId);
        return business ? business.role : null;
    }

    // Check if user has a specific role for a business
    static hasBusinessRole(businessId, role) {
        const businessRole = this.getBusinessRole(businessId);
        return businessRole === role;
    }

    // Get active business information
    static getActiveBusiness() {
        const { activeBusiness } = this.getAuthInfo();
        return activeBusiness;
    }

    // Check if user is a business owner
    static isBusinessOwner(businessId = null) {
        if (businessId) {
            return this.hasBusinessRole(businessId, 'owner');
        }
        const { businesses } = this.getAuthInfo();
        return businesses.some(business => business.role === 'owner');
    }

    // Check if user is an admin
    static isAdmin() {
        return this.hasRole('admin');
    }

    // Check if token is expired
    static isTokenExpired() {
        const decodedToken = this.parseToken();
        if (!decodedToken || !decodedToken.exp) return true;
        return Date.now() >= decodedToken.exp * 1000;
    }
}

export default AuthTokenService;
