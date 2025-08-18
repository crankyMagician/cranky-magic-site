// debug-panel/utils/AnalyticsDebugger.js
import { EVENT_TYPES } from '../utils/eventTypes';

/**
 * AnalyticsDebugger utility
 *
 * This class provides a bridge between the application's analytics system
 * and the debug panel, ensuring events are properly captured and displayed.
 */
class AnalyticsDebugger {
    constructor() {
        this.initialized = false;
        this.capturedEvents = [];
        this.originalMethods = {};
        this.listeners = [];
        this.isCapturing = true;
        this.eventCount = 0;
    }

    /**
     * Initialize the debugger by patching analytics methods
     * @param {Object} analytics - The analytics service instance
     */
    initialize(analytics) {
        if (this.initialized || !analytics) return;

        console.log('[AnalyticsDebugger] Initializing analytics debugging');

        // Store original analytics methods
        this.originalMethods = {
            trackEvent: analytics.trackEvent,
            trackPageView: analytics.trackPageView,
            trackError: analytics.trackError,
            trackApiCall: analytics.trackApiCall,
        };

        // Patch the trackEvent method
        analytics.trackEvent = (name, properties = {}) => {
            // Call the original method first
            this.originalMethods.trackEvent.call(analytics, name, properties);

            // Then capture the event for debugging
            this.captureEvent({
                name,
                properties: {
                    ...properties,
                    timestamp: properties.timestamp || Date.now(),
                    captured_by: 'analytics_debugger'
                },
                type: this.categorizeEvent(name)
            });
        };

        // Patch the trackPageView method
        analytics.trackPageView = (path, title, properties = {}) => {
            // Call the original method
            this.originalMethods.trackPageView.call(analytics, path, title, properties);

            // Then capture the event for debugging
            this.captureEvent({
                name: 'page_view',
                properties: {
                    path,
                    title,
                    ...properties,
                    timestamp: properties.timestamp || Date.now(),
                    captured_by: 'analytics_debugger'
                },
                type: 'page'
            });
        };

        // Patch the trackError method
        analytics.trackError = (error, errorInfo = {}) => {
            // Call the original method
            this.originalMethods.trackError.call(analytics, error, errorInfo);

            // Then capture the event for debugging
            this.captureEvent({
                name: 'error',
                properties: {
                    error_message: error?.message || String(error),
                    ...errorInfo,
                    timestamp: errorInfo.timestamp || Date.now(),
                    captured_by: 'analytics_debugger'
                },
                type: 'error'
            });
        };

        // Patch the trackApiCall method if it exists
        if (analytics.trackApiCall) {
            analytics.trackApiCall = (endpoint, method, status, properties = {}) => {
                // Call the original method
                this.originalMethods.trackApiCall.call(analytics, endpoint, method, status, properties);

                // Then capture the event for debugging
                this.captureEvent({
                    name: 'api_call',
                    properties: {
                        endpoint,
                        method,
                        status,
                        ...properties,
                        timestamp: properties.timestamp || Date.now(),
                        captured_by: 'analytics_debugger'
                    },
                    type: 'api'
                });
            };
        }

        // Create a custom event to notify the debug panel
        window.customEventBus = window.customEventBus || {
            dispatch: (eventName, detail) => {
                const event = new CustomEvent(eventName, { detail });
                window.dispatchEvent(event);
            }
        };

        this.initialized = true;
        console.log('[AnalyticsDebugger] Analytics debugging initialized successfully');
    }

    /**
     * Capture and process an analytics event
     * @param {Object} eventData - The event data to capture
     */
    captureEvent(eventData) {
        if (!this.isCapturing) return;

        const event = {
            id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            timestamp: Date.now(),
            ...eventData
        };

        // Add to the captured events list (limited to 100 most recent)
        this.capturedEvents = [event, ...this.capturedEvents].slice(0, 100);
        this.eventCount++;

        // Dispatch a custom event for the debug panel to listen to
        try {
            window.customEventBus.dispatch('analytics_event_captured', event);

            // Also dispatch the legacy event for backward compatibility
            window.dispatchEvent(new CustomEvent('analytics_event', { detail: event }));
        } catch (error) {
            console.error('[AnalyticsDebugger] Error dispatching event:', error);
        }

        // Notify listeners
        this.notifyListeners(event);
    }

    /**
     * Add a listener for analytics events
     * @param {Function} listener - Callback function for events
     * @returns {Function} - Function to remove the listener
     */
    addListener(listener) {
        if (typeof listener !== 'function') return () => {};

        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Notify all listeners about a new event
     * @param {Object} event - The event data
     */
    notifyListeners(event) {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('[AnalyticsDebugger] Error in event listener:', error);
            }
        });
    }

    /**
     * Categorize an event by its name
     * @param {String} eventName - The name of the event
     * @returns {String} - The event type category
     */
    categorizeEvent(eventName) {
        if (!eventName) return 'unknown';

        // Check against known event types
        for (const category in EVENT_TYPES) {
            if (EVENT_TYPES[category].includes(eventName)) {
                return category.toLowerCase();
            }
        }

        // Fallback to the original logic
        if (eventName.includes('page_') || eventName === 'page_view') return 'page';
        if (eventName.includes('click') || eventName.includes('button')) return 'interaction';
        if (eventName.includes('form_')) return 'form';
        if (eventName.includes('api_')) return 'api';
        if (eventName.includes('error') || eventName.includes('exception')) return 'error';
        if (eventName.includes('performance') || eventName.includes('_vital')) return 'performance';
        if (eventName.includes('scroll')) return 'scroll';
        if (eventName.includes('session')) return 'session';

        return 'other';
    }

    /**
     * Enable or disable event capturing
     * @param {Boolean} isEnabled - Whether capturing is enabled
     */
    setCapturing(isEnabled) {
        this.isCapturing = !!isEnabled;
    }

    /**
     * Clear captured events
     */
    clearEvents() {
        this.capturedEvents = [];
    }

    /**
     * Get all currently captured events
     * @returns {Array} - Array of captured events
     */
    getEvents() {
        return [...this.capturedEvents];
    }

    /**
     * Get the total count of events seen
     * @returns {Number} - Total event count
     */
    getEventCount() {
        return this.eventCount;
    }

    /**
     * Clean up and restore original analytics methods
     * @param {Object} analytics - The analytics service instance
     */
    cleanup(analytics) {
        if (!this.initialized || !analytics) return;

        // Restore original methods
        for (const [key, method] of Object.entries(this.originalMethods)) {
            if (analytics[key]) {
                analytics[key] = method;
            }
        }

        this.initialized = false;
        this.listeners = [];
    }
}

// Create and export a singleton instance
const analyticsDebugger = new AnalyticsDebugger();
export default analyticsDebugger;