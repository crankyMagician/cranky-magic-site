// mediaApi.js
import { mediaApi } from './baseApi';

export const mediaApiExtended = mediaApi.injectEndpoints({
    endpoints: (builder) => ({
        // Upload media
        uploadMedia: builder.mutation({
            query: (formData) => ({
                url: '/upload',
                method: 'POST',
                body: formData,
                formData: true, // Important for file uploads
            }),
            invalidatesTags: ['Media'],
        }),

        // Update business logo
        updateBusinessLogo: builder.mutation({
            query: (logoData) => ({
                url: '/business/logo',
                method: 'PUT',
                body: logoData,
            }),
            invalidatesTags: ['Media', 'Business'],
        }),

        // Get media by ID
        getMediaById: builder.query({
            query: (mediaId) => ({
                url: `/${mediaId}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Media', id }],
        }),

        // Delete media by ID
        deleteMedia: builder.mutation({
            query: (mediaId) => ({
                url: `/${mediaId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Media'],
        }),

        // Get media for a business
        getBusinessMedia: builder.query({
            query: ({ businessId, mediaTypeId, page, pageSize }) => ({
                url: `/business/${businessId}`,
                method: 'GET',
                params: { mediaTypeId, page, pageSize },
            }),
            providesTags: ['Media'],
        }),

        // Get media types
        getMediaTypes: builder.query({
            query: () => ({
                url: '/types',
                method: 'GET',
            }),
        }),

        // Download media
        downloadMedia: builder.query({
            query: (mediaId) => ({
                url: `/${mediaId}/download`,
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