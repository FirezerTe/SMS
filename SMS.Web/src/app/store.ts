import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { notificationReducer } from "../features";
import { SMSApi } from "./api";
import { rtkQueryErrorHandler } from "./api/emptySplitApi";
import "./api/enhanceEndpoints";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    [SMSApi.reducerPath]: SMSApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([
      SMSApi.middleware,
      rtkQueryErrorHandler,
    ]);
  },
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export * from "./api";
