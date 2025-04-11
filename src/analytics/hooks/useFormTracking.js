import { useState, useEffect, useRef } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { FORM_EVENTS } from '../constants/events';
import { sanitizeData } from '../utils/privacyUtils';

/**
 * Hook for tracking form interactions
 *
 * @param {Object} config - Form configuration
 * @returns {Object} - Form tracking handlers and data
 */
export const useFormTracking = (config) => {
    const {
        formId,
        formName,
        fields = [],
        trackFocus = true,
        trackBlur = true,
        trackChange = false,
        trackTime = true,
        sanitize = true,
        autoStart = true
    } = config;

    const { trackEvent } = useAnalytics();

    // Form state
    const [fieldValues, setFieldValues] = useState({});
    const [fieldInteractions, setFieldInteractions] = useState({});
    const [formStartTime, setFormStartTime] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Refs for tracking time
    const formStartTimeRef = useRef(null);
    const fieldFocusTimeRef = useRef({});
    const fieldInteractionCountRef = useRef({});

    // Initialize form tracking on mount
    useEffect(() => {
        if (autoStart) {
            startFormTracking();
        }

        // Track form abandonment on unmount if not submitted
        return () => {
            if (!formSubmitted && formStartTimeRef.current) {
                trackFormAbandon();
            }
        };
    }, [autoStart]);

    /**
     * Start tracking the form
     */
    const startFormTracking = () => {
        const startTime = Date.now();
        setFormStartTime(startTime);
        formStartTimeRef.current = startTime;

        // Initialize field tracking state
        const initialInteractions = {};
        const initialCounts = {};
        fields.forEach(field => {
            initialInteractions[field.name] = {
                focused: false,
                blurred: false,
                changed: false,
                focusCount: 0,
                lastFocused: null,
                lastBlurred: null
            };

            initialCounts[field.name] = {
                focusCount: 0,
                blurCount: 0,
                changeCount: 0,
                totalFocusTime: 0
            };
        });

        setFieldInteractions(initialInteractions);
        fieldInteractionCountRef.current = initialCounts;

        // Track form start
        trackEvent(FORM_EVENTS.START, {
            form_id: formId,
            form_name: formName,
            field_count: fields.length,
            available_fields: fields.map(f => f.name),
            timestamp: startTime
        });
    };

    /**
     * Handle field focus event
     */
    const handleFieldFocus = (fieldName, fieldType) => {
        if (!trackFocus) return;

        // Skip if form hasn't been started
        if (!formStartTimeRef.current) {
            startFormTracking();
        }

        // Update focus time tracking
        if (trackTime) {
            fieldFocusTimeRef.current[fieldName] = {
                focusStartTime: Date.now(),
                focusCount: (fieldFocusTimeRef.current[fieldName]?.focusCount || 0) + 1
            };
        }

        // Update interaction counters
        fieldInteractionCountRef.current[fieldName] = {
            ...fieldInteractionCountRef.current[fieldName],
            focusCount: (fieldInteractionCountRef.current[fieldName]?.focusCount || 0) + 1
        };

        // Update interaction state
        setFieldInteractions(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                focused: true,
                lastFocused: Date.now(),
                focusCount: (prev[fieldName]?.focusCount || 0) + 1
            }
        }));

        // Track the focus event
        trackEvent(FORM_EVENTS.FIELD_FOCUS, {
            form_id: formId,
            form_name: formName,
            field_name: fieldName,
            field_type: fieldType,
            focus_count: fieldInteractionCountRef.current[fieldName]?.focusCount,
            time_from_form_start_ms: Date.now() - formStartTimeRef.current
        });
    };

    /**
     * Handle field blur event
     */
    const handleFieldBlur = (fieldName, fieldType, value) => {
        if (!trackBlur) return;

        // Skip if form hasn't been started
        if (!formStartTimeRef.current) return;

        // Calculate focus duration
        let focusDuration = 0;
        if (trackTime && fieldFocusTimeRef.current[fieldName]) {
            focusDuration = Date.now() - fieldFocusTimeRef.current[fieldName].focusStartTime;

            // Update total focus time
            fieldInteractionCountRef.current[fieldName] = {
                ...fieldInteractionCountRef.current[fieldName],
                totalFocusTime:
                    (fieldInteractionCountRef.current[fieldName]?.totalFocusTime || 0) + focusDuration
            };

            // Clear current focus time
            fieldFocusTimeRef.current[fieldName].focusStartTime = null;
        }

        // Update interaction counters
        fieldInteractionCountRef.current[fieldName] = {
            ...fieldInteractionCountRef.current[fieldName],
            blurCount: (fieldInteractionCountRef.current[fieldName]?.blurCount || 0) + 1
        };

        // Store field value
        setFieldValues(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Update interaction state
        setFieldInteractions(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                focused: false,
                blurred: true,
                lastBlurred: Date.now(),
                blurCount: (prev[fieldName]?.blurCount || 0) + 1
            }
        }));

        // Sanitize value if needed for tracking
        const sanitizedValue = sanitize ? sanitizeFieldValue(value, fieldType) : value;

        // Track the blur event
        trackEvent(FORM_EVENTS.FIELD_BLUR, {
            form_id: formId,
            form_name: formName,
            field_name: fieldName,
            field_type: fieldType,
            has_value: !!value,
            is_empty: !value,
            value_length: typeof value === 'string' ? value.length : 0,
            sanitized_value: sanitizedValue,
            focus_duration_ms: focusDuration,
            blur_count: fieldInteractionCountRef.current[fieldName]?.blurCount,
            total_focus_time_ms: fieldInteractionCountRef.current[fieldName]?.totalFocusTime,
            time_from_form_start_ms: Date.now() - formStartTimeRef.current
        });
    };

    /**
     * Handle field change event
     */
    const handleFieldChange = (fieldName, fieldType, value) => {
        if (!trackChange) return;

        // Skip if form hasn't been started
        if (!formStartTimeRef.current) {
            startFormTracking();
        }

        // Update interaction counters
        fieldInteractionCountRef.current[fieldName] = {
            ...fieldInteractionCountRef.current[fieldName],
            changeCount: (fieldInteractionCountRef.current[fieldName]?.changeCount || 0) + 1
        };

        // Update value and interaction state
        setFieldValues(prev => ({
            ...prev,
            [fieldName]: value
        }));

        setFieldInteractions(prev => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                changed: true,
                changeCount: (prev[fieldName]?.changeCount || 0) + 1
            }
        }));

        // Sanitize value if needed
        const sanitizedValue = sanitize ? sanitizeFieldValue(value, fieldType) : value;

        // Track the change event
        trackEvent(FORM_EVENTS.FIELD_CHANGE, {
            form_id: formId,
            form_name: formName,
            field_name: fieldName,
            field_type: fieldType,
            has_value: !!value,
            value_length: typeof value === 'string' ? value.length : 0,
            sanitized_value: sanitizedValue,
            change_count: fieldInteractionCountRef.current[fieldName]?.changeCount,
            time_from_form_start_ms: Date.now() - formStartTimeRef.current
        });
    };

    /**
     * Track form validation errors
     */
    const handleValidationErrors = (errors) => {
        if (!formStartTimeRef.current) return;

        setFormErrors(errors);

        // Get error fields
        const errorFields = Object.keys(errors);

        // Track validation error event
        trackEvent(FORM_EVENTS.VALIDATION_ERROR, {
            form_id: formId,
            form_name: formName,
            error_count: errorFields.length,
            error_fields: errorFields,
            error_messages: Object.values(errors),
            time_from_form_start_ms: Date.now() - formStartTimeRef.current
        });
    };

    /**
     * Track form submission attempt
     */
    const handleSubmitAttempt = (isValid, errors = {}) => {
        if (!formStartTimeRef.current) return;

        // Set errors if any
        if (!isValid && Object.keys(errors).length > 0) {
            setFormErrors(errors);
        }

        // Calculate completion rate
        const completionRate = calculateCompletionRate();

        // Track submit attempt
        trackEvent(FORM_EVENTS.SUBMIT_ATTEMPT, {
            form_id: formId,
            form_name: formName,
            is_valid: isValid,
            error_count: Object.keys(errors).length,
            error_fields: Object.keys(errors),
            completion_rate: completionRate,
            filled_field_count: countFilledFields(),
            total_field_count: fields.length,
            time_to_submit_ms: Date.now() - formStartTimeRef.current
        });

        return isValid;
    };

    /**
     * Track successful form submission
     */
    const handleSubmitSuccess = (data = {}) => {
        if (!formStartTimeRef.current) return;

        // Mark form as submitted to prevent abandon tracking
        setFormSubmitted(true);

        // Sanitize submission data if needed
        const sanitizedData = sanitize ? sanitizeFormData(data) : data;

        // Calculate interaction metrics
        const interactionMetrics = {};
        Object.keys(fieldInteractionCountRef.current).forEach(fieldName => {
            const metrics = fieldInteractionCountRef.current[fieldName];
            interactionMetrics[`${fieldName}_metrics`] = {
                focus_count: metrics.focusCount || 0,
                blur_count: metrics.blurCount || 0,
                change_count: metrics.changeCount || 0,
                total_focus_time_ms: metrics.totalFocusTime || 0
            };
        });

        // Track submit success
        trackEvent(FORM_EVENTS.SUBMIT_SUCCESS, {
            form_id: formId,
            form_name: formName,
            time_to_complete_ms: Date.now() - formStartTimeRef.current,
            field_count: fields.length,
            filled_field_count: countFilledFields(),
            form_data: sanitizedData,
            interaction_metrics: interactionMetrics
        });

        return true;
    };

    /**
     * Track form submission failure
     */
    const handleSubmitFailure = (error) => {
        if (!formStartTimeRef.current) return;

        // Track submit failure
        trackEvent(FORM_EVENTS.SUBMIT_FAILURE, {
            form_id: formId,
            form_name: formName,
            error_message: error.message,
            time_from_form_start_ms: Date.now() - formStartTimeRef.current
        });

        return false;
    };

    /**
     * Track form abandonment
     */
    const trackFormAbandon = () => {
        // Calculate metrics
        const completionRate = calculateCompletionRate();
        const timeOnForm = Date.now() - formStartTimeRef.current;
        const lastField = findLastInteractedField();

        // Calculate interaction metrics
        const interactionMetrics = {};
        Object.keys(fieldInteractionCountRef.current).forEach(fieldName => {
            const metrics = fieldInteractionCountRef.current[fieldName];
            if (metrics.focusCount > 0) {
                interactionMetrics[`${fieldName}_metrics`] = {
                    focus_count: metrics.focusCount || 0,
                    blur_count: metrics.blurCount || 0,
                    change_count: metrics.changeCount || 0,
                    total_focus_time_ms: metrics.totalFocusTime || 0
                };
            }
        });

        // Track form abandon event
        trackEvent(FORM_EVENTS.ABANDON, {
            form_id: formId,
            form_name: formName,
            time_on_form_ms: timeOnForm,
            completion_rate: completionRate,
            filled_field_count: countFilledFields(),
            total_field_count: fields.length,
            last_field_interacted: lastField,
            interaction_metrics: interactionMetrics
        });
    };

    /**
     * Find the last field the user interacted with
     */
    const findLastInteractedField = () => {
        let lastField = null;
        let lastTime = 0;

        Object.entries(fieldInteractions).forEach(([fieldName, interaction]) => {
            const lastInteraction = Math.max(
                interaction.lastFocused || 0,
                interaction.lastBlurred || 0
            );

            if (lastInteraction > lastTime) {
                lastTime = lastInteraction;
                lastField = fieldName;
            }
        });

        return lastField;
    };

    /**
     * Count how many fields have been filled
     */
    const countFilledFields = () => {
        return fields
            .filter(field => {
                const value = fieldValues[field.name];
                return !!value && (typeof value !== 'string' || value.trim() !== '');
            })
            .length;
    };

    /**
     * Calculate form completion rate as a percentage
     */
    const calculateCompletionRate = () => {
        if (fields.length === 0) return 0;
        return Math.round((countFilledFields() / fields.length) * 100);
    };

    /**
     * Sanitize a field value based on field type
     */
    const sanitizeFieldValue = (value, fieldType) => {
        if (!value) return '';

        switch (fieldType) {
            case 'email':
                return '[EMAIL]';
            case 'password':
            case 'newPassword':
            case 'confirmPassword':
                return '[PASSWORD]';
            case 'creditCard':
            case 'cardNumber':
                return '[CREDIT_CARD]';
            case 'ssn':
                return '[SSN]';
            case 'phone':
            case 'phoneNumber':
                return '[PHONE]';
            case 'address':
                return '[ADDRESS]';
            default:
                return typeof value === 'string' && value.length > 0
                    ? `[VALUE_LENGTH_${value.length}]`
                    : typeof value;
        }
    };

    /**
     * Sanitize the entire form data for submission tracking
     */
    const sanitizeFormData = (data) => {
        if (!data) return {};

        const sanitized = {};
        const sensitiveFieldTypes = [
            'password', 'newPassword', 'confirmPassword',
            'email', 'creditCard', 'cardNumber',
            'ssn', 'phone', 'phoneNumber'
        ];

        Object.keys(data).forEach(key => {
            const fieldConfig = fields.find(f => f.name === key);
            const fieldType = fieldConfig?.type || 'text';

            if (sensitiveFieldTypes.includes(fieldType)) {
                sanitized[key] = sanitizeFieldValue(data[key], fieldType);
            } else if (sensitiveFieldTypes.includes(key)) {
                sanitized[key] = `[REDACTED_${key.toUpperCase()}]`;
            } else {
                sanitized[key] = data[key] ? (
                    typeof data[key] === 'string'
                        ? `[TEXT_LENGTH_${data[key].length}]`
                        : `[${typeof data[key]}]`
                ) : '';
            }
        });

        return sanitized;
    };

    return {
        // Form state
        fieldValues,
        fieldInteractions,
        formStartTime,
        formErrors,
        formSubmitted,

        // Event handlers
        handleFieldFocus,
        handleFieldBlur,
        handleFieldChange,
        handleValidationErrors,
        handleSubmitAttempt,
        handleSubmitSuccess,
        handleSubmitFailure,

        // Form metrics
        getCompletionRate: calculateCompletionRate,
        countFilledFields,

        // Manual control
        startTracking: startFormTracking,
        trackAbandon: trackFormAbandon
    };
};

export default useFormTracking;