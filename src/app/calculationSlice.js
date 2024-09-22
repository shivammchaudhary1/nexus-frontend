import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import FetchApi from "##/src/client.js";

const initialState = {
  rules: [],
};

export const getCalculationRule = createAsyncThunk(
  "calculation/getCalculationRule",
  ({ workspaceId }) => {
    return FetchApi.fetch(
      `${config.api}/api/rule/get/${workspaceId}`,
      {
        method: "GET",
      },
    );
  },
);

export const updateCalculationRule = createAsyncThunk(
  "calculation/updateCalculationRule",
  async (
    { workingHours, workingDays, weekDays, isActive, ruleId }
  ) => {
    return FetchApi.fetch(`${config.api}/api/rule/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workingHours,
        workingDays,
        weekDays,
        isActive,
        ruleId,
      }),
    });

  },
);

const calculationSlice = createSlice({
  name: "calculation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCalculationRule.fulfilled, (state, action) => {
      state.rules = action.payload.rule;
    });
    builder.addCase(updateCalculationRule.fulfilled, (state, action) => {
      state.rules = [action.payload.updatedRule];
    });
  },
});

export default calculationSlice.reducer;
export const selectCalculationRules = (state) => state.calculation.rules;
