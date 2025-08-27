import { configureStore } from "@reduxjs/toolkit";
import currentDateReducer from "./reduxDateManagement";

export const store = configureStore({
  reducer: {
    currentDate: currentDateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
