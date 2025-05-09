// campaignApi.js
import { campaignsApi } from './baseApi';

export const campaignApiExtended = campaignsApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create campaign
        createCampaign: builder.mutation({
            query: (campaignData) => ({
                url: '/',
                method: 'POST',
                body: campaignData,
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Update campaign
        updateCampaign: builder.mutation({
            query: (campaignData) => ({
                url: '/',
                method: 'PUT',
                body: campaignData,
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Get campaign by ID
        getCampaignById: builder.query({
            query: (campaignId) => ({
                url: `/${campaignId}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Campaign', id }],
        }),

        // Delete campaign
        deleteCampaign: builder.mutation({
            query: (campaignId) => ({
                url: `/${campaignId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Get campaigns for a business
        getCampaignsByBusiness: builder.query({
            query: (businessId) => ({
                url: `/business/${businessId}`,
                method: 'GET',
            }),
            providesTags: ['Campaign'],
        }),

        // Attach media to campaign
        attachCampaignMedia: builder.mutation({
            query: (data) => ({
                url: '/media/attach',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Delete campaign media
        deleteCampaignMedia: builder.mutation({
            query: ({ campaignId, mediaAssetId }) => ({
                url: `/${campaignId}/media/${mediaAssetId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Campaign'],
        }),

        // Update campaign status
        updateCampaignStatus: builder.mutation({
            query: (data) => ({
                url: '/status',
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