document.addEventListener("DOMContentLoaded", () => {
  // currentDate, not day
  const currentDay = new Date();

  // closeSidePanel?
  const closeCalendarButton = document.getElementById("closeCalendarButton");

  const eventWindowButton = document.getElementById("eventWindowButton");

  eventWindowButton.addEventListener("click", () => {
    openEventWindow();
  });

  // would collect statics that don't change and call them all under function.
  // imo on load u should:
  // get elements
  // assign event listeners
  // call functions that need to be called on load

  document.getElementById("logoText").innerText = currentDay.getDate();

  displayMonthName(currentDay);

  document.getElementById("timezone").innerText = setTimezone();

  // timeframeSelect
  const weekDropdown = document.getElementById("viewSelectionButton");
  weekDropdown.addEventListener("click", () => {
    //dropdownContent =
    document.getElementById("dropdownContent").focus();
    displayDropdown(); //(dropdownContent)
  });
  displayTable(); //renderTable()

  createCalendar(); //renderCalendar()

  let workingDate = new Date(currentDay); // would work with const aswell?
  fillOutWeekDays(workingDate, "initial");

  const calendarLeftButton = document.getElementById("calendarLeftButton");
  const calendarRightButton = document.getElementById("calendarRightButton");

  calendarLeftButton.addEventListener("click", () => {
    workingDate.setMonth(workingDate.getMonth() - 1);
    fillOutMonthDays(workingDate);
    displayMonthNameCalendar(workingDate);
  });
  calendarRightButton.addEventListener("click", () => {
    workingDate.setMonth(workingDate.getMonth() + 1);
    fillOutMonthDays(workingDate);
    displayMonthNameCalendar(workingDate);
  });

  calendarLeftButton; //????
  const eventSaveToStorage = document.getElementById("eventSaveButton");
  eventSaveToStorage.addEventListener("click", () => saveEvent());

  const dialogCloseButton = document.getElementById("dialogCloseButton");
  dialogCloseButton.addEventListener("click", () => {
    resetEventCreationForm();
    openEventWindow();
  });

  const righSideMenuButton = document.getElementById("rightSideButtonChevron"); // naming
  const rightSideMenuButtonContainer = document.getElementById(
    //naming
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
      "/chevron_right.svg" // could have attribute instead. for example data-isOpen = true/false
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

  const weekRightButton = document.getElementById("weekRightButton"); // naming
  const weekLeftButton = document.getElementById("weekLeftButton"); // naming
  weekRightButton.addEventListener("click", () => {
    fillOutWeekDays(workingDate, "right");
  });
  weekLeftButton.addEventListener("click", () => {
    fillOutWeekDays(workingDate, "left");
  });

  const headerTodayButton = document.getElementById("headerTodayButton");
  headerTodayButton.addEventListener("click", () => {
    fillOutWeekDays(new Date(), "");
    workingDate = new Date();
  });

  const calendarContainer = document
    .getElementById("calendarContainer")
    .getElementsByTagName("tbody")[0];

  calendarContainer.addEventListener("click", (cell) => {
    let setWeek = new Date(
      cell.target.closest(".calendarDayRowElement").getAttribute("id")
    );
    fillOutWeekDays(setWeek);
    cell.target.classList.add("calendarDayRowElementHighlighted");
  });
});

function openEventWindow() {
  // eventContainer
  let window = document.getElementById("event");
  // window.classList.toggle("notDisplayed");
  // eventContainer.getAttribute("data-isOpen")
  // isOpen ? eventContainer.focus() : eventWindowButton.focus()
  if (window.classList.contains("notDisplayed")) {
    window.classList.remove("notDisplayed");
    window.classList.add("displayedGrid");
    window.focus();
  } else {
    window.classList.add("notDisplayed");
    window.classList.remove("displayedGrid");
  }
}
function displayMonthName(currentDay) {
  // checkDate === currentDay??
  let checkDate = new Date(currentDay); // i don't get this

  const isPassingWeek = checkFunction();
  let headerDateDisplay = `${
    isPassingWeek
      ? monthsShort[currentDay.getMonth()] +
        " - " +
        monthsShort[currentDay.getMonth() + 1] +
        ", "
      : monthsLong[currentDay.getMonth()]
  }, ${currentDay.getFullYear()}`;

  const checkFunction = () => {
    const weekStartDate = new Date(currentDay);
    const weekEndDate = new Date(currentDay);
    weekStartDate.setDate(currentDay.getDate() - currentDay.getDay());
    weekEndDate.setDate(currentDay.getDate() - currentDay.getDay() + 6);
    return weekStartDate > weekEndDate;
  };

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
    // following code is duplicate, need to understand fnction first
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
function displayMonthNameCalendar(currentDay) {
  let headerDateDisplay;
  headerDateDisplay =
    monthsLong[currentDay.getMonth()] + ", " + currentDay.getFullYear();
  document.getElementById("calendarMonthDisplay").innerText = headerDateDisplay;
}
function displayDropdown() {
  let element = document.getElementById("dropdownContent");

  // classList.toggle()
  if (element.classList.contains("displayedFlex")) {
    element.classList.remove("displayedFlex");
  } else {
    element.classList.add("displayedFlex");
  }
}

// avoid direction (tied to week timeframe), use the power of Date object by providing an offset (number) and calculating the new date.
// this way you can reuse the code for both directions and different timeframes
function fillOutWeekDays(workingDate, direction) {
  // explain step by step
  let date;
  if (direction === "right") {
    workingDate.setDate(workingDate.getDate() + 7);
  } else if (direction === "left") {
    workingDate.setDate(workingDate.getDate() - 7);
  }
  displayMonthName(workingDate); // renderMainCalendar()
  fillOutMonthDays(workingDate); // renderSideCalendar()

  date = new Date(workingDate);
  date.setDate(date.getDate() - date.getDay());
  // should be a separate function
  for (let i = 0; i < 7; i++) {
    // confused, explain
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

// IMO you have 3 places which need render function (dynamic content): header, sideCalendar, mainCalendar.
// I would have a render function for each, then one function to render all of them on load.
// Right now your code is very coupled, which increases complexity and makes it harder to understand.

// when you have separate render functions, you can call them in event listeners as callbacks with different parameters.
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
  "guests",
  "location",
  "description",
];

function createDOMElement(type, classes, text) {
  const newElement = document.createElement(type);
  if (classes != "") {
    // or .className = classes.join(" ")
    classes.forEach((elem) => {
      newElement.classList.add(elem);
    });
  }
  if (text) {
    // could have node and innerHTML, as long as it is not user facing, this would be more reusable
    newElement.innerText = text;
  }
  return newElement;
}

function createCalendar() {
  const tableContainer = document.getElementById("calendarContainer"); // tableContainer means table would be inside. Now it is table itself
  const parentContainer = tableContainer.createTBody(); // cool, didn't know about this! naming: tableBody

  for (let i = 0; i < 6; i++) {
    const calendarRow = createDOMElement("tr", ["calendarDayRow"]);
    for (let j = 0; j < 7; j++) {
      let dayElement = createDOMElement("td", ["calendarDayRowElement"]); // element -> cell. call things what they are
      dayElement.setAttribute("id", "calendar" + i + j);

      calendarRow.appendChild(dayElement);
    }
    parentContainer.appendChild(calendarRow);
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
  // would be better to save everything under array for example and under some key, EVENTS for ex.

  clearEvents();
  displayEvents();
}

function resetEventCreationForm() {
  formInputFieldList.forEach((elem) => {
    document.getElementById(elem).value = "";
  });
}

function displayTable() {
  //tableBody
  const parentElement = document
    .getElementById("weekGrid")
    .getElementsByTagName("tbody")[0];

  for (let i = 0; i < 24; i++) {
    // can start from i = 1, not add +1 every time
    const tableRow = createDOMElement("tr", ["weekViewGridRow"]);
    let dayTimeText; // = getDateTimeText(hour)
    if (i == 11) {
      // perfect example of a switch statement
      dayTimeText = i + 1 + " PM";
    } else if (i == 23) {
      dayTimeText = "";
    } else if (i < 12) {
      dayTimeText = i + 1 + " AM";
    } else {
      // we have 4 cases, but realistically there is am, pm, nothing
      dayTimeText = i + 1 - 12 + " PM";
    }
    const dayTime = createDOMElement(
      //dayTimeCell
      "td",
      ["weekViewGridBox", "timeColumn"],
      dayTimeText
    );
    tableRow.appendChild(dayTime);
    const gap = createDOMElement("td", ["weekViewGridBoxLeftMost"]); // weird approach, could be css
    tableRow.appendChild(gap);
    for (let j = 0; j < 7; j++) {
      const tableElement = createDOMElement("td", ["weekViewGridBox"]); // bad habit of addding ...Element, code intent, cell, button, input, etc.
      tableElement.setAttribute("id", j + "_" + i);
      tableRow.appendChild(tableElement);
    }
    parentElement.appendChild(tableRow);
  }
}

function setTimezone() {
  // not really a setter, getGMT would be more accurate
  let timezone = Math.abs(new Date().getTimezoneOffset()) / 60;
  if (timezone < 10) {
    timezone = "0" + timezone;
  }
  const sign = timezone > 0 ? "+" : "-"; // wouldn't math.abs always be positive?

  if (timezone === 0) {
    return "GMT";
  } else {
    return `GMT ${sign}${timezone}`;
  }
}

/* TODO
    Event starts on day n and end on day n+1 but event time is <24h
    Event lasts longer than 2 days
    Atidaryti "event viewer" ir atnaujinti info
*/
function displayEvents(currentDay) {
  // explain step by step
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
        //console.log("Same day event: " + keys[i] + " " + diff);
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
  // should render mainCalendar, check for events and render them
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
    openEditEventWindow(event);
  });
}

function openEditEventWindow(event) {
  openEventWindow();
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
    .setAttribute("id", event.identifier);
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
            elementToCheck.right > checkElement.left // instead of checkign DOM, you could check event array and check if they overlap by comparing dates
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
