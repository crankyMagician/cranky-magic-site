// vuforiaApi.js
import baseApi, { getApiUrl } from './baseApi';

/**
 * Vuforia API slice for AR target management
 * Complete rewrite to match new Vuforia API specification
 */
export const vuforiaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create a new target in Vuforia
        createTarget: builder.mutation({
            query: (targetData) => ({
                url: getApiUrl('targets', 'vuforia'),
                method: 'POST',
                body: targetData,
            }),
            transformResponse: (response) => {
                // Handle Vuforia response format
                return {
                    success: response.result_code === 'Success',
                    targetId: response.target_id,
                    transactionId: response.transaction_id,
                    ...response
                };
            },
            transformErrorResponse: (response) => {
                const defaultError = {
                    status: response.status || 500,
                    message: 'Failed to create target',
                    details: null
                };

                try {
                    if (response.data) {
                        const errorData = response.data;

                        if (response.status === 422) {
                            return {
                                ...defaultError,
                                message: 'Validation error. Please check your input data.',
                                details: errorData.detail || errorData
                            };
                        }

                        return {
                            ...defaultError,
                            message: errorData.detail || errorData.message || defaultError.message,
                            details: errorData
                        };
                    }
                } catch (parseError) {
                    console.error('Error parsing Vuforia error response:', parseError);
                }

                return defaultError;
            },
            invalidatesTags: ['VuforiaTarget'],
        }),

        // Create target with structured video metadata
        createTargetWithVideo: builder.mutation({
            query: (targetData) => ({
                url: getApiUrl('targets/with-video', 'vuforia'),
                method: 'POST',
                body: targetData,
            }),
            transformResponse: (response) => {
                return {
                    success: response.result_code === 'Success',
                    targetId: response.target_id,
                    transactionId: response.transaction_id,
                    ...response
                };
            },
            transformErrorResponse: (response) => {
                const defaultError = {
                    status: response.status || 500,
                    message: 'Failed to create target with video',
                    details: null
                };

                try {
                    if (response.data) {
                        const errorData = response.data;
                        return {
                            ...defaultError,
                            message: errorData.detail || errorData.message || defaultError.message,
                            details: errorData
                        };
                    }
                } catch (parseError) {
                    console.error('Error parsing Vuforia error response:', parseError);
                }

                return defaultError;
            },
            invalidatesTags: ['VuforiaTarget'],
        }),

        // List all targets in the database
        listTargets: builder.query({
            query: (params = {}) => ({
                url: getApiUrl('targets', 'vuforia'),
                method: 'GET',
                params: {
                    include_inactive: params.includeInactive || false
                }
            }),
            transformResponse: (response) => {
                // Ensure we return an array of targets
                return {
                    success: true,
                    targets: Array.isArray(response) ? response : response.targets || [],
                    count: Array.isArray(response) ? response.length : response.count || 0
                };
            },
            providesTags: (result) =>
                result?.targets
                    ? [
                        ...result.targets.map(({ target_id }) => ({ type: 'VuforiaTarget', id: target_id })),
                        { type: 'VuforiaTarget', id: 'LIST' }
                    ]
                    : [{ type: 'VuforiaTarget', id: 'LIST' }],
        }),

        // Get details of a specific target
        getTarget: builder.query({
            query: (targetId) => ({
                url: getApiUrl(`targets/${targetId}`, 'vuforia'),
                method: 'GET',
            }),
            transformResponse: (response) => {
                return {
                    success: true,
                    target: response
                };
            },
            providesTags: (result, error, targetId) => [{ type: 'VuforiaTarget', id: targetId }],
        }),

        // Get target with decoded metadata
        getTargetWithMetadata: builder.query({
            query: (targetId) => ({
                url: getApiUrl(`targets/${targetId}/with-metadata`, 'vuforia'),
                method: 'GET',
            }),
            transformResponse: (response) => {
                return {
                    success: true,
                    target: response,
                    metadata: response.application_metadata_decoded || {},
                    videoMetadata: response.video_metadata || {}
                };
            },
            providesTags: (result, error, targetId) => [{ type: 'VuforiaTarget', id: targetId }],
        }),

        // Update an existing target
        updateTarget: builder.mutation({
            query: ({ targetId, updateData }) => ({
                url: getApiUrl(`targets/${targetId}`, 'vuforia'),
                method: 'PUT',
                body: updateData,
            }),
            transformResponse: (response) => {
                return {
                    success: response.result_code === 'Success',
                    transactionId: response.transaction_id,
                    ...response
                };
            },
            invalidatesTags: (result, error, { targetId }) => [
                { type: 'VuforiaTarget', id: targetId },
                { type: 'VuforiaTarget', id: 'LIST' }
            ],
        }),

        // Delete a target
        deleteTarget: builder.mutation({
            query: (targetId) => ({
                url: getApiUrl(`targets/${targetId}`, 'vuforia'),
                method: 'DELETE',
            }),
            transformResponse: (response) => {
                return {
                    success: response.result_code === 'Success',
                    transactionId: response.transaction_id,
                    ...response
                };
            },
            invalidatesTags: (result, error, targetId) => [
                { type: 'VuforiaTarget', id: targetId },
                { type: 'VuforiaTarget', id: 'LIST' }
            ],
        }),

        // Activate a target
        activateTarget: builder.mutation({
            query: (targetId) => ({
                url: getApiUrl(`targets/${targetId}/activate`, 'vuforia'),
                method: 'POST',
            }),
            transformResponse: (response) => {
                return {
                    success: response.result_code === 'Success',
                    ...response
                };
            },
            invalidatesTags: (result, error, targetId) => [
                { type: 'VuforiaTarget', id: targetId }
            ],
        }),

        // Deactivate a target
        deactivateTarget: builder.mutation({
            query: (targetId) => ({
                url: getApiUrl(`targets/${targetId}/deactivate`, 'vuforia'),
                method: 'POST',
            }),
            transformResponse: (response) => {
                return {
                    success: response.result_code === 'Success',
                    ...response
                };
            },
            invalidatesTags: (result, error, targetId) => [
                { type: 'VuforiaTarget', id: targetId }
            ],
        }),

        // Create multiple targets in batch
        createTargetsBatch: builder.mutation({
            query: (targets) => ({
                url: getApiUrl('batch/targets', 'vuforia'),
                method: 'POST',
                body: targets, // Array of target objects
            }),
            transformResponse: (response) => {
                return {
                    success: true,
                    results: response.results || response,
                    successCount: response.success_count || 0,
                    failureCount: response.failure_count || 0
                };
            },
            transformErrorResponse: (response) => {
                const defaultError = {
                    status: response.status || 500,
                    message: 'Batch target creation failed',
                    details: null
                };

                try {
                    if (response.data) {
                        const errorData = response.data;

                        // Handle partial success scenarios
                        if (errorData.results && Array.isArray(errorData.results)) {
                            const failedTargets = errorData.results
                                .filter(result => !result.success)
                                .map(result => ({
                                    name: result.name || 'Unknown',
                                    error: result.message || 'Creation failed'
                                }));

                            if (failedTargets.length > 0) {
                                return {
                                    ...defaultError,
                                    message: `Batch creation completed with ${failedTargets.length} failures.`,
                                    details: {
                                        failedTargets,
                                        successCount: errorData.success_count || 0,
                                        failureCount: errorData.failure_count || failedTargets.length
                                    }
                                };
                            }
                        }

                        return {
                            ...defaultError,
                            message: errorData.detail || errorData.message || defaultError.message,
                            details: errorData
                        };
                    }
                } catch (parseError) {
                    console.error('Error parsing Vuforia batch error response:', parseError);
                }

                return defaultError;
            },
            invalidatesTags: ['VuforiaTarget'],
        }),

        // Delete multiple targets in batch
        deleteTargetsBatch: builder.mutation({
            query: (targetIds) => ({
                url: getApiUrl('batch/targets', 'vuforia'),
                method: 'DELETE',
                body: targetIds, // Array of target IDs
            }),
            transformResponse: (response) => {
                return {
                    success: true,
                    results: response.results || response,
                    successCount: response.success_count || 0,
                    failureCount: response.failure_count || 0
                };
            },
            invalidatesTags: ['VuforiaTarget'],
        }),

        // Check Vuforia service health
        checkVuforiaHealth: builder.query({
            query: () => ({
                url: getApiUrl('vuforia-health', 'vuforia'),
                method: 'GET',
            }),
            transformResponse: (response) => {
                return {
                    healthy: response.status === 'healthy' || response.status === 'up',
                    ...response
                };
            },
            providesTags: ['VuforiaHealth'],
        }),

        // Test Vuforia authentication
        testAuthentication: builder.mutation({
            query: () => ({
                url: getApiUrl('test-auth', 'vuforia'),
                method: 'POST',
            }),
            transformResponse: (response) => {
                return {
                    authenticated: true,
                    ...response
                };
            },
        }),

        // Check for similar images (deduplication)
        checkSimilarImage: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append('file', file);

                return {
                    url: getApiUrl('check-similar', 'vuforia'),
                    method: 'POST',
                    body: formData,
                    formData: true,
                };
            },
            transformResponse: (response) => {
                return {
                    hasSimilar: response.has_similar || false,
                    similarity: response.similarity || 0,
                    similarTargetId: response.similar_target_id || null,
                    ...response
                };
            },
        }),
    }),
    overrideExisting: false,
});

// Export hooks for use in components
export const {
    useCreateTargetMutation,
    useCreateTargetWithVideoMutation,
    useListTargetsQuery,
    useGetTargetQuery,
    useGetTargetWithMetadataQuery,
    useUpdateTargetMutation,
    useDeleteTargetMutation,
    useActivateTargetMutation,
    useDeactivateTargetMutation,
    useCreateTargetsBatchMutation,
    useDeleteTargetsBatchMutation,
    useCheckVuforiaHealthQuery,
    useTestAuthenticationMutation,
    useCheckSimilarImageMutation,
} = vuforiaApi;

// Export utility functions for Vuforia operations
export const vuforiaUtils = {
    /**
     * Convert File object to base64 string for Vuforia API
     * @param {File} file - The file to convert
     * @returns {Promise<string>} - Base64 encoded string
     */
    fileToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove data URL prefix (e.g., "data:image/png;base64,")
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = (error) => reject(error);
        });
    },

    /**
     * Prepare target data for Vuforia API
     * @param {Object} data - Target data including file and metadata
     * @returns {Promise<Object>} - Formatted target data
     */
    prepareTargetData: async (data) => {
        const { file, name, width = 1.0, videoMetadata = null, active = true } = data;

        // Convert file to base64
        const imageBase64 = await vuforiaUtils.fileToBase64(file);

        const targetData = {
            name: name || file.name.split('.')[0],
            width: width,
            image: imageBase64,
            active_flag: active,
        };

        // Add video metadata if provided
        if (videoMetadata && videoMetadata.videoUrl) {
            targetData.video_metadata = videoMetadata;
        }

        return targetData;
    },

    /**
     * Validate video metadata structure
     * @param {Object} metadata - Video metadata object
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    validateVideoMetadata: (metadata) => {
        const errors = [];

        if (!metadata || typeof metadata !== 'object') {
            errors.push('Video metadata must be an object');
            return { isValid: false, errors };
        }

        // Required fields validation
        if (!metadata.videoUrl || typeof metadata.videoUrl !== 'string') {
            errors.push('videoUrl is required and must be a string');
        }

        // Optional fields validation
        if (metadata.autoPlay !== undefined && typeof metadata.autoPlay !== 'boolean') {
            errors.push('autoPlay must be a boolean');
        }

        if (metadata.loop !== undefined && typeof metadata.loop !== 'boolean') {
            errors.push('loop must be a boolean');
        }

        if (metadata.muted !== undefined && typeof metadata.muted !== 'boolean') {
            errors.push('muted must be a boolean');
        }

        if (metadata.videoScale !== undefined && typeof metadata.videoScale !== 'number') {
            errors.push('videoScale must be a number');
        }

        if (metadata.videoPosition && !Array.isArray(metadata.videoPosition)) {
            errors.push('videoPosition must be an array');
        }

        return { isValid: errors.length === 0, errors };
    },

    /**
     * Format batch target data for upload
     * @param {Array} files - Array of files with metadata
     * @returns {Promise<Array>} - Array of formatted target data
     */
    prepareBatchTargets: async (files) => {
        const targets = [];

        for (const item of files) {
            const targetData = await vuforiaUtils.prepareTargetData(item);
            targets.push(targetData);
        }

        return targets;
    },
};

export default vuforiaApi;