import { useEffect, useCallback, useState } from 'react';

/**
 * Hook to warn users when trying to leave during active operations.
 * Handles browser close/refresh and provides a wrapper for dialog close handlers.
 *
 * @param {boolean} shouldWarn - Whether to show warning
 * @param {string} [message] - Warning message for browser beforeunload
 * @returns {Object} Control functions for exit warning
 */
export function useExitWarning(shouldWarn, message = 'You have unsaved changes. Are you sure you want to leave?') {
    const [showDialog, setShowDialog] = useState(false);
    const [pendingClose, setPendingClose] = useState(null);

    // Handle browser close/refresh with beforeunload event
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (shouldWarn) {
                e.preventDefault();
                // Modern browsers require returnValue to be set
                e.returnValue = message;
                return message;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [shouldWarn, message]);

    /**
     * Handle close attempt - shows confirmation if needed
     * @param {Function} closeCallback - Function to call if user confirms
     */
    const handleCloseAttempt = useCallback((closeCallback) => {
        if (shouldWarn) {
            setPendingClose(() => closeCallback);
            setShowDialog(true);
        } else {
            closeCallback();
        }
    }, [shouldWarn]);

    /**
     * Confirm the close action
     */
    const confirmClose = useCallback(() => {
        setShowDialog(false);
        if (pendingClose) {
            pendingClose();
            setPendingClose(null);
        }
    }, [pendingClose]);

    /**
     * Cancel the close action
     */
    const cancelClose = useCallback(() => {
        setShowDialog(false);
        setPendingClose(null);
    }, []);

    /**
     * Create a wrapped close handler that includes confirmation
     * @param {Function} onClose - Original close function
     * @returns {Function} Wrapped close function
     */
    const wrapCloseHandler = useCallback((onClose) => {
        return () => handleCloseAttempt(onClose);
    }, [handleCloseAttempt]);

    return {
        // State
        showDialog,
        shouldWarn,

        // Actions
        handleCloseAttempt,
        confirmClose,
        cancelClose,
        wrapCloseHandler
    };
}

export default useExitWarning;
