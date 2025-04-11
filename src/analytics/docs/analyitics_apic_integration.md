# Analytics API Integration

The application includes a comprehensive analytics system that automatically tracks API calls through middleware integration. This section explains how this integration works and how to add tracking for new API endpoints.

### How API Tracking Works

The analytics system uses axios interceptors to capture API requests and responses automatically. The system tracks:

- Request metadata (endpoint, method, timing)
- Response status and performance
- Error states and failure information

API tracking is configured in `src/analytics/middleware/apiTracking.js` which sets up endpoint-specific tracking rules.

### Adding New API Endpoints to Analytics

When adding new API endpoints to the application, follow these steps to ensure proper analytics tracking:

1. **Update API Endpoint Configuration**

   If your new endpoint contains sensitive data that should be handled differently, add it to the `API_ENDPOINT_CONFIG` object in `apiTracking.js`:

   ```javascript
   const API_ENDPOINT_CONFIG = {
     // Existing endpoints...
     
     // Add your new endpoint configuration
     '/api/your-new-endpoint': { 
       request: { 
         include: true,  // Whether to log request data
         fields: {
           exclude: ['sensitive_field']  // Fields to exclude from logging
         }
       },
       response: { 
         include: true  // Whether to log response data
       }
     }
   };
   ```

2. **Custom Event Tracking**

   For important business operations, add specific event tracking in your API handler:

   ```javascript
   // In your API call handler
   const handleApiOperation = async (data) => {
     const analytics = useAnalytics();
     
     try {
       // Start tracking the operation
       analytics.trackEvent('operation_started', { 
         operation_type: 'your_operation_name',
         data_size: data.length
       });
       
       // Make the API call
       const response = await axiosServices.post('/api/your-new-endpoint', data);
       
       // Track successful completion
       analytics.trackEvent('operation_completed', { 
         operation_type: 'your_operation_name',
         duration_ms: Date.now() - startTime,
         result_count: response.data.results.length
       });
       
       return response.data;
     } catch (error) {
       // Track failure
       analytics.trackError(error, {
         context: 'your_operation_name',
         attempted_with: sanitizeData(data)
       });
       
       throw error;
     }
   };
   ```

3. **Testing API Analytics**

   After adding a new endpoint, verify analytics tracking is working properly:

    - Check the analytics dashboard for the new endpoint events
    - Verify sensitive data is properly sanitized
    - Confirm error states are being captured correctly

### Best Practices for API Analytics

- Add meaningful context to your tracking events
- Keep request and response tracking focused on what's important
- Be mindful of sensitive data in both request and response bodies
- Use custom tracking events for high-value business operations
- Create specific funnels for multi-step API operations

### Troubleshooting

If API tracking events aren't appearing in analytics:

1. Check that the analytics provider is properly initialized
2. Verify that the API call is using the configured axios instance
3. Ensure consent has been given if analytics requires user opt-in
4. Check browser console for any tracking-related errors


