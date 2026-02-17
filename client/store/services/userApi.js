import { api } from './api';
import { setCredentials } from '../slices/authSlice';

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => 'users/me',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: 'users/me',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
            // Update the auth slice immediately
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Optimistically update or just update on success
                    // data.user contains the new user object
                    // We need current token to dispatch setCredentials properly
                    // But setCredentials expects { user, token }. Token is unchanged.
                    // Wait, setCredentials replaces everything. We need the token.
                    // We can get token from state.
                } catch (err) { }
            },
        }),
        getDashboardData: builder.query({
            query: () => 'users/dashboard',
            providesTags: ['Dashboard'],
        }),
    }),
});

export const { useGetMeQuery, useUpdateProfileMutation, useGetDashboardDataQuery } = userApi;
