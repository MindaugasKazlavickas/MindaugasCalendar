import { WeekDays } from "../consts/nameArrays";
import { useEffect } from "react";
import createDOMElement from "./renderers/createDOMElement";
import RenderCalendar from "./renderers/renderCalendar";
import fillOutMonthDays from "../timeframeUpdaters/fillOutMonthDays";
import { eventViewTrigger } from "../helpers/handleEventForm";
import { sideCalendarMonth } from "../timeframeUpdaters/displayTimeframeDate";
import timeframeUpdate from "../timeframeUpdaters/updateTimeframe";
function CalendarPanel() {
  let currentDate = new Date();
  useEffect(() => {
    RenderCalendarTableHeader();
    RenderCalendar();
    fillOutMonthDays(new Date());
  }, []);
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
              currentDate.setMonth(currentDate.getMonth() - 1);
              fillOutMonthDays(currentDate);
              sideCalendarMonth(currentDate);
            }}
          >
            <img src="./media/chevron_left.svg" alt="Go back a month" />
          </button>
          <button
            id="nextMonth"
            className="smallIconButton"
            onClick={() => {
              currentDate.setMonth(currentDate.getMonth() + 1);
              fillOutMonthDays(currentDate);
              sideCalendarMonth(currentDate);
            }}
          >
            <img src="./media/chevron_right.svg" alt="Go forward a month" />
          </button>
        </div>
      </div>
      <div className="calendarRow" id="calendarHeaderRow">
        {/*header gets inserted here*/}
      </div>
      <table
        id="calendarTable"
        className="calendarTable"
        onClick={(cell) => {
          const targetDate = cell.target as HTMLTableCellElement;
          if (targetDate.closest("td")) {
            let dateId = targetDate.closest("td")?.getAttribute("id");
            currentDate = new Date(Date.parse(dateId as string));
            timeframeUpdate(currentDate, 0);
            targetDate.classList.add("calendarCellHighlighted");
          }
        }}
      >
        {/*calendar gets inserted here*/}
      </table>
    </aside>
  );
}
function RenderCalendarTableHeader() {
  const calendarTableHeader = document.getElementById("calendarHeaderRow");
  if (calendarTableHeader && calendarTableHeader.hasChildNodes()) {
    for (let i = 0; i < 7; i++) {
      (
        calendarTableHeader.getElementsByClassName("calendarCell")[
          i
        ] as HTMLElement
      ).innerText = WeekDays[i][0];
    }
  } else {
    for (let i = 0; i < 7; i++) {
      calendarTableHeader?.appendChild(
        createDOMElement("p", ["calendarCell"], WeekDays[i][0])
      );
    }
  }
}
export default CalendarPanel;
