// mediaApi.js
import baseApi, { getApiUrl, mediaApi } from './baseApi';
import { transformServiceResponse, transformServiceErrorResponse, transformPaginatedResponse, transformFileDownloadResponse } from './baseApiHelpers';

export const mediaApiExtended = mediaApi.injectEndpoints({
    endpoints: (builder) => ({
        // Upload media
        uploadMedia: builder.mutation({
            query: ({ businessId, formData }) => ({
                url: getApiUrl(`api/business/${businessId}/media/upload`, 'main'),
                method: 'POST',
                body: formData,
                // Let browser set Content-Type with boundary for multipart/form-data
                formData: true,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to upload media'),
            invalidatesTags: ['Media'],
        }),

        // Get media by ID
        getMediaById: builder.query({
            query: ({ businessId, mediaId }) => ({
                url: getApiUrl(`api/business/${businessId}/media/${mediaId}`, 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get media'),
            providesTags: (result, error, { mediaId }) => [{ type: 'Media', id: mediaId }],
        }),

        // Delete media by ID
        deleteMedia: builder.mutation({
            query: ({ businessId, mediaId }) => ({
                url: getApiUrl(`api/business/${businessId}/media/${mediaId}`, 'main'),
                method: 'DELETE',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to delete media'),
            invalidatesTags: (result, error, { mediaId }) => [
                { type: 'Media', id: mediaId },
                'Media'
            ],
        }),

        // Get media for a business with pagination
        getBusinessMedia: builder.query({
            query: ({ businessId, mediaTypeId, page = 1, pageSize = 10 }) => ({
                url: getApiUrl(`api/business/${businessId}/media`, 'main'),
                method: 'GET',
                params: {
                    mediaTypeId,
                    page,
                    pageSize
                },
            }),
            transformResponse: (response) => transformPaginatedResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get business media'),
            providesTags: (result, error, { businessId }) => [
                { type: 'Media', id: 'LIST' },
                { type: 'BusinessMedia', id: businessId }
            ],
        }),

        // Get media types
        getMediaTypes: builder.query({
            query: () => ({
                url: getApiUrl('api/media/types', 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get media types'),
            providesTags: ['MediaTypes'],
        }),

        // Download media
        downloadMedia: builder.query({
            query: ({ businessId, mediaId }) => ({
                url: getApiUrl(`api/business/${businessId}/media/${mediaId}/download`, 'main'),
                method: 'GET',
                // Handle file download - expect blob response
                responseHandler: async (response) => {
                    // Check if response is JSON (error) or blob (file)
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        // It's an error response, parse as JSON
                        return response.json();
                    }
                    // It's a file, return as blob
                    return response.blob();
                },
            }),
            transformResponse: (response) => transformFileDownloadResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to download media'),
        }),

        // Update business logo - NOT IN SWAGGER, might be deprecated
        updateBusinessLogo: builder.mutation({
            query: ({ businessId, logoData }) => ({
                url: getApiUrl(`api/business/${businessId}/logo`, 'main'),
                method: 'PUT',
                body: logoData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to update business logo'),
            invalidatesTags: ['Media', 'Business'],
        }),
    }),
    overrideExisting: false,
});

// Export hooks
export const {
    useUploadMediaMutation,
    useGetMediaByIdQuery,
    useDeleteMediaMutation,
    useGetBusinessMediaQuery,
    useGetMediaTypesQuery,
    useDownloadMediaQuery,
    useUpdateBusinessLogoMutation,
} = mediaApiExtended;

// Export utility functions for media handling
export const mediaUtils = {
    /**
     * Create FormData for media upload
     * @param {Object} mediaData - Media upload data
     * @returns {FormData} - FormData object ready for upload
     */
    createMediaFormData: (mediaData) => {
        const formData = new FormData();

        // Required fields
        formData.append('File', mediaData.file);
        formData.append('Title', mediaData.title);
        formData.append('MediaTypeId', mediaData.mediaTypeId);

        // Optional fields
        if (mediaData.description) {
            formData.append('Description', mediaData.description);
        }

        if (mediaData.isPublic !== undefined) {
            formData.append('IsPublic', mediaData.isPublic);
        }

        if (mediaData.metadata) {
            formData.append('Metadata',
                typeof mediaData.metadata === 'string'
                    ? mediaData.metadata
                    : JSON.stringify(mediaData.metadata)
            );
        }

        return formData;
    },

    /**
     * Get media type icon based on media type name
     * @param {string} mediaTypeName - Name of the media type
     * @returns {string} - Icon name or component
     */
    getMediaTypeIcon: (mediaTypeName) => {
        const typeMap = {
            'image': 'Image',
            'video': 'VideoLibrary',
            'document': 'Description',
            'audio': 'AudioFile',
            'ar_image': 'ViewInAr',
            'default': 'InsertDriveFile'
        };

        const lowerType = mediaTypeName?.toLowerCase() || '';

        for (const [key, icon] of Object.entries(typeMap)) {
            if (lowerType.includes(key)) {
                return icon;
            }
        }

        return typeMap.default;
    },

    /**
     * Format file size for display
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
     */
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Validate file before upload
     * @param {File} file - File to validate
     * @param {Object} constraints - Validation constraints
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    validateMediaFile: (file, constraints = {}) => {
        const errors = [];
        const {
            maxSize = 10 * 1024 * 1024, // 10MB default
            allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        } = constraints;

        // Check file size
        if (file.size > maxSize) {
            errors.push(`File size exceeds maximum of ${mediaUtils.formatFileSize(maxSize)}`);
        }

        // Check file type
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            errors.push(`File type ${file.type} is not allowed`);
        }

        // Check file extension
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
            errors.push(`File extension ${extension} is not allowed`);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },
};