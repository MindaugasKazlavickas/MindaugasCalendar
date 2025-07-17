document.addEventListener("DOMContentLoaded", () => {
  const currentDay = new Date();

  const calendarSideView = document.getElementById("calendarSideView");
  const weekView = document.getElementById("content");
  const closeCalendarButton = document.getElementById("closeCalendarButton");

  /*
  adjustDisplay("rightSideView");

  if (calendarSideView.style.display === "none") {
      weekView.style.gridTemplateColumns = "256px 1fr 56px";
      calendarSideView.style.display = "block";
    } else {
      weekView.style.gridTemplateColumns = "1fr 56px";
      calendarSideView.style.display = "none";
    }
  */
  const eventWindowButton = document.getElementById("eventWindowButton");
  eventWindowButton.addEventListener("click", () => {
    document.getElementById("event").style.display = "grid";
  });

  document.getElementById("logoText").innerText = currentDay.getDate();

  const headerDateDisplay =
    monthsLong[currentDay.getMonth()] + ", " + currentDay.getFullYear();
  document.getElementById("monthDisplay").innerText = headerDateDisplay;
  document.getElementById("calendarMonthDisplay").innerText = headerDateDisplay;

  document.getElementById("timezone").innerText = setTimezone();

  displayTable();

  /* CURRENTLY ONLY FOR CURRENT WEEK */
  fillOutWeekDays(currentDay);
  fillOutMonthDays(currentDay);

  const eventSaveToStorage = document.getElementById("eventSaveButton");
  eventSaveToStorage.addEventListener("click", () => saveEvent());

  const dialogCloseButton = document.getElementById("dialogCloseButton");
  dialogCloseButton.addEventListener("click", () => resetEventCreationForm());

  let righSideMenuButton = document.getElementById("rightSideButtonChevron");

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
    console.log(
      righSideMenuButton.src.substr(righSideMenuButton.src.lastIndexOf("/"))
    );
    righSideMenuButton.src =
      righSideMenuButton.src.substr(righSideMenuButton.src.lastIndexOf("/")) ==
      "/chevron_right.svg"
        ? "./media/chevron_left.svg"
        : "./media/chevron_right.svg";
    console.log(righSideMenuButton.src);
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

  //displayEvents();
});

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

function fillOutWeekDays(currentDay) {
  let startOfWeek = currentDay.getDate() - currentDay.getDay();

  for (let i = 0; i < 7; i++) {
    document.getElementById(weekViewDisplayDates[i]).innerText =
      startOfWeek + i;
  }

  document
    .getElementById(weekViewDisplayDates[currentDay.getDay()])
    .parentElement.classList.add("weekViewGridHeaderMarked");
}

function fillOutMonthDays(currentDay) {
  const parentContainer = document.getElementById("calendarContainer");
  const saveDate = new Date(currentDay);
  let workingDate = new Date(currentDay.setDate(1));
  let valueDiff = -currentDay.getDay() + 1;
  workingDate.setDate(valueDiff);
  valueDiff = workingDate.getDate();
  let workingMonth = workingDate.getMonth();

  for (let i = 0; i < 6; i++) {
    const calendarRow = createDOMElement("div", ["calendarDayRow"]);
    for (let j = 0; j < 7; j++) {
      let dayElement = createDOMElement(
        "span",
        ["calendarDayRowElement"],
        workingDate.getDate()
      );

      if (workingDate.getDate() == saveDate.getDate()) {
        dayElement.classList.add("calendarDayRowElementSelected");
      }

      if (workingDate.getMonth() > workingMonth) {
        valueDiff = 1;
        workingMonth++;
      }

      valueDiff++;
      workingDate.setDate(valueDiff);
      calendarRow.appendChild(dayElement);
    }
    parentContainer.appendChild(calendarRow);
  }
}

function saveEvent() {
  const eventIdentifier = "event " + Date.now();

  formInputFieldList.forEach((elem) => {
    elem = document.getElementById(elem).value;
    console.log(elem.value);
  });
  if (formInputFieldList.title) {
    alert("Title is mandatory.");
    return;
  } else if (
    formInputFieldList.startDate ||
    formInputFieldList.endDate ||
    formInputFieldList.startTime ||
    formInputFieldList.endTime
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
function displayEvents() {
  let testItem = JSON.parse(localStorage.getItem("event"));
  let keys = Object.keys(localStorage);

  for (let i = 0; i < keys.length; i++) {
    console.log(keys[i]);
    let event = JSON.parse(localStorage.getItem(keys[i]));
    let startDate = new Date(event.startDate);
    let endDate = new Date(event.endDate);
    let startTime = event.startTime;
    let endTime = event.endTime;
    let diff =
      (+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 +
      (+endTime.substr(3, 2) - +startTime.substr(3, 2));
    if (endDate.getDate() - startDate.getDate() == 0 && diff < 3600) {
      console.log("Same day event: " + keys[i] + " " + diff);
    }
  }
  let startTime = testItem.startTime;
  let endTime = testItem.endTime;
  let startDate = new Date(testItem.startDate);
  let endDate = new Date(testItem.endDate);
  let item = document.createElement("div");
  item.classList.add("meetingExample");
  item.setAttribute("id", "eventas");
  let height =
    ((+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 +
      (+endTime.substr(3, 2) - +startTime.substr(3, 2))) /
    1.25;
  item.innerText = startTime + "-" + endTime + " " + testItem.title;
  item.style.height = height + "px";
  let target = document.getElementById(
    startDate.getDay() + "_" + startTime.substr(0, 2)
  );
  target.style.overflow = "visible";
  target.style.position = "relative";
  target.appendChild(item);
}
