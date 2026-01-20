import { api } from './api';

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectTasks: builder.query({
      query: (projectId) => `projects/${projectId}/tasks`,
      providesTags: (result) =>
        result ? [...result.map(({ _id }) => ({ type: "Task", id: _id })), { type: "Task", id: "LIST" }] : [{ type: "Task", id: "LIST" }]
    }),
    createTask: builder.mutation({
      query: ({ projectId, ...body }) => ({
        url: `projects/${projectId}/tasks`,
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }]
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Task", id: arg.id }]
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }]
    })
  })
});

export const { useGetProjectTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;
