import { api } from './api';

export const analyticsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getHeatmap: builder.query({
            query: () => 'analytics/heatmap',
            providesTags: ['Task'],
        }),
        getVelocity: builder.query({
            query: (projectId) => `analytics/velocity/${projectId}`,
            providesTags: ['Task'],
        }),
        getBurndown: builder.query({
            query: (projectId) => `analytics/burndown/${projectId}`,
            providesTags: ['Task'],
        }),
    }),
});

export const {
    useGetHeatmapQuery,
    useGetVelocityQuery,
    useGetBurndownQuery
} = analyticsApi;
