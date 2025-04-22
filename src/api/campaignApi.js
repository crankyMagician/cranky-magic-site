// campaignApi.js
import baseApi, { getApiUrl } from './baseApi';

export const campaignApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create campaign
        createCampaign: builder.mutation({
            query: (campaignData) => ({
                url: getApiUrl('/campaigns', 'main'),
                method: 'POST',
                body: campaignData,
            }),
        }),

        // Update campaign
        updateCampaign: builder.mutation({
            query: (campaignData) => ({
                url: getApiUrl('/campaigns', 'main'),
                method: 'PUT',
                body: campaignData,
            }),
        }),

        // Get campaign by ID
        getCampaignById: builder.query({
            query: (campaignId) => ({
                url: getApiUrl(`/campaigns/${campaignId}`, 'main'),
                method: 'GET',
            }),
        }),

        // Delete campaign
        deleteCampaign: builder.mutation({
            query: (campaignId) => ({
                url: getApiUrl(`/campaigns/${campaignId}`, 'main'),
                method: 'DELETE',
            }),
        }),

        // Get campaigns for a business
        getCampaignsByBusiness: builder.query({
            query: (businessId) => ({
                url: getApiUrl(`/campaigns/business/${businessId}`, 'main'),
                method: 'GET',
            }),
        }),

        // Attach media to campaign
        attachCampaignMedia: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/campaigns/media/attach', 'main'),
                method: 'POST',
                body: data,
            }),
        }),

        // Delete campaign media
        deleteCampaignMedia: builder.mutation({
            query: ({ campaignId, mediaAssetId }) => ({
                url: getApiUrl(`/campaigns/${campaignId}/media/${mediaAssetId}`, 'main'),
                method: 'DELETE',
            }),
        }),

        // Update campaign status
        updateCampaignStatus: builder.mutation({
            query: (data) => ({
                url: getApiUrl('/campaigns/status', 'main'),
                method: 'PUT',
                body: data,
            }),
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
} = campaignApi;