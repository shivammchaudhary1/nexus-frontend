import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { config } from "##/src/utility/config/config.js";
import FetchApi from "##/src/client.js";

// Admin Rote: Fetch all the clients for workspace
const fetchClientsforSelectedWorkspace = createAsyncThunk(
  "client/fetchWorkspaceClients",
  () => {
    return FetchApi.fetch(`${config.api}/api/client/get-all`, {
      method: "GET",
    });
  },
);

// Admin Rote: Add new client
const addClient = createAsyncThunk(
  "client/addClient",
  ({ clientName, userId, workspaceId }) => {
    return FetchApi.fetch(`${config.api}/api/client/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientName, userId, workspaceId }),
    });
  },
);

// Admin Rote: Delete existing client
const deleteClient = createAsyncThunk("client/deleteClient", ({ id }) => {
  return FetchApi.fetch(`${config.api}/api/client/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
});

// Admin Rote: update client
const updateClient = createAsyncThunk(
  "client/updateClient",
  ({ id, clientName }) => {
    return FetchApi.fetch(`${config.api}/api/client/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: clientName }),
    });
  },
);

const initialState = {
  clients: [],
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClients: (state, { payload }) => {
      state.clients = payload.clients;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchClientsforSelectedWorkspace.fulfilled,
        (state, { payload }) => {
          state.clients = payload.clients;
        },
      )
      .addCase(addClient.fulfilled, (state, action) => {
        state.clients.push(action.payload.client);
      })
      .addCase(updateClient.fulfilled, (state, { payload }) => {
        state.clients = state.clients.map((client) =>
          client._id === payload.client._id ? payload.client : client,
        );
      })
      .addCase(deleteClient.fulfilled, (state, { payload }) => {
        state.clients = state.clients.filter(
          (client) => client._id !== payload.clientId,
        );
      });
  },
});

export default clientSlice.reducer;

const { setClients } = clientSlice.actions;
const selectClients = (state) => state.client.clients;
export {
  fetchClientsforSelectedWorkspace,
  selectClients,
  addClient,
  deleteClient,
  updateClient,
  setClients,
};
