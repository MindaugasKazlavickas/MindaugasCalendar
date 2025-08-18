import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventDisplayState } from "../utils/types";

export const initialState: EventDisplayState = {
  isDisplayed: false,
};

const eventDisplayeSlice = createSlice({
  name: "isDisplayed",
  initialState,
  reducers: {
    triggerEventWindow(state, action: PayloadAction<boolean>) {
      state.isDisplayed = action.payload;
    },
  },
});

export const { triggerEventWindow } = eventDisplayeSlice.actions;

export default eventDisplayeSlice.reducer;
