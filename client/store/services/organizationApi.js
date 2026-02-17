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
        getMyOrganizations: builder.query({
            query: () => 'organizations',
            providesTags: (result) =>
                result ? [...result.map(({ _id }) => ({ type: "Organization", id: _id })), { type: "Organization", id: "LIST" }] : [{ type: "Organization", id: "LIST" }]
        }),
    }),
});

export const { useGetOrganizationQuery, useUpdateMemberRoleMutation, useRemoveMemberMutation, useGetMyOrganizationsQuery } = organizationApi;
