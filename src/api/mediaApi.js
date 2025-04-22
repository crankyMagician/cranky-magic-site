// mediaApi.js
import baseApi, { getApiUrl } from './baseApi';

export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Upload media
        uploadMedia: builder.mutation({
            query: (formData) => ({
                url: getApiUrl('/media/upload', 'main'),
                method: 'POST',
                body: formData,
            }),
        }),

        // Update business logo
        updateBusinessLogo: builder.mutation({
            query: (logoData) => ({
                url: getApiUrl('/media/business/logo', 'main'),
                method: 'PUT',
                body: logoData,
            }),
        }),

        // Get media by ID
        getMediaById: builder.query({
            query: (mediaId) => ({
                url: getApiUrl(`/media/${mediaId}`, 'main'),
                method: 'GET',
            }),
        }),

        // Delete media by ID
        deleteMedia: builder.mutation({
            query: (mediaId) => ({
                url: getApiUrl(`/media/${mediaId}`, 'main'),
                method: 'DELETE',
            }),
        }),

        // Get media for a business
        getBusinessMedia: builder.query({
            query: ({ businessId, mediaTypeId, page, pageSize }) => ({
                url: getApiUrl(`/media/business/${businessId}?mediaTypeId=${mediaTypeId}&page=${page}&pageSize=${pageSize}`, 'main'),
                method: 'GET',
            }),
        }),

        // Get media types
        getMediaTypes: builder.query({
            query: () => ({
                url: getApiUrl('/media/types', 'main'),
                method: 'GET',
            }),
        }),

        // Download media
        downloadMedia: builder.query({
            query: (mediaId) => ({
                url: getApiUrl(`/media/${mediaId}/download`, 'main'),
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