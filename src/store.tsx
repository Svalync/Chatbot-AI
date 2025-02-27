import { configureStore } from "@reduxjs/toolkit";
import listenerMiddleware from "./features/listenerMiddleware";

import UserReducer from '@/features/slices/userSlice';

export const store = configureStore({
  reducer: {
    user: UserReducer,
    // Add your reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(listenerMiddleware.middleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;