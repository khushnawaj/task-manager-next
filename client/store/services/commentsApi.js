import { tasksApi } from './tasksApi';

export const commentsApi = tasksApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaskComments: builder.query({
      query: (taskId) => `tasks/${taskId}/comments`,
      providesTags: (result, error, taskId) =>
        result ? [...result.map(({ _id }) => ({ type: "Comment", id: _id })), { type: "Comment", id: `LIST-${taskId}` }] : [{ type: "Comment", id: `LIST-${taskId}` }]
    }),
    createComment: builder.mutation({
      query: ({ taskId, text }) => ({
        url: `tasks/${taskId}/comments`,
        method: 'POST',
        body: { text }
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: "Comment", id: `LIST-${taskId}` }]
    })
  })
});

export const { useGetTaskCommentsQuery, useCreateCommentMutation } = commentsApi;
