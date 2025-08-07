import { displayEvents } from "../helpers/displayEvents";
import { clearEvents } from "../helpers/displayEvents";
import fillOutWeekDays from "./fillOutWeekDays";
import { headerTimeframeDate, sideCalendarMonth } from "./displayTimeframeDate";
function timeframeUpdate(currentDate: Date, offset: number) {
  const isNewMonth = (): boolean => {
    const newMonth: Date = new Date(currentDate.toString());
    return (
      currentDate.getMonth() ===
      new Date(newMonth.setDate(newMonth.getDate() + offset)).getMonth()
    );
  };
  fillOutWeekDays(currentDate, offset);
  clearEvents();
  displayEvents(currentDate);
  headerTimeframeDate(currentDate);
  if (isNewMonth()) {
    sideCalendarMonth(currentDate);
  }
}
export default timeframeUpdate;
