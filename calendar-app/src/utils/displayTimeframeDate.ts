import {
  monthsShort,
  monthsLong,
} from "../../pages/calendar/MainContent/consts";
export function headerTimeframeDate(currentDate: Date) {
  const getWeekStartDate = (): Date => {
    return new Date(
      new Date(currentDate.toString()).setDate(
        currentDate.getDate() - currentDate.getDay()
      )
    );
  };

  const getMonthNames = () => {
    let weekStartDate = getWeekStartDate();
    let weekEndDate = new Date(
      getWeekStartDate().setDate(weekStartDate.getDate() + 6)
    );

    return weekStartDate.getDate() > weekEndDate.getDate()
      ? monthsShort[weekStartDate.getMonth()] +
          " - " +
          monthsShort[weekStartDate.getMonth() + 1]
      : monthsLong[currentDate.getMonth()];
  };
  let headerDateDisplay = `${
    getMonthNames() + ", " + currentDate.getFullYear()
  }`;

  const headerDate = document.getElementById("monthDisplay");
  if (headerDate) {
    headerDate.innerText = headerDateDisplay;
  }
}

export function sideCalendarMonth(currentDate: Date) {
  const calendarMonthDisplay = document.getElementById(
    "calendarMonthDisplay"
  ) as HTMLElement;
  calendarMonthDisplay.innerText =
    monthsLong[currentDate.getMonth()] + ", " + currentDate.getFullYear();
}
