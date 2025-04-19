// campaignApi.js
import baseApi from './baseApi';

const isDevelopment = process.env.NODE_ENV === 'development';

export const campaignApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create campaign
        createCampaign: builder.mutation({
            query: (campaignData) => ({
                url: '/https://dev.net-api.spatialmods.com/api/campaigns',
                method: 'POST',
                body: campaignData,
            }),
        }),

        // Update campaign
        updateCampaign: builder.mutation({
            query: (campaignData) => ({
                url:  '/https://dev.net-api.spatialmods.com/api/campaigns',
                method: 'PUT',
                body: campaignData,
            }),
        }),

        // Get campaign by ID
        getCampaignById: builder.query({
            query: (campaignId) => ({
                url:  `/https://dev.net-api.spatialmods.com/api/campaigns/${campaignId}`,
                method: 'GET',
            }),
        }),

        // Delete campaign
        deleteCampaign: builder.mutation({
            query: (campaignId) => ({
                url:`/https://dev.net-api.spatialmods.com/api/campaigns/${campaignId}`,
                method: 'DELETE',
            }),
        }),

        // Get campaigns for a business
        getCampaignsByBusiness: builder.query({
            query: (businessId) => ({
                url:`/https://dev.net-api.spatialmods.com/api/campaigns/business/${businessId}`,
                method: 'GET',
            }),
        }),

        // Attach media to campaign
        attachCampaignMedia: builder.mutation({
            query: (data) => ({
                url:'/https://dev.net-api.spatialmods.com/api/campaigns/media/attach',
                method: 'POST',
                body: data,
            }),
        }),

        // Delete campaign media
        deleteCampaignMedia: builder.mutation({
            query: ({ campaignId, mediaAssetId }) => ({
                url:`/https://dev.net-api.spatialmods.com/api/campaigns/${campaignId}/media/${mediaAssetId}`,
                method: 'DELETE',
            }),
        }),

        // Update campaign status
        updateCampaignStatus: builder.mutation({
            query: (data) => ({
                url:'/https://dev.net-api.spatialmods.com/api/campaigns/status',
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
