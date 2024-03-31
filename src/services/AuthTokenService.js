//src/services/AuthTokenService.js
class AuthTokenService {
    // Define storage keys
    static isAuthenticatedKey = 'isAuthenticated';
    static userKey = 'user';
    static authTokenKey = 'authToken';

    // Set authentication information in localStorage
    static setAuthInfo({ isAuthenticated, user, authToken }) {
        localStorage.setItem(this.isAuthenticatedKey, isAuthenticated);
        localStorage.setItem(this.userKey, user);
        localStorage.setItem(this.authTokenKey, authToken);
    }

    // Get authentication information from localStorage
    static getAuthInfo() {
        const isAuthenticated = localStorage.getItem(this.isAuthenticatedKey) === 'true';
        const user = localStorage.getItem(this.userKey);
        const authToken = localStorage.getItem(this.authTokenKey);
        return { isAuthenticated, user, authToken };
    }

    // Clear authentication information from localStorage
    static clearAuthInfo() {
        localStorage.removeItem(this.isAuthenticatedKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.authTokenKey);
    }

    // Utility function for parsing JWT tokens remains the same as in TokenService
    static parseToken() {
        const token = localStorage.getItem(this.authTokenKey);
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Error parsing token", e);
            return null;
        }
    }
}

export default AuthTokenService;
