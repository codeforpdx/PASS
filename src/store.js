import { configureStore } from "@reduxjs/toolkit";
import {
  uploadNotificationReducer,
  fetchNotificationReducer,
  deleteNotificationReducer,
} from "./reducers/notificationReducer";

const store = configureStore({
  reducer: {
    uploadNotification: uploadNotificationReducer,
    fetchNotification: fetchNotificationReducer,
    deleteNotification: deleteNotificationReducer,
  },
});

export default store;
