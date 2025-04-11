//src/services/AuthTokenService.js
import TokenDecoder from '../utilities/TokenDecoder';

class AuthTokenService {
    // Define storage keys
    static isAuthenticatedKey = 'isAuthenticated';
    static userKey = 'user';
    static authTokenKey = 'authToken';
    static userRolesKey = 'userRoles';
    static userBusinessesKey = 'userBusinesses';
    static activeBusinessKey = 'activeBusiness';
    static tokenExpiryKey = 'tokenExpiry';

    // Set authentication information in localStorage
    static setAuthInfo({ isAuthenticated, user, authToken, roles, businesses, activeBusiness }) {
        try {
            // Store basic auth info
            localStorage.setItem(this.isAuthenticatedKey, isAuthenticated);
            localStorage.setItem(this.userKey, JSON.stringify(user));
            localStorage.setItem(this.authTokenKey, authToken);

            // Store roles and businesses
            localStorage.setItem(this.userRolesKey, JSON.stringify(roles || []));
            localStorage.setItem(this.userBusinessesKey, JSON.stringify(businesses || []));
            localStorage.setItem(this.activeBusinessKey, JSON.stringify(activeBusiness || null));

            // If we have a token, decode and store its expiry
            if (authToken) {
                const decodedToken = TokenDecoder.decode(authToken);
                if (decodedToken?.exp) {
                    localStorage.setItem(this.tokenExpiryKey, decodedToken.exp.toString());
                }
            }

            console.log('Auth info stored successfully:', {
                isAuthenticated,
                userId: user?.id,
                hasToken: !!authToken,
                rolesCount: roles?.length || 0,
                businessesCount: businesses?.length || 0
            });
        } catch (error) {
            console.error('Error storing auth info:', error);
        }
    }

    // Get authentication information from localStorage
    static getAuthInfo() {
        try {
            const isAuthenticated = localStorage.getItem(this.isAuthenticatedKey) === 'true';
            const user = JSON.parse(localStorage.getItem(this.userKey) || '{}');
            const authToken = localStorage.getItem(this.authTokenKey);
            const roles = JSON.parse(localStorage.getItem(this.userRolesKey) || '[]');
            const businesses = JSON.parse(localStorage.getItem(this.userBusinessesKey) || '[]');
            const activeBusiness = JSON.parse(localStorage.getItem(this.activeBusinessKey) || 'null');
            const tokenExpiry = localStorage.getItem(this.tokenExpiryKey);

            // Validate token if it exists
            if (authToken) {
                const isExpired = tokenExpiry && Date.now() >= parseInt(tokenExpiry) * 1000;
                if (isExpired) {
                    console.log('Token expired, clearing auth info');
                    this.clearAuthInfo();
                    return { isAuthenticated: false };
                }
            }

            return { 
                isAuthenticated, 
                user, 
                authToken,
                roles,
                businesses,
                activeBusiness,
                tokenExpiry: tokenExpiry ? new Date(parseInt(tokenExpiry) * 1000) : null
            };
        } catch (error) {
            console.error('Error retrieving auth info:', error);
            return { isAuthenticated: false };
        }
    }

    // Clear authentication information from localStorage
    static clearAuthInfo() {
        try {
            localStorage.removeItem(this.isAuthenticatedKey);
            localStorage.removeItem(this.userKey);
            localStorage.removeItem(this.authTokenKey);
            localStorage.removeItem(this.userRolesKey);
            localStorage.removeItem(this.userBusinessesKey);
            localStorage.removeItem(this.activeBusinessKey);
            localStorage.removeItem(this.tokenExpiryKey);
            console.log('Auth info cleared successfully');
        } catch (error) {
            console.error('Error clearing auth info:', error);
        }
    }

    // Parse and decode JWT token
    static parseToken() {
        const token = localStorage.getItem(this.authTokenKey);
        if (!token) return null;

        try {
            const decodedToken = TokenDecoder.decode(token);
            if (!decodedToken) return null;
            
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
            console.error("Error decoding token", e);
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
        const token = localStorage.getItem(this.authTokenKey);
        if (!token) return true;
        return TokenDecoder.isExpired(token);
    }

    // Get token expiration date
    static getTokenExpirationDate() {
        const token = localStorage.getItem(this.authTokenKey);
        if (!token) return null;
        return TokenDecoder.getExpirationDate(token);
    }

    // Get time remaining until token expiration
    static getTokenTimeRemaining() {
        const token = localStorage.getItem(this.authTokenKey);
        if (!token) return null;
        return TokenDecoder.getTimeRemaining(token);
    }

    // Pretty print token information (for debugging)
    static prettyPrintToken(verify = false) {
        const token = localStorage.getItem(this.authTokenKey);
        if (!token) {
            console.error('No token found');
            return;
        }
        TokenDecoder.prettyPrint(token, verify);
    }
}

export default AuthTokenService;
