import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventDisplayState } from "../utils/types";
import { StoredEvent } from "../utils/types";
import { getWeekKey } from "../pages/calendar/MainContent/TimeframeToday";
export const initialState: EventDisplayState = {
  isDisplayed: false,
  actualEvents: {},
};

const updateSessionStorage = (
  newEvent: StoredEvent,
  weekKey: string,
  itemID: number
) => {
  const data = getSessionData(weekKey);
  if (!data) return;
  data[itemID] = newEvent;
  sessionStorage.removeItem(weekKey);
  sessionStorage.setItem(weekKey, JSON.stringify(data));
};
const saveToSessionStorage = (newEvent: StoredEvent, weekKey: string) => {
  const data = getSessionData(weekKey);
  if (!data) return;
  const newId = +new Date();
  newEvent.id = newId;
  data[newId] = newEvent;
  sessionStorage.setItem(weekKey, JSON.stringify(data));
};
const removeFromSessionStorage = (newEvent: StoredEvent, weekKey: string) => {
  const data = getSessionData(weekKey);
  if (!data) return;
  delete data[newEvent.id];
  sessionStorage.setItem(weekKey, JSON.stringify(data));
};

function getSessionData(weekKey: string): StoredEvent[] | false {
  const storageKey = sessionStorage.getItem(weekKey);
  if (!storageKey) {
    return false;
  }
  const data = JSON.parse(storageKey as string);
  return data;
}

const eventDisplaySlice = createSlice({
  name: "eventCreation",
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<Record<string, StoredEvent>>) {
      return {
        ...state,
        actualEvents: action.payload,
      };
    },
    addEvent(state, action: PayloadAction<StoredEvent>) {
      const eventDate: Date = new Date(action.payload.startDate.toString());
      saveToSessionStorage(action.payload, getWeekKey(eventDate));
      /*return {
        ...state,
          actualEvents[action.payload.id]: action.payload,
      };*/
    },
    updateEvent(state, action: PayloadAction<StoredEvent>) {
      state.actualEvents[action.payload.id] = action.payload;

      const eventDate: Date = new Date(action.payload.startDate.toString());
      console.log(
        getWeekKey(eventDate),
        "also date",
        new Date(action.payload.startDate.toString())
      );

      updateSessionStorage(
        action.payload,
        getWeekKey(eventDate),
        action.payload.id
      );
    },
    removeEvent(state, action: PayloadAction<StoredEvent>) {
      const eventDate: Date = new Date(action.payload.startDate.toString());
      removeFromSessionStorage(action.payload, getWeekKey(eventDate));
      delete state.actualEvents[action.payload.id];
    },
  },
});

export const { setEvents, addEvent, updateEvent, removeEvent } =
  eventDisplaySlice.actions;

export default eventDisplaySlice.reducer;
