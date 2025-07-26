// vuforiaApi.js
import baseApi, { getApiUrl } from './baseApi';

/**
 * Vuforia API slice for image upload and AR functionality
 * Focuses on upload endpoints with comprehensive error handling
 */
export const vuforiaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Upload single image to Vuforia
        uploadImageToVuforia: builder.mutation({
            query: ({ file, userId = 'default_user', videoMetadata = null }) => {
                // Create FormData for file upload
                const formData = new FormData();
                formData.append('file', file);
                formData.append('user_id', userId);
                
                // Add video metadata if provided
                if (videoMetadata) {
                    formData.append('video_metadata', JSON.stringify(videoMetadata));
                }

                return {
                    url: getApiUrl('api/providers/vuforia/upload', 'main'),
                    method: 'POST',
                    body: formData,
                    formData: true, // Disable automatic JSON serialization
                };
            },
            transformResponse: (response) => {
                // Handle ServiceResponse format from backend
                if (response && typeof response === 'object') {
                    // If it's already a ServiceResponse object
                    if (response.success !== undefined) {
                        return response;
                    }
                    // If it's nested in data property
                    if (response.data) {
                        return response.data;
                    }
                }
                return response;
            },
            transformErrorResponse: (response) => {
                // Enhanced error handling for Vuforia uploads
                const defaultError = {
                    status: response.status || 500,
                    message: 'Upload failed. Please try again.',
                    details: null
                };

                try {
                    if (response.data) {
                        const errorData = response.data;
                        
                        // Handle specific Vuforia error cases
                        if (response.status === 400) {
                            if (errorData.detail?.includes('image')) {
                                return {
                                    ...defaultError,
                                    message: 'Invalid image file. Please ensure the file is a valid image format.',
                                    details: errorData.detail
                                };
                            }
                            if (errorData.detail?.includes('video_metadata')) {
                                return {
                                    ...defaultError,
                                    message: 'Invalid video metadata format. Please check your video configuration.',
                                    details: errorData.detail
                                };
                            }
                        }
                        
                        if (response.status === 413) {
                            return {
                                ...defaultError,
                                message: 'File size too large. Please compress your image and try again.',
                                details: 'Maximum file size exceeded'
                            };
                        }
                        
                        if (response.status === 415) {
                            return {
                                ...defaultError,
                                message: 'Unsupported file type. Please upload a valid image file (JPG, PNG, etc.).',
                                details: errorData.detail
                            };
                        }
                        
                        if (response.status >= 500) {
                            return {
                                ...defaultError,
                                message: 'Server error during upload. Please try again later.',
                                details: errorData.detail || 'Internal server error'
                            };
                        }

                        // Generic error with server message
                        return {
                            ...defaultError,
                            message: errorData.detail || errorData.message || defaultError.message,
                            details: errorData.detail
                        };
                    }
                } catch (parseError) {
                    console.error('Error parsing Vuforia upload error response:', parseError);
                }

                return defaultError;
            },
            invalidatesTags: ['Media', 'VuforiaImage'],
        }),

        // Upload multiple images to Vuforia (batch upload)
        batchUploadToVuforia: builder.mutation({
            query: ({ files, userId = 'default_user', videoMetadata = null }) => {
                // Create FormData for batch file upload
                const formData = new FormData();
                
                // Append all files
                files.forEach((file) => {
                    formData.append('files', file);
                });
                
                formData.append('user_id', userId);
                
                // Add video metadata if provided (applies to all images in batch)
                if (videoMetadata) {
                    formData.append('video_metadata', JSON.stringify(videoMetadata));
                }

                return {
                    url: getApiUrl('api/providers/vuforia/upload/batch', 'main'),
                    method: 'POST',
                    body: formData,
                    formData: true, // Disable automatic JSON serialization
                };
            },
            transformResponse: (response) => {
                // Handle ServiceResponse format from backend
                if (response && typeof response === 'object') {
                    // If it's already a ServiceResponse object
                    if (response.success !== undefined) {
                        return response;
                    }
                    // If it's nested in data property
                    if (response.data) {
                        return response.data;
                    }
                }
                return response;
            },
            transformErrorResponse: (response) => {
                // Enhanced error handling for batch uploads
                const defaultError = {
                    status: response.status || 500,
                    message: 'Batch upload failed. Please try again.',
                    details: null,
                    failedFiles: []
                };

                try {
                    if (response.data) {
                        const errorData = response.data;
                        
                        // Handle batch-specific errors
                        if (response.status === 400) {
                            if (errorData.detail?.includes('files')) {
                                return {
                                    ...defaultError,
                                    message: 'Invalid files detected. Please ensure all files are valid images.',
                                    details: errorData.detail
                                };
                            }
                            if (errorData.detail?.includes('batch size')) {
                                return {
                                    ...defaultError,
                                    message: 'Too many files in batch. Please upload fewer files at once.',
                                    details: errorData.detail
                                };
                            }
                        }
                        
                        if (response.status === 413) {
                            return {
                                ...defaultError,
                                message: 'Total batch size too large. Please reduce file sizes or upload fewer files.',
                                details: 'Batch size limit exceeded'
                            };
                        }
                        
                        if (response.status >= 500) {
                            return {
                                ...defaultError,
                                message: 'Server error during batch upload. Please try again later.',
                                details: errorData.detail || 'Internal server error'
                            };
                        }

                        // Handle partial success scenarios
                        if (errorData.results && Array.isArray(errorData.results)) {
                            const failedFiles = errorData.results
                                .filter(result => !result.success)
                                .map(result => ({
                                    filename: result.filename || 'Unknown',
                                    error: result.message || 'Upload failed'
                                }));

                            if (failedFiles.length > 0) {
                                return {
                                    ...defaultError,
                                    message: `Batch upload completed with ${failedFiles.length} failures.`,
                                    details: `${errorData.successful_uploads || 0} files uploaded successfully`,
                                    failedFiles
                                };
                            }
                        }

                        // Generic error with server message
                        return {
                            ...defaultError,
                            message: errorData.detail || errorData.message || defaultError.message,
                            details: errorData.detail
                        };
                    }
                } catch (parseError) {
                    console.error('Error parsing Vuforia batch upload error response:', parseError);
                }

                return defaultError;
            },
            invalidatesTags: ['Media', 'VuforiaImage'],
        }),

        // Get upload status and progress (useful for tracking large uploads)
        getVuforiaUploadStatus: builder.query({
            query: (imageId) => ({
                url: getApiUrl(`api/providers/vuforia/upload/status/${imageId}`, 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => {
                if (response && typeof response === 'object') {
                    if (response.success !== undefined) {
                        return response;
                    }
                    if (response.data) {
                        return response.data;
                    }
                }
                return response;
            },
            transformErrorResponse: (response) => {
                const defaultError = {
                    status: response.status || 500,
                    message: 'Failed to get upload status.',
                    details: null
                };

                try {
                    if (response.data) {
                        const errorData = response.data;
                        
                        if (response.status === 404) {
                            return {
                                ...defaultError,
                                message: 'Upload not found. The image may not have been uploaded or has been removed.',
                                details: errorData.detail
                            };
                        }
                        
                        return {
                            ...defaultError,
                            message: errorData.detail || errorData.message || defaultError.message,
                            details: errorData.detail
                        };
                    }
                } catch (parseError) {
                    console.error('Error parsing Vuforia status error response:', parseError);
                }

                return defaultError;
            },
            providesTags: (result, error, imageId) => [{ type: 'VuforiaImage', id: imageId }],
        }),
    }),
    overrideExisting: false,
});

// Export hooks for use in components
export const {
    useUploadImageToVuforiaMutation,
    useBatchUploadToVuforiaMutation,
    useGetVuforiaUploadStatusQuery,
} = vuforiaApi;

// Export utility functions for error handling
export const vuforiaUploadUtils = {
    /**
     * Validates video metadata structure
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
        if (metadata.videoUrl && typeof metadata.videoUrl !== 'string') {
            errors.push('videoUrl must be a string');
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
        
        if (metadata.videoPosition && !['overlay', 'background', 'inline'].includes(metadata.videoPosition)) {
            errors.push('videoPosition must be one of: overlay, background, inline');
        }
        
        if (metadata.videoScale !== undefined && (typeof metadata.videoScale !== 'number' || metadata.videoScale <= 0)) {
            errors.push('videoScale must be a positive number');
        }
        
        return { isValid: errors.length === 0, errors };
    },
    
    /**
     * Validates file for Vuforia upload
     * @param {File} file - File to validate
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    validateUploadFile: (file) => {
        const errors = [];
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!file) {
            errors.push('File is required');
            return { isValid: false, errors };
        }
        
        if (!allowedTypes.includes(file.type)) {
            errors.push('File must be a valid image format (JPEG, PNG, GIF, WebP)');
        }
        
        if (file.size > maxSize) {
            errors.push('File size must be less than 10MB');
        }
        
        if (file.size === 0) {
            errors.push('File cannot be empty');
        }
        
        return { isValid: errors.length === 0, errors };
    },
    
    /**
     * Formats upload response for UI display
     * @param {Object} response - Upload response from API
     * @returns {Object} - Formatted response
     */
    formatUploadResponse: (response) => {
        if (!response) return null;
        
        return {
            success: response.success || false,
            imageId: response.image_id || response.imageId || null,
            message: response.message || 'Upload completed',
            isDuplicate: response.is_duplicate || response.isDuplicate || false,
            duplicateId: response.duplicate_id || response.duplicateId || null,
            similarity: response.similarity || null,
            blobUrl: response.blob_url || response.blobUrl || null,
            vuforiaUploaded: response.vuforia_uploaded || response.vuforiaUploaded || false,
            processingTime: response.processing_time || response.processingTime || null,
        };
    }
};