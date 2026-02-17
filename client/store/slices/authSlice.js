import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  organizations: [],
  initialized: false
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      const { user, accessToken, token, organizations } = action.payload;
      state.user = user;
      state.token = accessToken || token;
      state.organizations = organizations || state.organizations || [];
      state.initialized = true;

      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('forge_auth', JSON.stringify({
          user: state.user,
          token: state.token,
          organizations: state.organizations
        }));
      }
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.organizations = [];
      state.initialized = true;

      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('forge_auth');
      }
    },
    setInitialized(state) {
      state.initialized = true;
    }
  }
});

export const { setAuth, clearAuth, setInitialized } = slice.actions;
export default slice.reducer;
