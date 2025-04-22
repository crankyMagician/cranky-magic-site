// commoApi.js
import baseApi, { getApiUrl } from './baseApi';

export const commoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send SMS
        sendSms: builder.mutation({
            query: (smsData) => ({
                url: getApiUrl('/Commo/sms/send', 'main'),
                method: 'POST',
                body: smsData,
            }),
        }),

        // Send Email
        sendEmail: builder.mutation({
            query: (emailData) => ({
                url: getApiUrl('/Commo/email/send', 'main'),
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
} = commoApi;