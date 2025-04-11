/**
 * Collect marketing attribution data from URL parameters and referrer
 */
export const getAttributionData = () => {
    try {
        // Get URL parameters from current URL
        const urlParams = new URLSearchParams(window.location.search);

        // Extract UTM parameters
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const utmContent = urlParams.get('utm_content');
        const utmTerm = urlParams.get('utm_term');

        // Extract additional tracking parameters
        const fbclid = urlParams.get('fbclid');
        const gclid = urlParams.get('gclid');
        const msclkid = urlParams.get('msclkid');

        // Get referrer information
        const referrer = document.referrer;
        let referrerDomain = '';
        let referrerPath = '';

        if (referrer) {
            try {
                const referrerUrl = new URL(referrer);
                referrerDomain = referrerUrl.hostname;
                referrerPath = referrerUrl.pathname;
            } catch (e) {
                console.error('Error parsing referrer URL:', e);
            }
        }

        // Get landing page
        const landingPage = window.location.pathname;

        // Determine marketing channel based on UTM parameters or referrer
        let channel = 'direct';

        if (utmSource) {
            channel = utmSource;
        } else if (gclid) {
            channel = 'google_ads';
        } else if (fbclid) {
            channel = 'facebook_ads';
        } else if (msclkid) {
            channel = 'bing_ads';
        } else if (referrerDomain) {
            // Check for social media referrers
            if (/facebook\.com|instagram\.com|twitter\.com|x\.com|linkedin\.com|pinterest\.com|tiktok\.com|youtube\.com/.test(referrerDomain)) {
                channel = 'social';
            }
            // Check for search engines
            else if (/google\.com|bing\.com|yahoo\.com|duckduckgo\.com|baidu\.com|yandex\.com/.test(referrerDomain)) {
                channel = 'organic_search';
            }
            // Other referrers
            else {
                channel = 'referral';
            }
        }

        // Create attribution data object
        const attributionData = {
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            utm_content: utmContent,
            utm_term: utmTerm,
            fbclid: fbclid,
            gclid: gclid,
            msclkid: msclkid,
            referrer: referrer,
            referrer_domain: referrerDomain,
            referrer_path: referrerPath,
            landing_page: landingPage,
            channel: channel,
            timestamp: Date.now(),
            first_visit_timestamp: getFirstVisitTimestamp()
        };

        // Store first touch attribution in localStorage if it doesn't exist
        storeFirstTouchAttribution(attributionData);

        return attributionData;
    } catch (error) {
        console.error('Error collecting attribution data:', error);
        return {
            hasError: true,
            error: error.message
        };
    }
};

/**
 * Store first touch attribution data for the user
 */
const storeFirstTouchAttribution = (attributionData) => {
    try {
        const FIRST_TOUCH_KEY = 'first_touch_attribution';

        // Only store if this is the first touch
        if (!localStorage.getItem(FIRST_TOUCH_KEY)) {
            // Store first touch attribution data
            const firstTouchData = {
                utm_source: attributionData.utm_source,
                utm_medium: attributionData.utm_medium,
                utm_campaign: attributionData.utm_campaign,
                utm_content: attributionData.utm_content,
                utm_term: attributionData.utm_term,
                fbclid: attributionData.fbclid,
                gclid: attributionData.gclid,
                msclkid: attributionData.msclkid,
                referrer_domain: attributionData.referrer_domain,
                channel: attributionData.channel,
                landing_page: attributionData.landing_page,
                timestamp: Date.now()
            };

            localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(firstTouchData));
        }
    } catch (error) {
        console.error('Error storing first touch attribution:', error);
    }
};

/**
 * Store last touch attribution data for the user
 */
export const storeLastTouchAttribution = () => {
    try {
        const LAST_TOUCH_KEY = 'last_touch_attribution';

        // Get current attribution data
        const currentAttribution = getAttributionData();

        // Store last touch attribution data
        localStorage.setItem(LAST_TOUCH_KEY, JSON.stringify({
            ...currentAttribution,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Error storing last touch attribution:', error);
    }
};

/**
 * Get the timestamp of the first visit
 */
const getFirstVisitTimestamp = () => {
    try {
        const FIRST_TOUCH_KEY = 'first_touch_attribution';

        // Check if first touch data exists
        const firstTouchData = localStorage.getItem(FIRST_TOUCH_KEY);
        if (firstTouchData) {
            const parsedData = JSON.parse(firstTouchData);
            return parsedData.timestamp;
        }

        // If no first touch data exists, this is the first visit
        return Date.now();
    } catch (error) {
        console.error('Error getting first visit timestamp:', error);
        return Date.now();
    }
};

/**
 * Get the first touch attribution data
 */
export const getFirstTouchAttribution = () => {
    try {
        const FIRST_TOUCH_KEY = 'first_touch_attribution';
        const firstTouchData = localStorage.getItem(FIRST_TOUCH_KEY);

        if (firstTouchData) {
            return JSON.parse(firstTouchData);
        }

        return null;
    } catch (error) {
        console.error('Error getting first touch attribution:', error);
        return null;
    }
};

/**
 * Get the last touch attribution data
 */
export const getLastTouchAttribution = () => {
    try {
        const LAST_TOUCH_KEY = 'last_touch_attribution';
        const lastTouchData = localStorage.getItem(LAST_TOUCH_KEY);

        if (lastTouchData) {
            return JSON.parse(lastTouchData);
        }

        return null;
    } catch (error) {
        console.error('Error getting last touch attribution:', error);
        return null;
    }
};

/**
 * Clear all attribution data (typically used when a user logs out)
 */
export const clearAttributionData = () => {
    try {
        localStorage.removeItem('first_touch_attribution');
        localStorage.removeItem('last_touch_attribution');
    } catch (error) {
        console.error('Error clearing attribution data:', error);
    }
};