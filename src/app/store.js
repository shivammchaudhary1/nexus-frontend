import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "##/src/app/authSlice.js";
import workspaceReducer from "##/src/app/workspaceSlice.js";
import themeReducer from "##/src/app/themeSlice.js";
import timerReducer from "##/src/app/timerSlice.js";
import alertReducer from "##/src/app/alertSlice.js";

import clientReducer from "##/src/app/clientSlice.js";
import projectSlice from "##/src/app/projectSlice.js";
import profileSlice from "##/src/app/profileSlice.js";
import teamSlice from "##/src/app/teamSlice.js";
import userDetailsSlice from "##/src/app/userDetailsSlice";
import holidaySlice from "##/src/app/holidaySlice.js";
import reportSlice from "##/src/app/reportSlice.js";
import loadingSlice from "##/src/app/loadingSlice";
import leaveSlice from "##/src/app/leaveSlice.js";
import calculationSlice from "##/src/app/calculationSlice.js";

const persistConfig = {
  key: "user",
  version: 1,
  storage,
};

// Combine all your reducers into a root reducer
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  theme: themeReducer,
  timer: timerReducer,
  workspace: workspaceReducer,
  client: clientReducer,
  project: projectSlice,
  user: profileSlice,
  team: teamSlice,
  userDetails: userDetailsSlice,
  holiday: holidaySlice,
  report: reportSlice,
  alert: alertReducer,
  loading: loadingSlice,
  leave: leaveSlice,
  calculation: calculationSlice,
});

// Create a Redux store with the root reducer and Redux Toolkit's middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  preloadedState: {},
});

const persistor = persistStore(store);

export { store, persistor };
