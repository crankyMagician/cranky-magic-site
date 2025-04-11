# Analytics Implementation Plan

## Overview

This document outlines the plan for implementing a comprehensive analytics tracking system in the existing React application. The system is designed to be modular, privacy-compliant, and performance-optimized while capturing detailed user interactions, behaviors, and technical metrics.

## 1. System Architecture

We've designed a modular analytics system with these key components:

- **Core Context/Provider**: Centralized analytics state and methods
- **Specialized Hooks**: Task-specific tracking capabilities (page views, forms, scrolling, etc.)
- **Event Standardization**: Consistent event naming and data structure
- **Provider Abstraction**: Support for multiple analytics services (PostHog, Sentry)
- **Privacy Controls**: GDPR/CCPA compliance with data sanitization and consent management
- **Performance Optimization**: Minimal impact on app performance

## 2. Required Dependencies

Add the following packages to the project:

```bash
npm install --save posthog-js @sentry/react @sentry/tracing web-vitals
```

## 3. Implementation Steps

### Step 1: Create Directory Structure

Create the following directory structure for the analytics system:

```
src/
├── analytics/
│   ├── context/
│   │   └── AnalyticsContext.js         # Context for analytics state and methods
│   ├── hooks/
│   │   ├── useAnalytics.js             # Main hook for tracking events
│   │   ├── usePageTracking.js          # For route-level tracking
│   │   ├── useSessionTracking.js       # For session metrics
│   │   ├── useScrollTracking.js        # For scroll depth
│   │   ├── useFormTracking.js          # For form interactions
│   │   ├── usePerformanceTracking.js   # For performance metrics
│   │   └── useExitIntent.js            # For exit intent detection
│   ├── hocs/
│   │   └── withAnalytics.js            # HOC for class components
│   ├── middleware/
│   │   └── apiTracking.js              # Axios interceptors for API tracking
│   ├── constants/
│   │   └── events.js                   # Standardized event names
│   ├── utils/
│   │   ├── deviceInfo.js               # Browser/device detection
│   │   ├── privacyUtils.js             # PII sanitization
│   │   └── marketingAttribution.js     # UTM & referrer parsing
│   └── providers/
│       ├── index.js                    # Provider factory
│       ├── posthogProvider.js          # PostHog implementation
│       └── sentryProvider.js           # Sentry implementation
└── AnalyticsProvider.js                # Root provider component
```

### Step 2: Configure Environment Variables

Add the following environment variables:

```
# PostHog configuration
REACT_APP_POSTHOG_API_KEY=your_posthog_api_key
REACT_APP_POSTHOG_HOST=https://app.posthog.com

# Sentry configuration
REACT_APP_SENTRY_DSN=your_sentry_dsn

# Other analytics config
REACT_APP_ENABLE_DEV_ERROR_TRACKING=false
REACT_APP_ANALYTICS_SAMPLE_RATE=0.1
```

### Step 3: Integrate with App Component

Update the `App.js` component to include the AnalyticsProvider:

```jsx
// src/App.js
import AnalyticsProvider from './AnalyticsProvider';

function App() {
  // ... existing code

  return (
    <AnalyticsProvider>
      {/* Existing app structure */}
    </AnalyticsProvider>
  );
}
```

### Step 4: Set Up API Call Tracking

The API call tracking will be automatically integrated with the application's axios instances via the AnalyticsProvider, which sets up the interceptors.

### Step 5: Implement Page Tracking

Add page tracking to the main routing component:

```jsx
// src/MainContent.js or similar routing component
import usePageTracking from './analytics/hooks/usePageTracking';

const MainContent = () => {
  // Initialize page tracking
  usePageTracking();
  
  return (
    <Routes>
      {/* ... existing routes */}
    </Routes>
  );
};
```

### Step 6: Add Session Tracking

Add session tracking to the App component or a high-level component:

```jsx
// In a high-level component
import useSessionTracking from './analytics/hooks/useSessionTracking';

const AppLayout = ({ children }) => {
  // Initialize session tracking
  useSessionTracking();
  
  return (
    <div className="app-layout">
      {/* ... existing layout */}
      {children}
    </div>
  );
};
```

### Step 7: Track User Authentication

Update authentication-related components to track login/signup events:

```jsx
// In login component
import useAnalytics from './analytics/hooks/useAnalytics';

const LoginPage = () => {
  const analytics = useAnalytics();
  
  const handleLogin = async (credentials) => {
    analytics.trackLoginStart();
    
    try {
      // Existing login logic
      const result = await login(credentials);
      
      analytics.trackLoginSuccess({
        method: 'email' // or other login method
      });
      
      return result;
    } catch (error) {
      analytics.trackLoginFailure(error);
      throw error;
    }
  };
  
  // ... rest of component
};
```

### Step 8: Track Form Interactions

Add form tracking to important forms:

```jsx
// In a form component
import useFormTracking from './analytics/hooks/useFormTracking';

const ContactForm = () => {
  const formTracking = useFormTracking({
    formId: 'contact_form',
    formName: 'Contact Us Form',
    fields: [
      { name: 'name', type: 'text' },
      { name: 'email', type: 'email' },
      { name: 'message', type: 'text' }
    ]
  });
  
  // Use the tracking methods in your form handlers
  const handleFieldFocus = (e) => {
    formTracking.handleFieldFocus(e.target.name, e.target.type);
  };
  
  // ... other form handlers
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        onFocus={handleFieldFocus}
        onBlur={(e) => formTracking.handleFieldBlur(e.target.name, e.target.type, e.target.value)}
        onChange={handleChange}
      />
      {/* ... other form fields */}
    </form>
  );
};
```

### Step 9: Add Performance Tracking

Implement performance tracking in a high-level component:

```jsx
// In App.js or another high-level component
import usePerformanceTracking from './analytics/hooks/usePerformanceTracking';

const AppPerformanceTracker = ({ children }) => {
  // Track performance metrics
  usePerformanceTracking();
  
  return <>{children}</>;
};

// Then in App.js
function App() {
  return (
    <AnalyticsProvider>
      <AppPerformanceTracker>
        {/* Rest of your app */}
      </AppPerformanceTracker>
    </AnalyticsProvider>
  );
}
```

### Step 10: Add Scroll Tracking to Key Pages

Implement scroll tracking on important content pages:

```jsx
// In content-heavy components
import useScrollTracking from './analytics/hooks/useScrollTracking';

const ArticlePage = () => {
  // Track scroll depth on this page
  useScrollTracking();
  
  return (
    <div className="article">
      {/* Article content */}
    </div>
  );
};
```

### Step 11: Track Important User Interactions

Update key components to track important user interactions:

```jsx
// In any component
import useAnalytics from './analytics/hooks/useAnalytics';

const ProductCard = ({ product }) => {
  const analytics = useAnalytics();
  
  const handleClick = () => {
    analytics.trackProductView(product);
    // Other click handling
  };
  
  const handleAddToCart = () => {
    analytics.trackAddToCart(product);
    // Other cart handling
  };
  
  return (
    <div className="product-card">
      <h3 onClick={handleClick}>{product.name}</h3>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

### Step 12: Implement User Consent Management

Create a consent banner component:

```jsx
// src/components/ConsentBanner.js
import { useState, useEffect } from 'react';
import useAnalytics from '../analytics/hooks/useAnalytics';
import { hasAnalyticsConsent } from '../analytics/utils/privacyUtils';

const ConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const analytics = useAnalytics();
  
  useEffect(() => {
    // Check if user has already provided consent
    const hasConsent = hasAnalyticsConsent();
    setShowBanner(!hasConsent);
  }, []);
  
  const handleAccept = () => {
    analytics.setConsent(true);
    setShowBanner(false);
  };
  
  const handleDecline = () => {
    analytics.setConsent(false);
    setShowBanner(false);
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="consent-banner">
      <p>We use cookies and similar technologies to improve your experience and analyze traffic.</p>
      <div className="buttons">
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
};

// Add to App.js
function App() {
  return (
    <AnalyticsProvider>
      <ConsentBanner />
      {/* Rest of your app */}
    </AnalyticsProvider>
  );
}
```

## 4. Testing Plan

1. **Unit Tests**:
    - Test individual hooks in isolation
    - Verify events are tracked correctly
    - Test privacy/sanitization utils

2. **Integration Tests**:
    - Test AnalyticsProvider with mock providers
    - Verify context values are passed correctly
    - Test API tracking with mock requests

3. **Manual Testing**:
    - Verify events in PostHog dashboard
    - Check error reporting in Sentry
    - Validate performance metrics collection

## 5. Analytics Data Dictionary

This section defines the events being tracked and their properties.

### Core Events

| Event Name | Description | Key Properties |
|------------|-------------|----------------|
| page_view | User viewed a page | path, title, referrer |
| page_exit | User left a page | path, time_spent_ms, next_path |
| session_start | User started a new session | timestamp, user_agent, referrer |
| session_end | User ended their session | session_duration_ms, page_count |
| api_request | API request was made | endpoint, method, status, has_payload |
| api_response | API response was received | endpoint, method, status, duration_ms |
| api_error | API error occurred | endpoint, method, status, error_message |

### User Interaction Events

| Event Name | Description | Key Properties |
|------------|-------------|----------------|
| click | User clicked on an element | element_type, element_name |
| form_start | User started interacting with a form | form_id, form_name |
| form_submit_success | Form was successfully submitted | form_id, form_name, time_to_complete_ms |
| form_abandon | User abandoned a form | form_id, completion_percentage |

### Authentication Events

| Event Name | Description | Key Properties |
|------------|-------------|----------------|
| login_start | User initiated login | method |
| login_success | User logged in successfully | method |
| login_failure | Login attempt failed | error_message, method |
| signup_start | User initiated signup | method |
| signup_complete | User completed signup | method |
| logout | User logged out | session_duration_ms |

### Performance Events

| Event Name | Description | Key Properties |
|------------|-------------|----------------|
| web_vital | Core Web Vital measurement | name, value, rating |
| performance_metrics | General performance metrics | page_load_time, dom_interactive_time |
| resource_performance | Resource loading performance | js, css, img, font, xhr metrics |
| memory_usage | Memory usage metrics | usedJSHeapSize, totalJSHeapSize |

## 6. Privacy Compliance

The analytics system is designed with privacy in mind:

- **Consent Management**: Tracking is disabled by default until user consent is given
- **Data Sanitization**: PII is automatically redacted from tracked data
- **Data Minimization**: Only necessary data is collected
- **Cookie Controls**: Cookies are managed according to preferences
- **User Control**: Users can opt out at any time

## 7. Expected Outcomes

After implementing this analytics system, you should be able to:

1. **Understand User Flow**: See how users navigate through the application
2. **Identify Drop-offs**: Pinpoint where users abandon processes
3. **Optimize Performance**: Find and fix performance bottlenecks
4. **Improve Conversion**: Analyze and improve conversion funnels
5. **Enhance UX**: Make data-driven decisions for UX improvements
6. **Monitor Errors**: Catch and fix frontend errors before they impact users
7. **Track Business KPIs**: Measure important business metrics

## 8. Future Enhancements

Future phases of the analytics implementation could include:

1. **A/B Testing Integration**: Connect with A/B testing tools
2. **User Segmentation**: Create user segments for targeted analysis
3. **Real-time Dashboards**: Build custom dashboards for key metrics
4. **Predictive Analytics**: Implement ML models to predict user behavior
5. **Heat/Click Maps**: Add detailed user interaction visualizations
6. **Custom Event Builder**: Create a UI for non-technical users to define events

## 9. Additional Analytics to Consider

Based on the existing application's codebase, here are additional analytics events we should track:

1. **Theme Changes**: Track when users switch the application theme
2. **Language Changes**: Track language preference changes
3. **Business Account Actions**: Track business-specific flows
4. **Settings Changes**: Track user preference modifications
5. **Feature Discovery**: Track when users discover and use new features
6. **Media Interactions**: Track video/audio player interactions
7. **Navigation Style Usage**: Track which navigation style users prefer
8. **Search Behavior**: Track search queries and result clicks
9. **API Performance**: Track API response times and success rates
10. **Device/Browser Usage**: Track which devices and browsers users are using

## 10. Conclusion

This analytics implementation provides a comprehensive view of user behavior while maintaining performance and privacy compliance. By following this plan, you'll gain valuable insights into user behavior that can drive product decisions and improvements.