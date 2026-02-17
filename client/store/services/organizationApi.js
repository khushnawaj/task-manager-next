import { api } from './api';

export const organizationApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOrganization: builder.query({
            query: (id) => `organizations/${id}`,
            providesTags: ['Organization'],
        }),
        updateMemberRole: builder.mutation({
            query: ({ organizationId, userId, role }) => ({
                url: `organizations/${organizationId}/members/role`,
                method: 'PUT',
                body: { userId, role },
            }),
            invalidatesTags: ['Organization'],
        }),
        removeMember: builder.mutation({
            query: ({ organizationId, userId }) => ({
                url: `organizations/${organizationId}/members`,
                method: 'DELETE',
                body: { userId },
            }),
            invalidatesTags: ['Organization'],
        }),
    }),
});

export const { useGetOrganizationQuery, useUpdateMemberRoleMutation, useRemoveMemberMutation } = organizationApi;
