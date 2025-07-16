
document.addEventListener('DOMContentLoaded', () => {
    let headerButton = "calendar active";
    let currentDay = new Date();

    const calendarSideView = document.getElementById('calendarSideView');
    const weekView = document.getElementById('weekView');
    const collapseButton = document.getElementById('collapseButton');
    const openEventWindow = document.getElementById('openEventWindow');
    const eventClose = document.getElementById('eventClose');

    collapseButton.addEventListener('click', () => {
        if (headerButton === "calendar active") {
            calendarSideView.style.display = 'none';
            weekView.style.width = '100%';
            headerButton = null;
        } else {
            calendarSideView.style.display = 'inline';
            weekView.style.width = '80%';
            headerButton = "calendar active";
        }
    })

    openEventWindow.addEventListener('click', () => {
        document.getElementById('event').style.display = 'grid';
        document.getElementById('event').style.gridTemplateColumns = '1fr 9fr';
    })

    eventClose.addEventListener('click', () => {
        eventWindowClear();
        document.getElementById('event').style.display = 'none';
    });

    const logoDate = document.getElementById('logoText');

    logoDate.innerText = currentDay.getDate();
    const monthDisplay = document.getElementById('monthDisplay');
    const calendarMonthDisplay = document.getElementById('calendarMonthDisplay');
    monthDisplay.innerText = monthsLong[currentDay.getMonth()] + ", " + currentDay.getFullYear();
    calendarMonthDisplay.innerText = monthDisplay.innerText;
    fillOutWeekDays(currentDay);
    document.getElementById('timezone').innerText = setTimezone();
    displayTable();

    /* CURRENTLY ONLY FOR CURRENT WEEK */
    
    fillOutMonthDays(currentDay);

    

    const eventSaveToStorage = document.getElementById('eventSaveButton');
    eventSaveToStorage.addEventListener('click', () => saveEvent());

    displayEvents();
});


const monthsShort = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"];
const monthsLong = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"];
const weekViewDisplayDates = [
    "weekDisplayDate1",
    "weekDisplayDate2",
    "weekDisplayDate3",
    "weekDisplayDate4",
    "weekDisplayDate5",
    "weekDisplayDate6",
    "weekDisplayDate7"
];

function fillOutWeekDays(currentDay) {
    for (let i = 0; i < 7; i++) {
        let weekDay = document.getElementById(weekViewDisplayDates[i]);
        weekDay.innerText =
            (i === 0 && i < currentDay.getDay()) ? currentDay.getDate() - currentDay.getDay() :
                (i < currentDay.getDay()) ? currentDay.getDate() - i :
                    (i === currentDay.getDay()) ? currentDay.getDate() :
                        currentDay.getDate() + (i - currentDay.getDay());
    }
    document.getElementById(weekViewDisplayDates[currentDay.getDay()])
        .parentElement.classList.add("weekViewGridHeaderMarked");
}

function fillOutMonthDays(currentDay) {
    let parentContainer = document.getElementById('calendarContainer');
    let saveDate = new Date(currentDay);
    let workingDate = new Date(currentDay.setDate(1));
    let valueDiff = -currentDay.getDay() + 1;
    workingDate.setDate(valueDiff);
    let turnoverStartingMonth = true;
    let workingMonth = workingDate.getMonth();

    for (let i = 0; i < 6; i++) {
        let calendarRow = document.createElement("div");
        calendarRow.classList.add('calendarDayRow');
        for (let j = 0; j < 7; j++) {
            let dayElement = document.createElement("p");
            dayElement.innerText = workingDate.getDate();
            dayElement.classList.add('calendarDayRowElement');

            if (workingDate.getDate() == saveDate.getDate()) {
                dayElement.classList.add('calendarDayRowElementSelected');
            }

            if (turnoverStartingMonth) {
                valueDiff = workingDate.getDate();
                turnoverStartingMonth = false;
            } else if (workingDate.getMonth() > workingMonth) {
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
    let eventIdentifier = "event";
    let eventTitle = document.getElementById('eventName').value;
    let startTime = document.getElementById('startTime').value;
    let startDate = document.getElementById('startDate').value;
    let endTime = document.getElementById('endTime').value;
    let endDate = document.getElementById('endDate').value;

    if (eventTitle == null || eventTitle == '') {
        alert("Title is mandatory.");
        return;

    } else if (
        startDate == '' || endDate == '' || startTime == '' || endTime == '') {
        alert("Make sure to enter start and end time and date.");
        return;
    } else if (
        startDate > endDate || startTime == endDate && startTime > endTime) {
        alert("End time of event can not be before the start time.");
        return;
    }
    let newEvent = {
        identifier: Date.now(),
        title: eventTitle,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        guests: document.getElementById('eventGuests').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
    }

    localStorage.setItem(eventIdentifier, JSON.stringify(newEvent));
    alert(localStorage.getItem(eventIdentifier, newEvent.location));
}

function eventWindowClear() {
    document.getElementById('eventName').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('eventGuests').value = '';
    document.getElementById('eventLocation').value = '';
    document.getElementById('eventDescription').value = '';
}

function displayTable() {
    let tableContainer = document.getElementById('weekGrid');
    let parentElement = tableContainer.getElementsByTagName('tbody')[0];

    for (let i = 0; i < 24; i++) {
        let tableRow = document.createElement("tr");
        tableRow.classList.add('weekViewGridRow');
        let dayTime = document.createElement("td");
        dayTime.classList.add("weekViewGridBox", "timeColumn");
        dayTime.innerText = 
        (i == 11) ? i + 1 + " PM" :  
        (i == 23) ? "" :
        (i < 12) ? i + 1 + " AM" : i + 1 - 12 + " PM";

        tableRow.appendChild(dayTime);
        let gap = document.createElement("td");
        gap.classList.add("weekViewGridBoxLeftMost");
        tableRow.appendChild(gap);
        for (let j = 0; j < 7; j++) {
            let tableElement = document.createElement("td");
            tableElement.classList.add("weekViewGridBox");
            tableElement.setAttribute("id", j + "_" + i);
            tableRow.appendChild(tableElement);
        }
        parentElement.appendChild(tableRow);
    }
}

function setTimezone() {

    return timezone = (new Date().getTimezoneOffset() === 0) ?
        "GMT" : (new Date().getTimezoneOffset() < 0) ?
            "GMT + " + (new Date().getTimezoneOffset()) / (-60) :
            "GMT - " + (new Date().getTimezoneOffset()) / (60);
}

function displayEvents(){
    let testItem = JSON.parse(localStorage.getItem('event'));
    let startTime = testItem.startTime;
    let endTime = testItem.endTime;
    let startDate = new Date(testItem.startDate);
    let item = document.createElement("div");
    item.classList.add("meetingExample");
    item.setAttribute("id", "eventas");
    let height = ( 
        (+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 + 
        (+endTime.substr(3, 2) - +startTime.substr(3, 2))
    )/1.25;
    item.innerText = startTime + "-" + endTime + " " + testItem.title;
    item.style.height = (height + "px");
    let target = document.getElementById(startDate.getDay()+ "_" + startTime.substr(0, 2));
    target.style.overflow = "visible";
    target.style.position = "relative";
    target.appendChild(item);
}