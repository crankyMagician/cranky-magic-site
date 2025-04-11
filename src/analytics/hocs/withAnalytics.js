import React, { Component } from 'react';
import { AnalyticsContext } from '../context/AnalyticsContext';

/**
 * Higher-Order Component that injects analytics methods into class components
 *
 * @param {React.Component} WrappedComponent - The component to wrap
 * @param {Object} options - Configuration options
 * @returns {React.Component} - Enhanced component with analytics
 */
const withAnalytics = (WrappedComponent, options = {}) => {
    const {
        trackMount = true,
        trackUnmount = true,
        trackProps = false,
        trackName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
    } = options;

    class WithAnalytics extends Component {
        // Allow access to the context
        static contextType = AnalyticsContext;

        constructor(props) {
            super(props);
            this.displayName = `WithAnalytics(${trackName})`;
        }

        componentDidMount() {
            // Track component mount if enabled
            if (trackMount && this.context && this.context.trackEvent) {
                this.context.trackEvent('component_mount', {
                    component_name: trackName,
                    component_props: trackProps ?
                        this.sanitizeProps(this.props) :
                        undefined
                });
            }
        }

        componentDidUpdate(prevProps) {
            // Track prop changes if enabled
            if (trackProps && this.context && this.context.trackEvent) {
                const changedProps = this.getChangedProps(prevProps, this.props);

                if (Object.keys(changedProps).length > 0) {
                    this.context.trackEvent('component_update', {
                        component_name: trackName,
                        changed_props: this.sanitizeProps(changedProps)
                    });
                }
            }
        }

        componentWillUnmount() {
            // Track component unmount if enabled
            if (trackUnmount && this.context && this.context.trackEvent) {
                this.context.trackEvent('component_unmount', {
                    component_name: trackName
                });
            }
        }

        /**
         * Compare previous and current props to detect changes
         */
        getChangedProps(prevProps, currentProps) {
            const changedProps = {};

            // Get all props from both objects
            const allPropNames = [
                ...new Set([
                    ...Object.keys(prevProps),
                    ...Object.keys(currentProps)
                ])
            ];

            // Find changed props
            allPropNames.forEach(propName => {
                // Skip React's special props
                if (propName === 'children') return;

                // Check if the prop has changed
                if (prevProps[propName] !== currentProps[propName]) {
                    changedProps[propName] = currentProps[propName];
                }
            });

            return changedProps;
        }

        /**
         * Sanitize props for safe tracking
         * Remove functions, React elements, and sensitive data
         */
        sanitizeProps(props) {
            const sanitizedProps = {};

            Object.keys(props).forEach(propName => {
                // Skip children and functions
                if (propName === 'children') {
                    sanitizedProps[propName] = React.isValidElement(props[propName]) ?
                        '[React Element]' :
                        Array.isArray(props[propName]) ?
                            `[Array of ${props[propName].length} elements]` :
                            props[propName] ? '[React Node]' : null;
                    return;
                }

                // Skip functions
                if (typeof props[propName] === 'function') {
                    sanitizedProps[propName] = '[Function]';
                    return;
                }

                // Handle objects and arrays
                if (typeof props[propName] === 'object' && props[propName] !== null) {
                    // Check for React elements
                    if (React.isValidElement(props[propName])) {
                        sanitizedProps[propName] = '[React Element]';
                    }
                    // Handle arrays
                    else if (Array.isArray(props[propName])) {
                        sanitizedProps[propName] = `[Array(${props[propName].length})]`;
                    }
                    // Handle plain objects
                    else {
                        try {
                            sanitizedProps[propName] = '[Object]';
                        } catch (error) {
                            sanitizedProps[propName] = '[Unsupported Object]';
                        }
                    }
                    return;
                }

                // Include primitive values directly
                sanitizedProps[propName] = props[propName];
            });

            return sanitizedProps;
        }

        render() {
            // Create analytics API to pass to wrapped component
            const analytics = this.context || {};

            // Pass the analytics through to the wrapped component as a prop
            return <WrappedComponent
                {...this.props}
                analytics={analytics}
            />;
        }
    }

    // Set display name for debugging
    WithAnalytics.displayName = `WithAnalytics(${trackName})`;

    return WithAnalytics;
};

export default withAnalytics;