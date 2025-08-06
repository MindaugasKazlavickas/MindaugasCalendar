import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentDateState {
  value: Date;
}

const initialState: CurrentDateState = {
  value: new Date(),
};

const currentDateSlice = createSlice({
  name: "currentDate",
  initialState,
  reducers: {
    setCurrentDate(state, action: PayloadAction<Date>) {
      state.value = action.payload;
    },
    resetToToday(state) {
      state.value = new Date();
    },
    shiftWeek(state, action: PayloadAction<number>) {
      state.value = new Date(state.value.getTime() + action.payload * 86400000);
    },
    shiftMonth(state, action: PayloadAction<number>) {
      const newDate = new Date(state.value);
      newDate.setMonth(newDate.getMonth() + action.payload);
      state.value = newDate;
    },
  },
});

export const { setCurrentDate, resetToToday, shiftWeek, shiftMonth } =
  currentDateSlice.actions;

export default currentDateSlice.reducer;
