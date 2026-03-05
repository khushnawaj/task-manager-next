import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuth, setAuth } from '../slices/authSlice';
import toast from 'react-hot-toast';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/',
  credentials: 'omit', // We actually need 'include' for the refresh token endpoint, but we can do it per request or global.
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom base query that wraps fetchBaseQuery to handle token refreshes
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const message = result.error.data?.message || result.error.data?.error || 'An error occurred';

    // 401 Unauthorized - Token expired
    if (status === 401) {
      // Avoid refreshing token if the 401 came from the login or refresh route itself
      const requestUrl = typeof args === 'string' ? args : args.url;
      if (requestUrl !== 'auth/login' && requestUrl !== 'auth/refresh') {

        // Try to obtain a new token using the refresh token (sent automatically via cookie)
        const refreshResult = await baseQuery({ url: 'auth/refresh', method: 'POST', credentials: 'include' }, api, extraOptions);

        if (refreshResult.data) {
          // Token refreshed successfully, update Redux state
          const newAccessToken = refreshResult.data.accessToken;
          const user = refreshResult.data.user || api.getState().auth.user;
          const organizations = api.getState().auth.organizations;

          api.dispatch(setAuth({ user, token: newAccessToken, accessToken: newAccessToken, organizations }));

          // Retry the original query with the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          // Refresh failed, user is actually logged out
          api.dispatch(clearAuth());
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            toast.error('Session expired. Please login again.');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
        }
      } else if (requestUrl === 'auth/refresh') {
        api.dispatch(clearAuth());
      }
    }
    // 403 Forbidden - Insufficient permissions
    else if (status === 403) {
      toast.error('You don\'t have permission to perform this action');
    }
    // 404 Not Found
    else if (status === 404) {
      toast.error('Resource not found');
    }
    // 500 Server Error
    else if (status === 500) {
      toast.error('Server error. Please try again later.');
    }
    // Other errors
    else if (status !== 'FETCH_ERROR' && status !== 401) {
      // Don't show toast for network errors or unhandled 401s (already handled)
      toast.error(message);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['User', 'Project', 'Task', 'Organization', 'Notification', 'Dashboard'],
  endpoints: () => ({}),
});
