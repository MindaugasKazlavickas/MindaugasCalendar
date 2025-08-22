import { configureStore } from "@reduxjs/toolkit";
import currentDateReducer from "./features/currentDate";
import eventDisplayReducer from "./features/eventDisplay";
export const store = configureStore({
  reducer: {
    currentDate: currentDateReducer,
    actualEvents: eventDisplayReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
