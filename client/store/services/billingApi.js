import { api } from './api';

export const billingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionStatus: builder.query({
      query: (organizationId) => `billing/status?organizationId=${organizationId}`,
      providesTags: ['Billing']
    }),
    createCheckoutSession: builder.mutation({
      query: (body) => ({
        url: 'billing/checkout',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Billing', 'Organization']
    })
  })
});

export const { useGetSubscriptionStatusQuery, useCreateCheckoutSessionMutation } = billingApi;
