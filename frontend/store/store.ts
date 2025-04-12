import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import loaderSlice from "./slices/loaderSlice";
import { userSlice } from "./slices/userSlice";
import { notificationSlice } from "./slices/notificationSlice";
import { apiUserData } from "@/lib/api/auth";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    loader: loaderSlice,
    user: userSlice.reducer,
    notification: notificationSlice.reducer,
  },
});

const loadUserData = async () => {
  try {
    const response = await apiUserData();
    if (response.result === "success") {
      store.dispatch(userSlice.actions.setUser(response.detail));
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

loadUserData();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
