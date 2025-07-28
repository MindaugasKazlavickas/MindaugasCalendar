document.addEventListener("DOMContentLoaded", () => {
  const currentDate: Date = new Date();
  const dateInLogo = <HTMLElement>document.getElementById("logoText");
  if (dateInLogo) {
    dateInLogo.innerText = currentDate.getDate().toString();
  }

  displayMonthName(currentDate);

  const tableTimezone = <HTMLElement>document.getElementById("timezone");
  if (tableTimezone) {
    tableTimezone.innerText = getGMT();
  }

  setupPanelTriggers();

  createEventListeners(currentDate);

  renderTable();

  renderCalendar();

  createWeekViewListeners(currentDate);
  createCalendarListeners(currentDate);

  fillOutWeekDays(currentDate, 0);
  displayCalendarMonth(currentDate);
});
interface StoredEvent {
  identifier: string;
  title: string;
  startTime: string;
  startDate: Date;
  endTime: string;
  endDate: Date;
  guests?: string;
  location?: string;
  description?: string;
}
function fillOutWeekDays(workingDate: Date, offset: number): void {
  workingDate.setDate(workingDate.getDate() + offset);
  displayMonthName(workingDate);
  fillOutMonthDays(workingDate);

  let date: Date = new Date(workingDate);
  date.setDate(date.getDate() - date.getDay());
  clearEvents();
  displayEvents(date);
  for (let i = 0; i < 7; i++) {
    let weekDate = <HTMLTableCellElement>(
      document.getElementById("weekDisplayDate" + i)
    );
    weekDate.innerText = date.getDate().toString();

    date.setDate(date.getDate() + 1);
  }

  let todayDate: Date = new Date();
  if (offset === 0) {
    workingDate = new Date(todayDate);
    document
      .getElementById("weekDisplayDate" + [todayDate.getDay()])
      ?.parentElement?.classList.add("weekViewGridHeaderMarked");
  } else {
    document
      .getElementById("weekDisplayDate" + [todayDate.getDay()])
      ?.parentElement?.classList.remove("weekViewGridHeaderMarked");
  }
}

function fillOutMonthDays(currentDate: Date): void {
  const workingDate: Date = new Date(currentDate);
  workingDate.setDate(1);
  let startDate = workingDate.getDate() - workingDate.getDay();
  workingDate.setDate(startDate);
  const calendarTable = <HTMLTableElement>(
    document.getElementById("calendarTable")
  );
  const calendarTBody = <HTMLTableSectionElement>(
    calendarTable.getElementsByTagName("tbody")[0]
  );
  for (let i = 0; i < 6; i++) {
    let calendarRow = <HTMLTableRowElement>(
      calendarTBody.getElementsByClassName("calendarRow")[i]
    );
    for (let j = 0; j < 7; j++) {
      let dayCell = <HTMLTableCellElement>(
        calendarRow.getElementsByClassName("calendarCell")[j]
      );
      dayCell.innerText = workingDate.getDate().toString();
      dayCell.removeAttribute("id");
      dayCell.setAttribute("id", workingDate.toString());
      const isTodayDate = () => {
        return (
          workingDate.getDate() == new Date().getDate() &&
          workingDate.getMonth() == new Date().getMonth()
        );
      };
      /*const isDateSelected = () => {
        return (
          date.getDay() == new Date().getDay() &&
          date.getDate() >= currentDate.getDate() &&
          date.getDate() <= currentDate.getDate() + 6 &&
          date.getDate() != currentDate.getDate() &&
          date.getDate() == currentDate.getDate() + date.getDay() &&
          date.getMonth() == currentDate.getMonth()
        );
      };*/
      if (isTodayDate()) {
        dayCell.classList.add("calendarCellSelected");
      } else if (workingDate.getMonth() != new Date().getMonth()) {
        dayCell.classList.remove("calendarCellSelected");
      }
      /*if (isDateSelected()) {
        dayCell.classList.add("calendarCellHighlighted");
      } else {
        dayCell.classList.remove("calendarCellHighlighted");
      }*/
      dayCell.classList.remove("calendarCellHighlighted");
      workingDate.setDate(workingDate.getDate() + 1);
    }
  }
}
function saveEvent(currentDate: Date): void {
  const eventIdentifier: string = "event " + Date.now();
  let newEvent: StoredEvent;
  const inputStartDate = <HTMLInputElement>document.getElementById("startDate");
  const inputEndDate = <HTMLInputElement>document.getElementById("endDate");
  const inputStartTime = <HTMLInputElement>document.getElementById("startTime");
  const inputEndTime = <HTMLInputElement>document.getElementById("endTime");
  const inputTitle = <HTMLInputElement>document.getElementById("title");
  const inputGuests = <HTMLInputElement>document.getElementById("guests");
  const inputLocation = <HTMLInputElement>document.getElementById("location");
  const inputDescription = <HTMLInputElement>(
    document.getElementById("description")
  );

  const startDate = new Date(inputStartDate.value);
  const endDate = new Date(inputEndDate.value);
  const startTime = inputStartTime.value;
  const endTime = inputEndTime.value;
  const title = inputTitle.value;

  if (title == "") {
    alert("Title is mandatory.");
    return;
  } else if (
    startDate == null ||
    endDate == null ||
    startTime == null ||
    endTime == null
  ) {
    alert("Make sure to enter start and end time and date.");
    return;
  } else if (
    startDate > endDate ||
    (startDate == endDate && startTime > endTime)
  ) {
    alert("End time of event can not be before the start time.");
    return;
  }
  newEvent = {
    identifier: Date.now().toString(),
    title,
    startDate,
    startTime,
    endDate,
    endTime,

    guests: inputGuests.value,
    location: inputLocation.value,
    description: inputDescription.value,
  };

  // REWRITE LOCAL STORAGE JSON UNDER ARRAY
  const oldEventIdHolder = document.getElementById("event");
  const oldEventId = oldEventIdHolder
    ? oldEventIdHolder.getElementsByTagName("img")[0]
    : "";
  if (oldEventId !== "") {
    if (!oldEventId.getAttribute("id")) {
      localStorage.setItem(eventIdentifier, JSON.stringify(newEvent));
    } else {
      localStorage.removeItem(oldEventId.getAttribute("id") as string);
      localStorage.setItem(eventIdentifier, JSON.stringify(newEvent));
    }
  }

  clearEvents();
  displayEvents(currentDate);
  eventViewTrigger();
}
/* TODO
    Event starts on day n and end on day n+1 but event time is <24h
    Event lasts longer than 2 days
    Atidaryti "event viewer" ir atnaujinti info
    On click on table -> open event window with pre-selected time
*/
function displayEvents(currentDate: Date): void {
  const keys: string[] = Object.keys(localStorage);
  let startOfWeekTime: Date = new Date(currentDate);
  startOfWeekTime.setDate(startOfWeekTime.getDate() - startOfWeekTime.getDay());
  startOfWeekTime.setHours(0);
  startOfWeekTime.setMinutes(0);
  startOfWeekTime.setSeconds(0);

  let endOfWeekTime: Date = new Date(startOfWeekTime);
  endOfWeekTime.setDate(startOfWeekTime.getDate() + 6);

  for (let i = 0; i < keys.length; i++) {
    let event: StoredEvent = JSON.parse(
      localStorage.getItem(keys[i]) as string
    );
    let startDate = new Date(event.startDate);
    let endDate = new Date(event.endDate);
    let startTime = event.startTime;
    let endTime = event.endTime;
    let eventDuration: number;
    let minToPxRatio: number = 1.25;
    const isSameDayEvent = (): boolean => {
      return startDate.getDate() === endDate.getDate();
    };
    const isLessThan24Hours = (): boolean => {
      return (
        endDate.getDate() > startDate.getDate() ||
        (endDate.getDate() < startDate.getDate() &&
          endDate.getMonth() > startDate.getMonth())
      );
    };
    const isEventThisWeek = (): boolean => {
      return (
        startDate.getDate() >= startOfWeekTime.getDate() &&
        endDate.getDate() < endOfWeekTime.getDate() &&
        startDate.getMonth() == startOfWeekTime.getMonth()
      );
    };

    if (isEventThisWeek()) {
      eventDuration =
        (+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 +
        (+endTime.substr(3, 2) - +startTime.substr(3, 2));
      if (isSameDayEvent()) {
        eventDuration = eventDuration / minToPxRatio;
        sameDayEventRender(keys[i], eventDuration);
      } else if (isLessThan24Hours()) {
        eventDuration = (eventDuration + 24 * 60) / minToPxRatio;
        // spanning two days but less than 24h event render func
      }
    } else {
      // multiDayEventRender(keys[i], startDate, endDate);
    }

    checkOverlappingEvents();
  }
}
// ^^^^
function clearEvents(): void {
  const keys: string[] = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    let displayedEvent = <HTMLDivElement>document.getElementById(keys[i]);
    if (displayedEvent != null) {
      displayedEvent.remove();
    }
  }
}
// ^^^^
function sameDayEventRender(identifier: string, eventDuration: number): void {
  const event: StoredEvent = JSON.parse(
    localStorage.getItem(identifier) as string
  );
  const startTime = event.startTime;
  const endTime = event.endTime;
  const startDate = new Date(event.startDate);
  const item = <HTMLDivElement>createDOMElement("div", ["meeting"], "");
  item.setAttribute("id", identifier);
  item.innerText = startTime + "-" + endTime + " " + event.title;
  item.style.height = eventDuration + "px";
  let timeCheck =
    +startTime.substr(0, 2) > 9
      ? startTime.substr(0, 2)
      : startTime.substr(1, 1);
  let target = <HTMLTableCellElement>(
    document.getElementById(startDate.getDay() + "_" + timeCheck)
  );
  target.style.overflow = "visible";
  target.style.position = "relative";
  target.appendChild(item);

  item.addEventListener("click", () => {
    openEditEventWindow(event, identifier);
  });
}
// ^^^^
function openEditEventWindow(event: StoredEvent, identifier: string): void {
  eventViewTrigger();
  for (let i = 0; i < formInputFieldList.length; i++) {
    if (event[formInputFieldList[i]]) {
      const inputField = <HTMLInputElement>(
        document.getElementById(formInputFieldList[i])
      );
      if (
        formInputFieldList[i] == "startDate" ||
        formInputFieldList[i] == "endDate"
      ) {
        inputField.value = event[formInputFieldList[i]].substr(0, 10);
      } else {
        inputField.value = event[formInputFieldList[i]];
      }
    }
  }
  const idImgHolder = document
    .getElementById("event")
    ?.getElementsByTagName("img")[0];
  idImgHolder?.setAttribute("id", identifier);
}

function checkOverlappingEvents(): void {
  const keys: string[] = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    if (<HTMLDivElement>document.getElementById(keys[i])) {
      let primaryRect = <DOMRect>(
        document.getElementById(keys[i])?.getBoundingClientRect()
      );
      for (let j = 0; j < keys.length - 1; j++) {
        if (keys[i] != keys[j] && document.getElementById(keys[j])) {
          let secondaryRect = <DOMRect>(
            document.getElementById(keys[j])?.getBoundingClientRect()
          );
          const isLonger = () => {
            return (
              primaryRect.bottom - primaryRect.top >
              secondaryRect.bottom - secondaryRect.top
            );
          };
          const isOverlapApplied = () => {
            const event = <HTMLDivElement>document.getElementById(keys[j]);
            return (
              !event.classList.contains("overlappingShorterEvent") &&
              !event.classList.contains("overlapped")
            );
          };
          if (
            primaryRect.top < secondaryRect.bottom &&
            primaryRect.bottom > secondaryRect.top
          ) {
            if (isLonger() && isOverlapApplied()) {
              document
                .getElementById(keys[j])
                ?.classList.add("overlappingShorterEvent");
              document.getElementById(keys[i])?.classList.add("overlapped");
            } else if (
              primaryRect.bottom - primaryRect.top <
              secondaryRect.bottom - secondaryRect.top
            ) {
              document
                .getElementById(keys[i])
                ?.classList.add("overlappingEvent");
              document.getElementById(keys[j])?.classList.add("overlapped");
            }
          }
        }
      }
    }
  }
}
const monthsShort: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthsLong: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const formInputFieldList: string[] = [
  "title",
  "startTime",
  "startDate",
  "endTime",
  "endDate",
  "guests",
  "location",
  "description",
];
const toggleChevron: string[] = [
  "./media/chevron_right.svg",
  "./media/chevron_left.svg",
];
function createDOMElement(
  type: string,
  classes?: string | string[],
  text?: string | undefined
): HTMLElement {
  const newItem = <HTMLElement>document.createElement(type);
  if (typeof classes === "string") {
    newItem.classList.add(classes);
  } else if (classes) {
    classes.forEach((itemClass) => {
      newItem.classList.add(itemClass);
    });
  }
  if (text) {
    newItem.innerText = text;
  }
  return newItem;
}
function renderCalendar(): void {
  const table = <HTMLTableElement>document.getElementById("calendarTable");
  const tableBody = <HTMLTableSectionElement>table.createTBody();

  for (let i = 0; i < 6; i++) {
    const calendarRow = <HTMLTableRowElement>(
      createDOMElement("tr", ["calendarRow"])
    );
    for (let j = 0; j < 7; j++) {
      let dayCell = <HTMLTableCellElement>(
        createDOMElement("td", ["calendarCell"])
      );
      dayCell.setAttribute("id", "calendar" + i + j);

      calendarRow.appendChild(dayCell);
    }
    tableBody.appendChild(calendarRow);
  }
}
function renderTable(): void {
  const table = <HTMLElement>document.getElementById("weekGrid");
  const tableBody = <HTMLTableSectionElement>(
    table.getElementsByTagName("tbody")[0]
  );

  for (let i = 1; i <= 24; i++) {
    const tableRow = <HTMLTableRowElement>(
      createDOMElement("tr", ["weekViewGridRow"])
    );

    const getDateTimeText = (hour: number): string => {
      switch (true) {
        case hour < 12:
          return `${hour} AM`;
        case hour == 12:
          return `${hour} PM`;
        case hour < 24:
          return `${hour - 12} PM`;
        default:
          return "";
      }
    };

    const dayTimeCell = <HTMLTableCellElement>(
      createDOMElement(
        "td",
        ["weekViewGridBox", "timeColumn"],
        getDateTimeText(i)
      )
    );

    tableRow.appendChild(dayTimeCell);
    const gap = <HTMLTableCellElement>(
      createDOMElement("td", ["weekViewGridBoxLeftMost"])
    );
    tableRow.appendChild(gap);

    for (let j = 0; j < 7; j++) {
      const tableCell = <HTMLTableCellElement>(
        createDOMElement("td", ["weekViewGridBox"])
      );
      tableCell.setAttribute("id", j + "_" + i);
      tableRow.appendChild(tableCell);
    }
    tableBody.appendChild(tableRow);
  }
}
function getGMT(): string {
  let timezone: number = new Date().getTimezoneOffset() / 60;
  const sign: string = timezone == 0 ? "" : timezone > 0 ? "-" : "+";
  let addZero: string | undefined;
  timezone = Math.abs(timezone);
  if (timezone < 10 && timezone > -10) {
    addZero = "0" + timezone;
  }
  return `GMT ${sign}${addZero ? addZero : timezone}`;
}
function setupPanelTriggers(): void {
  const closeSidePanel = <HTMLElement>document.getElementById("closeSidePanel");
  const calendarSidePanel = <HTMLElement>(
    document.getElementById("calendarSideView")
  );
  const rightSidePanel = <HTMLElement>document.getElementById("rightSidePanel");
  const rightPanelTrigger = <HTMLImageElement>(
    document.getElementById("rightPanelChevron")
  );

  closeSidePanel.addEventListener("click", () => {
    calendarSidePanel.classList.toggle("notDisplayed");
    adjustMainDisplay(calendarSidePanel, rightSidePanel);
  });

  rightPanelTrigger.addEventListener("click", () => {
    rightSidePanel.classList.toggle("notDisplayed");
    rightPanelTrigger.src = rightSidePanel.classList.contains("notDisplayed")
      ? toggleChevron[1]
      : toggleChevron[0];
    adjustMainDisplay(
      <HTMLElement>calendarSidePanel,
      <HTMLElement>rightSidePanel
    );
  });

  const adjustMainDisplay = (
    leftPanel: HTMLElement,
    rightPanel: HTMLElement
  ): void => {
    let leftSideWidth: string = leftPanel.classList.contains("notDisplayed")
      ? ""
      : "256px";
    let rightSideWidth: string = rightPanel.classList.contains("notDisplayed")
      ? ""
      : "56px";
    const contentGrid = <HTMLElement>document.getElementById("content");
    contentGrid.style.gridTemplateColumns =
      leftSideWidth + " 1fr " + rightSideWidth;
  };
}
function createEventListeners(currentDate: Date): void {
  const eventWindowButton = <HTMLButtonElement>(
    document.getElementById("eventWindowButton")
  );
  eventWindowButton.addEventListener("click", () => {
    eventViewTrigger();
  });

  const timeframeSelectButton = <HTMLButtonElement>(
    document.getElementById("timeframeSelectButton")
  );
  timeframeSelectButton.addEventListener("click", () => {
    displayDropdown("dropdownContent");
  });

  const settingsDropdown = <HTMLButtonElement>(
    document.getElementById("settings")
  );
  settingsDropdown.addEventListener("click", () => {
    displayDropdown("dropdownSettings");
  });

  const settingsButton = <HTMLButtonElement>(
    document.getElementById("settingsButton")
  );
  settingsButton.addEventListener("click", () => {
    console.log("setting, to be implemented, is triggered");
  });

  const eventSaveToStorage = <HTMLButtonElement>(
    document.getElementById("eventSaveButton")
  );
  eventSaveToStorage.addEventListener("click", () => saveEvent(currentDate));

  const dialogCloseButton = <HTMLButtonElement>(
    document.getElementById("dialogCloseButton")
  );
  dialogCloseButton.addEventListener("click", () => {
    resetEventCreationForm();
    eventViewTrigger();
  });

  const headerTodayButton = <HTMLButtonElement>(
    document.getElementById("headerTodayButton")
  );
  headerTodayButton.addEventListener("click", () => {
    fillOutWeekDays(new Date(), 0);
    currentDate = new Date();
  });
}
function createWeekViewListeners(currentDate: Date): void {
  const nextTimeframe = <HTMLButtonElement>(
    document.getElementById("nextTimeframe")
  );
  const previousTimeframe = <HTMLButtonElement>(
    document.getElementById("previousTimeframe")
  );
  nextTimeframe.addEventListener("click", () => {
    fillOutWeekDays(currentDate, 7);
  });
  previousTimeframe.addEventListener("click", () => {
    fillOutWeekDays(currentDate, -7);
  });
}
function createCalendarListeners(currentDate: Date): void {
  const previousMonth = <HTMLButtonElement>(
    document.getElementById("previousMonth")
  );
  const nextMonth = <HTMLButtonElement>document.getElementById("nextMonth");

  previousMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    fillOutMonthDays(currentDate);
    displayCalendarMonth(currentDate);
  });
  nextMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    fillOutMonthDays(currentDate);
    displayCalendarMonth(currentDate);
  });

  const calendarTable = <HTMLElement>document.getElementById("calendarTable");
  const calendarTBody = <HTMLTableSectionElement>(
    calendarTable.getElementsByTagName("tbody")[0]
  );

  calendarTBody.addEventListener("click", (cell) => {
    const targetDate = <HTMLElement>cell.target;
    if (targetDate.closest("td")) {
      let dateId = targetDate.closest("td")?.getAttribute("id");
      let setWeek: Date = new Date(Date.parse(dateId as string));
      fillOutWeekDays(setWeek, 0);
      targetDate.classList.add("calendarCellHighlighted");
    }
  });
}
// Currently de-scoped
function selection() {
  const settingsView = <HTMLElement>document.getElementById("settingsView");
  settingsView.classList.toggle("notDisplayed");
  settingsView.focus();
  document.getElementById("settingField")?.addEventListener("click", () => {
    displayDropdown("dropdownWeekDays");
  });
  document
    .getElementById("dropdownWeekDays")
    ?.addEventListener("click", (weekDay) => {}); // To be added, currently de-scoped
  document.getElementById("closeSettings")?.addEventListener("click", () => {
    settingsView.classList.toggle("notDisplayed");
    document
      .getElementById("dropdownSettings")
      ?.classList.toggle("notDisplayed");
  });
}
function eventViewTrigger(): void {
  resetEventCreationForm();
  const eventView = <HTMLDialogElement>document.getElementById("event");
  eventView.classList.toggle("notDisplayed");
  const eventInputTitle = <HTMLInputElement>document.getElementById("title");
  eventInputTitle.focus();
}
function displayMonthName(currentDate: Date): void {
  const isPassingWeek = (): boolean => {
    const weekStartDate: Date = new Date(currentDate);
    const weekEndDate: Date = new Date(currentDate);

    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    weekEndDate.setDate(weekEndDate.getDate() - weekEndDate.getDay() + 6);
    return weekStartDate.getDate() > weekEndDate.getDate();
  };

  let headerDateDisplay: string = `${
    isPassingWeek()
      ? monthsShort[currentDate.getMonth()] +
        " - " +
        monthsShort[currentDate.getMonth() + 1]
      : monthsLong[currentDate.getMonth()]
  }, ${currentDate.getFullYear()}`;

  const monthDisplay = <HTMLElement>document.getElementById("monthDisplay");
  if (monthDisplay.innerText) {
    monthDisplay.innerText = headerDateDisplay;
  }
}
function displayCalendarMonth(currentDate: Date): void {
  const calendarMonthDisplay = <HTMLElement>(
    document.getElementById("calendarMonthDisplay")
  );
  calendarMonthDisplay.innerText =
    monthsLong[currentDate.getMonth()] + ", " + currentDate.getFullYear();
}
function displayDropdown(dropdown: string): void {
  const dropdownField = <HTMLElement>document.getElementById(dropdown);
  if (dropdownField) {
    dropdownField.classList.toggle("notDisplayed");
    dropdownField.focus();
  }
}
function resetEventCreationForm(): void {
  formInputFieldList.forEach((elem: string) => {
    let inputField = <HTMLInputElement>document.getElementById(elem);
    inputField.value = "";
  });
  const imgWithId = <HTMLImageElement>(
    document.getElementById("event")?.getElementsByTagName("img")[0]
  );
  imgWithId.removeAttribute("id");
}
/* TYPESCRIPT TODO:

1.  TRANSPILE AS IS
2.  TYPES FOR PRIMITIVES
3.  CUSTOM TYPES
4.  ENUMS
5.  JSON SERVER
*/
