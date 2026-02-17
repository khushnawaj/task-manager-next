import { api } from './api';

export const invitationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createInvite: builder.mutation({
            query: (body) => ({
                url: 'invitations/invite',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Invitations'],
        }),
        getPendingInvites: builder.query({
            query: (orgId) => `invitations/pending?organizationId=${orgId}`,
            providesTags: ['Invitations'],
        }),
        acceptInvite: builder.mutation({
            query: (token) => ({
                url: 'invitations/accept',
                method: 'POST',
                body: { token },
            }),
            invalidatesTags: ['Organization', 'User'],
        }),
        validateInvite: builder.query({
            query: (token) => `invitations/validate/${token}`,
        }),
    }),
});

export const {
    useCreateInviteMutation,
    useGetPendingInvitesQuery,
    useAcceptInviteMutation,
    useValidateInviteQuery
} = invitationApi;
