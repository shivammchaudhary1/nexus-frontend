import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import { calculateTotalTime, formatTime } from "##/src/utility/timer.js";
import FetchApi from "##/src/client.js";

const getTimer = createAsyncThunk("timer/getTimer", () => {
  return FetchApi.fetch(`${config.api}/api/timer/timer-actions/isRunning`, {
    method: "GET",
  });
});

const startTimer = createAsyncThunk(
  "timer/startTimer",
  ({ projectId, title, userId }) => {
    return FetchApi.fetch(`${config.api}/api/timer/timer-actions/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId, title, userId }),
    });
  },
);

const stopTimer = createAsyncThunk(
  "timer/stopTimer",
  ({ projectId, title }) => {
    return FetchApi.fetch(`${config.api}/api/timer/timer-actions/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId, title }),
    });
  },
);

const resumeTimer = createAsyncThunk("timer/resumeTimer", ({ entryId }) => {
  return FetchApi.fetch(`${config.api}/api/timer/timer-actions/resume`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ entryId }),
  });
});

const deleteEntry = createAsyncThunk(
  "timer/deleteEntry",
  async ({ entryId }) => {
    return FetchApi.fetch(
      `${config.api}/api/user/entry/delete?entryId=${entryId}`,
      {
        method: "DELETE",
      },
    );
  },
);

const updateEntry = createAsyncThunk("timer/updateEntry", async ({ entry }) => {
  return FetchApi.fetch(`${config.api}/api/user/entry/edit`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ entry }),
  });
});

const updateEntryTitle = createAsyncThunk(
  "timer/updateEntryTitle",
  ({ entry }) => {
    return FetchApi.fetch(`${config.api}/api/user/entry/title`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entry }),
    });
  },
);

const addManualEntry = createAsyncThunk(
  "timer/addManualEntry",
  ({ newEntry }) => {
    return FetchApi.fetch(
      `${config.api}/api/timer/timer-actions/manualEntry/${newEntry.userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEntry }),
      },
    );
  },
);

export const getMoreEntries = createAsyncThunk(
  "timer/getMoreEntries",
  ({ lastEntry }) => {
    return FetchApi.fetch(
      `${config.api}/api/timer/entries/get-entries/${lastEntry}`,
      {
        method: "GET",
      },
    );
  },
);

const initialState = {
  startTime: { hours: 0, minutes: 0, seconds: 0 },
  option: "null",
  text: "",
  entries: [],
  lastEntryDate: "",
  timer: null,
  entryDay: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    inputTextChange(state, { payload }) {
      state.text = payload.text;
    },
    optionHandle(state, { payload }) {
      state.option = payload.option;
    },
    setEntries(state, { payload }) {
      state.entries = payload.entries;
      state.lastEntryDate = payload.lastEntryDate;
    },
    setEntryDay(state, { payload }) {
      state.entryDay = payload.day;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTimer.fulfilled, (state, { payload }) => {
        state.timer = payload;
        if (state.timer?.isRunning) {
          const timeCalculation = calculateTotalTime(payload);
          state.startTime = {
            hours: timeCalculation.hours,
            minutes: timeCalculation.minutes,
            seconds: timeCalculation.seconds,
          };
          state.text = payload.currentLog?.title;
          state.option = payload.currentLog?.project;
        }
      })
      .addCase(stopTimer.fulfilled, (state, { payload }) => {
        state.option = null;
        state.text = "";
        state.startTime = { hours: 0, minutes: 0, seconds: 0 };
        state.timer = payload.updatedTimer;
        const updatedEntry = state.entries.find((entry) => {
          return entry._id === payload.updatedEntry._id;
        });
        if (updatedEntry) {
          state.entries = state.entries.map((entry) => {
            if (entry._id === updatedEntry._id) {
              return payload.updatedEntry;
            } else {
              return entry;
            }
          });
        } else {
          state.entries = [...state.entries, payload.updatedEntry];
        }
      })
      .addCase(startTimer.fulfilled, (state, { payload }) => {
        state.timer = payload.timer;
        const timeCalculation = calculateTotalTime(payload.timer);
        state.startTime = {
          hours: timeCalculation.hours,
          minutes: timeCalculation.minutes,
          seconds: timeCalculation.seconds,
        };
        state.text = payload.timer.currentLog.title;
        state.option = payload.timer.currentLog.project;
      })
      .addCase(deleteEntry.fulfilled, (state, { payload }) => {
        state.entries = state.entries.filter((entry) => {
          return entry._id != payload.deletedEntry._id;
        });
      })
      .addCase(resumeTimer.fulfilled, (state, { payload }) => {
        state.option = payload.updatedEntry.project._id;
        state.text = payload.updatedEntry.title;
        state.startTime = formatTime(payload.updatedEntry.durationInSeconds);
        state.timer.isRunning = true;
        state.timer.currentLog = payload.updatedEntry._id;
        const entries = state.entries;
        for (let i = 0; i < entries.length; i++) {
          if (entries[i]._id === payload.updatedEntry._id) {
            entries[i] = payload.updatedEntry;
            return;
          }
        }
      })
      .addCase(updateEntry.fulfilled, (state, { payload }) => {
        state.entries = state.entries.map((entry) => {
          if (entry._id === payload.updatedEntry._id) {
            return payload.updatedEntry;
          }
          return entry;
        });
      })
      .addCase(updateEntryTitle.fulfilled, (state, { payload }) => {
        state.entries = state.entries.map((entry) => {
          if (entry._id === payload.updatedEntry._id) {
            return payload.updatedEntry;
          }
          return entry;
        });
      })
      .addCase(addManualEntry.fulfilled, (state, { payload }) => {
        state.entries.push(payload.entry);
      })
      .addCase(getMoreEntries.fulfilled, (state, { payload }) => {
        state.entries = state.entries.length
          ? [...state.entries, ...payload.entries]
          : payload.entries;
        state.lastEntryDate = payload.lastFetchedDate;
      });
  },
});

const selectTimer = (state) => state.timer;
const selectEntries = (state) => state.timer.entries;
const selectLastEntry = (state) => state.timer.lastEntryDate;
const selectEntryDay = (state) => state.timer.entryDay;
const { inputTextChange, optionHandle, setEntries, setEntryDay } =
  timerSlice.actions;

export {
  getTimer,
  startTimer,
  stopTimer,
  resumeTimer,
  selectTimer,
  setEntries,
  selectEntries,
  selectLastEntry,
  deleteEntry,
  updateEntry,
  updateEntryTitle,
  inputTextChange,
  optionHandle,
  addManualEntry,
  setEntryDay,
  selectEntryDay,
};

export default timerSlice.reducer;
