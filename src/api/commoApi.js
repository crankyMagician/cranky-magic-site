// commoApi.js
import baseApi from './baseApi';

const isDevelopment = process.env.NODE_ENV === 'development';

export const commoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Send SMS
        sendSms: builder.mutation({
            query: (smsData) => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/Commo/sms/send'
                    : `${process.env.REACT_APP_MAIN_API_URL}/Commo/sms/send`,
                method: 'POST',
                body: smsData,
            }),
        }),

        // Send Email
        sendEmail: builder.mutation({
            query: (emailData) => ({
                url: isDevelopment
                    ? '/https://dev.net-api.spatialmods.com/api/Commo/email/send'
                    : `${process.env.REACT_APP_MAIN_API_URL}/Commo/email/send`,
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
