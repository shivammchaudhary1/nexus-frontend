import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import FetchApi from "##/src/client.js";

export const getUser = createAsyncThunk("user/getUser", async ({ userId }) => {
  const response = await FetchApi.fetch(
    `${config.api}/api/profile/getprofile/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.user;
});

export const changePassword = createAsyncThunk(
  "user/changePassword",
  ({ userId, oldPassword, password }) => {

    return FetchApi.fetch(
      `${config.api}/api/profile/changepassword/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, oldPassword }),
      },
    );
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ userId, updatedName }) => {
    const response = await FetchApi.fetch(
      `${config.api}/api/profile/submitprofile/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: updatedName }),
      },
    );
    return response;
  },
);

export const changeTheme = createAsyncThunk(
  "user/changeTheme",
  async ({ themeId }) => {
    return FetchApi.fetch(
      `${config.api}/api/profile/changeTheme`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ themeId }),
      },
    );
  },
);

const changeWorkspaceReq = createAsyncThunk(
  "workspace/changeWorkspace",
  async ({ userId, workspaceId }) => {
    const response = await FetchApi.fetch(
      `${config.api}/api/workspace/workspace-actions/switch/${userId}/${workspaceId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  },
);

const initialState = {
  profile: null,
};

const profileSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMe(state, { payload }) {
      state.profile = payload.user;
    },
    changeUserWorkspace(state, { payload }) {
      state.profile.currentWorkspace = payload.workspace._id;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      // You can handle the changePassword response if needed.
    });

    builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
      state.profile = payload.updatedUser;
    });
    builder.addCase(changeWorkspaceReq.fulfilled, (state, { payload }) => {
      state.profile.currentWorkspace = payload.workspace._id;
    });
    builder.addCase(changeTheme.fulfilled, (state, { payload }) => {
      state.user = payload.user;
    });
  },
});

const { setMe } = profileSlice.actions;
const selectMe = (state) => state.user.profile;
const { changeUserWorkspace } = profileSlice.actions;

export { selectMe, setMe, changeUserWorkspace, changeWorkspaceReq };
export default profileSlice.reducer;
