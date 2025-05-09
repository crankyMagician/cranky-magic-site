// mediaApi.js
import baseApi, { getApiUrl, mediaApi } from './baseApi';

export const mediaApiExtended = mediaApi.injectEndpoints({
    endpoints: (builder) => ({
        // Upload media
        uploadMedia: builder.mutation({
            query: (formData) => ({
                url: getApiUrl('media/upload', 'main'),
                method: 'POST',
                body: formData,
                formData: true, // Important for file uploads
            }),
            invalidatesTags: ['Media'],
        }),

        // Update business logo
        updateBusinessLogo: builder.mutation({
            query: (logoData) => ({
                url: getApiUrl('media/business/logo', 'main'),
                method: 'PUT',
                body: logoData,
            }),
            invalidatesTags: ['Media', 'Business'],
        }),

        // Get media by ID
        getMediaById: builder.query({
            query: (mediaId) => ({
                url: getApiUrl(`media/${mediaId}`, 'main'),
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Media', id }],
        }),

        // Delete media by ID
        deleteMedia: builder.mutation({
            query: (mediaId) => ({
                url: getApiUrl(`media/${mediaId}`, 'main'),
                method: 'DELETE',
            }),
            invalidatesTags: ['Media'],
        }),

        // Get media for a business
        getBusinessMedia: builder.query({
            query: ({ businessId, mediaTypeId, page, pageSize }) => ({
                url: getApiUrl(`media/business/${businessId}`, 'main'),
                method: 'GET',
                params: { mediaTypeId, page, pageSize },
            }),
            providesTags: ['Media'],
        }),

        // Get media types
        getMediaTypes: builder.query({
            query: () => ({
                url: getApiUrl('media/types', 'main'),
                method: 'GET',
            }),
        }),

        // Download media
        downloadMedia: builder.query({
            query: (mediaId) => ({
                url: getApiUrl(`media/${mediaId}/download`, 'main'),
                method: 'GET',
                responseHandler: (response) => response.blob(),
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
} = mediaApiExtended;