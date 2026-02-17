import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { api } from "./services/api";

// Create store factory function for Next.js SSR compatibility
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer
    },
    middleware: (getDefault) => getDefault().concat(api.middleware)
  });
};

// Create a singleton store for client-side
let store;

if (typeof window !== 'undefined') {
  store = makeStore();
} else {
  // For SSR, create a new store
  store = makeStore();
}

export default store;
