// hooks/useDraggable.js
import { useEffect } from 'react';

const useDraggable = (ref, onPositionChange, setIsDragging) => {
    useEffect(() => {
        // Exit early if ref doesn't exist
        if (!ref || !ref.current) return;

        // Store original position to properly handle repeated drags
        let originalPosition = { left: 0, top: 0 };

        const element = ref.current;
        const headerElement = element; // The element we're attaching listeners to

        // Cache the panel element (the actual draggable container)
        let panelElement = null;

        // Track dragging state
        let active = false;

        // Start positions
        let startX = 0;
        let startY = 0;

        // Element positions
        let startLeft = 0;
        let startTop = 0;

        // Start dragging
        const dragStart = (e) => {
            // Skip if it's a button or icon click
            if (e.target.tagName === 'BUTTON' || e.target.closest('button') ||
                e.target.tagName === 'svg' || e.target.closest('svg')) {
                return;
            }

            // Find panel element if not already cached
            if (!panelElement) {
                panelElement = headerElement.closest('.MuiPaper-root');
                if (!panelElement) {
                    console.error('Could not find parent Paper component');
                    return;
                }
            }

            // Mark as active and update cursor
            active = true;
            if (setIsDragging) setIsDragging(true);
            document.body.style.cursor = 'grabbing';

            // Get mouse/touch position
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;

            // Get panel position and dimensions
            const rect = panelElement.getBoundingClientRect();

            // Store starting positions
            startX = clientX;
            startY = clientY;
            startLeft = rect.left;
            startTop = rect.top;

            // Store original position for future reference
            originalPosition = { left: startLeft, top: startTop };

            // Prevent default behavior
            e.preventDefault();

            // Print debug info
            console.log('Drag started', { startX, startY, startLeft, startTop });
        };

        // During dragging
        const dragMove = (e) => {
            if (!active) return;

            // Get current mouse/touch position
            const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : startX);
            const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : startY);

            // Calculate distance moved
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            // Apply new position directly to the element for smooth dragging
            // This is key for smooth dragging - direct DOM manipulation
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;

            // Apply position directly to element
            if (panelElement) {
                panelElement.style.left = `${newLeft}px`;
                panelElement.style.top = `${newTop}px`;
                panelElement.style.right = 'auto';
                panelElement.style.bottom = 'auto';
                panelElement.style.position = 'fixed'; // Ensure fixed positioning
            }

            // Prevent scrolling on touch devices
            if (e.cancelable) e.preventDefault();
        };

        // End dragging
        const dragEnd = () => {
            if (!active) return;

            // Reset state
            active = false;
            if (setIsDragging) setIsDragging(false);
            document.body.style.cursor = '';

            // Update the state position only at the end of drag for smoother performance
            if (panelElement) {
                const rect = panelElement.getBoundingClientRect();
                onPositionChange({
                    left: rect.left,
                    top: rect.top,
                    right: 'auto',
                    bottom: 'auto'
                });

                console.log('Drag ended', { left: rect.left, top: rect.top });
            }
        };

        // Add event listeners for mouse and touch
        headerElement.addEventListener('mousedown', dragStart);
        headerElement.addEventListener('touchstart', dragStart, { passive: false });

        // Add document-level events for move and end
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('touchcancel', dragEnd);

        // Cleanup function to remove all event listeners
        return () => {
            // Remove all event listeners when component unmounts
            if (headerElement) {
                headerElement.removeEventListener('mousedown', dragStart);
                headerElement.removeEventListener('touchstart', dragStart);
            }

            // Always clean up document listeners
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('touchmove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('touchcancel', dragEnd);
        };
    }, [ref, onPositionChange, setIsDragging]);
};

export default useDraggable;