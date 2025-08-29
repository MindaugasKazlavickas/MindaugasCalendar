import { WeekDays } from "./consts";
<<<<<<<< HEAD:calendar-app/pages/calendar/MainContent/CalendarSidePanel.tsx
import { useEffect } from "react";
import { eventViewTrigger } from "../../../src/utils/handleEventForm";
import { sideCalendarMonth } from "../../../src/utils/displayTimeframeDate";
import { useDispatch, useSelector } from "react-redux";
import { shiftMonthView } from "../../../src/features/currentDate";
import { AppDispatch, RootState } from "../../../src/store";
import MonthCalendar from "./CalendarSidePanel/MonthCalendar";
function CalendarPanel() {
========
import { monthsLong } from "./consts";
import { useDispatch, useSelector } from "react-redux";
import { shiftMonthView } from "../../../features/currentDate";
import { AppDispatch, RootState } from "../../../store";
import MonthCalendar from "./CalendarSidePanel/MonthCalendar";
import { useEventContext } from "../../../utils/EventContext";
function CalendarPanel({
  eventWindow,
  triggerEventWindow,
}: {
  eventWindow: boolean;
  triggerEventWindow: (value: boolean) => void;
}) {
  const { setEventWindow, setSelectedEvent } = useEventContext();

  const openNewEventForm = () => {
    setSelectedEvent(null);
    setEventWindow(true);
  };
>>>>>>>> origin/react-dom-improved:calendar-app/src/pages/calendar/MainContent/CalendarSidePanel.tsx
  const dispatch = useDispatch<AppDispatch>();
  const monthViewDateStr = useSelector(
    (state: RootState) => state.currentDate.monthViewDate
  );
  return (
    <aside id="calendarSideView" className="calendarSidePanel">
      <button
        className="eventTrigger"
        id="eventWindowButton"
        onClick={openNewEventForm}
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
          {monthsLong[new Date(monthViewDateStr).getMonth()] +
            ", " +
            new Date(monthViewDateStr).getFullYear()}
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
