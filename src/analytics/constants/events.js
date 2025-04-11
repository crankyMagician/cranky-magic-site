/**
 * Standardized analytics event names
 *
 * Using constants ensures consistency across the application
 * and prevents typos in event names.
 */

// Session events
export const SESSION_EVENTS = {
    START: 'session_start',
    END: 'session_end',
    HEARTBEAT: 'session_heartbeat',
    USER_ACTIVE: 'user_active',
    USER_INACTIVE: 'user_inactive'
};

// Page view events
export const PAGE_EVENTS = {
    VIEW: 'page_view',
    EXIT: 'page_exit',
    VISIBILITY_CHANGE: 'page_visibility_change',
    TIME_ON_PAGE: 'time_on_page'
};

// Scroll events
export const SCROLL_EVENTS = {
    DEPTH: 'scroll_depth',
    FINAL_DEPTH: 'final_scroll_depth'
};

// User interaction events
export const INTERACTION_EVENTS = {
    CLICK: 'click',
    HOVER: 'hover',
    DRAG: 'drag',
    COPY: 'copy',
    PASTE: 'paste',
    KEY_PRESS: 'key_press',
    FILE_DOWNLOAD: 'file_download',
    FILE_UPLOAD: 'file_upload',
    EXTERNAL_LINK_CLICK: 'external_link_click',
    VIDEO_PLAY: 'video_play',
    VIDEO_PAUSE: 'video_pause',
    VIDEO_COMPLETE: 'video_complete',
    VIDEO_PROGRESS: 'video_progress',
    EXIT_INTENT: 'exit_intent'
};

// Form events
export const FORM_EVENTS = {
    START: 'form_start',
    FIELD_FOCUS: 'form_field_focus',
    FIELD_BLUR: 'form_field_blur',
    FIELD_CHANGE: 'form_field_change',
    VALIDATION_ERROR: 'form_validation_error',
    SUBMIT_ATTEMPT: 'form_submit_attempt',
    SUBMIT_SUCCESS: 'form_submit_success',
    SUBMIT_FAILURE: 'form_submit_failure',
    ABANDON: 'form_abandon'
};

// Authentication events
export const AUTH_EVENTS = {
    SIGNUP_START: 'signup_start',
    SIGNUP_COMPLETE: 'signup_complete',
    SIGNUP_FAILURE: 'signup_failure',
    LOGIN_START: 'login_start',
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILURE: 'login_failure',
    LOGOUT: 'logout',
    PASSWORD_RESET_REQUEST: 'password_reset_request',
    PASSWORD_RESET_COMPLETE: 'password_reset_complete',
    PASSWORD_CHANGE: 'password_change'
};

// E-commerce events (if applicable)
export const ECOMMERCE_EVENTS = {
    PRODUCT_VIEW: 'product_view',
    PRODUCT_CLICK: 'product_click',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    BEGIN_CHECKOUT: 'begin_checkout',
    CHECKOUT_STEP: 'checkout_step',
    CHECKOUT_COMPLETE: 'checkout_complete',
    PURCHASE: 'purchase',
    REFUND: 'refund'
};

// API events
export const API_EVENTS = {
    REQUEST: 'api_request',
    RESPONSE: 'api_response',
    ERROR: 'api_error',
    LATENCY: 'api_latency'
};

// Performance events
export const PERFORMANCE_EVENTS = {
    WEB_VITAL: 'web_vital',
    RESOURCE_LOAD: 'resource_load',
    MEMORY_USAGE: 'memory_usage',
    PERFORMANCE_METRICS: 'performance_metrics',
    RESOURCE_PERFORMANCE: 'resource_performance'
};

// Error events
export const ERROR_EVENTS = {
    JAVASCRIPT_ERROR: 'javascript_error',
    NETWORK_ERROR: 'network_error',
    API_ERROR: 'api_error',
    VALIDATION_ERROR: 'validation_error',
    UNHANDLED_REJECTION: 'unhandled_rejection'
};

// Feature usage events
export const FEATURE_EVENTS = {
    FEATURE_VIEW: 'feature_view',
    FEATURE_USE: 'feature_use',
    FEATURE_COMPLETE: 'feature_complete',
    FEATURE_EXIT: 'feature_exit'
};

// Funnel events - customize based on your specific business flows
export const FUNNEL_EVENTS = {
    FUNNEL_START: 'funnel_start',
    FUNNEL_STEP: 'funnel_step',
    FUNNEL_COMPLETE: 'funnel_complete',
    FUNNEL_EXIT: 'funnel_exit'
};

// Consent events
export const CONSENT_EVENTS = {
    CONSENT_PROMPT_SHOWN: 'consent_prompt_shown',
    CONSENT_GIVEN: 'consent_given',
    CONSENT_DECLINED: 'consent_declined',
    CONSENT_CHANGED: 'consent_changed'
};

// Business-specific events - customize based on your business needs
export const BUSINESS_EVENTS = {
    BUSINESS_SIGNUP: 'business_signup_complete',
    BUSINESS_PROFILE_UPDATE: 'business_profile_update',
    BUSINESS_USER_INVITE: 'business_user_invite',
    BUSINESS_USER_JOIN: 'business_user_join'
};

// Export all events in a single object 
export const EVENTS = {
    SESSION: SESSION_EVENTS,
    PAGE: PAGE_EVENTS,
    SCROLL: SCROLL_EVENTS,
    INTERACTION: INTERACTION_EVENTS,
    FORM: FORM_EVENTS,
    AUTH: AUTH_EVENTS,
    ECOMMERCE: ECOMMERCE_EVENTS,
    API: API_EVENTS,
    PERFORMANCE: PERFORMANCE_EVENTS,
    ERROR: ERROR_EVENTS,
    FEATURE: FEATURE_EVENTS,
    FUNNEL: FUNNEL_EVENTS,
    CONSENT: CONSENT_EVENTS,
    BUSINESS: BUSINESS_EVENTS
};

export default EVENTS;