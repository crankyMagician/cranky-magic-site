/**
 * Validates a password based on specified rules:
 * - Length: 8-12 characters
 * - Must contain at least one uppercase letter, one lowercase letter, one number, and one special character
 * - Must not contain spaces
 *
 * @param {string} password - The password to validate
 * @returns {object} Result of validation with success status and message
 */
const validatePassword = (password) => {
    if (!password) {
        return { success: false, message: "Password cannot be empty." };
    }

    // Check length
    if (password.length < 8 || password.length > 12) {
        return {
            success: false,
            message: "Password must be between 8 and 12 characters long."
        };
    }

    // Check for spaces
    if (/\s/.test(password)) {
        return { success: false, message: "Password must not contain spaces." };
    }

    // Check for required character types
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!upperCase || !lowerCase || !number || !specialChar) {
        return {
            success: false,
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        };
    }

    return { success: true, message: "Password is valid." };
};

export default validatePassword; 