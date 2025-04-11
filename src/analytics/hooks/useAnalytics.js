import { useContext } from 'react';
import { AnalyticsContext } from '../context/AnalyticsContext';
import { EVENTS } from '../constants/events';

/**
 * Main hook for using analytics throughout the application
 * Provides a simplified interface with specific tracking methods
 *
 * @returns {Object} - Analytics tracking methods and data
 */
const useAnalytics = () => {
    // Get the core analytics context
    const analytics = useContext(AnalyticsContext);

    // Ensure the hook is used within an AnalyticsProvider
    if (!analytics) {
        throw new Error('useAnalytics must be used within an AnalyticsProvider');
    }

    // Check if analytics are initialized
    const isInitialized = analytics.initialized;

    // Generic event tracking function from context
    const { trackEvent } = analytics;

    // Create simplified methods for specific event types

    // User interaction tracking
    const trackButtonClick = (buttonName, properties = {}) => {
        trackEvent(EVENTS.INTERACTION.CLICK, {
            element_type: 'button',
            element_name: buttonName,
            ...properties
        });
    };

    const trackLinkClick = (linkText, linkUrl, properties = {}) => {
        const isExternal = linkUrl && (
            linkUrl.startsWith('http') &&
            !linkUrl.includes(window.location.hostname)
        );

        trackEvent(
            isExternal ? EVENTS.INTERACTION.EXTERNAL_LINK_CLICK : EVENTS.INTERACTION.CLICK,
            {
                element_type: 'link',
                element_text: linkText,
                element_url: linkUrl,
                is_external: isExternal,
                ...properties
            }
        );
    };

    const trackElementClick = (elementType, elementName, properties = {}) => {
        trackEvent(EVENTS.INTERACTION.CLICK, {
            element_type: elementType,
            element_name: elementName,
            ...properties
        });
    };

    // Feature usage tracking
    const trackFeatureUse = (featureName, properties = {}) => {
        trackEvent(EVENTS.FEATURE.FEATURE_USE, {
            feature_name: featureName,
            ...properties
        });
    };

    const trackFeatureView = (featureName, properties = {}) => {
        trackEvent(EVENTS.FEATURE.FEATURE_VIEW, {
            feature_name: featureName,
            ...properties
        });
    };

    const trackFeatureComplete = (featureName, properties = {}) => {
        trackEvent(EVENTS.FEATURE.FEATURE_COMPLETE, {
            feature_name: featureName,
            ...properties
        });
    };

    // Funnel tracking
    const trackFunnelStep = (funnelName, stepName, stepNumber, properties = {}) => {
        trackEvent(EVENTS.FUNNEL.FUNNEL_STEP, {
            funnel_name: funnelName,
            step_name: stepName,
            step_number: stepNumber,
            ...properties
        });
    };

    const trackFunnelStart = (funnelName, properties = {}) => {
        trackEvent(EVENTS.FUNNEL.FUNNEL_START, {
            funnel_name: funnelName,
            ...properties
        });
    };

    const trackFunnelComplete = (funnelName, properties = {}) => {
        trackEvent(EVENTS.FUNNEL.FUNNEL_COMPLETE, {
            funnel_name: funnelName,
            ...properties
        });
    };

    const trackFunnelExit = (funnelName, exitStep, properties = {}) => {
        trackEvent(EVENTS.FUNNEL.FUNNEL_EXIT, {
            funnel_name: funnelName,
            exit_step: exitStep,
            ...properties
        });
    };

    // Authentication tracking
    const trackSignupStart = (properties = {}) => {
        trackEvent(EVENTS.AUTH.SIGNUP_START, properties);
    };

    const trackSignupComplete = (properties = {}) => {
        trackEvent(EVENTS.AUTH.SIGNUP_COMPLETE, properties);
    };

    const trackSignupFailure = (error, properties = {}) => {
        trackEvent(EVENTS.AUTH.SIGNUP_FAILURE, {
            error_message: error?.message || 'Unknown error',
            ...properties
        });
    };

    const trackLoginStart = (properties = {}) => {
        trackEvent(EVENTS.AUTH.LOGIN_START, properties);
    };

    const trackLoginSuccess = (properties = {}) => {
        trackEvent(EVENTS.AUTH.LOGIN_SUCCESS, properties);
    };

    const trackLoginFailure = (error, properties = {}) => {
        trackEvent(EVENTS.AUTH.LOGIN_FAILURE, {
            error_message: error?.message || 'Unknown error',
            ...properties
        });
    };

    const trackLogout = (properties = {}) => {
        trackEvent(EVENTS.AUTH.LOGOUT, properties);
    };

    // E-commerce tracking (if applicable)
    const trackProductView = (product, properties = {}) => {
        trackEvent(EVENTS.ECOMMERCE.PRODUCT_VIEW, {
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_category: product.category,
            ...properties
        });
    };

    const trackAddToCart = (product, quantity = 1, properties = {}) => {
        trackEvent(EVENTS.ECOMMERCE.ADD_TO_CART, {
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_category: product.category,
            quantity,
            ...properties
        });
    };

    const trackRemoveFromCart = (product, quantity = 1, properties = {}) => {
        trackEvent(EVENTS.ECOMMERCE.REMOVE_FROM_CART, {
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            quantity,
            ...properties
        });
    };

    const trackBeginCheckout = (cart, properties = {}) => {
        trackEvent(EVENTS.ECOMMERCE.BEGIN_CHECKOUT, {
            cart_size: cart.length,
            cart_value: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            ...properties
        });
    };

    const trackPurchase = (order, properties = {}) => {
        trackEvent(EVENTS.ECOMMERCE.PURCHASE, {
            order_id: order.id,
            order_value: order.total,
            currency: order.currency || 'USD',
            item_count: order.items?.length || 0,
            ...properties
        });
    };

    // Error tracking
    const trackError = (error, errorInfo = {}) => {
        analytics.trackError(error, errorInfo);
    };

    // Consent management
    const setConsent = (consentGiven) => {
        analytics.setConsent(consentGiven);
    };

    // Return simplified interface
    return {
        // Core methods from context
        trackEvent,
        trackPageView: analytics.trackPageView,
        trackApiCall: analytics.trackApiCall,
        trackError,
        identifyUser: analytics.identifyUser,
        setConsent,

        // State/data from context
        isInitialized,
        sessionId: analytics.sessionId,
        deviceInfo: analytics.deviceInfo,
        userProperties: analytics.userProperties,

        // User interactions
        trackButtonClick,
        trackLinkClick,
        trackElementClick,

        // Feature usage
        trackFeatureUse,
        trackFeatureView,
        trackFeatureComplete,

        // Funnel tracking
        trackFunnelStep,
        trackFunnelStart,
        trackFunnelComplete,
        trackFunnelExit,

        // Authentication
        trackSignupStart,
        trackSignupComplete,
        trackSignupFailure,
        trackLoginStart,
        trackLoginSuccess,
        trackLoginFailure,
        trackLogout,

        // E-commerce
        trackProductView,
        trackAddToCart,
        trackRemoveFromCart,
        trackBeginCheckout,
        trackPurchase,

        // Event constants
        EVENTS
    };
};

export default useAnalytics;