// debug-panel/hooks/useDraggable.js
import { useEffect, useRef } from 'react';

/**
 * A simplified draggable hook that makes any element draggable by its handle
 *
 * @param {React.RefObject} dragHandleRef - Reference to the element that will be used as drag handle
 * @param {Function} onPositionChange - Callback function called when the draggable element position changes
 * @param {Function} setIsDragging - Optional state setter for tracking dragging state
 * @returns {void}
 */
const useDraggable = (dragHandleRef, onPositionChange, setIsDragging) => {
    useEffect(() => {
        // Skip if ref is not available
        if (!dragHandleRef || !dragHandleRef.current) return;

        // Get the header element (draggable area)
        const header = dragHandleRef.current;

        // Initialize panel variable
        let panel = null;

        // Tracking state
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;

        // Handle mousedown event on header
        const handleMouseDown = (e) => {
            // Ignore clicks on buttons or SVG icons to allow proper interaction
            if (e.target.tagName === 'BUTTON' || e.target.closest('button') ||
                e.target.tagName === 'svg' || e.target.closest('svg')) {
                return;
            }

            // Find the parent panel element
            panel = header.closest('.MuiPaper-root');
            if (!panel) {
                console.error('Could not find parent Paper component for dragging');
                return;
            }

            // Start dragging
            isDragging = true;
            if (setIsDragging) setIsDragging(true);

            // Apply visual cues
            document.body.style.cursor = 'grabbing';
            header.style.cursor = 'grabbing';

            // Store starting positions
            startX = e.clientX;
            startY = e.clientY;

            // Get computed styles
            const computedStyle = window.getComputedStyle(panel);

            // Determine current position - important to handle right/bottom vs left/top
            startLeft = parseInt(computedStyle.left) || 0;
            startTop = parseInt(computedStyle.top) || 0;

            // If panel was positioned using bottom/right, convert to left/top
            if (computedStyle.left === 'auto' && computedStyle.right !== 'auto') {
                const parentRect = document.body.getBoundingClientRect();
                const panelRect = panel.getBoundingClientRect();
                startLeft = parentRect.width - panelRect.width - parseInt(computedStyle.right);
            }

            if (computedStyle.top === 'auto' && computedStyle.bottom !== 'auto') {
                const parentRect = document.body.getBoundingClientRect();
                const panelRect = panel.getBoundingClientRect();
                startTop = parentRect.height - panelRect.height - parseInt(computedStyle.bottom);
            }

            // Set fixed position to enable dragging
            panel.style.position = 'fixed';
            panel.style.left = `${startLeft}px`;
            panel.style.top = `${startTop}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';

            // Increase z-index during drag
            const currentZIndex = parseInt(computedStyle.zIndex) || 9998;
            panel.style.zIndex = (currentZIndex + 10).toString();

            // Log start position for debugging
            console.log('Drag started', { startX, startY, startLeft, startTop });

            // Add document-level event listeners
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // Prevent default to avoid text selection
            e.preventDefault();
        };

        // Handle mouse movement
        const handleMouseMove = (e) => {
            if (!isDragging || !panel) return;

            // Calculate how far the mouse has moved
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Log movement for debugging
            console.log('Moving', { dx, dy });

            // Apply the new position with calculated offset
            panel.style.left = `${startLeft + dx}px`;
            panel.style.top = `${startTop + dy}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        };

        // Handle mouseup (end of drag)
        const handleMouseUp = () => {
            if (!isDragging) return;

            // End dragging state
            isDragging = false;
            if (setIsDragging) setIsDragging(false);

            // Reset cursor styles
            document.body.style.cursor = '';
            header.style.cursor = 'grab';

            // If panel exists, report its final position
            if (panel) {
                // Get the computed position of the panel
                const left = parseInt(panel.style.left);
                const top = parseInt(panel.style.top);

                // Create position object
                const finalPosition = {
                    left: left,
                    top: top,
                    right: 'auto',
                    bottom: 'auto'
                };

                // Notify caller about the position change
                if (onPositionChange) onPositionChange(finalPosition);

                // Log for debugging
                console.log('Drag finished', finalPosition);
            }

            // Clean up event listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        // Set the handle cursor to indicate draggability
        header.style.cursor = 'grab';

        // Add mousedown listener to header
        header.addEventListener('mousedown', handleMouseDown);

        // Touch event handlers (simplified versions of mouse events)
        const handleTouchStart = (e) => {
            if (e.touches.length !== 1) return;

            if (e.target.tagName === 'BUTTON' || e.target.closest('button') ||
                e.target.tagName === 'svg' || e.target.closest('svg')) {
                return;
            }

            panel = header.closest('.MuiPaper-root');
            if (!panel) return;

            isDragging = true;
            if (setIsDragging) setIsDragging(true);

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;

            const computedStyle = window.getComputedStyle(panel);
            startLeft = parseInt(computedStyle.left) || 0;
            startTop = parseInt(computedStyle.top) || 0;

            panel.style.position = 'fixed';
            panel.style.left = `${startLeft}px`;
            panel.style.top = `${startTop}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';

            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);

            e.preventDefault();
        };

        const handleTouchMove = (e) => {
            if (!isDragging || !panel || e.touches.length !== 1) return;

            const touch = e.touches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;

            panel.style.left = `${startLeft + dx}px`;
            panel.style.top = `${startTop + dy}px`;

            e.preventDefault();
        };

        const handleTouchEnd = () => {
            if (!isDragging) return;

            isDragging = false;
            if (setIsDragging) setIsDragging(false);

            if (panel) {
                const left = parseInt(panel.style.left);
                const top = parseInt(panel.style.top);

                if (onPositionChange) {
                    onPositionChange({
                        left,
                        top,
                        right: 'auto',
                        bottom: 'auto'
                    });
                }
            }

            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };

        header.addEventListener('touchstart', handleTouchStart, { passive: false });

        // Cleanup function
        return () => {
            header.removeEventListener('mousedown', handleMouseDown);
            header.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [dragHandleRef, onPositionChange, setIsDragging]);
};

export default useDraggable;