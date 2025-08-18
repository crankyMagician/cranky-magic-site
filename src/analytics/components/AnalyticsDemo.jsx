import React, { useState, useEffect } from 'react';

const getRandomTimestamp = () => {
    // Return a timestamp within the last 24 hours
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    return oneDayAgo + Math.random() * (now - oneDayAgo);
};

const AnalyticsDemo = () => {
    const [eventCount, setEventCount] = useState(0);
    const [isDebugPanelVisible, setIsDebugPanelVisible] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subscribe: false });

    // Check if debug panel exists
    useEffect(() => {
        const checkForDebugPanel = () => {
            // Look for elements matching our debug panel
            const debugPanelExists = document.querySelector('[data-debug-panel="true"]') !== null;
            setIsDebugPanelVisible(debugPanelExists);
        };

        checkForDebugPanel();
        // Check again after a short delay to allow it to render
        const timer = setTimeout(checkForDebugPanel, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Track page view on mount
    useEffect(() => {
        // Track a page view by dispatching a custom event
        const trackPageView = () => {
            const event = new CustomEvent('analytics_event', {
                detail: {
                    name: 'page_view',
                    properties: {
                        path: '/analytics-demo',
                        title: 'Analytics Demo',
                        timestamp: Date.now()
                    },
                    type: 'page'
                }
            });
            window.dispatchEvent(event);
            setEventCount(prev => prev + 1);
        };

        trackPageView();
    }, []);

    // Dispatch a custom event to be picked up by our debug system
    const dispatchAnalyticsEvent = (eventName, eventProperties, eventType) => {
        // Use customEventBus if it exists, otherwise fallback to regular CustomEvent
        if (window.customEventBus) {
            window.customEventBus.dispatch('analytics_event_captured', {
                id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                name: eventName,
                properties: {
                    ...eventProperties,
                    timestamp: eventProperties.timestamp || Date.now()
                },
                type: eventType,
                timestamp: Date.now()
            });
        } else {
            // Fallback to regular custom event
            const event = new CustomEvent('analytics_event', {
                detail: {
                    name: eventName,
                    properties: {
                        ...eventProperties,
                        timestamp: eventProperties.timestamp || Date.now()
                    },
                    type: eventType
                }
            });
            window.dispatchEvent(event);
        }

        setEventCount(prev => prev + 1);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Track form submission
        dispatchAnalyticsEvent('form_submit', {
            form_id: 'demo_form',
            form_name: 'Demo Form',
            has_name: !!formData.name,
            has_email: !!formData.email,
            subscribed: formData.subscribe
        }, 'form');

        // Clear form
        setFormData({ name: '', email: '', subscribe: false });

        // Show success message
        alert('Form submitted successfully!');
    };

    // Generate and track a button click event
    const handleButtonClick = (buttonId) => {
        dispatchAnalyticsEvent('button_click', {
            button_id: buttonId,
            page: '/analytics-demo'
        }, 'interaction');
    };

    // Generate a sample error
    const generateError = () => {
        try {
            // Intentionally cause an error
            const obj = null;
            obj.nonExistentMethod();
        } catch (error) {
            // Track the error
            dispatchAnalyticsEvent('error', {
                error_message: error.message,
                error_stack: error.stack,
                context: 'demo_error_button'
            }, 'error');
        }
    };

    // Generate some random events
    const generateRandomEvents = (count = 5) => {
        const eventTypes = [
            { name: 'page_view', type: 'page', properties: () => ({ path: '/random-page', title: 'Random Page' }) },
            { name: 'button_click', type: 'interaction', properties: () => ({ button_id: `btn_${Math.floor(Math.random() * 100)}` }) },
            { name: 'form_submit', type: 'form', properties: () => ({ form_id: 'random_form', success: Math.random() > 0.3 }) },
            { name: 'api_call', type: 'api', properties: () => ({ endpoint: '/api/data', status: Math.random() > 0.2 ? 200 : 500 }) },
            { name: 'feature_use', type: 'interaction', properties: () => ({ feature_name: `feature_${Math.floor(Math.random() * 5) + 1}` }) }
        ];

        for (let i = 0; i < count; i++) {
            const eventTypeIndex = Math.floor(Math.random() * eventTypes.length);
            const { name, type, properties } = eventTypes[eventTypeIndex];

            dispatchAnalyticsEvent(name, {
                ...properties(),
                timestamp: getRandomTimestamp()
            }, type);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Analytics Demo</h1>

            {!isDebugPanelVisible && (
                <div className="mb-6 p-4 bg-yellow-100 rounded-lg">
                    <h3 className="font-bold">Debug Panel Not Detected</h3>
                    <p>The analytics debug panel is not visible. Events are still being tracked but you won't see them in real-time.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 shadow">
                    <h2 className="text-xl font-bold mb-2">Interaction Events</h2>
                    <hr className="mb-4" />

                    <div className="flex flex-col gap-3">
                        <button
                            className="bg-blue-500 text-white p-2 rounded"
                            onClick={() => handleButtonClick('primary_button')}
                        >
                            Track Primary Button Click
                        </button>

                        <button
                            className="border border-purple-500 text-purple-500 p-2 rounded"
                            onClick={() => handleButtonClick('secondary_button')}
                        >
                            Track Secondary Button Click
                        </button>

                        <button
                            className="border border-red-500 text-red-500 p-2 rounded"
                            onClick={generateError}
                        >
                            Generate Error Event
                        </button>

                        <button
                            className="bg-green-500 text-white p-2 rounded"
                            onClick={() => generateRandomEvents()}
                        >
                            Generate 5 Random Events
                        </button>
                    </div>
                </div>

                <div className="border rounded-lg p-4 shadow">
                    <h2 className="text-xl font-bold mb-2">Form Tracking Demo</h2>
                    <hr className="mb-4" />

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        dispatchAnalyticsEvent('form_field_change', {
                                            form_id: 'demo_form',
                                            field: 'name',
                                            has_value: !!e.target.value
                                        }, 'form');
                                    }}
                                    onFocus={() => dispatchAnalyticsEvent('form_field_focus', {
                                        form_id: 'demo_form',
                                        field: 'name'
                                    }, 'form')}
                                    onBlur={() => dispatchAnalyticsEvent('form_field_blur', {
                                        form_id: 'demo_form',
                                        field: 'name',
                                        has_value: !!formData.name
                                    }, 'form')}
                                />
                            </div>

                            <div>
                                <label className="block mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        dispatchAnalyticsEvent('form_field_change', {
                                            form_id: 'demo_form',
                                            field: 'email',
                                            has_value: !!e.target.value
                                        }, 'form');
                                    }}
                                    onFocus={() => dispatchAnalyticsEvent('form_field_focus', {
                                        form_id: 'demo_form',
                                        field: 'email'
                                    }, 'form')}
                                    onBlur={() => dispatchAnalyticsEvent('form_field_blur', {
                                        form_id: 'demo_form',
                                        field: 'email',
                                        has_value: !!formData.email
                                    }, 'form')}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="subscribe"
                                    className="mr-2"
                                    checked={formData.subscribe}
                                    onChange={(e) => {
                                        setFormData({ ...formData, subscribe: e.target.checked });
                                        dispatchAnalyticsEvent('form_field_change', {
                                            form_id: 'demo_form',
                                            field: 'subscribe',
                                            value: e.target.checked
                                        }, 'form');
                                    }}
                                />
                                <label htmlFor="subscribe">Subscribe to newsletter</label>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Submit Form (Track Submit Event)
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                    Events dispatched: {eventCount}
                </p>

                <div className={`px-3 py-1 rounded-full text-sm ${isDebugPanelVisible ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {isDebugPanelVisible ? "Debug Panel: Active" : "Debug Panel: Not Detected"}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDemo;