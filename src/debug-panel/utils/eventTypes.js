// debug-panel/constants/eventTypes.js

/**
 * Event type color mapping for the debug panel
 */
export const getEventTypeColor = (type) => {
    switch (type.toLowerCase()) {
        case 'page':
            return '#4CAF50'; // Green
        case 'interaction':
            return '#2196F3'; // Blue
        case 'form':
            return '#9C27B0'; // Purple
        case 'api':
            return '#FF9800'; // Orange
        case 'error':
            return '#F44336'; // Red
        case 'performance':
            return '#00BCD4'; // Cyan
        case 'scroll':
            return '#795548'; // Brown
        case 'session':
            return '#607D8B'; // Blue Grey
        default:
            return '#9E9E9E'; // Grey
    }
};

/**
 * Event type categorization
 */
export const EVENT_TYPES = {
    PAGE: [
        'page_view',
        'page_load',
        'page_exit',
        'page_scroll',
        'page_visibility_change'
    ],
    INTERACTION: [
        'click',
        'button_click',
        'link_click',
        'element_click',
        'menu_open',
        'menu_close',
        'dialog_open',
        'dialog_close',
        'tab_change',
        'external_link_click'
    ],
    FORM: [
        'form_start',
        'form_submit',
        'form_submit_success',
        'form_submit_failure',
        'form_field_focus',
        'form_field_blur',
        'form_field_change',
        'form_validation_error',
        'form_abandon'
    ],
    API: [
        'api_request',
        'api_response',
        'api_error',
        'api_call'
    ],
    ERROR: [
        'error',
        'exception',
        'validation_error',
        'auth_error',
        'network_error'
    ],
    PERFORMANCE: [
        'performance_metric',
        'web_vital',
        'resource_performance',
        'memory_usage'
    ],
    SCROLL: [
        'scroll_depth',
        'scroll_up',
        'scroll_down',
        'scroll_to_element'
    ],
    SESSION: [
        'session_start',
        'session_end',
        'session_heartbeat',
        'user_active',
        'user_inactive',
        'visibility_change'
    ],
    AUTH: [
        'auth_login_start',
        'auth_login_success',
        'auth_login_failure',
        'auth_logout',
        'auth_signup_start',
        'auth_signup_complete',
        'auth_signup_failure',
        'auth_password_reset',
        'auth_password_change'
    ],
    DEBUG: [
        'debug_api_test',
        'debug_api_test_success',
        'debug_api_test_failure',
        'debug_test_event',
        'debug_panel_position_reset',
        'debug_config_change',
        'debug_clear_events',
        'debug_apply_config',
        'debug_refresh_performance',
        'debug_reset_form',
        'debug_generate_test_error',
        'debug_auth_method_change',
        'debug_test_type_change',
        'debug_view_analytics'
    ]
};

export default {
    getEventTypeColor,
    EVENT_TYPES
};