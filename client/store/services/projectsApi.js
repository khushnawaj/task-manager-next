import { api } from './api';

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (organizationId) => `projects?organizationId=${organizationId}`,
      providesTags: (result) =>
        result ? [...result.map(({ _id }) => ({ type: "Project", id: _id })), { type: "Project", id: "LIST" }] : [{ type: "Project", id: "LIST" }]
    }),
    createProject: builder.mutation({
      query: (body) => ({
        url: 'projects',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }]
    }),
  }),
});

export const { useGetProjectsQuery, useCreateProjectMutation } = projectsApi;
