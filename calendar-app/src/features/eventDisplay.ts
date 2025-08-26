import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventDisplayState } from "../utils/types";
import { StoredEvent } from "../utils/types";
import { getWeekKey } from "../pages/calendar/MainContent/TimeframeToday";
import { log } from "console";
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
  console.log(data);
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
      const allEvents = Object.values(state.actualEvents);
      let eventWeekKey = getWeekKey(eventDate);
      let thisWeekKey = allEvents[0]
        ? getWeekKey(new Date(allEvents[0]?.startDate))
        : eventWeekKey;
      console.debug(action.payload, eventWeekKey);
      saveToSessionStorage(action.payload, eventWeekKey);
      console.log(eventWeekKey, thisWeekKey);
      switch (eventWeekKey === thisWeekKey) {
        case true: {
          return {
            ...state,
            actualEvents: {
              ...state.actualEvents,
              [action.payload.id]: action.payload,
            },
          };
        }
        default: {
          return state;
        }
      }
    },
    updateEvent(state, action: PayloadAction<StoredEvent>) {
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
      return {
        ...state,
        actualEvents: {
          ...state.actualEvents,
          [action.payload.id]: action.payload,
        },
      };
    },
    removeEvent(state, action: PayloadAction<StoredEvent>) {
      const eventDate: Date = new Date(action.payload.startDate.toString());
      removeFromSessionStorage(action.payload, getWeekKey(eventDate));
      const { [action.payload.id]: _, ...rest } = state.actualEvents;
      return {
        ...state,
        actualEvents: rest,
      };
    },
  },
});

export const { setEvents, addEvent, updateEvent, removeEvent } =
  eventDisplaySlice.actions;

export default eventDisplaySlice.reducer;
