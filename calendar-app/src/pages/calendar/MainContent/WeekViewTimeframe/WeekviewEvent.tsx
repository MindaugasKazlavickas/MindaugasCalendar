import { minToPxRatio } from "../consts";
import {
  PreprocessedEvent,
  BuiltEventCellProps,
  StoredEvent,
  EventCellProps,
  StyledEvent,
} from "../../../../utils/types";
function BuiltEventCell({ day, hour, events, onEdit }: BuiltEventCellProps) {
  const dayEvents = events.filter((e) => e.day === day);
  const styledEvents = setupOverlaps(dayEvents);

  const cellEvents = styledEvents.filter((e) => e.startHour === hour);

  return (
    <>
      {cellEvents.map((e) => (
        <EventCell
          key={e.event.id + "_" + e.day + "_" + e.startHour}
          event={e.event}
          durationInMinutes={e.durationInMinutes}
          startMin={+e.startMin}
          width={e.width}
          backgroundColor={e.backgroundColor}
          onEdit={onEdit}
        />
      ))}
    </>
  );
}
export default BuiltEventCell;

export function preprocessEvents(events: StoredEvent[]): PreprocessedEvent[] {
  const setupEvent: PreprocessedEvent[] = [];
  events.forEach((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const startHour = +event.startTime.slice(0, 2);
    const startMin = +event.startTime.slice(3, 5);
    const endHour = +event.endTime.slice(0, 2);
    const endMin = +event.endTime.slice(3, 5);

    const isSameDayEvent =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate();
    if (isSameDayEvent) {
      const durationInMinutes =
        (endHour - startHour) * 60 + (endMin - startMin);
      setupEvent.push({
        event,
        day: startDate.getDay(),
        startHour,
        startMin,
        durationInMinutes,
      });
    } else {
      const firstDayMins = 24 * 60 - (startHour * 60 + startMin);
      const secondDayMins = endHour * 60 + endMin;
      setupEvent.push({
        event,
        day: startDate.getDay(),
        startHour,
        startMin,
        durationInMinutes: firstDayMins,
      });

      setupEvent.push({
        event,
        day: endDate.getDay(),
        startHour: 0,
        startMin: 0,
        durationInMinutes: secondDayMins,
      });
    }
  });
  return setupEvent;
}

function setupOverlaps(dayEvents: PreprocessedEvent[]): StyledEvent[] {
  const toMinutes = (e: PreprocessedEvent) => e.startHour * 60 + e.startMin;
  const endMinutes = (e: PreprocessedEvent) =>
    toMinutes(e) + e.durationInMinutes;

  const sortedEvents = [...dayEvents].sort(
    (a, b) => toMinutes(a) - toMinutes(b)
  );
  const styledEvents: StyledEvent[] = [];

  sortedEvents.forEach((sortedEvent) => {
    let overlapLevel = 0;
    let equalGroup: StyledEvent[] = [];

    styledEvents.forEach((placed) => {
      const overlap =
        endMinutes(sortedEvent) > toMinutes(placed) &&
        toMinutes(sortedEvent) < endMinutes(placed);

      if (overlap) {
        if (sortedEvent.durationInMinutes < placed.durationInMinutes) {
          overlapLevel = Math.max(overlapLevel, placed.overlapLevel + 1);
        } else if (sortedEvent.durationInMinutes === placed.durationInMinutes) {
          equalGroup.push(placed);
        }
      }
    });
    let width = 95;
    let leftOffset = 0;

    if (equalGroup.length > 0) {
      const equalCount = equalGroup.length + 1;
      width = 95 / equalCount;
      equalGroup.forEach((equalEvent, i) => {
        equalEvent.width = width;
        equalEvent.leftOffset = i * width;
      });
      leftOffset = equalGroup.length * width;
    } else {
      width = 95 - overlapLevel * 10;
    }
    styledEvents.push({
      ...sortedEvent,
      overlapLevel,
      width,
      leftOffset,
      backgroundColor: `rgb(21, ${150 - overlapLevel * 15}, ${
        227 - overlapLevel * 30
      })`,
    });
  });
  return styledEvents;
}

const EventCell: React.FC<EventCellProps> = ({
  event,
  durationInMinutes,
  width = 95,
  backgroundColor = "var(--primary-event)",
  startMin = 0,
  onEdit,
}) => (
  <div
    className="meeting"
    style={{
      height: `${durationInMinutes / minToPxRatio}px`,
      marginTop: `${startMin / minToPxRatio}px`,
      width: `${width}%`,
      backgroundColor: backgroundColor,
    }}
    onClick={() => onEdit(event)}
  >
    {`${event.startTime} - ${event.endTime} ${event.title}`}
  </div>
);
