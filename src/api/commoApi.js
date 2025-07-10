// commoApi.js
import baseApi, { getApiUrl, commoApi } from './baseApi';

export const commoApiExtended = commoApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send SMS
        sendSms: builder.mutation({
            query: (smsData) => ({
                url: getApiUrl('api/Commo/sms/send', 'main'),
                method: 'POST',
                body: smsData,
            }),
        }),

        // Send Email
        sendEmail: builder.mutation({
            query: (emailData) => ({
                url: getApiUrl('api/Commo/email/send', 'main'),
                method: 'POST',
                body: emailData,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useSendSmsMutation,
    useSendEmailMutation,
} = commoApiExtended;