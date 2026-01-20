import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { api } from "./services/api";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefault) => getDefault().concat(api.middleware)
});

export default store;
