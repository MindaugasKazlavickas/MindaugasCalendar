import { WeekDays } from "./consts";
import { useEffect } from "react";
import { eventViewTrigger } from "../../../src/utils/handleEventForm";
import { sideCalendarMonth } from "../../../src/utils/displayTimeframeDate";
import { useDispatch, useSelector } from "react-redux";
import { shiftMonthView } from "../../../src/reduxDateManagement";
import { AppDispatch, RootState } from "../../../src/store";
import MonthCalendar from "./CalendarSidePanel/MonthCalendar";
function CalendarPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const monthViewDateStr = useSelector(
    (state: RootState) => state.currentDate.monthViewDate
  );

  useEffect(() => {
    const monthViewdate = new Date(monthViewDateStr);
    sideCalendarMonth(monthViewdate);
  }, [monthViewDateStr]);
  return (
    <aside id="calendarSideView" className="calendarSidePanel">
      <button
        className="eventTrigger"
        id="eventWindowButton"
        onClick={() => eventViewTrigger()}
      >
        <img
          className="icon"
          src="./media/add.svg"
          alt="Create event trigger"
        />
        <span>Create</span>
        <img
          className="icon"
          src="./media/arrow_down.svg"
          alt="Event creation dropdown trigger"
        />
      </button>

      <div className="calendarHeader">
        <p id="calendarMonthDisplay" className="calendarMonth">
          November, 2025
        </p>
        <div className="calendarSideViewButtons">
          <button
            id="previousMonth"
            className="smallIconButton"
            onClick={() => {
              dispatch(shiftMonthView(-1));
            }}
          >
            <img src="./media/chevron_left.svg" alt="Go back a month" />
          </button>
          <button
            id="nextMonth"
            className="smallIconButton"
            onClick={() => {
              dispatch(shiftMonthView(1));
            }}
          >
            <img src="./media/chevron_right.svg" alt="Go forward a month" />
          </button>
        </div>
      </div>
      <div className="calendarRow" id="calendarHeaderRow">
        {WeekDays.map((weekDay, i) => {
          return (
            <p key={i} className="calendarCell">
              {weekDay[0]}
            </p>
          );
        })}
        {/*header gets inserted here*/}
      </div>
      <MonthCalendar />
    </aside>
  );
}
export default CalendarPanel;
