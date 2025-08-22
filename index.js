
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
    createTimeframeListeners(currentDate);
    createCalendarListeners(currentDate);
    timeframeUpdate(currentDate, 0);
    displayCalendarMonth(currentDate);
});
function fillOutWeekDays(currentDate, offset) {
    var _a, _b, _c, _d;
    currentDate.setDate(currentDate.getDate() + offset);
    var date = new Date(currentDate);
    date.setDate(date.getDate() - date.getDay());
    for (var i = 0; i < 7; i++) {
        var weekDate = (document.getElementById("weekDisplayDate" + i));
        weekDate.innerText = date.getDate().toString();
        date.setDate(date.getDate() + 1);
    }
    var todayDate = new Date();
    if (offset === 0) {
        date = new Date(todayDate);
        (_b = (_a = document
            .getElementById("weekDisplayDate" + [todayDate.getDay()])) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.classList.add("weekViewGridHeaderMarked");
    }
    else {
        (_d = (_c = document
            .getElementById("weekDisplayDate" + [todayDate.getDay()])) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.classList.remove("weekViewGridHeaderMarked");
    }
    console.log(currentDate);
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
function apiHelper(url, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(payload),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (!response.ok) {
                        return [2 /*return*/, {
                                status: response.status,
                                data: data,
                                error: (data === null || data === void 0 ? void 0 : data.error) || "Failed to access API",
                            }];
                    }
                    return [2 /*return*/, {
                            status: response.status,
                            data: data,
                        }];
                case 3:
                    error_1 = _a.sent();
                    return [2 /*return*/, {
                            status: 500,
                            data: payload,
                            error: error_1.message,
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function saveEvent(currentDate) {
    return __awaiter(this, void 0, void 0, function () {
        var newEvent, inputStartDate, inputEndDate, inputStartTime, inputEndTime, inputTitle, inputGuests, inputLocation, inputDescription, startDate, endDate, startTime, endTime, title, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputStartDate = document.getElementById("startDate");
                    inputEndDate = document.getElementById("endDate");
                    inputStartTime = document.getElementById("startTime");
                    inputEndTime = document.getElementById("endTime");
                    inputTitle = document.getElementById("title");
                    inputGuests = document.getElementById("guests");
                    inputLocation = document.getElementById("location");
                    inputDescription = (document.getElementById("description"));
                    startDate = new Date(inputStartDate.value);
                    endDate = new Date(inputEndDate.value);
                    startTime = inputStartTime.value;
                    endTime = inputEndTime.value;
                    title = inputTitle.value;
                    if (title == "") {
                        alert("Title is mandatory.");
                        return [2 /*return*/];
                    }
                    else if (startDate == null ||
                        endDate == null ||
                        startTime == null ||
                        endTime == null) {
                        alert("Make sure to enter start and end time and date.");
                        return [2 /*return*/];
                    }
                    else if (startDate > endDate ||
                        (startDate == endDate && startTime > endTime)) {
                        alert("End time of event can not be before the start time.");
                        return [2 /*return*/];
                    }
                    newEvent = {
                        id: Date.now(),
                        title: title,
                        startDate: startDate.toString(),
                        startTime: startTime,
                        endDate: endDate.toString(),
                        endTime: endTime,
                        guests: inputGuests.value,
                        location: inputLocation.value,
                        description: inputDescription.value,
                    };
                    return [4 /*yield*/, apiHelper("http://localhost:3000/events", newEvent)];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        console.log("Error saving event: " + result.error);
                        return [2 /*return*/];
                    }
                    console.log("Event saved with ID: ", newEvent.id);
                    console.log(result.data);
                    //clearEvents();
                    //displayEvents(currentDate);
                    eventViewTrigger();
                    return [2 /*return*/];
            }
        });
    });
}
function deleteEvent() {
    console.log("Getting yeeted");
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
function clearEvents() {
    var keys = Object.keys(localStorage);
    for (var i = 0; i < keys.length; i++) {
        var displayedEvent = document.getElementById(keys[i]);
        if (displayedEvent != null) {
            displayedEvent.remove();
        }
    }
}
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
var monthsShort;
(function (monthsShort) {
    monthsShort[monthsShort["Jan"] = 0] = "Jan";
    monthsShort[monthsShort["Feb"] = 1] = "Feb";
    monthsShort[monthsShort["Mar"] = 2] = "Mar";
    monthsShort[monthsShort["Apr"] = 3] = "Apr";
    monthsShort[monthsShort["May"] = 4] = "May";
    monthsShort[monthsShort["Jun"] = 5] = "Jun";
    monthsShort[monthsShort["Jul"] = 6] = "Jul";
    monthsShort[monthsShort["Aug"] = 7] = "Aug";
    monthsShort[monthsShort["Sep"] = 8] = "Sep";
    monthsShort[monthsShort["Oct"] = 9] = "Oct";
    monthsShort[monthsShort["Nov"] = 10] = "Nov";
    monthsShort[monthsShort["Dec"] = 11] = "Dec";
})(monthsShort || (monthsShort = {}));
var monthsLong;
(function (monthsLong) {
    monthsLong[monthsLong["January"] = 0] = "January";
    monthsLong[monthsLong["February"] = 1] = "February";
    monthsLong[monthsLong["March"] = 2] = "March";
    monthsLong[monthsLong["April"] = 3] = "April";
    monthsLong[monthsLong["May"] = 4] = "May";
    monthsLong[monthsLong["June"] = 5] = "June";
    monthsLong[monthsLong["July"] = 6] = "July";
    monthsLong[monthsLong["August"] = 7] = "August";
    monthsLong[monthsLong["September"] = 8] = "September";
    monthsLong[monthsLong["October"] = 9] = "October";
    monthsLong[monthsLong["November"] = 10] = "November";
    monthsLong[monthsLong["December"] = 11] = "December";
})(monthsLong || (monthsLong = {}));
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
    var closeCalendarPanel = (document.getElementById("closeSidePanel"));
    var calendarSidePanel = (document.getElementById("calendarSideView"));
    var rightSidePanel = document.getElementById("rightSidePanel");
    var rightPanelTrigger = (document.getElementById("rightPanelChevron"));
    closeCalendarPanel.addEventListener("click", function () {
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
    var adjustMainDisplay = function (calendarPanel, rightPanel) {
        var calendarSideWidth = calendarPanel.classList.contains("notDisplayed")
            ? ""
            : "256px";
        var rightSideWidth = rightPanel.classList.contains("notDisplayed")
            ? ""
            : "56px";
        var contentGrid = document.getElementById("content");
        contentGrid.style.gridTemplateColumns =
            calendarSideWidth + " 1fr " + rightSideWidth;
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
    var deleteEventButton = (document.getElementById("deleteEventButton"));
    deleteEventButton.addEventListener("click", function () {
        deleteEvent();
        resetEventCreationForm();
        eventViewTrigger();
    });
}
function createTimeframeListeners(currentDate) {
    var nextTimeframe = (document.getElementById("nextTimeframe"));
    var previousTimeframe = (document.getElementById("previousTimeframe"));
    var headerTodayButton = (document.getElementById("headerTodayButton"));
    nextTimeframe.addEventListener("click", function () {
        timeframeUpdate(currentDate, 7);
    });
    previousTimeframe.addEventListener("click", function () {
        timeframeUpdate(currentDate, -7);
    });
    headerTodayButton.addEventListener("click", function () {
        timeframeUpdate((currentDate = new Date()), 0);
    });
}
function timeframeUpdate(currentDate, offset) {
    var checkNewMonth = new Date(currentDate);
    var isNewMonth = function () {
        return (currentDate.getMonth() !=
            checkNewMonth.setDate(currentDate.getDate() + offset));
    };
    fillOutWeekDays(currentDate, offset);
    //clearEvents();
    //displayEvents(currentDate);
    displayMonthName(currentDate);
    if (isNewMonth()) {
        fillOutMonthDays(currentDate);
        displayCalendarMonth(currentDate);
    }
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
        .getElementById("dropdownWeekDays")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function (weekDay) { });
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

=======
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
  workingDate.setDate(workingDate.getDate() + offset);
  displayMonthName(workingDate);
  fillOutMonthDays(workingDate);

  let date = new Date(workingDate);
  date.setDate(date.getDate() - date.getDay());
  clearEvents();
  console.log(date);
  displayEvents(date);
  for (let i = 0; i < 7; i++) {
    document.getElementById("weekDisplayDate" + i).innerText = date.getDate();

    date.setDate(date.getDate() + 1);
  }

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
  let calendarTBody = document
    .getElementById("calendarContainer")
    .getElementsByTagName("tbody")[0];
  for (let i = 0; i < 6; i++) {
    let calendarRow = calendarTBody.getElementsByClassName("calendarRow")[i];
    for (let j = 0; j < 7; j++) {
      let dayCell = calendarRow.getElementsByClassName("calendarCell")[j];
      dayCell.innerText = date.getDate();
      dayCell.removeAttribute("id");
      dayCell.setAttribute("id", date);
      const isTodayDate = () => {
        return (
          date.getDate() == new Date().getDate() &&
          date.getMonth() == new Date().getMonth()
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
      } else if (date.getMonth() != new Date().getMonth()) {
        dayCell.classList.remove("calendarCellSelected");
      }
      /*if (isDateSelected()) {
        dayCell.classList.add("calendarCellHighlighted");
      } else {
        dayCell.classList.remove("calendarCellHighlighted");
      }*/
      dayCell.classList.remove("calendarCellHighlighted");
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
  console.log(startOfWeekTime, endOfWeekTime);

  for (let i = 0; i < keys.length; i++) {
    let event = JSON.parse(localStorage.getItem(keys[i]));
    let startDate = new Date(event.startDate);
    let endDate = new Date(event.endDate);
    let startTime = event.startTime;
    let endTime = event.endTime;
    let eventDuration;
    let minToPxRatio = 1.25;
    const isSameDayEvent = () => {
      return startDate.getDate() === endDate.getDate();
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
