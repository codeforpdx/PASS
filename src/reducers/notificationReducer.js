import { createSlice } from "@reduxjs/toolkit";

// Initialize State for all status notification
const initialState = {
  state: false,
  documentUrl: "",
  message: "",
  timeoutID: "",
};

// Generic clear/set notification functions for status notification
const clearNotification = () => {
  return initialState;
};

const setNotification = (state, action) => {
  if (state.timeoutID !== "") {
    clearTimeout(state.timeoutID);
  }
  state.state = true;
  state.documentUrl = action.payload.documentUrl;
  state.message = action.payload.message;
  state.timeoutID = action.payload.timeoutID;
};

const reducers = {
  clearNotification,
  setNotification,
};

// Function for creating notification slices for Redux Toolkit
const createNotificationSlice = ({ name, initialState, reducers }) => {
  return createSlice({
    name,
    initialState,
    reducers,
  });
};

// Creating notification slices
const uploadNotificationSlice = createNotificationSlice({
  name: "uploadNotification",
  initialState,
  reducers,
});

const fetchNotificationSlice = createNotificationSlice({
  name: "fetchNotification",
  initialState,
  reducers,
});

const deleteNotificationSlice = createNotificationSlice({
  name: "deleteNotification",
  initialState,
  reducers,
});

export const uploadNotificationActions = uploadNotificationSlice.actions;
export const fetchNotificationActions = fetchNotificationSlice.actions;
export const deleteNotificationActions = deleteNotificationSlice.actions;

export const uploadNotificationReducer = uploadNotificationSlice.reducer;
export const fetchNotificationReducer = fetchNotificationSlice.reducer;
export const deleteNotificationReducer = deleteNotificationSlice.reducer;

// Main notification handler for file status
export const runNotification = ({
  message,
  statusType,
  documentUrl = "",
  time = 1,
}) => {
  return async (dispatch) => {
    let reducerActions;
    switch (statusType) {
      case "upload":
        reducerActions = uploadNotificationActions;
        break;
      case "fetch":
        reducerActions = fetchNotificationActions;
        break;
      case "delete":
        reducerActions = deleteNotificationActions;
        break;
    }

    const { clearNotification, setNotification } = reducerActions;
    const timeoutID = setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
    const notification = {
      message,
      documentUrl,
      timeoutID,
    };
    dispatch(setNotification(notification));
  };
};
