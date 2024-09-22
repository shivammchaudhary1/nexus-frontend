import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import { calculateTime } from "##/src/utility/report.js";
import FetchApi from "##/src/client.js";

const getReport = createAsyncThunk(
  "report/getReport",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/reports/userreport?startDate=${startDate}&endDate=${endDate}`,
        {
          method: "GET",
        },
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const monthlyReport = createAsyncThunk(
  "report/monthlyReport",
  ({ month, year, workspaceId }) => {
    return FetchApi.fetch(
      `${config.api}/api/reports/monthlyreport/${workspaceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month,
          year,
          startDate: new Date(year, month - 1, 1),
          endDate: new Date(year, month, 1),
        }),
      },
    );
  },
);

export const savingMonthlyReport = createAsyncThunk(
  "report/savingMonthlyReport",
  async ({ userId, workspaceId, month, year, monthlyReportData }, thunkAPI) => {
    try {
      const response = await FetchApi.fetch(
        `${config.api}/api/reports/savingmonthlyreport/${userId}/${workspaceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ month, year, monthlyReportData }),
        },
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const initialState = {
  allReports: [],
  tempDateReports: [],
  isRequestMade: false,
  monthlyReport: [],
  userReport:[],
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    requestMade(state) {
      state.isRequestMade = false;
    },
    resetDate(state) {
      state.tempDateReports = [];
    },
    setUpdateMonthlyReportData(state, { payload }) {
      state.monthlyReport.userMonthlyHours = payload.userMonthlyHours;
    },
    setUserReport(state, { payload }) {
      state.userReport = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getReport.fulfilled, (state, { payload }) => {
      calculateTime(payload.projects); // calculating total time spent on each project
      if (state.isRequestMade) {
        state.tempDateReports = payload.projects;
        return;
      }
      state.allReports = payload.projects;
      state.isRequestMade = true;
    });
    builder.addCase(monthlyReport.fulfilled, (state, { payload }) => {
      state.monthlyReport = payload.monthlyReport;
    });
  },
});

const selectReport = (state) => state.report;
const selectMonthlyReport = (state) => state.report.monthlyReport;
const selectUserReport = (state) => state.report.userReport;
const { requestMade, resetDate, setUpdateMonthlyReportData, setUserReport } = reportSlice.actions;

export {
  getReport,
  selectReport,
  requestMade,
  resetDate,
  setUserReport,
  selectMonthlyReport,
  setUpdateMonthlyReportData,
  selectUserReport,
};
export default reportSlice.reducer;
