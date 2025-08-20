import { minToPxRatio } from "../consts";
import {
  PreprocessedEvent,
  BuiltEventCellProps,
  StoredEvent,
  EventCellProps,
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

function setupOverlaps(dayEvents: PreprocessedEvent[]) {
  const sortedEvents = [...dayEvents].sort(
    (a, b) => a.startHour * 60 + a.startMin - (b.startHour * 60 + b.startMin)
  );

  const results: (PreprocessedEvent & {
    width: number;
    backgroundColor: string;
  })[] = [];

  sortedEvents.forEach((sortedEvent, i) => {
    const start1 = sortedEvent.startHour * 60 + sortedEvent.startMin;
    const end1 = start1 + sortedEvent.durationInMinutes;

    const overlappingEvents = sortedEvents.filter((otherEvent) => {
      const start2 = otherEvent.startHour * 60 + otherEvent.startMin;
      const end2 = start2 + otherEvent.durationInMinutes;
      const eventOverlapsAnother = end1 > start2 && start1 < end2;
      return eventOverlapsAnother;
    });
    const overlapCount = overlappingEvents.length;
    const position = overlappingEvents.findIndex(
      (index) => index === sortedEvent
    );
    const width = 95 - overlapCount * 10;
    const backgroundColor = `rgb(21, ${150 - overlapCount * 15}, ${
      227 - overlapCount * 30
    })`;
    results.push({
      ...sortedEvent,
      width,
      backgroundColor,
    });
  });

  return results;
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
