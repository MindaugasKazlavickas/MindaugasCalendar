document.addEventListener("DOMContentLoaded", () => {
  const currentDate = new Date();

  document.getElementById("logoText").innerText = currentDate.getDate();

  displayMonthName(currentDate);

  document.getElementById("timezone").innerText = getGMT();

  setupPanelTriggers();

  createEventListeners();

  renderTable();

  renderCalendar();

  createWeekViewListeners(currentDate);
  createCalendarListeners(currentDate);

  fillOutWeekDays(currentDate, 0);
  displayCalendarMonth(currentDate);
});

function fillOutWeekDays(workingDate, offset) {
  let date;
  workingDate.setDate(workingDate.getDate() + offset);
  displayMonthName(workingDate);
  fillOutMonthDays(workingDate);

  date = new Date(workingDate);
  date.setDate(date.getDate() - date.getDay());
  for (let i = 0; i < 7; i++) {
    document.getElementById("weekDisplayDate" + i).innerText = date.getDate();

    date.setDate(date.getDate() + 1);
  }

  clearEvents();
  displayEvents(workingDate);

  let todayDate = new Date();
  if (offset === 0) {
    workingDate = new Date(todayDate);
    document
      .getElementById("weekDisplayDate" + [todayDate.getDay()])
      .parentElement.classList.add("weekViewGridHeaderMarked");
  } else {
    document
      .getElementById("weekDisplayDate" + [todayDate.getDay()])
      .parentElement.classList.remove("weekViewGridHeaderMarked");
  }
}

function fillOutMonthDays(currentDate) {
  const date = new Date(currentDate);
  date.setDate(1);
  let startDate = date.getDate() - date.getDay();
  date.setDate(startDate);
  let parentContainer = document
    .getElementById("calendarContainer")
    .getElementsByTagName("tbody")[0];
  for (let i = 0; i < 6; i++) {
    let row = parentContainer.getElementsByClassName("calendarRow")[i];
    for (let j = 0; j < 7; j++) {
      let dayCell = row.getElementsByClassName("calendarCell")[j];
      dayCell.innerText = date.getDate();
      dayCell.removeAttribute("id");
      dayCell.setAttribute("id", date);
      if (
        date.getDate() == new Date().getDate() &&
        date.getMonth() == new Date().getMonth()
      ) {
        dayCell.classList.add("calendarCellSelected");
      } else if (date.getMonth() != new Date().getMonth()) {
        dayCell.classList.remove("calendarCellSelected");
      }
      if (
        date.getDay() == new Date().getDay() &&
        date.getDate() >= currentDate.getDate() &&
        date.getDate() <= currentDate.getDate() + 6 &&
        date.getDate() != currentDate.getDate() &&
        date.getDate() == currentDate.getDate() + date.getDay() &&
        date.getMonth() == currentDate.getMonth()
      ) {
        dayCell.classList.add("calendarCellHighlighted");
      } else {
        dayCell.classList.remove("calendarCellHighlighted");
      }
      date.setDate(date.getDate() + 1);
    }
  }
}
function saveEvent(currentDate) {
  const eventIdentifier = "event " + Date.now();
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const title = document.getElementById("title").value;
  if (title == "") {
    alert("Title is mandatory.");
    return;
  } else if (
    startDate == "" ||
    endDate == "" ||
    startTime == "" ||
    endTime == ""
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
  let newEvent = {
    identifier: Date.now(),
    title,
    startDate,

    startTime,
    endDate,
    endTime,

    guests: document.getElementById("guests").value,
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
  };

  // REWRITE LOCAL STORAGE JSON UNDER ARRAY
  const oldEventId = document
    .getElementById("event")
    .getElementsByTagName("img")[0];
  if (!oldEventId.getAttribute("id")) {
    localStorage.setItem(eventIdentifier, JSON.stringify(newEvent));
  } else {
    localStorage.removeItem(oldEventId.getAttribute("id"));
    localStorage.setItem(eventIdentifier, JSON.stringify(newEvent));
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
function displayEvents(currentDate) {
  const keys = Object.keys(localStorage);
  let startOfWeekTime = new Date(
    currentDate.setDate(currentDate.getDate() - currentDate.getDay())
  );
  startOfWeekTime.setHours(0);
  startOfWeekTime.setMinutes(0);
  startOfWeekTime.setSeconds(0);
  let endOfWeekTime = new Date(startOfWeekTime);
  endOfWeekTime.setDate(startOfWeekTime.getDate() + 6);

  for (let i = 0; i < keys.length; i++) {
    let event = JSON.parse(localStorage.getItem(keys[i]));
    let startDate = new Date(event.startDate);
    let endDate = new Date(event.endDate);
    let startTime = event.startTime;
    let endTime = event.endTime;
    let eventDuration;
    const isSameDayEvent = () => {
      return startDate === endDate;
    };
    const isLessThan24Hours = () => {
      return (
        endDate.getDate() > startDate.getDate() ||
        (endDate.getDate() < startDate.getDate() &&
          endDate.getMonth() > startDate.getMonth())
      );
    };
    const isEventThisWeek = () => {
      return (
        startDate.getDate() >= startOfWeekTime.getDate() &&
        endDate.getDate() < endOfWeekTime.getDate() &&
        startDate.getMonth() == startOfWeekTime.getMonth()
      );
    };
    if (isEventThisWeek) {
      eventDuration =
        (+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 +
        (+endTime.substr(3, 2) - +startTime.substr(3, 2));
      if (isSameDayEvent) {
        eventDuration = eventDuration / 1.25;
        sameDayEventRender(keys[i], eventDuration);
      } else if (isLessThan24Hours) {
        eventDuration = (eventDuration + 24 * 60) / 1.25;
        // Missing function
      }
    } else {
      // multiDayEventRender(keys[i], startDate, endDate);
    }

    checkOverlappingEvents();
  }
}
// ^^^^
function clearEvents() {
  const keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    let displayedEvent = document.getElementById(keys[i]);
    if (displayedEvent != null) {
      displayedEvent.remove();
    }
  }
}
// ^^^^
function sameDayEventRender(identifier, eventDuration) {
  const event = JSON.parse(localStorage.getItem(identifier));
  const startTime = event.startTime;
  const endTime = event.endTime;
  const startDate = new Date(event.startDate);
  const item = createDOMElement("div", ["meeting"], "");
  item.setAttribute("id", identifier);
  let height = eventDuration;
  item.innerText = startTime + "-" + endTime + " " + event.title;
  item.style.height = height + "px";
  let timeCheck =
    +startTime.substr(0, 2) > 9
      ? startTime.substr(0, 2)
      : startTime.substr(1, 1);
  let target = document.getElementById(startDate.getDay() + "_" + timeCheck);
  target.style.overflow = "visible";
  target.style.position = "relative";
  target.appendChild(item);

  item.addEventListener("click", () => {
    openEditEventWindow(event, identifier);
  });
}
// ^^^^
function openEditEventWindow(event, identifier) {
  eventViewTrigger();
  for (let i = 0; i < formInputFieldList.length; i++) {
    if (event[formInputFieldList[i]]) {
      if (
        formInputFieldList[i] == "startDate" ||
        formInputFieldList[i] == "endDate"
      ) {
        document.getElementById(formInputFieldList[i]).value = event[
          formInputFieldList[i]
        ].substr(0, 10);
      } else {
        console.log();
        document.getElementById(formInputFieldList[i]).value =
          event[formInputFieldList[i]];
      }
    }
  }
  document
    .getElementById("event")
    .getElementsByTagName("img")[0]
    .setAttribute("id", identifier);
}

function checkOverlappingEvents() {
  const keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    if (document.getElementById(keys[i])) {
      let elementToCheck = document
        .getElementById(keys[i])
        .getBoundingClientRect();
      //console.log(keys[i], " tarpas ", elementToCheck);
      for (let j = 0; j < keys.length - 1; j++) {
        //console.log(keys[i], keys[j]);
        if (keys[i] != keys[j] && document.getElementById(keys[j])) {
          let recBoundingOverlap = document
            .getElementById(keys[j])
            .getBoundingClientRect();
          if (
            elementToCheck.top < recBoundingOverlap.bottom &&
            elementToCheck.bottom > recBoundingOverlap.top &&
            elementToCheck.left < recBoundingOverlap.right &&
            elementToCheck.right > recBoundingOverlap.left
          ) {
            if (
              !document
                .getElementById(keys[j])
                .classList.contains("overlappingEvent") &&
              !document
                .getElementById(keys[j])
                .classList.contains("overlapped") &&
              elementToCheck.bottom - elementToCheck.top >
                recBoundingOverlap.bottom - recBoundingOverlap.top
            ) {
              document
                .getElementById(keys[j])
                .classList.add("overlappingEvent");
              document.getElementById([keys[i]]).classList.add("overlapped");
            } else if (
              elementToCheck.bottom - elementToCheck.top <
              recBoundingOverlap.bottom - recBoundingOverlap.top
            ) {
              document
                .getElementById(keys[i])
                .classList.add("overlappingEvent");
              document.getElementById([keys[j]]).classList.add("overlapped");
            }
          }
        }
      }
    }
  }
}
const monthsShort = [
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
const monthsLong = [
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
const formInputFieldList = [
  "title",
  "startTime",
  "startDate",
  "endTime",
  "endDate",
  "guests",
  "location",
  "description",
];
const toggleChevron = ["./media/chevron_right.svg", "./media/chevron_left.svg"];
function createDOMElement(type, classes, text) {
  const newItem = document.createElement(type);
  classes.forEach((itemClass) => {
    newItem.classList.add(itemClass);
  });
  if (text) {
    newItem.innerText = text;
  }
  return newItem;
}
function renderCalendar() {
  const table = document.getElementById("calendarContainer");
  const tableBody = table.createTBody();

  for (let i = 0; i < 6; i++) {
    const calendarRow = createDOMElement("tr", ["calendarRow"]);
    for (let j = 0; j < 7; j++) {
      let dayCell = createDOMElement("td", ["calendarCell"]);
      dayCell.setAttribute("id", "calendar" + i + j);

      calendarRow.appendChild(dayCell);
    }
    tableBody.appendChild(calendarRow);
  }
}
function renderTable() {
  const tableBody = document
    .getElementById("weekGrid")
    .getElementsByTagName("tbody")[0];

  for (let i = 1; i <= 24; i++) {
    const tableRow = createDOMElement("tr", ["weekViewGridRow"]);

    const getDateTimeText = (hour) => {
      switch (true) {
        case hour < 12:
          return hour + " AM";
        case hour == 12:
          return hour + " PM";
        case hour < 24:
          return hour - 12 + " PM";
      }
    };

    const dayTimeCell = createDOMElement(
      "td",
      ["weekViewGridBox", "timeColumn"],
      getDateTimeText(i)
    );

    tableRow.appendChild(dayTimeCell);
    const gap = createDOMElement("td", ["weekViewGridBoxLeftMost"]);
    tableRow.appendChild(gap);

    for (let j = 0; j < 7; j++) {
      const tableCell = createDOMElement("td", ["weekViewGridBox"]);
      tableCell.setAttribute("id", j + "_" + i);
      tableRow.appendChild(tableCell);
    }
    tableBody.appendChild(tableRow);
  }
}
function getGMT() {
  let timezone = new Date().getTimezoneOffset() / 60;
  const sign = timezone == 0 ? "" : timezone > 0 ? "-" : "+";
  if (timezone < 10 && timezone > -10) {
    timezone = "0" + Math.abs(timezone);
  }
  return `GMT ${sign}${timezone}`;
}
function setupPanelTriggers() {
  const closeSidePanel = document.getElementById("closeSidePanel");
  const calendarSidePanel = document.getElementById("calendarSideView");
  const rightSidePanel = document.getElementById("rightSidePanel");
  const rightPanelTrigger = document.getElementById("rightPanelChevron");

  closeSidePanel.addEventListener("click", () => {
    calendarSidePanel.classList.toggle("notDisplayed");
    adjustMainDisplay(calendarSidePanel, rightSidePanel);
  });

  rightPanelTrigger.addEventListener("click", () => {
    rightSidePanel.classList.toggle("notDisplayed");
    rightPanelTrigger.src = rightSidePanel.classList.contains("notDisplayed")
      ? toggleChevron[1]
      : toggleChevron[0];
    adjustMainDisplay(calendarSidePanel, rightSidePanel);
  });

  const adjustMainDisplay = (leftPanel, rightPanel) => {
    let leftSideWidth = leftPanel.classList.contains("notDisplayed")
      ? ""
      : "256px";
    let rightSideWidth = rightPanel.classList.contains("notDisplayed")
      ? ""
      : "56px";

    document.getElementById("content").style.gridTemplateColumns =
      leftSideWidth + " 1fr " + rightSideWidth;
  };
}
function createEventListeners() {
  const eventWindowButton = document.getElementById("eventWindowButton");
  eventWindowButton.addEventListener("click", () => {
    eventViewTrigger();
  });

  const timeframeSelectButton = document.getElementById(
    "timeframeSelectButton"
  );
  timeframeSelectButton.addEventListener("click", () => {
    displayDropdown("dropdownContent");
  });

  const settingsDropdown = document.getElementById("settings");
  settingsDropdown.addEventListener("click", () => {
    displayDropdown("dropdownSettings");
  });

  const settingsButton = document.getElementById("settingsButton");
  settingsButton.addEventListener("click", () => {
    console.log("setting, to be implemented, is triggered");
  });

  const eventSaveToStorage = document.getElementById("eventSaveButton");
  eventSaveToStorage.addEventListener("click", () => saveEvent(currentDate));

  const dialogCloseButton = document.getElementById("dialogCloseButton");
  dialogCloseButton.addEventListener("click", () => {
    resetEventCreationForm();
    eventViewTrigger();
  });

  const headerTodayButton = document.getElementById("headerTodayButton");
  headerTodayButton.addEventListener("click", () => {
    fillOutWeekDays(new Date(), 0);
    currentDate = new Date();
  });
}
function createWeekViewListeners(currentDate) {
  const nextTimeframe = document.getElementById("nextTimeframe");
  const previousTimeframe = document.getElementById("previousTimeframe");
  nextTimeframe.addEventListener("click", () => {
    fillOutWeekDays(currentDate, 7);
  });
  previousTimeframe.addEventListener("click", () => {
    fillOutWeekDays(currentDate, -7);
  });
}
function createCalendarListeners(currentDate) {
  const previousMonth = document.getElementById("previousMonth");
  const nextMonth = document.getElementById("nextMonth");

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

  const calendarTBody = document
    .getElementById("calendarContainer")
    .getElementsByTagName("tbody")[0];

  calendarTBody.addEventListener("click", (cell) => {
    let setWeek = new Date(cell.target.closest("td").getAttribute("id"));
    fillOutWeekDays(setWeek, 0);
    cell.target.classList.add("calendarCellHighlighted");
  });
}
// Currently de-scoped
function selection() {
  const settingsView = document.getElementById("settingsView");
  settingsView.classList.toggle("notDisplayed");
  settingsView.focus();
  document.getElementById("settingField").addEventListener("click", () => {
    displayDropdown("dropdownWeekDays");
  });
  document
    .getElementById("dropdownWeekDays")
    .addEventListener("click", (weekDay) => {}); // To be added, currently de-scoped
  document.getElementById("closeSettings").addEventListener("click", () => {
    settingsView.classList.toggle("notDisplayed");
    document
      .getElementById("dropdownSettings")
      .classList.toggle("notDisplayed");
  });
}
function eventViewTrigger() {
  resetEventCreationForm();
  document.getElementById("event").classList.toggle("notDisplayed");
  document.getElementById("title").focus();
}
function displayMonthName(currentDate) {
  const isPassingWeek = () => {
    const weekStartDate = new Date(currentDate);
    const weekEndDate = new Date(currentDate);

    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
    weekEndDate.setDate(weekEndDate.getDate() - weekEndDate.getDay() + 6);
    return weekStartDate.getDate() > weekEndDate.getDate();
  };

  let headerDateDisplay = `${
    isPassingWeek()
      ? monthsShort[currentDate.getMonth()] +
        " - " +
        monthsShort[currentDate.getMonth() + 1]
      : monthsLong[currentDate.getMonth()]
  }, ${currentDate.getFullYear()}`;

  document.getElementById("monthDisplay").innerText = headerDateDisplay;
}
function displayCalendarMonth(currentDate) {
  document.getElementById("calendarMonthDisplay").innerText =
    monthsLong[currentDate.getMonth()] + ", " + currentDate.getFullYear();
}
function displayDropdown(dropdown) {
  document.getElementById(dropdown).classList.toggle("notDisplayed");
  document.getElementById(dropdown).focus();
}
function resetEventCreationForm() {
  formInputFieldList.forEach((elem) => {
    document.getElementById(elem).value = "";
  });
  document
    .getElementById("event")
    .getElementsByTagName("img")[0]
    .removeAttribute("id");
}
/* TYPESCRIPT TODO:

1.  TRANSPILE AS IS
2.  TYPES FOR PRIMITIVES
3.  CUSTOM TYPES
4.  ENUMS
5.  JSON SERVER
*/
