import { api } from './api';
import toast from 'react-hot-toast';

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectTasks: builder.query({
      query: (arg) => {
        const { projectId, page = 1, limit = 50 } = typeof arg === 'object' ? arg : { projectId: arg };
        return `projects/${projectId}/tasks?page=${page}&limit=${limit}`;
      },
      providesTags: (result) => {
        const tasks = result?.tasks || [];
        return [...tasks.map(({ _id }) => ({ type: "Task", id: _id })), { type: "Task", id: "LIST" }];
      }
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
        const patchResults = [];

        // 1. Update Project Tasks Cache (which is an object with { tasks, meta })
        if (patch.projectId) {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData('getProjectTasks', patch.projectId, (draft) => {
                const taskList = draft?.tasks || [];
                const task = taskList.find(t => t._id === id);
                if (task) {
                  Object.assign(task, patch);
                }
              })
            )
          );
        }

        // 2. Update 'My Tasks' Cache (which is an array)
        patchResults.push(dispatch(
          tasksApi.util.updateQueryData('getMyTasks', undefined, (draft) => {
            // draft is an array here
            const task = (draft || []).find(t => t._id === id);
            if (task) {
              Object.assign(task, patch);

              // If status changed to done, maybe we want to keep it or remove it from 'assigned/me'
              // For now, we just update it so the UI responds instantly.
            }
          })
        ));

        try {
          await queryFulfilled;
          // Only show toast for significant updates
          if (patch.status === 'done') {
            toast.success('Task completed! 🎉', { id: 'task-complete' });
          }
        } catch {
          patchResults.forEach(patchResult => patchResult.undo());
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
