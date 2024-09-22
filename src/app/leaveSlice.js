import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import FetchApi from "##/src/client.js";

const initialState = {
  leaveData: [], //all leaves data
  userLeaveData: [],
  userLeaveBalance: [],
};

// All leave data presnet in database
export const getLeaveDetails = createAsyncThunk(
  "leave/getLeaveDetails",
  async ({ userId }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/leave/getallleaves/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // const data = await response.json();
      return response.leaves;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateStatusOfLeave = createAsyncThunk(
  "leave/updateStatusOfLeave",
  async (
    { leaveId, status, rejectionReason, workspaceId },
    thunkAPI,
  ) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/leave/updatestatus`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({
            leaveId,
            status,
            rejectionReason,
            workspaceId,
          }),
        },
      );

      return response.leaveDetails;
    } catch (error) {
      thunkAPI.rejectWithValue(error.message);
    }
  },
);

// getting user's all leave Data
export const getUsersLeave = createAsyncThunk(
  "leave/getUsersLeave",
  async ({ userId }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/leave/getleaves/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            
          },
        },
      );
      // const data = await response.json();
      // console.log("leaveResponse", response);
      return response.userLeaveData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const getUsersLeaveBalance = createAsyncThunk(
  "leave/getUsersLeaveBalance",
  async ({ userId, workspaceId }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/leave/getuserleavebalance/${userId}/${workspaceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            
          },
        },
      );
      // const data = await response.json();
      return response.leaveBalance;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const applyLeave = createAsyncThunk(
  "leave/applyLeave",
  async (
    {
      title,
      type,
      startDate,
      endDate,
      userId,
      dailyDetails,
      numberOfDays,
      description,
    },
    thunkAPI,
  ) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/leave/createleave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({
            title,
            type,
            startDate,
            endDate,
            userId,
            dailyDetails,
            numberOfDays,
            description,
          }),
        },
      );
      // console.log("response", response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteLeaveRequest = createAsyncThunk(
  "leave/deleteLeaveRequest",
  async ({ userId, leaveId }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/leave/deleteleave`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            
          },
          body: JSON.stringify({
            userId,
            leaveId,
          }),
        },
      );
      return { leaveId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLeaveDetails.fulfilled, (state, action) => {
      state.leaveData = action.payload;
    });
    builder.addCase(updateStatusOfLeave.fulfilled, (state, action) => {
      state.leaveData = state.leaveData.map((leave) => {
        if (leave._id === action.payload._id) {
          return action.payload;
        } else {
          return leave;
        }
      });
    });
    builder.addCase(getUsersLeave.fulfilled, (state, action) => {
      state.userLeaveData = action.payload;
    });
    builder.addCase(getUsersLeaveBalance.fulfilled, (state, action) => {
      state.userLeaveBalance = action.payload;
    });
    builder.addCase(applyLeave.fulfilled, (state, action) => {
      // console.log("payload", action.payload);
    });
    builder.addCase(deleteLeaveRequest.fulfilled, (state, action) => {
      state.userLeaveData = state.userLeaveData.filter(
        (leave) => leave._id !== action.payload.leaveId,
      );
    });
  },
});

export default leaveSlice.reducer;
export const selectLeaveData = (state) => state.leave.leaveData;
export const selectUserLeaveData = (state) => state.leave.userLeaveData;
export const selectUserLeaveBalance = (state) => state.leave.userLeaveBalance;
