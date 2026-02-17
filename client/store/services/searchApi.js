import { api } from "./api";

export const searchApi = api.injectEndpoints({
    endpoints: (builder) => ({
        search: builder.query({
            query: (q) => `search?q=${q}`,
            providesTags: ["Project", "Task"],
        }),
    }),
});

export const { useSearchQuery } = searchApi;
