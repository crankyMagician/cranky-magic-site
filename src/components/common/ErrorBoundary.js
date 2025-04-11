import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary component to catch and handle errors in React components
 * Prevents the entire app from crashing when errors occur
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console (or to your error tracking service)
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        // Update state with error details
        this.setState({
            errorInfo
        });

        // Call onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    render() {
        const { hasError, error, errorInfo } = this.state;
        const { fallback, children, renderError } = this.props;

        if (hasError) {
            // If a custom render function was provided, use it
            if (renderError) {
                return renderError(error, errorInfo, this.resetError);
            }

            // Otherwise, use the fallback component
            return fallback || (
                <div style={{
                    padding: '20px',
                    margin: '20px',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24'
                }}>
                    <h2>Something went wrong</h2>
                    <p>The application encountered an error. Please try again or contact support if the problem persists.</p>
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                            <summary>Error Details</summary>
                            <p>{error?.toString()}</p>
                            <p>{errorInfo?.componentStack}</p>
                        </details>
                    )}
                    {this.props.showReset && (
                        <button
                            onClick={this.resetError}
                            style={{
                                marginTop: '10px',
                                padding: '8px 16px',
                                backgroundColor: '#721c24',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            );
        }

        // If there's no error, render children as normal
        return children;
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        // Call onReset callback if provided
        if (this.props.onReset) {
            this.props.onReset();
        }
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node,
    renderError: PropTypes.func,
    onError: PropTypes.func,
    onReset: PropTypes.func,
    showReset: PropTypes.bool
};

ErrorBoundary.defaultProps = {
    fallback: null,
    renderError: null,
    onError: null,
    onReset: null,
    showReset: false
};

export default ErrorBoundary;