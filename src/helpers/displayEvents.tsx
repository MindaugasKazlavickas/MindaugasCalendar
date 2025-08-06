import { SERVER_URL } from "../consts/serverURL";
import apiRequest from "./sendAPIRequest";
import { StoredEvent } from "../consts/tsTypes";
import createDOMElement from "../components/renderers/createDOMElement";
import { openEditEventWindow } from "./handleEventForm";
export async function displayEvents(currentDate: Date) {
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

  const response = await apiRequest<StoredEvent[]>(thisWeekUrl(), "GET");

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
      Math.abs(+endTime.substr(0, 2) - +startTime.substr(0, 2)) * 60 +
      Math.abs(+endTime.substr(3, 2) - +startTime.substr(3, 2));
    const minToPxRatio: number = 1.25;
    const isSameDayEvent = (): boolean => {
      return startDate.getDate() === endDate.getDate();
    };
    const isLessThan24Hours = (): boolean => {
      const lastDayOfMonth = new Date(endDate.toString());
      lastDayOfMonth.setDate(0);
      return (
        (endDate.getDate() === startDate.getDate() + 1 &&
          endDate.getMonth() === startDate.getMonth()) ||
        startDate.getDate() === lastDayOfMonth.getDate()
      );
    };
    if (isSameDayEvent()) {
      eventDuration[i] = eventDuration[i] / minToPxRatio;
      sameDayEventRender(event, eventDuration[i]);
    } else if (isLessThan24Hours()) {
      eventDuration[i] = (24 * 60 - eventDuration[i]) / minToPxRatio;
      lessThan24HoursEvent(event, eventDuration[i]);
    }
  }
  checkOverlappingEvents(events, eventDuration);
}
export function clearEvents() {
  const displayedEvents = document.querySelectorAll<HTMLDivElement>(".meeting");
  displayedEvents.forEach((event) => {
    event.remove();
  });
}
function sameDayEventRender(event: StoredEvent, eventDuration: number) {
  const item = createDOMElement("div", ["meeting"], "");
  item.setAttribute("id", event.id.toString());
  item.innerText = event.startTime + "-" + event.endTime + " " + event.title;
  item.style.height = eventDuration + "px";
  const marginFromTop = +event.startTime.substr(3, 2) / 1.25;
  item.style.marginTop = marginFromTop + "px";
  const target = document.getElementById(
    new Date(event.startDate).getDay() +
      "_" +
      (+event.startTime.substr(0, 2) + 1)
  ) as HTMLTableCellElement;
  target.style.overflow = "visible";
  target.style.position = "relative";
  target.appendChild(item);

  item.addEventListener("click", () => {
    openEditEventWindow(event, event.id.toString());
  });
}

function lessThan24HoursEvent(event: StoredEvent, eventDuration: number) {
  const minToPxRatio = 1.25;
  const eventText = event.startTime + "-" + event.endTime + " " + event.title;
  eventDuration = eventDuration * minToPxRatio;
  const duration = [
    24 * 60 -
      (+event.startTime.substr(0, 2) * 60 + +event.startTime.substr(3, 2)),
    eventDuration -
      (24 * 60 -
        (+event.startTime.substr(0, 2) * 60 + +event.startTime.substr(3, 2))),
  ];
  for (let i = 0; i < 2; i++) {
    const item = createDOMElement("div", ["meeting"], "");
    item.setAttribute("id", event.id.toString());
    item.innerText = eventText;
    item.style.height = duration[i] / minToPxRatio + "px";

    const target = document.getElementById(
      i === 0
        ? new Date(event.startDate).getDay() +
            "_" +
            (+event.startTime.substr(0, 2) + 1)
        : new Date(event.endDate).getDay() + "_1"
    ) as HTMLTableCellElement;

    if (i === 0) {
      const marginFromTop = +event.startTime.substr(3, 2) / 1.25;
      item.style.marginTop = marginFromTop + "px";
    }
    target.style.overflow = "visible";
    target.style.position = "relative";
    target.appendChild(item);
    item.addEventListener("click", () => {
      openEditEventWindow(event, event.id.toString());
    });
  }
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
        events[i].id.toString() !== events[j].id.toString() &&
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
