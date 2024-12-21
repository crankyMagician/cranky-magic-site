// baseApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import axiosServices from "../utilities/axios";

const axiosBaseQuery = () => async ({ url, method, data, params, headers }) => {
    try {
        const result = await axiosServices({
            url,
            method,
            data,
            params,
            headers,
        });

        // Log the result to see what it contains
        console.log("Axios result:", result);

        return {
            data: result.data,
            meta: {
                status: result.status,
                statusText: result.statusText,
                headers: result.headers,
            },
        };
    } catch (axiosError) {
        const err = axiosError;
        console.log("Axios error:", err);

        return {
            error: {
                status: err.response?.status,
                data: err.response?.data || err.message,
            },
        };
    }
};

const baseApi = createApi({
    // Do not keep cached data around. Configure this per endpoint if it makes sense (UI Helper Endpoints).
    keepUnusedDataFor: 0,
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),
    tagTypes: [],
    endpoints: () => ({}),
});

export default baseApi;