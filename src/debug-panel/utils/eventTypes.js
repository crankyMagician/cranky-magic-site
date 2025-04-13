// utils/eventTypes.js
export const getEventType = (eventName) => {
    if (!eventName) return 'unknown';
    if (eventName.includes('page_') || eventName === 'page_view') return 'page';
    if (eventName.includes('click') || eventName.includes('button')) return 'interaction';
    if (eventName.includes('form_')) return 'form';
    if (eventName.includes('api_')) return 'api';
    if (eventName.includes('error') || eventName.includes('exception')) return 'error';
    if (eventName.includes('performance') || eventName.includes('_vital')) return 'performance';
    if (eventName.includes('scroll')) return 'scroll';
    if (eventName.includes('session')) return 'session';
    return 'other';
};

export const getEventTypeColor = (type) => {
    switch (type) {
        case 'page': return '#2196f3';
        case 'interaction': return '#4caf50';
        case 'form': return '#9c27b0';
        case 'api': return '#ff9800';
        case 'error': return '#f44336';
        case 'performance': return '#00bcd4';
        case 'scroll': return '#8bc34a';
        default: return '#757575';
    }
};
