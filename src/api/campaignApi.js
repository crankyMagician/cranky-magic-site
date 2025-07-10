// campaignApi.js
import baseApi, { getApiUrl, campaignsApi } from './baseApi';

export const campaignApiExtended = campaignsApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create campaign
        createCampaign: builder.mutation({
            query: (campaignData) => ({
                url: getApiUrl('api/campaigns', 'main'),
                method: 'POST',
                body: {
                    ...campaignData,
                    // Ensure businessId is always sent as a number
                    businessId: parseInt(campaignData.businessId, 10)
                },
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Update campaign
        updateCampaign: builder.mutation({
            query: (campaignData) => ({
                url: getApiUrl('api/campaigns', 'main'),
                method: 'PUT',
                body: {
                    ...campaignData,
                    // Ensure businessId is always sent as a number
                    businessId: parseInt(campaignData.businessId, 10)
                },
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
                body: {
                    ...data,
                    // Ensure businessId is a number if present
                    ...(data.businessId && { businessId: parseInt(data.businessId, 10) })
                },
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Delete campaign media
        deleteCampaignMedia: builder.mutation({
            query: (data) => ({
                url: getApiUrl('api/campaigns/media/delete', 'main'),
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Update campaign status
        updateCampaignStatus: builder.mutation({
            query: ({ campaignId, status }) => ({
                url: getApiUrl(`api/campaigns/${campaignId}/status`, 'main'),
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Campaign'],
        }),
    }),
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
} = campaignApiExtended;