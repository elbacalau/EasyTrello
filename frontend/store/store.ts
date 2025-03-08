import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import loaderSlice  from './slices/loaderSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    loader: loaderSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;