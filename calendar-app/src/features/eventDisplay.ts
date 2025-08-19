import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventDisplayState } from "../utils/types";
import { StoredEvent } from "../utils/types";
export const initialState: EventDisplayState = {
  isDisplayed: false,
  actualEvents: {},
};

const eventDisplaySlice = createSlice({
  name: "eventCreation",
  initialState,
  reducers: {
    triggerEventWindow(state, action: PayloadAction<boolean>) {
      state.isDisplayed = action.payload;
    },
    setEvents(state, action: PayloadAction<Record<string, StoredEvent>>) {
      state.actualEvents = action.payload;
    },
  },
});

export const { triggerEventWindow, setEvents } = eventDisplaySlice.actions;

export default eventDisplaySlice.reducer;
