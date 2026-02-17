import { api } from './api';
import toast from 'react-hot-toast';

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
      invalidatesTags: [{ type: "Task", id: "LIST" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Task created successfully');
        } catch {
          // Error already handled by base query
        }
      }
    }),
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `tasks/${id}`,
        method: "PUT",
        body
      }),
      // Optimistic Update
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        // Update the task in the project tasks cache
        const patchResults = [];

        // Find all project task queries and update them
        dispatch(
          tasksApi.util.updateQueryData('getProjectTasks', patch.projectId || undefined, (draft) => {
            const task = draft.find(t => t._id === id);
            if (task) {
              Object.assign(task, patch);
            }
          })
        );

        try {
          await queryFulfilled;
          // Only show toast for significant updates (not every drag-drop)
          if (patch.status === 'done') {
            toast.success('Task completed! 🎉');
          }
        } catch {
          // Revert on error (handled by RTK Query automatically)
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: "Task", id: arg.id }]
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success('Task archived');
        } catch {
          // Error already handled by base query
        }
      }
    }),
    getTaskComments: builder.query({
      query: (taskId) => `tasks/${taskId}/comments`,
      providesTags: (result) => [{ type: "Comment", id: "LIST" }]
    }),
    addComment: builder.mutation({
      query: ({ taskId, text }) => ({
        url: `tasks/${taskId}/comments`,
        method: "POST",
        body: { text }
      }),
      invalidatesTags: [{ type: "Comment", id: "LIST" }]
    }),
    getMyTasks: builder.query({
      query: () => `tasks/assigned/me`,
      providesTags: (result) =>
        result ? [...result.map(({ _id }) => ({ type: "Task", id: _id })), { type: "Task", id: "MY_LIST" }] : [{ type: "Task", id: "MY_LIST" }]
    }),
    getTaskAuditLog: builder.query({
      query: (taskId) => `tasks/${taskId}/audit-log`
    })
  })
});

export const {
  useGetProjectTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation,
  useGetTaskCommentsQuery, useAddCommentMutation,
  useGetMyTasksQuery, useGetTaskAuditLogQuery
} = tasksApi;
