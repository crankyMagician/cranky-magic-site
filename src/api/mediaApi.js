// mediaApi.js
import baseApi from './baseApi';

const isDevelopment = process.env.NODE_ENV === 'development';

export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Upload media
        uploadMedia: builder.mutation({
            query: (formData) => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/media/upload'
                    : `${process.env.REACT_APP_MAIN_API_URL}/media/upload`,
                method: 'POST',
                body: formData,
            }),
        }),

        // Update business logo
        updateBusinessLogo: builder.mutation({
            query: (logoData) => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/media/business/logo'
                    : `${process.env.REACT_APP_MAIN_API_URL}/media/business/logo`,
                method: 'PUT',
                body: logoData,
            }),
        }),

        // Get media by ID
        getMediaById: builder.query({
            query: (mediaId) => ({
                url: isDevelopment
                    ? `/https://dev.net-api.spatialmods.com/api/media/${mediaId}`
                    : `${process.env.REACT_APP_MAIN_API_URL}/media/${mediaId}`,
                method: 'GET',
            }),
        }),

        // Delete media by ID
        deleteMedia: builder.mutation({
            query: (mediaId) => ({
                url: isDevelopment
                    ? `/https://dev.net-api.spatialmods.com/api/media/${mediaId}`
                    : `${process.env.REACT_APP_MAIN_API_URL}/media/${mediaId}`,
                method: 'DELETE',
            }),
        }),

        // Get media for a business
        getBusinessMedia: builder.query({
            query: ({ businessId, mediaTypeId, page, pageSize }) => ({
                url: isDevelopment
                    ? `/https://dev.net-api.spatialmods.com/api/media/business/${businessId}?mediaTypeId=${mediaTypeId}&page=${page}&pageSize=${pageSize}`
                    : `${process.env.REACT_APP_MAIN_API_URL}/media/business/${businessId}?mediaTypeId=${mediaTypeId}&page=${page}&pageSize=${pageSize}`,
                method: 'GET',
            }),
        }),

        // Get media types
        getMediaTypes: builder.query({
            query: () => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/media/types'
                    : `${process.env.REACT_APP_MAIN_API_URL}/media/types`,
                method: 'GET',
            }),
        }),

        // Download media
        downloadMedia: builder.query({
            query: (mediaId) => ({
                url: isDevelopment
                    ? `/https://dev.net-api.spatialmods.com/api/media/${mediaId}/download`
                    : `${process.env.REACT_APP_MAIN_API_URL}/media/${mediaId}/download`,
                method: 'GET',
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useUploadMediaMutation,
    useUpdateBusinessLogoMutation,
    useGetMediaByIdQuery,
    useDeleteMediaMutation,
    useGetBusinessMediaQuery,
    useGetMediaTypesQuery,
    useDownloadMediaQuery,
} = mediaApi;
