import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null, token: null, organizations: [] };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.accessToken || action.payload.token;
      state.organizations = action.payload.organizations || state.organizations || [];
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.organizations = [];
    }
  }
});

export const { setAuth, clearAuth } = slice.actions;
export default slice.reducer;
