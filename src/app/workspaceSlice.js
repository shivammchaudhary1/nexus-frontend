import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import FetchApi from "##/src/client.js";
import { themes } from "##/src/utility/themes.js";

//Admin Route: Enable or Disable Timer edit option
const editTimer = createAsyncThunk(
  "workspace/editTimer",
  ({ workspace, isEditable }) => {
    return FetchApi.fetch(
      `${config.api}/api/workspace/edittimer?workspace=${workspace}&isEditable=${isEditable}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":"application/json",
        },
      },
    );
  },
);

// Admin Route: Create new workspace
const createWorkspace = createAsyncThunk(
  "workspace/createWorkspace",
  ({ userId, name }) => {
    return FetchApi.fetch(`${config.api}/api/workspace/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, name, themeId:themes[0].themeId }),
    });

  },
);

// Admin Route: Update workspace name
const updateWorkspace = createAsyncThunk(
  "workspace/updateWorkspace",
  ({ workspaceId, name }) => {
    return FetchApi.fetch(`${config.api}/api/workspace/workspace-actions/update/${workspaceId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
  },
);

// Admin Route: Change user's role
const changeUserRole = createAsyncThunk(
  "userDetails/changeUserRole",
  ({ userId, isAdmin }) => {
    return FetchApi.fetch(
      `${config.api}/api/user/user-actions/change-role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role:isAdmin }),
      },
    );
  },
);

const initialState = {
  workspaces: [],
  selectedWorkspace: null,
  isWorkspaceAdmin: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    changeWorkspace(state, { payload }) {
      state.selectedWorkspace = payload.workspace;
      state.isWorkspaceAdmin = payload.isWorkspaceAdmin;
    },
    setWorkspaces(state, { payload }) {
      state.workspaces = payload.workspaces;
    },
    setUpdateUserRole(state, {payload}){
      // Update the users array directly
      state.workspaces = state.workspaces.map((workspace)=>{
        if(workspace._id===payload.workspaceId){
          workspace.users = state.selectedWorkspace.users.map((user)=>{
            if(user.user===payload.userId){
              return {user:payload.userId, isAdmin:payload.updatedRole};
            } else {
              return user;
            }
          });
          return workspace;
        } else {
          return workspace;
        }
      });
      // No need to return anything
    }    
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWorkspace.fulfilled, (state, { payload }) => {
        state.workspaces.push(payload);
      })
      .addCase(editTimer.fulfilled, (state, { payload }) => {
        state.selectedWorkspace = payload.updatedWorkspace;
        state.workspaces.forEach((workspace) => {
          if (workspace._id === payload.updatedWorkspace._id) {
            workspace.isEditable = payload.updatedWorkspace.isEditable;
            return;
          }
        });
      })
      .addCase(updateWorkspace.fulfilled, (state, { payload }) => {
        state.workspaces = state.workspaces.map((workspace) => {
          if (workspace._id === payload.updatedWorkspace._id) {
            return payload.updatedWorkspace;
          } else {
            return workspace;
          }
        });
      })
      .addCase(changeUserRole.fulfilled, (state, { payload }) => {
        state.workspaces = state.workspaces.map((workspace)=>{
          if(workspace._id === payload.workspace._id){
            return payload.workspace;
          } else {
            return workspace;
          }
        });
      });
  },
});

const { changeWorkspace, setWorkspaces, setUpdateUserRole } = workspaceSlice.actions;
const selectWorkspace = (state) => state.workspace;
const selectCurrentTheme = (state) => state.workspace.selectWorkspace?.theme;
const selectUserRole = (state) => state.workspace.isWorkspaceAdmin;

export {
  changeUserRole,
  createWorkspace,
  changeWorkspace,
  editTimer,
  updateWorkspace,
  setWorkspaces,
  setUpdateUserRole,
  selectCurrentTheme,
  selectUserRole,
  selectWorkspace,
};

export default workspaceSlice.reducer;
