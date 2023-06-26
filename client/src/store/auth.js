import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      const u = payload != null ? payload : "";
      state.user = u;
    },
    logOut: (state, action) => {
      state.user = null;
    },
  },
  extraReducers: {},
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
