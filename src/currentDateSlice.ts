import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentDateState {
  currentDate: string;
  monthViewDate: string;
}

export const initialState: CurrentDateState = {
  currentDate: new Date().toISOString(),
  monthViewDate: new Date().toISOString(),
};

const currentDateSlice = createSlice({
  name: "currentDate",
  initialState,
  reducers: {
    setCurrentDate(state, action: PayloadAction<string>) {
      state.currentDate = action.payload;
    },
    resetToToday(state) {
      const today = new Date().toISOString();
      state.currentDate = today;
      state.monthViewDate = today;
    },
    shiftWeek(state, action: PayloadAction<number>) {
      const current = new Date(state.currentDate);
      current.setDate(current.getDate() + action.payload);
      state.currentDate = current.toISOString();
    },
    shiftMonthView(state, action: PayloadAction<number>) {
      const month = new Date(state.monthViewDate);
      month.setMonth(month.getMonth() + action.payload);
      state.monthViewDate = month.toISOString();
    },
    jumpToDate(state, action: PayloadAction<string>) {
      state.currentDate = action.payload;
    },
    setMonthViewDate(state, action: PayloadAction<string>) {
      state.monthViewDate = action.payload;
    },
  },
});

export const {
  setCurrentDate,
  resetToToday,
  shiftWeek,
  shiftMonthView,
  jumpToDate,
  setMonthViewDate,
} = currentDateSlice.actions;

export default currentDateSlice.reducer;
