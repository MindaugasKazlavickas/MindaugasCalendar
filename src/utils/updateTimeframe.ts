import { displayEvents } from "../api/displayEvents";
import { clearEvents } from "../api/displayEvents";
import fillOutWeekDays from "./fillOutWeekDays";
import { headerTimeframeDate } from "./displayTimeframeDate";
function timeframeUpdate(currentDate: Date, offset: number) {
  fillOutWeekDays(currentDate, offset);
  clearEvents();
  displayEvents(currentDate);
  headerTimeframeDate(currentDate);
}
export default timeframeUpdate;
