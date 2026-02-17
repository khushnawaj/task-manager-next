import { api } from './api';

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (arg) => {
        const { organizationId, page = 1, limit = 20 } = typeof arg === 'object' ? arg : { organizationId: arg };
        return `projects?organizationId=${organizationId}&page=${page}&limit=${limit}`;
      },
      providesTags: (result) => {
        const projects = result?.projects || [];
        return [...projects.map(({ _id }) => ({ type: "Project", id: _id })), { type: "Project", id: "LIST" }];
      }
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
