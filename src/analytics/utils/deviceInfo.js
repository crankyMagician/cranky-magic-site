/**
 * Collect device and browser information
 */
export const getDeviceInfo = async () => {
    try {
        // Collect basic device and browser information
        const deviceInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            doNotTrack: navigator.doNotTrack === '1' ||
                navigator.doNotTrack === 'yes' ||
                window.doNotTrack === '1'
        };

        // Add connection information if available
        if (navigator.connection) {
            deviceInfo.connection = {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }

        // Add browser and OS detection
        const browserInfo = getBrowserInfo();
        deviceInfo.browser = browserInfo.browser;
        deviceInfo.browserVersion = browserInfo.browserVersion;
        deviceInfo.os = browserInfo.os;
        deviceInfo.osVersion = browserInfo.osVersion;

        // Add device type detection
        deviceInfo.deviceType = getDeviceType();

        // Add performance API data if available
        if (window.performance && window.performance.memory) {
            deviceInfo.memory = {
                jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit,
                totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                usedJSHeapSize: window.performance.memory.usedJSHeapSize
            };
        }

        return deviceInfo;
    } catch (error) {
        console.error('Error collecting device info:', error);
        // Return minimal information if there's an error
        return {
            userAgent: navigator.userAgent,
            hasError: true,
            errorMessage: error.message
        };
    }
};

/**
 * Detect browser and OS details from user agent
 */
export const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'unknown';
    let version = 'unknown';
    let os = 'unknown';
    let osVersion = 'unknown';

    // Browser detection
    if (/firefox/i.test(ua)) {
        browser = 'Firefox';
        version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || 'unknown';
    } else if (/chrome/i.test(ua) && !/edg/i.test(ua)) {
        browser = 'Chrome';
        version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || 'unknown';
    } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
        browser = 'Safari';
        version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || 'unknown';
    } else if (/edg/i.test(ua)) {
        browser = 'Edge';
        version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || 'unknown';
    } else if (/opera|opr/i.test(ua)) {
        browser = 'Opera';
        version = ua.match(/(?:Opera|OPR)\/(\d+\.\d+)/)?.[1] || 'unknown';
    } else if (/trident|msie/i.test(ua)) {
        browser = 'Internet Explorer';
        version = ua.match(/(?:MSIE |rv:)(\d+\.\d+)/)?.[1] || 'unknown';
    }

    // OS detection
    if (/windows/i.test(ua)) {
        os = 'Windows';
        osVersion = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || 'unknown';
    } else if (/macintosh|mac os x/i.test(ua)) {
        os = 'MacOS';
        osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || 'unknown';
    } else if (/android/i.test(ua)) {
        os = 'Android';
        osVersion = ua.match(/Android (\d+\.\d+)/)?.[1] || 'unknown';
    } else if (/iphone|ipad|ipod/i.test(ua)) {
        os = 'iOS';
        osVersion = ua.match(/OS (\d+_\d+)/)?.[1]?.replace('_', '.') || 'unknown';
    } else if (/linux/i.test(ua)) {
        os = 'Linux';
    }

    return {
        browser,
        browserVersion: version,
        os,
        osVersion
    };
};

/**
 * Detect device type (mobile, tablet, desktop)
 */
export const getDeviceType = () => {
    const ua = navigator.userAgent;

    // Check for mobile devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        // Differentiate between tablets and phones
        if (/iPad|tablet|Tablet/i.test(ua) || (
            /android/i.test(ua) && !/mobile/i.test(ua)
        )) {
            return 'tablet';
        }
        return 'mobile';
    }

    // Default to desktop
    return 'desktop';
};

/**
 * Get hardware concurrency (CPU cores) if available
 */
export const getHardwareConcurrency = () => {
    return navigator.hardwareConcurrency || 'unknown';
};

/**
 * Check if the browser supports certain features
 */
export const getFeatureSupport = () => {
    return {
        touchscreen: 'ontouchstart' in window,
        webp: hasWebP(),
        webgl: hasWebGL(),
        webrtc: hasWebRTC(),
        geolocation: 'geolocation' in navigator,
        localStorage: isLocalStorageAvailable(),
        sessionStorage: isSessionStorageAvailable(),
        cookies: navigator.cookieEnabled
    };
};

// Helper functions for feature detection
function hasWebP() {
    try {
        return document.createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('data:image/webp') === 0;
    } catch (e) {
        return false;
    }
}

function hasWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function hasWebRTC() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function isLocalStorageAvailable() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

function isSessionStorageAvailable() {
    try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}