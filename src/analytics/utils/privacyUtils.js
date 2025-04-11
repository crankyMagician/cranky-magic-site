/**
 * Utility functions for handling privacy concerns in analytics data
 */

// List of fields that should always be sanitized or excluded
const SENSITIVE_FIELD_NAMES = [
    'password', 'newPassword', 'confirmPassword', 'currentPassword',
    'secret', 'token', 'accessToken', 'refreshToken', 'apiKey', 'api_key',
    'creditCard', 'cardNumber', 'cvv', 'cvc', 'ssn', 'socialSecurity',
    'authToken', 'auth_token', 'jwt'
];

// Regular expressions for identifying common PII patterns
const PII_PATTERNS = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    creditCard: /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/g,
    ssn: /\d{3}[-\s]?\d{2}[-\s]?\d{4}/g,
    ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    password: /password[=:]\S+/gi
};

/**
 * Sanitize data by removing or masking PII and sensitive information
 * @param {Object|Array|string} data - The data to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object|Array|string} - Sanitized data
 */
export const sanitizeData = (data, options = {}) => {
    if (!data) return data;

    const {
        maskEmails = true,
        maskPhoneNumbers = true,
        maskCreditCards = true,
        maskSsn = true,
        maskIpAddresses = true,
        removePasswords = true,
        removeSensitiveFields = true,
        customPatterns = {},
        customFields = []
    } = options;

    // Deep clone the data to avoid modifying the original
    const sanitized = JSON.parse(JSON.stringify(data));

    // Combine default and custom patterns based on options
    const patterns = {};
    if (maskEmails) patterns.email = PII_PATTERNS.email;
    if (maskPhoneNumbers) patterns.phone = PII_PATTERNS.phone;
    if (maskCreditCards) patterns.creditCard = PII_PATTERNS.creditCard;
    if (maskSsn) patterns.ssn = PII_PATTERNS.ssn;
    if (maskIpAddresses) patterns.ipAddress = PII_PATTERNS.ipAddress;
    if (removePasswords) patterns.password = PII_PATTERNS.password;

    // Add custom patterns
    Object.assign(patterns, customPatterns);

    // Combine default and custom sensitive fields
    const sensitiveFields = removeSensitiveFields
        ? [...SENSITIVE_FIELD_NAMES, ...customFields]
        : [...customFields];

    // Process the data recursively
    const processValue = (value, path = '') => {
        // Handle different data types
        if (typeof value === 'string') {
            // Replace PII patterns with placeholders
            let sanitizedValue = value;
            Object.entries(patterns).forEach(([type, pattern]) => {
                sanitizedValue = sanitizedValue.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
            });
            return sanitizedValue;

        } else if (Array.isArray(value)) {
            // Process each array item
            return value.map((item, index) => processValue(item, `${path}[${index}]`));

        } else if (typeof value === 'object' && value !== null) {
            // Process each object property
            const processed = {};
            for (const [key, val] of Object.entries(value)) {
                // Check if field should be sanitized
                if (sensitiveFields.includes(key)) {
                    processed[key] = '[REDACTED]';
                } else {
                    processed[key] = processValue(val, path ? `${path}.${key}` : key);
                }
            }
            return processed;
        }

        // Return non-string primitive values as is
        return value;
    };

    return processValue(sanitized);
};

/**
 * Check if the data contains any sensitive information
 * @param {Object|Array|string} data - The data to check
 * @returns {boolean} - True if sensitive data is detected
 */
export const containsSensitiveData = (data) => {
    if (!data) return false;

    try {
        // Convert to string for simple pattern matching
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);

        // Check for PII patterns
        for (const pattern of Object.values(PII_PATTERNS)) {
            if (pattern.test(dataStr)) return true;
        }

        // If it's an object, check for sensitive field names
        if (typeof data === 'object' && data !== null) {
            const checkObject = (obj) => {
                for (const key in obj) {
                    // Check if this is a sensitive field name
                    if (SENSITIVE_FIELD_NAMES.includes(key)) return true;

                    // Recursively check nested objects
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        if (checkObject(obj[key])) return true;
                    }
                }
                return false;
            };

            return checkObject(data);
        }

        return false;
    } catch (error) {
        console.error('Error checking for sensitive data:', error);
        // Be conservative and assume it might contain sensitive data
        return true;
    }
};

/**
 * Generate a privacy consent banner/message for users
 * @returns {Object} - Consent message object
 */
export const generateConsentMessage = () => {
    return {
        title: 'We value your privacy',
        message: 'We use analytics cookies to understand how you use our site and to improve your experience. ' +
            'By continuing to use our site, you accept our use of analytics cookies and our privacy policy.',
        acceptButton: 'Accept',
        rejectButton: 'Reject',
        privacyPolicyLink: '/privacy-policy'
    };
};

/**
 * Check if user has already provided consent for analytics
 * @returns {boolean} - True if user has given consent
 */
export const hasAnalyticsConsent = () => {
    try {
        return localStorage.getItem('analytics_consent') === 'true';
    } catch (error) {
        console.error('Error checking analytics consent:', error);
        return false;
    }
};

/**
 * Set user's analytics consent status
 * @param {boolean} consentGiven - Whether consent was given
 */
export const setAnalyticsConsent = (consentGiven) => {
    try {
        localStorage.setItem('analytics_consent', consentGiven ? 'true' : 'false');
    } catch (error) {
        console.error('Error setting analytics consent:', error);
    }
};