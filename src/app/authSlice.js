// authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import FetchApi from "##/src/client.js";

const logout = createAsyncThunk(
  "auth/logout",
  async (credentials) => {
    return FetchApi.fetch(`${config.api}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
  },
);

// Define a slice of state for authentication
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setIsAuthenticated(state, { payload }) {
      state.isAuthenticated = payload.isAuthenticated;
    },
  },
  extraReducers(builder) {
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
    });
  },
});

const selectAuthenticated = (state) => state.auth.isAuthenticated;
const selectAuthData = (state) => state.auth;
// Export the slice reducer and the logout action creator
const { setIsAuthenticated } = authSlice.actions;
export { selectAuthenticated, selectAuthData, logout, setIsAuthenticated };
export default authSlice.reducer;
