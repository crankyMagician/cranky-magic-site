// campaignApi.js
import baseApi, { getApiUrl, campaignsApi } from './baseApi';

export const campaignApiExtended = campaignsApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create campaign
        createCampaign: builder.mutation({
            query: (campaignData) => ({
                url: getApiUrl('api/campaigns', 'main'),
                method: 'POST',
                body: campaignData,
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Update campaign
        updateCampaign: builder.mutation({
            query: (campaignData) => ({
                url: getApiUrl('api/campaigns', 'main'),
                method: 'PUT',
                body: campaignData,
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Get campaign by ID
        getCampaignById: builder.query({
            query: (campaignId) => ({
                url: getApiUrl(`api/campaigns/${campaignId}`, 'main'),
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Campaign', id }],
        }),

        // Delete campaign
        deleteCampaign: builder.mutation({
            query: (campaignId) => ({
                url: getApiUrl(`api/campaigns/${campaignId}`, 'main'),
                method: 'DELETE',
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Get campaigns for a business
        getCampaignsByBusiness: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`api/campaigns/business/${businessId}`, 'main'),
                method: 'GET',
            }),
            providesTags: ['Campaign'],
        }),

        // Attach media to campaign
        attachCampaignMedia: builder.mutation({
            query: (data) => ({
                url: getApiUrl('api/campaigns/media/attach', 'main'),
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Delete campaign media
        deleteCampaignMedia: builder.mutation({
            query: ({ campaignId, mediaAssetId }) => ({
                url: getApiUrl(`api/campaigns/${campaignId}/media/${mediaAssetId}`, 'main'),
                method: 'DELETE',
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Update campaign status
        updateCampaignStatus: builder.mutation({
            query: (data) => ({
                url: getApiUrl('api/campaigns/status', 'main'),
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Campaign'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useCreateCampaignMutation,
    useUpdateCampaignMutation,
    useGetCampaignByIdQuery,
    useDeleteCampaignMutation,
    useGetCampaignsByBusinessQuery,
    useAttachCampaignMediaMutation,
    useDeleteCampaignMediaMutation,
    useUpdateCampaignStatusMutation,
} = campaignApiExtended;