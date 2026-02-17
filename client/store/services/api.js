import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuth } from '../slices/authSlice';
import toast from 'react-hot-toast';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom base query with error handling
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle errors
  if (result.error) {
    const status = result.error.status;
    const message = result.error.data?.message || result.error.data?.error || 'An error occurred';

    // 401 Unauthorized - Token expired or invalid
    if (status === 401) {
      // Clear auth state
      api.dispatch(clearAuth());

      // Redirect to login (only if not already on login page)
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        toast.error('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
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
    else if (status !== 'FETCH_ERROR') {
      // Don't show toast for network errors (user might be offline)
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
