import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import loaderSlice from "./slices/loaderSlice";
import { userSlice } from "./slices/userSlice";
import { notificationSlice } from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    loader: loaderSlice,
    user: userSlice.reducer,
    notification: notificationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
