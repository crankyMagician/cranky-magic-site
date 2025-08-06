// campaignApi.js
import baseApi, { getApiUrl, campaignsApi } from './baseApi';
import { transformServiceResponse, transformServiceErrorResponse, transformPaginatedResponse } from './baseApiHelpers';

export const campaignApiExtended = campaignsApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create campaign
        createCampaign: builder.mutation({
            query: ({ businessId, ...campaignData }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for creating campaign');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns`, 'main'),
                    method: 'POST',
                    body: campaignData,
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to create campaign'),
            invalidatesTags: (result, error, { businessId }) => [
                'Campaign',
                { type: 'BusinessCampaigns', id: businessId }
            ],
        }),

        // Update campaign
        updateCampaign: builder.mutation({
            query: ({ businessId, campaignId, ...updateData }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for updating campaign');
                }

                const validCampaignId = campaignId ? String(campaignId) : null;
                if (!validCampaignId || validCampaignId === 'undefined' || validCampaignId === 'null') {
                    throw new Error('Valid campaignId is required for updating campaign');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns/${validCampaignId}`, 'main'),
                    method: 'PUT',
                    body: updateData,
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to update campaign'),
            invalidatesTags: (result, error, { businessId, campaignId }) => [
                { type: 'Campaign', id: campaignId },
                { type: 'BusinessCampaigns', id: businessId }
            ],
        }),

        // Get campaign by ID
        getCampaignById: builder.query({
            query: ({ businessId, campaignId }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for getting campaign');
                }

                const validCampaignId = campaignId ? String(campaignId) : null;
                if (!validCampaignId || validCampaignId === 'undefined' || validCampaignId === 'null') {
                    throw new Error('Valid campaignId is required for getting campaign');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns/${validCampaignId}`, 'main'),
                    method: 'GET',
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get campaign'),
            providesTags: (result, error, { campaignId }) => [{ type: 'Campaign', id: campaignId }],
        }),

        // Delete campaign
        deleteCampaign: builder.mutation({
            query: ({ businessId, campaignId }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for deleting campaign');
                }

                const validCampaignId = campaignId ? String(campaignId) : null;
                if (!validCampaignId || validCampaignId === 'undefined' || validCampaignId === 'null') {
                    throw new Error('Valid campaignId is required for deleting campaign');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns/${validCampaignId}`, 'main'),
                    method: 'DELETE',
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to delete campaign'),
            invalidatesTags: (result, error, { businessId, campaignId }) => [
                { type: 'Campaign', id: campaignId },
                { type: 'BusinessCampaigns', id: businessId }
            ],
        }),

        // Get campaigns for a business
        getCampaignsByBusiness: builder.query({
            query: ({ businessId, page = 1, pageSize = 10, status, search }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for getting campaigns');
                }

                // Ensure page and pageSize are properly converted to integers
                const validPage = Math.max(1, parseInt(page, 10) || 1);
                const validPageSize = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 10));

                // Build query parameters object
                const params = {
                    page: validPage,
                    pageSize: validPageSize
                };

                // Add optional parameters only if they have valid values
                if (status && status !== 'all' && typeof status === 'string') {
                    params.status = status;
                }

                if (search && typeof search === 'string' && search.trim()) {
                    params.search = search.trim();
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns`, 'main'),
                    method: 'GET',
                    params: params,
                };
            },
            transformResponse: (response) => transformPaginatedResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get campaigns'),
            providesTags: (result, error, { businessId }) => [
                { type: 'BusinessCampaigns', id: businessId },
                'Campaign'
            ],
            // Add additional options for better error handling
            forceRefetch: ({ currentArg, previousArg }) => {
                // Force refetch if businessId changes
                return currentArg?.businessId !== previousArg?.businessId;
            },
        }),

        // Attach media to campaign
        attachCampaignMedia: builder.mutation({
            query: ({ businessId, campaignId, ...attachmentData }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for attaching campaign media');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns/media`, 'main'),
                    method: 'POST',
                    body: { campaignId, ...attachmentData },
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to attach media to campaign'),
            invalidatesTags: (result, error, { businessId, campaignId }) => [
                { type: 'Campaign', id: campaignId },
                { type: 'CampaignMedia', id: campaignId }
            ],
        }),

        // Delete campaign media
        deleteCampaignMedia: builder.mutation({
            query: ({ businessId, campaignId, mediaAssetId }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for deleting campaign media');
                }

                const validCampaignId = campaignId ? String(campaignId) : null;
                if (!validCampaignId || validCampaignId === 'undefined' || validCampaignId === 'null') {
                    throw new Error('Valid campaignId is required for deleting campaign media');
                }

                const validMediaAssetId = mediaAssetId ? String(mediaAssetId) : null;
                if (!validMediaAssetId || validMediaAssetId === 'undefined' || validMediaAssetId === 'null') {
                    throw new Error('Valid mediaAssetId is required for deleting campaign media');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns/${validCampaignId}/media/${validMediaAssetId}`, 'main'),
                    method: 'DELETE',
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to remove media from campaign'),
            invalidatesTags: (result, error, { campaignId }) => [
                { type: 'Campaign', id: campaignId },
                { type: 'CampaignMedia', id: campaignId }
            ],
        }),

        // Update campaign status
        updateCampaignStatus: builder.mutation({
            query: ({ businessId, campaignId, status }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for updating campaign status');
                }

                const validCampaignId = campaignId ? String(campaignId) : null;
                if (!validCampaignId || validCampaignId === 'undefined' || validCampaignId === 'null') {
                    throw new Error('Valid campaignId is required for updating campaign status');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns/${validCampaignId}/status`, 'main'),
                    method: 'PUT',
                    body: { campaignId: validCampaignId, status },
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to update campaign status'),
            invalidatesTags: (result, error, { campaignId }) => [
                { type: 'Campaign', id: campaignId }
            ],
        }),

        // Get Vuforia stats for campaign (if this endpoint exists)
        getCampaignVuforiaStats: builder.query({
            query: ({ businessId, campaignId }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for getting Vuforia stats');
                }

                const validCampaignId = campaignId ? String(campaignId) : null;
                if (!validCampaignId || validCampaignId === 'undefined' || validCampaignId === 'null') {
                    throw new Error('Valid campaignId is required for getting Vuforia stats');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns/${validCampaignId}/vuforia-stats`, 'main'),
                    method: 'GET',
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get Vuforia stats'),
            providesTags: (result, error, { campaignId }) => [
                { type: 'VuforiaStats', id: campaignId }
            ],
        }),

        // Bulk update Vuforia media (if this endpoint exists)
        bulkUpdateVuforiaMedia: builder.mutation({
            query: ({ businessId, campaignId, updates }) => {
                // Ensure businessId is properly converted to string and validate
                const validBusinessId = businessId ? String(businessId) : null;
                if (!validBusinessId || validBusinessId === 'undefined' || validBusinessId === 'null') {
                    throw new Error('Valid businessId is required for bulk updating Vuforia media');
                }

                const validCampaignId = campaignId ? String(campaignId) : null;
                if (!validCampaignId || validCampaignId === 'undefined' || validCampaignId === 'null') {
                    throw new Error('Valid campaignId is required for bulk updating Vuforia media');
                }

                return {
                    url: getApiUrl(`api/business/${validBusinessId}/campaigns/${validCampaignId}/vuforia-media/bulk`, 'main'),
                    method: 'PUT',
                    body: updates,
                };
            },
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to bulk update Vuforia media'),
            invalidatesTags: (result, error, { campaignId }) => [
                { type: 'Campaign', id: campaignId },
                { type: 'CampaignMedia', id: campaignId },
                { type: 'VuforiaStats', id: campaignId }
            ],
        }),
    }),
    overrideExisting: false,
});

// Export the hooks
export const {
    useCreateCampaignMutation,
    useUpdateCampaignMutation,
    useGetCampaignByIdQuery,
    useDeleteCampaignMutation,
    useGetCampaignsByBusinessQuery,
    useAttachCampaignMediaMutation,
    useDeleteCampaignMediaMutation,
    useUpdateCampaignStatusMutation,
    useGetCampaignVuforiaStatsQuery,
    useBulkUpdateVuforiaMediaMutation,
} = campaignApiExtended;

// Export utility functions for campaign operations
export const campaignMediaUtils = {
    /**
     * Format campaign media attachment data
     * @param {Object} data - Media attachment data
     * @returns {Object} - Formatted attachment data
     */
    formatMediaAttachment: (data) => {
        return {
            campaignId: parseInt(data.campaignId, 10),
            mediaAssetId: parseInt(data.mediaAssetId, 10),
            sortOrder: data.sortOrder || 0,
            mediaType: data.mediaType || null,
            metadata: typeof data.metadata === 'string'
                ? data.metadata
                : JSON.stringify(data.metadata || {})
        };
    },

    /**
     * Parse campaign media metadata
     * @param {string} metadata - JSON string metadata
     * @returns {Object} - Parsed metadata object
     */
    parseMediaMetadata: (metadata) => {
        if (!metadata) return {};

        try {
            return typeof metadata === 'string'
                ? JSON.parse(metadata)
                : metadata;
        } catch (error) {
            console.error('Failed to parse media metadata:', error);
            return {};
        }
    },

    /**
     * Group campaign media by type
     * @param {Array} media - Array of campaign media
     * @returns {Object} - Media grouped by type
     */
    groupMediaByType: (media) => {
        if (!Array.isArray(media)) return {};

        return media.reduce((groups, item) => {
            const type = item.mediaTypeName || item.campaignMediaType || 'other';
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(item);
            return groups;
        }, {});
    },

    /**
     * Sort campaign media by sort order
     * @param {Array} media - Array of campaign media
     * @returns {Array} - Sorted media array
     */
    sortMediaBySortOrder: (media) => {
        if (!Array.isArray(media)) return [];

        return [...media].sort((a, b) => {
            const orderA = a.sortOrder || 0;
            const orderB = b.sortOrder || 0;
            return orderA - orderB;
        });
    },

    /**
     * Check if media is AR/Vuforia media
     * @param {Object} mediaItem - Media item
     * @returns {boolean} - True if AR media
     */
    isArMedia: (mediaItem) => {
        const arTypes = ['ar_image', 'vuforia', 'ar'];
        const mediaType = (mediaItem.mediaTypeName || mediaItem.campaignMediaType || '').toLowerCase();

        return arTypes.some(type => mediaType.includes(type)) ||
            (mediaItem.metadata && typeof mediaItem.metadata === 'object' && mediaItem.metadata.vuforiaData);
    },

    /**
     * Extract video metadata from campaign media
     * @param {Object} mediaItem - Media item
     * @returns {Object|null} - Video metadata or null
     */
    extractVideoMetadata: (mediaItem) => {
        const metadata = campaignMediaUtils.parseMediaMetadata(mediaItem.metadata);

        if (metadata.videoMetadata) {
            return metadata.videoMetadata;
        }

        if (metadata.videoUrl) {
            return {
                videoUrl: metadata.videoUrl,
                autoPlay: metadata.autoPlay || false,
                loop: metadata.loop || false,
                muted: metadata.muted || false,
                videoScale: metadata.videoScale || 1.0
            };
        }

        return null;
    },
};