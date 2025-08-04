const SERVER_URL = "http://localhost:3000/events";

document.addEventListener("DOMContentLoaded", () => {
  let currentDate = new Date();
  const headerIconDate = document.getElementById("logoText");
  if (headerIconDate) {
    headerIconDate.innerText = currentDate.getDate().toString();
  }
  const timeframeTimezone = document.getElementById("timezone");
  if (timeframeTimezone) {
    timeframeTimezone.innerText = getGMT();
  }

  setupPanelTriggers();

  createEventListeners(currentDate);

  renderTable();

  renderCalendar();

  createTimeframeListeners(currentDate);
  timeframeUpdate(currentDate, 0);

  fillOutMonthDays(currentDate);
  sideCalendarMonth(currentDate);
});
interface StoredEvent {
  id: number;
  title: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  guests?: string;
  location?: string;
  description?: string;
}
interface APIResponse<T> {
  status: number;
  data: T;
  error?: string;
}
function fillOutWeekDays(currentDate: Date, offset: number) {
  currentDate.setDate(currentDate.getDate() + offset);
  let date = new Date(currentDate.toString());
  date.setDate(date.getDate() - date.getDay());
  const markedWeekDays = document.querySelectorAll(".weekViewGridHeader");
  markedWeekDays.forEach((classes) => {
    classes.classList.remove("weekViewGridHeaderMarked");
  });
  for (let i = 0; i < 7; i++) {
    let weekDate = <HTMLTableCellElement>(
      document.getElementById("weekDisplayDate" + i)
    );
    weekDate.innerText = date.getDate().toString();

    date.setDate(date.getDate() + 1);
    if (
      offset === 0 ||
      (new Date().getDate() === date.getDate() &&
        new Date().getMonth() === date.getMonth() &&
        new Date().getFullYear() === date.getFullYear())
    ) {
      document
        .getElementById("weekDisplayDate" + [currentDate.getDay()])
        ?.parentElement?.classList.toggle("weekViewGridHeaderMarked");
    } else {
    }
  }
}
function fillOutMonthDays(currentDate: Date) {
  let workingDate = new Date(currentDate.toString());
  workingDate.setDate(1);
  workingDate.setDate(workingDate.getDate() - workingDate.getDay());
  const calendarTable = <HTMLTableElement>(
    document.getElementById("calendarTable")
  );
  const calendarTBody = <HTMLTableSectionElement>(
    calendarTable.getElementsByTagName("tbody")[0]
  );
  for (let i = 0; i < 6; i++) {
    const calendarRow = <HTMLTableRowElement>(
      calendarTBody.getElementsByClassName("calendarRow")[i]
    );
    for (let j = 0; j < 7; j++) {
      const dayCell = <HTMLTableCellElement>(
        calendarRow.getElementsByClassName("calendarCell")[j]
      );
      dayCell.innerText = workingDate.getDate().toString();
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
async function apiPOST<T>(url: string, payload: T): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      data: payload,
      error: error.message,
    };
  }
}
async function apiDELETE<T>(url: string, id: T): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return {
      status: response.status,
      data: id,
    };
  } catch (error) {
    return {
      status: 500,
      data: id,
      error: error.message,
    };
  }
}
async function apiGET<T>(url: string): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      data: null as T,
      error: error.message,
    };
  }
}
async function apiPUT<T>(url: string, payload: T): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return {
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      status: 500,
      data: payload,
      error: error.message,
    };
  }
}
async function saveEvent(currentDate: Date): Promise<void> {
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
  const newEvent: StoredEvent = {
    id: Date.now(),
    title,
    startDate: startDate.toISOString(),
    startTime,
    endDate: endDate.toISOString(),
    endTime,

    guests: inputGuests.value,
    location: inputLocation.value,
    description: inputDescription.value,
  };
  const idImgHolder = document
    .getElementById("event")
    ?.getElementsByTagName("img")[0];
  let result;
  const existingEventId = idImgHolder?.getAttribute("id");
  if (idImgHolder?.getAttribute("id")) {
    result = await apiPUT<StoredEvent>(
      `${SERVER_URL}/${existingEventId}`,
      newEvent
    );
  } else {
    result = await apiPOST<StoredEvent>(SERVER_URL, newEvent);
  }

  if (result.error) {
    console.log("Error saving event: " + result.error);
    return;
  } else {
    console.log("Event saved with ID: ", newEvent.id);
    console.log(result.data);
  }

  eventViewTrigger();
  clearEvents();
  displayEvents(currentDate);
}
async function deleteEvent(currentDate: Date): Promise<void> {
  const imgWithId = document
    .getElementById("event")
    ?.getElementsByTagName("img")[0];
  if (!imgWithId) {
    return;
  }
  const idToDelete = imgWithId.getAttribute("id") as string;
  const result = await apiDELETE<string>(
    `${SERVER_URL}/${idToDelete}`,
    idToDelete
  );

  if (result.error) {
    console.log("Error deleting event: " + result.error);
    return;
  }
  console.log("Successfully deleted event with ID: ", idToDelete);
  clearEvents();
  displayEvents(currentDate);
}
/* TODO
    Event starts on day n and end on day n+1 but event time is <24h
    Event lasts longer than 24h
    On click on table -> open event window with pre-selected time
*/
async function displayEvents(currentDate: Date) {
  let startOfWeekTime: Date = new Date(currentDate.toString());
  startOfWeekTime.setDate(startOfWeekTime.getDate() - startOfWeekTime.getDay());
  startOfWeekTime.setHours(0, 0, 0);

  let endOfWeekTime: Date = new Date(startOfWeekTime.toString());
  endOfWeekTime.setDate(startOfWeekTime.getDate() + 7);

  const thisWeekUrl = () => {
    const startISO = startOfWeekTime.toISOString();
    const endISO = endOfWeekTime.toISOString();
    return `${SERVER_URL}?startDate_gte=${startISO}&endDate_lte=${endISO}`;
  };

  const response = await apiGET<StoredEvent[]>(thisWeekUrl());

  if (response.error || !response.data) {
    console.error("Error fetching events: ", response.error);
    return;
  }
  const events = response.data;
  let eventDuration: number[] = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const startDate = new Date(event.startDate.toString());
    const endDate = new Date(event.endDate.toString());
    const startTime = event.startTime;
    const endTime = event.endTime;

    eventDuration[i] =
      (+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 +
      (+endTime.substr(3, 2) - +startTime.substr(3, 2));
    const minToPxRatio: number = 1.25;
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
    if (isSameDayEvent()) {
      eventDuration[i] = eventDuration[i] / minToPxRatio;
      sameDayEventRender(event, eventDuration[i]);
    } else if (isLessThan24Hours()) {
      eventDuration[i] = (eventDuration[i] + 24 * 60) / minToPxRatio;
      // spanning two days but less than 24h event render func
    }
  }
  checkOverlappingEvents(events, eventDuration);
}
function clearEvents() {
  const displayedEvents = document.querySelectorAll<HTMLDivElement>(".meeting");
  displayedEvents.forEach((event) => {
    event.remove();
  });
}
function sameDayEventRender(event: StoredEvent, eventDuration: number) {
  const item = <HTMLDivElement>createDOMElement("div", ["meeting"], "");
  item.setAttribute("id", event.id.toString());
  item.innerText = event.startTime + "-" + event.endTime + " " + event.title;
  item.style.height = eventDuration + "px";
  const target = <HTMLTableCellElement>(
    document.getElementById(
      new Date(event.startDate).getDay() + "_" + +event.startTime.substr(0, 2)
    )
  );
  target.style.overflow = "visible";
  target.style.position = "relative";
  target.appendChild(item);

  item.addEventListener("click", () => {
    openEditEventWindow(event, event.id.toString());
  });
}
function openEditEventWindow(event: StoredEvent, id: string) {
  eventViewTrigger();
  for (let i = 0; i < formInputFieldList.length; i++) {
    if (event[formInputFieldList[i]]) {
      const inputField = <HTMLInputElement>(
        document.getElementById(formInputFieldList[i])
      );
      if (
        formInputFieldList[i] === "startDate" ||
        formInputFieldList[i] === "endDate"
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
  idImgHolder?.setAttribute("id", id);
}
function checkOverlappingEvents(
  events: StoredEvent[],
  eventDuration: number[]
) {
  let overlap: number = 0;
  for (let i = 0; i < events.length - 1; i++) {
    const firstEvent = document.getElementById(events[i].id.toString());
    overlap = 0;
    for (let j = 0; j < events.length; j++) {
      if (
        events[i].id.toString() != events[j].id.toString() &&
        events[i].startDate === events[j].startDate
      ) {
        const secondEvent = document.getElementById(events[j].id.toString());
        const isLonger = () => {
          return eventDuration[i] > eventDuration[j];
        };
        if (
          events[i].endTime >= events[j].startTime &&
          secondEvent &&
          firstEvent
        ) {
          overlap++;
          if (isLonger()) {
            secondEvent.style.width = `var(--event-layer-depth-${overlap})`;
            secondEvent.style.backgroundColor = `var(--event-layer-color-${overlap})`;
          } else {
            firstEvent.style.width = `var(--event-layer-depth-${overlap})`;
            firstEvent.style.backgroundColor = `var(--event-layer-color-${overlap})`;
          }
          if (firstEvent.style.width.slice(-2, -1)) {
            overlap = +firstEvent.style.width.slice(-2, -1);
          }
        }
      }
    }
  }
}
enum monthsShort {
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
}
enum monthsLong {
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
}
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
const chevronLeftSrc = "./media/chevron_left.svg";
const chevronRightSrc = "./media/chevron_right.svg";
function createDOMElement(
  type: string,
  classes?: string[],
  text?: string
): HTMLElement {
  const newItem = document.createElement(type);
  if (classes) {
    classes.forEach((itemClass) => {
      newItem.classList.add(itemClass);
    });
  }
  if (text) {
    newItem.innerText = text;
  }
  return newItem;
}
function renderCalendar() {
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
function renderTable() {
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
function getGMT() {
  let timezone: number = new Date().getTimezoneOffset() / 60;
  const sign: string = timezone == 0 ? "" : timezone > 0 ? "-" : "+";
  timezone = Math.abs(timezone);
  return `GMT ${sign}${timezone < 10 ? "0" : ""}${timezone}`;
}
function setupPanelTriggers() {
  const sideCalendarPanelTrigger = <HTMLElement>(
    document.getElementById("closeSidePanel")
  );
  const calendarSidePanel = <HTMLElement>(
    document.getElementById("calendarSideView")
  );
  const iconsSidePanel = <HTMLElement>document.getElementById("rightSidePanel");
  const iconsPanelTrigger = <HTMLImageElement>(
    document.getElementById("rightPanelChevron")
  );
  const calendarPanelWidth = "256px";
  const iconsPanelWidth = "56px";

  sideCalendarPanelTrigger.addEventListener("click", () => {
    calendarSidePanel.classList.toggle("notDisplayed");
    adjustMainDisplay(calendarSidePanel, iconsSidePanel);
  });

  iconsPanelTrigger.addEventListener("click", () => {
    iconsSidePanel.classList.toggle("notDisplayed");
    iconsPanelTrigger.src = iconsSidePanel.classList.contains("notDisplayed")
      ? chevronLeftSrc
      : chevronRightSrc;
    adjustMainDisplay(calendarSidePanel, iconsSidePanel);
  });

  const adjustMainDisplay = (
    calendarPanel: HTMLElement,
    rightPanel: HTMLElement
  ): void => {
    const calendarSideWidth: string = calendarPanel.classList.contains(
      "notDisplayed"
    )
      ? ""
      : calendarPanelWidth;
    const rightSideWidth: string = rightPanel.classList.contains("notDisplayed")
      ? ""
      : iconsPanelWidth;
    const contentGrid = <HTMLElement>document.getElementById("content");
    contentGrid.style.gridTemplateColumns =
      calendarSideWidth + " 1fr " + rightSideWidth;
  };
}
function createEventListeners(currentDate: Date) {
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
    eventViewTrigger();
  });
  const deleteEventButton = <HTMLButtonElement>(
    document.getElementById("deleteEventButton")
  );
  deleteEventButton.addEventListener("click", () => {
    deleteEvent(currentDate);
    eventViewTrigger();
  });
}
function createTimeframeListeners(currentDate: Date) {
  const nextTimeframe = <HTMLButtonElement>(
    document.getElementById("nextTimeframe")
  );
  const previousTimeframe = <HTMLButtonElement>(
    document.getElementById("previousTimeframe")
  );
  const headerTodayButton = <HTMLButtonElement>(
    document.getElementById("headerTodayButton")
  );
  nextTimeframe.addEventListener("click", () => {
    timeframeUpdate(currentDate, 7);
  });
  previousTimeframe.addEventListener("click", () => {
    timeframeUpdate(currentDate, -7);
  });
  headerTodayButton.addEventListener("click", () => {
    timeframeUpdate((currentDate = new Date()), 0);
  });
  const previousMonth = <HTMLButtonElement>(
    document.getElementById("previousMonth")
  );
  const nextMonth = <HTMLButtonElement>document.getElementById("nextMonth");
  previousMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    fillOutMonthDays(currentDate);
    sideCalendarMonth(currentDate);
  });
  nextMonth.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    fillOutMonthDays(currentDate);
    sideCalendarMonth(currentDate);
  });
  const calendarTable = <HTMLElement>document.getElementById("calendarTable");
  const calendarTBody = <HTMLTableSectionElement>(
    calendarTable.getElementsByTagName("tbody")[0]
  );

  calendarTBody.addEventListener("click", (cell) => {
    const targetDate = <HTMLElement>cell.target;
    if (targetDate.closest("td")) {
      let dateId = targetDate.closest("td")?.getAttribute("id");
      currentDate = new Date(Date.parse(dateId as string));
      timeframeUpdate(currentDate, 0);
      targetDate.classList.add("calendarCellHighlighted");
    }
  });
}
function timeframeUpdate(currentDate: Date, offset: number) {
  const isNewMonth = (): boolean => {
    let newMonth: Date = new Date(currentDate.toString());
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
    fillOutMonthDays(currentDate);
    sideCalendarMonth(currentDate);
  }
}
// Currently de-scoped
/*
function selection() {
  const settingsView = <HTMLElement>document.getElementById("settingsView");
  settingsView.classList.toggle("notDisplayed");
  settingsView.focus();
  document.getElementById("settingField")?.addEventListener("click", () => {
    displayDropdown("dropdownWeekDays");
  });
  document
    .getElementById("dropdownWeekDays")
    ?.addEventListener("click", (weekDay) => {});
  document.getElementById("closeSettings")?.addEventListener("click", () => {
    settingsView.classList.toggle("notDisplayed");
    document
      .getElementById("dropdownSettings")
      ?.classList.toggle("notDisplayed");
  });
}*/
function eventViewTrigger() {
  resetEventCreationForm();
  const eventView = <HTMLDialogElement>document.getElementById("event");
  eventView.classList.toggle("notDisplayed");
  const eventInputTitle = <HTMLInputElement>document.getElementById("title");
  eventInputTitle.focus();
}
function headerTimeframeDate(currentDate: Date) {
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
      getWeekStartDate().setDate(
        weekStartDate.getDate() - weekStartDate.getDay() + 6
      )
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

  const headerDate = <HTMLElement>document.getElementById("monthDisplay");
  if (headerDate) {
    headerDate.innerText = headerDateDisplay;
  }
}
function sideCalendarMonth(currentDate: Date) {
  const calendarMonthDisplay = <HTMLElement>(
    document.getElementById("calendarMonthDisplay")
  );
  calendarMonthDisplay.innerText =
    monthsLong[currentDate.getMonth()] + ", " + currentDate.getFullYear();
}
function displayDropdown(dropdown: string) {
  const dropdownField = <HTMLElement>document.getElementById(dropdown);
  if (dropdownField) {
    dropdownField.classList.toggle("notDisplayed");
    dropdownField.focus();
  }
}
function resetEventCreationForm() {
  formInputFieldList.forEach((elem: string) => {
    let inputField = <HTMLInputElement>document.getElementById(elem);
    inputField.value = "";
  });
  const imgWithId = <HTMLImageElement>(
    document.getElementById("event")?.getElementsByTagName("img")[0]
  );
  imgWithId.removeAttribute("id");
}
