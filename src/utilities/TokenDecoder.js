import { jwtDecode } from 'jwt-decode';

class TokenDecoder {
    /**
     * Decodes a JWT token
     * @param {string} token - The JWT token to decode
     * @returns {Object|null} The decoded token payload or null if invalid
     */
    static decode(token) {
        try {
            const decoded = jwtDecode(token);
            if (!decoded) {
                throw new Error('Invalid token format');
            }
            return decoded;
        } catch (error) {
            console.error('Failed to decode token:', error.message);
            return null;
        }
    }

    /**
     * Verifies and decodes a JWT token using the secret key
     * @param {string} token - The JWT token to verify
     * @param {string} [secret=process.env.JWT_SECRET] - The secret key to use for verification
     * @returns {Object|null} The verified and decoded token payload or null if invalid
     */
    static verify(token, secret = process.env.REACT_APP_JWT_SECRET) {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error('Failed to verify token:', error.message);
            return null;
        }
    }

    /**
     * Checks if a token is expired
     * @param {string} token - The JWT token to check
     * @returns {boolean} True if the token is expired, false otherwise
     */
    static isExpired(token) {
        const decoded = this.decode(token);
        if (!decoded || !decoded.exp) return true;
        return Date.now() >= decoded.exp * 1000;
    }

    /**
     * Gets the expiration time of a token
     * @param {string} token - The JWT token to check
     * @returns {Date|null} The expiration date or null if invalid
     */
    static getExpirationDate(token) {
        const decoded = this.decode(token);
        if (!decoded || !decoded.exp) return null;
        return new Date(decoded.exp * 1000);
    }

    /**
     * Gets the time remaining until token expiration
     * @param {string} token - The JWT token to check
     * @returns {number|null} The time remaining in milliseconds or null if invalid
     */
    static getTimeRemaining(token) {
        const expDate = this.getExpirationDate(token);
        if (!expDate) return null;
        return expDate.getTime() - Date.now();
    }

    /**
     * Pretty prints a decoded token
     * @param {string} token - The JWT token to decode and print
     * @param {boolean} [verify=false] - Whether to verify the token
     * @param {string} [secret=process.env.JWT_SECRET] - The secret key to use for verification
     */
    static prettyPrint(token, verify = false, secret = process.env.REACT_APP_JWT_SECRET) {
        try {
            const decoded = verify ? this.verify(token, secret) : this.decode(token);
            if (!decoded) {
                console.error('Invalid token');
                return;
            }

            console.log(`Token ${verify ? 'verified' : 'decoded'} successfully!`);
            console.log(JSON.stringify(decoded, null, 2));

            if (decoded.exp) {
                const expDate = new Date(decoded.exp * 1000);
                const timeRemaining = this.getTimeRemaining(token);
                console.log(`\nToken expires: ${expDate.toLocaleString()}`);
                console.log(`Time remaining: ${Math.floor(timeRemaining / 1000 / 60)} minutes`);
            }
        } catch (error) {
            console.error(`Failed to ${verify ? 'verify' : 'decode'} token:`, error.message);
        }
    }
}

export default TokenDecoder; 