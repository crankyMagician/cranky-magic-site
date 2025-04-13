// campaignApi.js
import baseApi from './baseApi';

const isDevelopment = process.env.NODE_ENV === 'development';

export const campaignApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create campaign
        createCampaign: builder.mutation({
            query: (campaignData) => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/campaigns'
                    : `${process.env.REACT_APP_MAIN_API_URL}/campaigns`,
                method: 'POST',
                body: campaignData,
            }),
        }),

        // Update campaign
        updateCampaign: builder.mutation({
            query: (campaignData) => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/campaigns'
                    : `${process.env.REACT_APP_MAIN_API_URL}/campaigns`,
                method: 'PUT',
                body: campaignData,
            }),
        }),

        // Get campaign by ID
        getCampaignById: builder.query({
            query: (campaignId) => ({
                url: isDevelopment
                    ? `/https://dev.net-api.spatialmods.com/api/campaigns/${campaignId}`
                    : `${process.env.REACT_APP_MAIN_API_URL}/campaigns/${campaignId}`,
                method: 'GET',
            }),
        }),

        // Delete campaign
        deleteCampaign: builder.mutation({
            query: (campaignId) => ({
                url: isDevelopment
                    ? `/https://dev.net-api.spatialmods.com/api/campaigns/${campaignId}`
                    : `${process.env.REACT_APP_MAIN_API_URL}/campaigns/${campaignId}`,
                method: 'DELETE',
            }),
        }),

        // Get campaigns for a business
        getCampaignsByBusiness: builder.query({
            query: (businessId) => ({
                url: isDevelopment
                    ? `/https://dev.net-api.spatialmods.com/api/campaigns/business/${businessId}`
                    : `${process.env.REACT_APP_MAIN_API_URL}/campaigns/business/${businessId}`,
                method: 'GET',
            }),
        }),

        // Attach media to campaign
        attachCampaignMedia: builder.mutation({
            query: (data) => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/campaigns/media/attach'
                    : `${process.env.REACT_APP_MAIN_API_URL}/campaigns/media/attach`,
                method: 'POST',
                body: data,
            }),
        }),

        // Delete campaign media
        deleteCampaignMedia: builder.mutation({
            query: ({ campaignId, mediaAssetId }) => ({
                url: isDevelopment
                    ? `/https://dev.net-api.spatialmods.com/api/campaigns/${campaignId}/media/${mediaAssetId}`
                    : `${process.env.REACT_APP_MAIN_API_URL}/campaigns/${campaignId}/media/${mediaAssetId}`,
                method: 'DELETE',
            }),
        }),

        // Update campaign status
        updateCampaignStatus: builder.mutation({
            query: (data) => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/campaigns/status'
                    : `${process.env.REACT_APP_MAIN_API_URL}/campaigns/status`,
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
