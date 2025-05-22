import { AlertColor } from "@mui/material";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface NotificationsState {
  notifications: {
    id: string;
    type?: AlertColor;
    message?: string;
    timeout?: number | null;
    shown?: boolean;
  }[];
}

export const initialState: NotificationsState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
        type?: AlertColor;
        message?: string;
        timeout?: number | null;
      }>
    ) => {
      state.notifications.push({
        id: Math.random().toString(36).substring(2, 8),
        shown: false,
        timeout: 5000,
        ...action.payload,
      });
    },
    removeNotifications: (state, action: PayloadAction<{ ids: string[] }>) => {
      state.notifications = state.notifications.filter(
        (x) => !action.payload.ids.some((id) => id === x.id)
      );
    },
  },
});

export const { addNotification, removeNotifications } =
  notificationSlice.actions;
export const selectNotification = (state: RootState) => state.notification;
export const notificationReducer = notificationSlice.reducer;
