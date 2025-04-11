import { useEffect, useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { PERFORMANCE_EVENTS } from '../constants/events';

/**
 * Hook for tracking web performance metrics
 *
 * @param {Object} options - Configuration options
 * @returns {Object} - Performance metrics
 */
export const usePerformanceTracking = (options = {}) => {
    const {
        trackResourceTiming = true,
        trackMemory = true,
        trackCoreWebVitals = true,
        sampleRate = 1.0 // 1.0 = track 100% of sessions
    } = options;

    const { trackEvent } = useAnalytics();
    const [performanceMetrics, setPerformanceMetrics] = useState({});
    const [webVitals, setWebVitals] = useState({});
    const [resourceMetrics, setResourceMetrics] = useState({});
    const [memoryUsage, setMemoryUsage] = useState({});

    // Randomly decide whether to track performance for this session
    // This helps reduce the volume of performance data
    const shouldTrackPerformance = Math.random() < sampleRate;

    // Track core web vitals using the web-vitals library
    useEffect(() => {
        if (!shouldTrackPerformance || !trackCoreWebVitals) return;

        // We need to dynamically import the web-vitals library
        const trackVitals = async () => {
            try {
                // Import the web-vitals library
                const { onFCP, onLCP, onCLS, onFID, onTTFB } = await import('web-vitals');

                // Helper function to update vitals state
                const handleVitalMetric = (metric) => {
                    setWebVitals(prev => ({
                        ...prev,
                        [metric.name]: {
                            value: metric.value,
                            rating: metric.rating, // 'good', 'needs-improvement', or 'poor'
                            delta: metric.delta,
                            id: metric.id,
                            timestamp: Date.now()
                        }
                    }));

                    // Also track as an event
                    trackEvent(PERFORMANCE_EVENTS.WEB_VITAL, {
                        name: metric.name,
                        value: metric.value,
                        rating: metric.rating,
                        delta: metric.delta,
                        id: metric.id,
                        path: window.location.pathname
                    });
                };

                // Track each vital
                onFCP(handleVitalMetric); // First Contentful Paint
                onLCP(handleVitalMetric); // Largest Contentful Paint
                onFID(handleVitalMetric); // First Input Delay
                onCLS(handleVitalMetric); // Cumulative Layout Shift
                onTTFB(handleVitalMetric); // Time to First Byte

            } catch (error) {
                console.error('Error loading web-vitals library:', error);
            }
        };

        trackVitals();
    }, [shouldTrackPerformance, trackCoreWebVitals, trackEvent]);

    // Track performance metrics using the Navigation Timing API
    useEffect(() => {
        if (!shouldTrackPerformance) return;

        // This runs after the page has fully loaded
        const trackNavigationTiming = () => {
            if (window.performance && window.performance.timing) {
                // Get timing data
                const timing = window.performance.timing;

                // Calculate key metrics
                const metrics = {
                    // DNS lookup time
                    dns_lookup_time: timing.domainLookupEnd - timing.domainLookupStart,

                    // TCP connection time
                    tcp_connection_time: timing.connectEnd - timing.connectStart,

                    // TLS negotiation time (if applicable)
                    tls_time: timing.secureConnectionStart > 0 ?
                        (timing.connectEnd - timing.secureConnectionStart) : 0,

                    // Time to first byte (server response time)
                    time_to_first_byte: timing.responseStart - timing.requestStart,

                    // Content download time
                    content_download_time: timing.responseEnd - timing.responseStart,

                    // DOM processing time
                    dom_processing_time: timing.domComplete - timing.domLoading,

                    // DOM interactive time (time until DOM is ready for interaction)
                    dom_interactive_time: timing.domInteractive - timing.navigationStart,

                    // Total page load time (from navigation start to load event)
                    page_load_time: timing.loadEventEnd - timing.navigationStart,

                    // Frontend processing time (time spent on client-side processing)
                    frontend_time: timing.loadEventEnd - timing.responseEnd,

                    // Backend time (time spent on server-side processing + network)
                    backend_time: timing.responseEnd - timing.requestStart
                };

                // Set metrics in state
                setPerformanceMetrics(metrics);

                // Track metrics as an event
                trackEvent(PERFORMANCE_EVENTS.PERFORMANCE_METRICS, {
                    ...metrics,
                    path: window.location.pathname,
                    url: window.location.href
                });
            }
        };

        // Only run after the window load event
        if (document.readyState === 'complete') {
            // Add a small delay to ensure all timing data is available
            setTimeout(trackNavigationTiming, 0);
        } else {
            window.addEventListener('load', () => {
                setTimeout(trackNavigationTiming, 0);
            });
        }
    }, [shouldTrackPerformance, trackEvent]);

    // Track resource timing data
    useEffect(() => {
        if (!shouldTrackPerformance || !trackResourceTiming) return;

        const trackResourceTiming = () => {
            if (window.performance && window.performance.getEntriesByType) {
                try {
                    // Get all resource entries
                    const resources = window.performance.getEntriesByType('resource');

                    // Create metrics grouped by resource type
                    const metrics = {
                        js: { count: 0, size: 0, time: 0 },
                        css: { count: 0, size: 0, time: 0 },
                        img: { count: 0, size: 0, time: 0 },
                        font: { count: 0, size: 0, time: 0 },
                        xhr: { count: 0, size: 0, time: 0 },
                        fetch: { count: 0, size: 0, time: 0 },
                        other: { count: 0, size: 0, time: 0 }
                    };

                    // Process each resource
                    resources.forEach(resource => {
                        // Determine resource type
                        let type = 'other';

                        // Classify by file extension or initiator type
                        if (resource.name.match(/\.js(\?|$)/)) {
                            type = 'js';
                        } else if (resource.name.match(/\.css(\?|$)/)) {
                            type = 'css';
                        } else if (resource.name.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)(\?|$)/)) {
                            type = 'img';
                        } else if (resource.name.match(/\.(woff|woff2|ttf|otf|eot)(\?|$)/)) {
                            type = 'font';
                        } else if (resource.initiatorType === 'xmlhttprequest') {
                            type = 'xhr';
                        } else if (resource.initiatorType === 'fetch') {
                            type = 'fetch';
                        }

                        // Add to metrics
                        metrics[type].count++;
                        metrics[type].size += resource.transferSize || 0;
                        metrics[type].time += resource.duration || 0;
                    });

                    // Set resource metrics in state
                    setResourceMetrics(metrics);

                    // Calculate totals
                    const totalCount = Object.values(metrics).reduce((sum, m) => sum + m.count, 0);
                    const totalSize = Object.values(metrics).reduce((sum, m) => sum + m.size, 0);
                    const totalTime = Object.values(metrics).reduce((sum, m) => sum + m.time, 0);

                    // Track resource timing as an event
                    trackEvent(PERFORMANCE_EVENTS.RESOURCE_PERFORMANCE, {
                        ...metrics,
                        total: {
                            count: totalCount,
                            size: totalSize,
                            time: totalTime
                        },
                        path: window.location.pathname
                    });
                } catch (error) {
                    console.error('Error tracking resource timing:', error);
                }
            }
        };

        // Only run after the window load event
        if (document.readyState === 'complete') {
            // Add a small delay to ensure all resource timing data is available
            setTimeout(trackResourceTiming, 1000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(trackResourceTiming, 1000);
            });
        }
    }, [shouldTrackPerformance, trackResourceTiming, trackEvent]);

    // Track memory usage (Chrome only)
    useEffect(() => {
        if (!shouldTrackPerformance || !trackMemory) return;

        const trackMemory = () => {
            // Memory usage is only available in Chrome
            if (window.performance && window.performance.memory) {
                const memory = {
                    jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
                    totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                    usedJSHeapSize: window.performance.memory.usedJSHeapSize,
                    // Calculate usage percentage
                    usagePercentage: Math.round(
                        (window.performance.memory.usedJSHeapSize /
                            window.performance.memory.jsHeapSizeLimit) * 100
                    )
                };

                // Set memory metrics in state
                setMemoryUsage(memory);

                // Track memory usage as an event
                trackEvent(PERFORMANCE_EVENTS.MEMORY_USAGE, {
                    ...memory,
                    path: window.location.pathname
                });
            }
        };

        // Track memory usage initially
        trackMemory();

        // Also track memory usage periodically
        const intervalId = setInterval(trackMemory, 60000); // every minute

        return () => {
            clearInterval(intervalId);
        };
    }, [shouldTrackPerformance, trackMemory, trackEvent]);

    // Return all performance metrics
    return {
        performanceMetrics,
        webVitals,
        resourceMetrics,
        memoryUsage,

        // Utility functions to manually trigger performance tracking
        trackPerformanceNow: () => {
            if (!shouldTrackPerformance || !window.performance) return;

            // Get current performance data and track it
            const navigationTiming = window.performance.timing ? {
                page_load_time: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
                dom_interactive_time: window.performance.timing.domInteractive - window.performance.timing.navigationStart,
                dom_complete_time: window.performance.timing.domComplete - window.performance.timing.navigationStart
            } : {};

            trackEvent(PERFORMANCE_EVENTS.PERFORMANCE_METRICS, {
                ...navigationTiming,
                manual_tracking: true,
                timestamp: Date.now(),
                path: window.location.pathname
            });
        }
    };
};

export default usePerformanceTracking;