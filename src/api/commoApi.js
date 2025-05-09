// commoApi.js
import { commoApi } from './baseApi';

export const commoApiExtended = commoApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send SMS
        sendSms: builder.mutation({
            query: (smsData) => ({
                url: '/sms/send',
                method: 'POST',
                body: smsData,
            }),
        }),

        // Send Email
        sendEmail: builder.mutation({
            query: (emailData) => ({
                url: '/email/send',
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