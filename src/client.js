import { config } from "##/src/utility/config/config";
// API handler for trackify bakend
function fetchApi(url, options = {}) {
  if (new URL(url, window.origin).origin !== config.api) {
    // Please use regular fetch for outside trackify api.
    throw new Error(`Use regular fetch to make request to '${url}'`);
  }
  if (options.body) {
    options.body =
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
  }
  options.credentials = options.credentials || "include";
  options.headers = options.headers || {};
  options.headers.Accept = options.headers.Accept || "application/json";
  options.headers["Content-Type"] =
    options.headers["Content-Type"] || "application/json";
  return fetch(url, options).then(checkStatus).then(parseJSON).catch(logError);
}
function checkStatus(response) {
  if (response.ok) {
    return response;
  } else if (response.status === 403) {
    window.location = "/logout";
  } else {
    // Other statuses are thrown intentionally, parse the response and use the message from it
    return response.json().then((parsedResponse) => {
      // If there is a message, use that to make a new AppError, otherwise just use a default message
      const error = new Error({});
      // This is to match the SerializedError interface from @reduxjs/toolkit
      // https://redux-toolkit.js.org/api/createAsyncThunk#handling-thunk-errors
      error.code = response.status.toString();
      error.message =
        typeof parsedResponse === "string"
          ? parsedResponse
          : parsedResponse.message
            ? parsedResponse.message
            : response.statusText;
      throw error;
    });
  }
}
function parseJSON(response) {
  if (response && response.headers.get("content-type")?.includes("json")) {
    return response.json();
  }
  return response;
}
function logError(error) {
  // eslint-disable-next-line no-console
  console.error(error);
  throw error;
}
const FetchApi = { fetch: fetchApi };
export default FetchApi;

// else if (response.status === 500) {
//   // 500 statuses are unintentional errors, skip their messages.
//   // Proper messaging will be handled by whoever is catching the error.
//   const error = new Error();
//   // This is to match the SerializedError interface from @reduxjs/toolkit
//   // https://redux-toolkit.js.org/api/createAsyncThunk#handling-thunk-errors
//   error.code = response.status.toString();
//   throw error;
// }
