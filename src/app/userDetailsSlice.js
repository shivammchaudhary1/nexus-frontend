import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import FetchApi from "##/src/client.js";
import { themes } from "##/src/utility/themes.js";

//Admin Route: Fetch all the user who belongs to current workspace
const getWorkspaceUsers = createAsyncThunk(
  "userDetails/getUserDetails",
  () => {
    return FetchApi.fetch(
      `${config.api}/api/user/users/all`,
      {
        method: "GET",
      },
    );
  },
);

// Admin Route: Invite user in current workspace
const inviteUser = createAsyncThunk(
  "userDetails/inviteUser",
  ({ email, workspaceId }) => {
    return FetchApi.fetch(`${config.api}/api/user/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, workspaceId, themeId:themes[0].themeId }),
    }); 
  },
);

// Admin Route: Remove user from workspace
export const removeUser = createAsyncThunk(
  "userDetails/removeUser",
  async ({ userId, workspaceId }) => {
    await FetchApi.fetch(
      `${config.api}/api/user/deleteuserfromworkspace/${workspaceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      },
    );
    return { userId };
  },
);

export const checkEmail = createAsyncThunk(
  "user/emailExist",
  (payload) => {
    return FetchApi.fetch(
      `${config.api}/api/user/isExist/${payload.email}`,
    );
  },
);

// Send a mail to user for Forgot Password
export const forgotPass = createAsyncThunk(
  "user/forgotPass",
  (payload) => {
    return FetchApi.fetch(`${config.api}/api/profile/forgetpassword`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: payload.email }),
    });
  },
);

// Create a new password for user
export const createPass = createAsyncThunk(
  "user/createPass",
  ({ token, userId, password, confirmPassword }) => {
    return FetchApi.fetch(
      `${config.api}/api/profile/forgetpassword/${userId}/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, confirmPassword }),
      },
    );
  },
);

const initialState = {
  userDetails: [],
  emailExist: true,
  mailSent: false,
  passChangeMessage: "",
  passChanged: false,
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUsers:(state,{payload})=>{
      state.userDetails = payload.users;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getWorkspaceUsers.fulfilled, (state, {payload}) => {
      state.userDetails = payload.users;
    });
    builder.addCase(removeUser.fulfilled, (state, { payload }) => {
      state.userDetails = state.userDetails.filter(
        (user) => user.user._id !== payload.userId,
      );
    });
  },
});

export default userDetailsSlice.reducer;

const {setUsers} = userDetailsSlice.actions;
const selectUserDetails = (state) => state.userDetails.userDetails;

export { getWorkspaceUsers, inviteUser, setUsers, selectUserDetails};