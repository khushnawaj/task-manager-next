import { api } from './api';

export const adminApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStats: builder.query({
            query: () => 'admin/stats',
        }),
        getUsers: builder.query({
            query: () => 'admin/users',
            providesTags: ['User'],
        }),
    }),
});

export const { useGetAdminStatsQuery, useGetUsersQuery } = adminApi;
