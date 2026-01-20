import { api } from './api';

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    generateTasks: builder.mutation({
      query: (body) => ({
        url: 'ai/generate-tasks',
        method: 'POST',
        body
      })
    }),
    summarizeText: builder.mutation({
      query: (body) => ({
        url: 'ai/summarize',
        method: 'POST',
        body
      })
    })
  }),
});

export const { useGenerateTasksMutation, useSummarizeTextMutation } = aiApi;
