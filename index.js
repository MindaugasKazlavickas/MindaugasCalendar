document.addEventListener("DOMContentLoaded", () => {
  const currentDay = new Date();

  const calendarSideView = document.getElementById("calendarSideView");
  const weekView = document.getElementById("content");
  const closeCalendarButton = document.getElementById("closeCalendarButton");

  const eventWindowButton = document.getElementById("eventWindowButton");
  eventWindowButton.addEventListener("click", () => {
    document.getElementById("event").style.display = "grid";
  });

  document.getElementById("logoText").innerText = currentDay.getDate();

  displayMonthName(currentDay);

  document.getElementById("timezone").innerText = setTimezone();

  const weekViewSelectorButton = document.getElementById("viewSelectionButton");
  weekDropdown.addEventListener("click", () => {
    displayDropdown();
  });
  displayTable();

  createCalendar();
  fillOutWeekDays(currentDay, "initial");

  const calendarLeftButton = document.getElementById("calendarLeftButton");
  const calendarRightButton = document.getElementById("calendarRightButton");
  let workingDate = new Date(currentDay);

  calendarLeftButton.addEventListener("click", () => {
    workingDate.setMonth(workingDate.getMonth() - 1);
    fillOutMonthDays(workingDate);
  });
  calendarRightButton.addEventListener("click", () => {
    workingDate.setMonth(workingDate.getMonth() + 1);
    fillOutMonthDays(workingDate);
  });

  calendarLeftButton;
  const eventSaveToStorage = document.getElementById("eventSaveButton");
  eventSaveToStorage.addEventListener("click", () => saveEvent());

  const dialogCloseButton = document.getElementById("dialogCloseButton");
  dialogCloseButton.addEventListener("click", () => resetEventCreationForm());

  const righSideMenuButton = document.getElementById("rightSideButtonChevron");
  const rightSideMenuButtonContainer = document.getElementById(
    "rightSideMenuButtonContainer"
  );
  righSideMenuButton.addEventListener("click", () => {
    let y = document
      .getElementById("rightSideView")
      .classList.contains("notDisplayed")
      ? " 56px"
      : "";
    let x = document
      .getElementById("calendarSideView")
      .classList.contains("notDisplayed")
      ? ""
      : "256px ";
    adjustDisplay("rightSideView", x, y);

    if (
      righSideMenuButton.src.substr(righSideMenuButton.src.lastIndexOf("/")) ==
      "/chevron_right.svg"
    ) {
      righSideMenuButton.src = "./media/chevron_left.svg";
      rightSideMenuButtonContainer.classList.add("rightSideMenuClosed");
    } else {
      righSideMenuButton.src = "./media/chevron_right.svg";
      rightSideMenuButtonContainer.classList.remove("rightSideMenuClosed");
    }
  });

  closeCalendarButton.addEventListener("click", () => {
    let y = document
      .getElementById("rightSideView")
      .classList.contains("notDisplayed")
      ? ""
      : " 56px";
    let x = document
      .getElementById("calendarSideView")
      .classList.contains("notDisplayed")
      ? "256px "
      : "";
    adjustDisplay("calendarSideView", x, y);
  });
  //let workingDate = new Date();
  const weekRightButton = document.getElementById("weekRightButton");
  const weekLeftButton = document.getElementById("weekLeftButton");
  weekRightButton.addEventListener("click", () => {
    fillOutWeekDays(currentDay, "right");
  });
  weekLeftButton.addEventListener("click", () => {
    fillOutWeekDays(currentDay, "left");
  });

  const headerTodayButton = document.getElementById("headerTodayButton");
  headerTodayButton.addEventListener("click", () => {
    fillOutWeekDays(currentDay, "");
  });

  const calendarContainer = document
    .getElementById("calendarContainer")
    .getElementsByTagName("tbody")[0];
  calendarContainer.addEventListener("click", (cell) => {
    let setWeek = new Date(
      cell.target.closest(".calendarDayRowElement").getAttribute("id")
    );
    fillOutWeekDays(setWeek);
  });
});

function displayMonthName(currentDay) {
  let headerDateDisplay;
  let checkDate = new Date(currentDay);
  if (
    checkDate.getDate(
      checkDate.setDate(currentDay.getDate() - currentDay.getDay())
    ) >
    checkDate.getDate(
      checkDate.setDate(currentDay.getDate() - currentDay.getDay() + 6)
    )
  ) {
    headerDateDisplay =
      monthsShort[currentDay.getMonth()] +
      " - " +
      monthsShort[currentDay.getMonth() + 1] +
      ", " +
      currentDay.getFullYear();
    document.getElementById("monthDisplay").innerText = headerDateDisplay;
    document.getElementById("calendarMonthDisplay").innerText =
      monthsLong[currentDay.getMonth()] + ", " + currentDay.getFullYear();
  } else {
    headerDateDisplay =
      monthsLong[currentDay.getMonth()] + ", " + currentDay.getFullYear();
    document.getElementById("monthDisplay").innerText = headerDateDisplay;
    document.getElementById("calendarMonthDisplay").innerText =
      headerDateDisplay;
  }
}

function displayDropdown() {
  let element = document.getElementById("dropdownContent");
  if (element.classList.contains("displayedFlex")) {
    element.classList.remove("displayedFlex");
  } else {
    element.classList.add("displayedFlex");
  }
}

function fillOutWeekDays(workingDate, direction) {
  let date;
  if (direction === "") {
    workingDate = new Date();
  }
  if (direction === "right") {
    workingDate.setDate(workingDate.getDate() + 7);
  } else if (direction === "left") {
    workingDate.setDate(workingDate.getDate() - 7);
  }

  displayMonthName(workingDate);
  fillOutMonthDays(workingDate);

  date = new Date(workingDate);
  date.setDate(date.getDate() - date.getDay());
  for (let i = 0; i < 7; i++) {
    document.getElementById(weekViewDisplayDates[i]).innerText = date.getDate();

    date.setDate(date.getDate() + 1);
  }

  clearEvents();
  displayEvents(workingDate);

  let todayDate = new Date();
  if (direction === "" || direction === "initial") {
    workingDate = new Date(todayDate);
    document
      .getElementById(weekViewDisplayDates[todayDate.getDay()])
      .parentElement.classList.add("weekViewGridHeaderMarked");
  } else {
    document
      .getElementById(weekViewDisplayDates[todayDate.getDay()])
      .parentElement.classList.remove("weekViewGridHeaderMarked");
  }
}

function adjustDisplay(elementToHide, x, y) {
  let element = document.getElementById(elementToHide);

  let sideAdjuster;
  if (elementToHide != "calendarSideView") {
    sideAdjuster = "displayedInlineFlex";
  } else {
    sideAdjuster = "displayedBlock";
  }
  if (element.classList.contains("notDisplayed")) {
    element.classList.add(sideAdjuster);
    element.classList.remove("notDisplayed");
  } else {
    element.classList.add("notDisplayed");
    element.classList.remove(sideAdjuster);
  }
  document.getElementById("content").style.gridTemplateColumns = x + "1fr" + y;
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
const weekViewDisplayDates = [
  "weekDisplayDate1",
  "weekDisplayDate2",
  "weekDisplayDate3",
  "weekDisplayDate4",
  "weekDisplayDate5",
  "weekDisplayDate6",
  "weekDisplayDate7",
];
const formInputFieldList = [
  "title",
  "startTime",
  "startDate",
  "endTime",
  "endDate",
  "eventGuests",
  "eventLocation",
  "eventDescription",
];
const shortWeekdayNames = ["S", "M", "T", "W", "T", "F", "S"];
function createDOMElement(type, classes, text) {
  const newElement = document.createElement(type);
  if (classes != "") {
    classes.forEach((elem) => {
      newElement.classList.add(elem);
    });
  }
  if (text) {
    newElement.innerText = text;
  }
  return newElement;
}

function createCalendar() {
  const tableContainer = document.getElementById("calendarContainer");
  const parentContainer = tableContainer.createTBody();

  for (let i = 0; i < 6; i++) {
    const calendarRow = createDOMElement("tr", ["calendarDayRow"]);
    for (let j = 0; j < 7; j++) {
      let dayElement = createDOMElement("td", ["calendarDayRowElement"]);
      dayElement.setAttribute("id", "calendar" + i + j);

      calendarRow.appendChild(dayElement);
    }
    parentContainer.appendChild(calendarRow);
  }
}

function fillOutMonthDays(currentDay) {
  const date = new Date(currentDay);
  date.setDate(1);
  let startDate = date.getDate() - date.getDay();
  date.setDate(startDate);
  let parentContainer = document
    .getElementById("calendarContainer")
    .getElementsByTagName("tbody")[0];
  for (let i = 0; i < 6; i++) {
    let row = parentContainer.getElementsByClassName("calendarDayRow")[i];
    for (let j = 0; j < 7; j++) {
      let dayElement = row.getElementsByClassName("calendarDayRowElement")[j];
      dayElement.innerText = date.getDate();
      dayElement.removeAttribute("id");
      dayElement.setAttribute("id", date);
      if (
        date.getDate() == new Date().getDate() &&
        date.getMonth() == new Date().getMonth()
      ) {
        dayElement.classList.add("calendarDayRowElementSelected");
      } else if (date.getMonth() != new Date().getMonth()) {
        dayElement.classList.remove("calendarDayRowElementSelected");
      }
      if (
        date.getDay() == new Date().getDay() &&
        date.getDate() >= currentDay.getDate() &&
        date.getDate() <= currentDay.getDate() + 6 &&
        date.getDate() != currentDay.getDate() &&
        date.getDate() == currentDay.getDate() + date.getDay() &&
        date.getMonth() == currentDay.getMonth()
      ) {
        dayElement.classList.add("calendarDayRowElementHighlighted");
      } else {
        dayElement.classList.remove("calendarDayRowElementHighlighted");
      }
      date.setDate(date.getDate() + 1);
    }
  }
}

function saveEvent() {
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

    guests: document.getElementById("eventGuests").value,
    location: document.getElementById("eventLocation").value,
    description: document.getElementById("eventDescription").value,
  };

  localStorage.setItem(eventIdentifier, JSON.stringify(newEvent));
  alert(localStorage.getItem(eventIdentifier, newEvent.location));
}

function resetEventCreationForm() {
  formInputFieldList.forEach((elem) => {
    document.getElementById(elem).value = "";
  });
  document.getElementById("event").style.display = "none";
}

function displayTable() {
  const parentElement = document
    .getElementById("weekGrid")
    .getElementsByTagName("tbody")[0];

  for (let i = 0; i < 24; i++) {
    const tableRow = createDOMElement("tr", ["weekViewGridRow"]);
    let dayTimeText;
    if (i == 11) {
      dayTimeText = i + 1 + " PM";
    } else if (i == 23) {
      dayTimeText = "";
    } else if (i < 12) {
      dayTimeText = i + 1 + " AM";
    } else {
      dayTimeText = i + 1 - 12 + " PM";
    }
    const dayTime = createDOMElement(
      "td",
      ["weekViewGridBox", "timeColumn"],
      dayTimeText
    );
    tableRow.appendChild(dayTime);
    const gap = createDOMElement("td", ["weekViewGridBoxLeftMost"]);
    tableRow.appendChild(gap);
    for (let j = 0; j < 7; j++) {
      const tableElement = createDOMElement("td", ["weekViewGridBox"]);
      tableElement.setAttribute("id", j + "_" + i);
      tableRow.appendChild(tableElement);
    }
    parentElement.appendChild(tableRow);
  }
}

function setTimezone() {
  let timezone = Math.abs(new Date().getTimezoneOffset()) / 60;
  if (timezone < 10) {
    timezone = "0" + timezone;
  }
  const sign = timezone > 0 ? "+" : "-";

  if (timezone === 0) {
    return "GMT";
  } else {
    return `GMT ${sign}${timezone}`;
  }
}

/* TODO

    Event starts on day n and end on day n+1 but event time is <24h
    Event lasts longer than 2 days
    Events overlap
    Event is very short -> adjust displayed long text
    Get all events in storage
    Atidaryti "event viewer" ir atnaujinti info
*/
function displayEvents(currentDay) {
  const keys = Object.keys(localStorage);
  let startOfWeekTime = new Date(
    currentDay.setDate(currentDay.getDate() - currentDay.getDay())
  );
  startOfWeekTime.setHours(0);
  startOfWeekTime.setMinutes(0);
  startOfWeekTime.setSeconds(0);
  let endOfWeekTime = new Date(startOfWeekTime);
  endOfWeekTime.setDate(startOfWeekTime.getDate() + 7);

  for (let i = 0; i < keys.length; i++) {
    let event = JSON.parse(localStorage.getItem(keys[i]));
    let startDate = new Date(event.startDate);
    let endDate = new Date(event.endDate);
    let startTime = event.startTime;
    let endTime = event.endTime;
    let diff;
    if (startDate > startOfWeekTime && endDate < endOfWeekTime) {
      if (startDate == endDate) {
        diff =
          (+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 +
          (+endTime.substr(3, 2) - +startTime.substr(3, 2));
      } else if (endDate.getDate() > startDate.getDate()) {
        let dateDiff = endDate.getDate() - startDate.getDate();
        //console.log(startDate, endDate);
        //console.log("Date difference is: " + dateDiff);
        diff =
          (+endTime.substr(0, 2) + -+startTime.substr(0, 2) + 24 * dateDiff) *
            60 +
          (+endTime.substr(3, 2) - +startTime.substr(3, 2));
        //console.log(diff);
      } else {
        let dateDiff = startDate.getDate() - endDate.getDate();
        //console.log(startDate, endDate);
        //console.log("Date difference is: " + dateDiff);
        diff =
          (+endTime.substr(0, 2) + -+startTime.substr(0, 2) + 24 * dateDiff) *
            60 +
          (+endTime.substr(3, 2) - +startTime.substr(3, 2));
        //console.log(diff);
      }

      if (endDate.getDate() - startDate.getDate() == 0 && diff < 1440) {
        console.log("Same day event: " + keys[i] + " " + diff);
        sameDayEventRender(keys[i], diff / 1.25);
      } else if (endDate.getDate() - startDate.getDate() < 2 && diff < 1440) {
        //console.log("Less than 24h event: " + keys[i] + " " + diff);
      } else {
        //console.log("Multi-day event: " + keys[i] + " " + diff);
      }
    }
    checkOverlappingEvents();
  }
}

function clearEvents() {
  const keys = Object.keys(localStorage);
  for (let i = 0; i < keys.length; i++) {
    let element = document.getElementById(keys[i]);
    if (element != null) {
      element.remove();
    }
  }
}

function sameDayEventRender(identifier, eventDuration) {
  const event = JSON.parse(localStorage.getItem(identifier));
  const startTime = event.startTime;
  const endTime = event.endTime;
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
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
          let checkElement = document
            .getElementById(keys[j])
            .getBoundingClientRect();
          if (
            elementToCheck.top < checkElement.bottom &&
            elementToCheck.bottom > checkElement.top &&
            elementToCheck.left < checkElement.right &&
            elementToCheck.right > checkElement.left
          ) {
            if (
              !document
                .getElementById(keys[j])
                .classList.contains("overlappingEvent") &&
              !document
                .getElementById(keys[j])
                .classList.contains("overlapped") &&
              elementToCheck.bottom - elementToCheck.top >
                checkElement.bottom - checkElement.top
            ) {
              document
                .getElementById(keys[j])
                .classList.add("overlappingEvent");
              document.getElementById([keys[i]]).classList.add("overlapped");
            } else if (
              elementToCheck.bottom - elementToCheck.top <
              checkElement.bottom - checkElement.top
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
