// commoApi.js
import baseApi, { getApiUrl, commoApi } from './baseApi';
import { transformServiceErrorResponse } from './baseApiHelpers';

export const commoApiExtended = commoApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send SMS
        sendSms: builder.mutation({
            query: (smsData) => ({
                url: getApiUrl('api/Commo/sms/send', 'main'),
                method: 'POST',
                body: smsData,
            }),
            // Commo endpoints return 200 with no body on success
            transformResponse: () => ({
                success: true,
                message: 'SMS sent successfully'
            }),
            transformErrorResponse: (response) => {
                // Handle ProblemDetails error format
                const defaultError = {
                    status: response?.status || 500,
                    message: 'Failed to send SMS',
                    details: null
                };

                if (!response || !response.data) {
                    return defaultError;
                }

                const errorData = response.data;

                // Handle ASP.NET Core ProblemDetails
                if (errorData.type || errorData.title || errorData.detail) {
                    return {
                        status: response.status || errorData.status,
                        message: errorData.detail || errorData.title || defaultError.message,
                        details: {
                            type: errorData.type,
                            title: errorData.title,
                            errors: errorData.errors
                        }
                    };
                }

                return {
                    status: response.status,
                    message: errorData.message || errorData.error || defaultError.message,
                    details: errorData
                };
            },
            invalidatesTags: ['Communication'],
        }),

        // Send Email
        sendEmail: builder.mutation({
            query: (emailData) => ({
                url: getApiUrl('api/Commo/email/send', 'main'),
                method: 'POST',
                body: emailData,
            }),
            // Commo endpoints return 200 with no body on success
            transformResponse: () => ({
                success: true,
                message: 'Email sent successfully'
            }),
            transformErrorResponse: (response) => {
                // Handle ProblemDetails error format
                const defaultError = {
                    status: response?.status || 500,
                    message: 'Failed to send email',
                    details: null
                };

                if (!response || !response.data) {
                    return defaultError;
                }

                const errorData = response.data;

                // Handle ASP.NET Core ProblemDetails
                if (errorData.type || errorData.title || errorData.detail) {
                    return {
                        status: response.status || errorData.status,
                        message: errorData.detail || errorData.title || defaultError.message,
                        details: {
                            type: errorData.type,
                            title: errorData.title,
                            errors: errorData.errors
                        }
                    };
                }

                return {
                    status: response.status,
                    message: errorData.message || errorData.error || defaultError.message,
                    details: errorData
                };
            },
            invalidatesTags: ['Communication'],
        }),
    }),
    overrideExisting: false,
});

// Export hooks
export const {
    useSendSmsMutation,
    useSendEmailMutation,
} = commoApiExtended;

// Export utility functions for communication
export const commoUtils = {
    /**
     * Format phone number for SMS
     * @param {string} phoneNumber - Raw phone number
     * @returns {string} - Formatted phone number
     */
    formatPhoneNumber: (phoneNumber) => {
        // Remove all non-digit characters
        const cleaned = phoneNumber.replace(/\D/g, '');

        // Add country code if not present (assuming US)
        if (cleaned.length === 10) {
            return `+1${cleaned}`;
        } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return `+${cleaned}`;
        }

        // Return as is if already has country code
        return phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    },

    /**
     * Validate phone number format
     * @param {string} phoneNumber - Phone number to validate
     * @returns {Object} - { isValid: boolean, error?: string }
     */
    validatePhoneNumber: (phoneNumber) => {
        if (!phoneNumber) {
            return { isValid: false, error: 'Phone number is required' };
        }

        // Basic validation - must have at least 10 digits
        const digits = phoneNumber.replace(/\D/g, '');
        if (digits.length < 10) {
            return { isValid: false, error: 'Phone number must have at least 10 digits' };
        }

        if (digits.length > 15) {
            return { isValid: false, error: 'Phone number is too long' };
        }

        return { isValid: true };
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {Object} - { isValid: boolean, error?: string }
     */
    validateEmail: (email) => {
        if (!email) {
            return { isValid: false, error: 'Email is required' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: 'Invalid email format' };
        }

        return { isValid: true };
    },

    /**
     * Create SMS request payload
     * @param {Object} data - SMS data
     * @returns {Object} - Formatted SMS request
     */
    createSmsRequest: (data) => {
        return {
            phoneNumber: commoUtils.formatPhoneNumber(data.phoneNumber),
            message: data.message.trim()
        };
    },

    /**
     * Create email request payload
     * @param {Object} data - Email data
     * @returns {Object} - Formatted email request
     */
    createEmailRequest: (data) => {
        return {
            to: data.to.trim(),
            subject: data.subject.trim(),
            content: data.content.trim()
        };
    },

    /**
     * Truncate SMS message to fit within limits
     * @param {string} message - SMS message
     * @param {number} limit - Character limit (default 160)
     * @returns {string} - Truncated message
     */
    truncateSmsMessage: (message, limit = 160) => {
        if (!message || message.length <= limit) {
            return message;
        }

        // Truncate and add ellipsis
        return message.substring(0, limit - 3) + '...';
    },

    /**
     * Count SMS segments
     * @param {string} message - SMS message
     * @returns {number} - Number of SMS segments
     */
    countSmsSegments: (message) => {
        if (!message) return 0;

        const length = message.length;

        // Single SMS can contain 160 characters
        if (length <= 160) return 1;

        // Multi-part SMS uses 153 characters per segment (7 chars for headers)
        return Math.ceil(length / 153);
    },

    /**
     * Sanitize HTML content for emails
     * @param {string} content - HTML content
     * @returns {string} - Sanitized HTML
     */
    sanitizeHtmlContent: (content) => {
        // Basic sanitization - in production, use a proper library like DOMPurify
        return content
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    },
};