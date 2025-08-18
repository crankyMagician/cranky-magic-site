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
                businessesCount: businesses?.length || 0,
                activeBusinessId: activeBusiness?.id || null
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

            // Validate token if it exists and refresh auth info from token if needed
            if (authToken) {
                const isExpired = tokenExpiry && Date.now() >= parseInt(tokenExpiry) * 1000;
                if (isExpired) {
                    console.log('Token expired, clearing auth info');
                    this.clearAuthInfo();
                    return { isAuthenticated: false };
                }

                // If we have a token but missing activeBusiness, try to decode it
                if (isAuthenticated && (!activeBusiness || !activeBusiness.id) && businesses.length > 0) {
                    const decodedToken = TokenDecoder.decode(authToken);
                    if (decodedToken) {
                        const refreshedAuthInfo = this.extractAuthInfoFromToken(decodedToken, authToken);
                        if (refreshedAuthInfo.activeBusiness) {
                            console.log('Refreshed activeBusiness from token');
                            return refreshedAuthInfo;
                        }
                    }
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

    // Extract authentication information from decoded token (PUBLIC METHOD)
    static extractAuthInfoFromToken(decodedToken, authToken) {
        try {
            // Extract user information
            const user = {
                id: decodedToken.id,
                email: decodedToken.email,
                phoneNumber: decodedToken.phoneNumber,
                username: decodedToken.username
            };

            // Extract roles - handle both legacy and new token formats
            let roles = [];
            if (decodedToken.roles) {
                // Legacy format
                roles = decodedToken.roles;
            } else if (decodedToken.globalRoles) {
                // New format
                roles = decodedToken.globalRoles;
            }

            // Extract businesses - handle both legacy and new formats
            let businesses = [];
            if (decodedToken.businesses && Array.isArray(decodedToken.businesses)) {
                // New format with business objects
                businesses = decodedToken.businesses.map(business => ({
                    id: business.id,
                    name: business.name,
                    slug: business.slug,
                    role: business.role,
                    description: business.description || null,
                    externalId: business.externalId || null,
                    logoUrl: business.logoUrl || null,
                    permissions: business.permissions || []
                }));
            } else if (decodedToken.businessRoles) {
                // Legacy format or businessRoles object format
                const businessRoles = decodedToken.businessRoles;
                businesses = Object.keys(businessRoles).map(businessId => ({
                    id: parseInt(businessId, 10),
                    name: `Business ${businessId}`, // Fallback name
                    role: Array.isArray(businessRoles[businessId]) ? businessRoles[businessId][0] : businessRoles[businessId],
                    permissions: []
                }));
            }

            // Find active business
            let activeBusiness = null;
            if (decodedToken.activeBusinessId && businesses.length > 0) {
                // New format with activeBusinessId
                const activeBusinessId = parseInt(decodedToken.activeBusinessId, 10);
                activeBusiness = businesses.find(b => b.id === activeBusinessId) || null;
            } else if (decodedToken.activeBusiness) {
                // Legacy format with activeBusiness object
                activeBusiness = decodedToken.activeBusiness;
            } else if (businesses.length > 0) {
                // Fallback to first business if no active business specified
                activeBusiness = businesses[0];
            }

            const authInfo = {
                isAuthenticated: true,
                user,
                authToken,
                roles,
                businesses,
                activeBusiness,
                tokenExpiry: decodedToken.exp ? new Date(decodedToken.exp * 1000) : null
            };

            // Store the extracted information
            this.setAuthInfo(authInfo);

            return authInfo;
        } catch (error) {
            console.error('Error extracting auth info from token:', error);
            return null;
        }
    }

    // Parse and decode JWT token
    static parseToken() {
        const token = localStorage.getItem(this.authTokenKey);
        if (!token) return null;

        try {
            const decodedToken = TokenDecoder.decode(token);
            if (!decodedToken) return null;

            // Extract and store auth info from token
            const authInfo = this.extractAuthInfoFromToken(decodedToken, token);
            return authInfo ? decodedToken : null;
        } catch (e) {
            console.error("Error decoding token", e);
            return null;
        }
    }

    // Get active business ID (convenience method)
    static getActiveBusinessId() {
        const { activeBusiness } = this.getAuthInfo();
        return activeBusiness?.id || null;
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

    // Set active business (when user switches businesses)
    static setActiveBusiness(businessId) {
        try {
            const { businesses, ...authInfo } = this.getAuthInfo();
            const newActiveBusiness = businesses.find(b => b.id === businessId);

            if (newActiveBusiness) {
                this.setAuthInfo({
                    ...authInfo,
                    businesses,
                    activeBusiness: newActiveBusiness
                });
                return newActiveBusiness;
            }

            return null;
        } catch (error) {
            console.error('Error setting active business:', error);
            return null;
        }
    }
}

export default AuthTokenService;