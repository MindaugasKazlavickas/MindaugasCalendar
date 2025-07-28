document.addEventListener("DOMContentLoaded", function () {
    var currentDate = new Date();
    var dateInLogo = document.getElementById("logoText");
    if (dateInLogo) {
        dateInLogo.innerText = currentDate.getDate().toString();
    }
    displayMonthName(currentDate);
    var tableTimezone = document.getElementById("timezone");
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
function fillOutWeekDays(workingDate, offset) {
    var _a, _b, _c, _d;
    workingDate.setDate(workingDate.getDate() + offset);
    displayMonthName(workingDate);
    fillOutMonthDays(workingDate);
    var date = new Date(workingDate);
    date.setDate(date.getDate() - date.getDay());
    clearEvents();
    displayEvents(date);
    for (var i = 0; i < 7; i++) {
        var weekDate = (document.getElementById("weekDisplayDate" + i));
        weekDate.innerText = date.getDate().toString();
        date.setDate(date.getDate() + 1);
    }
    var todayDate = new Date();
    if (offset === 0) {
        workingDate = new Date(todayDate);
        (_b = (_a = document
            .getElementById("weekDisplayDate" + [todayDate.getDay()])) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.classList.add("weekViewGridHeaderMarked");
    }
    else {
        (_d = (_c = document
            .getElementById("weekDisplayDate" + [todayDate.getDay()])) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.classList.remove("weekViewGridHeaderMarked");
    }
}
function fillOutMonthDays(currentDate) {
    var workingDate = new Date(currentDate);
    workingDate.setDate(1);
    var startDate = workingDate.getDate() - workingDate.getDay();
    workingDate.setDate(startDate);
    var calendarTable = (document.getElementById("calendarTable"));
    var calendarTBody = (calendarTable.getElementsByTagName("tbody")[0]);
    for (var i = 0; i < 6; i++) {
        var calendarRow = (calendarTBody.getElementsByClassName("calendarRow")[i]);
        for (var j = 0; j < 7; j++) {
            var dayCell = (calendarRow.getElementsByClassName("calendarCell")[j]);
            dayCell.innerText = workingDate.getDate().toString();
            dayCell.removeAttribute("id");
            dayCell.setAttribute("id", workingDate.toString());
            var isTodayDate = function () {
                return (workingDate.getDate() == new Date().getDate() &&
                    workingDate.getMonth() == new Date().getMonth());
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
            }
            else if (workingDate.getMonth() != new Date().getMonth()) {
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
function saveEvent(currentDate) {
    var eventIdentifier = "event " + Date.now();
    var newEvent;
    var inputStartDate = document.getElementById("startDate");
    var inputEndDate = document.getElementById("endDate");
    var inputStartTime = document.getElementById("startTime");
    var inputEndTime = document.getElementById("endTime");
    var inputTitle = document.getElementById("title");
    var inputGuests = document.getElementById("guests");
    var inputLocation = document.getElementById("location");
    var inputDescription = (document.getElementById("description"));
    var startDate = new Date(inputStartDate.value);
    var endDate = new Date(inputEndDate.value);
    var startTime = inputStartTime.value;
    var endTime = inputEndTime.value;
    var title = inputTitle.value;
    if (title == "") {
        alert("Title is mandatory.");
        return;
    }
    else if (startDate == null ||
        endDate == null ||
        startTime == null ||
        endTime == null) {
        alert("Make sure to enter start and end time and date.");
        return;
    }
    else if (startDate > endDate ||
        (startDate == endDate && startTime > endTime)) {
        alert("End time of event can not be before the start time.");
        return;
    }
    newEvent = {
        identifier: Date.now().toString(),
        title: title,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        guests: inputGuests.value,
        location: inputLocation.value,
        description: inputDescription.value,
    };
    // REWRITE LOCAL STORAGE JSON UNDER ARRAY
    var oldEventIdHolder = document.getElementById("event");
    var oldEventId = oldEventIdHolder
        ? oldEventIdHolder.getElementsByTagName("img")[0]
        : "";
    if (oldEventId !== "") {
        if (!oldEventId.getAttribute("id")) {
            localStorage.setItem(eventIdentifier, JSON.stringify(newEvent));
        }
        else {
            localStorage.removeItem(oldEventId.getAttribute("id"));
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
function displayEvents(currentDate) {
    var keys = Object.keys(localStorage);
    var startOfWeekTime = new Date(currentDate);
    startOfWeekTime.setDate(startOfWeekTime.getDate() - startOfWeekTime.getDay());
    startOfWeekTime.setHours(0);
    startOfWeekTime.setMinutes(0);
    startOfWeekTime.setSeconds(0);
    var endOfWeekTime = new Date(startOfWeekTime);
    endOfWeekTime.setDate(startOfWeekTime.getDate() + 6);
    var _loop_1 = function (i) {
        var event_1 = JSON.parse(localStorage.getItem(keys[i]));
        var startDate = new Date(event_1.startDate);
        var endDate = new Date(event_1.endDate);
        var startTime = event_1.startTime;
        var endTime = event_1.endTime;
        var eventDuration = void 0;
        var minToPxRatio = 1.25;
        var isSameDayEvent = function () {
            return startDate.getDate() === endDate.getDate();
        };
        var isLessThan24Hours = function () {
            return (endDate.getDate() > startDate.getDate() ||
                (endDate.getDate() < startDate.getDate() &&
                    endDate.getMonth() > startDate.getMonth()));
        };
        var isEventThisWeek = function () {
            return (startDate.getDate() >= startOfWeekTime.getDate() &&
                endDate.getDate() < endOfWeekTime.getDate() &&
                startDate.getMonth() == startOfWeekTime.getMonth());
        };
        if (isEventThisWeek()) {
            eventDuration =
                (+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 +
                    (+endTime.substr(3, 2) - +startTime.substr(3, 2));
            if (isSameDayEvent()) {
                eventDuration = eventDuration / minToPxRatio;
                sameDayEventRender(keys[i], eventDuration);
            }
            else if (isLessThan24Hours()) {
                eventDuration = (eventDuration + 24 * 60) / minToPxRatio;
                // spanning two days but less than 24h event render func
            }
        }
        else {
            // multiDayEventRender(keys[i], startDate, endDate);
        }
        checkOverlappingEvents();
    };
    for (var i = 0; i < keys.length; i++) {
        _loop_1(i);
    }
}
// ^^^^
function clearEvents() {
    var keys = Object.keys(localStorage);
    for (var i = 0; i < keys.length; i++) {
        var displayedEvent = document.getElementById(keys[i]);
        if (displayedEvent != null) {
            displayedEvent.remove();
        }
    }
}
// ^^^^
function sameDayEventRender(identifier, eventDuration) {
    var event = JSON.parse(localStorage.getItem(identifier));
    var startTime = event.startTime;
    var endTime = event.endTime;
    var startDate = new Date(event.startDate);
    var item = createDOMElement("div", ["meeting"], "");
    item.setAttribute("id", identifier);
    item.innerText = startTime + "-" + endTime + " " + event.title;
    item.style.height = eventDuration + "px";
    var timeCheck = +startTime.substr(0, 2) > 9
        ? startTime.substr(0, 2)
        : startTime.substr(1, 1);
    var target = (document.getElementById(startDate.getDay() + "_" + timeCheck));
    target.style.overflow = "visible";
    target.style.position = "relative";
    target.appendChild(item);
    item.addEventListener("click", function () {
        openEditEventWindow(event, identifier);
    });
}
// ^^^^
function openEditEventWindow(event, identifier) {
    var _a;
    eventViewTrigger();
    for (var i = 0; i < formInputFieldList.length; i++) {
        if (event[formInputFieldList[i]]) {
            var inputField = (document.getElementById(formInputFieldList[i]));
            if (formInputFieldList[i] == "startDate" ||
                formInputFieldList[i] == "endDate") {
                inputField.value = event[formInputFieldList[i]].substr(0, 10);
            }
            else {
                inputField.value = event[formInputFieldList[i]];
            }
        }
    }
    var idImgHolder = (_a = document
        .getElementById("event")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("img")[0];
    idImgHolder === null || idImgHolder === void 0 ? void 0 : idImgHolder.setAttribute("id", identifier);
}
function checkOverlappingEvents() {
    var _a, _b, _c, _d, _e, _f;
    var keys = Object.keys(localStorage);
    var _loop_2 = function (i) {
        if (document.getElementById(keys[i])) {
            var primaryRect_1 = ((_a = document.getElementById(keys[i])) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect());
            var _loop_3 = function (j) {
                if (keys[i] != keys[j] && document.getElementById(keys[j])) {
                    var secondaryRect_1 = ((_b = document.getElementById(keys[j])) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect());
                    var isLonger = function () {
                        return (primaryRect_1.bottom - primaryRect_1.top >
                            secondaryRect_1.bottom - secondaryRect_1.top);
                    };
                    var isOverlapApplied = function () {
                        var event = document.getElementById(keys[j]);
                        return (!event.classList.contains("overlappingShorterEvent") &&
                            !event.classList.contains("overlapped"));
                    };
                    if (primaryRect_1.top < secondaryRect_1.bottom &&
                        primaryRect_1.bottom > secondaryRect_1.top) {
                        if (isLonger() && isOverlapApplied()) {
                            (_c = document
                                .getElementById(keys[j])) === null || _c === void 0 ? void 0 : _c.classList.add("overlappingShorterEvent");
                            (_d = document.getElementById(keys[i])) === null || _d === void 0 ? void 0 : _d.classList.add("overlapped");
                        }
                        else if (primaryRect_1.bottom - primaryRect_1.top <
                            secondaryRect_1.bottom - secondaryRect_1.top) {
                            (_e = document
                                .getElementById(keys[i])) === null || _e === void 0 ? void 0 : _e.classList.add("overlappingEvent");
                            (_f = document.getElementById(keys[j])) === null || _f === void 0 ? void 0 : _f.classList.add("overlapped");
                        }
                    }
                }
            };
            for (var j = 0; j < keys.length - 1; j++) {
                _loop_3(j);
            }
        }
    };
    for (var i = 0; i < keys.length; i++) {
        _loop_2(i);
    }
}
var monthsShort = [
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
var monthsLong = [
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
var formInputFieldList = [
    "title",
    "startTime",
    "startDate",
    "endTime",
    "endDate",
    "guests",
    "location",
    "description",
];
var toggleChevron = [
    "./media/chevron_right.svg",
    "./media/chevron_left.svg",
];
function createDOMElement(type, classes, text) {
    var newItem = document.createElement(type);
    if (typeof classes === "string") {
        newItem.classList.add(classes);
    }
    else if (classes) {
        classes.forEach(function (itemClass) {
            newItem.classList.add(itemClass);
        });
    }
    if (text) {
        newItem.innerText = text;
    }
    return newItem;
}
function renderCalendar() {
    var table = document.getElementById("calendarTable");
    var tableBody = table.createTBody();
    for (var i = 0; i < 6; i++) {
        var calendarRow = (createDOMElement("tr", ["calendarRow"]));
        for (var j = 0; j < 7; j++) {
            var dayCell = (createDOMElement("td", ["calendarCell"]));
            dayCell.setAttribute("id", "calendar" + i + j);
            calendarRow.appendChild(dayCell);
        }
        tableBody.appendChild(calendarRow);
    }
}
function renderTable() {
    var table = document.getElementById("weekGrid");
    var tableBody = (table.getElementsByTagName("tbody")[0]);
    for (var i = 1; i <= 24; i++) {
        var tableRow = (createDOMElement("tr", ["weekViewGridRow"]));
        var getDateTimeText = function (hour) {
            switch (true) {
                case hour < 12:
                    return "".concat(hour, " AM");
                case hour == 12:
                    return "".concat(hour, " PM");
                case hour < 24:
                    return "".concat(hour - 12, " PM");
                default:
                    return "";
            }
        };
        var dayTimeCell = (createDOMElement("td", ["weekViewGridBox", "timeColumn"], getDateTimeText(i)));
        tableRow.appendChild(dayTimeCell);
        var gap = (createDOMElement("td", ["weekViewGridBoxLeftMost"]));
        tableRow.appendChild(gap);
        for (var j = 0; j < 7; j++) {
            var tableCell = (createDOMElement("td", ["weekViewGridBox"]));
            tableCell.setAttribute("id", j + "_" + i);
            tableRow.appendChild(tableCell);
        }
        tableBody.appendChild(tableRow);
    }
}
function getGMT() {
    var timezone = new Date().getTimezoneOffset() / 60;
    var sign = timezone == 0 ? "" : timezone > 0 ? "-" : "+";
    var addZero;
    timezone = Math.abs(timezone);
    if (timezone < 10 && timezone > -10) {
        addZero = "0" + timezone;
    }
    return "GMT ".concat(sign).concat(addZero ? addZero : timezone);
}
function setupPanelTriggers() {
    var closeSidePanel = document.getElementById("closeSidePanel");
    var calendarSidePanel = (document.getElementById("calendarSideView"));
    var rightSidePanel = document.getElementById("rightSidePanel");
    var rightPanelTrigger = (document.getElementById("rightPanelChevron"));
    closeSidePanel.addEventListener("click", function () {
        calendarSidePanel.classList.toggle("notDisplayed");
        adjustMainDisplay(calendarSidePanel, rightSidePanel);
    });
    rightPanelTrigger.addEventListener("click", function () {
        rightSidePanel.classList.toggle("notDisplayed");
        rightPanelTrigger.src = rightSidePanel.classList.contains("notDisplayed")
            ? toggleChevron[1]
            : toggleChevron[0];
        adjustMainDisplay(calendarSidePanel, rightSidePanel);
    });
    var adjustMainDisplay = function (leftPanel, rightPanel) {
        var leftSideWidth = leftPanel.classList.contains("notDisplayed")
            ? ""
            : "256px";
        var rightSideWidth = rightPanel.classList.contains("notDisplayed")
            ? ""
            : "56px";
        var contentGrid = document.getElementById("content");
        contentGrid.style.gridTemplateColumns =
            leftSideWidth + " 1fr " + rightSideWidth;
    };
}
function createEventListeners(currentDate) {
    var eventWindowButton = (document.getElementById("eventWindowButton"));
    eventWindowButton.addEventListener("click", function () {
        eventViewTrigger();
    });
    var timeframeSelectButton = (document.getElementById("timeframeSelectButton"));
    timeframeSelectButton.addEventListener("click", function () {
        displayDropdown("dropdownContent");
    });
    var settingsDropdown = (document.getElementById("settings"));
    settingsDropdown.addEventListener("click", function () {
        displayDropdown("dropdownSettings");
    });
    var settingsButton = (document.getElementById("settingsButton"));
    settingsButton.addEventListener("click", function () {
        console.log("setting, to be implemented, is triggered");
    });
    var eventSaveToStorage = (document.getElementById("eventSaveButton"));
    eventSaveToStorage.addEventListener("click", function () { return saveEvent(currentDate); });
    var dialogCloseButton = (document.getElementById("dialogCloseButton"));
    dialogCloseButton.addEventListener("click", function () {
        resetEventCreationForm();
        eventViewTrigger();
    });
    var headerTodayButton = (document.getElementById("headerTodayButton"));
    headerTodayButton.addEventListener("click", function () {
        fillOutWeekDays(new Date(), 0);
        currentDate = new Date();
    });
}
function createWeekViewListeners(currentDate) {
    var nextTimeframe = (document.getElementById("nextTimeframe"));
    var previousTimeframe = (document.getElementById("previousTimeframe"));
    nextTimeframe.addEventListener("click", function () {
        fillOutWeekDays(currentDate, 7);
    });
    previousTimeframe.addEventListener("click", function () {
        fillOutWeekDays(currentDate, -7);
    });
}
function createCalendarListeners(currentDate) {
    var previousMonth = (document.getElementById("previousMonth"));
    var nextMonth = document.getElementById("nextMonth");
    previousMonth.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        fillOutMonthDays(currentDate);
        displayCalendarMonth(currentDate);
    });
    nextMonth.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        fillOutMonthDays(currentDate);
        displayCalendarMonth(currentDate);
    });
    var calendarTable = document.getElementById("calendarTable");
    var calendarTBody = (calendarTable.getElementsByTagName("tbody")[0]);
    calendarTBody.addEventListener("click", function (cell) {
        var _a;
        var targetDate = cell.target;
        if (targetDate.closest("td")) {
            var dateId = (_a = targetDate.closest("td")) === null || _a === void 0 ? void 0 : _a.getAttribute("id");
            var setWeek = new Date(Date.parse(dateId));
            fillOutWeekDays(setWeek, 0);
            targetDate.classList.add("calendarCellHighlighted");
        }
    });
}
// Currently de-scoped
function selection() {
    var _a, _b, _c;
    var settingsView = document.getElementById("settingsView");
    settingsView.classList.toggle("notDisplayed");
    settingsView.focus();
    (_a = document.getElementById("settingField")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        displayDropdown("dropdownWeekDays");
    });
    (_b = document
        .getElementById("dropdownWeekDays")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function (weekDay) { }); // To be added, currently de-scoped
    (_c = document.getElementById("closeSettings")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
        var _a;
        settingsView.classList.toggle("notDisplayed");
        (_a = document
            .getElementById("dropdownSettings")) === null || _a === void 0 ? void 0 : _a.classList.toggle("notDisplayed");
    });
}
function eventViewTrigger() {
    resetEventCreationForm();
    var eventView = document.getElementById("event");
    eventView.classList.toggle("notDisplayed");
    var eventInputTitle = document.getElementById("title");
    eventInputTitle.focus();
}
function displayMonthName(currentDate) {
    var isPassingWeek = function () {
        var weekStartDate = new Date(currentDate);
        var weekEndDate = new Date(currentDate);
        weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());
        weekEndDate.setDate(weekEndDate.getDate() - weekEndDate.getDay() + 6);
        return weekStartDate.getDate() > weekEndDate.getDate();
    };
    var headerDateDisplay = "".concat(isPassingWeek()
        ? monthsShort[currentDate.getMonth()] +
            " - " +
            monthsShort[currentDate.getMonth() + 1]
        : monthsLong[currentDate.getMonth()], ", ").concat(currentDate.getFullYear());
    var monthDisplay = document.getElementById("monthDisplay");
    if (monthDisplay.innerText) {
        monthDisplay.innerText = headerDateDisplay;
    }
}
function displayCalendarMonth(currentDate) {
    var calendarMonthDisplay = (document.getElementById("calendarMonthDisplay"));
    calendarMonthDisplay.innerText =
        monthsLong[currentDate.getMonth()] + ", " + currentDate.getFullYear();
}
function displayDropdown(dropdown) {
    var dropdownField = document.getElementById(dropdown);
    if (dropdownField) {
        dropdownField.classList.toggle("notDisplayed");
        dropdownField.focus();
    }
}
function resetEventCreationForm() {
    var _a;
    formInputFieldList.forEach(function (elem) {
        var inputField = document.getElementById(elem);
        inputField.value = "";
    });
    var imgWithId = ((_a = document.getElementById("event")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("img")[0]);
    imgWithId.removeAttribute("id");
}
/* TYPESCRIPT TODO:

1.  TRANSPILE AS IS
2.  TYPES FOR PRIMITIVES
3.  CUSTOM TYPES
4.  ENUMS
5.  JSON SERVER
*/
