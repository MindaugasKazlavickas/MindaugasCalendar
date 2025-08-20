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
    setEvents(state, action: PayloadAction<Record<string, StoredEvent>>) {
      state.actualEvents = action.payload;
    },
    addEvent(state, action: PayloadAction<StoredEvent>) {
      state.actualEvents[action.payload.id] = action.payload;
    },
    updateEvent(state, action: PayloadAction<StoredEvent>) {
      const id = action.payload.eventKey;
      if (state.actualEvents[id]) {
        state.actualEvents[id] = action.payload;
      } else {
        console.log("Event with id: " + id + " not found");
      }
    },
    removeEvent(state, action: PayloadAction<number>) {
      delete state.actualEvents[action.payload];
    },
  },
});

export const { setEvents, addEvent, updateEvent, removeEvent } =
  eventDisplaySlice.actions;

export default eventDisplaySlice.reducer;
