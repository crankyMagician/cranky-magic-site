// campaignApi.js
import baseApi, { getApiUrl, campaignsApi } from './baseApi';
import { transformServiceResponse, transformServiceErrorResponse, transformPaginatedResponse } from './baseApiHelpers';

export const campaignApiExtended = campaignsApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create campaign
        createCampaign: builder.mutation({
            query: ({ businessId, ...campaignData }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns`, 'main'),
                method: 'POST',
                body: campaignData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to create campaign'),
            invalidatesTags: (result, error, { businessId }) => [
                'Campaign',
                { type: 'BusinessCampaigns', id: businessId }
            ],
        }),

        // Update campaign
        updateCampaign: builder.mutation({
            query: ({ businessId, campaignId, ...updateData }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns/${campaignId}`, 'main'),
                method: 'PUT',
                body: updateData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to update campaign'),
            invalidatesTags: (result, error, { businessId, campaignId }) => [
                { type: 'Campaign', id: campaignId },
                { type: 'BusinessCampaigns', id: businessId }
            ],
        }),

        // Get campaign by ID
        getCampaignById: builder.query({
            query: ({ businessId, campaignId }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns/${campaignId}`, 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get campaign'),
            providesTags: (result, error, { campaignId }) => [{ type: 'Campaign', id: campaignId }],
        }),

        // Delete campaign
        deleteCampaign: builder.mutation({
            query: ({ businessId, campaignId }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns/${campaignId}`, 'main'),
                method: 'DELETE',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to delete campaign'),
            invalidatesTags: (result, error, { businessId, campaignId }) => [
                { type: 'Campaign', id: campaignId },
                { type: 'BusinessCampaigns', id: businessId }
            ],
        }),

        // Get campaigns for a business
        getCampaignsByBusiness: builder.query({
            query: ({ businessId, page = 1, pageSize = 10 }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns`, 'main'),
                method: 'GET',
                params: { page, pageSize },
            }),
            transformResponse: (response) => transformPaginatedResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get campaigns'),
            providesTags: (result, error, { businessId }) => [
                { type: 'BusinessCampaigns', id: businessId },
                'Campaign'
            ],
        }),

        // Attach media to campaign
        attachCampaignMedia: builder.mutation({
            query: ({ businessId, ...attachmentData }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns/media`, 'main'),
                method: 'POST',
                body: attachmentData,
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to attach media to campaign'),
            invalidatesTags: (result, error, { businessId, campaignId }) => [
                { type: 'Campaign', id: attachmentData.campaignId },
                { type: 'CampaignMedia', id: attachmentData.campaignId }
            ],
        }),

        // Delete campaign media
        deleteCampaignMedia: builder.mutation({
            query: ({ businessId, campaignId, mediaAssetId }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns/${campaignId}/media/${mediaAssetId}`, 'main'),
                method: 'DELETE',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to remove media from campaign'),
            invalidatesTags: (result, error, { campaignId }) => [
                { type: 'Campaign', id: campaignId },
                { type: 'CampaignMedia', id: campaignId }
            ],
        }),

        // Update campaign status
        updateCampaignStatus: builder.mutation({
            query: ({ businessId, campaignId, status }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns/${campaignId}/status`, 'main'),
                method: 'PUT',
                body: { campaignId, status },
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to update campaign status'),
            invalidatesTags: (result, error, { campaignId }) => [
                { type: 'Campaign', id: campaignId }
            ],
        }),

        // Get Vuforia stats for campaign (if this endpoint exists)
        getCampaignVuforiaStats: builder.query({
            query: ({ businessId, campaignId }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns/${campaignId}/vuforia-stats`, 'main'),
                method: 'GET',
            }),
            transformResponse: (response) => transformServiceResponse(response),
            transformErrorResponse: (response) => transformServiceErrorResponse(response, 'Failed to get Vuforia stats'),
            providesTags: (result, error, { campaignId }) => [
                { type: 'VuforiaStats', id: campaignId }
            ],
        }),

        // Bulk update Vuforia media (if this endpoint exists)
        bulkUpdateVuforiaMedia: builder.mutation({
            query: ({ businessId, campaignId, updates }) => ({
                url: getApiUrl(`api/business/${businessId}/campaigns/${campaignId}/vuforia-media/bulk`, 'main'),
                method: 'PUT',
                body: updates,
            }),
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