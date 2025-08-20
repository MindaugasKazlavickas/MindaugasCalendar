import { minToPxRatio } from "../consts";
import {
  PreprocessedEvent,
  BuiltEventCellProps,
  StoredEvent,
} from "../../../../utils/types";

function BuiltEventCell({ day, hour, events, onEdit }: BuiltEventCellProps) {
  const cellEvents = events.filter((e) => {
    const start =
      e.startHour * 60 +
      (e.event.startTime ? +e.event.startTime.slice(3, 5) : 0);
    const end = start + e.durationInMinutes;
    const cellStart = hour * 60;
    const cellEnd = cellStart + 60;
    return e.day === day && end > cellStart && start < cellEnd;
  });
  const styledEvents = setupOverlaps(cellEvents);

  return (
    <>
      {styledEvents.map((e) => (
        <EventCell
          key={e.event.id + "_" + e.day + "_" + e.startHour}
          event={e.event}
          durationInMinutes={e.durationInMinutes}
          startMin={+e.event.startTime.slice(3, 5)}
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

    const durationInMinutes = (endHour - startHour) * 60 + (endMin - startMin);

    const isSameDayEvent =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate();
    if (isSameDayEvent) {
      setupEvent.push({
        event,
        day: startDate.getDay(),
        startHour,
        durationInMinutes,
      });
    } else {
      const firstDayMins = 24 * 60 - (startHour * 60 + startMin);
      setupEvent.push({
        event,
        day: startDate.getDay(),
        startHour,
        durationInMinutes: firstDayMins,
      });
      const secondDayMins = durationInMinutes - firstDayMins;
      setupEvent.push({
        event,
        day: endDate.getDay(),
        startHour: 0,
        durationInMinutes: secondDayMins,
      });
    }
  });
  return setupEvent;
}

function setupOverlaps(eventsInCell: PreprocessedEvent[]) {
  return eventsInCell.map((event, id, array) => {
    let overlap = 0;
    array.forEach((item, i) => {
      if (id !== i) {
        const start1 = event.startHour * 60;
        const end1 = event.startHour * 60 + event.durationInMinutes;
        const start2 = item.startHour * 60;
        const end2 = item.startHour * 60 + item.durationInMinutes;
        if (end1 > start2 && start1 < end2) {
          overlap++;
        }
      }
    });
    const width = 95 - overlap * 10;
    const backgroundColor = `rgb(21, ${150 - overlap * 15}, ${
      227 - overlap * 30
    })`;
    return { ...event, width, backgroundColor };
  });
}

type EventCellProps = {
  event: StoredEvent;
  durationInMinutes: number;
  width?: number;
  backgroundColor?: string;
  startMin?: number;
  onEdit: (event: StoredEvent) => void;
};

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
