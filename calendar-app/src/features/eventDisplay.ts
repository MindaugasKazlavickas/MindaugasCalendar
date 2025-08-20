import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventDisplayState } from "../utils/types";
import { StoredEvent } from "../utils/types";
import { getWeekKey } from "../pages/calendar/MainContent/TimeframeToday";
export const initialState: EventDisplayState = {
  isDisplayed: false,
  actualEvents: {},
};

const saveToSessionStorage = (state: EventDisplayState, weekKey: string) => {
  sessionStorage.setItem(weekKey, JSON.stringify(state.actualEvents));
};

const eventDisplaySlice = createSlice({
  name: "eventCreation",
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<Record<string, StoredEvent>>) {
      state.actualEvents = action.payload;
    },
    addEvent(state, action: PayloadAction<StoredEvent>) {
      state.actualEvents[action.payload.eventKey] = action.payload;
      const eventDate: Date = new Date(action.payload.startDate.toString());
      //saveToSessionStorage(state, getWeekKey(eventDate));
    },
    updateEvent(state, action: PayloadAction<StoredEvent>) {
      const eventKey = action.payload.eventKey;
      const id = Object.keys(state.actualEvents).find(
        (key) => state.actualEvents[key].eventKey === eventKey
      );
      if (id) {
        state.actualEvents[id] = action.payload;
      } else {
        console.log("Event with id: " + id + " not found");
      }
      const eventDate: Date = new Date(action.payload.startDate.toString());
      console.log(
        "event key",
        eventKey,
        getWeekKey(eventDate),
        "also date",
        new Date(action.payload.startDate.toString())
      );

      //saveToSessionStorage(state, getWeekKey(eventDate));
    },
    removeEvent(state, action: PayloadAction<StoredEvent>) {
      const eventDate: Date = new Date(action.payload.startDate.toString());
      delete state.actualEvents[action.payload.id];
      //saveToSessionStorage(state, getWeekKey(eventDate));
    },
  },
});

export const { setEvents, addEvent, updateEvent, removeEvent } =
  eventDisplaySlice.actions;

export default eventDisplaySlice.reducer;
